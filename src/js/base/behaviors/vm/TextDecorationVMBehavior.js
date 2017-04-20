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

modulum('TextDecorationVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextDecorationVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TextDecorationVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TextDecorationVMBehavior.prototype */
      return {
        __name: "TextDecorationVMBehavior",

        watchedAttributes: {
          anchor: ['underline'],
          decorator: ['underline']
        },

        usedStyleAttributes: ["textDecoration"],

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setTextDecoration) {
            var bindings = controller.getNodeBindings();
            var underlineNode = null;
            if (bindings.anchor.isAttributesSetByVM('underline')) {
              underlineNode = bindings.anchor;
            } else if (bindings.decorator) {
              if (bindings.decorator.isAttributesSetByVM('underline')) {
                underlineNode = bindings.decorator;
              }
            }
            if (underlineNode) {
              var underline = underlineNode.attribute('underline') === 1;
              widget.setTextDecoration(underline ? "underline" : null);
            } else {
              var textDeco = controller.getAnchorNode().getStyleAttribute('textDecoration');
              widget.setTextDecoration(textDeco);
            }
          }
        }
      };
    });
  });
