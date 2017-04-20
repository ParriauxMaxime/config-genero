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

modulum('DaysOff4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DaysOff4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.DaysOff4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.DaysOff4STBehavior.prototype */
      return {
        __name: "DaysOff4STBehavior",

        usedStyleAttributes: ["daysOff"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDisabledDays) {
            var daysOff = controller.getAnchorNode().getStyleAttribute('daysOff');
            widget.setDisabledDays(daysOff);
          }
        }
      };
    });
  });
