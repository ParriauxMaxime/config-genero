/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

module.exports = function(grunt) {

  var fs = require("fs");
  var path = require("path");

  function jsonToScss(keysOnly, data, oPath) {
    if (data && typeof data === 'object') {
      if (data.__import) {
        var imp = data.__import;
        delete data.__import;
        if (!path.isAbsolute(imp)) {
          imp = path.resolve(oPath, imp);
        }
        if (!/\.scss\.json$/.test(imp)) {
          imp += ".scss.json";
        }
        var fileContents = fs.readFileSync(imp, {
          encoding: "utf8"
        });
        var idata = {};
        try {
          idata = JSON.parse(fileContents);
        } catch (e) {
          grunt.log.error("Malformed json file : " + imp);
        }
        Object.keys(data).forEach(k => idata[k] = data[k]);
        return jsonToScss(keysOnly, idata, path.dirname(imp));
      }
      if (keysOnly) {
        return Object.keys(data);
      }

      var depsRegex = /\$[a-zA-Z0-9_-]+/g,
        text, token,
        dependencies = {},
        keys = Object.keys(data),
        resolving = keys.slice(0),
        idx = 0;
      keys.forEach(item => {
        text = data[item];
        dependencies[item] = [];
        token = depsRegex.exec(text);
        while (!!token) {
          dependencies[item].push(token[0]);
          token = depsRegex.exec(text);
        }
      });

      keys = [];
      while (resolving.length) {
        var res = true;
        while (dependencies[resolving[idx]].length && res) {
          if ((keys.indexOf(dependencies[resolving[idx]][0].substr(1)) > -1) || (resolving.indexOf(dependencies[resolving[idx]][0].substr(
              1)) < 0)) {
            dependencies[resolving[idx]].splice(0, 1);
          } else {
            res = false;
          }
        }
        if (!dependencies[resolving[idx]].length) {
          keys.push(resolving[idx]);
          resolving.splice(idx, 1);
          idx = 0;
        } else {
          idx++;
        }

        if (resolving.length && idx >= resolving.length) {
          throw "Error in variables resolution";
        }
      }

      return keys.map(key => "$" + key + ":" + data[key] + ";").join("\n");
    }
    return "";
  }
  return {
    jsonToScss: jsonToScss.bind(null, false),
    jsonToScssKeys: jsonToScss.bind(null, true),
    scssJsonImporter: function(url, file, done) {
      var fixedVariablesFile = path.join(process.cwd(), 'src/sass/variables.scss.json'),
        jsonfile;
      try {
        var fpath = grunt.__gbcOptions.compile.customization ?
          path.join(process.cwd(), grunt.__gbcOptions.compile.customization + "/theme.scss.json") :
          fixedVariablesFile;
        fs.accessSync(fpath, fs.R_OK);
        jsonfile = fpath;
      } catch (e) {
        jsonfile = fixedVariablesFile;
      }
      if (!grunt.__gbcOptions.compile.customization) {
        if (url.indexOf("__CUSTOMIZATION_ENTRY_POINT__") >= 0) {
          done({
            contents: ""
          });
          return;
        }
        if (url.indexOf("__CUSTOMIZATION_SCSS_VARIABLES__") >= 0) {
          done({
            contents: ""
          });
          return;
        }
      }
      var localUrl = url
        .replace("__CUSTOMIZATION_SCSS_VARIABLES__", "../../" + grunt.__gbcOptions.compile.customization + "/sass/customVariables")
        .replace("__CUSTOMIZATION_ENTRY_POINT__", "../../" + grunt.__gbcOptions.compile.customization + "/sass/customization")
        .replace("__VARIABLES__", jsonfile);
      if (!/\.(scss|json)$/.test(path.basename(localUrl))) {
        localUrl = localUrl + ".scss";
      }
      var fullPath = path.resolve(path.dirname(file), localUrl);
      var localDone = function(result) {
        if (/\.json$/.test(path.basename(fullPath))) {
          try {
            var fileContents = fs.readFileSync(fullPath, {
              encoding: "utf8"
            });
            var data = "{}";
            try {
              data = JSON.parse(fileContents);
              if (/theme\.scss\.json$/.test(fullPath)) {
                data.__import = fixedVariablesFile;
              }
            } catch (e) {
              grunt.log.error("Malformed json file : " + fullPath);
            }
            var contents = jsonToScss(false, data, path.dirname(fullPath));
            done({
              contents: contents
            });
          } catch (e) {
            console.log(e);
            done({
              contents: ""
            });
          }
        } else {
          done(result);
        }
      };
      try {
        fs.accessSync(fullPath, fs.R_OK);
        localDone({
          file: localUrl
        });
      } catch (e) {
        fullPath = path.resolve(path.dirname(fullPath), '_' + path.basename(fullPath));
        try {
          fs.accessSync(fullPath, fs.R_OK);
          localDone({
            file: localUrl
          });
        } catch (e) {
          done({
            contents: ""
          });
        }
      }
    }
  };
};
