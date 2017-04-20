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

modulum('TextWidgetBase', ['ColoredWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for all widgets handling text attributes
     * @class classes.TextWidgetBase
     * @extends classes.ColoredWidgetBase
     */
    cls.TextWidgetBase = context.oo.Class(cls.ColoredWidgetBase, function($super) {
      /** @lends classes.TextWidgetBase.prototype */
      return {
        __name: "TextWidgetBase",
        __virtual: true,
        _fontFamily: "",
        _fontWeight: "",
        _fontStyle: "",
        _fontSize: "",
        _textAlign: "",
        _textTransform: "none",
        _textDecoration: "",
        _editing: false,

        $static: {
          _onKeyDown: function(event) {
            this.setEditing(true);
            this.emit(context.constants.widgetEvents.keyDown, event, false);
          }
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/font-family
         * @param {String} fontFamily the font family to use. null restores the default value.
         */
        setFontFamily: function(fontFamily) {
          if (this._fontFamily !== fontFamily) {
            this._fontFamily = fontFamily;
            this.setStyle({
              "font-family": fontFamily
            });
          }
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/font-family
         * @returns {String} the used font family
         */
        getFontFamily: function() {
          return this.getStyle("font-family");
        },

        /**
         * @see http://www.w3org/wiki/CSS/Properties/font-weight
         * @param weight {String} a CSS font weight value. null restores the default value.
         */
        setFontWeight: function(weight) {
          if (this._fontWeight !== weight) {
            this._fontWeight = weight;
            this.setStyle({
              "font-weight": weight
            });
          }
        },

        /**
         * @see http://www.w3org/wiki/CSS/Properties/font-weight
         * @returns {String} a CSS font weight value
         */
        getFontWeight: function() {
          return this.getStyle("font-weight");
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/font-style
         * @param style {String} a CSS font style value. null restores the default value.
         */
        setFontStyle: function(style) {
          if (this._fontStyle !== style) {
            this._fontStyle = style;
            this.setStyle({
              "font-style": style
            });
          }
        },

        /**
         * @see http://www.w3org/wiki/CSS/Properties/font-style
         * @returns {String} a CSS font style value
         */
        getFontStyle: function() {
          return this.getStyle("font-style");
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/font-size
         * @param size {String} a CSS font size value. null restores the default value.
         */
        setFontSize: function(size) {
          if (this._fontSize !== size) {
            this._fontSize = size;
            this.setStyle({
              "font-size": size
            });
          }
        },

        /**
         * @see http://www.w3org/wiki/CSS/Properties/font-size
         * @returns {String} a CSS font size value
         */
        getFontSize: function() {
          return this.getStyle("font-size");
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @param align {String} a CSS text alignment. null restores the default value.
         */
        setTextAlign: function(align) {
          if (this._textAlign !== align) {
            this._textAlign = align;
            this.setStyle({
              "text-align": align
            });
          }
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @returns {String} a CSS text alignment
         */
        getTextAlign: function() {
          return this.getStyle("text-align");
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

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-transform
         * @param transform {String} a CSS text transform. null restores the default value.
         */
        getTextTransform: function() {
          return this._textTransform;
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-decoration
         * @return {String} a CSS text decoration
         */
        getTextDecoration: function() {
          return this.getStyle("text-decoration");
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-decoration
         * @return {String} a CSS text decoration
         */
        setTextDecoration: function(decoration) {
          if (this._textDecoration !== decoration) {
            this._textDecoration = decoration;
            this.setStyle({
              "text-decoration": decoration
            });
          }
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
         * format the value to be displayed as defined
         * @param format
         * @protected
         */
        getFormattedValue: function(value, format) {
          if (value && format) {
            var varDisplay = null;
            var varType = null;
            if (value) {
              varType = format.toLowerCase();
              var pattern = /(\w+)(\((.*)\))?/;
              var match = varType.match(pattern);
              varType = match[1];
              varDisplay = match[2];

              switch (varType) {
                case "decimal":
                  if (varDisplay) {
                    var decimalPattern = /(\d+)+(,(\d+))*/;
                    var matchDecimal = varDisplay.match(decimalPattern);
                    var decimal = matchDecimal[3];
                    var digits = matchDecimal[1];
                    var parsedValue = parseFloat(value);
                    if (!Number.isNaN(parsedValue)) {
                      var fixedParsedValue = decimal ? parsedValue.toFixed(decimal) : parsedValue;
                      if (typeof(value) === "string") {
                        //keep initial separator
                        return value.indexOf(",") > 0 ? fixedParsedValue.replace(".", ",") : fixedParsedValue;
                      } else {
                        return fixedParsedValue;
                      }
                    }
                  }
                  break;
              }
            }
          }
          return value;
        },
      };
    });
  });
