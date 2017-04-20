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

modulum('LayoutApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.LayoutApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.LayoutApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.LayoutApplicationService.prototype */
      return {
        __name: "LayoutApplicationService",
        /**
         * @type {number}
         */
        _throttle: null,
        /**
         * @type {number}
         */
        _throttleTimeout: 5,
        _resizing: false,
        _running: false,
        _hasBeenLayouted: false,

        _documentIsVisible: true,

        _autoOverflowMode: false,

        _lastInvalidated: 0,
        idle: true,
        /**
         *
         * @param {classes.VMApplication} app owner
         */
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._updateDocumentVisibility();
          context.InitService.when(context.constants.widgetEvents.visibilityChange, this._updateDocumentVisibility.bind(this));
        },

        hasBeenLayouted: function() {
          return this._hasBeenLayouted;
        },

        _updateDocumentVisibility: function() {
          this._documentIsVisible = !document.hidden;
          if (this._documentIsVisible) {
            this.refreshLayout();
          }
        },
        refreshLayout: function(options) {
          options = options || {};
          this._requestLayout(!!options.resize);
        },
        /**
         * request a layout refresh
         * @param {boolean} invoked by window resize
         * @private
         */
        _requestLayout: function(resize) {
          this.idle = false;
          if (this._throttle) {
            window.clearTimeout(this._throttle);
          }
          this._resizing = !!resize;
          if (resize && this._application && this._application.getUI()) {
            this._application.getUI().getWidget().getLayoutEngine().invalidateAllocatedSpace();
          }
          this._throttle = window.setTimeout(function() {
            this._throttle = null;
            if (this._application) {
              this._refresh();
            }
          }.bind(this), this._throttleTimeout);
        },

        /**@param {classes.WidgetGroupBase|classes.WidgetBase}item */
        _internalChildrenSelector: function(item) {
          var result = [];
          if (item && !item.isHidden()) {
            result = item.getLayoutEngine() && item.getLayoutEngine().getRenderableChildren() || [];
          }
          return result;
        },

        _timeoutHandler: null,

        _refresh: function() {
          if (this._documentIsVisible) {

            var node = this._application.model.getNode(0),
              ctrl = node && node.getController(),
              widget = ctrl && ctrl.getWidget();

            if (document.body.contains(widget && widget.getElement())) {
              if (node && node.getController()) {
                this._running = true;
                styler.bufferize();
                var measureInfo = {
                  needMeasureSwitching: false
                };
                var traversal = new window.Throu(node.getController().getWidget());
                traversal.setChildrenSelector(this._internalChildrenSelector.bind(this));
                traversal.pass(this._refreshLayoutPassHidden.bind(this, measureInfo), false, this._hasChildrenFunction);
                traversal.unique(this._switchMeasuring.bind(this, true, measureInfo));
                traversal.pass(this.preMeasure.bind(this), true);
                // get elements sizes (width/height)
                traversal.pass(this.tryMeasure.bind(this), true);
                // using parent container, adjust previously measured sizes
                traversal.pass(this.ajustLayout.bind(this), true);
                traversal.pass(this.reAjustLayout.bind(this), true);
                traversal.pass(this.prepareLayout.bind(this));
                traversal.pass(this.applyLayout.bind(this));
                traversal.unique(this._switchMeasuring.bind(this, false, measureInfo));
                traversal.pass(this.notifyLayout.bind(this));
                traversal.unique(this._updateInvalidation.bind(this));
                traversal.run();
                context.styler.flush();
                context.styler.bufferize();
                context.styler.flush();
                this.emit(context.constants.widgetEvents.layout, this._resizing);

                this._resizing = false;
                this._hasBeenLayouted = true;
                this._running = false;
              }

              this.idle = true;
              this.emit(context.constants.widgetEvents.afterLayout);
              window.requestAnimationFrame(function() {
                if (this._application && !this._application.isProcessing()) {
                  context.FocusService.restoreVMFocus(this._application);
                }
                this.emit(context.constants.widgetEvents.afterLayoutFocusRestored);
              }.bind(this));
            }
          }
        },
        _updateInvalidation: function() {
          this._lastInvalidated = cls.LayoutEngineBase.nextInvalidation();
        },
        _hasChildrenFunction: function(item) {
          return !!item.getChildren && item.getChildren();
        },
        _refreshLayoutPassHidden: function(measureInfo, item, parent) {
          if (item && item.getLayoutInformation()) {
            item.getLayoutInformation().__layoutPassHidden =
              (!!parent && parent.getLayoutInformation().__layoutPassHidden) || !item.isVisible();
          }
          measureInfo.needMeasureSwitching = measureInfo.needMeasureSwitching ||
            (!!item.getLayoutEngine().isInvalidatedMeasure(this._lastInvalidated) && !!item.getLayoutEngine().needMeasureSwitching());
        },
        afterLayout: function(hook) {
          return this.when(context.constants.widgetEvents.layout, hook);
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        tryMeasure: function(widget) {
          if (widget.getLayoutEngine().isInvalidatedMeasure(this._lastInvalidated)) {
            widget.getLayoutEngine().measureChar();
            widget.getLayoutEngine().measure(this._lastInvalidated, this);
          }
          if (widget.getLayoutEngine().isInvalidated(this._lastInvalidated)) {
            widget.getLayoutEngine().prepareMeasurements();
          }
        },
        _switchMeasuring: function(measuring, measureInfo) {
          if (measureInfo.needMeasureSwitching) {
            var rootElement = this._application.getUI().getWidget().getElement();
            if (measuring) {
              rootElement.addClass("g_measuring").removeClass("g_measured");
            } else {
              rootElement.addClass("g_measured").removeClass("g_measuring");
            }
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        preMeasure: function(widget) {
          if (widget.getLayoutEngine().isInvalidatedMeasure(this._lastInvalidated)) {
            widget.getLayoutEngine().prepareMeasure();
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        ajustLayout: function(widget) {
          if (widget.getLayoutEngine().isInvalidated(this._lastInvalidated)) {
            widget.getLayoutEngine().ajust(this._lastInvalidated, this);
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        reAjustLayout: function(widget) {
          if (this._autoOverflowMode && widget.getLayoutEngine().isInvalidated(this._lastInvalidated)) {
            widget.getLayoutEngine().ajust(this._lastInvalidated, this);
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        prepareLayout: function(widget) {
          if (widget.getLayoutEngine().isInvalidated(this._lastInvalidated)) {
            widget.getLayoutEngine().prepare();
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        applyLayout: function(widget) {
          if (widget.getLayoutEngine().isInvalidated(this._lastInvalidated)) {
            widget.getLayoutEngine().apply();
            widget.getLayoutEngine().updateInvalidated(this._lastInvalidated);
          }
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        notifyLayout: function(widget) {
          if (widget.getLayoutEngine()) {
            widget.getLayoutEngine().notify();
          }
        },

        activateAutoOverflow: function() {
          this._autoOverflowMode = true;
        },

        isAutoOverflowActivated: function() {
          return this._autoOverflowMode;
        }
      };
    });
    cls.ApplicationServiceFactory.register("Layout", cls.LayoutApplicationService);
  });
