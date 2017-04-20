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

modulum('HBoxLayoutEngine', ['DBoxLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.HBoxLayoutEngine
     * @extends classes.DBoxLayoutEngine
     */
    cls.HBoxLayoutEngine = context.oo.Class(cls.DBoxLayoutEngine, function() {
      /** @lends classes.HBoxLayoutEngine.prototype */
      return {
        __name: "HBoxLayoutEngine",
        _mainSizeGetter: "getWidth",
        _mainSizeSetter: "setWidth",
        _mainHasSizeGetter: "hasWidth",
        _mainStretch: "X",
        _oppositeSizeGetter: "getHeight",
        _oppositeSizeSetter: "setHeight",
        _oppositeHasSizeGetter: "hasHeight",
        _oppositeStretch: "Y",
        /**
         * @protected
         * @param {number} position
         * @param {number} start
         * @param {number} size
         */
        _setItemClass: function(position, start, size) {
          var isReversed = this._widget.isReversed();
          var selector = ".g_measured .gbc_HBoxWidget" + this._widget._getCssSelector() + ">.g_BoxElement:nth-of-type(" + (position +
            1) + ")";
          var pos = cls.Size.cachedPxImportant(start);
          this._styleRules[selector] = {};
          this._styleRules[selector][this._widget.getStart()] = pos;
          this._styleRules[selector].width = cls.Size.cachedPxImportant(size);
        },
        /**
         * @protected
         * @param {number} position
         */
        _setItemOppositeClass: function(position) {
          this._styleRules[".g_measured .gbc_HBoxWidget" + this._widget._getCssSelector() + ">.g_BoxElement:nth-of-type(" + (
              position + 1) +
            ")"].height = cls.Size.cachedPxImportant(this._getLayoutInfo().getAllocated().getHeight());
        },
        _applyMeasure: function(mainSize, oppositeSize) {
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
            width: mainSize + "px",
            height: oppositeSize + "px"
          };
          this._getLayoutInfo().setMeasured(mainSize, oppositeSize);
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         * @returns {boolean}
         */
        _isStretched: function(widget) {
          var wInfo = this._getLayoutInfo(widget);
          return wInfo.getPreferred().getWidth() > 0;
        }
      };
    });
  });
