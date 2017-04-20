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

modulum('TraditionalWindowWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class classes.TraditionalWindowWidget
     * @extends classes.WidgetGroupBase
     */
    cls.TraditionalWindowWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.TraditionalWindowWidget.prototype */
      return {
        __name: "TraditionalWindowWidget",

        constructor: function() {
          $super.constructor.call(this);
        }

      };
    });
    cls.WidgetFactory.register('TraditionalWindow', cls.TraditionalWindowWidget);
  });
