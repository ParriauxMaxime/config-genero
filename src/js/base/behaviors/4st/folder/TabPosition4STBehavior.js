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

modulum('TabPosition4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TabPosition4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.TabPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.TabPosition4STBehavior.prototype */
      return {
        __name: "TabPosition4STBehavior",

        usedStyleAttributes: ["position"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setTabPosition) {
            var pos = controller.getAnchorNode().getStyleAttribute('position');
            if (pos) {
              widget.setTabPosition(pos);
            } else {
              widget.setTabPosition('top');
            }
          }
        }
      };
    });
  });
