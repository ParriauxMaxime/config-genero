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

modulum('ButtonEditWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ButtonEdit widget.
     * @class classes.ButtonEditWidget
     * @extends classes.TextWidgetBase
     */
    cls.ButtonEditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.ButtonEditWidget.prototype */
      return {
        __name: "ButtonEditWidget",
        /**
         * @type {classes.EditWidget}
         */
        _edit: null,
        /**
         * @type {classes.ButtonWidget}
         */
        _button: null,
        __dataContentPlaceholderSelector: '.gbc_dataContentPlaceholder',
        _clickHandler: null,
        _focusHandler: null,
        _blurHandler: null,
        _changeHandler: null,
        _buttonClicked: false,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutEngine.setReservedDecorationSpace(2);
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          var opts = {
            inTable: this.isInTable()
          };
          this._edit = cls.WidgetFactory.create("Edit", null, opts);
          this._button = cls.WidgetFactory.create("Button", null, opts);
          // layout engine can be null if _ignoreLayout is true, which happens for widget being in table and not in first row. (cf constructor of WidgetBase)
          // in that case, we do not want to measure image once loaded
          if (!this._ignoreLayout) {
            this._button.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
          }
          this._element.appendChild(this._edit.getElement());
          this._element.appendChild(this._button.getElement());
          this._edit.setParentWidget(this);
          this._button.setParentWidget(this);
          this._clickHandler = this._button.when(context.constants.widgetEvents.click, this._onButtonClick.bind(this));
          this._focusHandler = this._edit.when(context.constants.widgetEvents.requestFocus, this._onEditRequestFocus.bind(this));
          this._blurHandler = this._edit.when(context.constants.widgetEvents.blur, this._onEditBlur.bind(this));
          this._changeHandler = this._edit.when(context.constants.widgetEvents.change, this._onEditChange.bind(this));
          this._keyUpHandler = this._edit.when(context.constants.widgetEvents.keyUp, this._onKeyUp.bind(this));
        },

        _imageLoaded: function() {
          this._layoutEngine.invalidateMeasure();
          this.emit(context.constants.widgetEvents.ready);
        },

        destroy: function() {
          this._clickHandler();
          this._focusHandler();
          this._blurHandler();
          this._changeHandler();
          this._keyUpHandler();
          this._edit.destroy();
          this._edit = null;
          this._button.destroy();
          this._button = null;
          if (this._completerWidget) {
            this._completerWidget.destroy();
            this._completerWidget = null;
          }
          $super.destroy.call(this);
        },

        _onButtonClick: function(event, sender, domEvent) {
          if (this.isEnabled()) {
            this.emit(context.constants.widgetEvents.requestFocus, domEvent);
            this.emit(context.constants.widgetEvents.click, domEvent);
          }
        },
        _onEditRequestFocus: function(event, sender, domEvent) {
          this.emit(context.constants.widgetEvents.requestFocus, domEvent);
        },
        _onEditBlur: function(event, sender, domEvent) {
          this.emit(context.constants.widgetEvents.blur, domEvent);
        },
        _onEditChange: function(event, sender, domEvent, isTextEntry) {
          this.emit(context.constants.widgetEvents.change, domEvent, isTextEntry);
        },

        _onKeyUp: function(event, sender, domEvent, isTextEntry) {
          this.emit(context.constants.widgetEvents.keyUp, domEvent, isTextEntry);
        },

        getInput: function() {
          return this._edit.getInput();
        },
        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          this._edit.setTitle(title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._edit.getTitle();
        },

        /**
         * @param {boolean} readonly true to set the edit part as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._edit.setReadOnly(readonly);
        },

        /**
         * @returns {boolean} true if the edit part is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._edit.isReadOnly();
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength) {
          this._edit.setMaxLength(maxlength);
        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          return this._edit.getMaxLength();
        },

        /**
         * call from TextAlignVMBehavior
         * @param {string} align
         */
        setTextAlign: function(align) {
          this._edit.setTextAlign(align);
        },

        getTextAlign: function() {
          return this._edit.getTextAlign();
        },

        /**
         * When cursor2 === cursor, it is a simple cursor set
         * @param {int} cursor the selection range beginning
         * @param {int} cursor2 the selection range end, if any
         */
        setCursors: function(cursor, cursor2) {
          if (this._edit) {
            this._edit.setCursors(cursor, cursor2);
          }
        },
        getCursors: function() {
          return this._edit.getCursors();
        },

        getDisplayFormat: function() {
          return this._edit.getDisplayFormat();
        },

        setDisplayFormat: function(format) {
          this._edit.setDisplayFormat(format);
        },

        /**
         * @param {string} value the value to display in the edit part
         */
        setValue: function(value, force) {
          this._edit.setValue(value, force);
        },

        /**
         * @returns {string} the value displayed in the edit part
         */
        getValue: function() {
          return this._edit.getValue();
        },

        /**
         * @param {string} image the URL of the image to display in the button part
         */
        setImage: function(image) {
          this._button.setImage(image);
        },

        /**
         * @returns {string} the URL of the image displayed in the button part
         */
        getImage: function() {
          return this._button.getImage();
        },

        setAutoScale: function(enabled) {
          this._button.setAutoScale(enabled);
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._edit.setEnabled(enabled);
        },
        /**
         * @returns {boolean} true if the button is enabled, false otherwise
         */
        isEnabled: function() {
          return this._edit.isEnabled();
        },
        /**
         * @param {boolean} enabled true if the button should be enabled, false otherwise
         */
        setButtonEnabled: function(enabled) {
          this._button.setEnabled(enabled);
        },

        /**
         * @returns {boolean} true if the button is enabled, false otherwise
         */
        isButtonEnabled: function() {
          return this._button.isEnabled();
        },

        /**
         * @param {boolean} isPassword true if the widget should be in 'password' mode, false otherwise
         */
        setIsPassword: function(isPassword) {
          this._edit.setIsPassword(isPassword);
        },

        /**
         * @returns {boolean} true if the widget is in 'password' mode, false otherwise
         */
        isPassword: function() {
          return this._edit.isPassword();
        },

        /**
         * Used to manage the keyboardHint.
         * @param {string} valType the type attribute value to set
         */
        setType: function(valType) {
          this._edit.setType(valType);
        },

        /**
         * @returns {String} this Edit current type
         */
        getType: function() {
          return this._edit.getType();
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          if (this._edit._inputElement && !this.isReadOnly()) {
            //this._edit.gbcReadonly(false);
            this._edit._inputElement.domFocus();
          }
          this.getUserInterfaceWidget().setFocusedWidget(this);
        },

        /**
         * When a formfield is inactive we must put it in readonly mode
         * @param readonly
         * @private
         */
        gbcReadonly: function(readonly) {
          if (this._edit) {
            this._edit.gbcReadonly(readonly);
          }
        },

        getCompleterWidget: function() {
          return this._edit.getCompleterWidget();
        },

        /**
         * Will add a completer to the edit
         */
        addCompleterWidget: function() {
          this._edit.addCompleterWidget();
        },

        /**
         * @inheritDoc
         */
        setColor: function(color) {
          this._edit.setColor(color);
        },

        /**
         * @inheritDoc
         */
        getColor: function() {
          return this._edit.getColor();
        },

        /**
         * @inheritDoc
         */
        setBackgroundColor: function(color) {
          this._edit.setBackgroundColor(color);
        },

        /**
         * @inheritDoc
         */
        getBackgroundColor: function() {
          return this._edit.getBackgroundColor();
        },

        setTextTransform: function(transform) {
          this._edit.setTextTransform(transform);
        },

        removeTextTransform: function() {
          this._edit.removeTextTransform();
        },

        getTextTransform: function() {
          return this._edit.getTextTransform();
        },

        setEditing: function(editing) {
          this._edit.setEditing(editing);
        },

        isEditing: function() {
          return this._edit.isEditing();
        },

        /**
         * Defines a placeholder text
         * @param placeholder
         */
        setPlaceHolder: function(placeholder) {
          this._edit.setPlaceHolder(placeholder);
        }

      };
    });
    cls.WidgetFactory.register('ButtonEdit', cls.ButtonEditWidget);
  });
