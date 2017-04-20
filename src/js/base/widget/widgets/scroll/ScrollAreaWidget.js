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

modulum('ScrollAreaWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ScrollArea Widget.
     * Use to catch scrolling event and forward them to a Matrix
     * @class classes.ScrollAreaWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ScrollAreaWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ScrollAreaWidget.prototype */
      return {
        __name: "ScrollAreaWidget",

        _size: 0,
        _pageSize: 0,
        _lineHeight: 15,

        _totalHeight: 0,

        //ThinScroll vars
        _displayTime: null,
        _mouseIsOver: false,
        _thinTimer: null,
        _scrollbar: null,

        _initElement: function() {
          $super._initElement.call(this);

          this._element.on("wheel.ScrollAreaWidget", this._onWheel.bind(this));
          this._element.on("scroll.ScrollAreaWidget", this._onScroll.bind(this));
          this._element.on("click.ScrollAreaWidget", this._onClick.bind(this));
          this._scrollbar = cls.WidgetFactory.create("ScrollBar");
          this._scrollbar.display(true);
        },

        destroy: function() {
          this._element.off("wheel.ScrollAreaWidget");
          this._element.off("scroll.ScrollAreaWidget");
          this._element.off("click.ScrollAreaWidget");
          this._scrollbar.destroy();
          $super.destroy.call(this);
        },
        _onWheel: function(event) {
          this.emit(context.constants.widgetEvents.mousewheel, event);
          event.preventDefault();
          //this.refreshScroll();
        },
        _onScroll: function(event) {
          this.emit(context.constants.widgetEvents.scroll, event, this._lineHeight);
        },
        _onClick: function(e) {
          e.preventDefault();
          var gridElement = this._element.parent("g_GridElement");
          // Hide the scrollArea layer
          gridElement.addClass("hidden");
          // Create a click event that will be triggered to the div beyond
          var target = document.elementFromPoint(e.clientX, e.clientY);
          // Focus event is needed to trigger a VM focus request (InputArray)
          var event = document.createEvent('HTMLEvents');
          event.initEvent('focus', true, false);
          target.dispatchEvent(event);
          // Click event is needed to trigger a VM row selection event (DisplayArray)
          event = document.createEvent('HTMLEvents');
          event.initEvent('click', true, false);
          target.dispatchEvent(event);
          // Show back the scrollArea layer
          gridElement.removeClass("hidden");
        },
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
          this.getLayoutInformation()._extraGap = {
            afterX: window.scrollBarSize
          };

          if (this._scrollbar) {
            // position scrollbar according to scrollarea widget
            this._layoutInformation.onGridInfoChanged(function() {
              var scrollAreaLayoutInfo = this.getLayoutInformation();
              var scrollBarLayoutInfo = this._scrollbar.getLayoutInformation();
              scrollBarLayoutInfo.setGridX(scrollAreaLayoutInfo.getGridX() + scrollAreaLayoutInfo.getGridWidth() - 1);
              scrollBarLayoutInfo.setGridY(scrollAreaLayoutInfo.getGridY());
              scrollBarLayoutInfo.setGridWidth(1);
              scrollBarLayoutInfo.setGridHeight(scrollAreaLayoutInfo.getGridHeight());
            }.bind(this));

          }
        },

        getScrollWidget: function() {
          return this;
        },

        setParentWidget: function(widget) {
          $super.setParentWidget.call(this, widget);
          if (this._scrollbar && widget) {
            widget.addChildWidget(this._scrollbar);
            this._scrollbar.setScrollArea(this);
          }
        },

        setSize: function(size) {
          if (size !== this._size) {
            this._size = size;
            this.setTotalHeight(this._lineHeight * this._size);
            if (this._scrollbar) {
              this._scrollbar.setSize(size);
            }
          }
        },

        setPageSize: function(pageSize) {
          if (this._pageSize !== pageSize) {
            this._pageSize = pageSize;
            var lineHeight = this._element.clientHeight / pageSize;
            this.setLineHeight(lineHeight);
            if (this._scrollbar) {
              this._scrollbar.setPageSize(pageSize);
            }
          }
        },

        setOffset: function(offset) {
          this._offset = offset;
          if (this._scrollbar) {
            this._scrollbar.setOffset(offset);
          }
        },

        setLineHeight: function(lineHeight) {
          this._lineHeight = lineHeight;
          if (this._scrollbar) {
            this._scrollbar.setLineHeight(lineHeight);
          }
        },

        /**
         * Will set the total height of the scrollArea
         * @param {Number} height total
         */
        setTotalHeight: function(height) {
          if (!this.isEnabled()) {
            height = 0;
          }
          this.setStyle(".spacer", {
            "height": Math.max(0, height) + "px"
          });
          this._totalHeight = Math.max(0, height);
          if (this._scrollbar) {
            this._scrollbar.setTotalHeight(this._totalHeight);
          }
          this.refreshScroll();
        },

        // Refresh the scrollBar
        refreshScroll: function() {
          var pixelOffset = this._lineHeight * this._offset;
          this._lastPosition = pixelOffset;
          if (this._element) {
            this._element.scrollTop = pixelOffset;
          }
        },

        /**
         *
         * @param displayTime
         */
        setThinScrollbar: function(displayTime) {
          this.getLayoutInformation()._extraGap = {
            afterX: 0
          };

          this.addClass("thinScrollBar");
          // get grid parent
          this._displayTime = displayTime;
          this._scrollbar.setDisplayTime(displayTime);
        },

      };
    });
    cls.WidgetFactory.register('ScrollArea', cls.ScrollAreaWidget);
  });
