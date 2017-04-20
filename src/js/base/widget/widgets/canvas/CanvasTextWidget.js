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

modulum('CanvasTextWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.CanvasTextWidget
     * @extends classes.WidgetBase
     */
    cls.CanvasTextWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.CanvasTextWidget.prototype */
      return {
        __name: "CanvasTextWidget",

        /** @lends classes.CanvasTextWidget */
        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "text");
          this._element.on('click.CanvasTextWidget', cls.WidgetBase._onClick.bind(this));
          this._element.on('contextmenu.CanvasTextWidget', cls.WidgetBase._onRightClick.bind(this));
        },

        destroy: function() {
          this._element.off("click.CanvasTextWidget");
          this._element.off("contextmenu.CanvasTextWidget");
          $super.destroy.call(this);
        },

        setParameters: function(canvasWidth, canvasHeight, x, y, xTextAnchor, yTextAnchor, text) {
          this._element.setAttribute('x', '0');
          switch (yTextAnchor) {
            case 'start':
              this._element.setAttribute('y', '1.25ex');
              break;
            case 'middle':
              this._element.setAttribute('y', '.5ex');
              break;
            case 'end':
              this._element.setAttribute('y', '-.25ex');
              break;
          }
          this._element.setAttribute('text-anchor', xTextAnchor);
          this._element.textContent = text;
          var sx = canvasWidth !== 0 ? 1000 / canvasWidth : 0;
          var sy = canvasHeight !== 0 ? -1000 / canvasHeight : 0;
          this._element.setAttribute("transform", "matrix(" + sx + " 0 0 " + sy + " " + x + " " + y + ")");
        },

        setColor: function(color) {
          this._element.setAttribute('fill', color);
        }
      };
    });
    cls.WidgetFactory.register('CanvasText', cls.CanvasTextWidget);
  }
);
