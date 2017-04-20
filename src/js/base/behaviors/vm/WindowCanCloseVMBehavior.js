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

modulum('WindowCanCloseVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.WindowCanCloseVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.WindowCanCloseVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.WindowCanCloseVMBehavior.prototype */
      return {
        /** @type {string} */
        __name: "WindowCanCloseVMBehavior",

        watchedAttributes: {
          anchor: ['active']
        },

        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var windowWidget = anchorNode.getAncestor('Window').getController().getWidget();
          if (windowWidget && windowWidget.setClosable) {
            var activeValue = anchorNode.attribute('active');
            windowWidget.setClosable(activeValue);
          }
        }
      };
    });
  });
