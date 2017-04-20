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

modulum('FocusService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.FocusService
     */
    gbc.FocusService = context.oo.StaticClass( /** @lends gbc.FocusService */ {
      __name: "FocusService",

      /**
       * true if we are currently restoring the VM focus, false otherwise
       * @type {boolean}
       */
      _restoringFocus: false,
      _focusedNode: null,

      init: function() {
        this._eventListener = new cls.EventListener();
        var session = context.SessionService.getCurrent();
        if (session) {
          var application = session.getCurrentApplication();
          this._focusedNode = application.getFocusedVMNode();
        }
      },

      /**
       * @returns {boolean} true if we are currently restoring the VM focus, false otherwise
       */
      isRestoringFocus: function() {
        return this._restoringFocus;
      },

      /**
       * Restores the focus according to the VM focus
       */
      restoreVMFocus: function(app) {
        if (app) {
          var ui = app.model.getNode(0);
          if (ui) {
            var focusedNodeId = ui.attribute('focus');
            var node = app.getNode(focusedNodeId);
            if (node) {
              var focusUpdated = node !== this._focusedNode;
              this._focusedNode = node;
              var ctrl = node.getController();
              if (ctrl && ctrl.setFocus) {
                this._restoringFocus = true;
                ctrl.setFocus();
                this._eventListener.emit("focusRestored");
                if (focusUpdated) {
                  this._eventListener.emit("focusVMChanged");
                }
                this._restoringFocus = false;
              }
            }
          }
        }
      },

      getFocusedWidget: function() {
        var session = context.SessionService.getCurrent();
        var application = session.getCurrentApplication();
        var focusedVMNode = application.getFocusedVMNode();
        return focusedVMNode.getController().getWidget();
      }

    });
    gbc.InitService.register(gbc.FocusService);
  });
