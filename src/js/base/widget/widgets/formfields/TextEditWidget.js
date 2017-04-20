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

modulum('TextEditWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * TextEdit widget.
     * @class classes.TextEditWidget
     * @extends classes.TextWidgetBase
     */
    cls.TextEditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.TextEditWidget.prototype */
      return {
        __name: "TextEditWidget",
        /**
         * @type Element
         */
        _hasHTMLContent: false,
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _isReadOnly: false,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().dynamic = cls.SizePolicy.Initial();
            this._layoutInformation.forcedMinimalWidth = 20;
            this._layoutInformation.forcedMinimalHeight = 20;
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName("textarea")[0];
          this._initEvents();

          context.keyboard(this._element).bind(['enter', 'up', 'down'], this._onKeys.bind(this));
          this._isReadOnly = false;
          this._inputElement.on('keydown.EditWidget', cls.TextWidgetBase._onKeyDown.bind(this));
        },

        _initEvents: function() {
          this._element.on('click.TextEditWidget', cls.WidgetBase._onRequestFocus.bind(this));
          this._element.on('click.TextEditWidget', cls.WidgetBase._onClick.bind(this));
          this._inputElement.on('keyup.TextEditWidget', cls.WidgetBase._onKeyUp.bind(this));

          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.TextEditWidget', cls.WidgetBase._onSelect.bind(this));

          var keyboardInstance = context.keyboard(this._inputElement);
          keyboardInstance.bind(['home'], this._onHome.bind(this));
          keyboardInstance.bind(['end'], this._onEnd.bind(this));
        },

        destroy: function() {
          context.keyboard.release(this._inputElement);
          context.keyboard.release(this._element);
          this._inputElement.off("mousedown.TextEditWidget");
          this._element.off('click.TextEditWidget');
          this._inputElement.off('keyup.TextEditWidget');
          this._inputElement = null;
          $super.destroy.call(this);
        },

        _onKeys: function(evt) {
          evt.stopPropagation();
        },
        _onHome: function(event) {
          event.stopPropagation();
          this.setCursors(0);
        },
        _onEnd: function(event) {
          event.stopPropagation();
          var len = this.getValue().length;
          this.setCursors(len);
        },

        /**
         * @param {string} value the value to display
         */
        setValue: function(value) {
          this.setEditing(false);
          if (this._hasHTMLContent === true) {
            this._inputElement.innerHTML = value;
          } else {
            this._inputElement.value = value;
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          if (this._hasHTMLContent === true) {
            return this._inputElement.innerHTML;
          } else {
            return this._inputElement.value;
          }
        },

        getInput: function() {
          return this._inputElement;
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
            if (this._hasHTMLContent) {
              this._inputElement.setAttribute("contenteditable", false);
            } else {
              this._inputElement.setAttribute("readonly", "readonly");
            }
          } else {
            if (this._hasHTMLContent) {
              this._inputElement.setAttribute("contenteditable", true);
            } else {
              this._inputElement.removeAttribute("readonly");
            }
          }
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength) {
          this._inputElement.setAttribute("maxlength", maxlength);
        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          return this._inputElement.getIntAttribute("maxlength");
        },

        /**
         * When cursor2 === cursor, it is a simple cursor set
         * @param {int} cursor the selection range beginning
         * @param {int} cursor2 the selection range end, if any
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          } else if (cursor2 === -1) {
            cursor2 = cursor;
          }
          this._inputElement.setCursorPosition(cursor, cursor2);
        },

        getCursors: function() {
          return {
            start: this._inputElement.selectionStart,
            end: this._inputElement.selectionEnd
          };
        },

        /**
         *
         * @param {Element} jcontrol
         */
        setHtmlControl: function(jcontrol) {
          if (this.isEnabled()) {
            jcontrol.setAttribute("contenteditable", true);
          }
          jcontrol.innerHTML = this.getValue();
          this._inputElement.replaceWith(jcontrol);
          this._hasHTMLContent = true;
          this._inputElement = jcontrol;
          this._initEvents();
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._inputElement.domFocus();
          $super.setFocus.call(this);
        },
        setRows: function(rows) {
          this._inputElement.setAttribute("rows", rows || 1);
        },

        setWrapPolicy: function(format) {
          this._inputElement.toggleClass("breakword", format === "anywhere");
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
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
    cls.WidgetFactory.register('TextEdit', cls.TextEditWidget);
  });
