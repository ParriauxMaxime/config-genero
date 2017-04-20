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

modulum('FieldButtonEnabledVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Handles the enabled / disabled state of a button included in a field (ex. ButtonEdit)
     * @class classes.FieldButtonEnabledVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.FieldButtonEnabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.FieldButtonEnabledVMBehavior.prototype */
      return {
        __name: "FieldButtonEnabledVMBehavior",

        watchedAttributes: {
          container: ['active'],
          decorator: ['actionActive']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setButtonEnabled) {
            var bindings = controller.getNodeBindings();
            var isEnabled = bindings.container.attribute('active') === 1 &&
              bindings.decorator.attribute('actionActive') === 1;
            widget.setButtonEnabled(isEnabled);
          }
        }
      };
    });
  });
