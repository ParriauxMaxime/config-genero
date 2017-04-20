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

modulum('RowInfoController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RowInfoController
     * @extends classes.ControllerBase
     */
    cls.RowInfoController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.RowInfoController.prototype */
      return {
        __name: "RowInfoController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // vm behaviors
          this._addBehavior(cls.RowSelectedVMBehavior);
          // ui behaviors
        }
      };
    });
    cls.ControllerFactory.register("RowInfo", cls.RowInfoController);

  });
