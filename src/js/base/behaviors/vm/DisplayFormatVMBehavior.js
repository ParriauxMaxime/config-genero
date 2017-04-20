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

modulum('DisplayFormatVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.IsPasswordBehavior
     * @extends classes.BehaviorBase
     */
    cls.DisplayFormatVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DisplayFormatVMBehavior.prototype */
      return {
        __name: "DisplayFormatVMBehavior",

        watchedAttributes: {
          container: ['keyboardHint', 'varType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDisplayFormat) {
            var containerNode = controller.getNodeBindings().container;
            if (containerNode) {
              var varType = containerNode.attribute('varType');
              widget.setDisplayFormat(varType);
            }
          }
        }
      };
    });
  });
