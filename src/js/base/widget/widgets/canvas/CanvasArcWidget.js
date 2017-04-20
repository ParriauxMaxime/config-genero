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

modulum('CanvasArcWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.CanvasArcWidget
     * @extends classes.WidgetBase
     */
    cls.CanvasArcWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.CanvasArcWidget.prototype */
      return {
        __name: "CanvasArcWidget",

        /** @lends classes.CanvasArcWidget */
        _initElement: function() {
          this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
          this._element.on('click.CanvasArcWidget', cls.WidgetBase._onClick.bind(this));
          this._element.on('contextmenu.CanvasArcWidget', cls.WidgetBase._onRightClick.bind(this));
        },

        destroy: function() {
          this._element.off("click.CanvasArcWidget");
          this._element.off("contextmenu.CanvasArcWidget");
          $super.destroy.call(this);
        },

        setParameters: function(startX, startY, diameter, startDegrees, extentDegrees) {
          var startAngle = (extentDegrees >= 0 ? startDegrees : startDegrees + extentDegrees) * Math.PI / 180;
          var endAngle = (extentDegrees >= 0 ? startDegrees + extentDegrees : startDegrees) * Math.PI / 180;

          var d2 = diameter / 2;
          var r = Math.abs(d2);
          var cx = startX + d2;
          var cy = startY - d2;

          var x1 = cx + r * Math.cos(startAngle);
          var y1 = cy + r * Math.sin(startAngle);
          var x2 = cx + r * Math.cos(endAngle);
          var y2 = cy + r * Math.sin(endAngle);

          var largeArcFlag = Math.abs(extentDegrees) < 180 ? 0 : 1;

          var d = "M " + cx + " " + cy + " " +
            "L " + x1 + " " + y1 + " " +
            "A " + r + " " + r + " 0 " + largeArcFlag + " 1 " + x2 + " " + y2 + " " +
            "Z";

          this._element.setAttribute('d', d);
        },

        setColor: function(color) {
          this._element.setAttribute('fill', color);
        }
      };
    });
    cls.WidgetFactory.register('CanvasArc', cls.CanvasArcWidget);
  }
);
