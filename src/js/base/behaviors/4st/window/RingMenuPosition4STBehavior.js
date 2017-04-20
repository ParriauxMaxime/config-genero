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

modulum('RingMenuPosition4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RingMenuPosition4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.RingMenuPosition4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.RingMenuPosition4STBehavior.prototype */
      return {
        __name: "RingMenuPosition4STBehavior",

        usedStyleAttributes: ["ringMenuPosition"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var menuNode = controller.getAnchorNode();

          var ringMenuPosition = menuNode.getStyleAttribute("ringMenuPosition");
          if (widget && widget.setActionPanelPosition) {
            if (!!ringMenuPosition) {
              widget.setActionPanelPosition(ringMenuPosition);
            } else {
              widget.setActionPanelPosition('right');
            }
          }
        }
      };
    });
  });
