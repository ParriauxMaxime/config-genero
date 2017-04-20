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

modulum('DummySpinEditWidget', ['SpinEditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * SpinEdit widget.
     * @class classes.DummySpinEditWidget
     * @extends classes.SpinEditWidget
     */
    cls.DummySpinEditWidget = context.oo.Class(cls.SpinEditWidget, function($super) {
      /** @lends classes.DummySpinEditWidget.prototype */
      return {
        __name: "DummySpinEditWidget",
        __templateName: "SpinEditWidget",

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": this.getStart()
          });
        },

      };
    });
    cls.WidgetFactory.register('DummySpinEdit', cls.DummySpinEditWidget);
  });
