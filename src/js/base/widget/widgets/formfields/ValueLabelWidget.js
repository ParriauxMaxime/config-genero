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

modulum('ValueLabelWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Label widget composed of Text and Value
     * @class classes.ValueLabelWidget
     * @extends classes.TextWidgetBase
     */
    cls.ValueLabelWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.ValueLabelWidget.prototype */
      return {
        __name: "ValueLabelWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _value: null,
        /**
         * @type Element
         */
        _textContainer: null,
        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._textContainer = this._element.getElementsByTagName("span")[0];
          this._element.on('click.ValueLabelWidget', this._onClick.bind(this));
        },

        _onClick: function(event) {
          this.emit(context.constants.widgetEvents.click, event);
        },
        destroy: function() {
          this._element.off('click.ValueLabelWidget');
          this._textContainer = null;
          $super.destroy.call(this);
        },
        /**
         * @param {string} value sets the value to display
         */
        setText: function(value) {
          this._textContainer.textContent = value;
        },

        /**
         * @returns {string} the displayed value
         */
        getText: function() {
          return this._textContainer.textContent;
        },

        /**
         * @param {string} value sets the value to display
         */
        setValue: function(value) {
          this._value = value;
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          return this._value;
        },

        setFocus: function() {
          this._element.domFocus();
        }
      };
    });
    cls.WidgetFactory.register('ValueLabel', cls.ValueLabelWidget);
  });
