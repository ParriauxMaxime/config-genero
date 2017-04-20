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

modulum('DummyDateTimeEditWidget', ['DateTimeEditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * DummyDateTimeEdit widget.
     * @class classes.DummyDateTimeEditWidget
     * @extends classes.DateTimeEditWidget
     */
    cls.DummyDateTimeEditWidget = context.oo.Class(cls.DateTimeEditWidget, function($super) {
      /** @lends classes.DummyDateTimeEditWidget.prototype */
      return {
        __name: "DummyDateTimeEditWidget",
        __templateName: "DateTimeEditWidget",
        _pikerIcon: null,
        _unboundField: null,

        _initElement: function(datetime) {
          $super._initElement.call(this, datetime);
          this._displayFormat = "YYYY-MM-DD HH:mm:ss";
          this._unboundField = document.createElement("div");
          this._pikerIcon = this._element.getElementsByTagName("i")[0];
          this._pikerIcon.on('click.IconDateEditWidget', this._onIconClick.bind(this));
        },

        destroy: function() {
          if (this._pikerIcon) {
            this._pikerIcon.off('click.IconDateEditWidget');
            this._pikerIcon = null;
          }
          $super.destroy.call(this);
          this._unboundField = null;
        },

        _onIconClick: function(event) {
          event.stopPropagation();
          this.emit(context.constants.widgetEvents.requestFocus, event);
          this._dropDown.getElement().appendChild(this._picker.el);
          if (this.hasFocus() && this.isEnabled()) {
            this._inputElement.domFocus();
          }
          this._dropDown.show(!this._dropDown.isVisible(), true);
        },

        _onDateEditClick: function(event) {
          event.stopPropagation();
          this.emit(context.constants.widgetEvents.requestFocus, event);
        },

        _onOk: function(event) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          this._mustValid = false;
          this._dropDown.show(false);
          this._inputElement.domFocus();
        },

        _getPickerConf: function() {
          var pickerConf = $super._getPickerConf.call(this);
          pickerConf.field = this._unboundField;
          return pickerConf;
        },

        // -- Calendar type specific functions --

        _onDateSelect: function(date) {
          this.setValue(context.moment(date).format(this._displayFormat));

          if (!this._keyPressed) {
            // if not modal or double clicked
            if (!this.isModal() || this._isDoubleClick()) {
              this._mustValid = false;
              this._dropDown.show(false);
            }
          }
          this._keyPressed = false;
        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle(">input", {
            "text-align": this.getStart()
          });
        },

        setPictureMask: function(mask) {}

      };
    });
    cls.WidgetFactory.register('DummyDateTimeEdit', cls.DummyDateTimeEditWidget);
  });
