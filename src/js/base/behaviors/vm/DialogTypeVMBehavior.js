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

modulum('DialogTypeVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the switch of widget by controller
     * @class classes.DialogTypeVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.DialogTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DialogTypeVMBehavior.prototype */
      return {
        __name: "DialogTypeVMBehavior",

        watchedAttributes: {
          container: ['dialogType', 'active']
        },

        _apply: function(controller, data) {
          if (!!controller && controller.changeWidgetKind) {
            var containerNode = controller.getNodeBindings().container;
            var dialogType = containerNode.attribute('dialogType');
            var active = containerNode.attribute('active') === 1;
            return controller.changeWidgetKind(dialogType, active); // return true to force apply of next behaviors
          }
          return false;
        }
      };
    });
  });
