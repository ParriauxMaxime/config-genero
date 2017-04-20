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

modulum('TextVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TextVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TextVMBehavior.prototype */
      return {
        __name: "TextVMBehavior",

        watchedAttributes: {
          anchor: ['text'],
          decorator: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var bindings = controller.getNodeBindings();
            var textNode = bindings.decorator && bindings.decorator.isAttributesSetByVM('text') ? bindings.decorator : bindings.anchor;
            var text = textNode.attribute('text');
            widget.setText(text);
          }
        }
      };
    });
  });
