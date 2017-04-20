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

modulum('EditWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Edit widget.
     * @class classes.EditWidget
     * @extends classes.TextWidgetBase
     */
    cls.EditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.EditWidget.prototype */
      return {
        __name: "EditWidget",
        _isReadOnly: false,

        /** @lends classes.EditWidget */
        $static: {
          _onKeyDown: function(event) {
            this.setEditing(true);
            this.emit(context.constants.widgetEvents.keyDown, event, false);

            //Ctrl-Z should force the current field focus only and handle a undo/redo stack
            if (event.which === 90 && event.ctrlKey) {
              // go forth
              if (event.shiftKey) {
                if (this._valueStackCursor < this._valueStack.length - 1) {
                  this._valueStackCursor++;
                }
              } else {
                //go back but store the current as last known value
                if (this._valueStackCursor === this._valueStack.length - 1 && this._valueStack[this._valueStack.length - 1] !==
                  this.getValue()) {
                  this.setValue(this.getValue());
                }
                this._valueStackCursor--;
                this._valueStackCursor = this._valueStackCursor < 0 ? 0 : this._valueStackCursor;
              }
              event.stopImmediatePropagation();
              event.stopPropagation();
              event.preventDefault();

              window.requestAnimationFrame(function() {
                var val = this._valueStack[this._valueStackCursor];
                if (val) {
                  this._inputElement.value = val;
                }
              }.bind(this));
            }
          },
          _onKeyUp: function(event) {
            this.emit(context.constants.widgetEvents.keyUp, event, false);
            // on navigation inside dropdown results using arrows keys, do not emit change event
            if (this._completerWidget && this._completerWidget.stopPropagation === true) {
              this._completerWidget.stopPropagation = false;
            } else {
              // false parameter refers to 'doNotSendValue' parameter of SendValueUIBehavior._onChange
              this.emit(context.constants.widgetEvents.change, event, true);
            }
          },
          _onBlur: function(event) {
            // blur event raised when clicking on completer item. We need to ignore it
            if (this._completerWidget && this._completerWidget.isVisible()) {
              this._completerWidget.stopPropagation = false;
            } else {
              this.emit(context.constants.widgetEvents.blur, event);
            }
          }
        },

        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        _completerWidget: null,
        _inputType: "text",
        _maxLength: -1,
        _displayFormat: null,
        _ignore: false,
        _valueStack: null,
        _valueStackCursor: -1,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation._fixedSizePolicyForceMeasure = true;
          }
        },

        constructor: function(opt) {
          $super.constructor.call(this, opt);
          this._valueStack = [];
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName("input")[0];
          this._inputElement.on('click.EditWidget', cls.WidgetBase._onRequestFocus.bind(this));
          // needed for completer
          this._inputElement.on('blur.EditWidget', cls.EditWidget._onBlur.bind(this));

          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.EditWidget', cls.WidgetBase._onSelect.bind(this));

          this._isReadOnly = false;
        },

        destroy: function() {
          context.keyboard.release(this._inputElement);
          if (this._inputElement) {
            this._inputElement.off("mousedown.EditWidget");
            this._inputElement.off("keyup.EditWidget");
            this._inputElement.off("keydown.EditWidget");
            this._inputElement.off("blur.EditWidget");
            this._inputElement.off("click.EditWidget");
            this._inputElement.remove();
            this._inputElement = null;
          }
          if (this._completerWidget) {
            this._completerWidget.destroy();
            this._completerWidget = null;
          }
          $super.destroy.call(this);
        },

        _onHome: function(event) {
          event.stopPropagation();
          this.setCursors(0);
        },
        _onEnd: function(event) {
          event.stopPropagation();
          this.setCursors(this.getValue() && this.getValue().length || 0);
        },
        getInput: function() {
          return this._inputElement;
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
          this._setInputReadOnly(readonly);
        },

        _setInputReadOnly: function(readonly) {
          // TODO : optimize this condition (move hasFocus check in EnabledVMBehavior)
          if (readonly) {
            this._inputElement.setAttribute("readonly", "readonly");
          } else if (this.hasFocus()) {
            this._inputElement.removeAttribute("readonly");
          } else {
            this._inputElement.setAttribute("readonly", "readonly");
          }
        },

        bindKeyEvents: function() {
          this._inputElement.on('keyup.EditWidget', cls.EditWidget._onKeyUp.bind(this));
          this._inputElement.on('keydown.EditWidget', cls.EditWidget._onKeyDown.bind(this));

          var keyboardInstance = context.keyboard(this._inputElement);
          keyboardInstance.bind(['home'], this._onHome.bind(this));
          keyboardInstance.bind(['end'], this._onEnd.bind(this));

        },

        unbindKeyEvents: function() {
          this._inputElement.off('keyup.EditWidget');
          this._inputElement.off('keydown.EditWidget');

          var keyboardInstance = context.keyboard(this._inputElement);
          keyboardInstance.unbind('home');
          keyboardInstance.unbind('end');
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength, callback) {
          if (maxlength) {
            this._maxLength = maxlength;
            this._inputElement.setAttribute("maxlength", maxlength);
            if (callback) {
              callback();
            }
          }
        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          return this._maxLength;
        },

        _timer: null,
        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @param align {String} a CSS text alignment. null restores the default value.
         */
        setTextAlign: function(align) {
          this.setStyle(">input", {
            "text-align": align
          });
        },

        setCols: function(cols) {
          this._inputElement.setAttribute("size", cols);
        },
        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @returns {String} a CSS text alignment
         */
        getTextAlign: function() {
          return this.getStyle(">input", "text-align");
        },

        getDisplayFormat: function() {
          return this._displayFormat;
        },

        /**
         * Set current display format to use on each set value
         * @param format
         */
        setDisplayFormat: function(format) {
          this._displayFormat = format;
        },

        /**
         * @param {string} value sets the value to display
         */
        setValue: function(value, force) {
          this._valueStack.push(value);
          this._valueStackCursor++;
          // Condition is : for completer only, we don't set value if, while having dom focus in input element, we receive a different value from VM
          var shiftValueUpdate = this.getValue() !== value && this.getValue().toLowerCase() === value.toLowerCase();
          if (shiftValueUpdate || (this.getValue() !== value && (!this.hasCompleter() || force || this._inputElement !== document.activeElement))) {
            this._ignore = false;
            this._inputElement.value = value;
            this.setEditing(false);

          } else {
            if (this.hasCompleter()) {
              this._ignore = true;
            }
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          if (this._inputElement) {
            return this._inputElement.value;
          }
          return null;
        },

        /**
         * When cursor2 === cursor, it is a simple cursor set
         * @param {int} cursor the selection range beginning (-1 for end)
         * @param {int} cursor2 the selection range end, if any
         */
        setCursors: function(cursor, cursor2) {
          if (this._ignore) {
            this._ignore = false;
          } else {
            if (!cursor2) {
              cursor2 = cursor;
            }
            if (cursor2 && cursor2 < 0) {
              cursor2 = this.getValue() && this.getValue().length || 0;
            }

            if (this.isInTable() && !this.isEnabled()) { // fix for GBC-1170
              cursor = cursor2 = 0;
            }

            var oldCursors = this.getCursors();
            if (this._inputElement && (oldCursors.start !== cursor ||
                oldCursors.end !== cursor2)) { // fix for ie11, gbc-393
              this._inputElement.setCursorPosition(cursor, cursor2);
            }
          }
        },

        getCursors: function() {
          var cursors = {
            start: 0,
            end: 0
          };
          try {
            cursors.start = this._inputElement.selectionStart;
            cursors.end = this._inputElement.selectionEnd;
          } catch (ignore) {
            // Some input types don't allow cursor manipulation
          }
          return cursors;
        },

        /**
         * @param {boolean} isPassword true if the widget should be in 'password' mode, false otherwise
         */
        setIsPassword: function(isPassword) {
          if (!!isPassword) {
            this._inputElement.setAttribute("type", "password");
          } else {
            this._inputElement.setAttribute("type", "text");
            this.setType(this._inputType);
          }
        },

        /**
         * @returns {boolean} true if the widget is in 'password' mode, false otherwise
         */
        isPassword: function() {
          return this._inputElement.getAttribute("type") === "password";
        },

        _isMaxLength: function() {
          return this._maxLength !== -1 && this._inputElement.value.length >= this._maxLength &&
            this._inputElement.selectionStart === this._inputElement.selectionEnd;
        },

        /**
         * Used to manage the keyboardHint.
         * @param {string} valType the type attribute value to set
         */
        setType: function(valType) {
          this._inputType = valType;
          if (!this.isPassword()) {
            this._inputElement.setAttribute("type", valType);
            if (window.browserInfo.isFirefox) {
              // sad old browser patch
              this._inputElement.setAttribute("step", valType === "number" ? "any" : null);
            }
          }
        },
        /**
         * @returns {String} this Edit current type
         */
        getType: function() {
          return this._inputType;
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          $super.setFocus.call(this);
          this._inputElement.domFocus();
          var dropdown = context.DropDownService.getCurrentContainerDropDown();
          // close previously opened dropdown. case occur when tabing with completer open
          if (dropdown && !dropdown.getParentWidget().hasFocus()) {
            dropdown.show(false);
          }
        },

        hasCompleter: function() {
          return this.getCompleterWidget() !== null;
        },

        getCompleterWidget: function() {
          return this._completerWidget;
        },

        /**
         * Will add a completer to the edit
         */
        addCompleterWidget: function() {
          if (!this._completerWidget) {
            this._completerWidget = cls.WidgetFactory.create("Completer");
            this._completerWidget.addCompleterWidget(this);
            this._completerWidget.onCurrentChildrenChange(function(value) {
              this.setValue(value, true);
            }.bind(this));
          }
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
        },

        /**
         * Defines a placeholder text
         * @param placeholder
         */
        setPlaceHolder: function(placeholder) {
          this._inputElement.setAttribute("placeholder", placeholder);
        }
      };
    });
    cls.WidgetFactory.register('Edit', cls.EditWidget);
  });
