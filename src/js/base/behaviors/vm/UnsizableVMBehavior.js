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

modulum('UnsizableVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.UnsizableVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.UnsizableVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.UnsizableVMBehavior.prototype */
      return {
        __name: "UnsizableVMBehavior",

        watchedAttributes: {
          anchor: ['unsizable'],
          parent: ['unsizableColumns']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var columnWidget = controller.getWidget();
          if (columnWidget && columnWidget.setSizable) {
            var anchorNode = controller.getAnchorNode();
            var parentNode = anchorNode.getParentNode();
            columnWidget.setSizable(anchorNode.attribute('unsizable') === 0 && parentNode.attribute('unsizableColumns') === 0);
          }
        }
      };
    });
  });
