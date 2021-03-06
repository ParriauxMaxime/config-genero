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

modulum('TableHeader4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableType4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.TableHeader4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.TableHeader4STBehavior.prototype */
      return {
        __name: "TableHeader4STBehavior",

        usedStyleAttributes: ["headerHidden", "headerAlignment"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          if (widget) {
            var headerHidden = tableNode.getStyleAttribute("headerHidden");
            var headerAlignment = tableNode.getStyleAttribute("headerAlignment");
            if (widget.setHeaderHidden && widget.setHeaderAlignment) {
              if (headerHidden) {
                widget.setHeaderHidden(this.isSAYesLike(headerHidden));
              }
              if (headerAlignment) {
                if (headerAlignment === "default") {
                  headerAlignment = "left"; // default is left
                }
                widget.setHeaderAlignment(headerAlignment);
              }
            }
          }
        }
      };
    });
  });
