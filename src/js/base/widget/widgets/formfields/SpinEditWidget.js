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

modulum('SpinEditWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * SpinEdit widget.
     * @class classes.SpinEditWidget
     * @extends classes.TextWidgetBase
     */
    cls.SpinEditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.SpinEditWidget.prototype */
      return {
        __name: "SpinEditWidget",
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",
        /**
         * @type Element
         */
        _upArrow: null,
        _downArrow: null,
        _maxLength: -1,
        _step: 1,
        _min: null,
        _max: null,
        _isReadOnly: false,
        _keyboardInstance: null,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName("input")[0];
          this._upArrow = this._element.getElementsByClassName("up")[0];
          this._downArrow = this._element.getElementsByClassName("down")[0];

          this._upArrow.on('click.UpArrowSpinEdit', this._onInputUp.bind(this));
          this._downArrow.on('click.DownArrowSpinEdit', this._onInputDown.bind(this));

          this._element.on('click.SpinEditWidget', cls.WidgetBase._onRequestFocus.bind(this));
          this._inputElement.on('keyup.SpinEditWidget', cls.WidgetBase._onKeyUp.bind(this));

          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.SpinEditWidget', cls.WidgetBase._onSelect.bind(this));
          this._isReadOnly = false;
          this._keyboardInstance = context.keyboard(this._element);
        },

        destroy: function() {
          context.keyboard.release(this._inputElement);
          cls.KeyboardHelper.destroy(this);
          this._inputElement.off("mousedown.SpinEditWidget");
          this._element.off('click.SpinEditWidget');
          this._inputElement.off('keyup.SpinEditWidget');
          this._inputElement.off('keypress.SpinEditWidget');
          this._inputElement = null;
          $super.destroy.call(this);
        },

        _onInputHome: function(evt) {
          var min = this.getMin();
          if (min !== null) {
            this.setValue(min);
            this.emit(context.constants.widgetEvents.change, evt, false);
          } else {
            this.setCursors(0);
            return false; // Do nothing if no min value provided
          }
          return false;
        },
        _onInputEnd: function(evt) {
          var max = this.getMax();
          if (max !== null) {
            this.setValue(max);
            this.emit(context.constants.widgetEvents.change, evt, false);
          } else {
            this.setCursors(this.getValue().toString().length);
            return false; // Do nothing if no max value provided
          }
          return false;
        },
        _onInputUp: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            if (evt) {
              evt.stopPropagation();
            }
            this._increase();
            this.emit(context.constants.widgetEvents.change, event, false);
          }
        },
        _onInputDown: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            if (evt) {
              evt.stopPropagation();
            }
            this._decrease();
            this.emit(context.constants.widgetEvents.change, event, false);
          }
        },
        _onInputPageUp: function(evt) {
          evt.stopPropagation();
          this._increase(10);
          this.emit(context.constants.widgetEvents.change, evt, false);
          return false;
        },
        _onInputPageDown: function(evt) {
          evt.stopPropagation();
          this._decrease(10);
          this.emit(context.constants.widgetEvents.change, evt, false);
          return false;
        },
        _onInputKeypress: function(event) { // keypress on special commands is only raised for firefox
          var isModifier = cls.KeyboardHelper.isSpecialCommand(event);
          var isValid = !isModifier && cls.KeyboardHelper.isDecimal(event) && !this._isMaxLength();

          if (isValid) {
            var value = this._inputElement.value;
            var start = this._inputElement.selectionStart;
            var end = this._inputElement.selectionEnd;
            if (end !== start) {
              value = "";
            }
            var typedChar = String.fromCharCode(event.which);

            isValid = cls.KeyboardHelper.validateNumber(value, start, typedChar, this._min, this._max);

          }
          if (!isValid && !isModifier) {
            event.preventDefault();
          }

        },
        /**
         * @param {number} value the value to display
         */
        setValue: function(value) {
          this._inputElement.value = value;
        },

        /**
         * @returns {number} the displayed value
         */
        getValue: function() {
          var value = parseInt(this._inputElement.value, 10);
          var isDefined = Object.isNumber(value) && !Object.isNaN(value);
          return isDefined ? value : null;
        },

        _increase: function(factor) {
          var curVal = this.getValue();
          if (curVal !== this._max) {
            var newVal = curVal + (this._step * (factor && Object.isNumber(factor) ? factor : 1));
            if (Object.isNumber(this._max) && newVal > this._max) {
              newVal = this._max;
            }
            this.setValue(newVal);
          }
        },

        _decrease: function(factor) {
          var curVal = this.getValue();
          if (curVal !== this._min) {
            var newVal = curVal - (this._step * (factor && Object.isNumber(factor) ? factor : 1));
            if (Object.isNumber(this._min) && newVal < this._min) {
              newVal = this._min;
            }
            this.setValue(newVal);
          }
        },

        /**
         * @param {number} min the minimum allowed value
         */
        setMin: function(min) {
          if (Object.isNumber(min)) {
            this._min = min;
          }
        },

        /**
         * @returns {number} the minimum allowed value
         */
        getMin: function() {
          return this._min;
        },

        /**
         * @param {number} max the maximum allowed value
         */
        setMax: function(max) {
          if (Object.isNumber(max)) {
            this._max = max;
            //this._input.attr('max', max);
          }
        },

        /**
         * @returns {number} the maximum allowed value
         */
        getMax: function() {
          return this._max;
        },

        /**
         * @param {number} step the increment step
         */
        setStep: function(step) {
          var s = step && parseInt(step, 10);
          if (!s || Number.isNaN(s)) {
            s = 1;
          }
          this._step = s;
        },

        /**
         * @returns {number} the increment step
         */
        getStep: function() {
          return this._step;
        },

        _isMaxLength: function() {
          return this._maxLength !== -1 && this._inputElement.value.length >= this._maxLength &&
            this._inputElement.selectionStart === this._inputElement.selectionEnd;
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength, callback) {
          if (maxlength) {
            this._maxLength = maxlength;

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

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
          this._setInputReadOnly(readonly);
        },

        _setInputReadOnly: function(readonly) {
          if (readonly) {
            this._inputElement.setAttribute("readonly", "readonly");
          } else if (this.hasFocus()) {
            this._inputElement.removeAttribute("readonly");
          } else {
            this._inputElement.setAttribute("readonly", "readonly");
          }
        },

        bindKeyEvents: function() {
          this._keyboardInstance.bind(['home'], this._onInputHome.bind(this));
          this._keyboardInstance.bind(['end'], this._onInputEnd.bind(this));
          this._keyboardInstance.bind(['up'], this._onInputUp.bind(this));
          this._keyboardInstance.bind(['down'], this._onInputDown.bind(this));
          this._keyboardInstance.bind(['pageup'], this._onInputPageUp.bind(this));
          this._keyboardInstance.bind(['pagedown'], this._onInputPageDown.bind(this));

          this._inputElement.on('keypress.SpinEditWidget', this._onInputKeypress.bind(this));
        },

        unbindKeyEvents: function() {
          this._keyboardInstance.unbind(['home', 'end', 'up', 'down', 'pageup', 'pagedown']);
          this._inputElement.off('keypress.SpinEditWidget');
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._inputElement.domFocus();
          $super.setFocus.call(this);
        },
        setTitle: function(title) {
          $super.setTitle.call(this, title);
          this._inputElement.setAttribute("title", title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._inputElement.getAttribute("title");
        },

        /**
         * When cursor2 === cursor, it is a simple cursor set
         * @param {int} cursor the selection range beginning
         * @param {int} cursor2 the selection range end, if any
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          }
          if (cursor2 && cursor2 < 0) {
            cursor2 = ("" + this.getValue()).length;
          }
          this._inputElement.setCursorPosition(cursor, cursor2);
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
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
        },

        setFontWeight: function(weight) {
          this.setStyle("input", {
            "font-weight": weight
          });
        },

        getFontWeight: function() {
          return this.getStyle("input", "font-weight");
        },

        setFontStyle: function(style) {
          this.setStyle("input", {
            "font-style": style
          });
        },

        getFontStyle: function() {
          return this.getStyle("input", "font-style");
        },

        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": align
          });
        },

        getTextAlign: function() {
          return this.getStyle("input", "text-align");
        },

        getTextDecoration: function() {
          return this.getStyle("input", "text-decoration");
        },

        setTextDecoration: function(decoration) {
          this.setStyle("input", {
            "text-decoration": decoration
          });
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
    cls.WidgetFactory.register('SpinEdit', cls.SpinEditWidget);
  });
