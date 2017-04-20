/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

/**
 * @param w {Window}
 */
(function(w) {
  var modules = [];
  var resolvedModules = 0;
  var loadedModules = {};
  var injection = [];
  var loadModule = function(module) {
    module.exec.apply(w, injection);
  };
  var resolve = function() {
    var moduleIndex = 0;
    for (;;) {
      if (moduleIndex >= modules.length) {
        break;
      }
      var module = modules[moduleIndex];
      if (module) {
        var dependencyIndex = 0;
        for (;;) {
          if (!module.after || dependencyIndex >= module.after.length) {
            break;
          }
          var dependency = module.after[dependencyIndex];
          if (dependency && loadedModules[dependency]) {
            module.after[dependencyIndex] = null;
            module.dependencyResolved++;
          }
          dependencyIndex++;

        }
        if (module.after.length === module.dependencyResolved) {
          loadedModules[module.id] = true;
          loadModule(module);
          modules[moduleIndex] = null;
          resolvedModules++;
        } else {
          moduleIndex++;
        }
      } else {
        moduleIndex++;
      }
    }
  };
  var error = function() {
    var errorPad = document.createElement('div');
    errorPad.style.position = 'absolute';
    errorPad.style.top = 0;
    errorPad.style.left = 0;
    errorPad.style.background = '#F88';
    errorPad.style.padding = '5px';
    errorPad.style.border = 'solid 3px #F00';
    errorPad.style.fontFamily = 'monospace';
    errorPad.style.color = 'white';

    var contents = ["<div>Modulum.js</div><div>----------</div><div>Cyclic dependency detected</div>"];
    for (var i = 0; i < modules.length; i++) {
      contents.push("<div>" + modules[i].id + " depends on [" + modules[i].after.join(", ") + "]</div>");
    }
    errorPad.innerHTML = contents.join("");
    document.body.appendChild(errorPad);
  };
  var checkLoadedDependencies = function(module) {
    var result = true;
    var deps = module.after,
      i = 0,
      len = deps.length;
    for (; i < len; i++) {
      if (!!deps[i] && !loadedModules[deps[i]]) {
        result = false;
        break;
      } else {
        deps[i] = null;
        module.dependencyResolved++;
      }
    }
    return result;
  };
  w.modulum = function(module, dependencies, exec) {
    if (!exec) {
      exec = dependencies;
      dependencies = null;
    }
    var mod = {
      id: module,
      after: dependencies,
      exec: exec,
      dependencyResolved: 0
    };
    if (!mod.after || checkLoadedDependencies(mod)) {
      loadedModules[mod.id] = true;
      loadModule(mod);
      modules.push(null);
      resolvedModules++;
    } else {
      modules.push(mod);
    }
  };
  w.modulum.inject = function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    injection = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9];
  };
  w.modulum.assemble = function() {
    var loaded = resolvedModules;
    while (loaded < modules.length) {
      resolve();
      if (loaded === resolvedModules) {
        error();
        throw "cyclic dependencies";
      }
      loaded = resolvedModules;
    }
  };
})(window);
