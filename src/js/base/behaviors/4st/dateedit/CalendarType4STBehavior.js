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

modulum('CalendarType4STBehavior', ['StyleBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CalendarType4STBehavior
     * @extends classes.StyleBehaviorBase
     */
    cls.CalendarType4STBehavior = context.oo.Singleton(cls.StyleBehaviorBase, function($super) {
      /** @lends classes.CalendarType4STBehavior.prototype */
      return {
        __name: "CalendarType4STBehavior",

        /**
         * calendarType = { "modal" (default) | "dropdown" }
         */
        usedStyleAttributes: ["calendarType"],

        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCalendarType) {
            var calendarType = controller.getAnchorNode().getStyleAttribute('calendarType');
            widget.setCalendarType(calendarType);
          }
        }
      };
    });
  });
