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

modulum('WidgetGridLayoutBase', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for widget group.
     * @class classes.WidgetGridLayoutBase
     * @extends classes.WidgetGroupBase
     */
    cls.WidgetGridLayoutBase = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.WidgetGridLayoutBase.prototype */
      return {
        __name: "WidgetGridLayoutBase",
        _isGridChildrenInParent: null,
        _rerouteChildren: false,
        _owned: null,
        _scrolling: false,
        _wheelHandling: false,
        _wheelThrottleHandler: null,
        _wheelThrottleTimeout: null,

        constructor: function() {
          $super.constructor.call(this);
          this._wheelThrottleTimeout = cls.ScrollUIBehavior._throttleTimeout * 4;
          this._owned = [];
          this._element.addClass("g_Grid");
          this._containerElement.addClass("g_GridLayoutEngine");
        },

        _initLayout: function(noLayoutEngine) {
          $super._initLayout.call(this);
          if (!noLayoutEngine) {
            this._layoutEngine = new cls.GridLayoutEngine(this);
          }
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _addChildWidgetToDom: function(widget, position) {
          this.getLayoutEngine().registerChild(widget);
          var widgetGridHost = document.createElement('div');
          widgetGridHost.addClass('g_GridElement');
          var info = widget.getLayoutInformation();
          if (info) {
            info.setHost(widgetGridHost);
          }
          if (widget instanceof cls.ScrollAreaWidget) {
            if (!this._wheelHandling) {
              this._wheelHandling = true;
              this._element.addEventListener("wheel", this._handleWheel.bind(this));
            }
            widgetGridHost.addClass('g_GridElement_scrollzone');
          } else {
            widgetGridHost.addClass('g_GridElement_scrollignore');
          }
          widgetGridHost.appendChild(widget._element);
          widgetGridHost.insertAt(position, this._containerElement);
        },

        _handleWheel: function(event) {
          if (this._wheelHandling) {
            if (this._wheelThrottleHandler) {
              window.clearTimeout(this._wheelThrottleHandler);
            }
            if (!this._scrolling) {
              this._scrolling = true;
              this._element.addClass("g_scrolling");
            }
            this._wheelThrottleHandler = window.setTimeout(function() {
              this._scrolling = false;
              this._element.removeClass("g_scrolling");
            }.bind(this), this._wheelThrottleTimeout);
          }
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _removeChildWidgetFromDom: function(widget) {
          this.getLayoutEngine().unregisterChild(widget);
          var info = widget.getLayoutInformation(),
            host = info && info.getHost();
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },
        isGridChildrenInParent: function() {
          return this._isGridChildrenInParent;
        },
        setGridChildrenInParent: function(isGridChildrenInParent) {
          if (this._isGridChildrenInParent !== isGridChildrenInParent) {
            this._isGridChildrenInParent = isGridChildrenInParent;
            if (this._isGridChildrenInParent) {
              this._moveOwnChildrenToParent();
            } else {
              this._moveOwnChildrenToSelf();
            }
          }
        },

        addChildWidget: function(widget, options) {
          if (this._rerouteChildren) {
            this._owned.push(widget);
            var layoutInfo = widget.getLayoutInformation();
            if (layoutInfo) {
              layoutInfo.setOwningGrid(this);
            }
            this.getParentWidget().addChildWidget(widget, options);
          } else {
            $super.addChildWidget.call(this, widget, options);
          }
        },

        removeChildWidget: function(widget, options) {
          if (this._rerouteChildren) {
            this.getParentWidget().removeChildWidget(widget, options);
            var layoutInfo = widget.getLayoutInformation();
            if (layoutInfo) {
              layoutInfo.setOwningGrid(null);
            }
          } else {
            $super.removeChildWidget.call(this, widget, options);
          }
        },

        _listChildrenToMoveWhenGridChildrenInParent: function() {
          return this._children.slice();
        },

        _moveOwnChildrenToParent: function() {
          var children = [];
          var childrenToMove = this._listChildrenToMoveWhenGridChildrenInParent();
          while (childrenToMove.length) {
            var child = childrenToMove.shift();
            this.removeChildWidget(child);
            children.push(child);
          }
          this._rerouteChildren = true;
          while (children.length) {
            this.addChildWidget(children.shift());
          }
        },
        _moveOwnChildrenToSelf: function() {
          var children = [];
          while (this._owned.length) {
            var child = this._owned[0];
            this.removeChildWidget(child);
            children.push(child);
          }
          this._rerouteChildren = false;
          while (children.length) {
            this.addChildWidget(children.shift());
          }
        }
      };
    });
  });
