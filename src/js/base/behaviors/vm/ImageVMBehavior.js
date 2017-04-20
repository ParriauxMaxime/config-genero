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

modulum('ImageVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ImageVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ImageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ImageVMBehavior.prototype */
      return {
        __name: "ImageVMBehavior",

        watchedAttributes: {
          anchor: ['image'],
          decorator: ['image']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setImage) {
            var bindings = controller.getNodeBindings();
            var imageNode = null;
            if (bindings.decorator && bindings.decorator.isAttributePresent('image')) {
              imageNode = bindings.decorator;
            } else {
              imageNode = bindings.anchor;
            }
            var image = imageNode.attribute('image');
            widget.setImage(image);
          }
        }
      };
    });
  }
);
