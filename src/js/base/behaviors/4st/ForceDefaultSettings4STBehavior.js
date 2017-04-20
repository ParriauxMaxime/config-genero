/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ForceDefaultSettings4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ForceDefaultSettings4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.ForceDefaultSettings4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.ForceDefaultSettings4STBehavior.prototype */
      return {
        __name: "ForceDefaultSettings4STBehavior",

        usedStyleAttributes: ["forceDefaultSettings"],

        _apply: function(controller, data) {
          controller.forceDefaultSettings = this.isSAYesLike(controller.getAnchorNode().getStyleAttribute('forceDefaultSettings'));
        }
      };
    });
  });
