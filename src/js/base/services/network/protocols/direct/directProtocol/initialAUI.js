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

(
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DirectInitialAUI
     */
    cls.DirectInitialAUI = context.oo.StaticClass(
      /** @lends classes.DirectInitialAUI */
      {
        run: function(data, application, callback) {
          application.model.logDvm(data);
          application.dvm.manageAuiOrders(data, callback);
        }
      });
  })(gbc, gbc.classes);
