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

modulum('MultiRowSelectionVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MultiRowSelectionVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.MultiRowSelectionVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.MultiRowSelectionVMBehavior.prototype */
      return {
        __name: "MultiRowSelectionVMBehavior",

        watchedAttributes: {
          anchor: ['multiRowSelection']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var tableWidget = controller.getWidget();
          if (tableWidget && tableWidget.setMultiRowSelectionEnabled) {
            var anchorNode = controller.getAnchorNode();
            tableWidget.setMultiRowSelectionEnabled(anchorNode.attribute('multiRowSelection') !== 0);
          }
        }
      };
    });
  });
