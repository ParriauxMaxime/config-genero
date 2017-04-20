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

modulum('RadioGroupWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * RadioGroup widget.
     * @class classes.RadioGroupWidget
     * @extends classes.TextWidgetBase
     */
    cls.RadioGroupWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.RadioGroupWidget.prototype */
      return {
        __name: "RadioGroupWidget",
        /**
         * currently aimed item
         * @type {number}
         */
        _currentAimIndex: 0,

        _focusHandler: null,
        _value: null,
        _isReadOnly: false,
        _keyboardInstance: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Dynamic();
            this._layoutInformation.getSizePolicyConfig().fixed = cls.SizePolicy.Dynamic();
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._isReadOnly = false;
          this._keyboardInstance = context.keyboard(this._element);
        },
        destroy: function() {
          context.keyboard.release(this._element);
          cls.KeyboardHelper.destroy(this);
          this._element.off('click.RadioGroupWidget');
          $super.destroy.call(this);
        },
        _onClick: function(evt) {
          this.emit(context.constants.widgetEvents.requestFocus);
          evt.stopPropagation();
          evt.stopImmediatePropagation();
          var item = evt.target.closest('gbc_RadioGroupItem');
          this._currentAimIndex = 0;
          for (; item.previousElementSibling; item = item.previousElementSibling) {
            if (item.previousElementSibling !== this.__charMeasurer) {
              ++this._currentAimIndex;
            }
          }
          this._prepareValue(this._currentAimIndex, true, evt);
          this.emit(context.constants.widgetEvents.click, evt);
        },
        _onLeft: function(evt) {
          this._currentAimIndex = (this._currentAimIndex <= 0) ?
            this._element.children.length - 2 : //(remove charMeasurer child
            (this._currentAimIndex - 1);
          this._prepareValue(this._currentAimIndex, false, evt);
          return false;
        },
        _onRight: function(evt) {
          this._currentAimIndex = (this._currentAimIndex >= (this._element.children.length - 2)) ? //(remove charMeasurer child
            0 :
            (this._currentAimIndex + 1);
          this._prepareValue(this._currentAimIndex, false, evt);
          return false;
        },
        _onSpace: function(evt) {
          this._prepareValue(this._currentAimIndex, true, evt);
          return false;
        },

        /**
         *
         * @param {value} return index of value in _values array
         * @private
         */
        _indexOf: function(value) {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            if (children[i].getAttribute("data-value") === value.toString()) {
              return i;
            }
          }
          return -1;
        },

        /**
         * @param {string} choice adds a choice to the list
         * @private
         */
        _addChoice: function(choice) {
          var button = context.TemplateService.renderDOM("RadioGroupItem");
          button.setAttribute("data-value", choice.value);
          button.getElementsByTagName('span')[0].textContent = choice.text;
          this._element.appendChild(button);
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @param {number} index removes a choice at the given index
         * @private
         */
        _removeChoiceAt: function(index) {
          this._element.allchild('gbc_RadioGroupItem')[index].remove();
        },

        /**
         * @param {string} choice removes the given choice
         * @private
         */
        _removeChoice: function(choice) {
          var index = this._indexOf(choice.value);
          if (index >= 0) {
            this._removeChoiceAt(index);
          }
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
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
              this.updateValue();
            } else {
              this._addChoice(choices);
            }
          }
        },

        /**
         * @param {(string|string[])} choices removes a single or a list of choices
         */
        removeChoices: function(choices) {
          if (choices) {
            if (Array.isArray(choices)) {
              for (var i = 0; i < choices.length; i++) {
                this._removeChoice(choices[i]);
              }
            } else {
              this._removeChoice(choices);
            }
          }
        },

        /**
         * Clears all choices
         */
        clearChoices: function() {
          while (this._element.childrenExcept(this.__charMeasurer).length !== 0) {
            this._element.childrenExcept(this.__charMeasurer)[0].remove();
          }
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @param {string} orientation layout orientation. 'vertical' or 'horizontal'.
         */
        setOrientation: function(orientation) {
          this._element.toggleClass('gbc_RadioGroupWidget_horizontal', orientation === "horizontal");
          this._element.toggleClass('gbc_RadioGroupWidget_vertical', orientation === "vertical");
          if (this.getLayoutEngine()) {
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @returns {string} the layout orientation. 'vertical' or 'horizontal'.
         */
        getOrientation: function() {
          if (this._element.hasClass('gbc_RadioGroupWidget_horizontal')) {
            return 'horizontal';
          } else {
            return 'vertical';
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            if (item.getElementsByClassName("mt-radiobutton")[0].hasClass('checked')) {
              return item.getAttribute('data-value');
            }
          }
          return '';
        },

        /**
         * @param {string} value the value to display
         */
        setValue: function(value) {
          this._value = value;
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            var isChecked = item.getAttribute("data-value") === value.toString();
            item.getElementsByClassName('mt-radiobutton')[0].toggleClass('checked', isChecked);
            if (isChecked) {
              this._currentAimIndex = i;
            }
          }
        },

        /** Set again the value, can be useful if items have changed
         *
         */
        updateValue: function() {
          if (!!this._value) {
            this.setValue(this._value);
          }
        },

        /**
         * @param {string} value the value to display
         * @param {boolean} doSetValue
         * @private
         */
        _prepareValue: function(index, doSetValue, event) {
          if (this.isEnabled()) {
            this._updateVisualAim();
            if (doSetValue || this._element.querySelectorAll(".checked").length !== 0) {
              var children = this._element.childrenExcept(this.__charMeasurer);
              for (var i = 0; i < children.length; ++i) {
                var item = children[i].getElementsByClassName('mt-radiobutton')[0];
                //only if not null is set to false, you can toggle of an item
                if (!(this._notNull && children[i].hasClass("aimed") && item.hasClass("checked"))) {
                  item.toggleClass('checked', i === index && !item.hasClass('checked'));
                }
              }
              this.emit(context.constants.widgetEvents.change, event, false);
            }
          }
        },

        _updateVisualAim: function() {
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            item.toggleClass('aimed', i === this._currentAimIndex);
          }
        },
        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._element.toggleClass('disabled', !enabled);
          var children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i].getElementsByClassName('mt-radiobutton')[0];
            item.toggleClass('disabled', !enabled);
          }
          this._element.off('click.RadioGroupWidget');
          if (enabled) {
            this._element.on('click.RadioGroupWidget', '.gbc_RadioGroupItem', this._onClick.bind(this));
          } else if (this.isInTable()) {
            this._element.on('click.RadioGroupWidget', cls.WidgetBase._onRequestFocus.bind(this));
            this._element.on('click.RadioGroupWidget', cls.WidgetBase._onClick.bind(this));
          }
        },
        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
        },

        bindKeyEvents: function() {
          this._keyboardInstance.bind(['up', this.getStart()], this._onLeft.bind(this));
          this._keyboardInstance.bind(['down', this.getEnd()], this._onRight.bind(this));
          this._keyboardInstance.bind(['space'], this._onSpace.bind(this));
        },

        unbindKeyEvents: function() {
          this._keyboardInstance.unbind(['up', this.getStart(), 'down', this.getEnd(), 'space']);
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        },
        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._element.domFocus();

          this._updateVisualAim();
          $super.setFocus.call(this);
        },

        setNotNull: function(notNull) {
          this._notNull = !!notNull;
        },

      };
    });
    cls.WidgetFactory.register('RadioGroup', cls.RadioGroupWidget);
  });
