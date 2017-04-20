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

modulum('RadioGroupController', ['ValueContainerControllerBase', 'ControllerFactory', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RadioGroupController
     * @extends classes.ValueContainerControllerBase
     */
    cls.RadioGroupController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.RadioGroupController.prototype */
      return {
        __name: "RadioGroupController",
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
          this._addBehavior(cls.ItemVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.OrientationVMBehavior);
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
        _getWidgetType: function(kind) {
          var type;
          if (kind === "Construct") {
            type = "DummyRadioGroup";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        },
        _createWidget: function(type) {
          var radioGroup = $super._createWidget.call(this, type);

          var choices = this.getNodeBindings().decorator.getChildren().map(function(item) {
            return {
              value: item.attribute("name"),
              text: item.attribute("text")
            };
          });
          radioGroup.addChoices(choices);
          radioGroup.setOrientation(this.getNodeBindings().decorator.attribute('orientation'));
          return radioGroup;
        },
        typeahead: function(keys) {
          var widget = this.getWidget();
          var consumed = true;
          for (var i = 0; consumed && i < keys.length; ++i) {
            var key = keys[i];
            consumed = false;
            switch (key) {
              case 'up':
              case widget.getStart():
                widget._onLeft();
                consumed = true;
                break;
              case 'down':
              case widget.getEnd():
                widget._onRight();
                consumed = true;
                break;
              case 'space':
                widget._onSpace();
                consumed = true;
                break;
            }
          }
          return $super.typeahead.call(this, consumed ? keys.slice(i) : keys.slice(i - 1));
        }
      };
    });
    cls.ControllerFactory.register("RadioGroup", cls.RadioGroupController);

  });
