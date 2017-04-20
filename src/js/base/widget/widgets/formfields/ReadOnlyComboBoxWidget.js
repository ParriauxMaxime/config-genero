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

modulum('ReadOnlyComboBoxWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ReadOnlyComboBoxWidget widget.
     * @class classes.ReadOnlyComboBoxWidget
     * @extends classes.TextWidgetBase
     */
    cls.ReadOnlyComboBoxWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.ReadOnlyComboBoxWidget.prototype */
      return {
        __name: "ReadOnlyComboBoxWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        /**
         * @type {Element}
         */
        _textContainer: null,
        _value: null,
        _valueSet: false,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.forcedMinimalWidth = 16;
            this._layoutInformation.forcedMinimalHeight = 16;
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._textContainer = this._element.getElementsByTagName('span')[0];
          this._element.on('click.ReadOnlyComboBoxWidget', this._onClick.bind(this));
        },

        destroy: function() {
          this._element.off('click.ReadOnlyComboBoxWidget');
          $super.destroy.call(this);
        },

        _onClick: function(event) {
          this.emit(context.constants.widgetEvents.requestFocus, event);
          this.emit(context.constants.widgetEvents.click, event);
        },

        clearChoices: function() {
          this._choices = null;
        },

        /**
         * @param {string|string[]} choices adds a single or a list of choices
         */
        addChoices: function(choices) {
          if (!Array.isArray(choices)) {
            choices = [choices];
          }
          this._choices = choices;
          if (!this._valueSet) {
            this.setValue(this.getValue(), true);
          }
        },

        /**
         * Get text associated to value in choices list
         * @param value
         * @returns {*}
         */
        getChoiceText: function(value) {
          var text;
          for (var i = 0; i < this._choices.length; i++) {
            var choice = this._choices[i];
            if (choice.value === value) {
              text = choice.text;
              break;
            }
          }
          return text;
        },

        /**
         * @param {string} value sets the value to display
         */
        setValue: function(value, force) {
          if (this._value !== value || force) {
            this._value = value;
            this._textContainer.empty();
            var text = this.getChoiceText(value);
            if (text !== undefined) {
              this._valueSet = true;
              this._textContainer.appendChild(document.createTextNode(text));
            } else {
              this._valueSet = false;
            }
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          return this._value;
        },

      };
    });
    cls.WidgetFactory.register('ReadOnlyComboBox', cls.ReadOnlyComboBoxWidget);
  });
