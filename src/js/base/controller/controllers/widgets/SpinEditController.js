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

modulum('SpinEditController', ['ValueContainerControllerBase', 'ControllerFactory', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.SpinEditController
     * @extends classes.ValueContainerControllerBase
     */
    cls.SpinEditController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.SpinEditController.prototype */
      return {
        __name: "SpinEditController",
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
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.ValueVMBehavior);
          this._addBehavior(cls.CursorsVMBehavior);
          this._addBehavior(cls.MaxLengthVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.RangeVMBehavior);
          this._addBehavior(cls.PlaceholderVMBehavior);

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
            type = "DummySpinEdit";
          } else if (this.isInTable && (kind === "Display" || kind === "DisplayArray")) {
            type = "Label";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        },

        typeahead: function(keys) {
          var widget = this.getWidget();
          var cursors = widget.getCursors();
          var value = widget.getValue().toString();
          var consumed = true;
          for (var i = 0; consumed && i < keys.length; ++i) {
            var key = keys[i];
            consumed = false;
            if (key.length === 1) {
              if ((cls.KeyboardHelper.isNumeric(key) || key === '-' || key === '+' || key === '.') && !widget._isMaxLength()) {
                var firstPart = value.substr(0, cursors.start);
                var secondPart = value.substr(cursors.end);
                var isValid = cls.KeyboardHelper.validateNumber(value, cursors.start, key, widget.getMin(), widget.getMax());
                value = firstPart + key + secondPart;
                cursors.start = cursors.end = cursors.start + 1;

                if (isValid) {
                  widget.setValue(value);
                }
              }
              consumed = true;
            } else switch (key) {
              case widget.getStart():
                cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
                cursors.end = cursors.start;
                consumed = true;
                break;
              case widget.getEnd():
                cursors.start = cursors.end < value.length ? cursors.end + 1 : value.length;
                cursors.end = cursors.start;
                consumed = true;
                break;
              case 'up':
                widget._onInputUp();
                consumed = true;
                break;
              case 'down':
                widget._onInputDown();
                consumed = true;
                break;
              case 'home':
                widget._onInputHome();
                consumed = true;
                break;
              case 'end':
                widget._onInputEnd();
                consumed = true;
                break;
              case 'pageup':
                widget._onInputPageUp();
                consumed = true;
                break;
              case 'pagedown':
                widget._onInputPageDown();
                consumed = true;
                break;
              case 'shift+' + widget.getStart():
                cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
                consumed = true;
                break;
              case 'shift+' + widget.getEnd():
                cursors.end = cursors.end < value.length ? cursors.end + 1 : value.length;
                consumed = true;
                break;
              case 'ctrl+a':
                cursors.start = 0;
                cursors.end = value.length;
                consumed = true;
                break;
              case 'backspace':
                if (cursors.end > 0 && value) {
                  if (cursors.start === cursors.end) {
                    value = value.slice(0, cursors.start - 1) + value.slice(cursors.start);
                    cursors.start = cursors.end = cursors.end - 1;
                  } else {
                    value = value.slice(0, cursors.start) + value.slice(cursors.end);
                  }
                }
                consumed = true;
                break;
              case 'del':
                if (cursors.end > -1 && value) {
                  if (cursors.start === cursors.end) {
                    value = value.slice(0, cursors.start) + value.slice(cursors.start + 1);
                  } else {
                    value = value.slice(0, cursors.start) + value.slice(cursors.end);
                  }
                }
                consumed = true;
                break;
            }
          }
          widget.setCursors(cursors.start, cursors.end);

          return $super.typeahead.call(this, consumed ? keys.slice(i) : keys.slice(i - 1));
        }
      };
    });
    cls.ControllerFactory.register("SpinEdit", cls.SpinEditController);

  });
