/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('CanvasCircleParametersVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.CanvasCircleParametersVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CanvasCircleParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CanvasCircleParametersVMBehavior.prototype */
      return {
        __name: "CanvasCircleParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'diameter']
        },

        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var diameter = node.attribute('diameter');
          var radius = diameter / 2;
          controller.getWidget().setParameters(startX + radius, startY - radius, Math.abs(radius));
        }
      };
    });
  });
