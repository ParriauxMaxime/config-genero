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

modulum('TopMenuController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TopMenuController
     * @extends classes.ControllerBase
     */
    cls.TopMenuController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.TopMenuController.prototype */
      return {
        __name: "TopMenuController",
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

        },
        attachUI: function() {
          var parentNode = this.getAnchorNode().getParentNode();
          while (parentNode) {
            var controller = parentNode.getController();
            if (controller) {
              var widget = controller.getWidget();
              if (widget && widget.addTopMenu) {
                var containerWidget = widget;
                // only topmenu from modal is being added inside modal
                if (!parentNode.isModal || !parentNode.isModal()) { // if parent isn't a modal
                  containerWidget = this.getAnchorNode().getAncestor('UserInterface').getController().getWidget();
                }
                var order = this.getAnchorNode().getParentNode().getTag() === 'Form' ? 2 : 1;
                widget.addTopMenu(this.getWidget(), order, containerWidget);
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
            winWidget.removeTopMenu(this.getWidget());
          }

          $super.detachUI.call(this);
        }
      };
    });
    cls.ControllerFactory.register("TopMenu", cls.TopMenuController);

  });
