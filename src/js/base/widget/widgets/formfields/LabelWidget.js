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

modulum('LabelWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Label widget.
     * @class classes.LabelWidget
     * @extends classes.TextWidgetBase
     */
    cls.LabelWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.LabelWidget.prototype */
      return {
        __name: "LabelWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        /**
         * @type {Element}
         */
        _textContainer: null,
        _hasHTMLContent: false,
        _value: null,
        _displayFormat: null,

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
          this._element.on('click.LabelWidget', cls.WidgetBase._onRequestFocus.bind(this));
          this._element.on('click.LabelWidget', cls.WidgetBase._onClick.bind(this));
        },

        destroy: function() {
          this._element.off('click.LabelWidget');
          $super.destroy.call(this);
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
        setValue: function(value) {
          var formattedValue = value; //this.getFormattedValue(value, this._displayFormat);
          if (this._layoutInformation) {
            this._layoutInformation.invalidateInitialMeasure((this._value === null) && formattedValue !== null);
          }
          this._value = formattedValue;
          if (this._hasHTMLContent === true) {
            this._textContainer.innerHTML = formattedValue;
          } else {
            var newValue = (!!formattedValue || formattedValue === 0 || formattedValue === false) ? formattedValue : '\u00a0';
            this._textContainer.empty();
            this._textContainer.appendChild(document.createTextNode(newValue));
          }
          if (this._layoutEngine) {
            this._layoutEngine.invalidateMeasure();
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          if (this._hasHTMLContent === true) {
            return this._textContainer.innerHTML;
          } else {
            var content = this._textContainer.textContent;
            if (content === '\u00a0') {
              return "";
            }
            return content;
          }
        },

        setFocus: function() {
          this._element.domFocus();
        },

        setHtmlControl: function(jcontrol) {
          jcontrol.innerHTML = this.getValue();
          jcontrol.addClass("gbc-label-text-container");
          this._textContainer.replaceWith(jcontrol);
          this._textContainer = jcontrol;
          this._hasHTMLContent = true;
        }
      };
    });
    cls.WidgetFactory.register('Label', cls.LabelWidget);
  });
