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

modulum('DateEditWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * DateEdit widget.
     * @class classes.DateEditWidget
     * @extends classes.TextWidgetBase
     */
    cls.DateEditWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.DateEditWidget.prototype */
      return {
        __name: "DateEditWidget",

        /** @lends classes.DateEditWidget */
        $static: {
          pikaDaysList: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        },
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _displayFormat: null,
        _disabledDays: null,
        _disableDayFn: null,
        /**
         * {classes.DropDownWidget}
         */
        _dropDown: null,
        _buttonOk: null,
        _buttonCancel: null,
        _useMingGuoYears: false,
        _dateObj: null,
        _pictureMask: null,
        _validValue: null,
        _mustValid: false,
        _localizedDaysList: [],
        _picker: null,
        _maxLength: -1,
        _isReadOnly: false,
        _isModal: true,
        _keyPressed: false,
        _lastClickDate: 0,
        _lastClickValue: null,
        _focusTargetElement: null,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },

        _initElement: function(datetime) {
          $super._initElement.call(this);
          if (this._displayFormat === null) {
            this._displayFormat = "MM/DD/YYYY"; //default format
          }
          if (context.moment.locale() !== navigator.language) {
            context.moment.locale(navigator.language);
          }
          this._disabledDays = [];
          this._firstDayOfWeek = 0;
          // since height of dropdown changes when moving of month, we need to specify max height ourself (used in DropDownContainerWidget)

          this._inputElement = this._element.getElementsByTagName("input")[0];
          if (window.isMobile()) {
            this._focusTargetElement = this._element;
          } else {
            this._focusTargetElement = this._inputElement;
          }

          //this.initDatePicker();
          this._keyboardInstance = context.keyboard(this._inputElement);

          // create dropdown
          this._createContainer(true);

          this._keyboardInstance.bind(['home'], this._onHome.bind(this));
          this._keyboardInstance.bind(['end'], this._onEnd.bind(this));
          this._keyboardInstance.bind(['alt+down', 'alt+up'], this._onOpen.bind(this));
          this._keyboardInstance.bind(['up'], this._onUp.bind(this));
          this._keyboardInstance.bind(['down'], this._onDown.bind(this));
          this._keyboardInstance.bind(['left'], this._onLeft.bind(this));
          this._keyboardInstance.bind(['right'], this._onRight.bind(this));
          this._keyboardInstance.bind(['pageup'], this._onPageUp.bind(this));
          this._keyboardInstance.bind(['pagedown'], this._onPageDown.bind(this));
          this._keyboardInstance.bind(['enter'], function(event) {
            if (this._dropDown.isVisible()) {
              event.stopPropagation();
              this._onOk(event);
            }
          }.bind(this));
          this._keyboardInstance.bind(['esc'], function(event) {
            if (this._dropDown.isVisible()) {
              event.stopPropagation();
              this._onCancel(event);
            }
          }.bind(this));

          this._element.on('click.DateEditWidget', this._onDateEditClick.bind(this));
          this._inputElement.on('keyup.DateEditWidget', cls.WidgetBase._onKeyUp.bind(this));

          // Manage requestFocus during selection of text
          this._inputElement.on('mousedown.DateEditWidget', cls.WidgetBase._onSelect.bind(this));
          this._inputElement.on('keydown.EditWidget', cls.TextWidgetBase._onKeyDown.bind(this));
          this._isReadOnly = false;
        },

        /**
         * Main method which create calendar container depending of the calendarType style attribute.
         * By default we use modal style
         * @param isModal
         * @private
         */
        _createContainer: function(isModal) {
          this._dropDown = cls.WidgetFactory.create("DropDown");
          this._dropDown.bindBlur = Function.noop;
          this._dropDown.unbindBlur = Function.noop;
          this._dropDown.setParentWidget(this);
          this._dropDown.maxHeight = 310;

          // destroy previously set modal events
          if (this._buttonOk) {
            this._buttonOk.off("mousedown");
            this._buttonOk.off("touchend");
            this._buttonOk = null;
          }
          if (this._buttonCancel) {
            this._buttonCancel.off("mousedown");
            this._buttonCancel.off("touchend");
            this._buttonCancel = null;
          }
          if (window.browserInfo.isIE) {
            this._inputElement.off('focusout.DateEditWidget');
          }
          this._inputElement.off('blur.DateEditWidget');
          this._inputElement.off('keydown.DateEditWidget');
          this._dropDown.onClose = function() {};

          if (isModal) { // MODAL
            // Create button which will close dropdown
            this._buttonCancel = document.createElement("span");
            this._buttonCancel.addClasses("gbc_DateEditButton", "mt-button", "mt-button-flat");
            this._buttonCancel.textContent = i18next.t("gwc.button.cancel");

            this._buttonOk = document.createElement("span");
            this._buttonOk.addClasses("gbc_DateEditButton", "mt-button", "mt-button-flat");
            this._buttonOk.textContent = i18next.t("gwc.button.ok");

            this._buttonOk.on("mousedown", this._onOk.bind(this));
            this._buttonOk.on("touchend", this._onOk.bind(this));

            this._buttonCancel.on("mousedown", this._onCancel.bind(this));
            this._buttonCancel.on("touchend", this._onCancel.bind(this));

            this._dropDown.onOpen = this._onCalendarTypeModalOpen.bind(this);
            this._dropDown.onClose = this._onCalendarTypeModalClose.bind(this);

            this._inputElement.on('blur.DateEditWidget', this._onCalendarTypeModalBlur.bind(this));

          } else { // DIRECT CLICK
            this._inputElement.on('keydown.DateEditWidget', this._onKeyDown.bind(this));
            this._dropDown.onOpen = this._onCalendarTypeDropDownOpen.bind(this);

            if (window.browserInfo.isIE) {
              // blur event doesn't have event.relatedTarget attribute, we need to use focusout instead
              // ref : https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101237/
              this._inputElement.on('focusout.DateEditWidget', this._onCalendarTypeDropDownBlur.bind(this));
            } else {
              this._inputElement.on('blur.DateEditWidget', this._onCalendarTypeDropDownBlur.bind(this));
            }
          }
        },

        destroy: function() {
          context.keyboard.release(this._inputElement);
          this._keyboardInstance = null;
          this._element.off('click.DateEditWidget');
          if (this._inputElement) {
            this._inputElement.off("mousedown.DateEditWidget");
            this._inputElement.off('keydown.DateEditWidget');
            this._inputElement.off('keyup.DateEditWidget');
            if (window.browserInfo.isIE) {
              this._inputElement.off('focusout.DateEditWidget');
            } else {
              this._inputElement.off('blur.DateEditWidget');
            }
            this._inputElement.remove();
            this._inputElement = null;
          }
          if (this._buttonOk) {
            this._buttonOk.off("mousedown");
            this._buttonOk.off("touchend");
            this._buttonOk = null;
          }
          if (this._buttonCancel) {
            this._buttonCancel.off("mousedown");
            this._buttonCancel.off("touchend");
            this._buttonCancel = null;
          }
          if (this._picker) {
            this._picker.destroy();
            this._picker = null;
          }
          this._dropDown.destroy();
          this._dropDown = null;
          $super.destroy.call(this);
        },

        _onOpen: function(event) {
          event.stopImmediatePropagation();
          if (!this._dropDown.isVisible()) {
            this._dropDown.show(true, true);
          }
        },
        _onUp: function(event) {
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;
            var prevWeek = context.moment(this._picker.getDate()).subtract(1, "weeks").toDate();
            this._picker.setDate(prevWeek);
          }
        },
        _onDown: function(event) {
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;

            var nextWeek = context.moment(this._picker.getDate()).add(1, "weeks").toDate();
            this._picker.setDate(nextWeek);
          }
        },
        _onLeft: function(event) {
          event.stopImmediatePropagation(); // needed to cancel keydown event of pikaday library
          if (this._dropDown.isVisible()) {
            event.preventDefault();
            this._keyPressed = true;

            var prevDay = context.moment(this._picker.getDate()).subtract(1, "days").toDate();
            this._picker.setDate(prevDay);
          }
        },
        _onRight: function(event) {
          event.stopImmediatePropagation(); // needed to cancel keydown event of pikaday library
          if (this._dropDown.isVisible()) {
            event.preventDefault();
            this._keyPressed = true;

            var nextDay = context.moment(this._picker.getDate()).add(1, "days").toDate();
            this._picker.setDate(nextDay);
          }
        },
        _onPageUp: function(event) {
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;

            var prevDay = context.moment(this._picker.getDate()).subtract(1, "month").toDate();
            this._picker.setDate(prevDay);
          }
        },
        _onPageDown: function(event) {
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;

            var prevDay = context.moment(this._picker.getDate()).add(1, "month").toDate();
            this._picker.setDate(prevDay);
          }
        },

        _onOk: function(event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          this._mustValid = false;
          if (!this.getValue()) { // if empty field with enter key pressed on calendar, we set with date of the day
            this._inputElement.value = this.getDate();
          }
          this._dropDown.show(false);
          this.emit(context.constants.widgetEvents.change, event, false);
        },
        _onKeyDown: function(event) {
          if (this._dropDown.isVisible()) {
            event.stopPropagation();
            this._mustValid = false;
            this._dropDown.hide();
          }
        },
        _onCancel: function(event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          if (this._dropDown.isVisible()) {
            this._dropDown.show(false);
          }
        },
        _onHome: function(event) {
          event.stopPropagation();
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;
            var firstDay = context.moment(this._picker.getDate()).startOf("month").toDate();
            this._picker.setDate(firstDay);
          } else { // need for safari
            this.setCursors(0);
          }
        },
        _onEnd: function(event) {
          event.stopPropagation();
          if (this._dropDown.isVisible()) {
            event.stopImmediatePropagation();
            event.preventDefault();
            this._keyPressed = true;

            var lastDay = context.moment(this._picker.getDate()).endOf("month").toDate();
            this._picker.setDate(lastDay);
          } else { // need for safari
            this.setCursors(this.getValue().length);
          }
        },
        _onDateEditClick: function(event) {
          event.stopPropagation();
          // if widget already has VM focus, we need to explicitly set focus to input when clicking on dateedit icon, otherwise mousetrap keyboards binding are not trapped.
          // if widget doesn't have VM focus, VM will set focus to input.
          if (this.hasFocus() && this.isEnabled()) {
            this._focusTargetElement.domFocus();
          }
          this.emit(context.constants.widgetEvents.requestFocus, event);
          this._dropDown.show(!this._dropDown.isVisible(), true);
        },

        // -- Calendar type specific functions --

        /**
         * Synchronize field date and picker date
         * @private
         */
        _onCalendarTypeDropDownOpen: function() {
          // init date picker with field date if possible. if field is invalid date, we use previous picker date instead
          // note : if not previous date, dropdown style doesn't set field with date of the day when opening
          this.setDate(this.getValue(), true);
        },
        _onCalendarTypeModalOpen: function() {
          this._calendarOpen = true;
          this.gbcReadonly(true);
          // add overlay
          var currentSession = context.SessionService.getCurrent();
          if (currentSession) {
            var currentApp = currentSession.getCurrentApplication();
            if (currentApp) {
              currentApp.getUI().getWidget().getElement().appendChild(context.DropDownService.getOverlay());
            }
          }
          // add buttons
          context.DropDownService.getOverlay().removeClass("hidden");
          if (this._dropDown) {
            this._addButtonsToPicker();
          }
          this._validValue = this.getValue();
          this._onCalendarTypeDropDownOpen();
          // note : if not previous date, modal style set field with date of the day when opening
          if (!this._validValue) {
            this._inputElement.value = this.getDate();
          }
          this._mustValid = true;
        },
        _onCalendarTypeModalClose: function() {
          this._calendarOpen = false;
          this.gbcReadonly(false);
          if (this._dropDown) {
            this._removeButtonsFromPicker();
          }
          if (this._mustValid) {
            this._mustValid = false;
            this.setLastValidValue();
          }
          this._validValue = null;
          if (this.isModal()) {
            context.DropDownService.getOverlay().addClass("hidden");
          }
        },
        _onCalendarTypeDropDownBlur: function(event) {
          if (!this._dropDown.isVisible()) {
            this._mustValid = false;
            this.emit(context.constants.widgetEvents.blur, event);
          } else {
            // if related click elements isn't child of dropdown, we can close the popup
            if (!event.relatedTarget || (event.relatedTarget !== this._dropDown.getElement() && !event.relatedTarget.parent(
                "gbc_DropDownWidget"))) {
              this._dropDown.show(false);
            } else {
              this._focusTargetElement.domFocus();
            }
            event.stopPropagation();
          }
        },
        _onCalendarTypeModalBlur: function(event) {
          if (this._dropDown.isVisible()) {
            this._focusTargetElement.domFocus();
            event.stopPropagation();
          }
        },

        _onDateSelect: function(date) {
          if (!this._keyPressed) {
            // if not modal or double clicked
            if (!this.isModal() || this._isDoubleClick()) {
              this._doubleClick(function() {
                this.emit(context.constants.widgetEvents.change, null, false);
              }.bind(this));
            }
          }
          this._keyPressed = false;
        },

        _doubleClick: function(callback) {
          this._mustValid = false;
          // Under IE & Edge, double click raise click event on element behind calendar and causes issues in INPUT ARRAY
          // This unwanted behavior needs to be canceled, so we remove calendar from dom a little bit later to avoid click event to be raised.
          if (window.browserInfo.isIE || window.browserInfo.isEdge) {
            window.setTimeout(function() {
              this._dropDown.show(false);
              if (callback) {
                callback();
              }
            }.bind(this), 150);
          } else {
            this._dropDown.show(false);
            if (callback) {
              callback();
            }
          }
        },

        _isDoubleClick: function() {
          var inputValue = this.getValue();
          var isDoubleClick = (new Date() - this._lastClick) < 350 && this._lastClickValue === inputValue;
          this._lastClick = new Date();
          this._lastClickValue = inputValue;
          return isDoubleClick;
        },

        getInput: function() {
          return this._inputElement;
        },

        _getPickerConf: function() {
          var pickerConf = {
            field: this._inputElement,
            bound: false,
            container: this._dropDown.getElement(),
            format: this._displayFormat,
            firstDay: this._firstDayOfWeek || 0,
            showTime: false,
            disableDayFn: this._disableDayFn,
            i18n: {
              previousMonth: i18next.t("gwc.date.previousMonth"),
              nextMonth: i18next.t("gwc.date.nextMonth"),
              months: this._localizedMonthsList,
              weekdays: this._localizedDaysList,
              weekdaysShort: this._localizedWeekdaysShortList,
              midnight: i18next.t("gwc.date.midnight"),
              noon: i18next.t("gwc.date.noon")
            }
          };
          if (this._useMingGuoYears) {
            pickerConf.onSelect = function(date) {
              var year = date.getFullYear();
              var mgyear = cls.DateTimeHelper.gregorianToMingGuoYears(date);
              this._inputElement.value = this.getValue().replace(year, mgyear);
              if (!this.isModal()) {
                this._dropDown.show(false);
                this.emit(context.constants.widgetEvents.change, event, false);
              }
            }.bind(this);
          } else {
            pickerConf.onSelect = this._onDateSelect.bind(this);
          }

          return pickerConf;
        },

        _addButtonsToPicker: function() {
          if (this._buttonCancel && this._buttonOk) {
            this._dropDown.getElement().appendChild(this._buttonOk);
            this._dropDown.getElement().appendChild(this._buttonCancel);
          }
        },

        _removeButtonsFromPicker: function() {
          if (this._buttonCancel && this._buttonOk) {
            try {
              this._dropDown.getElement().removeChild(this._buttonOk);
              this._dropDown.getElement().removeChild(this._buttonCancel);
            } catch (e) {}
          }
        },

        setCalendarType: function(calendarType) {
          var modalStyle = calendarType !== "dropdown";
          if (this._isModal !== modalStyle) {
            this._isModal = modalStyle;
            this._createContainer(modalStyle);
          } else {
            this._focusTargetElement = this._inputElement;
          }
        },

        isModal: function() {
          return this._isModal;
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @param align {String} a CSS text alignment. null restores the default value.
         */
        setTextAlign: function(align) {
          this.setStyle(">input", {
            "text-align": align
          });
        },

        /**
         * @see http://www.w3.org/wiki/CSS/Properties/text-align
         * @returns {String} a CSS text alignment
         */
        getTextAlign: function() {
          return this.getStyle(">input", "text-align");
        },

        initDatePicker: function() {
          this._localizedDaysList = i18next.t("gwc.date.dayList").split(",");
          this._localizedMonthsList = i18next.t("gwc.date.monthList").split(",");
          this._localizedWeekdaysShortList = i18next.t("gwc.date.weekdaysShort").split(",");

          if (this._picker) {
            this._picker.destroy();
          }
          var pickerConf = this._getPickerConf();
          this._picker = new Pikaday(pickerConf);
          if (!this.isModal()) {
            this._picker.bound = true;
          }
          if (this._picker._onKeyChange) { // remove unwanted native pikaday library event
            document.removeEventListener("keydown", this._picker._onKeyChange, false);
          }
          if (this._dateObj) {
            this._picker.setMoment(this._dateObj, true);
          }
        },

        /**
         * @param {String} firstDayOfWeek Localized name of the day to set as first day of the week
         */
        setFirstDayOfWeek: function(firstDayOfWeek) {
          if (firstDayOfWeek) {
            var dayList = cls.DateEditWidget.pikaDaysList;
            // var capitalized = firstDayOfWeek.charAt(0).toUpperCase() + firstDayOfWeek.slice(1);
            this._firstDayOfWeek = dayList.indexOf(firstDayOfWeek);
          } else if (this._firstDayOfWeek !== 0) {
            this._firstDayOfWeek = 0;
          }
        },

        /**
         * @returns {String} English name of the currently set first day of the week
         */
        getFirstDayOfWeek: function() {
          var dayList = cls.DateEditWidget.pikaDaysList;
          return dayList[this._firstDayOfWeek];
        },

        /**
         * @returns {Array} Array of days that are disabled
         */
        getDisabledDays: function() {
          return this._disabledDays;
        },

        /**
         * @param {string} disabledDays day names to disable separated with whitespace
         */
        setDisabledDays: function(disabledDays) {
          if (disabledDays) {
            var daysOffList = disabledDays.split(" ");
            this._disabledDays = daysOffList;
            var unsetThoseDays = [];
            var dayList = cls.DateEditWidget.pikaDaysList;
            //create a list of days to unset
            for (var d = 0; d < daysOffList.length; d++) {
              unsetThoseDays.push(dayList.indexOf(daysOffList[d]));
            }

            this._disableDayFn = function(day) {
              // forEach day in current view, return a Date Object
              if (unsetThoseDays.indexOf(day.getDay()) >= 0) {
                return true; //disable this day
              }
            };
          } else {
            this._disabledDays = null;
            this._disableDayFn = null;
          }

        },

        setLastValidValue: function() {
          if (this._inputElement) {
            this._inputElement.value = this._validValue;
          }
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
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              this._inputElement.removeAttribute("contentEditable");
            }
          } else if (this.hasFocus()) {
            this._inputElement.removeAttribute("readonly");
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              // need to add this to be sure that user can enter text in the field
              // even if setCursorPosition is called before
              this._inputElement.setAttribute("contentEditable", "true");
            }
          } else {
            this._inputElement.setAttribute("readonly", "readonly");
            if (window.browserInfo.isIE || window.browserInfo.isEdge) {
              this._inputElement.removeAttribute("contentEditable");
            }
          }
        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return this._isReadOnly || this._calendarOpen;
        },

        /**
         * @returns {string} the displayed date
         */
        getValue: function() {
          return this._inputElement.value;
        },

        /**
         * @param {string} dateString value the date to display
         */
        setValue: function(dateString) {
          this.setEditing(false);
          this.setDate(dateString);
        },

        // Date object manipulation
        getDate: function() {
          return this._dateObj ? this._dateObj.format(this._displayFormat) : null;
        },

        setDate: function(date, force) {
          //if (date) {
          // created date object based on received value using known format (for datepicker)
          if (this._useMingGuoYears) { // Convert Ming Guo year to 4 digit years for datepicker
            var str = cls.DateTimeHelper.mingGuoToGregorianYears(date);
            this._dateObj = context.moment(str, this._displayFormat);
          } else {
            this._dateObj = context.moment(date, this._displayFormat);
          }

          // on dropdown opening, check if date is valid and set the calendar with it
          if (force) {
            var dateObj = this.getDate();
            if (!dateObj || dateObj === "Invalid date") {
              this._dateObj = context.moment();
            }
            if (this._picker) {
              this._picker.setMoment(this._dateObj, true);
            }
          }

          // set non formatted value to input (already formatted by VM depending)
          if (this.getValue() !== date) {
            this._inputElement.value = date;
          }
          //}
        },

        setPictureMask: function(mask) {
          this._pictureMask = mask;
        },

        // Format manipulation
        setFormat: function(format) {
          if (format.match(/Y/g).length === 3) { // Ming Guo format
            this._useMingGuoYears = true;
            format = format.replace("YYY", "YYYY");
          }
          if (this._displayFormat !== format) {
            this._displayFormat = format;
          }
        },

        getFormat: function() {
          return this._displayFormat;
        },

        /**
         * Force display of picker
         * @param {Boolean} visible force show if true, hide otherwise
         */
        showPicker: function(visible) {
          this._dropDown.show(visible, true);
        },

        /**
         * Return cursors position
         * @returns {Object} object with cursor & cursor2 positions
         */
        getCursors: function() {
          return {
            start: this._inputElement.selectionStart,
            end: this._inputElement.selectionEnd
          };
        },

        /** Place the cursor at the given position,
         * @param {Number} cursor  first cursor position
         * @param {Number} cursor2 second cursor position
         */
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            cursor2 = cursor;
          }
          if (cursor2 && cursor2 < 0) {
            cursor2 = this.getValue() && this.getValue().length || 0;
          }
          this._inputElement.setCursorPosition(cursor, cursor2);
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
         * Sets the focus to the widget
         */
        setFocus: function() {
          $super.setFocus.call(this);
          this._focusTargetElement.domFocus();
          this._dropDown.show(true);
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);

          if (enabled && !this._picker) { // if first time we enable datepicker, we initialize it
            this.initDatePicker();
          }

          if (this._dropDown) {
            this._dropDown.setEnabled(enabled);
          }

          this._setInputReadOnly(!enabled);

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
    cls.WidgetFactory.register('DateEdit', cls.DateEditWidget);
  });
