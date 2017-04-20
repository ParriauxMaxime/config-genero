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

modulum('OnActionUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OnActionUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnActionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnActionUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnActionUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.actionHandle = controller.getWidget().when(cls.WebComponentWidget.actionEvent, this._onAction.bind(this,
              controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.actionHandle) {
            data.actionHandle();
            data.actionHandle = null;
          }
        },
        /**
         * Creates an action event and sends it to the VM
         */
        _onAction: function(controller, data, event, src, actionName) {
          var node = controller.getAnchorNode();
          node.getApplication().action.executeByName(actionName);
        }
      };
    });
  });
