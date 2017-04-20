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

modulum('DummyButtonEditWidget', ['ButtonEditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ButtonEdit widget.
     * @class classes.DummyButtonEditWidget
     * @extends classes.ButtonEditWidget
     */
    cls.DummyButtonEditWidget = context.oo.Class(cls.ButtonEditWidget, function($super) {
      /** @lends classes.DummyButtonEditWidget.prototype */
      return {
        __name: "DummyButtonEditWidget",
        __templateName: "ButtonEditWidget",

        /**
         * @param {number} maxlength maximum number of characters allowed in the field
         */
        setMaxLength: function(maxlength) {

        },

        /**
         * @param {boolean} isPassword true if the widget should be in 'password' mode, false otherwise
         */
        setIsPassword: function(isPassword) {

        },

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this._edit.setTextAlign(this.getStart());
        }
      };
    });
    cls.WidgetFactory.register('DummyButtonEdit', cls.DummyButtonEditWidget);
  });
