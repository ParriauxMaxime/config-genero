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

modulum('ApplicationHostMenuWindowCloseWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuWindowCloseWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuWindowCloseWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuWindowCloseWidget.prototype */
      return {
        __name: "ApplicationHostMenuWindowCloseWidget",
        _activated: false,
        _processing: false,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuWindowCloseWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._element.off("click.ApplicationHostMenuWindowCloseWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          if (!this._processing) {
            this.emit(context.constants.widgetEvents.click);
          }
        },
        setActive: function(active) {
          this._active = active;
          this._element.toggleClass("gbc_Invisible", !active);
        },
        onClick: function(hook) {
          return this.when(context.constants.widgetEvents.click, hook);
        },
        _setProcessingStyle: function(processing) {
          this._processing = !!processing;
          if (this._element) {
            if (processing) {
              this._element.setAttribute("processing", "processing");
            } else {
              this._element.removeAttribute("processing");
            }
          }
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostWindowCloseMenu', cls.ApplicationHostMenuWindowCloseWidget);
  });
