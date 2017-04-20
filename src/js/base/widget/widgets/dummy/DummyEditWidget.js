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

modulum('DummyEditWidget', ['EditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Edit widget.
     * @class classes.DummyEditWidget
     * @extends classes.EditWidget
     */
    cls.DummyEditWidget = context.oo.Class(cls.EditWidget, function($super) {
      /** @lends classes.DummyEditWidget.prototype */
      return {
        __name: "DummyEditWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this._layoutInformation._fixedSizePolicyForceMeasure = true;
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._element.addClass("gbc_EditWidget");
        },

        /**
         * @param {boolean} readonly true to set the widget as read-only, false otherwise
         */
        setReadOnly: function(readonly) {

        },

        /**
         * @returns {boolean} true if the widget is read-only, false otherwise
         */
        isReadOnly: function() {
          return !!this._element.getAttribute("readonly");
        },

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength) {

        },

        /**
         * @returns {number} the maximum number of characters allowed in the field
         */
        getMaxLength: function() {
          this._element.getIntAttribute("maxlength");
        },

        /**
         * @param {boolean} isPassword true if the widget should be in 'password' mode, false otherwise
         */
        setIsPassword: function(isPassword) {

        },

        /**
         * @returns {boolean} true if the widget is in 'password' mode, false otherwise
         */
        isPassword: function() {
          return this._element.getAttribute("type") === "password";
        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle(">input", {
            "text-align": this.getStart()
          });
        },

        /**
         * Used to manage the keyboardHint.
         * @param {string} valType the type attribute value to set
         */
        setType: function(valType) {

        },

        /**
         * @returns {String} this Edit current type
         */
        getType: function() {
          return this._element.getAttribute("type");
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          this._inputElement.domFocus();
          $super.setFocus.call(this);
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          $super.setEnabled.call(this, enabled);
        },

      };
    });
    cls.WidgetFactory.register('DummyEdit', cls.DummyEditWidget);
  });
