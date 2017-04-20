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

modulum('ActionEnabledVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.HiddenVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ActionEnabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ActionEnabledVMBehavior.prototype */
      return {
        __name: "ActionEnabledVMBehavior",

        watchedAttributes: {
          anchor: ['active'],
          parent: ['active']
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();
          var activeValue = bindings.anchor.attribute('active');
          var parentActiveValue = bindings.parent.attribute('active');

          // enable/disable accelerators
          var appService = bindings.anchor.getApplication().getActionApplicationService();
          if (activeValue && parentActiveValue) {
            appService.registerAction(bindings.anchor);
          } else {
            appService.destroyAction(bindings.anchor);
          }
        },

        destroy: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var actionService = anchorNode.getApplication().getActionApplicationService();
          actionService.destroyAction(anchorNode);
          $super.destroy.call(this, controller, data);
        }
      };
    });
  });
