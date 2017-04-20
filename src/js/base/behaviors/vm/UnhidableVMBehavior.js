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

modulum('UnhidableVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.UnhidableVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.UnhidableVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.UnhidableVMBehavior.prototype */
      return {
        __name: "UnhidableVMBehavior",

        watchedAttributes: {
          anchor: ['unhidable'],
          parent: ['unhidableColumns']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var columnWidget = controller.getWidget();
          if (columnWidget && columnWidget.setUnhidable) {
            var anchorNode = controller.getAnchorNode();
            var parentNode = anchorNode.getParentNode();
            columnWidget.setUnhidable(anchorNode.attribute('unhidable') !== 0 || parentNode.attribute('unhidableColumns') !== 0);
          }
        }
      };
    });
  });
