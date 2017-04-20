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

modulum('GridLayoutEngine', ['LayoutEngineBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.GridLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.GridLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      /** @lends classes.GridLayoutEngine.prototype */
      return {
        __name: "GridLayoutEngine",
        /**
         * @type {classes.WidgetBase[]}
         */
        _registeredWidgets: null,
        /**
         * @type {object<Number, {x:classes.GridDimensionSlot,y:classes.GridDimensionSlot}>}
         */
        _registeredSlots: null,
        /**
         * @type {object<Number, HandleRegistration>}
         */
        _registeredWidgetWatchers: null,
        /**
         * @type {classes.GridLayoutEngineX}
         */
        _xspace: null,
        /**
         * @type {classes.GridLayoutEngineY}
         */
        _yspace: null,
        _decorationMeasured: false,
        /**
         *
         * @param {classes.WidgetGroupBase} widget
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._registeredWidgets = [];
          this._registeredSlots = {};
          this._registeredWidgetWatchers = {};
          this._xspace = new cls.GridLayoutEngineX(widget);
          this._yspace = new cls.GridLayoutEngineY(widget);
        },

        destroy: function() {
          for (var w in this._registeredWidgetWatchers) {
            var watch = this._registeredWidgetWatchers[w];
            if (watch) {
              watch();
            }
          }
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            wi.destroy();
            this.unregisterChild(wi);
          }
          for (var s in this._registeredSlots) {
            var slot = this._registeredSlots[s];
            if (slot) {
              slot.x.destroy();
              slot.y.destroy();
            }
          }
          this._xspace.destroy();
          this._yspace.destroy();
          this._xspace = null;
          this._yspace = null;
          this._registeredSlots = null;
          this._registeredWidgetWatchers = null;
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 1 : widthHint, ((typeof(heightHint) ===
              "undefined") || heightHint === null || heightHint === "") ? 1 : heightHint
          );
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        registerChild: function(widget) {
          var slotRecycle = null;
          if (this._registeredWidgets.indexOf(widget) >= 0) {
            slotRecycle = this.unregisterChild(widget);
          }
          var info = widget.getLayoutInformation(),
            id = widget.getUniqueIdentifier();
          if (!this._registeredSlots[id]) {
            this._registeredWidgets.push(widget);
            var slotX = slotRecycle && slotRecycle.x && slotRecycle.x.reset(info.getGridX(), info.getGridWidth()) ||
              new cls.GridDimensionSlot(info.getGridX(), info.getGridWidth());
            var slotY = slotRecycle && slotRecycle.y && slotRecycle.y.reset(info.getGridY(), info.getGridHeight()) ||
              new cls.GridDimensionSlot(info.getGridY(), info.getGridHeight());
            this._registeredSlots[id] = {
              x: this._xspace.registerSlot(slotX),
              y: this._yspace.registerSlot(slotY)
            };
            this._registeredWidgetWatchers[id] = info.onGridInfoChanged(this.registerChild.bind(this, widget));
          }
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        unregisterChild: function(widget) {
          var id = widget.getUniqueIdentifier();
          if (this._registeredSlots[id]) {
            var slotRecycle = {};
            this._registeredWidgetWatchers[id]();
            this._registeredWidgetWatchers[id] = null;
            var index = this._registeredWidgets.indexOf(widget);
            if (index >= 0) {
              this._registeredWidgets.splice(index, 1);
            }
            slotRecycle.x = this._xspace.unregisterSlot(this._registeredSlots[id].x);
            slotRecycle.y = this._yspace.unregisterSlot(this._registeredSlots[id].y);
            this._registeredSlots[id] = null;
            return slotRecycle;
          }
          return null;
        },

        /**
         *
         * @param {number} x
         * @param {number} y
         * @param {boolean} all
         * @returns {*}
         */
        getSlotAt: function(x, y, all) {
          var ids = Object.keys(this._registeredSlots);
          var result = !!all ? [] : null;
          for (var i = 0; i < ids.length; i++) {
            var slot = this._registeredSlots[ids[i]];
            if (x >= slot.x.getPosition() && x <= slot.x.getLastPosition() &&
              y >= slot.y.getPosition() && y <= slot.y.getLastPosition()) {
              var res = {
                slot: slot,
                id: ids[i]
              };
              if (!all) {
                return res;
              } else {
                result.push(res);
              }
            }
          }
          return !!(result && result.length) ? result : null;
        },
        invalidateMeasure: function(invalidation) {
          $super.invalidateMeasure.call(this, invalidation);
          this._decorationMeasured = false;
        },

        measure: function() {
          this._getLayoutInfo().setMeasured(cls.Size.undef, cls.Size.undef);
          //this._getLayoutInfo().setPreferred(0, 0);
          this._getLayoutInfo().setAllocated(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setAvailable(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setMinimal(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setMaximal(cls.Size.undef, cls.Size.undef);
          if (!this._decorationMeasured) {
            this._decorationMeasured = true;
            var element = this._widget.getElement(),
              container = this._widget.getContainerElement();
            this._getLayoutInfo().setDecorating(
              element.clientWidth - container.clientWidth,
              element.clientHeight - container.clientHeight
            );
            this._getLayoutInfo().setDecoratingOffset(
              container.offsetLeft - element.offsetLeft,
              container.offsetTop - element.offsetTop
            );
          }
        },
        ajust: function() {
          var layoutInfo = this._getLayoutInfo();
          if (!!this._registeredWidgets.length) {
            for (var i = 0; i < this._registeredWidgets.length; i++) {
              var widget = this._registeredWidgets[i];

              var potentialOwnerDisplayed = !widget.getLayoutInformation().getOwningGrid() ||
                widget.getLayoutInformation().getOwningGrid().isVisible();
              var displayed = widget.isVisible() && potentialOwnerDisplayed;
              var slot = this._registeredSlots[widget.getUniqueIdentifier()];
              if (displayed) {
                slot.x.setDisplayed(true);
                slot.y.setDisplayed(true);
                slot.x.setMinimumBeforeGap();
                slot.x.setMinimumAfterGap();
                slot.y.setMinimumBeforeGap();
                slot.y.setMinimumAfterGap();
                var widgetInfo = this._getLayoutInfo(widget),
                  measured = widgetInfo.getMeasured(),
                  maxSize = widgetInfo.getMaximal(),
                  minSize = widgetInfo.getMinimal(),
                  hintSize = widgetInfo.getPreferred();

                slot.x.setMinSize(minSize.getWidth());
                slot.y.setMinSize(minSize.getHeight());
                slot.x.setMaxSize(maxSize.getWidth());
                slot.y.setMaxSize(maxSize.getHeight());
                slot.x.setHintSize(hintSize.getWidth());
                slot.y.setHintSize(hintSize.getHeight());

                slot.x.setDesiredMinimalSize(measured.getWidth() || widgetInfo.forcedMinimalWidth);
                slot.y.setDesiredMinimalSize(measured.getHeight() || widgetInfo.forcedMinimalHeight);

                if (widgetInfo.isXStretched() || layoutInfo.isChildrenXStretched()) {
                  layoutInfo.addChildrenStretchX(widgetInfo);
                }
                if (widgetInfo.isYStretched() || layoutInfo.isChildrenYStretched()) {
                  layoutInfo.addChildrenStretchY(widgetInfo);
                }

                if (widget.isGridChildrenInParent && widget.isGridChildrenInParent()) {
                  slot.x.setMinimumBeforeGap(widgetInfo.getDecoratingOffset().getWidth());
                  slot.x.setMinimumAfterGap(widgetInfo.getDecorating().getWidth() - widgetInfo.getDecoratingOffset().getWidth());
                  slot.y.setMinimumBeforeGap(widgetInfo.getDecoratingOffset().getHeight());
                  slot.y.setMinimumAfterGap(widgetInfo.getDecorating().getHeight() - widgetInfo.getDecoratingOffset().getHeight());
                } else {
                  slot.x.setMinimumBeforeGap(null);
                  slot.x.setMinimumAfterGap(null);
                  slot.y.setMinimumBeforeGap(null);
                  slot.y.setMinimumAfterGap(null);
                }

                var extra = widget.getLayoutInformation()._extraGap;
                if (!!extra) {
                  slot.x.extraBeforeGap = Math.max(slot.x.extraBeforeGap, extra.beforeX || 0);
                  slot.x.extraAfterGap = Math.max(slot.x.extraAfterGap, extra.afterX || 0);
                  slot.y.extraBeforeGap = Math.max(slot.y.extraBeforeGap, extra.beforeY || 0);
                  slot.y.extraAfterGap = Math.max(slot.y.extraAfterGap, extra.afterY || 0);
                }
              } else {
                slot.x.setDisplayed(false);
                slot.y.setDisplayed(false);
              }
            }
            layoutInfo.setMeasured(this._xspace.ajust() + layoutInfo.getDecorating().getWidth(true),
              this._yspace.ajust() + layoutInfo.getDecorating().getHeight(true));
            layoutInfo.setMinimal(
              this._xspace.getMinSize() + layoutInfo.getDecorating().getWidth(true),
              this._yspace.getMinSize() + layoutInfo.getDecorating().getHeight(true));
            layoutInfo.setPreferred(this._xspace.getHintSize(), this._yspace.getHintSize());
            layoutInfo.setMaximal(this._xspace.getMaxSize(), this._yspace.getMaxSize());
          } else {
            layoutInfo.setMeasured(
              layoutInfo.getDecorating().getWidth(true),
              layoutInfo.getDecorating().getHeight(true)
            );
            layoutInfo.setMinimal(layoutInfo.getMeasured().getWidth(), layoutInfo.getMeasured().getHeight());
            layoutInfo.setMaximal(layoutInfo.getMeasured().getWidth(), layoutInfo.getMeasured().getHeight());
          }
        },

        prepare: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          var size = layoutInfo.getMeasured();
          var availableSize = layoutInfo.getAvailable().clone();
          var minimalSize = layoutInfo.getMinimal();
          if (minimalSize.getWidth() > availableSize.getWidth()) {
            availableSize.setWidth(minimalSize.getWidth());
          }
          if (minimalSize.getHeight() > availableSize.getHeight()) {
            availableSize.setHeight(minimalSize.getHeight());
          }
          var diffSize = availableSize.minus(size);
          if (diffSize.getWidth() >= 0) {
            var children = this._widget.getChildren() && this._widget.getChildren().filter(function(item) {
              return item && item.isHidden && !item.isHidden();
            });
            this._xspace.setStretchable(layoutInfo.getGravity().horizontal === cls.Gravities.FILL);
            if (layoutInfo.getPreferred().hasWidth() || (children.length === 1 && (children[0] instanceof cls.VBoxWidget))) {
              this._xspace.doStretch(diffSize.getWidth());
            }
          } else {
            if (layoutInfo.getPreferred().hasWidth()) {
              this._xspace.doShrink(diffSize.getWidth());
            }
          }
          if (diffSize.getHeight() >= 0) {
            this._yspace.setStretchable(layoutInfo.getGravity().vertical === cls.Gravities.FILL);
            if (layoutInfo.getPreferred().hasHeight()) {
              this._yspace.doStretch(diffSize.getHeight());
            }
          } else {
            if (layoutInfo.getPreferred().hasHeight()) {
              this._yspace.doShrink(diffSize.getHeight());
            }
          }

          var hasGridChildrenInParentChildren = this._widget.getChildren() && this._widget.getChildren().filter(function(item) {
            return item && item.isHidden && !item.isHidden() && item.isGridChildrenInParent && item.isGridChildrenInParent();
          }).length;
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var widget = this._registeredWidgets[i];
            var slot = this._registeredSlots[widget.getUniqueIdentifier()];
            var widgetInfo = this._getLayoutInfo(widget);
            widgetInfo.setAvailable(
              this._xspace.ajustAvailableMeasure(slot.x),
              this._yspace.ajustAvailableMeasure(slot.y)
            );
            widgetInfo.setAllocated(widgetInfo.getAvailable().getWidth(), widgetInfo.getAvailable().getHeight());
            var isChildOfGridWithGridChildrenInParent = !(!widget.isGridChildrenInParent || widget.isGridChildrenInParent()) &&
              !!hasGridChildrenInParentChildren;
            widgetInfo.getHost()
              .toggleClass("gl_gridElementHidden", !slot.x.displayed)
              .toggleClass("g_gridChildrenInParent", !!(widget.isGridChildrenInParent && widget.isGridChildrenInParent()))
              .toggleClass("g_gridChildrenInParentChild", !!widgetInfo.getOwningGrid())
              .toggleClass("g_decoratingElement", !!widgetInfo._extraGap)
              .toggleClass("g_childOfGridWithGridChildrenInParent", isChildOfGridWithGridChildrenInParent);
          }
          if (!this._widget._isGridChildrenInParent) {
            layoutInfo.setAllocated(
              this._xspace.getCalculatedSize() + layoutInfo.getDecorating().getWidth(true),
              this._yspace.getCalculatedSize() + layoutInfo.getDecorating().getHeight(true)
            );
          }
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
            "min-height": layoutInfo.getAllocated().getHeight() + "px",
            "min-width": layoutInfo.getAllocated().getWidth() + "px"
          };
        },
        apply: function() {
          var prefix = ".gl_" + this._widget.getUniqueIdentifier() + "_";
          this._xspace.applyStyles(this._styleRules, prefix);
          this._yspace.applyStyles(this._styleRules, prefix);
          styler.appendStyleSheet(this._styleRules, "gridLayout_" + this._widget.getUniqueIdentifier());
        }
      };
    });
  });
