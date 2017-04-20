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

modulum('InterruptUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.InterruptUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.InterruptUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.InterruptUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "InterruptUIBehavior",

        _attachWidget: function(controller, data) {
          var node = controller.getAnchorNode();
          if (node.attribute('name') === 'interrupt') {
            var widget = controller.getWidget();
            if (!!widget) {
              widget.setInterruptable(true);
              data.actionHandle = widget.when(gbc.constants.widgetEvents.click, this._onAction.bind(this, controller, data));
            }
          }
        },

        _detachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            widget.setInterruptable(false);
          }
          if (this.actionHandle) {
            this.actionHandle();
            this.actionHandle = null;
          }
        },
        /**
         * Creates an action event and sends it to the VM
         */
        _onAction: function(controller, data, event, src, actionName) {
          controller.getAnchorNode().getApplication().interrupt();
        }
      };
    });
  });
