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

modulum('InitService',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.InitService
     */
    context.InitService = context.oo.StaticClass( /** @lends gbc.InitService */ {
      __name: "InitService",
      _builtinActionDefaultsKeys: ['enter', 'esc', 'f3', 'ctrl+f3', 'f4', 'f1', 'alt+f4', 'ctrl+f', 'ctrl+g', 'tab', 'shift+tab',
        'down', 'up', 'home', 'end', 'pageup', 'pagedown', 'ctrl+tab', 'ctrl+shift+tab'
      ],

      _services: [],

      _eventListener: new cls.EventListener(),

      create: function(auiData, app) {
        app = app || context.MockService.fakeApplication();
        var node = gbc.classes.NodeFactory.createRecursive(null, auiData, app);
        node.createController();
        return node;
      },
      register: function(service) {
        this._services.push(service);
      },
      record: function() {
        context.keyboard.onKey(this._whenKeyboard.bind(this));
      },
      _whenKeyboard: function(sequence) {
        var currentApp = context.SessionService.getCurrent() && context.SessionService.getCurrent().getCurrentApplication();
        if (currentApp) {
          var appWidget = currentApp.getUI().getWidget();
          if (appWidget) {
            var ui = appWidget._uiWidget;
            if (ui && !ui.isTypeaheadActive()) {
              // if we have an actiondefault bound to the sequence or if there is active node bound to SendAllKeyVMBehavior
              // if it's the case, we send the keys to VM
              if (this._builtinActionDefaultsKeys.indexOf(sequence) !== -1 || (currentApp && currentApp.hasActiveKeyEventNode())) {
                sequence = cls.ActionApplicationService.convertBrowserKeyToVMKey(sequence);
                var isModifier = cls.KeyboardHelper.isModifier(sequence);
                if (!isModifier) {
                  this._sendEvent(sequence);
                }
              }
            }
          }
        }
      },
      _sendEvent: function(sequence) {
        var currentApp = context.SessionService.getCurrent().getCurrentApplication();
        if (currentApp) {
          context.SessionService.getCurrent().getCurrentApplication().event(new cls.VMKeyEvent(sequence));
        }
      },
      initServices: function() {
        document.addEventListener("visibilitychange", function() {
          this.emit(context.constants.widgetEvents.visibilityChange);
        }.bind(this));
        this.record();
        for (var i = 0; i < this._services.length; i++) {
          this._services[i].init();
        }
      },
      _id: {
        default_: 0
      },

      destroy: function() {
        if (context.SessionService.getCurrent()) {
          var currentApp = context.SessionService.getCurrent().getCurrentApplication();
          if (currentApp) {
            currentApp.close();
          }
        }
      },

      uniqueId: function(prefix) {
        if (!!prefix && !this._id[prefix]) {
          this._id[prefix] = 0;
        }
        return (prefix || "") + (++this._id[prefix || "default_"]);
      },

      emit: function(eventName) {
        this._eventListener.emit(eventName);
      },
      when: function(eventName, hook) {
        return this._eventListener.when(eventName, hook);
      }

    });
  });
