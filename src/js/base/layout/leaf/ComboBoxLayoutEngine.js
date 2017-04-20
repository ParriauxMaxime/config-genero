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

modulum('ComboBoxLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ComboBoxLayoutEngine
     * @extends classes.LeafLayoutEngine
     */
    cls.ComboBoxLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.ComboBoxLayoutEngine.prototype */
      return {
        __name: "ComboBoxLayoutEngine",
        prepareMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          if (this._dataContentMeasure) {
            var sizeHintWidth = layoutInfo.getSizeHint().getWidth();
            var width = (!layoutInfo._rawGridWidth && cls.Size.isCols(sizeHintWidth)) ? parseInt(sizeHintWidth, 10) :
              layoutInfo.getGridWidth();
            if (width > this._reservedDecorationSpace) {
              width -= this._reservedDecorationSpace;
            }
            if (width !== this._sampleWidth || layoutInfo.getGridHeight() !== this._sampleHeight) {
              var sample = cls.Measurement.getTextSample(width, layoutInfo.getGridHeight());
              this._sampleWidth = width;
              this._sampleHeight = layoutInfo.getGridHeight();
              this._textSample = sample;
              this._dataContentMeasure.textContent = sample;
            }

            if (!this._widget.getLayoutInformation().getCurrentSizePolicy().isFixed()) {
              var children = this._widget.getDropDown().getChildren();
              var longestValue = this._textSample;
              for (var i = 0; i < children.length; i++) {
                var value = children[i].getText();
                if (value) {
                  if (value.length > longestValue.length) {
                    longestValue = value;
                  }
                }
              }
              this._dataContentMeasure.textContent = longestValue;
            }
          }
        }
      };
    });
  });
