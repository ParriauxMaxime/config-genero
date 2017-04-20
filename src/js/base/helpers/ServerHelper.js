/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ServerHelper',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Helper for server informations
     * @class classes.ServerHelper
     */
    cls.ServerHelper = context.oo.StaticClass(function() {
      /** @lends classes.ServerHelper */
      return {
        __name: "ServerHelper",
        verRE: /GAS\/([0-9]+)\.([0-9]+)\.([0-9]+)(-([0-9]+))?/,
        isValid: function(ver) {
          return this.verRE.test(ver);
        },
        compare: function(a, b) {
          var pa = this.verRE.exec(a) || [];
          var pb = this.verRE.exec(b) || [];
          for (var i = 0; i < 3; i++) {
            var na = Number(pa[i + 1]);
            var nb = Number(pb[i + 1]);
            if (na > nb) {
              return 1;
            }
            if (nb > na) {
              return -1;
            }
            if (!isNaN(na) && isNaN(nb)) {
              return 1;
            }
            if (isNaN(na) && !isNaN(nb)) {
              return -1;
            }
          }
          return 0;
        }
      };
    });
  });
