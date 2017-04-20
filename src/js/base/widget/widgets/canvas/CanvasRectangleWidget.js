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

modulum('CanvasRectangleWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.CanvasRectangleWidget
     * @extends classes.WidgetBase
     */
    cls.CanvasRectangleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.CanvasRectangleWidget.prototype */
      return {
        __name: "CanvasRectangleWidget",

        /** @lends classes.CanvasRectangleWidget */
        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          this._element.on('click.CanvasRectangleWidget', cls.WidgetBase._onClick.bind(this));
          this._element.on('contextmenu.CanvasRectangleWidget', cls.WidgetBase._onRightClick.bind(this));
        },

        destroy: function() {
          this._element.off("click.CanvasRectangleWidget");
          this._element.off("contextmenu.CanvasRectangleWidget");
          $super.destroy.call(this);
        },

        setParameters: function(x, y, width, height) {
          this._element.setAttribute('x', x);
          this._element.setAttribute('y', y);
          this._element.setAttribute('width', width);
          this._element.setAttribute('height', height);
        },

        setColor: function(color) {
          this._element.setAttribute('fill', color);
        }
      };
    });
    cls.WidgetFactory.register('CanvasRectangle', cls.CanvasRectangleWidget);
  }
);
