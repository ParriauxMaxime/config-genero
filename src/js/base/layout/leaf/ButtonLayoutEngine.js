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

modulum('ButtonLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ButtonLayoutEngine
     * @extends classes.LeafLayoutEngine
     */
    cls.ButtonLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.ButtonLayoutEngine.prototype */
      return {
        __name: "ButtonLayoutEngine",

        measure: function() {
          $super.measure.call(this);

          var layoutInfo = this._widget.getLayoutInformation();
          var preferedWidth = layoutInfo.getPreferred().getWidth() + layoutInfo.getDecorating().getWidth(true);
          var minSize = layoutInfo.getMinimal();
          var maxSize = layoutInfo.getMaximal();
          var measuredSize = layoutInfo.getMeasured();

          if (!layoutInfo.getCurrentSizePolicy().isFixed()) {
            var sizePolicy = layoutInfo.getSizePolicyConfig().mode;
            if (sizePolicy === "initial") {
              var width = preferedWidth > measuredSize.getWidth(true) ? preferedWidth : measuredSize.getWidth(true);
              minSize.setWidth(width);
              measuredSize.setWidth(width);
              maxSize.setWidth(width);
            }
          }
        }
      };
    });
  });
