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

modulum('TableHighlight4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableHighlight4STBehavior
     * @extends classes.BehaviorBase
     */
    cls.TableHighlight4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.TableHighlight4STBehavior.prototype */
      return {
        __name: "TableHighlight4STBehavior",

        usedStyleAttributes: ["highlightColor", "highlightCurrentCell", "highlightCurrentRow", "highlightTextColor"],
        watchedAttributes: {
          anchor: ['dialogType']
        },

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var tableNode = controller.getAnchorNode();
          if (widget) {
            var highlightColor = tableNode.getStyleAttribute("highlightColor");
            var highlightCurrentCell = tableNode.getStyleAttribute("highlightCurrentCell");
            var highlightCurrentRow = tableNode.getStyleAttribute("highlightCurrentRow");
            var highlightTextColor = tableNode.getStyleAttribute("highlightTextColor");
            var dialogType = tableNode.attribute("dialogType");

            if (widget.setHighlightColor && widget.setHighlightCurrentCell && widget.setHighlightCurrentRow && widget.setHighlightTextColor) {

              var hasFocusOnField = widget.hasFocusOnField();

              // Defines the highlight color of rows for the table, used for selected rows.
              widget.setHighlightColor(highlightColor);

              // Defines the highlighted text color of rows for the table, used for selected rows.
              widget.setHighlightTextColor(highlightTextColor);

              if (!highlightCurrentCell && hasFocusOnField) {
                highlightCurrentCell = "yes";
              }
              if (highlightCurrentCell && (dialogType === "InputArray" || hasFocusOnField)) {
                widget.setHighlightCurrentCell(this.isSAYesLike(highlightCurrentCell));
              }

              if (highlightCurrentRow === null) { //style is not specified
                if (dialogType === "DisplayArray" && !hasFocusOnField) {
                  // set highlightCurrentRow to true only in DisplayArray (and when focusOnField is false)
                  widget.setHighlightCurrentRow(true);
                } else {
                  widget.setHighlightCurrentRow(null);
                }
              } else { // style is specified
                widget.setHighlightCurrentRow(this.isSAYesLike(highlightCurrentRow));
              }
            }
          }
        }
      };
    });
  });
