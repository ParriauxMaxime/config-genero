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

modulum('ButtonTypeSTBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ButtonTypeSTBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.ButtonTypeSTBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.ButtonTypeSTBehavior.prototype */
      return {
        __name: "ButtonTypeSTBehavior",

        usedStyleAttributes: ["buttonType"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setButtonType) {
            var buttonType = controller.getAnchorNode().getStyleAttribute('buttonType');
            if (buttonType) {
              widget.setButtonType(buttonType);
            }
          }
        }
      };
    });
  });
