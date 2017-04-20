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

modulum('ScrollBarsVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ScrollBarsVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ScrollBarsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ScrollBarsVMBehavior.prototype */
      return {
        __name: "ScrollBarsVMBehavior",

        watchedAttributes: {
          decorator: ['scrollbars']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setSrollBars) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var scollBars = decoratorNode.attribute('scrollbars');
            var horizontal = false;
            var vertical = false;

            if (scollBars && scollBars.toLowerCase() === "both") {
              horizontal = true;
              vertical = true;
            } else if (scollBars && scollBars.toLowerCase() === "horizontal") {
              horizontal = true;
            } else if (scollBars && scollBars.toLowerCase() === "vertical") {
              vertical = true;
            }
            widget.setSrollBars(horizontal, vertical);
          }
        }
      };
    });
  });
