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

modulum('NotNullVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.NotNullVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.NotNullVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.NotNullVMBehavior.prototype */
      return {
        __name: "NotNullVMBehavior",

        watchedAttributes: {
          container: ['notNull', 'dialogType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setNotNull) {
            var containerNode = controller.getNodeBindings().container;
            var notNull = containerNode.attribute('notNull');

            if (notNull && containerNode.attribute('dialogType') === "Construct") {
              notNull = false;
            }
            widget.setNotNull(notNull);
          }
        }
      };
    });
  });
