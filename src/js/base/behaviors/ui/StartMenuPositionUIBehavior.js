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

modulum('StartMenuPositionUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the switch of widget by controller
     * @class classes.StartMenuPositionUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.StartMenuPositionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.StartMenuPositionUIBehavior.prototype */
      return {
        __name: "StartMenuPositionUIBehavior",

        usedStyleAttributes: ["startMenuPosition"],

        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            data.startMenuPositionHandle = widget.when(cls.UserInterfaceWidget.startMenuPosition, this._onStartMenuPositionChanged.bind(
              this, controller, data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.startMenuPositionHandle) {
            data.startMenuPositionHandle();
            data.startMenuPositionHandle = null;
          }
        },

        _onStartMenuPositionChanged: function(controller, data, event, sender, windowIdRef) {
          var app = controller.getAnchorNode().getApplication();
          var uiNode = app.uiNode();
          var startMenu = uiNode.getFirstChild('StartMenu');
          if (startMenu) {
            var windowNode = app.getNode(windowIdRef);
            if (windowNode) {
              var kind = windowNode.getStyleAttribute('startMenuPosition');
              startMenu.getController().changeWidgetKind(kind);
            }
          }
        }
      };
    });
  });
