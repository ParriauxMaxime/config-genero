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

modulum('CanvasPolygonWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.CanvasPolygonWidget
     * @extends classes.WidgetBase
     */
    cls.CanvasPolygonWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.CanvasPolygonWidget.prototype */
      return {
        __name: "CanvasPolygonWidget",

        /** @lends classes.CanvasPolygonWidget */
        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
          this._element.on('click.CanvasPolygonWidget', cls.WidgetBase._onClick.bind(this));
          this._element.on('contextmenu.CanvasPolygonWidget', cls.WidgetBase._onRightClick.bind(this));
        },

        destroy: function() {
          this._element.off("click.CanvasPolygonWidget");
          this._element.off("contextmenu.CanvasPolygonWidget");
          $super.destroy.call(this);
        },

        setParameters: function(points) {
          var pointsStr = "";
          for (var i = 0; i < points.length; i = i + 2) {
            if (i !== 0) {
              pointsStr += ' ';
            }
            pointsStr += points[i + 1] + ',' + points[i];
          }
          this._element.setAttribute('points', pointsStr);
        },

        setColor: function(color) {
          this._element.setAttribute('fill', color);
        }
      };
    });
    cls.WidgetFactory.register('CanvasPolygon', cls.CanvasPolygonWidget);
  }
);
