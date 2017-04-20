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

modulum('HBoxWidget', ['BoxWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.HBoxWidget
     * @extends classes.BoxWidget
     */
    cls.HBoxWidget = context.oo.Class(cls.BoxWidget, function($super) {
      /** @lends classes.HBoxWidget.prototype */
      return {
        __name: "HBoxWidget",
        constructor: function() {
          $super.constructor.call(this);
          this._element.addClass("g_HBoxLayoutEngine");
        },
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.HBoxLayoutEngine(this);
        },
        _createSplitter: function() {
          return cls.WidgetFactory.create("HBoxSplitter");
        }
      };
    });
    cls.WidgetFactory.register('HBox', cls.HBoxWidget);
  });
