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

modulum('DateTimeEditWidget', ['DateEditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * DateTimeEdit widget.
     * @class classes.DateTimeEditWidget
     * @extends classes.DateEditWidget
     */
    cls.DateTimeEditWidget = context.oo.Class(cls.DateEditWidget, function($super) {
      /** @lends classes.DateTimeEditWidget.prototype */
      return {
        __name: "DateTimeEditWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _showSeconds: false,
        _button: null,
        _displayFormat: null,
        _maxLength: -1,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
          }
        },

        _initElement: function() {
          $super._initElement.call(this, true);
          // default datetime format
          this._displayFormat = "MM/DD/YYYY HH:mm:ss";
          // since height of dropdown changes when moving of month, we need to specify max height ourself (used in DropDownContainerWidget)
          this._dropDown.maxHeight = 340;
          this._inputElement.on('keydown.EditWidget', cls.TextWidgetBase._onKeyDown.bind(this));
        },

        _getPickerConf: function() {
          var pickerConf = $super._getPickerConf.call(this);
          pickerConf.showTime = true;
          pickerConf.showSeconds = this._showSeconds;
          return pickerConf;
        },

        /**
         * Update date time format
         * @param format
         */
        setFormat: function(format) {
          this._displayFormat = format;
          this._showSeconds = !!~format.toLowerCase().indexOf("s");
          if (this._picker) {
            this._picker.destroy();
          }
          this.initDatePicker();
        },

        destroy: function() {
          $super.destroy.call(this);
        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          return this._maxLength;
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
         * Defines a placeholder text
         * @param placeholder
         */
        setPlaceHolder: function(placeholder) {
          this._inputElement.setAttribute("placeholder", placeholder);
        }

      };
    });
    cls.WidgetFactory.register('DateTimeEdit', cls.DateTimeEditWidget);
  });
