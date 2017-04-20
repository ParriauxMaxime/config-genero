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

modulum('FontWeightVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FontWeightVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.FontWeightVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.FontWeightVMBehavior.prototype */
      return {
        __name: "FontWeightVMBehavior",

        watchedAttributes: {
          anchor: ['bold'],
          decorator: ['bold']
        },

        usedStyleAttributes: ["fontWeight"],

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setFontWeight) {
            var bindings = controller.getNodeBindings();
            var boldNode = null;
            if (bindings.anchor.isAttributesSetByVM('bold')) {
              boldNode = bindings.anchor;
            } else if (bindings.decorator && bindings.decorator.isAttributesSetByVM('bold')) {
              boldNode = bindings.decorator;
            }
            if (boldNode) {
              var bold = boldNode.attribute('bold') === 1;
              widget.setFontWeight(bold ? "bold" : null);
            } else {
              var fontWeight = controller.getAnchorNode().getStyleAttribute('fontWeight');
              widget.setFontWeight(fontWeight);
            }
          }
        }
      };
    });
  }
);
