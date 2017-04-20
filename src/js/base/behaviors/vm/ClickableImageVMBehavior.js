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

modulum('ClickableImageVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ClickableImageVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ClickableImageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ClickableImageVMBehavior.prototype */
      return {
        __name: "ClickableImageVMBehavior",

        watchedAttributes: {
          decorator: ['action', "actionActive"],
          anchor: ['action', "actionActive"]
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setClickableImage) {
            var imgNode = controller.getNodeBindings().decorator || controller.getNodeBindings().anchor;
            if (imgNode.isAttributesSetByVM('action') && imgNode.isAttributesSetByVM('actionActive')) {
              widget.setClickableImage(imgNode.attribute("action") && imgNode.attribute("actionActive"));
            }
          }
        }
      };
    });
  });
