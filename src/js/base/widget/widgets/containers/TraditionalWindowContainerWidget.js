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

modulum('TraditionalWindowContainerWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class classes.TraditionalWindowContainerWidget
     * @extends classes.WidgetGroupBase
     */
    cls.TraditionalWindowContainerWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.TraditionalWindowContainerWidget.prototype */
      return {
        __name: "TraditionalWindowContainerWidget",

        constructor: function() {
          $super.constructor.call(this);
        }
      };
    });
    cls.WidgetFactory.register('TraditionalWindowContainer', cls.TraditionalWindowContainerWidget);
  });
