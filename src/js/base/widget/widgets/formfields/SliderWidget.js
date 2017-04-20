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

modulum('SliderWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Slider widget.
     * @class classes.SliderWidget
     * @extends classes.TextWidgetBase
     */
    cls.SliderWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.SliderWidget.prototype */
      return {
        __name: "SliderWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        /**
         * @type Element
         */
        _orientation: "horizontal",
        _isReadOnly: false,
        _keyboardInstance: null,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.SliderLayoutEngine(this);
            this._layoutInformation.getSizePolicyConfig().initial = cls.SizePolicy.Dynamic();
            this._layoutInformation.getSizePolicyConfig().fixed = cls.SizePolicy.Dynamic();
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._inputElement = this._element.getElementsByTagName('input')[0];
          this._inputElement.on('change.SliderWidget', this._onChange.bind(this));
          this._inputElement.on('focus.SliderWidget', cls.WidgetBase._onRequestFocus.bind(this));
          this._element.on('click.SliderWidget', this._onClick.bind(this));
          this._isReadOnly = false;
          this._keyboardInstance = context.keyboard(this._element);
        },

        destroy: function() {
          context.keyboard.release(this._element);
          cls.KeyboardHelper.destroy(this);

          this._inputElement.off('change.SliderWidget');
          this._inputElement.off('focus.SliderWidget');
          this._element.off('click.SliderWidget');
          this._inputElement = null;
          $super.destroy.call(this);
        },

        _onUp: function(evt) {
          this._increase();
          this.emit(context.constants.widgetEvents.change, evt, false);
          return false;
        },

        _onDown: function(evt) {
          this._decrease();
          this.emit(context.constants.widgetEvents.change, evt, false);
          return false;
        },

        _onChange: function(evt) {
          // use request animation frame to be sure than change event is sent after focus event (GBC-1154)
          window.requestAnimationFrame(function() {
            this.emit(context.constants.widgetEvents.change, evt, false);
          }.bind(this));

        },

        _onClick: function(evt) {
          this.emit(context.constants.widgetEvents.requestFocus, evt);
          // need to emit change because on some browsers, change event is not raised when slider has not yet the focus
          if (this.isEnabled() && !this.isReadOnly()) {
            var total;
            // Vertical sliders are rotated with CSS. evt.offsetX takes this into account. getBoundingClientRect doesn't
            var clickPos = evt.offsetX;
            if (this._orientation === "horizontal") {
              total = this._inputElement.getBoundingClientRect().width;
            } else {
              total = this._inputElement.getBoundingClientRect().height;
            }
            var expextedTotal = this.getMax() - this.getMin();
            var expectedVal = expextedTotal * (clickPos / total);
            var step = this.getStep();
            var value = this.getMin() + Math.floor(expectedVal / step) * step;
            if ((expectedVal % step) > (step / 2)) {
              value += step;
            }
            this._inputElement.value = value;
          }
          this.emit(context.constants.widgetEvents.change, evt, false);
        },

        /**
         * Increase the displayed value
         * @private
         */
        _increase: function() {
          this.setValue((this.getValue() || 0) + this.getStep());
        },

        /**
         * Decrease the displayed value
         * @private
         */
        _decrease: function() {
          this.setValue((this.getValue() || 0) - this.getStep());
        },

        /**
         * @returns {Number} the displayed value
         */
        getValue: function() {
          return parseInt(this._inputElement.value, 10);
        },

        /**
         * @param {number} value the value to display
         */
        setValue: function(value) {
          value = +value;
          this._inputElement.value = Object.isNumber(value) && !Number.isNaN(value) ? value : 0;
        },

        /**
         * @returns {Number} the minimum value
         */
        getMin: function() {
          return this._inputElement.getIntAttribute('min');
        },

        /**
         * @param {number} value the minimum value
         */
        setMin: function(value) {
          if (Object.isNumber(value)) {
            this._inputElement.setAttribute('min', value);
          } else {
            this._inputElement.removeAttribute('min');
          }
        },

        /**
         * @returns {Number} the maximum value
         */
        getMax: function() {
          return this._inputElement.getIntAttribute('max');
        },

        /**
         * @param {number} value the maximum value
         */
        setMax: function(value) {
          if (Object.isNumber(value)) {
            this._inputElement.setAttribute('max', value);
          } else {
            this._inputElement.removeAttribute('max');
          }
        },

        /**
         * @returns {number} the progress step
         */
        getStep: function() {
          return this._inputElement.getIntAttribute('step');
        },

        /**
         * @param {number} step the progress step
         */
        setStep: function(step) {
          this._inputElement.setAttribute('step', Object.isNumber(step) && step > 0 ? step : 1);
        },

        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          this._inputElement.setAttribute("title", title);
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._inputElement.getAttribute("title");
        },

        /**
         * Set the orientation of the slider widget
         * @param {String} orientation can be "horizontal" or "vertical"
         */
        setOrientation: function(orientation, afterLayout) {
          this._orientation = orientation;
          var newStyle = {};

          if (orientation === "vertical" && afterLayout) {
            // Rotate only after layout
            this.setStyle({
              "transform": "rotate(-90deg) translate(-100%)",
              "transform-origin": "top left"
            });
          } else {
            newStyle = {
              "-webkit-appearance": null,
              "writing-mode": null
            };
            if (this._inputElement) {
              this._inputElement.removeAttribute("orient");
            }
          }
          this.setStyle(">input[type=range]", newStyle);
        },

        getOrientation: function() {
          return this._orientation;
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._inputElement.domFocus();
          $super.setFocus.call(this);
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {
          this._isReadOnly = readonly;
          if (readonly) {
            this._inputElement.setAttribute("readonly", "readonly");
          } else if (this.hasFocus()) {
            this._inputElement.removeAttribute("readonly");
          } else {
            this._inputElement.setAttribute("readonly", "readonly");
          }
        },

        bindKeyEvents: function() {
          this._keyboardInstance.bind(['up', this.getEnd(), 'pageup'], this._onUp.bind(this));
          this._keyboardInstance.bind(['down', this.getStart(), 'pagedown'], this._onDown.bind(this));
        },

        unbindKeyEvents: function() {
          this._keyboardInstance.unbind(['up', this.getEnd(), 'pageup', 'down', this.getStart(), 'pagedown']);
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly;
        }
      };
    });
    cls.WidgetFactory.register('Slider', cls.SliderWidget);
  });
