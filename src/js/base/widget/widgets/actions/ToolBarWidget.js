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

modulum('ToolBarWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ToolBar widget.
     * @class classes.ToolBarWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ToolBarWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ToolBarWidget.prototype */
      return {
        __name: "ToolBarWidget",
        _scroller: null,

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._scroller = new cls.ScrollTabDecorator(this);
        },

        /**
         * Priority of this toolbar
         * @param {number} order
         */
        setOrder: function(order) {
          this.setStyle({
            order: order
          });
        },

        /**
         * @returns {number} priority of this toolbar
         */
        getOrder: function() {
          return this.getStyle('order');
        },

        setButtonTextHidden: function(state) {
          if (state) {
            this.getElement().addClass("buttonTextHidden");
          } else {
            this.getElement().removeClass("buttonTextHidden");
          }
        },

        destroy: function() {
          if (this._scroller) {
            this._scroller.destroy();
            this._scroller = null;
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.register('ToolBar', cls.ToolBarWidget);
  });
