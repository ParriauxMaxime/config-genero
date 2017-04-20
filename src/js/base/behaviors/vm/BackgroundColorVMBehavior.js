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

modulum('BackgroundColorVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.BackgroundColorVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.BackgroundColorVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.BackgroundColorVMBehavior.prototype */
      return {
        __name: "BackgroundColorVMBehavior",

        usedStyleAttributes: ["backgroundColor"],

        watchedAttributes: {
          anchor: ['color', 'reverse'],
          decorator: ['color', 'reverse'],
          container: ['dialogType', 'currentRow', 'offset']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setBackgroundColor) {
            var bindings = controller.getNodeBindings();
            var colorNode = bindings.anchor;
            if (bindings.container && bindings.container.getTag() === "TableColumn") { // TABLE case
              widget.setBackgroundColor(null);
              widget.getParentWidget().setBackgroundColor(null);
              var dialogType = bindings.container.attribute("dialogType");
              if (dialogType === "Display" || dialogType === "DisplayArray") {
                widget = widget.getParentWidget();
              }
            } else if (bindings.container && bindings.container.getTag() === "Matrix") { // MATRIX case
              var currentRow = bindings.container.attribute("currentRow");
              var offset = bindings.container.attribute("offset");
              var size = bindings.container.attribute("size");
              if (currentRow < size && currentRow - offset === bindings.anchor.getIndex()) {
                widget.setBackgroundColor(null); // current highlight color is the background color
                return;
              }
            }
            if (bindings.decorator && !bindings.anchor.isAttributesSetByVM('color')) {
              colorNode = bindings.decorator;
            }

            var isReverse = colorNode.attribute('reverse') === 1;
            var color = null;
            if (isReverse && colorNode.isAttributesSetByVM('color')) {
              color = colorNode.attribute('color');
              if (color === "white") {
                color = gbc.constants.theme["gbc-field-disabled-background-color"];
              }
              widget.setBackgroundColor(this._resolveThemedColor(color));
            } else {
              color = controller.getAnchorNode().getStyleAttribute('backgroundColor');
              if (color) {
                color = color.trim();
                widget.setBackgroundColor(this._resolveThemedColor(color));
              } else {
                widget.setBackgroundColor(isReverse ? "lightgrey" : null);
              }
            }
          }
        },

        _resolveThemedColor: function(color) {
          var themedColor = gbc.constants.theme["gbc-genero-" + color];
          if (!!themedColor) {
            return themedColor;
          } else {
            return color;
          }
        }
      };
    });
  });
