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

modulum('SessionEndWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.SessionEndWidget
     * @extends classes.WidgetBase
     */
    cls.SessionEndWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.SessionEndWidget.prototype */
      return {
        __name: "SessionEndWidget",
        /** @lends classes.SessionEndWidget */
        $static: {
          restartEvent: "g_restart"
        },
        _closeApplicationEnd: null,
        _restartApp: null,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._closeApplicationEnd = this._element.getElementsByClassName("closeApplicationEnd")[0];
          this._restartApp = this._element.getElementsByClassName("restartApp")[0];
          this._closeApplicationEnd.on("click.SessionEndWidget", this._onClose.bind(this));
          this._restartApp.on("click.SessionEndWidget", this._onRestart.bind(this));
        },

        _initLayout: function() {
          // no layout
        },

        destroy: function() {
          this._closeApplicationEnd.off("click.SessionEndWidget");
          this._restartApp.off("click.SessionEndWidget");
          $super.destroy.call(this);
        },
        _onClose: function() {
          this.emit(context.constants.widgetEvents.close);
        },
        _onRestart: function() {
          this.emit(cls.SessionEndWidget.restartEvent);
        },
        showSessionActions: function() {
          var elements = this._element.getElementsByClassName("from-session") || [];
          for (var i = 0; i < elements.length; i++) {
            elements[i].removeClass("hidden");
          }
        },
        showUAActions: function() {
          this._element.getElementsByClassName("from-ua")[0].removeClass("hidden");
        },
        setHeader: function(message) {
          this._element.getElementsByClassName("mt-card-header-text")[0].innerHTML = message;
        },
        setMessage: function(message) {
          var messageElt = this._element.getElementsByClassName("message")[0];
          messageElt.removeClass("hidden");
          messageElt.innerHTML = message;
        },
        setSessionID: function(id) {
          this._element.getElementsByClassName("session")[0].removeClass("hidden");
          this._element.getElementsByClassName("sessionID")[0].textContent = id;
        },
        setSessionLinks: function(base, session) {
          this._element.querySelector(".uaLink>a").setAttribute("href", base + "/monitor/log/uaproxy-" + session);
          this._element.querySelector(".vmLink>a").setAttribute("href", base + "/monitor/log/vm-" + session);
          if (!context.DebugService.isActive()) {
            this._element.querySelector(".uaLink").style.display = 'none';
            this._element.querySelector(".vmLink").style.display = 'none';
          }
        },
        setAuiLogUrl: function(session, file) {
          this._element.querySelector(".auiLink>a").setAttribute("download", "auiLog-" + session + ".log");
          this._element.querySelector(".auiLink>a").setAttribute("href", "file");
        }
      };
    });
    cls.WidgetFactory.register('SessionEnd', cls.SessionEndWidget);
  });
