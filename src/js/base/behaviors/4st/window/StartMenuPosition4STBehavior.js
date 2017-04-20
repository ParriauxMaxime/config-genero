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

modulum('StartMenuPosition4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.StartMenuPosition4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.StartMenuPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.StartMenuPosition4STBehavior.prototype */
      return {
        __name: "StartMenuPosition4STBehavior",

        usedStyleAttributes: ["startMenuPosition"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var node = controller.getAnchorNode();

          var type = node.getStyleAttribute("startMenuPosition");
          if (widget && widget.setStartMenuType) {
            if (type) {
              widget.setStartMenuType(type);
            }
          }
        }
      };
    });
  });
