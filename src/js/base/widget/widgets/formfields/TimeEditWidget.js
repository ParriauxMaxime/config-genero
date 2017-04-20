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

modulum('TimeEditWidget', ['TextWidgetBase', 'DateTimeHelper', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * TimeEdit widget.
     * @class classes.TimeEditWidget
     * @extends classes.TextWidgetBase
     */
    cls.TimeEditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.TimeEditWidget.prototype */
      return {
        __name: "TimeEditWidget",

        /**
         * @type {DateTimeHelper.timeFragment[]}
         */
        _groups: null,
        _useSeconds: true,
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",
        _maxLength: -1,
        _currentCursors: null,
        _numericPressed: false,

        /**
         * @type {string}
         */
        _lastValid: "00:00",

        /**
         *  @type {boolean}
         */
        _valueChanged: false,
        _isReadOnly: false,
        _keyboardInstance: null,

        /**
         * @type {number}
         */
        _currentGroup: 0,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this.setFocusable(true);
        },

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._groups = [cls.DateTimeHelper.timeFragment(24), cls.DateTimeHelper.timeFragment(60)];
          this._inputElement = this._element.getElementsByTagName('input')[0];
          this.setValue(this._lastValid);
          this._inputElement.on('click.TimeEditWidget', this._onClick.bind(this));
          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.TimeEditWidget', cls.WidgetBase._onSelect.bind(this));

          this._element.getElementsByClassName("up")[0].on('click', this._onUpClick.bind(this));
          this._element.getElementsByClassName("down")[0].on('click', this._onDownClick.bind(this));

          this._isReadOnly = false;
          this._currentCursors = {
            start: 0,
            end: 0
          };

          this._keyboardInstance = context.keyboard(this._element);

        },

        destroy: function() {
          //context.keyboard.release(this._inputElement);
          context.keyboard.release(this._element);
          cls.KeyboardHelper.destroy(this);
          this._inputElement.off("mousedown.TimeEditWidget");
          this._inputElement.off('click.TimeEditWidget');
          this._inputElement.off('keypress.TimeEditWidget');
          this._inputElement.off('keyup.TimeEditWidget');
          var upElem = this._element.getElementsByClassName("up")[0];
          if (upElem) {
            upElem.off('click');
          }
          var downElem = this._element.getElementsByClassName("down")[0];
          if (downElem) {
            downElem.off('click');
          }
          this._inputElement = null;
          this._currentCursors = null;
          $super.destroy.call(this);
        },
        setTextAlign: function(align) {
          $super.setTextAlign.call(this, align);
          this.setStyle("input", {
            "text-align": align
          });
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-decoration
         * @return {String} a CSS text decoration
         */
        getTextDecoration: function() {
          return this.getStyle("input", "text-decoration");
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-decoration
         * @return {String} a CSS text decoration
         */
        setTextDecoration: function(decoration) {
          this.setStyle("input", {
            "text-decoration": decoration
          });
        },

        _onClick: function(event) {
          if (this.isEnabled() && !this.isReadOnly() && this.getValue() !== "") {
            this._updateCurrentGroup();
            if (!this.hasFocus()) {
              this._updateSelection();
            }
          }
          this.emit(context.constants.widgetEvents.requestFocus, event);
        },

        _onKeyPress: function(event) { // special commands (ctrl, arrow, delete, ...) keypress event is raised under Firfox but not on other browsers
          var isModifier = cls.KeyboardHelper.isSpecialCommand(event);
          var isValid = !isModifier && cls.KeyboardHelper.isDecimal(event) && !this._isMaxLength();
          if (!isValid && !isModifier) { // prevent text only, not the modifiers such as Ctrl or arrows, home, end
            event.preventDefault();
          }
          this._numericPressed = isValid;
        },

        _keyUpHandler: null,
        _onKeyUpDelayed: function(event) {
          if (this._keyUpHandler) {
            clearTimeout(this._keyUpHandler);
            this._keyUpHandler = null;
          }
          if (this._numericPressed) {
            this._keyUpHandler = setTimeout(this._onKeyUp.bind(this, event), 50);
          }
        },

        _onKeyUp: function(event) {
          // if key pressed was delete or backspace, we do not update current group
          var groupChanged = [8, 46].indexOf(event.which) !== -1 ? false : this._updateCurrentGroup();
          var groupComplete = true;
          if (this._numericPressed) {
            this._numericPressed = false; // important to set it back to false since keypress event isn't raised for special command
            groupComplete = this._updateGroups(this.getValue());
            if (groupComplete) {
              this._moveGroup(1);
              this._updateSelection();
            }
          }
          if (groupChanged || groupComplete) {
            this.emit(context.constants.widgetEvents.change, event, true);
          }
        },
        _onUpClick: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            evt.preventDefault();
            this._increase(true);
            this.emit(context.constants.widgetEvents.change, evt, false);
          }
        },
        _onDownClick: function(evt) {
          if (this.isEnabled() && !this.isReadOnly()) {
            evt.preventDefault();
            this._decrease(true);
            this.emit(context.constants.widgetEvents.change, evt, false);
          }
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
        _onLeftRight: function(evt) {
          this._updateCurrentGroup();
        },
        _onBackspace: function(evt) {
          if (this.getValue().charAt(this._inputElement.selectionEnd - 1) === ':') {
            return false;
          }
        },
        _onDel: function(evt) {
          if (this.getValue().charAt(this._inputElement.selectionEnd) === ':') {
            return false;
          }
        },
        _onModLeft: function(evt) {
          this._moveGroup(-1);
          this._updateSelection();
          return false;
        },
        _onModRight: function(evt) {
          this._moveGroup(1);
          this._updateSelection();
          return false;
        },
        _onColon: function(evt) {
          this._moveGroup(1);
          this._updateSelection();
          return false;
        },
        _onHome: function(event) {
          event.stopPropagation();
          this._currentGroup = 0;
          this.setCursors(0, 0); // need for safari
        },
        _onEnd: function(event) {
          event.stopPropagation();
          var len = this.getValue().length;
          this._currentGroup = 2;
          this.setCursors(len, len); // need for safari
        },
        /**
         * Increase the current group value
         * @private
         */
        _increase: function(fromArrows) {
          if (this._groups[this._currentGroup].increaseValue()) {
            if (this._currentGroup > 0 && this._groups[this._currentGroup - 1].increaseValue()) {
              if (this._currentGroup > 1) {
                this._groups[this._currentGroup - 2].increaseValue();
              }
            }
          }
          this._updateFromGroups();
          this._updateSelection(fromArrows);

        },

        /**
         * Decrease the current group value
         * @private
         */
        _decrease: function(fromArrows) {
          if (this._groups[this._currentGroup].decreaseValue()) {
            if (this._currentGroup > 0 && this._groups[this._currentGroup - 1].decreaseValue()) {
              if (this._currentGroup > 1) {
                this._groups[this._currentGroup - 2].decreaseValue();
              }
            }
          }
          this._updateFromGroups();
          this._updateSelection(fromArrows);

        },

        /**
         * Changes the current group
         * @param {number} where group index
         * @private
         */
        _moveGroup: function(where) {
          if (where < 0) {
            if (this._currentGroup !== 0) {
              this._currentGroup = this._currentGroup + where;
            }
          } else {
            if (this._currentGroup !== 2) {
              this._currentGroup = this._currentGroup + where;
            }
          }
        },

        /**
         * Updates the current group depending on the cursor position
         * @returns {boolean} true if the current group has changed, false otherwise
         * @private
         */
        _updateCurrentGroup: function() {
          var value = this.getValue(),
            firstColon = value.indexOf(":"),
            secondColon = value.lastIndexOf(":");
          var position = this._inputElement.selectionEnd;
          var newPosition = 0;
          var oldPosition = this._currentGroup;
          if (secondColon !== -1) {
            newPosition = position <= firstColon ? 0 : (firstColon === secondColon || position <= secondColon ? 1 : 2);
          } else {
            oldPosition = 0;
          }
          oldPosition = Math.min(this._currentGroup, oldPosition);

          this._currentGroup = newPosition;
          var hasChanged = newPosition !== oldPosition;
          if (hasChanged && !this._isGroupComplete(oldPosition)) {
            this._updateFromGroups();
          }
          return hasChanged;
        },

        _isKeyArrow: function(charCode) {
          return charCode < 0 || charCode === 37 || charCode === 39;
        },

        _isGroupComplete: function(groupIndex) {
          var value = this.getValue().split(":");
          return this._groups[groupIndex].fromText(value[groupIndex]);
        },

        /**
         * @param {string} value
         * @param {boolean} force
         * @returns {boolean}
         * @private
         */
        _updateGroups: function(value, force) {
          var tokens = (value || "00:00:00").split(":");
          var complete = true;
          var length = Math.min(tokens.length, 3);
          for (var i = 0; i < length; i++) {
            if (!this._groups[i]) {
              this._groups.push(cls.DateTimeHelper.timeFragment(60));
            }
            complete = complete && this._isGroupComplete(i);
          }
          if (complete || !!force) {
            this._updateFromGroups();
            this._lastValid = this.getValue();
            this._valueChanged = false;
          }
          return complete;
        },

        /**
         * Rebuilds the value from groups
         * @private
         */
        _updateFromGroups: function() {
          var value = "";
          for (var i = 0; i < this._groups.length; i++) {
            value += (i > 0 ? ":" : "") + this._groups[i].getText();
          }
          this.setValue(value);
        },

        /**
         * Updates the selection range
         * @private
         */
        _updateSelection: function(fromArrows) {
          var start = this._currentGroup * 3;
          if (start < 0) {
            start = 0;
          }
          if (start + 2 <= this.getValue().length) {
            this.setCursors(start, start + 2);
          }
        },

        /**
         * Return cursors position
         * @returns {Object} object with cursor & cursor2 positions
         */
        getCursors: function() {
          return this._currentCursors;
        },

        /** Place the cursor at the given position,
         * @param {Number} cursor  first cursor position
         * @param {Number} cursor2 second cursor position
         */
        setCursors: function(cursor, cursor2) {
          var start = cursor;
          var end = cursor2;
          if (cursor2 === -1) {
            start = 0;
            end = 2;
          }
          this._currentCursors.start = start;
          this._currentCursors.end = end;
          this._inputElement.setCursorPosition(start, end);
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

        showSeconds: function(sec) {
          this._useSeconds = sec;
        },

        /**
         * @param {string} value the value to display
         */
        setValue: function(value) {
          if (this.getValue() !== value) {
            this._inputElement.value = value;
            this._updateGroups(value);
            //this._updateSelection();
          }
        },

        /**
         * @returns {string} the displayed value
         */
        getValue: function() {
          return this._inputElement.value;
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
          this._setInputReadOnly(!enabled);
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
            this._inputElement.setAttribute("readonly", "readonly");
          } else if (this.hasFocus()) {
            this._inputElement.removeAttribute("readonly");
          } else {
            this._inputElement.setAttribute("readonly", "readonly");
          }
        },

        bindKeyEvents: function() {
          this._inputElement.on('keypress.TimeEditWidget', this._onKeyPress.bind(this));
          this._inputElement.on('keyup.TimeEditWidget', this._onKeyUpDelayed.bind(this));

          this._keyboardInstance.bind(['up'], this._onUp.bind(this));
          this._keyboardInstance.bind(['down'], this._onDown.bind(this));
          this._keyboardInstance.bind([this.getStart(), this.getEnd()], this._onLeftRight.bind(this));
          this._keyboardInstance.bind([':'], this._onColon.bind(this));
          this._keyboardInstance.bind(['backspace'], this._onBackspace.bind(this));
          this._keyboardInstance.bind(['del'], this._onDel.bind(this));
          this._keyboardInstance.bind(['mod+' + this.getStart()], this._onModLeft.bind(this));
          this._keyboardInstance.bind(['mod+' + this.getEnd()], this._onModRight.bind(this));

          this._keyboardInstance.bind(['home'], this._onHome.bind(this));
          this._keyboardInstance.bind(['end'], this._onEnd.bind(this));
        },

        unbindKeyEvents: function() {
          this._inputElement.off('keypress.TimeEditWidget');
          this._inputElement.off('keyup.TimeEditWidget');
          this._keyboardInstance.unbind(['up', 'down', this.getStart(), this.getEnd(),
            ':', 'backspace', 'del', 'mod+' + this.getStart(), 'mod+' + this.getEnd(), 'home', 'end'
          ]);
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
          $super.setFocus.call(this);
          this._inputElement.domFocus();
          var currentCursors = this.getCursors();
          this.setCursors(currentCursors.start, currentCursors.end);
        },

        _isMaxLength: function() {
          return this._maxLength !== -1 && this._inputElement.value.length >= this._maxLength &&
            this._inputElement.selectionStart === this._inputElement.selectionEnd;
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength, callback) {
          if (maxlength) {
            this._maxLength = maxlength;
            this._inputElement.setAttribute("maxlength", maxlength);
            if (callback) {
              callback();
            }
          }
        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          return this._maxLength;
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
    cls.WidgetFactory.register('TimeEdit', cls.TimeEditWidget);
  });
