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

modulum('DBoxLayoutEngine', ['LayoutEngineBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DBoxLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.DBoxLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      /** @lends classes.DBoxLayoutEngine.prototype */
      return {
        __name: "DBoxLayoutEngine",
        _mainSizeGetter: null,
        _mainSizeSetter: null,
        _mainHasSizeGetter: null,
        _mainStretch: null,
        _oppositeSizeGetter: null,
        _oppositeSizeSetter: null,
        _oppositeHasSizeGetter: null,
        _oppositeStretch: null,
        _splitHints: null,
        _referenceSplitHints: null,
        _currentlySplitting: -1,
        _hasSpacer: false,
        /**
         * @type {classes.WidgetBase[]}
         */
        _registeredWidgets: null,
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._splitHints = [];
          this._registeredWidgets = [];
          this._referenceSplitHints = [];
        },
        destroy: function() {
          for (var i = this._registeredWidgets.length - 1; i > -1; i--) {
            var wi = this._registeredWidgets[i];
            wi.destroy();
            this.unregisterChild(wi);
          }
          this._splitHints = null;
          this._registeredWidgets.length = 0;
          $super.destroy.call(this);
        },

        initSplitHints: function(initial) {
          this._referenceSplitHints = (initial || []).map(function(item) {
            return isNaN(item) ? 0 : item;
          });
        },

        startSplitting: function(splitterIndex) {
          this._currentlySplitting = splitterIndex;
          this._referenceSplitHints = [];
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var w = this._registeredWidgets[i];
            if (!(w instanceof cls.SplitterWidget)) {
              var idx = i / 2;
              this._referenceSplitHints[idx] = this._getAvailableSize(w, true);
            }
          }
          this._splitHints = this._referenceSplitHints.slice();

        },

        stopSplitting: function() {
          this._referenceSplitHints = this._splitHints;
          this._currentlySplitting = -1;
        },

        splitting: function(delta) {
          var
            w1 = this._registeredWidgets[this._currentlySplitting * 2],
            w2 = this._registeredWidgets[(this._currentlySplitting + 1) * 2],
            min1 = this._getMinimalSize(w1, true) || 1,
            min2 = this._getMinimalSize(w2, true) || 1;
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var w = this._registeredWidgets[i];
            if (!(w instanceof cls.SplitterWidget)) {
              var idx = i / 2;
              this._splitHints[idx] = this._referenceSplitHints[idx];
            }
          }
          var extra = 0;
          var size1 = this._splitHints[this._currentlySplitting],
            size2 = this._splitHints[this._currentlySplitting + 1];
          if ((size1 + delta) < min1) {
            extra = delta;
            delta = min1 - size1;
            extra -= delta;
          }
          if ((size2 - delta) < min2) {
            extra = delta;
            delta = size2 - min2;
            extra -= delta;
          }
          this._splitHints[this._currentlySplitting] += delta;
          this._splitHints[this._currentlySplitting + 1] -= delta;

          if (!!extra) {
            var currentIndex, currentMin, currentSize, canReduce;
            if (extra < 0) {
              currentIndex = this._currentlySplitting - 1;
              while (!!extra && (currentIndex >= 0)) {
                currentMin = this._getMinimalSize(this._registeredWidgets[currentIndex * 2], true) || 1;
                currentSize = this._splitHints[currentIndex];
                canReduce = currentSize - currentMin;
                if (canReduce > 0) {
                  if (-extra < canReduce) {
                    this._splitHints[currentIndex] += extra;
                    this._splitHints[this._currentlySplitting + 1] -= extra;
                    extra = 0;
                  } else {
                    extra += canReduce;
                    this._splitHints[currentIndex] -= canReduce;
                    this._splitHints[this._currentlySplitting + 1] += canReduce;
                  }
                }
                currentIndex--;
              }
            } else {
              currentIndex = this._currentlySplitting + 2;
              while (!!extra && (currentIndex < this._splitHints.length)) {
                currentMin = this._getMinimalSize(this._registeredWidgets[currentIndex * 2], true) || 1;
                currentSize = this._splitHints[currentIndex];
                canReduce = currentSize - currentMin;
                if (canReduce > 0) {
                  if (extra < canReduce) {
                    this._splitHints[currentIndex] -= extra;
                    this._splitHints[this._currentlySplitting] += extra;
                    extra = 0;
                  } else {
                    extra -= canReduce;
                    this._splitHints[currentIndex] -= canReduce;
                    this._splitHints[this._currentlySplitting] += canReduce;
                  }
                }
                currentIndex++;
              }

            }
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        registerChild: function(widget, position) {
          if (this._registeredWidgets.indexOf(widget) < 0) {
            this._registeredWidgets.splice(position, 0, widget);
          }
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        unregisterChild: function(widget) {
          this._registeredWidgets.remove(widget);
        },

        measure: function() {
          this._getLayoutInfo().setMeasured(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setAllocated(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setAvailable(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setMinimal(cls.Size.undef, cls.Size.undef);
          this._getLayoutInfo().setMaximal(cls.Size.undef, cls.Size.undef);
        },

        prepareMeasurements: function() {
          for (var i = 0, j = 2; j < this._registeredWidgets.length;) {
            var w = this._registeredWidgets[i];
            var w2 = this._registeredWidgets[j];
            var isSpacer1 = w instanceof cls.SpacerItemWidget,
              isSpacer2 = w2 instanceof cls.SpacerItemWidget;
            if (w.isVisible() && w2.isVisible()) {
              this._registeredWidgets[i + 1].setHidden(isSpacer1 || isSpacer2);
              i += 2;
              j += 2;
            } else if (!w.isVisible() && w2.isVisible()) {
              this._registeredWidgets[i + 1].setHidden(true);
              i += 2;
              j += 2;
            } else if (w.isVisible() && !w2.isVisible()) {
              this._registeredWidgets[j - 1].setHidden(true);
              j += 2;
            } else {
              this._registeredWidgets[j - 1].setHidden(true);
              i += 2;
              j += 2;
            }
          }
        },
        ajust: function() {
          this._hasSpacer = false;
          this._getLayoutInfo().setPreferred(0, 0);
          var layoutInfo = this._getLayoutInfo();
          var position = 0,
            minimal = 0,
            minOppositeSize = 0;
          var oppositeSize = 0;
          var maxSize = 0,
            maxOppositeSize = 0,
            oppositeStretch = 0;
          for (var i = 0; i < this._registeredWidgets.length; i++) {
            var w = this._registeredWidgets[i];
            if (!w.isVisible()) {
              continue;
            }
            var hasMaxSize = this._hasMaximalSize(w),
              hasOppositeMaxSize = this._hasOppositeMaximalSize(w),
              isSpacer = w instanceof cls.SpacerItemWidget;
            if (isSpacer) {
              this._hasSpacer = true;
            }

            if (this._getLayoutInfo(w).isXStretched() || this._getLayoutInfo(w).isChildrenXStretched()) {
              layoutInfo.addChildrenStretchX(w);
            }
            if (this._getLayoutInfo(w).isYStretched() || this._getLayoutInfo(w).isChildrenYStretched()) {
              layoutInfo.addChildrenStretchY(w);
            }

            if (hasMaxSize || isSpacer) {
              if (maxSize !== cls.Size.undef) {
                maxSize += this._getMaximalSize(w);
              }
            } else {
              maxSize = cls.Size.undef;
              var hint = this._getHintSize(w);
              hint = hint === cls.Size.undef ? 0 : hint;
              layoutInfo.getPreferred()[this._mainSizeSetter](layoutInfo.getPreferred()[this._mainSizeGetter](true) + hint);
            }
            if (hasOppositeMaxSize) {
              if (maxOppositeSize !== cls.Size.undef) {
                maxOppositeSize = Math.max(maxOppositeSize, this._getOppositeMaximalSize(w));
              }
            } else {
              maxOppositeSize = cls.Size.undef;
              if (oppositeStretch < this._getOppositeHintSize(w)) {
                oppositeStretch = this._getOppositeHintSize(w);
              }
            }
            var size = this._getMeasuredSize(w, true),
              minimalSize = this._getMinimalSize(w, true),
              opposite = this._getOppositeMeasuredSize(w, true),
              minOpposite = this._getOppositeMinimalSize(w, true);
            oppositeSize = Math.max(oppositeSize, opposite);
            minOppositeSize = Math.max(minOppositeSize, minOpposite);
            position += size;
            minimal += minimalSize;
          }
          this._applyMeasure(position, oppositeSize);
          layoutInfo.getMinimal()[this._mainSizeSetter](minimal);
          layoutInfo.getMinimal()[this._oppositeSizeSetter](minOppositeSize);

          this._setMaximalSize(this._widget, maxSize);
          this._setOppositeMaximalSize(this._widget, maxOppositeSize);

          if (this._getOppositeMaximalSize() === cls.Size.undef && oppositeStretch === 0) {
            oppositeStretch = 1;
          }
          if (oppositeStretch > 0) {
            layoutInfo.getPreferred()[this._oppositeSizeSetter](oppositeStretch);
          }
        },

        prepare: function() {
          var i, w, distributeSize, hint, wSize, oppositeWSize;
          var position = 0;
          var availableSize = this._getAvailableSize(),
            fullSize = availableSize;
          if (this._currentlySplitting >= 0) {
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                if (!(w instanceof cls.SplitterWidget)) {
                  this._setAvailableSize(w, this._splitHints[this._widget.getIndexOfChild(w)]);
                }
              }
            }
          } else if (this._referenceSplitHints.length && (this._referenceSplitHints.length === ((this._registeredWidgets.length + 1) /
              2))) {
            this._redistributeSplittedSpace();
          } else if (this._getHintSize()) {
            var fullRatio = 0,
              ratios = {};
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                if (w instanceof cls.SplitterWidget) {
                  fullSize -= Math.max(this._getMeasuredSize(w, true), this._getMinimalSize(w, true));
                } else {
                  var size = this._getHintSize(w);
                  if (size && !!this._isStretched(w)) {
                    ratios[w.getUniqueIdentifier()] = size;
                    fullRatio += size;
                  }
                }
              }
            }

            var minSize = this._getMinimalSize();
            // TODO : GBC-1109 should only use minsize to see if we can distribute size, not for the distribution itself
            distributeSize = minSize > availableSize ? 0 : (availableSize - minSize);
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                if (!this._isStretched(w)) {
                  hint = this._splitHints[this._widget.getIndexOfChild(w)];
                  if (hint) {
                    distributeSize -= (hint - this._getMinimalSize(w));
                  }
                }
              }
            }
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                this._setOppositeAvailableSize(w, this._getOppositeAvailableSize());
                var msize = this._getMinimalSize(w, true);
                if (!this._isStretched(w)) {
                  hint = this._splitHints[this._widget.getIndexOfChild(w)];
                  if (distributeSize >= 0 && hint) {
                    this._setAvailableSize(w, hint);
                  } else {
                    this._setAvailableSize(w, msize);
                  }
                } else {
                  this._setAvailableSize(w, msize + distributeSize * (ratios[w.getUniqueIdentifier()] /
                    fullRatio));
                }
              }
            }
          } else {
            var items = [],
              distributedSize = {},
              available = this._getAvailableSize(),
              accumulated = 0,
              currentLevel = 0,
              distibutableLevel = -1;

            for (var it = 0; it < this._registeredWidgets.length; it++) {
              if (!this._registeredWidgets[it].isHidden()) {
                if ((this._hasSpacer && (this._registeredWidgets[it] instanceof cls.SpacerItemWidget)) ||
                  (!this._hasSpacer && !(this._registeredWidgets[it] instanceof cls.SplitterWidget))) {
                  items.push(this._registeredWidgets[it]);
                } else {
                  available -= this._getMeasuredSize(this._registeredWidgets[it], true);
                }
              }
            }

            var count = items.length;

            items.sort(this._sortItems.bind(this));

            while (distibutableLevel === -1 && currentLevel < count) {
              var minimalCurrent = this._getMinimalSize(items[currentLevel], true);
              if (available >= (accumulated + minimalCurrent * (count - currentLevel))) {
                distibutableLevel = currentLevel;
              } else {
                accumulated += minimalCurrent;
                distributedSize[items[currentLevel].getUniqueIdentifier()] = minimalCurrent;
                currentLevel++;
              }
            }
            if (distibutableLevel >= 0) {
              var distributablePart = (available - accumulated) / (count - distibutableLevel);
              for (i = distibutableLevel; i < count; i++) {
                distributedSize[items[i].getUniqueIdentifier()] = distributablePart;
              }
            }
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                if (distributedSize.hasOwnProperty(w.getUniqueIdentifier())) {
                  this._setAvailableSize(w, distributedSize[w.getUniqueIdentifier()]);
                }
                this._setOppositeAvailableSize(w, this._getOppositeAvailableSize());
              } else {
                this._setAvailableSize(w, 0);
                this._setOppositeAvailableSize(w, 0);
              }
            }
          }
          for (i = 0; i < this._registeredWidgets.length; i++) {
            w = this._registeredWidgets[i];
            if (w.isVisible()) {
              wSize = Math.max(this._getAvailableSize(w, true), this._getMinimalSize(w, true));
              this._setAllocatedSize(w, wSize);
              oppositeWSize = this._getOppositeAvailableSize();
              if (!this._getOppositeStretched() || this._getLayoutInfo().getAvailable().isLoose()) {
                oppositeWSize = Math.max(oppositeWSize, this._getOppositeMinimalSize());
              }
              this._setOppositeAllocatedSize(w, oppositeWSize);
              this._setOppositeAvailableSize(w, oppositeWSize);
              this._setItemClass(i, position, wSize);
              position += wSize === cls.Size.undef ? 0 : wSize;
            } else {
              this._setOppositeAllocatedSize(w, 0);
              this._setOppositeAvailableSize(w, 0);
              this._setItemClass(i, position, 0);
            }
          }

          var width = Math.max(this._getLayoutInfo().getAvailable().getWidth(true), this._getLayoutInfo().getMinimal().getWidth(
            true));
          var height = Math.max(this._getLayoutInfo().getAvailable().getHeight(true), this._getLayoutInfo().getMinimal().getHeight(
            true));
          this._getLayoutInfo().setAllocated(width, height);

          for (i = 0; i < this._registeredWidgets.length; i++) {
            w = this._registeredWidgets[i];
            if (w.isVisible()) {
              this._setItemOppositeClass(i);
              this._setOppositeAllocatedSize(w, this._getOppositeAllocatedSize());
            } else {
              this._setItemOppositeClass(i);
              this._setOppositeAllocatedSize(w, 0);
            }
          }
          this._styleRules[".g_measured #w_" + this._widget.getUniqueIdentifier() + ".g_measureable"] = {
            width: this._getLayoutInfo().getAllocated().getWidth() + "px",
            height: this._getLayoutInfo().getAllocated().getHeight() + "px"
          };
        },

        _redistributeSplittedSpace: function() {
          var i, w, total = this._getAvailableSize(),
            totalSplitters = 0;
          for (i = 0; i < this._registeredWidgets.length; i++) {
            w = this._registeredWidgets[i];
            if (w.isVisible()) {
              if (w instanceof cls.SplitterWidget) {
                var s = this._getMeasuredSize(w);
                total -= s;
                totalSplitters += s;
              }
            }
          }
          if (this._getMinimalSize() < (total + totalSplitters)) {
            var sum = this._referenceSplitHints.reduce(function(a, b) {
                return a + b;
              }),
              availableWeight = sum,
              ratioed = this._referenceSplitHints.map(function(a, idx) {
                var relative = total * a / sum,
                  min = this._getMinimalSize(this._registeredWidgets[idx * 2]),
                  delta = relative - min;
                return {
                  weight: a,
                  min: min,
                  size: min,
                  relative: relative,
                  delta: delta,
                  index: idx
                };
              }, this).sort(function(a, b) {
                return a.delta < b.delta ? -1 : a.delta > b.delta ? 1 : 0;
              });
            var pos = 0,
              debt = 0;
            while (pos < ratioed.length) {
              if (ratioed[pos].delta < 0) {
                debt -= ratioed[pos].delta;
                availableWeight -= ratioed[pos].weight;
                pos++;
              } else {
                var weightDebt = debt * ratioed[pos].weight / availableWeight;
                if (weightDebt > ratioed[pos].delta) {
                  ratioed[pos].delta -= weightDebt;
                  debt -= weightDebt;
                } else {
                  debt -= weightDebt;
                  ratioed[pos].delta -= weightDebt;
                  ratioed[pos].size = ratioed[pos].min + ratioed[pos].delta;
                  availableWeight -= ratioed[pos].weight;
                  pos++;
                }
              }
            }
            for (i = 0; i < ratioed.length; i++) {
              w = this._registeredWidgets[ratioed[i].index * 2];
              if (w.isVisible()) {
                if (!(w instanceof cls.SplitterWidget)) {
                  this._setAvailableSize(w, ratioed[i].size);
                }
              }
            }
          } else {
            for (i = 0; i < this._registeredWidgets.length; i++) {
              w = this._registeredWidgets[i];
              if (w.isVisible()) {
                if (!(w instanceof cls.SplitterWidget)) {
                  this._setAvailableSize(w, this._getMinimalSize(w));
                }
              }
            }
          }
          for (i = 0; i < this._registeredWidgets.length; i++) {
            w = this._registeredWidgets[i];
            if (w.isVisible()) {
              this._setOppositeAvailableSize(w, this._getOppositeAvailableSize());
            }
          }
        },
        apply: function() {
          styler.appendStyleSheet(this._styleRules, "boxLayout_" + this._widget.getUniqueIdentifier());
        },

        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getHintSize: function(widget, useFallback) {
          var idx = this._widget.getIndexOfChild(widget);
          if (idx >= 0 && this._splitHints[idx]) {
            return this._splitHints[idx];
          }
          var hintSize = this._getLayoutInfo(widget).getPreferred();
          return hintSize[this._mainSizeGetter](useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getOppositeHintSize: function(widget) {
          var hintSize = this._getLayoutInfo(widget).getPreferred();
          return hintSize[this._oppositeSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getOppositeSize: function(widget) {
          var effectiveSize = this._getLayoutInfo(widget).getMeasured();
          return effectiveSize[this._oppositeSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getAllocatedSize: function(widget) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          return allocatedSize[this._mainSizeGetter]();

        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setAllocatedSize: function(widget, size) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          return allocatedSize[this._mainSizeSetter](size);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setMaximalSize: function(widget, size) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._mainSizeSetter](size);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setOppositeMaximalSize: function(widget, size) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._oppositeSizeSetter](size);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getMeasuredSize: function(widget, useFallback) {
          if (!(widget instanceof cls.SplitterWidget)) {
            var idx = this._widget.getIndexOfChild(widget);
            if (idx >= 0 && this._splitHints[idx]) {
              return this._splitHints[idx];
            }
          }
          var measuredSize = this._getLayoutInfo(widget).getMeasured();
          return measuredSize[this._mainSizeGetter](!!useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getOppositeMeasuredSize: function(widget, useFallback) {
          var measuredSize = this._getLayoutInfo(widget).getMeasured();
          return measuredSize[this._oppositeSizeGetter](!!useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getMinimalSize: function(widget, useFallback) {
          var minimalSize = this._getLayoutInfo(widget).getMinimal();
          return minimalSize[this._mainSizeGetter](!!useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getOppositeMinimalSize: function(widget, useFallback) {
          var minimalSize = this._getLayoutInfo(widget).getMinimal();
          return minimalSize[this._oppositeSizeGetter](!!useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getMaximalSize: function(widget) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._mainSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getOppositeMaximalSize: function(widget) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._oppositeSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _hasMaximalSize: function(widget) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._mainHasSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _hasOppositeMaximalSize: function(widget) {
          var maximalSize = this._getLayoutInfo(widget).getMaximal();
          return maximalSize[this._oppositeHasSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number} size
         */
        _getAvailableSize: function(widget, useFallback) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          return availableSize[this._mainSizeGetter](!!useFallback);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setAvailableSize: function(widget, size) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          availableSize[this._mainSizeSetter](size);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getOppositeAvailableSize: function(widget) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          return availableSize[this._oppositeSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setOppositeAvailableSize: function(widget, size) {
          var availableSize = this._getLayoutInfo(widget).getAvailable();
          availableSize[this._oppositeSizeSetter](size);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {number}
         */
        _getOppositeAllocatedSize: function(widget) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          return allocatedSize[this._oppositeSizeGetter]();
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @param {number} size
         */
        _setOppositeAllocatedSize: function(widget, size) {
          var allocatedSize = this._getLayoutInfo(widget).getAllocated();
          allocatedSize[this._oppositeSizeSetter](size);
        },
        /**
         * @protected
         * @param {number} position
         * @param {number} start
         * @param {number} size
         */
        _setItemClass: function(position, start, size) {

        },
        /**
         * @protected
         * @param {number} position
         * @param {number} start
         * @param {number} size
         */
        _setItemOppositeClass: function(position, start, size) {

        },
        /**
         * @protected
         * @param {number} mainSize
         * @param {number} oppositeSize
         */
        _applyMeasure: function(mainSize, oppositeSize) {

        },
        /**
         * @protected
         * @param {classes.WidgetBase} widget
         * @returns {boolean}
         */
        _isStretched: function(widget) {
          return false;
        },
        _getMainStretched: function(widget) {
          var mainStretched = this._getLayoutInfo(widget).getStretched();
          return mainStretched["get" + this._mainStretch]();
        },
        _getOppositeStretched: function(widget) {
          var oppositeStretched = this._getLayoutInfo(widget).getStretched();
          return oppositeStretched["get" + this._oppositeStretch]();
        },
        _sortItems: function(a, b) {
          return this._getMinimalSize(b) - this._getMinimalSize(a);
        }
      };
    });
  });
