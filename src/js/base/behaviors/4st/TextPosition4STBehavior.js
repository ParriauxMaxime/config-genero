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

modulum('TextPosition4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextPosition4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.TextPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.TextPosition4STBehavior.prototype */
      return {
        __name: "TextPosition4STBehavior",

        usedStyleAttributes: ["toolBarTextPosition"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.getElement) {
            var format = controller.getAnchorNode().getStyleAttribute('toolBarTextPosition');
            var element = widget.getElement();
            if (element) {
              if (format === "textBesideIcon") {
                element.addClass("flex-row");
              } else {
                element.removeClass("flex-row");
              }
            }
          }
        }
      };
    });
  });
