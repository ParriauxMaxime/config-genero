/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('DefaultTTFColor4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DefaultTTFColor4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.DefaultTTFColor4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.DefaultTTFColor4STBehavior.prototype */
      return {
        __name: "DefaultTTFColor4STBehavior",

        usedStyleAttributes: ["defaultTTFColor"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDefaultColor) {
            var color = controller.getAnchorNode().getStyleAttribute('defaultTTFColor');
            widget.setDefaultColor(color);
          }
        }
      };
    });
  });
