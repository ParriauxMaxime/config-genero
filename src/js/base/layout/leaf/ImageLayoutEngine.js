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

modulum('ImageLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ImageLayoutEngine
     * @extends classes.LeafLayoutEngine
     */
    cls.ImageLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.ImageLayoutEngine.prototype */
      return {
        __name: "ImageLayoutEngine",

        __hasBeenConsideredAsFixed: false,

        considerWidgetAsFixed: function() {
          var isFontImage = this._widget.isFontImage();
          this.__hasBeenConsideredAsFixed = this.__hasBeenConsideredAsFixed || isFontImage;
          return this.__hasBeenConsideredAsFixed;
        }
      };
    });
  });
