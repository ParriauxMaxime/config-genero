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

modulum('KeyboardHelper',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Helper to attach keyboard navigation to a widget.
     * @class classes.KeyboardHelper
     */
    cls.KeyboardHelper = context.oo.StaticClass(function() {
      /** @lends classes.KeyboardHelper */
      return {
        __name: "KeyboardHelper",
        _mousetrapInstances: null,

        bindKeyboardNavigation: function(element, widget) {

          if (!this._mousetrapInstances) {
            this._mousetrapInstances = [];
          }

          var keyboardInstance = this._mousetrapInstances[widget._uuid];
          if (!keyboardInstance) {
            keyboardInstance = context.keyboard(element);
            this._mousetrapInstances[widget._uuid] = keyboardInstance;
          }
          keyboardInstance.bind(['up'], this._onUp.bind(this, widget));
          keyboardInstance.bind(['down'], this._onDown.bind(this, widget));
          keyboardInstance.bind(['pageup'], this._onPageUp.bind(this, widget));
          keyboardInstance.bind(['pagedown'], this._onPageDown.bind(this, widget));
          keyboardInstance.bind(['home'], this._onHome.bind(this, widget));
          keyboardInstance.bind(['end'], this._onEnd.bind(this, widget));
          keyboardInstance.bind(['enter'], this._onEnter.bind(this, widget));
          keyboardInstance.bind(['space'], this._onSpace.bind(this, widget));
          return keyboardInstance;
        },

        unbindKeyboardNavigation: function(element, widget) {
          if (!this._mousetrapInstances) {
            this._mousetrapInstances = [];
          }

          var keyboardInstance = this._mousetrapInstances[widget._uuid];
          if (!keyboardInstance) {
            keyboardInstance = context.keyboard(element);
            this._mousetrapInstances[widget._uuid] = keyboardInstance;
          }
          keyboardInstance.unbind(['up', 'left']);
          keyboardInstance.unbind(['down', 'right']);
          keyboardInstance.unbind(['pageup']);
          keyboardInstance.unbind(['pagedown']);
          keyboardInstance.unbind(['home']);
          keyboardInstance.unbind(['end']);
          return keyboardInstance;
        },

        destroy: function(widget) {
          if (this._mousetrapInstances && this._mousetrapInstances[widget._uuid]) {
            delete this._mousetrapInstances[widget._uuid];
          }
        },

        _onUp: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(-1, true, evt);
          }
          return false;
        },
        _onDown: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(+1, false, evt);
          }
          return false;
        },
        _onPageUp: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(-10, true, evt);
          }
          return false;
        },
        _onPageDown: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(+10, false, evt);
          }
          return false;
        },
        _onHome: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(0, true, evt);
          }
          return false;
        },
        _onEnd: function(widget, evt) {
          if (widget.navigateTo) {
            widget.navigateTo(0, false, evt);
          }
          return false;
        },
        _onEnter: function(widget, evt) {
          widget.emit(context.constants.widgetEvents.enter, evt);
        },
        _onSpace: function(widget, evt) {
          widget.emit(context.constants.widgetEvents.space, evt);
        },

        isDecimal: function(event) {
          return /[0-9]/.test(String.fromCharCode(event.which)) || // numbers
            event.which === 45 || // - key
            event.which === 46 || // decimal key
            event.which === 43; // + key
        },

        isModifier: function(sequence) {
          return ["ctrl", "shift", "alt", "meta"].indexOf(sequence) !== -1;
        },

        isSpecialCommand: function(event) {
          return event.which <= 0 || // arrow keys
            event.which === 8 || // delete key
            event.metaKey || event.ctrlKey || // cmd/ctrl
            (event.key && ["Home", "End", "ArrowLeft", "ArrowRight", "Backspace"].contains(event.key)); // detect generic modifiers another way (safari may not support this last one)
        },

        isNumeric: function(char) {
          return /[0-9]/.test(char);
        },

        isLetter: function(char) {
          return /[A-Za-z\u00C0-\u017F]/.test(char); // alphabetic characters + special accent chars
        },

        isColon: function(event) {
          return String.fromCharCode(event.which) === ":" || event.which === 191; // firefox keycode is different that other browsers having 191
        },

        /**
         * Validate new number with typed char at specified position
         * @param initialValue
         * @param position
         * @param typedChar
         * @param min
         * @param max
         * @returns {boolean}
         */
        validateNumber: function(initialValue, position, typedChar, min, max) {
          var newVal = "";
          if (position === 0) {
            newVal = typedChar + initialValue;
          } else {
            newVal = initialValue.substr(0, position) + typedChar + initialValue.substr(position);
          }
          if (newVal === '-' || newVal === '+') {
            return true;
          } else {
            var newNumber = parseInt(newVal, 10);
            return !isNaN(newVal) && (!min || newNumber >= min) && (!max || newNumber <= max);
          }
        }
      };
    });
  });
