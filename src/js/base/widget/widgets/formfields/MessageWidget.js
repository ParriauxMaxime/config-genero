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

modulum('MessageWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Message Widget to display information as toated popups
     * @class classes.MessageWidget
     * @extends classes.TextWidgetBase
     */
    cls.MessageWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.MessageWidget.prototype */
      return {
        __name: 'MessageWidget',

        /**
         * Content of the message
         * @type {String}
         * @private
         */
        _text: '',

        /**
         * Is the message is displayed with html formatting
         * @type {Boolean}
         * @private
         */
        _htmlFormat: false,

        /**
         * Timer to handle display time
         * @private
         */
        _currentTimeout: null,

        /**
         * Time before hiding message
         * 0  : always show
         * -1 : always hide
         * @type {number}
         */
        _displayTime: 10,

        /**
         * @inheritDoc
         */
        _initElement: function() {
          $super._initElement.call(this);
          this._displayTime = gbc.constants.theme['gbc-message-display-time'] ? parseInt(gbc.constants.theme[
            'gbc-message-display-time'], 10) : this._displayTime;

          this._element.on('click.MessageWidget', this._onClick.bind(this));
        },

        /**
         * @inheritDoc
         */
        destroy: function() {
          this._element.off('click.MessageWidget');
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        _onClick: function(event) {
          this.setHidden(true);
        },

        /**
         * Set the message text
         * @param {string} text sets the text to display
         */
        setText: function(text) {
          this._text = text;
          this._refreshText();
        },

        /**
         * Handle text reformatting
         * @private
         */
        _refreshText: function() {
          if (this._htmlFormat) {
            this._element.innerHTML = this._text;
          } else {
            this._element.textContent = this._text;
          }

          if (this._text.trim().length <= 0) {
            this.setHidden(true);
          } else {
            this.setHidden(false);
          }
          if (this.isReversed()) {
            var ui = this.getUserInterfaceWidget();
            if (ui) {
              var left = ui.getElement().getBoundingClientRect().left;
              this.setStyle({
                'left': (left + 12) + 'px'
              });
            }
          }
        },

        /**
         * Get the current text
         * @returns {string} the displayed text
         */
        getText: function() {
          return this._element.textContent;
        },

        /**
         * Hide / show the message
         * @param {boolean} hidden state
         */
        setHidden: function(hidden) {
          // Message text is empty or display time is 0, hide it
          if (this._text.trim().length <= 0 || this._displayTime < 0) {
            hidden = true;
          }
          var disp = this._displayTime * 1000;
          // Handle hide timeout only if display time is positive
          if (this._displayTime > 0) {
            if (this._hidden !== hidden) {
              $super.setHidden.call(this, hidden);
              if (this._currentTimeout !== null) {
                clearTimeout(this._currentTimeout);
                this._currentTimeout = null;
              }
              if (!hidden) {
                this._currentTimeout = setTimeout(function() {
                  this.setHidden(true);
                  this._currentTimeout = null;
                }.bind(this), disp);
              }
            }
          } else {
            $super.setHidden.call(this, hidden);
          }
        },

        /**
         * Set message formatting as html
         * @param {Boolean} html or not?
         */
        setHtmlFormat: function(html) {
          if (this._htmlFormat !== html) {
            this._htmlFormat = html;
            this._refreshText();
          }
        }
      };
    });
    cls.WidgetFactory.register('Message', cls.MessageWidget);
  });
