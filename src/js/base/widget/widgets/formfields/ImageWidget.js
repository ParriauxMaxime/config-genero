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

modulum('ImageWidget', ['ColoredWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Image widget.
     * @class classes.ImageWidget
     * @extends classes.ColoredWidgetBase
     */
    cls.ImageWidget = context.oo.Class(cls.ColoredWidgetBase, function($super) {
      /** @lends classes.ImageWidget.prototype */
      return {
        __name: "ImageWidget",
        /**
         * @type {string}
         */
        _src: null,
        _defaultColor: null,
        _autoScale: false,
        _gotFirstInitialImage: false,
        _firstInitialSizing: true,
        _initialAutoscaling: false,
        _img: null,
        _border: null,
        _standalone: false,
        _hasContent: false,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ImageLayoutEngine(this);
        },

        _initElement: function() {
          $super._initElement.call(this);

          //proxy click event
          this._element.on('click.ImageWidget', this._onClick.bind(this));
          this._border = document.createElement("div");
          this._border.addClass("gbc_ImageWidget_border");
        },
        destroy: function() {
          this._element.off('click.ImageWidget');
          $super.destroy.call(this);
        },

        _onClick: function(event) {
          this.emit(context.constants.widgetEvents.requestFocus, event);
          this.emit(context.constants.widgetEvents.click, event);
        },

        setStandaloneImage: function(standalone) {
          this._standalone = standalone;
          this._element.toggleClass("gbc_withBorder", !!standalone);
          this._element.toggleClass("gbc_selfImage", !!standalone);
        },

        /**
         * If image has action, change cursor
         */
        setClickableImage: function(clickable) {
          if (clickable) {
            this.addClass("clickable");
          } else {
            this.removeClass("clickable");

          }
        },
        /**
         * ShortCut for setSrc
         * This is used in the context of an Image FormField
         * @param {string} val the URL of the image to display or a font-image URL: font:[fontname]:[character]:[color]
          @see setSrc
         */
        setValue: function(val) {
          this.setSrc(val);
        },

        /**
         * Shortcut for getSrc
         * This is used in the context of an Image FormField
         * @returns {string} the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         * @see getSrc
         */
        getValue: function() {
          return this.getSrc();
        },

        /**
         * ShortCut for setSrc
         * This is used in the context of a Static Image
         * @param {string} image the URL of the image to display or a font-image URL: font:[fontname]:[character]:[color]
         * @see setSrc
         */
        setImage: function(image) {
          this.setSrc(image);
        },

        /**
         * Shortcut for getSrc
         * This is used in the context of a Static FormField
         * @returns {string} the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         * @see getSrc
         */
        getImage: function() {
          return this.getSrc();
        },

        isFontImage: function() {
          if (this._src) {
            return this._src.startsWith("font:");
          } else {
            return false;
          }
        },

        /**
         * @param {string} src the URL of the image to display or a font-image URL: font:[fontname]:[character]:[color]
         */
        setSrc: function(src) {
          this.getLayoutInformation().invalidateMeasure();
          if (src !== this._src) {
            var old = this._src,
              initial = this.getLayoutInformation().getSizePolicyConfig().isInitial();
            this._src = src;
            if (initial && this._gotFirstInitialImage && old !== null && src !== null) {
              this._firstInitialSizing = false;
            }
            if (initial && old === null && src !== null) {
              this._gotFirstInitialImage = true;
            }

            this._updateImage();
          }
        },

        /**
         * @returns {string} the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         */
        getSrc: function() {
          return this._src;
        },

        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          $super.setTitle.call(this, title);
          this._element.setAttribute("alt", title);
        },

        setStretch: function(stretch) {
          this._element.toggleClass("stretch", stretch);
        },

        /**
         * Forces the image to be stretched to fit in the area reserved for the image.
         * @param {Boolean} setted true : autoScale , false: default
         */
        setAutoScale: function(setted) {
          if (setted !== this._autoScale) {
            this._autoScale = setted;
            this._updateImage();
          }
        },

        setDefaultColor: function(color) {
          this._defaultColor = color;
        },

        setFocus: function() {
          this._element.domFocus();
        },

        setAlignment: function(y, x) {
          var pos = {
            "align-items": y === "verticalCenter" ? "center" : (y === "bottom" ? "flex-end" : "flex-start"),
            "justify-content": x === "horizontalCenter" ? "center" : (x === "right" ? "flex-end" : "flex-start")
          };
          this.setStyle(pos);
        },

        _updateImage: function() {
          if (this._hasContent) {
            this._element.empty();
            this._hasContent = false;
          }
          if (this._img) {
            this._img.off("error.ImageWidget");
            this._img.off("load.ImageWidget");
            this._img = null;
          }
          var backgroundImage = null;
          var backgroundSize = null;
          var backgroundRepeat = null;
          var backgroundPosition = null;
          var width = null;
          var height = null;

          if (!!this._src) {

            if (this._src.startsWith("font:")) {
              var pattern = /font:([^:]+).ttf:([^:]+):?([^:]*)/;
              var fontName = this._src.match(pattern)[1];
              var character = this._src.match(pattern)[2];
              var color = this._src.match(pattern)[3] || this._defaultColor;

              if (!!fontName && !!character) {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("viewBox", '0 0 100 100');
                // to left align svg, we need to set xMin, otherwise with a 100% width viewBox it will be centered
                svg.setAttribute("preserveAspectRatio", "xMinYMid meet");
                var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("text-anchor", 'middle');
                // EDGE & IE doesn't support dominant-baseline central attribute, so we need to center using another way
                if (window.browserInfo.isEdge || window.browserInfo.isIE) {
                  text.setAttribute("dy", '0.7ex');
                } else {
                  text.setAttribute("dominant-baseline", 'central');
                }
                text.setAttribute("x", '50');
                text.setAttribute("y", '50');
                text.setAttribute("font-size", '100');
                text.setAttribute("font-family", "image2font_" + fontName);
                text.textContent = String.fromCharCode("0x" + character);
                if (!!color) {
                  text.setAttribute("fill", color);
                }
                svg.appendChild(text);
                this._element.appendChild(svg);
                this._hasContent = true;
                this.emit(context.constants.widgetEvents.ready);
              }
              this.getElement().toggleClass("gbc_fixedSvg", !this._autoScale);
            } else {
              var isInitial = this.getLayoutInformation().getSizePolicyConfig().isInitial();
              if (this._inTable || this._autoScale && (!isInitial || !this._firstInitialSizing)) {
                backgroundImage = "url('" + this._src + "')";
                backgroundSize = "contain";
                backgroundRepeat = "no-repeat";
                width = "100%";
                height = "100%";
                backgroundPosition = this.getStart();
                this.emit(context.constants.widgetEvents.ready);
              } else {
                this._img = document.createElement("img");
                this._img.on("error.ImageWidget", this._onError.bind(this));
                this._img.setAttribute("src", this._src);
                this._img.on("load.ImageWidget", this._onLoad.bind(this));
                this._element.appendChild(this._img);
              }
              this._hasContent = true;
            }
            this._element.toggleClass("gbc_autoScale", this._autoScale);
          }
          if (this._standalone) {
            this._element.appendChild(this._border);
          }
          this.setStyle({
            "background-image": backgroundImage,
            "background-size": backgroundSize,
            "background-repeat": backgroundRepeat,
            "background-position": backgroundPosition,
            "width": width
          });
          if (this.__charMeasurer) {
            this._element.appendChild(this.__charMeasurer);
          }
        },
        _onError: function() {
          this._img.off("error.ImageWidget");
          this._img.off("load.ImageWidget");
          if (!!this._element) {
            this._element.addClass("hidden");
          }
        },
        _onLoad: function() {
          this._img.off("error.ImageWidget");
          this._img.off("load.ImageWidget");
          if (!!this._element) {
            this._layoutEngine.invalidateMeasure();
            var w = this._img.naturalWidth,
              h = this._img.naturalHeight;
            this._element.toggleClass("gbc_ImageWidget_wider", w > h).toggleClass("gbc_ImageWidget_higher", w <= h);
            var isInitial = this.getLayoutInformation().getSizePolicyConfig().isInitial();
            if (isInitial && this._firstInitialSizing) {
              if (this._autoScale) {
                this._initialAutoscaling = true;
              } else {
                this.getLayoutEngine()._needMeasure = true;
              }
            }
            this.emit(context.constants.widgetEvents.ready);
          }
        },
        _whenLayouted: function() {
          if (this._initialAutoscaling) {
            this._initialAutoscaling = false;
            this._firstInitialSizing = false;
            this._updateImage();
          }
        }
      };
    });
    cls.WidgetFactory.register('Image', cls.ImageWidget);
  });
