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

modulum('VBoxWidget', ['BoxWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.VBoxWidget
     * @extends classes.BoxWidget
     */
    cls.VBoxWidget = context.oo.Class(cls.BoxWidget, function($super) {
      /** @lends classes.VBoxWidget.prototype */
      return {
        __name: "VBoxWidget",
        constructor: function() {
          $super.constructor.call(this);
          this._element.addClass("g_VBoxLayoutEngine");
        },
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.VBoxLayoutEngine(this);
        },
        _createSplitter: function() {
          return cls.WidgetFactory.create("VBoxSplitter");
        }
      };
    });
    cls.WidgetFactory.register('VBox', cls.VBoxWidget);
  });
