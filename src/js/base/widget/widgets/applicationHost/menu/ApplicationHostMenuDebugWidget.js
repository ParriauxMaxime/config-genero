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

modulum('ApplicationHostMenuDebugWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuDebugWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuDebugWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuDebugWidget.prototype */
      return {
        __name: "ApplicationHostMenuDebugWidget",
        constructor: function(opts) {
          $super.constructor.call(this, opts);
          context.DebugService.registerDebugUi(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuDebugWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          context.DebugService.unregisterDebugUi(this);
          this._element.off("click.ApplicationHostMenuDebugWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          context.DebugService.show();
        },
        activate: function(active) {
          this._element.toggleClass("debugActivated", active);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostDebugMenu', cls.ApplicationHostMenuDebugWidget);
  });
