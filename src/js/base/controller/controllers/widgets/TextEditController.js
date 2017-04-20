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

modulum('TextEditController', ['TextValueContainerControllerBase', 'ControllerFactory', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextEditController
     * @extends classes.TextValueContainerControllerBase
     */
    cls.TextEditController = context.oo.Class(cls.TextValueContainerControllerBase, function($super) {
      /** @lends classes.TextEditController.prototype */
      return {
        __name: "TextEditController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.DialogTypeVMBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
          //This has been place here to dynamicaly handle relayout when switching to RichText
          this._addBehavior(cls.TextFormat4STBehavior);
          if (!this.isInTable || this.isInFirstTableRow) {
            this._addBehavior(cls.LayoutInfoVMBehavior);
          }
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          this._addBehavior(cls.ActivePseudoSelectorBehavior);
          this._addBehavior(cls.DialogTypePseudoSelectorBehavior);
          if (this.isInMatrix) {
            this._addBehavior(cls.MatrixCurrentRowVMBehavior);
          }
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.WrapPolicy4STBehavior);
          this._addBehavior(cls.ShowEditToolBox4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.TextEditRowsVMBehavior);
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.TextTransformVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.MaxLengthVMBehavior);
          this._addBehavior(cls.CursorsVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.PlaceholderVMBehavior);

          //related to richtext
          this._addBehavior(cls.OnDataUIBehavior);
          this._addBehavior(cls.OnActionUIBehavior);
          this._addBehavior(cls.WebComponentStateChangedVMBehavior);

          // ui behaviors
          this._addBehavior(cls.SendValueUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }
          this._addBehavior(cls.HasWebComponentUIBehavior);

        },
        _getWidgetType: function(kind) {
          var type;
          this.ignoreTypeahead = false;
          if (kind === "Construct") {
            type = "DummyTextEdit";
          } else if (kind === "RichText") {
            type = "RichText";
            this.ignoreTypeahead = true;
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        }
      };
    });
    cls.ControllerFactory.register("TextEdit", cls.TextEditController);

  });
