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

modulum('CanvasLineParametersVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.CanvasLineParametersVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CanvasLineParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CanvasLineParametersVMBehavior.prototype */
      return {
        __name: "CanvasLineParametersVMBehavior",

        watchedAttributes: {
          anchor: ['startX', 'startY', 'endX', 'endY']
        },

        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var startX = node.attribute('startX');
          var startY = node.attribute('startY');
          var endX = node.attribute('endX');
          var endY = node.attribute('endY');

          controller.getWidget().setParameters(startX, startY, endX, endY);
        }
      };
    });
  });
