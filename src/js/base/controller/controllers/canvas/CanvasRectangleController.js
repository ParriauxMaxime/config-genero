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

modulum('CanvasRectangleController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CanvasRectangleController
     * @extends classes.ControllerBase
     */
    cls.CanvasRectangleController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.CanvasRectangleController.prototype */
      return {
        __name: "CanvasRectangleController",

        _initBehaviors: function() {
          this._addBehavior(cls.CanvasRectangleParametersVMBehavior);
          this._addBehavior(cls.CanvasFillColorVMBehavior);
          this._addBehavior(cls.CanvasItemOnClickUIBehavior);
        }
      };
    });
    cls.ControllerFactory.register("CanvasRectangle", cls.CanvasRectangleController);

  });
