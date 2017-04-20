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

modulum('ScrollGridController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ScrollGridController
     * @extends classes.ControllerBase
     */
    cls.ScrollGridController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.ScrollGridController.prototype */
      return {
        __name: "ScrollGridController",
        nativeVerticalScroll: false,

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          this.nativeVerticalScroll = (this.getAnchorNode().attribute("wantFixedPageSize") === 0);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          // 4st behaviors
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.WantFixedPageSizeVMBehavior);
          if (this.nativeVerticalScroll) {
            this._addBehavior(cls.NativeScrollVMBehavior);
            this._addBehavior(cls.StretchableScrollGridPageSizeVMBehavior);
          } else {
            this._addBehavior(cls.ScrollVMBehavior);
          }

          //ui behaviors
          this._addBehavior(cls.ScrollUIBehavior);
          this._addBehavior(cls.ScrollGridClickUIBehavior);
          if (this.nativeVerticalScroll) {
            this._addBehavior(cls.OnLayoutUIBehavior);
          }
        },

        _createWidget: function(type) {

          var parentAppWidget = this.getUINode().getController().getWidget();

          return cls.WidgetFactory.create('ScrollGrid', this.getAnchorNode().attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            appWidget: parentAppWidget
          });
        },

        /**
         * Sends the updated value to the DVM
         * @private
         */
        sendWidgetValue: function() {
          var ui = this.getUINode();
          var focusedNode = ui.getApplication().getNode(ui.attribute('focus'));
          var focusedWidgetController = focusedNode.getController();
          if (focusedWidgetController.sendWidgetValue) {
            focusedWidgetController.sendWidgetValue();
          }
        }
      };
    });
    cls.ControllerFactory.register("ScrollGrid", cls.ScrollGridController);

  });
