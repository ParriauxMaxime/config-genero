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

modulum('CanvasTextController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CanvasTextController
     * @extends classes.ControllerBase
     */
    cls.CanvasTextController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.CanvasTextController.prototype */
      return {
        __name: "CanvasTextController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasTextParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        },

        onAfterLayout: function() {
          this.applyBehaviors(null, true);
        }
      };
    });
    cls.ControllerFactory.register("CanvasText", cls.CanvasTextController);

  });
