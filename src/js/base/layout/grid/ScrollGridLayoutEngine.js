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

modulum('ScrollGridLayoutEngine', ['GridLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ScrollGridLayoutEngine
     * @extends classes.GridLayoutEngine
     */
    cls.ScrollGridLayoutEngine = context.oo.Class(cls.GridLayoutEngine, function($super) {
      /** @lends classes.ScrollGridLayoutEngine.prototype */
      return {
        __name: "ScrollGridLayoutEngine",
        constructor: function(widget) {
          $super.constructor.call(this, widget);
        },

        ajust: function() {
          $super.ajust.call(this);
          var layoutInfo = this._getLayoutInfo();
          if (!layoutInfo.lineHeight) {
            layoutInfo.lineHeight = layoutInfo.getMeasured().getHeight();
          }
          layoutInfo.getMinimal().setHeight(layoutInfo.lineHeight + layoutInfo.getDecorating()
            .getHeight(true));
        },

        measure: function() {
          $super.measure.call(this);
          var decorating = this._getLayoutInfo().getDecorating();
          decorating.setWidth(decorating.getWidth() + window.scrollBarSize);
        },

        prepare: function() {
          $super.prepare.call(this);
          var layoutInfo = this._widget.getLayoutInformation();
          var rules = this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"];
          rules.height = layoutInfo.getAllocated().getHeight() + "px";
          rules.width = layoutInfo.getAllocated().getWidth() + "px";
        }
      };
    });
  });
