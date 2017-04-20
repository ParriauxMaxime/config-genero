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

modulum('MockService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.MockService
     */
    context.MockService = context.oo.StaticClass( /** @lends gbc.MockService */ {
      __name: "MockService",
      _init: false,
      init: Function.noop,

      fakeApplication: function(forUnit) {
        if (!this._init) {
          this._init = true;
          context.HostService.wrapGlobalErrors();
          context.LogService.registerLogProvider(new cls.ConsoleLogProvider(), "networkProtocol");
          context.LogService.registerLogProvider(new cls.BufferedConsoleLogProvider(), null);
          gbc.start();
        }
        var currentSession = context.SessionService.getCurrent();
        if (forUnit) {
          if (currentSession) {
            currentSession.destroy(true);
            currentSession = null;
          }
        }
        var params = {
          mode: "no"
        };
        var newApp = null;
        if (!currentSession) {
          newApp = context.SessionService.start("fake", params).getCurrentApplication();
        } else {
          currentSession.start("fake", params);
          newApp = currentSession.getCurrentApplication();
        }
        return newApp;
      }
    });
    context.InitService.register(context.MockService);
  });
