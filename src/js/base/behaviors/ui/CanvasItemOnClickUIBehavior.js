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

modulum('CanvasItemOnClickUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CanvasItemOnClickUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.CanvasItemOnClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.CanvasItemOnClickUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "CanvasItemOnClickUIBehavior",

        anchor: ['acceleratorKey1', 'acceleratorKey3'],

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.clickHandle = controller.getWidget().when(gbc.constants.widgetEvents.click, this._onClick.bind(this, controller,
              false));
            data.rightClickHandle = controller.getWidget().when(gbc.constants.widgetEvents.rightClick, this._onClick.bind(this,
              controller, true));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
          if (data.rightClickHandle) {
            data.rightClickHandle();
            data.rightClickHandle = null;
          }
        },

        _apply: function(controller) {
          var anchorNode = controller.getAnchorNode();
          if (!anchorNode.attribute('acceleratorKey1') && !anchorNode.attribute('acceleratorKey3')) {
            controller.getWidget().addClass("gbc_noPointerEvents");
          }
        },

        _onClick: function(controller, isRightClick) {
          var anchorNode = controller.getAnchorNode();

          var acceleratorKey = null;
          if (!isRightClick) {
            acceleratorKey = anchorNode.attribute('acceleratorKey1');
            // Left mouse button
          } else {
            // Right mouse button
            acceleratorKey = anchorNode.attribute('acceleratorKey3');
          }
          if (acceleratorKey) {
            var app = anchorNode.getApplication();
            var uiNode = app.uiNode();
            var isProcessing = uiNode.attribute("runtimeStatus") === "processing";
            if (!isProcessing) {
              var vmEvent = new cls.VMKeyEvent(acceleratorKey, anchorNode.getId());
              app.event(vmEvent);
            }
          }
        }
      };
    });
  }
);
