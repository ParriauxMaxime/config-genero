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
modulum('VMConfigureEvent', ['VMEventBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     *
     * @class classes.VMConfigureEvent
     * @extends classes.VMEventBase
     */
    cls.VMConfigureEvent = context.oo.Class({
      base: cls.VMEventBase
    }, function() {
      /** @lends classes.VMConfigureEvent.prototype */
      return {
        __name: "VMConfigureEvent",
        type: "configureEvent",
        /**
         * @type {Object}
         */
        attributes: null,
        /**
         * @type {Function}
         */
        lazyResolve: null,
        /**
         * @param {string} idRef reference of the node to update
         * @param {object} attr dictionary of attributes to update
         * @param {function} lazyResolve
         */
        constructor: function(idRef, attr, lazyResolve) {
          this.attributes = {
            idRef: idRef
          };
          var keys = Object.keys(attr);
          for (var k = 0; k < keys.length; k++) {
            this.attributes[keys[k]] = attr[keys[k]];
          }
          this.lazyResolve = lazyResolve;
        }
      };
    });
  });
