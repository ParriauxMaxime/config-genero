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

modulum('ComboBoxWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Combobox widget.
     * @class classes.ComboBoxWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ComboBoxWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ComboBoxWidget.prototype */
      return {
        __name: "ComboBoxWidget",
        /**
         * @type {classes.ValueLabelWidget}
         */
        _selectedWidget: null,
        _dropDown: null,
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",
        _typedLetters: null,
        _typedLettersCacheHandler: null,
        _focusHandler: null,
        _spaceHandler: null,
        _enterHandler: null,
        _notNull: null,
        _isReadOnly: false,
        _keyboardInstance: null,
        _placeholderText: "",

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.ComboBoxLayoutEngine(this);
          }
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._typedLetters = [];

          this.setStyle("i.zmdi-menu-down", {
            "min-width": (window.scrollBarSize) + "px",
          });

          this._selectedWidget = cls.WidgetFactory.create("ValueLabel");
          this._selectedWidget.setFocusable(false);
          this.addChildWidget(this._selectedWidget);

          this._dropDown = cls.WidgetFactory.create("ChoiceDropDown");
          this._dropDown.setParentWidget(this);

          /* Click events */
          this._element.on('click.ComboBoxWidget', this._onClick.bind(this));

          this._focusHandler = this.when(context.constants.widgetEvents.focus, this._onFocus.bind(this));

          this._element.on('blur.ComboBoxWidget', this._onBlur.bind(this));

          this._isReadOnly = false;
        },
        destroy: function() {
          context.keyboard.release(this._element);
          cls.KeyboardHelper.destroy(this);

          if (this._focusHandler) {
            this._focusHandler();
          }
          if (this._spaceHandler) {
            this._spaceHandler();
          }
          if (this._enterHandler) {
            this._enterHandler();
          }
          this._element.off('click.ComboBoxWidget');
          this._element.off('blur.ComboBoxWidget');
          this._element.off('keypress.ComboBoxWidget');
          this._typedLetters.length = 0;
          this._dropDown.destroy();
          this._dropDown = null;
          this._selectedWidget.destroy();
          this._selectedWidget = null;
          $super.destroy.call(this);
        },
        _onClick: function(event) {
          event.stopPropagation();
          if (this.isEnabled()) {
            this._dropDown.toggle();
          }
          this.emit(context.constants.widgetEvents.requestFocus, event);
        },
        _onFocus: function() {
          if (this.isEnabled()) {
            this.getElement().domFocus();
          }
        },
        _onBlur: function() {
          if (!this._dropDown.isVisible()) {
            this.emit(context.constants.widgetEvents.blur);
          }
        },
        _onKeypress: function(event) {
          if (event.which <= 0) // arrows key (for firefox)
          {
            return true;
          }
          var char = String.fromCharCode(event.which).toLowerCase();

          this._typedLetters.push(char);
          clearTimeout(this._typedLettersCacheHandler);
          this._typedLettersCacheHandler = setTimeout(this._clearTypedLettersCache.bind(this), 500);

          var children = this._dropDown.getChildren();
          var len = children.length;
          var letters = this._typedLetters.join("");
          for (var i = 0; i < len; i++) {
            var currentChild = children[i];
            var childText = currentChild.getText();
            if (childText && childText.toLowerCase().startsWith(letters)) {
              if (this._dropDown.isVisible()) {
                this._dropDown.navigateTo(i);
              } else {
                this.setValue(currentChild.getValue());
              }
              break;
            }
          }

        },
        _onLeft: function(evt) {
          if (this.navigateTo) {
            this.navigateTo(-1, true);
          }
          return false;
        },
        _onRight: function(evt) {
          if (this.navigateTo) {
            this.navigateTo(+1, false);
          }
          return false;
        },
        _onSpace: function(event, sender, domEvent) {
          domEvent.preventDefault();
          this._dropDown.toggle();
        },
        _onEnter: function(event, sender, domEvent) {
          this._dropDown.emit(context.constants.widgetEvents.enter, domEvent);
        },
        _clearTypedLettersCache: function() {
          this._typedLetters.length = 0;
        },
        /**
         * Returns position of current value
         * @returns {Number}
         * @private
         */
        _getCurrentPosition: function() {
          return this._dropDown.getValueIndex(this.getValue());
        },

        /**
         * Manage keyboard navigation over dropdown children.
         * If dropdown is not visible, navigation directly set value.
         * If dropdown is visible, leave dropdown manage work by emiting events
         * @param {Number} jump position requested over current position
         * @param {Boolean} up if true, indicates navigation is going to previous items, otherwise to next items
         * @private
         */
        navigateTo: function(jump, up) {
          if (!this._dropDown.isVisible()) {
            var pos = 0;
            var childsLength = this._dropDown.getChildren().length;
            if (up === false && jump === 0) {
              jump = childsLength;
            }
            if (jump !== 0 && jump !== childsLength - 1) {
              pos = this._getCurrentPosition() + jump;
              if (pos < 0) {
                pos = 0;
              } else if (pos >= childsLength - 1) {
                pos = childsLength - 1;
              }
            } else {
              pos = jump;
            }
            if (this._dropDown.getChildren()[pos]) {
              this.setValue(this.getValueAtPosition(pos));
            }
          } else {
            this._dropDown.jumpTo(jump, up);
          }
        },

        /**
         * Get the value of the dropdown list at given position
         * @param pos
         */
        getValueAtPosition: function(pos) {
          return this._dropDown.getChildren()[pos].getValue();
        },

        /**
         * @param {string} choice single value label
         */
        _addChoice: function(choice) {
          var label = cls.WidgetFactory.create("ValueLabel");
          label.setText(choice.text);
          label.setValue(choice.value);
          this._dropDown.addChildWidget(label);
        },

        /**
         * @param {string|string[]} choices adds a single or a list of choices
         */
        addChoices: function(choices) {
          if (choices) {
            if (Array.isArray(choices)) {
              for (var i = 0; i < choices.length; i++) {
                this._addChoice(choices[i]);
              }
              if (!choices.find(function(c) {
                  return c.value === this._selectedWidget.getValue();
                }.bind(this))) {
                this._selectedWidget.setValue("");
                this._selectedWidget.setText("");
              } else {
                var value = this._selectedWidget.getValue();
                this._selectedWidget.setValue(value);
                this._selectedWidget.setText(this.getChoiceText(value));
              }

            } else {
              this._addChoice(choices);
            }

            if (this._notNull === 0) {
              this._addNullElement();
            }

          }
        },

        clearChoices: function() {
          var children = this._dropDown.getChildren().slice();
          var childenLength = children.length;
          if (childenLength > 0) {
            for (var i = 0; i < childenLength; i++) {
              this._dropDown.removeChildWidget(children[i]);
            }
          }
        },

        getDropDown: function() {
          return this._dropDown;
        },

        showDropDown: function() {
          this._dropDown.show(true, true);
        },

        /**
         * Get text associated to value in choices list
         * @param value
         * @returns {*}
         */
        getChoiceText: function(value) {
          var text = null;
          for (var i = 0; i < this._dropDown.getChildren().length; i++) {
            var choice = this._dropDown.getChildren()[i];
            if (choice.getValue() === value) {
              text = choice.getText();
              break;
            }
          }
          return text;
        },

        /**
         * @returns {string} the currently selected value
         */
        getValue: function() {
          return this._selectedWidget.getValue();
        },

        /**
         * @param {string} value changes the currently selected value
         */
        setValue: function(value) {
          this._value = value;
          if (this._selectedWidget.getValue() !== value) {
            this._selectedWidget.setValue(value);
            var text = this.getChoiceText(value);
            this._selectedWidget.setText(text ? text : value);
            this.emit(context.constants.widgetEvents.change, value);
          }
          this.removeClass("placeholder");
          if (value === "") {
            this.setPlaceHolder(this._placeholderText);
          }

        },

        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          this.getElement().setAttribute("title", title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this.getElement().getAttribute("title");
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          $super.setFocus.call(this);
          if (this._inputElement) {
            this._inputElement.domFocus();
          } else {
            this._element.domFocus();
          }
          this._dropDown.show(true);
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);

          this._selectedWidget.setEnabled(enabled);
          this._dropDown.setEnabled(enabled);
          this._element.toggleClass('disabled', !enabled);
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
        },

        bindKeyEvents: function() {
          /* Bind dropdown navigation keyboard to combo */
          this._element.on('keypress.ComboBoxWidget', this._onKeypress.bind(this));
          this._keyboardInstance = cls.KeyboardHelper.bindKeyboardNavigation(this._element, this);
          this._spaceHandler = this.when(context.constants.widgetEvents.space, this._onSpace.bind(this));
          this._enterHandler = this.when(context.constants.widgetEvents.enter, this._onEnter.bind(this));
          this._keyboardInstance.bind([this.getStart()], this._onLeft.bind(this));
          this._keyboardInstance.bind([this.getEnd()], this._onRight.bind(this));
        },

        unbindKeyEvents: function() {
          this._element.off('keypress.ComboBoxWidget');
          this._keyboardInstance = cls.KeyboardHelper.unbindKeyboardNavigation(this._element, this);
          if (this._spaceHandler) {
            this._spaceHandler();
          }
          if (this._enterHandler) {
            this._enterHandler();
          }
          this._keyboardInstance.unbind([this.getStart(), this.getEnd()]);
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },

        setFontWeight: function(weight) {
          this._selectedWidget.setFontWeight(weight);
        },

        getFontWeight: function() {
          return this._selectedWidget.getFontWeight();
        },

        setFontStyle: function(style) {
          this._selectedWidget.setFontStyle(style);
        },

        getFontStyle: function() {
          return this._selectedWidget.getFontStyle();
        },

        setTextAlign: function(align) {
          this._selectedWidget.setTextAlign(align);
        },

        getTextAlign: function() {
          return this._selectedWidget.getTextAlign();
        },

        setTextTransform: function(transform) {
          this._selectedWidget.setTextTransform(transform);
        },

        getTextTransform: function() {
          return this._selectedWidget.getTextTransform();
        },

        getTextDecoration: function() {
          return this._selectedWidget.getTextDecoration();
        },

        setTextDecoration: function(decoration) {
          this._selectedWidget.setTextDecoration(decoration);
        },

        /**
         * Handle a null item if notNull is not specified
         * @param notNull
         */
        setNotNull: function(notNull) {
          this._notNull = notNull;
          if (notNull === 0) {
            this._addNullElement();
          }
        },

        /**
         * Add a NULL element if doesn't exists yet
         * @private
         */
        _addNullElement: function() {
          var nullChoiceExists = false;
          for (var i = 0; i < this._dropDown.getChildren().length; i++) {
            var choice = this._dropDown.getChildren()[i];
            if (choice.getValue() === "" || (choice.getCheckedValue && choice.getCheckedValue() === "")) {
              nullChoiceExists = true;
              break;
            }
          }
          if (!nullChoiceExists) {
            this._addChoice({
              text: "",
              value: ""
            });
          }
        },

        /**
         * Defines a placeholder text
         * @param placeholder
         */
        setPlaceHolder: function(placeholder) {
          this._placeholderText = placeholder;
          if (this._selectedWidget.setText) {
            this._selectedWidget.setText(placeholder);
          } else if (this._selectedWidget.setValue) {
            this._selectedWidget.setValue(placeholder);
          }
          this.addClass("placeholder");
        }

      };
    });
    cls.WidgetFactory.register('ComboBox', cls.ComboBoxWidget);
  });
