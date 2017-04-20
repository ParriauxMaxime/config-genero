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

modulum('ColorVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ColorVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ColorVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ColorVMBehavior.prototype */
      return {
        __name: "ColorVMBehavior",

        usedStyleAttributes: ["textColor"],

        watchedAttributes: {
          anchor: ['color', 'reverse'],
          decorator: ['color', 'reverse']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setColor) {
            var bindings = controller.getNodeBindings();
            var colorNode = bindings.anchor;

            if (bindings.decorator && !bindings.anchor.isAttributesSetByVM('color')) {
              colorNode = bindings.decorator;
            }

            var isReverse = colorNode.attribute('reverse') === 1;
            var color = null;
            if (!isReverse && colorNode.isAttributesSetByVM('color')) {
              color = colorNode.attribute('color');
              // Weird choice but what is white should be black if not reverse on modern UI
              if (color === 'white') {
                color = 'black';
                if (bindings.container && bindings.container.getTag() === "TableColumn") {
                  return;
                }
              }
              widget.setColor(this._resolveThemedColor(color));
            } else {
              color = controller.getAnchorNode().getStyleAttribute('textColor');
              if (color) {
                color = this._resolveThemedColor(color);
              }
              widget.setColor(color);
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
