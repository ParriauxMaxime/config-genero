/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FormLayoutInformation', ['LayoutInformation'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FormLayoutInformation
     * @extends classes.LayoutInformation
     */
    cls.FormLayoutInformation = context.oo.Class(cls.LayoutInformation, function($super) {
      /** @lends classes.FormLayoutInformation.prototype */
      return {
        __name: "FormLayoutInformation",
        /**
         * Min size hint (minWidth, minHeight)
         * @type {classes.Size}
         */
        _minSizeHint: null,

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        constructor: function(widget) {
          this._minSizeHint = new cls.Size();
          $super.constructor.call(this, widget);
        },

        reset: function() {
          $super.reset.call(this);
          this._minSizeHint.reset();
        },

        /**
         *
         * @returns {classes.Size}
         */
        getMinSizeHint: function() {
          return this._minSizeHint;
        },

        /**
         *
         * @param {number} width
         * @param {number} height
         */
        setMinSizeHint: function(width, height) {
          this._minSizeHint.setWidth(width);
          this._minSizeHint.setHeight(height);
        }
      };
    });
  });
