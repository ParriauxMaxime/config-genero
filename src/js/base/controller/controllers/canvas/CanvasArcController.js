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

modulum('CanvasArcController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CanvasArcController
     * @extends classes.ControllerBase
     */
    cls.CanvasArcController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.CanvasArcController.prototype */
      return {
        __name: "CanvasArcController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasArcParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        }
      };
    });
    cls.ControllerFactory.register("CanvasArc", cls.CanvasArcController);

  });
