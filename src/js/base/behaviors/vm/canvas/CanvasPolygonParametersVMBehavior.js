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

modulum('CanvasPolygonParametersVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.CanvasPolygonParametersVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CanvasPolygonParametersVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CanvasPolygonParametersVMBehavior.prototype */
      return {
        __name: "CanvasPolygonParametersVMBehavior",

        SPACES_RE: /\s+/,

        watchedAttributes: {
          anchor: ['xyList']
        },

        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var xyList = node.attribute('xyList').split(this.SPACES_RE);
          controller.getWidget().setParameters(xyList);
        }
      };
    });
  });
