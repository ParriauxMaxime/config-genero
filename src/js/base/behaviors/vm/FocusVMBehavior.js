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

modulum('FocusVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FocusVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.FocusVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.FocusVMBehavior.prototype */
      return {
        __name: "FocusVMBehavior",

        watchedAttributes: {
          ui: ['focus']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var uiNode = controller.getAnchorNode();
          var focusedNodeId = uiNode.attribute('focus');
          if (focusedNodeId > 0) {
            var node = uiNode.getApplication().getNode(focusedNodeId);
            if (node) {
              var ctrl = node.getController();
              if (ctrl) {
                ctrl.ensureVisible();
              }
            }
          }
        }
      };
    });
  });
