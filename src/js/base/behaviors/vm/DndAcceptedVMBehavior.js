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

modulum('DndAcceptedVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DndAcceptedVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.DndAcceptedVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DndAcceptedVMBehavior.prototype */
      return {
        __name: "DndAcceptedVMBehavior",

        watchedAttributes: {
          anchor: ['dndAccepted', 'dndIdRef']
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {*} data
         */
        setup: function(controller, data) {
          data.count = 0;
        },
        /**
         *
         */
        _apply: function(controller, data) {
          var dndAccepted = controller.getAnchorNode().attribute('dndAccepted');
          // to avoid flickering, ignore first dndAccepted return by the VM just after the DragStart event
          if (data.count > 0) {
            context.DndService.dndAccepted = dndAccepted;
          } else {
            context.DndService.dndAccepted = false;
          }
          data.count++;
        }
      };
    });
  });
