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

modulum('ComboCheckBoxWidget', ['ComboBoxWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Combobox widget with Checkbox to choose multiple values.
     * @class classes.ComboCheckBoxWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ComboCheckBoxWidget = context.oo.Class(cls.ComboBoxWidget, function($super) {
      /** @lends classes.ComboCheckBoxWidget.prototype */
      return {
        __name: "ComboCheckBoxWidget",
        __templateName: "ComboBoxWidget",
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",
        _queryEditable: false,
        _editing: false,
        _isKeyVal: false,
        _keyNavBuffer: null,
        _keyNavtimer: null,
        _ddOpen: false,

        /**
         * @constructs {classes.ComboCheckBoxWidget}
         */
        constructor: function(opts) {
          this._keyNavBuffer = [];
          $super.constructor.call(this, opts);
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._dropDown.allowMultipleChoices(true);

          this._dropDown._blurClick = function(event) {
            // if neither widget and dropdown container contains clicked element, we close dropdown
            if (this.getParentWidget() && this.getParentWidget().getElement() && !this.getParentWidget().getElement().contains(
                event.target) && !context.DropDownService.getCurrentContainer().getElement().contains(event.target)) {
              this.unbindBlur();
              this._show(false);
              this.getParentWidget()._onFocus();
            }
          };
          this.when(context.constants.widgetEvents.space, this._onSpace.bind(this));

          this._dropDown.when(context.constants.widgetEvents.visibilityChange, function(event) {
            var visible = event.data[0];
            this._ddOpen = visible;
            if (visible && this._selectedWidget._inputElement) {
              this._setQueryEditableReadOnly(true);
            } else if (!visible && this._selectedWidget._inputElement) {
              this._setQueryEditableReadOnly(false);
            }
          }.bind(this));
        },

        /**
         * @param {string} choice single value label
         * overided to add checkbox instead
         */
        _addChoice: function(choice) {
          var label = cls.WidgetFactory.create("CheckBox");
          label.setText(choice.text);
          label.setCheckedValue(choice.value);
          this._isKeyVal = choice.text !== choice.value;
          label.setEnabled(true);
          this._dropDown.addChildWidget(label);
        },

        _setQueryEditableReadOnly: function(readonly) {
          if (readonly) {
            this._selectedWidget._inputElement.setAttribute("readonly", "readonly");
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              this._selectedWidget._inputElement.setAttribute("contentEditable", "false");
            }
          } else {
            this._selectedWidget._inputElement.removeAttribute("readonly");
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              this._selectedWidget._inputElement.setAttribute("contentEditable", "true");
            }
          }
        },

        /**
         * @param {string|string[]} choices adds a single or a list of choices
         */
        addChoices: function(choices) {
          if (choices) {
            if (Array.isArray(choices)) {
              for (var i = 0; i < choices.length; i++) {
                this._addChoice(choices[i]);
              }
              if (!choices.find(function(c) {
                  return c.value === this._selectedWidget.getValue();
                }.bind(this))) {
                this._selectedWidget.setValue("");
              } else {
                var value = this._selectedWidget.getValue();
                this._selectedWidget.setValue(value);
              }
            } else {
              this._addChoice(choices);
            }
          }
        },

        _onFocus: function() {
          if (!this._queryEditable) {
            this.getElement().domFocus();
          } else {
            this.getElement().querySelector("input").domFocus();
          }
        },

        _onBlur: function() {
          $super._onBlur.call(this);
        },

        _onUp: function(e) {
          $super._onUp.call(this, e);
        },

        _onLeft: function(e) {
          if (!this._queryEditable) {
            $super._onLeft.call(this, e);
          }
        },
        _onRight: function(e) {
          if (!this._queryEditable) {
            $super._onRight.call(this, e);
          }
        },

        _onSpace: function(e) {
          var event = e.data[0];
          if (this._dropDown.isVisible()) {

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            var pos = this._getCurrentPosition();
            if (pos >= 0) {
              this._dropDown.getChildren()[pos]._onClick(e.data[0]);
            }
          } else if (!this._queryEditable) {
            this._dropDown.toggle();
          }
        },

        _onEnter: function(event, sender, domEvent) {
          if (this._dropDown.isVisible()) {
            this._dropDown.toggle();
          }
        },

        /**
         * key press handler
         * @param event
         * @private
         */
        _onKeypress: function(event) {
          this.removeClass("placeholder");

          if (this._queryEditable) {
            this.getElement().querySelector("input").domFocus();
          }
          var char = String.fromCharCode(event.which).toLowerCase();

          // backspace or del
          var stay = event.which === 8 || event.which === 46;

          // Fill the buffer until it's processed
          this._keyNavBuffer.push(char);

          if (this._keyNavtimer) {
            window.clearTimeout(this._keyNavtimer);
          }
          this._keyNavtimer = window.setTimeout(function() {
            this._navigateToLetter(!this._ddOpen && this._queryEditable ? this._selectedWidget._inputElement.value : this._keyNavBuffer
              .join(""),
              stay);
            if (this.getValue() === "") {
              this.addClass("placeholder");
            }
            this._keyNavtimer = null;
            this._keyNavBuffer = [];
          }.bind(this), 200);
        },

        /**
         * Will set the dropdown to next given letter(s)
         * @param letter(s) to match
         * @private
         */
        _navigateToLetter: function(letter, stay) {
          var ddVisible = this._dropDown.isVisible();
          var childrenArray = this._dropDown.getChildren();
          var letterPositions = [];

          if (stay && this._getCurrentPosition() === -1 && this.getValue() === "") {
            return;
          }

          for (var i = 0; i < childrenArray.length; i++) {
            // If the letter match one of the children's first letter
            if (childrenArray[i].getText().substring(0, letter.length).toLowerCase() === letter.toLowerCase()) {
              // save positions
              letterPositions.push(i);
            }
          }

          if (ddVisible && letterPositions.length) {
            var currentPos = this._getCurrentPosition();
            var pos = letterPositions.indexOf(currentPos);
            if (pos === -1) {
              // Letter typed doesn't fit the current highlighted one -> start from top
              this._dropDown.navigateTo(-1);
              currentPos = this._getCurrentPosition();
              pos = letterPositions.indexOf(currentPos);
            }
            if (letterPositions[pos + 1] || letterPositions[pos + 1] === 0) {
              // If the next entry fits the typed letter -> scroll to it
              this._dropDown.navigateTo(letterPositions[pos + 1]);
              this.scrollChildrenIntoView(childrenArray[letterPositions[pos + 1]], false);
            } else {
              // If there are nothing matching after -> scroll to first entry matching typed letter
              this._dropDown.navigateTo(letterPositions[0]);
              this.scrollChildrenIntoView(childrenArray[letterPositions[0]], false);
            }
          } else {
            // DropDown not visible
            var currentValue = this.getValue();
            var valuesArray = childrenArray.map(function(child) {
              return child.getCheckedValue();
            });
            var currentValueIndex = valuesArray.indexOf(currentValue);

            if (letterPositions.length && currentValueIndex < 0) {
              // current value is not in the dropdown choices
              this.setValue(this.getValueAtPosition(letterPositions[0]));
            } else if (letterPositions.indexOf(currentValueIndex) >= 0) {
              var nextPropIndex = letterPositions.indexOf(currentValueIndex) + stay ? 0 : 1;
              if (letterPositions.length > nextPropIndex) {
                this.setValue(this.getValueAtPosition(letterPositions[nextPropIndex]));
              } else {
                this.setValue(this.getValueAtPosition(letterPositions[0]));
              }
            } else if (letterPositions.length > 0) {
              this.setValue(this.getValueAtPosition(letterPositions[0]));
            }
          }

        },

        _onClick: function(event) {
          event.stopPropagation();
          if (this.isEnabled()) {
            this._dropDown.toggle();
          }
        },

        navigateTo: function(jump, up) {
          $super.navigateTo.call(this, jump, up);
        },

        /**
         * Returns position of current value
         * @returns {Number}
         * @private
         */
        _getCurrentPosition: function() {
          var childrenArray = [];
          if (!this._dropDown.isVisible()) {
            childrenArray = this._dropDown.getChildren();
            var pos = -1;
            for (var i = 0; i < childrenArray.length; i++) {
              if (this._isKeyVal) {
                if (childrenArray[i].getText() === this._selectedWidget.getValue()) {
                  pos = i;
                }
              } else {
                if (childrenArray[i].getText() === this.getValue()) {
                  pos = i;
                }
              }
            }
            return pos;
          } else {
            childrenArray = this._dropDown._element.childrenExcept(this.__charMeasurer);
            return childrenArray.indexOf(this._dropDown._element.querySelector(".current"));
          }
        },

        /**
         * Mostly used by VM to set value
         * @param value
         */
        setValue: function(value) {
          this.removeClass("placeholder");
          if (value.length === 0) {
            if (value === "") {
              this._dropDown.getChildren().map(function(child) {
                child.setValue(false);
              });
              this._selectedWidget.setValue(value);
              if (this._selectedWidget.setText) {
                this._selectedWidget.setText(value);
              }
              this.setPlaceHolder(this._placeholderText);
            }
            return;
          }
          // Update the dropdown checkboxes status
          if (typeof(value) === "string" && value.indexOf("|") > 0) {
            var splitted = value.split("|");
            this._dropDown.getChildren().map(function(child) {
              child.setValue(false);
              if (splitted.indexOf(child._checkedValue.toString()) >= 0) {
                child.setValue(child._checkedValue);
              }
            });
          } else {
            this._dropDown.getChildren().map(function(child) {
              child.setValue(false);
              if (child._checkedValue === value) {
                child.setValue(child._checkedValue);
              }
            });
          }

          // Then update the placeholder
          var selectedWidgetValue = this._selectedWidget.getValue();
          if (typeof(selectedWidgetValue) !== typeof(value)) {
            value = value.toString();
          }

          var child = this._dropDown.getChildren().filter(function(c) {
            return c.getCheckedValue().toString() === value;
          });

          var childVal = child.length > 0 ? child[0].getText() : false;

          if (selectedWidgetValue !== value) {
            this._selectedWidget.setValue(childVal || value);
            if (this._selectedWidget.setText) {
              this._selectedWidget.setText(childVal || value);
            }
            this.emit(context.constants.widgetEvents.change, value);
          }
        },

        /**
         * Used by GWC-JS to set multiple values
         * @param value
         * @private
         */
        _setMultiValue: function(value) {
          if (value.length) {
            this.removeClass("placeholder");
          } else {
            this.addClass("placeholder");
          }

          var children = this._dropDown.getChildren();

          //get all selected Texts
          var textValueResult = children.map(function(c) {
            return c.getValue() || c.getValue() === 0 ? c.getText() : false;
          }).filter(Boolean); //Remove undefined and stuff

          //get all selected values
          var valueResult = children.map(function(c) {
            return c.getValue();
          }).filter(function(val) {
            return typeof val !== "boolean";
          });

          var newValue = valueResult.join("|");
          var newTextValue = textValueResult.join("|");

          this._selectedWidget.setValue(newValue);
          if (this._selectedWidget.setText) {
            this._selectedWidget.setText(newTextValue);
          }
          this.emit(context.constants.widgetEvents.change, newValue);
        },

        /**
         * Give the posibility to change manually the value
         * @param editable
         * @private
         */
        _setQueryEditable: function(editable) {
          this._queryEditable = editable;
          if (editable) {
            // Change the display widget by an editable one
            var editWidget = cls.WidgetFactory.create("Edit");
            this._selectedWidget.replaceWith(editWidget);
            this._selectedWidget.setFocusable(true);

            this._selectedWidget = editWidget;
            this._inputElement = this._selectedWidget._inputElement;

            // On leaving field, need to send the value
            this._inputElement.on('blur.Editable', function() {
              this._onBlur();
            }.bind(this));

            // Update dynamicly the checkboxes status when typing in the field
            this._selectedWidget.when(context.constants.widgetEvents.change, function(e) {
              var requestedVal = e.data[0].target.value;
              //remove whitespace and split on |
              var splittedVal = requestedVal.split("|");
              var children = this._dropDown.getChildren().slice();

              children.forEach(function(c) {
                if (splittedVal.indexOf(c._checkedValue) >= 0) {
                  c.setValue(c._checkedValue);
                } else {
                  c.setValue(c._uncheckedValue);
                }
              });
            }.bind(this));
          } else {
            if (this._inputElement) {
              this._inputElement.off('keyup.queryEditableCombo');
              this._inputElement.off('keydown.queryEditableCombo');
              this._inputElement.off('blur.Editable');
              this._inputElement = null;
            }
          }
          if (this._layoutEngine) {
            this._layoutEngine.invalidateDataContentSelector(this);
          }
        },

        /**
         * When a formfield is inactive we must put it in readonly mode
         * @param readonly
         * @private
         */
        gbcReadonly: function(readonly) {
          // bind/unbind keys events
          if (readonly) {
            if (this._keyEventsBound) {
              this._keyEventsBound = false;
              this.unbindKeyEvents();
            }
          } else {
            if (!this._keyEventsBound) {
              this._keyEventsBound = true;
              this.bindKeyEvents();
            }
          }
        },

        bindKeyEvents: function() {
          $super.bindKeyEvents.bind(this);
          this._element.on('keypress.ComboBoxWidget', this._onKeypress.bind(this));

          this._keyboardInstance = cls.KeyboardHelper.bindKeyboardNavigation(this._element, this);
          this._keyboardInstance.bind(['backspace', 'del'], this._onKeypress.bind(this));
          this._keyboardInstance.unbind([this.getStart(), this.getEnd()]);

          if (this._inputElement) {
            this._inputElement.on('keyup.queryEditableCombo', function(e) {
              if (this._queryEditable) {
                this._selectedWidget.emit(context.constants.widgetEvents.change, e);
              }
            }.bind(this));
          }
        },

        unbindKeyEvents: function() {
          if (!this._ddOpen) {
            this._element.off('keypress.ComboBoxWidget');

            if (this._inputElement) {
              this._inputElement.off('keyup.queryEditableCombo');
            }

            $super.unbindKeyEvents.bind(this);
            if (this._keyboardInstance) {
              this._keyboardInstance.unbind(['backspace', 'del']);
              this._keyboardInstance = cls.KeyboardHelper.unbindKeyboardNavigation(this._element, this);
            }
          }
        },

        /**
         * Get the value of the dropdown item at given position (checkbox)
         * @param pos
         * @return the value at position
         */
        getValueAtPosition: function(pos) {
          if (this._dropDown.getChildren().length > 0) {
            if (this._isKeyVal) {
              return this._dropDown.getChildren()[pos].getText();
            } else {
              return this._dropDown.getChildren()[pos].getCheckedValue();
            }
          }
        },

        /**
         * @returns {string} the currently selected value
         */
        getValue: function() {
          var val = this._selectedWidget.getValue();

          if (this._isKeyVal) {
            var children = this._dropDown.getChildren().slice();
            children.forEach(function(c) {
              if (val === c._labelElement.textContent) {
                val = c._checkedValue;
              }
            });
          }

          return val;
        },

        /**
         * Flag or unflag widget as having pending changes
         * @param editing
         */
        setEditing: function(editing) {
          if (editing !== this._editing) {
            this.getElement().toggleClass("editing", !!editing);
            this._editing = editing;
          }
        },

        isEditing: function() {
          return this._editing;
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-transform
         * @param transform {String} a CSS text transform. null restores the default value.
         */
        setTextTransform: function(transform) {
          if (this._textTransform !== transform) {
            this._textTransform = transform;
            this.addClass(transform + "shift");
          }
        },

        /**
         * Remove both class which cause text-transform
         */
        removeTextTransform: function() {
          this.removeClass("upshift");
          this.removeClass("downshift");
          this._textTransform = "none";
        },

        destroy: function() {
          this.clearChoices();
          var children = this.getChildren().slice();
          var childenLength = children.length;
          if (childenLength > 0) {
            for (var i = 0; i < childenLength; i++) {
              this.removeChildWidget(children[i]);
            }
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.register('ComboCheckBox', cls.ComboCheckBoxWidget);
  });
