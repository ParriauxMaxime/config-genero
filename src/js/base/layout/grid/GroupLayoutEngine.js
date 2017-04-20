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

modulum('GroupLayoutEngine', ['GridLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.GroupLayoutEngine
     * @extends classes.GridLayoutEngine
     */
    cls.GroupLayoutEngine = context.oo.Class(cls.GridLayoutEngine, function($super) {
      /** @lends classes.GroupLayoutEngine.prototype */
      return {
        __name: "GroupLayoutEngine",

        _titleWidth: 0,

        measure: function(invalidation) {
          $super.measure.call(this);
          if (this._widget._title.getLayoutEngine().isInvalidatedMeasure(invalidation)) {
            this._titleWidth = this._widget._title.getElement().clientWidth + this._getLayoutInfo().getDecorating().getWidth(true);
          }
        },
        ajust: function() {
          $super.ajust.call(this);
          if (this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().getChildren().length === 1) {
            this._getLayoutInfo().setMaximal(null, null);
          }
          var layoutInfo = this._getLayoutInfo();
          var minimal = layoutInfo.getMinimal().getWidth(true);
          layoutInfo.getMinimal().setWidth(Math.max(this._titleWidth, minimal));
        },
        prepare: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var allocatedW = layoutInfo.getAllocated().getWidth(true);
          var allocatedH = layoutInfo.getAllocated().getHeight(true);
          $super.prepare.call(this);

          var visibleChildren = this.getRenderableChildren().filter(function(item) {
            return item && item.isHidden && !item.isHidden();
          });
          if (visibleChildren.length === 1 && (visibleChildren[0] instanceof cls.VBoxWidget)) {
            visibleChildren[0].getLayoutInformation().getAvailable().setWidth(layoutInfo.getAvailable().getWidth() - layoutInfo.getDecorating()
              .getWidth(true));
          }

          if (!this._widget._isGridChildrenInParent) {
            layoutInfo.setAllocated(
              Math.max(
                Math.min(
                  Math.max(this._xspace.getCalculatedSize() + layoutInfo.getDecorating().getWidth(true), allocatedW),
                  layoutInfo.getAvailable().getWidth(true)
                ),
                layoutInfo.getMinimal().getWidth(true)
              ),
              Math.max(
                Math.min(
                  Math.max(this._yspace.getCalculatedSize() + layoutInfo.getDecorating().getHeight(true), allocatedH),
                  layoutInfo.getAvailable().getHeight(true)
                ),
                layoutInfo.getMinimal().getHeight(true)
              )
            );
          }

          if (this._widget && this._widget.getParentWidget() && this._widget.getParentWidget().__name === "FormWidget") {
            layoutInfo.setAllocated(
              Math.max(
                layoutInfo.getAvailable().getWidth(true),
                layoutInfo.getMinimal().getWidth(true)
              ),
              Math.max(
                layoutInfo.getAvailable().getHeight(true),
                layoutInfo.getMinimal().getHeight(true)
              )
            );
            this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
              "height": layoutInfo.getAllocated().getHeight() + "px !important",
              "width": layoutInfo.getAllocated().getWidth() + "px !important"
            };
          }
        },
        updateInvalidated: function(invalidation) {
          $super.updateInvalidated.call(this, invalidation);
          this._widget._title.getLayoutEngine().updateInvalidated(invalidation);
        }
      };
    });
  });
