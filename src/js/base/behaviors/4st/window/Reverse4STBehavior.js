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

modulum('Reverse4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.Reverse4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.Reverse4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.Reverse4STBehavior.prototype */
      return {
        __name: "Reverse4STBehavior",

        usedStyleAttributes: ["reverse"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setReverse) {
            var reverse = controller.getUINode().getStyleAttribute('reverse');
            widget.setReverse(this.isSAYesLike(reverse));
          }
        }
      };
    });
  });
