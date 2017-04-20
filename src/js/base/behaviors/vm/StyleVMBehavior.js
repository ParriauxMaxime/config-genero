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

modulum('StyleVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.StyleVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.StyleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.StyleVMBehavior.prototype */
      return {
        /** @lends classes.StyleVMBehavior */
        __name: "StyleVMBehavior",

        watchedAttributes: {
          anchor: ['style'],
          decorator: ['style']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var bindings = controller.getNodeBindings();
          var styleNode = bindings.decorator ? bindings.decorator : bindings.anchor;
          if (widget) {
            var style = styleNode.attribute('style');
            if (style !== undefined) {
              widget.setApplicationStyles(style);
            }
          }
          styleNode.updateApplicableStyles();
          controller.setStyleBasedBehaviorsDirty();
        }
      };
    });
  });
