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

modulum('SliderLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.SliderLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.SliderLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.SliderLayoutEngine.prototype */
      return {
        __name: "SliderLayoutEngine",

        measure: function() {
          $super.measure.call(this);
          var layoutInfo = this._widget.getLayoutInformation();

          if (this._widget._orientation === "vertical") {
            // Reverse Measured
            layoutInfo.setMeasured(this._getLayoutInfo().getMeasured().getHeight(), this._getLayoutInfo().getMeasured().getWidth());

            // Reverse Prefered
            layoutInfo.setPreferred(this._getLayoutInfo().getPreferred().getHeight(), this._getLayoutInfo().getPreferred().getWidth());

            // Reverse Minimal
            layoutInfo.setMinimal(this._getLayoutInfo().getMinimal().getHeight(), this._getLayoutInfo().getMinimal().getWidth());

            // Reverse Maximal
            layoutInfo.setMaximal(this._getLayoutInfo().getMaximal().getHeight(), this._getLayoutInfo().getMaximal().getWidth());

          }
        },

      };
    });
  });
