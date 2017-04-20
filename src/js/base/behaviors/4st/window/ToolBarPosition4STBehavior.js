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

modulum('ToolBarPosition4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ToolBarPosition4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.ToolBarPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.ToolBarPosition4STBehavior.prototype */
      return {
        __name: "ToolBarPosition4STBehavior",

        usedStyleAttributes: ["toolBarPosition"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tbNode = controller.getAnchorNode();

          var tbPosition = tbNode.getStyleAttribute("toolBarPosition");
          if (widget && widget.setToolBarPosition) {
            if (tbPosition) {
              widget.setToolBarPosition(tbPosition);
            } else {
              widget.setToolBarPosition('top');
            }
          }
        }
      };
    });
  });
