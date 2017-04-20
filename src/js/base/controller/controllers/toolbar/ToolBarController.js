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

modulum('ToolBarController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ToolBarController
     * @extends classes.ControllerBase
     */
    cls.ToolBarController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.ToolBarController.prototype */
      return {
        __name: "ToolBarController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.ButtonTextHiddenVMBehavior);

          var layoutService = this.getAnchorNode().getApplication().layout;
          this._afterLayoutHandler = layoutService.afterLayout(this.onAfterLayout.bind(this));

        },
        attachUI: function() {
          var parentNode = this.getAnchorNode().getParentNode();
          while (parentNode) {
            var controller = parentNode.getController();
            if (controller) {
              var widget = controller.getWidget();
              if (widget && widget.addToolBar) {
                var containerWidget = widget;
                // only toolbar from modal is being added inside modal
                if (!parentNode.isModal || !parentNode.isModal()) {
                  containerWidget = this.getAnchorNode().getAncestor('UserInterface').getController().getWidget();
                }
                var order = this.getAnchorNode().getParentNode().getTag() === 'Form' ? 1 : 0;
                widget.addToolBar(this.getWidget(), order, containerWidget);
                break;
              }
            }
            parentNode = parentNode.getParentNode();
          }
        },
        detachUI: function() {
          var winNode = this.getAnchorNode().getAncestor('Window');
          if (!!winNode) {
            var winWidget = winNode.getController().getWidget();
            winWidget.removeToolBar(this.getWidget());
          }

          $super.detachUI.call(this);
        },

        onAfterLayout: function() {
          // Check if there is space enough to display the full bar or need scrolling
          var containerElementWidth = this.getWidget()._containerElement.getBoundingClientRect().width;
          var tabsTitlesHostWidth = this.getWidget()._scroller._tabsTitlesHost.getBoundingClientRect().width;

          if (tabsTitlesHostWidth - containerElementWidth <= 0) {
            this.getWidget()._scroller.showScroller(true);
          } else {
            this.getWidget()._scroller.showScroller(false);
          }

        },

        destroy: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
          }
          $super.destroy.call(this);
        }

      };
    });
    cls.ControllerFactory.register("ToolBar", cls.ToolBarController);
  });
