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

modulum('CheckBoxWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Checkbox widget.
     * @class classes.CheckBoxWidget
     * @extends classes.TextWidgetBase
     */
    cls.CheckBoxWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.CheckBoxWidget.prototype */
      return {
        /** @lends classes.CheckBoxWidget */
        __name: "CheckBoxWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        /**
         * @type Element
         */
        _checkboxElement: null,
        /**
         * @type Element
         */
        _labelElement: null,
        /**
         * @protected
         * @type {*}
         */
        _checkedValue: true,
        /**
         * @protected
         * @type {*}
         */
        _uncheckedValue: false,
        /**
         * @protected
         * @type {*}
         */
        _value: false,
        /**
         * the value of the intermediate state
         * @type {string}
         */
        _indeterminateValue: null,
        _threeState: false,
        _focusHandler: null,
        _isReadOnly: false,
        _keyboardInstance: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Dynamic();
            this._layoutInformation.getSizePolicyConfig().fixed = cls.SizePolicy.Dynamic();
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._checkboxElement = this._element.getElementsByClassName("mt-checkbox")[0];
          this._labelElement = this._element.getElementsByClassName("label")[0];

          this._isReadOnly = false;
          this._keyboardInstance = context.keyboard(this._element);

        },

        destroy: function() {
          context.keyboard.release(this._element);
          cls.KeyboardHelper.destroy(this);
          this._element.off('click.CheckBoxWidget');
          $super.destroy.call(this);
        },

        _onClick: function(evt) {
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          this.emit(context.constants.widgetEvents.requestFocus);
          var value = this.getNextValue();
          this.setValue(value);
          this.emit(context.constants.widgetEvents.change, evt, false);
          this.emit(context.constants.widgetEvents.click, evt);
        },
        _onSpace: function(evt) {
          var value = this.getNextValue();
          this.setValue(value);
          this.emit(context.constants.widgetEvents.change, evt, false);
          return false;
        },
        setNotNull: function(notNull) {
          this._threeState = !notNull;
        },

        /**
         * @param {*} indeterminateValue value corresponding to the 'intermediate' state
         */
        setIndeterminateValue: function(indeterminateValue) {
          var old = this._indeterminateValue;
          this._indeterminateValue = indeterminateValue;
          if (this.getValue() === old) {
            this.setValue(indeterminateValue);
          }
        },

        /**
         * @returns value corresponding to the 'checked' state
         */
        getIndeterminateValue: function() {
          return this._indeterminateValue;
        },

        /**
         * @returns {Element} the checkbox input element
         * @private
         */
        _getCheckBox: function() {
          return this._checkboxElement;
        },

        /**
         * @returns {Element} the label element
         * @private
         */
        _getLabel: function() {
          return this._labelElement;
        },

        /**
         * @returns {*} the next value in the cycle
         * @private
         */
        getNextValue: function() {
          var current = this._value;
          if (current === this._indeterminateValue || (!this._threeState && current === this._uncheckedValue)) {
            return this._checkedValue;
          } else if (current === this._checkedValue) {
            return this._uncheckedValue;
          } else {
            if (this._threeState) {
              return this._indeterminateValue;
            }
          }
        },

        /**
         * @returns {string} the text displayed next to the button
         */
        getText: function() {
          return this._getLabel().textContent;
        },

        /**
         * @param {string} text the text displayed next to the button
         */
        setText: function(text) {
          text = !!text ? text : ""; // fix for ie & edge
          this._getLabel().toggleClass("notext", !text);
          this._getLabel().textContent = text;
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @param {*} checkedValue value corresponding to the 'checked' state
         */
        setCheckedValue: function(checkedValue) {
          var old = this._checkedValue;
          this._checkedValue = checkedValue;
          if (this.getValue() === old) {
            this.setValue(checkedValue);
          }
        },

        /**
         * @returns value corresponding to the 'checked' state
         */
        getCheckedValue: function() {
          return this._checkedValue;
        },

        /**
         * @param {*} uncheckedValue value corresponding to the 'checked' state
         */
        setUncheckedValue: function(uncheckedValue) {
          var old = this._uncheckedValue;
          this._uncheckedValue = uncheckedValue;
          if (this.getValue() === old) {
            this.setValue(uncheckedValue);
          }
        },

        /**
         * @returns value corresponding to the 'checked' state
         */
        getUncheckedValue: function() {
          return this._uncheckedValue;
        },

        /**
         * @returns {*} the value associated to the checkbox state
         */
        getValue: function() {
          var checkBox = this._getCheckBox();
          if (checkBox.hasClass("indeterminate")) {
            return this._indeterminateValue;
          } else if (checkBox.hasClass("checked")) {
            return this._checkedValue;
          } else {
            return this._uncheckedValue;
          }
        },

        /**
         * @param {*} value the value corresponding to the checked or unchecked state
         */
        setValue: function(value) {
          this._value = value;
          var checkBox = this._getCheckBox();
          checkBox.toggleClass("indeterminate", value === this._indeterminateValue);
          checkBox.toggleClass("checked", value === this._checkedValue);
        },

        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          this._element.setAttribute("title", title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._element.getAttribute("title");
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._element.domFocus();
          $super.setFocus.call(this);
        },
        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._getCheckBox().toggleClass("disabled", !enabled);
          this._element.off('click.CheckBoxWidget');
          if (enabled) {
            this._element.on('click.CheckBoxWidget', this._onClick.bind(this));
          } else if (this.isInTable()) {
            this._element.on('click.CheckBoxWidget', cls.WidgetBase._onRequestFocus.bind(this));
            this._element.on('click.CheckBoxWidget', cls.WidgetBase._onClick.bind(this));
          }
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
        },

        bindKeyEvents: function() {
          this._keyboardInstance.bind('space', this._onSpace.bind(this));
        },

        unbindKeyEvents: function() {
          this._keyboardInstance.unbind('space');
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        }
      };
    });
    cls.WidgetFactory.register('CheckBox', cls.CheckBoxWidget);
  });
