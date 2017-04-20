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

modulum('MatrixController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MatrixController
     * @extends classes.ControllerBase
     */
    cls.MatrixController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.MatrixController.prototype */
      return {
        __name: "MatrixController",

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // pseudo-selector behaviors
          this._addBehavior(cls.FocusCurrentCellPseudoSelectorBehavior);
          this._addBehavior(cls.OffsetPseudoSelectorBehavior);
        },

        setFocus: function() {
          var matrixNode = this.getAnchorNode();
          var valueNode = matrixNode.getCurrentValueNode(false);
          var widget = null;
          if (valueNode) {
            var controller = valueNode.getController();
            if (controller) {
              widget = controller.getWidget();
              if (widget && widget.setFocus) {
                widget.setFocus();
              }
            }
          } else {
            var applicationWidget = context.SessionService.getCurrent().getCurrentApplication().getUI().getWidget();
            if (applicationWidget && applicationWidget.setFocus) {
              applicationWidget.setFocus();
            }
          }
        },

        /**
         * Sends the updated value to the DVM
         * @private
         */
        sendWidgetValue: function() {
          var valueNode = this.getAnchorNode().getCurrentValueNode(true);
          if (valueNode) {
            var ctrl = valueNode.getController();
            if (ctrl && ctrl.sendWidgetValue) {
              ctrl.sendWidgetValue();
            }
          }
        },
      };
    });
    cls.ControllerFactory.register("Matrix", cls.MatrixController);

  });
