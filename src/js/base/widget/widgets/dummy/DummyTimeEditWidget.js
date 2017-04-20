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

modulum('DummyTimeEditWidget', ['TimeEditWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * TimeEdit widget.
     * @class classes.DummyTimeEditWidget
     * @extends classes.TimeEditWidget
     */
    cls.DummyTimeEditWidget = context.oo.Class(cls.TimeEditWidget, function($super) {
      /** @lends classes.DummyTimeEditWidget.prototype */
      return {
        __name: "DummyTimeEditWidget",
        __templateName: "TimeEditWidget",

        /**
         * All input widgets in constructs are left aligned (because of search criteria)
         */
        setTextAlign: function(align) {
          this.setStyle("input", {
            "text-align": this.getStart()
          });
        },
        _onClick: function(event) {
          this.emit(context.constants.widgetEvents.click, event);
          //this._updateCurrentGroup();
        },
        _onKeyUp: function(event) {

        },
        _onColon: function(evt) {

        },
        _onBackspace: function(evt) {

        },
        _onDel: function(evt) {

        },
        setCursors: function(cursor, cursor2) {
          if (!cursor2) {
            this._inputElement.setCursorPosition();
          } else if (cursor2 === -1) {
            this._inputElement.setCursorPosition(0, this.getValue().length);
          } else {
            this._inputElement.setCursorPosition(cursor, cursor2);
          }
        }

      };
    });
    cls.WidgetFactory.register('DummyTimeEdit', cls.DummyTimeEditWidget);
  });
