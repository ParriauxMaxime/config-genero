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

modulum('PageTitleWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Page title widget.
     * @class classes.PageTitleWidget
     * @extends classes.WidgetBase
     */
    cls.PageTitleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.PageTitleWidget.prototype */
      return {
        __name: "PageTitleWidget",

        /**
         * image widget (if present)
         * @type {Element}
         */
        _image: null,
        clickHandler: null,
        closeHandler: null,
        _titleElement: null,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._titleElement = this._element.getElementsByClassName("mt-tab-title-text")[0];
          this._element.on('click.PageTitleWidget', function(event) {
            this.emit(context.constants.widgetEvents.click);
          }.bind(this));
        },

        _initLayout: function() {
          // no layout
        },

        destroy: function() {
          if (this.clickHandler) {
            this.clickHandler();
          }
          if (this.closeHandler) {
            this.closeHandler();
          }
          this._element.off("click.PageTitleWidget");
          if (this._image) {
            this._image.destroy();
            this._image = null;
          }
          $super.destroy.call(this);
        },

        /**
         * @param {string} text the text to display
         */
        setText: function(text) {
          this._titleElement.textContent = text.replace(/&(.)/g, "$1");
        },

        /**
         * @returns {string} the text to display
         */
        getText: function() {
          return this._titleElement.textContent;
        },

        /**
         * @param {string} image the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         */
        setImage: function(image) {
          if (!this._image) {
            this._image = cls.WidgetFactory.create("Image");
            this._element.prependChild(this._image.getElement());
          }
          this._image.setHidden(true);
          if (image && image !== "") {
            this._image.setSrc(image);
            this._image.setHidden(false);
          }
        },

        /**
         * @returns {string} the URL of the displayed image or a font-image URL: font:[fontname]:[character]:[color]
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },

        /**
         * @param {boolean} closable true if the tab is closable, false otherwise
         */
        setClosable: function(closable) {
          if (closable) {
            var closeBtn = document.createElement("span");
            closeBtn.addClass("zmdi");
            closeBtn.addClass("zmdi-close-circle");
            closeBtn.addClass("close");
            this._element.appendChild(closeBtn);
            closeBtn.on('click.PageTitleWidget', function(evt) {
              evt.stopPropagation();
              this.emit(gbc.constants.widgetEvents.close, this);
            }.bind(this));
          } else {
            this._element.getElementsByClassName("close")[0].remove();
          }
        },

        /**
         * @returns {boolean} true if the tab is closable, false otherwise
         */
        isClosable: function() {
          return !!this._element.getElementsByClassName("close")[0];
        },

        /**
         * @param {boolean} current displays the current tab indicator
         */
        setCurrent: function(current) {
          this._element.toggleClass("mt-tab-current", !!current);
        },

        /**
         * @returns {boolean} true if the current tab indicator is displayed
         */
        isCurrent: function() {
          return this._element.hasClass("mt-tab-current");
        }
      };
    });
    cls.WidgetFactory.register('PageTitle', cls.PageTitleWidget);
  });
