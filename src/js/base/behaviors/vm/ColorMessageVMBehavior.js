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

modulum('ColorMessageVMBehavior', ['ColorVMBehavior'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ColorMessageVMBehavior
     * @extends classes.ColorVMBehavior
     */
    cls.ColorMessageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ColorMessageVMBehavior.prototype */
      return {
        __name: "ColorMessageVMBehavior",

        watchedAttributes: {
          anchor: ['color', 'reverse', 'type']
        },

        /**
         * Applies the color only if it has been defined by the VM, use default value otherwise.
         */
        _apply: function(controller, data) {
          var messageNode = controller.getAnchorNode();
          var kind = messageNode.attribute('type') === 'error' ? 'error' : 'message';
          var color = messageNode.getStyleAttribute("textColor", [kind]);
          if (color) {
            controller.getWidget().setColor(color);
          } else {
            if (messageNode.isAttributesSetByVM('color')) {
              cls.ColorVMBehavior._apply(controller, data);
            } else {
              controller.getWidget().setColor("");
            }
          }
        }
      };
    });
  });
