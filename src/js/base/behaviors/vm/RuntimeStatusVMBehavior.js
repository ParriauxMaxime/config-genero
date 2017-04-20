/// FOURJS_START_COPYRIGHT(D,2015)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('RuntimeStatusVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RuntimeStatusVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.RuntimeStatusVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.RuntimeStatusVMBehavior.prototype */
      return {
        __name: "RuntimeStatusVMBehavior",

        watchedAttributes: {
          anchor: ['runtimeStatus']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var uiNode = controller.getAnchorNode();
          var app = uiNode.getApplication();
          if (!!app) {
            var runtimeStatus = uiNode.attribute('runtimeStatus');
            if (runtimeStatus !== "childstart" && runtimeStatus !== "processing") {
              app.setIdle();
            }
          }
        },

        _runtimeStatusChanged: function(controller, data) {
          var uiNode = controller.getAnchorNode();
          var runtimeStatus = uiNode.attribute('runtimeStatus');
          if (runtimeStatus === "childstart") {
            var app = uiNode.getApplication();
            app.newTask();
          }
        },

        _attach: function(controller, data) {
          var uiNode = controller.getAnchorNode();
          data.onRuntimeStatusAttributeChanged = uiNode.onAttributeChanged('runtimeStatus', this._runtimeStatusChanged.bind(this,
            controller, data));
        },

        _detach: function(controller, data) {
          if (data.onRuntimeStatusAttributeChanged) {
            data.onRuntimeStatusAttributeChanged();
          }
        }
      };
    });
  });
