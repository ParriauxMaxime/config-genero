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

modulum('PlaceholderVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.PlaceholderVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.PlaceholderVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.PlaceholderVMBehavior.prototype */
      return {
        __name: "PlaceholderVMBehavior",

        watchedAttributes: {
          decorator: ['placeholder']
        },

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setPlaceHolder) {
            var decoratorNode = controller.getNodeBindings().decorator;
            if (decoratorNode && decoratorNode.isAttributesSetByVM('placeholder')) {
              var placeholder = decoratorNode.attribute('placeholder');
              widget.setPlaceHolder(placeholder);
            }
          }
        },

      };
    });
  });
