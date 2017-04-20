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

modulum('EnabledButtonVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's 'enabled' state
     * @class classes.EnabledButtonVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.EnabledButtonVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.EnabledButtonVMBehavior.prototype */
      return {
        __name: "EnabledButtonVMBehavior",

        watchedAttributes: {
          anchor: ['active', 'actionActive'],
          ui: ['runtimeStatus']
        },

        /**
         * Sets the widget 'enabled' or  'disabled' depending on the AUI tree state.
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          var anchorNode = controller.getAnchorNode();
          var uiNode = anchorNode.getApplication().uiNode();

          var isInterrupt = anchorNode.attribute("name") === "interrupt";
          var isProcessing = uiNode.attribute("runtimeStatus") === "processing";

          if (!!widget && widget.setEnabled) {
            var hidden = false;
            var activeValue = anchorNode.attribute('active');
            if (anchorNode.getParentNode().attribute("style") === "popup") {
              hidden = !activeValue;
            }

            if (anchorNode.isAttributePresent('actionActive')) {
              activeValue = activeValue || anchorNode.attribute('actionActive');
            }

            var enabled = activeValue === 1;
            if (isInterrupt) {
              enabled = isInterrupt && isProcessing;
            }

            widget.setEnabled(enabled);

            //hide it if menu popup
            if (hidden && widget.setHidden) {
              widget.setHidden(hidden);
            }
          }
        }
      };
    });
  });
