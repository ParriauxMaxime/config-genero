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

modulum('RipGraphicWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Label widget.
     * @class classes.RipGraphicWidget
     * @extends classes.WidgetBase
     */
    cls.RipGraphicWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.RipGraphicWidget.prototype */
      return {
        __name: "RipGraphicWidget",

        setType: function(type) {
          this.addClass(type);
        }
      };
    });
    cls.WidgetFactory.register('RipGraphic', cls.RipGraphicWidget);
  });
