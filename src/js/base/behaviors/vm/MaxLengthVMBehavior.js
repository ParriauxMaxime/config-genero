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

modulum('MaxLengthVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MaxLengthVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.MaxLengthVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.MaxLengthVMBehavior.prototype */
      return {
        __name: "MaxLengthVMBehavior",

        watchedAttributes: {
          decorator: ['maxLength', 'autonext', 'picture']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setMaxLength) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var maxLength = null;
            var autonext = null;
            if (decoratorNode.isAttributesSetByVM('maxLength')) {
              maxLength = decoratorNode.attribute('maxLength');
              if (maxLength === 0) {
                // 0 means 'disable maxLength'
                maxLength = null;
              }
            }

            if (decoratorNode.isAttributesSetByVM('autoNext') && decoratorNode.attribute('autoNext') === 1) {
              if (maxLength) {
                widget.when(context.constants.widgetEvents.keyUp, this._onkeyUp.bind(this, controller, data));
              }
            }

            widget.setMaxLength(maxLength, autonext);
          }
        },

        _onkeyUp: function(controller, data, e) {
          var decoratorNode = controller.getNodeBindings().decorator;
          var maxLength = decoratorNode.attribute('maxLength');
          if (maxLength === 0) {
            // 0 means 'disable maxLength'
            return false;
          }
          var event = e.data[0];
          var eventTarget = event.target;
          var valueLength = eventTarget.value.length;
          var endReached = eventTarget.selectionStart === eventTarget.selectionEnd &&
            eventTarget.selectionEnd + 1 >= maxLength &&
            eventTarget.selectionStart + 1 >= maxLength;

          //Do nothing if arrow left/right: return
          var keyCode = event.keyCode || event.which;
          if ([8, 9, 16].indexOf(keyCode) >= 0 || (keyCode >= 35 && keyCode <= 40)) { // Left / Up / Right / Down Arrow, Backspace, Delete keys
            return false;
          }

          if (valueLength >= maxLength && endReached) {
            if (!data._afterExe) {
              data._afterExe = true;
              this._executeNextField(controller, data);
            }
          }
        },

        _executeNextField: function(controller, data) {
          if (controller._nodeBindings) {
            controller.getAnchorNode().getApplication().action.executeActionDefaultByName("nextfield");
            data._afterExe = false;
          }
        }
      };
    });
  });
