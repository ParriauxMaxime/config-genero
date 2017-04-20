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

modulum('UnmovableVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.UnmovableVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.UnmovableVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.UnmovableVMBehavior.prototype */
      return {
        __name: "UnmovableVMBehavior",

        watchedAttributes: {
          anchor: ['unmovable'],
          parent: ['unmovableColumns']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var columnWidget = controller.getWidget();
          if (columnWidget && columnWidget.setMovable) {
            var anchorNode = controller.getAnchorNode();
            var parentNode = anchorNode.getParentNode();
            columnWidget.setMovable(anchorNode.attribute('unmovable') === 0 && parentNode.attribute('unmovableColumns') === 0);
          }
        }
      };
    });
  });
