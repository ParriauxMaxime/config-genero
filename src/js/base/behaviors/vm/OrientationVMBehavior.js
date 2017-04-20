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

modulum('OrientationVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OrientationVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.OrientationVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.OrientationVMBehavior.prototype */
      return {
        __name: "OrientationVMBehavior",

        watchedAttributes: {
          decorator: ['orientation']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setOrientation) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var orientation = decoratorNode.attribute('orientation');
            widget.setOrientation(orientation);

            if (widget.__name === "SliderWidget") {
              var node = controller.getAnchorNode();
              var layoutService = node.getApplication().layout;
              layoutService.afterLayout(function() {
                widget.setOrientation(orientation, true);
              }.bind(this));
            }

          }
        }
      };
    });
  });
