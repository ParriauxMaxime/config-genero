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

modulum('GridDimensionManager',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * slots:             [       ]   [           ]
     * elements (unit): |_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
     * @class classes.GridDimensionManager
     */
    cls.GridDimensionManager = context.oo.Class(function() {
      /** @lends classes.GridDimensionManager.prototype */
      return {
        __name: "GridDimensionManager",
        /**
         * @type {classes.GridDimensionElement[]}
         */
        dimensionElements: null,
        _gutterSize: context.constants.theme["layout-grid-inner-gutter"],
        emptyElementSize: 0,
        /**
         * @type {classes.GridDimensionSlot[]}
         */
        slots: null,

        _size: 0,
        stretchable: false,
        /**
         * Sets this dimension with an initial size
         * @param {Number} initialSize
         */
        constructor: function(initialSize) {
          this.slots = [];
          this.dimensionElements = [];
          for (var i = 0; i < initialSize; i++) {
            this.dimensionElements[i] = new cls.GridDimensionElement(i);
          }
          this._size = initialSize;
        },
        getSize: function() {
          return this._size;
        },
        getHintSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          var totalGaps = 0;
          for (var i = from; i <= to; i++) {
            total += this.dimensionElements[i].hintSize;
            totalGaps +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (!total) {
            if (this.getMaxSize() === cls.Size.undef) {
              total = totalGaps;
            }
          } else {
            total += totalGaps;
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total !== cls.Size.undef && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },
        getMaxSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          var totalGaps = 0;
          for (var i = from; i <= to; i++) {
            var size = this.dimensionElements[i].maxSize;
            if (size === cls.Size.undef) {
              total = cls.Size.undef;
              break;
            } else {
              total += size;
              totalGaps +=
                ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
                ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
            }
          }
          if (total !== cls.Size.undef) {
            total += totalGaps;
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total !== cls.Size.undef && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },
        getMinSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          var totalGaps = 0;
          for (var i = from; i <= to; i++) {
            var size = this.dimensionElements[i].minSize;
            if (size === cls.Size.undef) {
              total = cls.Size.undef;
              break;
            } else {
              total += size;
              totalGaps +=
                ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
                ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
            }
          }
          if (total !== cls.Size.undef) {
            total += totalGaps;
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total !== cls.Size.undef && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return Number.isNaN(total) ? 0 : total;
        },
        getCalculatedSize: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          from = Object.isNumber(from) ? from : 0;
          to = Object.isNumber(to) ? to : this._size - 1;
          includeFirstBeforeGap = includeFirstBeforeGap !== false;
          includeLastAfterGap = includeLastAfterGap !== false;

          var total = 0;
          for (var i = from; i <= to; i++) {
            total +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((this.dimensionElements[i].intrinsicSize + this.dimensionElements[i].bonusSize) || this.emptyElementSize) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          if (includeLastAfterGap && from === 0 && to === (this._size - 1) && total !== cls.Size.undef && total > this._gutterSize) {
            total -= this._gutterSize;
          }
          return total;
        },
        /**
         *
         * @param {Number} newSize
         */
        setSize: function(newSize, destroyDimensionElements) {
          var size = this._size;
          if (newSize > size) {
            for (var addingIndex = this.dimensionElements.length; addingIndex < newSize; addingIndex++) {
              this.dimensionElements[addingIndex] = new cls.GridDimensionElement(addingIndex);
            }
          }
          if (!!destroyDimensionElements) {
            for (var i = newSize; i < this.dimensionElements.length; i++) {
              this.dimensionElements[i].destroy();
            }
            this.dimensionElements.length = newSize;
          }
          this._size = newSize;
        },

        setEmptyElementSize: function(value) {
          this.emptyElementSize = value || 0;
        },

        /**
         *
         * @param {Number} size
         */
        ensureSize: function(size) {
          if (this.getSize() < size) {
            this.setSize(size);
          }
        },

        setStretchable: function(stretchable) {
          this.stretchable = stretchable;
        },

        /**
         *
         * @param {boolean} [swipeGaps]
         * @param {boolean} resetIntrinsicSizes
         */
        resetDimensionSizes: function(swipeGaps, resetIntrinsicSizes) {
          var size = this.getSize();
          for (var i = 0; i < size; i++) {
            this.dimensionElements[i].resetSize(swipeGaps, resetIntrinsicSizes);
          }
        },

        /**
         * Add slot usage on the dimension
         * @param {classes.GridDimensionSlot} slot
         */
        addSlot: function(slot) {
          this.ensureSize(slot.getLastPosition() + 1);
          var insertIndex = 0,
            size = this.slots.length;
          for (; insertIndex < size && this.slots[insertIndex].getPosition() < slot.getPosition();) {
            insertIndex++;
          }
          for (; insertIndex < size && this.slots[insertIndex].getSize() < slot.getSize();) {
            insertIndex++;
          }
          this.slots.add(slot, insertIndex);
          slot.attach(this);
          for (var i = slot.getPosition(); i <= slot.getLastPosition(); i++) {
            this.dimensionElements[i].attach(slot);
          }
        },
        /**
         * Remove slot usage on the dimension
         * @param {classes.GridDimensionSlot} slot
         */
        removeSlot: function(slot) {
          for (var i = slot.getPosition(); i <= slot.getLastPosition(); i++) {
            this.dimensionElements[i].detach(slot);
          }
          slot.detach();
          var index = this.slots.indexOf(slot);
          if (index >= 0) {
            this.slots.splice(index, 1);
          }
          return slot;
        },

        updateGaps: function() {
          var size = this.getSize();
          for (var i = 0; i < size; i++) {
            this.dimensionElements[i].updateGaps();
          }
        },
        /**
         *
         */
        updateIntrinsicSizes: function() {
          this.resetDimensionSizes(true, true);
          var size = this.slots.length;
          for (var i = 0; i < size; i++) {
            var slot = this.slots[i],
              slotSize = slot.getSize(),
              pos = slot.getPosition(),
              lastPos = slot.getLastPosition();
            if (slot.displayed) {
              var totalGapSizes = this.getGapSizing(pos, lastPos);
              var elementMaxSize = slot.maxSize === cls.Size.undef ? cls.Size.undef : (slot.maxSize / slotSize);
              var elementMinSize = (slot.minSize / slotSize);

              var lambdaUnitSize = Math.max((slot.desiredMinimalSize - totalGapSizes) / slotSize, elementMinSize);

              var slotStretch = slot.maxSize === cls.Size.undef,
                slotHint = (slot.hintSize - totalGapSizes) / slotSize;
              for (var position = pos; position <= lastPos; position++) {
                var dimensionElement = this.dimensionElements[position];
                if (slotStretch) {
                  dimensionElement.ajustHintSize(slotHint);
                  dimensionElement.stretchable = true;
                } else {
                  dimensionElement.unstretchable++;
                }
                dimensionElement.ajustMinSize(elementMinSize);
                dimensionElement.ajustMaxSize(elementMaxSize);
                dimensionElement.ajustIntrinsicSize(lambdaUnitSize);
              }
            }
          }
        },

        updateBonusSize: function(sizeToDistribute) {
          var result = false,
            dimensionElement = null,
            i = 0,
            maxMalus = 0;
          var totalWeights = this.getTotalWeights();
          if (totalWeights > 0) {
            var unstretchable = Number.POSITIVE_INFINITY;
            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable) {
                unstretchable = Math.min(unstretchable, dimensionElement.unstretchable);
              }
            }

            for (i = 0; i < this._size; i++) {
              dimensionElement = this.dimensionElements[i];
              if (dimensionElement.stretchable && dimensionElement.unstretchable === unstretchable) {
                dimensionElement.bonusSize = sizeToDistribute * (dimensionElement.intrinsicSize / totalWeights);
                if (dimensionElement.bonusSize < 0) {
                  maxMalus = dimensionElement.intrinsicSize - dimensionElement.minSize;
                  if ((-dimensionElement.bonusSize) > maxMalus) {
                    dimensionElement.bonusSize = -maxMalus;
                  }
                }
                result = true;
              }
            }
          } else {
            if (this.stretchable && this._size > 0) {
              for (var e = 0; e < this._size; e++) {
                dimensionElement = this.dimensionElements[e];
                dimensionElement.bonusSize = sizeToDistribute / this._size;
                if (dimensionElement.bonusSize < 0) {
                  maxMalus = dimensionElement.intrinsicSize - dimensionElement.minSize;
                  if ((-dimensionElement.bonusSize) > maxMalus) {
                    dimensionElement.bonusSize = -maxMalus;
                  }
                }
                result = true;
              }
            }
          }
          return result;
        },
        render: function() {
          var result = {
            regularPositions: [],
            regular: {},
            hostSlots: [],
            hostedBySlot: {}
          };
          for (var i = 0; i < this.slots.length; i++) {
            var slot = this.slots[i];
            if (slot.containerSlot) {
              if (!result.hostedBySlot[slot.containerSlot.id]) {
                result.hostSlots.push(slot.containerSlot.id);
                result.hostedBySlot[slot.containerSlot.id] = {
                  absolutes: {},
                  absolutePositions: []
                };
              }
              var absolutePosition = slot.getPosition();
              if (!result.hostedBySlot[slot.containerSlot.id].absolutes[absolutePosition]) {
                result.hostedBySlot[slot.containerSlot.id].absolutePositions.push(absolutePosition);
                result.hostedBySlot[slot.containerSlot.id].absolutes[absolutePosition] = {
                  position: this.getCalculatedSize(0, slot.getPosition() - 1, true, true) -
                    this.getCalculatedSize(0, slot.containerSlot.slot.getPosition() - 1, true, true) -
                    this.dimensionElements[slot.containerSlot.slot.getPosition()].beforeGap,
                  beforeGap: this.dimensionElements[slot.getPosition()].beforeGap,
                  hostedLengths: [],
                  lengths: {}
                };
              }
              if (!Object.isNumber(result.hostedBySlot[slot.containerSlot.id].absolutes[absolutePosition].lengths[slot.getSize()])) {
                result.hostedBySlot[slot.containerSlot.id].absolutes[absolutePosition].hostedLengths.push(slot.getSize());
                result.hostedBySlot[slot.containerSlot.id].absolutes[absolutePosition].lengths[slot.getSize()] = this.getCalculatedSize(
                  slot.getPosition(), slot.getLastPosition(),
                  false, false);
              }
            } else {
              if (!result.regular[slot.getPosition()]) {
                result.regularPositions.push(slot.getPosition());
                result.regular[slot.getPosition()] = {
                  position: this.getCalculatedSize(0, slot.getPosition() - 1, true, true),
                  beforeGap: this.dimensionElements[slot.getPosition()].beforeGap,
                  regularLengths: [],
                  lengths: {},
                  lengthsWithGaps: {}
                };
              }
              if (!Object.isNumber(result.regular[slot.getPosition()].lengths[slot.getSize()])) {
                result.regular[slot.getPosition()].regularLengths.push(slot.getSize());
                result.regular[slot.getPosition()].lengths[slot.getSize()] = this.getCalculatedSize(slot.getPosition(), slot.getLastPosition(),
                  false, false);
                result.regular[slot.getPosition()].lengthsWithGaps[slot.getSize()] = this.getCalculatedSize(slot.getPosition(),
                  slot.getLastPosition(),
                  true, true);
              }
            }
          }
          return result;
        },

        getTotalWeights: function() {
          var result = 0,
            dimensionElement = null,
            unstretchable = Number.POSITIVE_INFINITY;
          for (var i = 0; i < this._size; i++) {
            dimensionElement = this.dimensionElements[i];
            if (dimensionElement.stretchable) {
              unstretchable = Math.min(unstretchable, dimensionElement.unstretchable);
            }
          }
          for (i = 0; i < this._size; i++) {
            dimensionElement = this.dimensionElements[i];
            if (dimensionElement.stretchable && dimensionElement.unstretchable === unstretchable) {
              result += dimensionElement.intrinsicSize;
            }
          }
          return result;
        },
        /**
         *
         * @param {Number} from
         * @param {Number} to (inclusive)
         * @param {boolean} [includeFirstBeforeGap]
         * @param {boolean} [includeLastAfterGap]
         */
        getGapSizing: function(from, to, includeFirstBeforeGap, includeLastAfterGap) {
          var total = 0;
          for (var i = from; i <= to; i++) {
            total +=
              ((i !== from || includeFirstBeforeGap) ? this.dimensionElements[i].getBeforeGap() : 0) +
              ((i !== to || includeLastAfterGap) ? this.dimensionElements[i].getAfterGap() : 0);
          }
          return total;
        },
        destroy: function() {
          this.setSize(0, true);
        }
      };
    });
  });
