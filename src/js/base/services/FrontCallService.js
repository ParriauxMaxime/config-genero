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

modulum('FrontCallService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.FrontCallService
     */
    gbc.FrontCallService = context.oo.StaticClass( /** @lends gbc.FrontCallService */ {
      __name: "FrontCallService",
      /**
       * list of available front call modules
       * @type {Object}
       * */
      modules: {},
      /**
       * currently running front call
       * @type {classes.NodeBase}
       * */
      _functionCallNode: null,
      init: function() {
        var lowerCasedModules = {};
        var moduleNames = Object.keys(this.modules);
        for (var i = 0; i < moduleNames.length; ++i) {
          var moduleName = moduleNames[i];
          var module = this.modules[moduleName];
          var functionNames = Object.keys(module);
          var lowerCasedModule = {};
          lowerCasedModules[moduleName.toLowerCase()] = lowerCasedModule;
          for (var j = 0; j < functionNames.length; ++j) {
            var functionName = functionNames[j];
            lowerCasedModule[functionName.toLowerCase()] = module[functionName];
          }
        }
        this.modules = lowerCasedModules;
      },

      hasModule: function(module) {
        return !!this.modules[module.toLowerCase()];
      },

      hasFrontCall: function(module, name) {
        var moduleItem = this.modules[module.toLowerCase()];
        if (!!moduleItem) {
          return !!moduleItem[name.toLowerCase()];
        } else {
          return false;
        }
      },

      registerFrontCall: function(type) {}
    });
    gbc.InitService.register(gbc.FrontCallService);
  });
