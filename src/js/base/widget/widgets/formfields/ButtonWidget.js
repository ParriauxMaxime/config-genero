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

modulum('ButtonWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.ButtonWidget
     * @extends classes.TextWidgetBase
     */
    cls.ButtonWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.ButtonWidget.prototype */
      return {
        __name: "ButtonWidget",

        /**
         * @protected
         * @type {classes.ImageWidget}
         */
        _image: null,

        /**
         * @protected
         * @type {Element}
         */
        _textElement: null,

        /**
         * @protected
         * @type {Element}
         */
        _mtButton: null,

        /**
         * Type of the button (normal, link or commandLink)
         * @protected
         * @type {null|string}
         */
        _buttonType: null,

        /** @type {boolean} */
        _autoScale: false,

        /**
         * @inheritDoc
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutInformation.getSizePolicyConfig().initial._shrinkable = false;
          this._layoutInformation.getSizePolicyConfig().dynamic._shrinkable = false;
          this.getLayoutInformation()._fixedSizePolicyForceMeasure = true;
          this._layoutEngine = new cls.ButtonLayoutEngine(this);
        },

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._mtButton = this._element.getElementsByClassName('mt-button')[0];
          this._textElement = this._mtButton.getElementsByTagName('span')[0];

          this._element.on('click.ButtonWidget', this._onClick.bind(this));

          context.keyboard(this._element).bind(['enter', 'space'], this._onKeys.bind(this));
        },

        /**
         * client QA code
         */
        actionQAReady: function() {
          if (this.__qaReadyAction) {
            this.__qaReadyAction = false;
            this.emit(context.constants.widgetEvents.click);
          }
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          context.keyboard.release(this._element);
          if (this._image) {
            this._image.destroy();
          }
          this._image = null;
          this._textElement = null;
          this._element.off('click.ButtonWidget');
          this._mtButton = null;
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _onClick: function(event) {
          // Disable click when not clicking on text nor image
          if (this._buttonType === 'link' && (event.target.tagName.toLowerCase() !== 'span' && event.target.tagName.toLowerCase() !==
              'img')) {
            return;
          }
          context.WidgetService.cursorX = event.clientX;
          context.WidgetService.cursorY = event.clientY;

          if (this.isEnabled()) {
            this.emit(context.constants.widgetEvents.click, event);
          }
        },

        /**
         * @inheritDoc
         */
        _onKeys: function(event) {
          if (this.isEnabled()) {
            this.emit(context.constants.widgetEvents.click, event);
          }
          return false;
        },

        /**
         * @param {string} text text to display in the button
         */
        setText: function(text) {
          this.getElement().toggleClass('hasText', text.length !== 0);
          this._textElement.textContent = text;

          // client QA code
          if (gbc.qaMode && ['qa_dialog_ready', 'qa_menu_ready'].indexOf(text) >= 0) {
            this.__qaReadyAction = true;
            context.SessionService.getCurrent().getCurrentApplication().layout.afterLayout(this.actionQAReady.bind(this));
          }
        },

        /**
         * @returns {string} the text displayed in the button
         */
        getText: function() {
          return this._textElement.textContent;
        },

        /**
         * @param {string} image the URL of the image to display
         */
        setImage: function(image) {
          if (image.length !== 0) {
            if (!this._image) {
              this._image = cls.WidgetFactory.create('Image');
              var imageContainer = document.createElement('div');
              imageContainer.addClass('gbc_imageContainer');
              imageContainer.appendChild(this._image.getElement());
              this._mtButton.prependChild(imageContainer);
              this.setAutoScale(this._autoScale);
            }
            this._image.setSrc(image);
            this._image.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
            this.getElement().addClass('hasImage');
          } else if (this._image) {
            this._image.getElement().parentElement.remove();
            this._image = null;
          }
        },

        /**
         * Callback once image has finish loading
         * @private
         */
        _imageLoaded: function() {
          this._layoutEngine.invalidateMeasure();
          this.emit(context.constants.widgetEvents.ready);
        },

        /**
         * @returns {string} the URL of the displayed image
         */
        getImage: function() {
          if (this._image) {
            return this._image.getSrc();
          }
          return null;
        },

        /**
         * Define the button as autoscaled or not
         * @param enabled
         */
        setAutoScale: function(enabled) {
          this._autoScale = enabled;
          if (this._image) {
            this._image.setAutoScale(this._autoScale);
            this._image.getElement().parentElement.toggleClass('gbc_autoScale', !!this._autoScale);
          }
        },

        /**
         * @inheritDoc
         */
        setFocus: function() {
          if (this.isHidden() || (this.getParentWidget() && this.getParentWidget().isHidden())) {
            var applicationWidget = context.SessionService.getCurrent().getCurrentApplication().getUI().getWidget();
            if (applicationWidget) {
              applicationWidget.getElement().domFocus();
            }
          } else {
            this._mtButton.domFocus();
          }
          $super.setFocus.call(this);
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._mtButton.toggleClass('disabled', !enabled);
        },

        /**
         * @inheritDoc
         */
        setColor: function(color) {
          this.setStyle('.mt-button', {
            'color': !!color ? color + ' !important' : null
          });
        },

        /**
         * Set button style to flat
         * @param flat
         */
        setFlat: function(flat) {
          if (flat) {
            this._mtButton.addClass('mt-button-flat');
          } else {
            this._mtButton.removeClass('mt-button-flat');
          }
        },

        /**
         * @inheritDoc
         */
        getColor: function() {
          return this.getStyle('.mt-button', 'color');
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          this.setStyle('.mt-button', {
            'background-color': !!color ? color + ' !important' : null
          });
        },

        /**
         * @inheritDoc
         */
        getBackgroundColor: function() {
          return this.getStyle('.mt-button', 'background-color');
        },

        /**
         * Align the content of the button
         * @param {string} align
         */
        setContentAlign: function(align) {
          this._element.toggleClass('content-left', align === 'left')
            .toggleClass('content-right', align === 'right');
        },

        /**
         * Hide the button text
         * @param textHidden
         */
        setTextHidden: function(textHidden) {
          this._element.toggleClass('text-hidden', !!textHidden);
        },

        /**
         * Define the button type (normal, link or commandLink)
         * @param {string} buttonType
         */
        setButtonType: function(buttonType) {
          this._buttonType = buttonType;
          this._mtButton.removeClass('buttonType_*'); //TODO?
          this._mtButton.addClass('buttonType_' + buttonType);
          this.removeClass('buttonType_*');
          this.addClass('buttonType_' + buttonType);
        }
      };
    });
    cls.WidgetFactory.register('Button', cls.ButtonWidget);
    cls.WidgetFactory.register('Action', cls.ButtonWidget);
    cls.WidgetFactory.register('MenuAction', cls.ButtonWidget);
  });
