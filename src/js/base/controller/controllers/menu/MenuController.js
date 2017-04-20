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

modulum('MenuController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MenuController
     * @extends classes.ControllerBase
     */
    cls.MenuController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.MenuController.prototype */
      return {
        __name: "MenuController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextActionVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.WindowTypeVMBehavior);
          this._addBehavior(cls.VisibleMenuVMBehavior);
          this._addBehavior(cls.MenuEnabledVMBehavior);

          this._addBehavior(cls.WindowCloseUIBehavior);

          // 4ST styles
          this._addBehavior(cls.ActionPanelButtonTextAlign4STBehavior);
          this._addBehavior(cls.ActionPanelButtonTextHidden4STBehavior);
          this._addBehavior(cls.RingMenuPosition4STBehavior);

        },
        attachUI: function() {
          if (this._widget) {
            this.getAnchorNode().getAncestor('Window').getController().getWidget().addMenu(this._widget);
          }
        }
      };
    });
    cls.ControllerFactory.register("Menu", cls.MenuController);

  });
