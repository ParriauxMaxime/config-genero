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

modulum('CanvasLineWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.CanvasLineWidget
     * @extends classes.WidgetBase
     */
    cls.CanvasLineWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.CanvasLineWidget.prototype */
      return {
        __name: "CanvasLineWidget",

        /** @lends classes.CanvasLineWidget */
        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "line");
          this._element.on('click.CanvasLineWidget', cls.WidgetBase._onClick.bind(this));
          this._element.on('contextmenu.CanvasLineWidget', cls.WidgetBase._onRightClick.bind(this));
          this._element.setAttribute('stroke-width', "2px");
        },

        destroy: function() {
          this._element.off("click.CanvasLineWidget");
          this._element.off("contextmenu.CanvasLineWidget");
          $super.destroy.call(this);
        },

        setParameters: function(x1, y1, x2, y2) {
          this._element.setAttribute('x1', x1);
          this._element.setAttribute('y1', y1);
          this._element.setAttribute('x2', x2);
          this._element.setAttribute('y2', y2);
        },

        setColor: function(color) {
          this._element.setAttribute('stroke', color);
        }
      };
    });
    cls.WidgetFactory.register('CanvasLine', cls.CanvasLineWidget);
  }
);
