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

modulum('LayoutEngineBase', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.LayoutEngineBase
     * @extends classes.EventListener
     */
    cls.LayoutEngineBase = context.oo.Class(cls.EventListener, function($super) {
      /** @lends classes.LayoutEngineBase.prototype */
      return {
        __name: "LayoutEngineBase",
        /** @lends classes.LayoutEngineBase */
        $static: {
          LayoutAppliedEvent: 'LayoutApplied',
          nextInvalidation: function() {
            return cls.LayoutEngineBase._nextInvalidation++;
          },
          _nextInvalidation: 2
        },
        /**
         * @protected
         * @type {classes.WidgetBase}
         */
        _widget: null,
        /**
         * @protected
         */
        _styleRules: null,
        _handlers: null,
        _hasBeenLayoutedOnce: false,
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        constructor: function(widget) {
          $super.constructor.call(this);

          this._widget = widget;
          this._handlers = [];
          this._styleRules = {};
        },
        destroy: function() {
          if (this._handlers) {
            for (var i = 0; i < this._handlers.length; i++) {
              this._handlers[i]();
            }
            this._handlers.length = 0;
          }
          this._widget = null;
          this._styleRules = null;
          $super.destroy.call(this);
        },
        /**
         * @protected
         * @param {classes.WidgetBase=} widget
         * @returns {classes.LayoutInformation}
         */
        _getLayoutInfo: function(widget) {
          var w = widget || this._widget;
          if (!w) {
            return null;
          }
          return w.getLayoutInformation();
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        registerChild: function(widget) {},
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        unregisterChild: function(widget) {},
        reset: Function.noop,
        /**
         * prepare measure self widget
         */
        prepareMeasure: Function.noop,
        /**
         * measure char size in widget
         */
        measureChar: Function.noop,
        /**
         * measure self widget
         */
        measure: Function.noop,
        /**
         * update information from children to parent
         */
        prepareMeasurements: Function.noop,
        /**
         * determine children stretchability
         * determine measured ('natural size') from children
         */
        ajust: Function.noop,
        /**
         * determine stretched allocated size for children
         */
        prepare: Function.noop,
        /**
         * apply final sizes
         */
        apply: Function.noop,
        /**
         * notify layout was applied
         */
        notify: function() {
          this.emit(cls.LayoutEngineBase.LayoutAppliedEvent);
        },
        onLayoutApplied: function(hook) {
          var offFunc = this.when(cls.LayoutEngineBase.LayoutAppliedEvent, hook);
          this._handlers.push(offFunc);
          return function(handler) {
            if (this._handlers && handler) {
              var i = this._handlers.indexOf(handler);
              if (i !== -1) {
                this._handlers.splice(i, 1);
              }
              handler();
            }
          }.bind(this, offFunc);
        },

        _invalidatedMeasure: Number.POSITIVE_INFINITY,
        _invalidatedAllocatedSpace: Number.POSITIVE_INFINITY,
        _forceParentInvalidateMeasure: false,
        _needMeasure: true,

        needMeasure: function() {
          return this._needMeasure;
        },
        forceMeasurement: function() {
          this._needMeasure = true;
        },
        invalidateMeasure: function(invalidation) {
          if (this._invalidatedMeasure !== Number.POSITIVE_INFINITY && (!invalidation || this._invalidatedMeasure < invalidation)) {
            this._invalidatedMeasure = invalidation || cls.LayoutEngineBase.nextInvalidation();
          }
          if (!!this._widget && (this._forceParentInvalidateMeasure || !this._widget.isHidden())) {
            var parentWidget = this._widget && this._widget.getParentWidget(),
              parentEngine = parentWidget && parentWidget.getLayoutEngine();
            if (parentEngine) {
              parentEngine.invalidateMeasure(this._invalidatedMeasure, this);
            }
            this._forceParentInvalidateMeasure = false;
          }
        },
        invalidateAllocatedSpace: function(invalidation) {
          if (this._invalidatedAllocatedSpace !== Number.POSITIVE_INFINITY &&
            (!invalidation || this._invalidatedAllocatedSpace < invalidation)) {
            this._invalidatedAllocatedSpace = invalidation || cls.LayoutEngineBase.nextInvalidation();
          }
          if (!!this._widget && !this._widget.isHidden()) {
            var children = this.getRenderableChildren(),
              len = children.length;
            for (var i = 0; i < len; i++) {
              if (children[i]) {
                var layoutEngine = children[i].getLayoutEngine();
                if (layoutEngine) {
                  layoutEngine.invalidateAllocatedSpace(this._invalidatedAllocatedSpace);
                }
              }
            }
          }
        },
        needMeasureSwitching: Function.true,
        isInvalidatedMeasure: function(timestamp) {
          return this.needMeasure() && !!this._widget && !this._widget.isHidden() && (this._invalidatedMeasure >= timestamp);
        },
        isInvalidatedAllocatedSpace: function(timestamp) {
          return !!this._widget && !this._widget.isHidden() && (this._invalidatedAllocatedSpace >= timestamp);
        },
        isInvalidated: function(timestamp) {
          return (this.isInvalidatedMeasure(timestamp) || this.isInvalidatedAllocatedSpace(timestamp)) && (!this._widget.getWindowWidget() ||
            !this._widget.getWindowWidget()._disabled || this._widget.getWindowWidget()._forceVisible);
        },
        getRenderableChildren: function() {
          return this._widget && this._widget.getChildren && this._widget.getChildren() || [];
        },
        updateInvalidated: function(invalidation) {
          if (!!this._widget && this._widget.isLayoutMeasureable(true)) {
            this._invalidatedMeasure = Math.max(invalidation, this._invalidatedMeasure === Number.POSITIVE_INFINITY ? 1 : this._invalidatedMeasure);
            this._invalidatedAllocatedSpace = Math.max(invalidation, this._invalidatedAllocatedSpace === Number.POSITIVE_INFINITY ?
              1 :
              this._invalidatedAllocatedSpace);
            if (this._getLayoutInfo().getSizePolicyConfig().isInitial()) {
              this._needMeasure = false;
            }
            this._hasBeenLayoutedOnce = true;
          }
        },
        changeHidden: function() {
          this._forceParentInvalidateMeasure = true;
          this.invalidateMeasure();
        },
        /**
         *
         * @param {boolean} visible
         */
        viewDebug: function(visible) {}
      };
    });
  });
