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

modulum('ComboBoxController', ['ValueContainerControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ComboBoxController
     * @extends classes.ValueContainerControllerBase
     */
    cls.ComboBoxController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.ComboBoxController.prototype */
      return {
        __name: "ComboBoxController",
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
          // 4st behaviors
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
          this._addBehavior(cls.TextTransformVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.ItemVMBehavior);
          this._addBehavior(cls.NotNullVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.PlaceholderVMBehavior);
          this._addBehavior(cls.QueryEditableVMBehavior);
          // ui behaviors
          this._addBehavior(cls.SendValueUIBehavior);
          this._addBehavior(cls.RequestFocusUIBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }

        },
        _getWidgetType: function(kind, active) {
          var type;
          if (kind === "Construct" && active) {
            type = "ComboCheckBox";
          } else if (this.isInTable && (kind === "Display" || kind === "DisplayArray")) {
            type = "ReadOnlyComboBox";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        },
        _createWidget: function(type) {
          var comboBox = $super._createWidget.call(this, type);
          var choices = null;
          if (type !== "ComboCheckBox") {
            choices = this.getNodeBindings().decorator.getChildren().map(function(item) {
              return {
                value: item.attribute("name"),
                text: item.attribute("text")
              };
            });
          }

          if (!!choices && comboBox.addChoices) {
            comboBox.addChoices(choices);
          }
          return comboBox;
        },
        typeahead: function(keys) {
          var widget = this.getWidget();
          var consumed = true;
          for (var i = 0; consumed && i < keys.length; ++i) {
            var key = keys[i];
            consumed = false;
            switch (key) {
              case 'up':
                cls.KeyboardHelper._onUp(widget);
                consumed = true;
                break;
              case 'down':
                cls.KeyboardHelper._onDown(widget);
                consumed = true;
                break;
              case widget.getStart(): // use this syntax to manage reverse mode
                widget._onLeft(widget);
                consumed = true;
                break;
              case widget.getEnd(): // use this syntax to manage reverse mode
                widget._onRight(widget);
                consumed = true;
                break;
              case 'pageup':
                cls.KeyboardHelper._onPageUp(widget);
                consumed = true;
                break;
              case 'pagedown':
                cls.KeyboardHelper._onPageDown(widget);
                consumed = true;
                break;
              case 'home':
                cls.KeyboardHelper._onHome(widget);
                consumed = true;
                break;
              case 'end':
                cls.KeyboardHelper._onEnd(widget);
                consumed = true;
                break;
            }
          }
          return $super.typeahead.call(this, consumed ? keys.slice(i) : keys.slice(i - 1));
        }
      };
    });
    cls.ControllerFactory.register("ComboBox", cls.ComboBoxController);

  });
