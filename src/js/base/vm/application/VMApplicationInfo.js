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
modulum('VMApplicationInfo',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Stores application general information like VM dialog configuration and parameters.
     * @class classes.VMApplicationInfo
     */
    cls.VMApplicationInfo = context.oo.Class(function() {
      /** @lends classes.VMApplicationInfo.prototype */
      return {
        __name: "VMApplicationInfo",
        /**
         * Application VM dialog mode : 'ua' or 'direct'
         * @type {String}
         */
        mode: null,
        /**
         * Application identifier
         * @type {String}
         */
        appId: null,
        /**
         * First front-end identifier (VM dialog)
         * @type {String}
         */
        frontEndId1: null,
        /**
         * Second front-end identifier (VM dialog)
         * @type {String}
         */
        frontEndId2: null,
        /**
         * Default time to ping VM (ms)
         * @type {Number}
         */
        pingTimeout: 1000,
        /**
         * VM connection info
         * @type {Object}
         */
        connectionInfo: null,
        /**
         * Session identifier in UA dialog
         * @type {String}
         */
        session: null,
        /**
         * Page number in UA dialog
         * @type {Number}
         */
        page: 1,
        /**
         * Aui dialog om order increment
         * @type {Number}
         */
        auiOrder: 0,
        /**
         * Default relative path to Web components
         * @type {String}
         */
        webComponent: null,
        /**
         * User defined relative path to Web components
         * @type {String}
         */
        webComponentUsrPath: null,
        /**
         * If style browserMultiPage is activated, helps to know where to open the new application
         * @type {boolean}
         */
        inNewWindow: false,
        /**
         *
         * @param {classes.VMApplicationInfo|Object} info - info definition
         */
        constructor: function(info) {
          this.mode = "ua";
          var keys = Object.keys(info);
          for (var k = 0; k < keys.length; k++) {
            this[keys[k]] = info[keys[k]];
          }
          this.ending = null;
        }
      };
    });
  });
