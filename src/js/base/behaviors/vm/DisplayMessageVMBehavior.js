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

modulum('DisplayMessageVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DisplayMessageVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.DisplayMessageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DisplayMessageVMBehavior.prototype */
      return {
        __name: "DisplayMessageVMBehavior",

        watchedAttributes: {
          anchor: ['count']
        },

        /**
         * Re-applies all controller's behaviors as all messages share the same widget
         */
        _apply: function(controller, data) {
          if (!data.isApplying) {
            data.isApplying = true;
            controller.applyBehaviors(null, true);
            controller.getWidget().setHidden(false);
            data.isApplying = false;
          }
        }
      };
    });
  });
