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

modulum('ApplicationHostMenuRunInGwcWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuRunInGwcWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuRunInGwcWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuRunInGwcWidget.prototype */
      return {
        __name: "ApplicationHostMenuRunInGwcWidget",
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuRunInGwcWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          this._element.off("click.ApplicationHostMenuRunInGwcWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          window.open(window.location.href.replace("/ua/r/", "/wa/r/"));
        },
        activate: function(active) {
          var session = context.SessionService.getCurrent(),
            sessionInfo = session && session.info(),
            sessionServerVersion = sessionInfo && sessionInfo.serverVersion;
          if (cls.ServerHelper.compare(sessionServerVersion || context.bootstrapInfo.serverVersion, "GAS/3.10.00") < 0) {
            this._element.toggleClass("debugActivated", active);
          }
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostMenuRunInGwc', cls.ApplicationHostMenuRunInGwcWidget);
  });
