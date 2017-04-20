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

modulum('CheckBoxController', ['ValueContainerControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CheckBoxController
     * @extends classes.ValueContainerControllerBase
     */
    cls.CheckBoxController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.CheckBoxController.prototype */
      return {
        __name: "CheckBoxController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.DialogTypeVMBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
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
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.CheckBoxValuesVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.NotNullVMBehavior);
          // ui behaviors
          this._addBehavior(cls.SendValueUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }
        },
        _createWidget: function(type) {
          var checkBox = $super._createWidget.call(this, type);

          checkBox.setCheckedValue(this.getNodeBindings().decorator.attribute("valueChecked"));
          checkBox.setUncheckedValue(this.getNodeBindings().decorator.attribute("valueUnchecked"));
          checkBox.setIndeterminateValue('');
          return checkBox;
        },

        typeahead: function(keys) {
          var widget = this.getWidget();
          while (keys.length !== 0) {
            var key = keys[0];
            if (key === "space") {
              widget._onSpace();
              keys.shift();
            } else {
              return $super.typeahead.call(this, keys);
            }
          }
          return $super.typeahead.call(this, keys);
        }
      };
    });
    cls.ControllerFactory.register("CheckBox", cls.CheckBoxController);

  });
