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

modulum('WindowHelper',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Helper to use Window
     * @class classes.WindowHelper
     */
    cls.WindowHelper = context.oo.StaticClass(function() {
      /** @lends classes.WindowHelper */
      return {
        __name: "WindowHelper",
        _opened: [],
        openWindow: function(url, once) {
          if (once) {
            if (this._opened.indexOf(url) >= 0) {
              return;
            }
            this._opened.push(url);
          }
          return window.open(url);
        },
        closeWindow: function() {
          window.close();
        }
      };
    });
  });
