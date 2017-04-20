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

modulum('LeafLayoutEngine', ['LayoutEngineBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.LeafLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.LeafLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      /** @lends classes.LeafLayoutEngine.prototype */
      return {
        __name: "LeafLayoutEngine",
        /**
         * @type Element
         */
        _dataContentPlaceholder: null,
        /**
         * @type Element
         */
        _dataContentMeasure: null,
        _decorationMeasured: false,
        _textSample: null,
        _sampleWidth: 0,
        _sampleHeight: 0,
        _reservedDecorationSpace: 0,
        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 1 : widthHint, ((typeof(heightHint) ===
              "undefined") || heightHint === null || heightHint === "") ? 1 : heightHint
          );
        },
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this.invalidateDataContentSelector(widget);
        },
        invalidateDataContentSelector: function(widget) {
          if (widget.__dataContentPlaceholderSelector) {
            var element = this._widget.getElement();
            this._dataContentPlaceholder = widget.__dataContentPlaceholderSelector === cls.WidgetBase.selfDataContent ? element :
              element.getElementsByClassName(widget.__dataContentPlaceholderSelector.replace(".", ""))[0];
            if (this._dataContentPlaceholder) {
              this._dataContentMeasure = this._dataContentPlaceholder.getElementsByClassName("gbc_dataContentMeasure")[0];
              if (!this._dataContentMeasure && !widget.ignoreLayout()) {
                this._dataContentMeasure = context.TemplateService.renderDOM("LeafLayoutMeasureElement");
                this._dataContentPlaceholder.appendChild(this._dataContentMeasure);
              }
            }
          }
        },
        invalidateMeasure: function(invalidation) {
          var layoutInfo = this._getLayoutInfo(),
            currentSizePolicy = layoutInfo.getCurrentSizePolicy();
          if (!this._hasBeenLayoutedOnce || (!this.considerWidgetAsFixed() && !(currentSizePolicy.isFixed() && !layoutInfo._fixedSizePolicyForceMeasure))) {
            $super.invalidateMeasure.call(this, invalidation);
            this._getLayoutInfo().invalidateMeasure();
          }
          if (this._decorationMeasured && layoutInfo.getCurrentSizePolicy().isDynamic()) {
            this._decorationMeasured = false;
          }
          layoutInfo.hasBeenFixed = false;
        },
        setReservedDecorationSpace: function(space) {
          this._reservedDecorationSpace = space || 0;
        },
        _minSize: function(preferred, measured) {
          if (Object.isNumber(preferred)) {
            return Math.max(preferred, measured);
          }
          return measured;
        },
        _setFixedMeasure: function() {
          var layoutInfo = this._widget.getLayoutInformation();
          layoutInfo.setMeasured(
            layoutInfo.getPreferred().getWidth() + layoutInfo.getDecorating().getWidth(true),
            layoutInfo.getPreferred().getHeight() + layoutInfo.getDecorating().getHeight(true));
        },
        prepareMeasure: function() {
          if (this._dataContentMeasure) {
            var layoutInfo = this._widget.getLayoutInformation();
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
          }
          this.prepareDynamicMeasure();
        },

        prepareDynamicMeasure: function() {
          if (this._dataContentPlaceholder) {
            var layoutInfo = this._widget.getLayoutInformation();
            this._dataContentPlaceholder.toggleClass("gbc_dynamicMeasure", layoutInfo._needValuedMeasure || !!layoutInfo.getCurrentSizePolicy()
              .isDynamic());
          }
        },

        considerWidgetAsFixed: function() {
          return false;
        },

        _charMeasured: false,

        measureChar: function() {
          if (!this._charMeasured) {
            var MMMlen = this._widget.__charMeasurer1.getBoundingClientRect(),
              _000len = this._widget.__charMeasurer2.getBoundingClientRect();
            this._getLayoutInfo().setCharSize(MMMlen.width / 10, _000len.width / 10, MMMlen.height / 10);
            if (_000len.width > 0 && MMMlen.height > 0) {
              this._charMeasured = true;
            }
          }
        },

        measure: function() {
          var layoutInfo = this._widget.getLayoutInformation(),
            currentSizePolicy = layoutInfo.getCurrentSizePolicy(),
            element = this._widget.getElement(),
            minSize = layoutInfo.getMinimal(),
            maxSize = layoutInfo.getMaximal(),
            measured = layoutInfo.getMeasured(),
            forcedMinWidth = 0,
            forcedMinHeight = 0;
          layoutInfo.setAllocated(cls.Size.undef, cls.Size.undef);
          layoutInfo.setAvailable(cls.Size.undef, cls.Size.undef);
          if (this._widget.isLayoutMeasureable(true)) {
            var elemRects = null;
            if (this.considerWidgetAsFixed() || (currentSizePolicy.isFixed() && !layoutInfo._fixedSizePolicyForceMeasure)) {
              if (!this._decorationMeasured && this._widget.getElement().querySelector(".gbc-label-text-container")) {
                this._decorationMeasured = true;
                elemRects = element.getBoundingClientRect();
                if (this._dataContentPlaceholder) {
                  var container = this._dataContentPlaceholder.hasClass("gbc_dynamicMeasure") ?
                    this._widget.getElement().querySelector(".gbc-label-text-container") :
                    this._dataContentMeasure;
                  var containerRects = container.getBoundingClientRect();
                  this._getLayoutInfo().setDecorating(
                    elemRects.width - containerRects.width,
                    elemRects.height - containerRects.height
                  );
                  this._getLayoutInfo().setDecoratingOffset(
                    container.offsetLeft - element.offsetLeft,
                    container.offsetTop - element.offsetTop
                  );
                }
                if (this._getLayoutInfo().forceMinimalMeasuredHeight) {
                  forcedMinHeight = elemRects.height;
                }
              }
              if (!layoutInfo.hasBeenFixed) {
                this._setFixedMeasure();
                layoutInfo.hasBeenFixed = true;
              }
            } else {
              if (layoutInfo.getCurrentSizePolicy().isDynamic() || (layoutInfo._widget.isVisible() && layoutInfo.needMeasure())) {
                if (currentSizePolicy.isFixed() && layoutInfo._fixedSizePolicyForceMeasure) {
                  if (!layoutInfo.hasBeenFixed) {
                    elemRects = element.getBoundingClientRect();
                    layoutInfo.setMeasured(elemRects.width, elemRects.height);
                    layoutInfo.hasBeenFixed = true;
                  }
                } else {
                  elemRects = element.getBoundingClientRect();
                  layoutInfo.setMeasured(elemRects.width, elemRects.height);
                }
              }
            }
            if (layoutInfo.getCurrentSizePolicy().isDynamic()) {
              layoutInfo.setMinimal(measured.getWidth(), measured.getHeight());
            } else {
              if (layoutInfo.isXStretched() || currentSizePolicy.canShrink()) {
                minSize.setWidth(layoutInfo.forcedMinimalWidth);
              } else {
                minSize.setWidth(measured.getWidth());
              }
              if (layoutInfo.isYStretched() || currentSizePolicy.canShrink()) {
                minSize.setHeight(layoutInfo.forcedMinimalHeight);
              } else {
                minSize.setHeight(measured.getHeight());
              }
            }
            if (layoutInfo.isXStretched()) {
              maxSize.setWidth(cls.Size.undef);
            } else {
              maxSize.setWidth(measured.getWidth());
            }
            if (layoutInfo.isYStretched()) {
              maxSize.setHeight(cls.Size.undef);
            } else {
              maxSize.setHeight(measured.getHeight());
            }

            if (this._getLayoutInfo().forceMinimalMeasuredHeight) {
              minSize.setHeight(Math.max(forcedMinHeight, minSize.getHeight(true)));
            }
            currentSizePolicy.setInitialized();
          } else {
            layoutInfo.setMeasured(0, 0);
            layoutInfo.setMinimal(0, 0);
            layoutInfo.setMaximal(0, 0);
          }
        },

        ajust: function(lastInvalidated, layoutApplicationService) {
          if (layoutApplicationService.isAutoOverflowActivated()) {
            var layoutInfo = this._widget.getLayoutInformation();
            if (layoutInfo.isYStretched()) {
              layoutInfo.getMinimal().setHeight(Math.max(layoutInfo.getPreferred().getHeight(), layoutInfo.getMeasured().getHeight()));
            }
          }
        },
        prepare: function() {
          if (this._getLayoutInfo().isXStretched()) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              width: this._getLayoutInfo().getAvailable().getWidth() + "px"
            });
          }
          if (this._getLayoutInfo().isYStretched()) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              height: this._getLayoutInfo().getAvailable().getHeight() + "px"
            });
          }
        },
        getRenderableChildren: function() {
          return [];
        }
      };
    });
  });
