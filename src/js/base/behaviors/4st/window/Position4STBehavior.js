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

modulum('Position4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.Position4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.Position4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.Position4STBehavior.prototype */
      return {
        __name: "Position4STBehavior",

        usedStyleAttributes: ["position"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setPosition) {
            var pos = controller.getAnchorNode().getStyleAttribute('position');
            if (pos !== widget._position) {
              widget._position = pos;
              if (pos === "field") { // get ref field widget
                var previousId = controller.getUINode().previousAttribute("focus");
                var previousNode = controller.getUINode().getApplication().getNode(previousId);
                if (previousNode) {
                  pos = previousNode.getController().getWidget();
                }
              }
              widget.setPosition(pos);
            }
          }
        }
      };
    });
  });
