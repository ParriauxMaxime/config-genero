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

modulum('OnClickUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OnClickUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnClickUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnClickUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.clickHandle = controller.getWidget().when(gbc.constants.widgetEvents.click, this._onClick.bind(this, controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
        },

        /**
         * Creates an action event and sends it to the VM
         */
        _onClick: function(controller, data) {
          //should request the focus first
          var bindings = controller.getNodeBindings();
          var app = bindings.anchor.getApplication();
          var uiNode = app.uiNode();
          var isProcessing = uiNode.attribute("runtimeStatus") === "processing";
          var widget = controller.getWidget();
          var hasFocus = false;
          if (widget) {
            hasFocus = widget.hasFocus();
          }

          if (!isProcessing) {
            if (["ButtonEdit"].indexOf(bindings.decorator ? bindings.decorator._tag : false) >= 0) {
              if (hasFocus) {
                this._process(controller);
              } else {
                context.FocusService._eventListener.when("focusVMChanged", function() {
                  var widget = controller.getWidget();
                  var hasFocus = false;
                  if (widget) {
                    hasFocus = widget.hasFocus();
                  }
                  if (hasFocus) {
                    this._process(controller);
                  }
                }.bind(this), true); // true : execute only once
              }
            } else {
              this._process(controller);
            }
          }
        },

        _process: function(controller) {
          var bindings = controller.getNodeBindings();
          var app = bindings.anchor.getApplication();
          var uiNode = app.uiNode();
          var isProcessing = uiNode.attribute("runtimeStatus") === "processing";

          if (!isProcessing) {
            var active = false;
            var actionNode = bindings.decorator ? bindings.decorator : bindings.anchor;
            var activeNode = bindings.container ? bindings.container : bindings.anchor;
            var activeParentNode = activeNode && activeNode.getParentNode();

            var hasActionActive = actionNode.isAttributesSetByVM('actionActive');
            var hasActive = activeNode.isAttributesSetByVM('active');
            var hasParentActive = activeParentNode && activeParentNode.isAttributesSetByVM('active');

            if (hasActionActive) {
              active = actionNode.attribute('actionActive');
            } else if (hasActive) {
              active = activeNode.attribute('active');
            }
            if (hasParentActive) {
              active = active && activeParentNode.attribute('active');
            }
            if (active) {
              app.action.execute(actionNode.getId());
            }
          }
        }
      };
    });
  });
