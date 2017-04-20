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

modulum('ShowEditToolBox4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ShowEditToolBox4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.ShowEditToolBox4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.ShowEditToolBox4STBehavior.prototype */
      return {
        __name: "ShowEditToolBox4STBehavior",

        usedStyleAttributes: ["showEditToolBox"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.showEditToolBox) {
            var show = controller.getAnchorNode().getStyleAttribute('showEditToolBox');
            if (show !== "auto") {
              show = this.isSAYesLike(show) ? "show" : "hide";
            }
            widget.showEditToolBox(show);
          }
        }
      };
    });
  });
