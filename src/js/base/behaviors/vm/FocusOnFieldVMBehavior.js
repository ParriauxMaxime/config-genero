/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FocusOnFieldVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FocusOnFieldVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.FocusOnFieldVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.FocusOnFieldVMBehavior.prototype */
      return {
        __name: "FocusOnFieldVMBehavior",

        watchedAttributes: {
          anchor: ['focusOnField']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setInputMode) {
            var focusOnField = (controller.getAnchorNode().attribute('focusOnField') === 1);
            widget.setFocusOnField(focusOnField);
          }

        }
      };
    });
  });
