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

modulum('CurrentWindowVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CurrentWindowVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CurrentWindowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CurrentWindowVMBehavior.prototype */
      return {
        __name: "CurrentWindowVMBehavior",

        watchedAttributes: {
          anchor: ['currentWindow']
        },
        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCurrentWindowId) {
            var currentWindowId = controller.getAnchorNode().attribute('currentWindow');
            widget.setCurrentWindowId(currentWindowId);
          }
        }
      };
    });
  });
