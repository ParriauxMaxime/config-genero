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

modulum('TimeEditController', ['TextValueContainerControllerBase', 'ControllerFactory', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TimeEditController
     * @extends classes.TextValueContainerControllerBase
     */
    cls.TimeEditController = context.oo.Class(cls.TextValueContainerControllerBase, function($super) {
      /** @lends classes.TimeEditController.prototype */
      return {
        __name: "TimeEditController",
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
          this._addBehavior(cls.MaxLengthVMBehavior);
          this._addBehavior(cls.CursorsVMBehavior);
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
            type = "DummyTimeEdit";
          } else if (this.isInTable && (kind === "Display" || kind === "DisplayArray")) {
            type = "Label";
          } else {
            type = $super._getWidgetType.call(this, kind);
          }
          return type;
        },

        _isConstruct: function() {
          return this.getNodeBindings().container.attribute('dialogType') === "Construct";
        },

        typeahead: function(keys) {
          var widget = this.getWidget();
          var cursors = widget.getCursors();
          var value = widget.getValue().toString();
          var consumed = true;
          var mod = window.browserInfo.isSafari ? "command" : "ctrl";
          for (var i = 0; consumed && i < keys.length; ++i) {
            var key = keys[i];
            consumed = false;
            if (key.length === 1 && key !== ':') {
              if (cls.KeyboardHelper.isNumeric(key)) {
                value = widget.getValue();
                cursors = widget.getCursors();
                var firstPart = value.substr(0, cursors.start);
                var secondPart = value.substr(cursors.end);
                value = firstPart + key + secondPart;
                cursors.start = cursors.end = cursors.start + 1;
                widget.setValue(value);
                var groupComplete = widget._updateGroups(value);
                if (groupComplete) {
                  widget._moveGroup(1);
                  widget._updateSelection();
                }
              }
              consumed = true;
            } else switch (key) {
              case widget.getStart():
                cursors.start = cursors.start > 0 ? cursors.start - 1 : 0;
                cursors.end = cursors.start;
                widget._onLeftRight();
                consumed = true;
                break;
              case widget.getEnd():
                cursors.start = cursors.end < value.length ? cursors.end + 1 : value.length;
                cursors.end = cursors.start;
                widget._onLeftRight();
                consumed = true;
                break;
              case 'up':
                widget._onUp();
                consumed = true;
                break;
              case 'down':
                widget._onDown();
                consumed = true;
                break;
              case 'home':
                widget._onHome();
                consumed = true;
                break;
              case 'end':
                widget._onEnd();
                consumed = true;
                break;
              case mod + '+' + widget.getStart():
                widget._onModLeft();
                consumed = true;
                break;
              case mod + '+' + widget.getEnd():
                widget._onModRight();
                consumed = true;
                break;
              case ':':
                widget._onColon();
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
                widget._onBackspace();
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
                widget._onDel();
                consumed = true;
                break;
            }
          }
          widget.setCursors(cursors.start, cursors.end);

          return $super.typeahead.call(this, consumed ? keys.slice(i) : keys.slice(i - 1));
        }
      };
    });
    cls.ControllerFactory.register("TimeEdit", cls.TimeEditController);

  });
