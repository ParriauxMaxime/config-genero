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
modulum('VMRowSelectionEvent', ['VMEventBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     *
     * @class classes.VMRowSelectionEvent
     * @extends classes.VMEventBase
     */
    cls.VMRowSelectionEvent = context.oo.Class({
      base: cls.VMEventBase
    }, function() {
      /** @lends classes.VMRowSelectionEvent.prototype */
      return {
        __name: "VMRowSelectionEvent",
        type: "rowSelectionEvent",
        /**
         * @type {Object}
         */
        attributes: null,
        /**
         * @param {string} idRef reference of the table
         * @param {object} attr row update information
         */
        constructor: function(idRef, attr) {
          this.attributes = {
            idRef: idRef
          };
          var keys = Object.keys(attr);
          for (var k = 0; k < keys.length; k++) {
            this.attributes[keys[k]] = attr[keys[k]];
          }
        }
      };
    });
  });
