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

modulum('SendValueUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's visibility
     * @class classes.SendValueUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.SendValueUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.SendValueUIBehavior.prototype */
      return {
        __name: "SendValueUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.changeHandle = controller.getWidget().when(context.constants.widgetEvents.change, this._onChange.bind(this,
              controller, data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.changeHandle) {
            data.changeHandle();
            data.changeHandle = null;
          }
        },

        /**
         * This method gets called when the widget emits its 'changed' event
         * @private
         */
        _onChange: function(controller, data, event, sender, nativeEvent, doNotSendValue) {
          var widget = controller.getWidget();
          var uiWidget = widget.getUserInterfaceWidget();
          // if widget has pending configureevent to send (= dirty) or if value changed
          // or if widget is need to always send its value (=alwaysSend) (ex completer)
          if (widget._dirty === true || this._hasValueChanged(controller) || widget._alwaysSend === true) {
            var anchorNode = controller.getAnchorNode();
            var window = anchorNode.getAncestor("Window");
            var dialog = window.getActiveDialog();
            if (dialog) {
              widget._dirty = true;
              var dialogTouchedNode = dialog.getFirstChildWithAttribute('Action', 'name', 'dialogtouched');
              if (dialogTouchedNode && dialogTouchedNode.attribute('active') === 1) {
                // We need to send the anchorNode value too. CheckBoxes may not have the focus when clicked
                anchorNode.getApplication().action.execute(dialogTouchedNode.getId(), anchorNode);
              } else {
                var decorationNode = controller.getNodeBindings().decorator;
                if (decorationNode) {
                  var completerNode = decorationNode.getFirstChild();
                  if (completerNode && completerNode.getTag() === "Completer") {
                    // The item has a completer, send all keys
                    controller.sendWidgetValue();
                  }
                }
                if (!doNotSendValue) {
                  controller.sendWidgetValue();
                }
              }
            }
          }
        },

        /**
         * Checks if the value has changed
         * @returns {boolean} true if the value has changed, false otherwise
         * @private
         */
        _hasValueChanged: function(controller, data) {
          return controller._getWidgetValue() !== controller._getAuiValue();
        }
      };
    });
  });
