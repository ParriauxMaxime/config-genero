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

modulum('WindowTitleVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.WindowTitleVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.WindowTitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.WindowTitleVMBehavior.prototype */
      return {
        __name: "WindowTitleVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'text']
        },

        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var text = anchorNode.attribute('text');
          var name = anchorNode.attribute('name');
          controller.getWidget().getSidebarWidget().setWindowName(text || name);
        }
      };
    });
  });
