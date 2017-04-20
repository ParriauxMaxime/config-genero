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

modulum('DummyRadioGroupWidget', ['RadioGroupWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * RadioGroup widget.
     * @class classes.DummyRadioGroupWidget
     * @extends classes.RadioGroupWidget
     */
    cls.DummyRadioGroupWidget = context.oo.Class(cls.RadioGroupWidget, function($super) {
      /** @lends classes.DummyRadioGroupWidget.prototype */
      return {
        __name: "DummyRadioGroupWidget",
        __templateName: "RadioGroupWidget",

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          var value = "",
            children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            if (item.getElementsByClassName("mt-radiobutton")[0].hasClass('checked')) {
              if (value.length !== 0) {
                value += '|';
              }
              value += item.getAttribute('data-value');
            }
          }
          return value;
        },

        /**
         * @param {string} value the value to display
         */
        setValue: function(value) {
          var values = ("" + value).split('|'),
            children = this._element.childrenExcept(this.__charMeasurer);
          for (var i = 0; i < children.length; ++i) {
            var item = children[i];
            // Reset radio checked
            item.getElementsByClassName('mt-radiobutton')[0].removeClass('checked');
            if (values.indexOf(item.getAttribute("data-value")) !== -1) {
              item.getElementsByClassName('mt-radiobutton')[0].toggleClass('checked', true);
            }
          }
        },

        /**
         * @param {number} index the value to display
         * @param {boolean} doSetValue
         * @param {*} event
         * @private
         */
        _prepareValue: function(index, doSetValue, event) {
          if (this.isEnabled()) {
            this._updateVisualAim();
            var children = this._element.childrenExcept(this.__charMeasurer);
            if (doSetValue) {
              var item = children[index].getElementsByClassName('mt-radiobutton')[0];
              item.toggleClass('checked', !item.hasClass('checked'));
              this.emit(context.constants.widgetEvents.change, event, false);
            }
          }
        }
      };
    });
    cls.WidgetFactory.register('DummyRadioGroup', cls.DummyRadioGroupWidget);
  });
