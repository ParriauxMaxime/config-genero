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

modulum('Event',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Creates an Event object given a type
     * @class classes.Event
     * @classdesc A property bag used in eventing system
     */
    cls.Event = context.oo.Class( /** @lends classes.Event.prototype */ {
      __name: "Event",
      cancel: false,
      type: null,
      /**
       * @constructs {classes.Event}
       * @param type
       */
      constructor: function(type) {
        this.type = type;
      }
    });
  });
