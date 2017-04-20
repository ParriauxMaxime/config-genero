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

modulum('ScrollBarWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ScrollArea Widget.
     * Use to catch scrolling event and forward them to a Matrix
     * @class classes.ScrollBarWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ScrollBarWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ScrollBarWidget.prototype */
      return {
        __name: "ScrollBarWidget",
        _scrollArea: null,
        _totalHeight: 0,
        _thumbHeight: 0,
        _displayTime: 1, // default as defined in genero doc
        _displayTimer: null,
        _mouseDown: false,

        _initElement: function() {
          $super._initElement.call(this);
          this._thumbElement = this._element.querySelector(".thumb");

          this._dragDealer(this._element);
          this._element.on("mouseover.scrollBar", this._mouseMove.bind(this));
          this._thumbElement.on("mouseover.scrollBar", this._mouseMove.bind(this));
          this._element.on("mouseleave.scrollBar", this._mouseLeave.bind(this));
          this._thumbElement.on("mouseleave.scrollBar", this._mouseLeave.bind(this));
        },

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);
        },

        _setThumbHeight: function(height) {
          this._thumbHeight = height;
          this._thumbElement.style.height = height + "px";
        },

        _setThumbPosition: function(top) {
          // Keep thumb into view
          var max = this._element.clientHeight - this._thumbHeight;
          top = top >= 0 && top < max ? top : top >= max ? max : 0;
          this._thumbElement.style.top = top + "px";
        },

        _mouseMove: function() {
          this.display(true);
        },

        _mouseLeave: function() {
          if (this._displayTime > 0) {
            this.display(false);
          }
        },

        // Mouse drag handler
        _dragDealer: function(el) {
          var sbWidget = this;

          var raf = window.requestAnimationFrame || window.setImmediate || function(c) {
            return setTimeout(c, 0);
          };

          function drag(e) {
            raf(function() {
              sbWidget._mouseDown = true;
              var newPos = e.pageY - sbWidget._element.getClientRects()[0].top - (sbWidget._thumbHeight / 2);
              sbWidget._setThumbPosition(newPos);

              var size = sbWidget._size;
              var pageSize = sbWidget._pageSize;
              var thumbTop = parseInt(sbWidget._thumbElement.style.top);
              // Take thumb height into account
              var total = parseInt(sbWidget._element.clientHeight - sbWidget._thumbHeight);
              var thumbRatio = ((thumbTop) / (total));

              // offset should be >= 0
              var maxOffset = (size - pageSize) < 0 ? 0 : size - pageSize;

              //need to update the VM position as well
              var requestedOffset = parseInt(maxOffset * thumbRatio);
              if (requestedOffset >= 0) {
                e.forceOffset = requestedOffset;
                sbWidget._scrollArea.emit(context.constants.widgetEvents.scroll, e);
              }
            });
          }

          function stop() {
            sbWidget._mouseDown = false;
            el.classList.remove('ss-grabbed');
            document.body.classList.remove('ss-grabbed');
            document.body.off('mousemove');
            document.body.off('mouseup');
          }

          this._element.on('mousedown', function() {
            el.classList.add('ss-grabbed');
            document.body.classList.add('ss-grabbed');

            document.body.on('mousemove', drag.bind(this));
            document.body.on('mouseup', stop.bind(this));
            return false;
          });

        },

        /**
         * Set delay before hiding the scrollBar
         * @param {number} delay in second
         */
        setDisplayTime: function(delay) {
          this._displayTime = delay;
        },

        /**
         * Show or hide the scrollBar
         * @param {boolean} displayed true:visible, false: hidden
         * @param {boolean=} instant force the delay to 0 if true
         */
        display: function(displayed, instant) {
          if (this._displayTime < 0) {
            this.addClass("thinScrollbar-vanished");
            displayed = false;
          }

          var delay = instant ? 0 : this._displayTime ? this._displayTime : 0;
          if (!displayed) {
            this._displayTimer = window.setTimeout(function() {
              this.addClass("thinScrollbar-vanished");
            }.bind(this), delay * 1000);
          } else {
            if (this._displayTimer) {
              window.clearTimeout(this._displayTimer);
              this._displayTimer = null;
            }
            this.removeClass("thinScrollbar-vanished");
          }
        },

        /**
         * Define the linked scrollArea
         * @param {widget} widget
         */
        setScrollArea: function(widget) {
          this._scrollArea = widget;
        },

        /**
         * Total height of the scrollArea
         * @param {Number} height in pixels
         */
        setTotalHeight: function(height) {
          this._totalHeight = height;
        },

        /**
         *
         * @param lineHeight
         */
        setLineHeight: function(lineHeight) {
          this._lineHeight = lineHeight;
          this._setThumbHeight(lineHeight);
        },

        /**
         * Set the total of element in scroll (linked to scrollArea)
         * @param {Number} size
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Set the number of element in scroll Page (linked to scrollArea)
         * @param {Number} pageSize
         */
        setPageSize: function(pageSize) {
          this._pageSize = pageSize;
          //this._setHeight(this._element.clientHeight / pageSize);
        },

        /**
         * Set the current offset (linked to scrollArea)
         * @param {Number} offset
         */
        setOffset: function(offset) {
          this.display(true);
          this._offset = offset;
          if (!this._mouseDown && this._lineHeight) {
            var maxPos = this._element.clientHeight - this._thumbHeight;
            var maxOffset = this._size - this._pageSize;
            var pos = (offset * maxPos) / maxOffset;
            this._setThumbPosition(pos);
          }
          if (this._displayTime > 0) {
            this.display(false);
          }
        },

        destroy: function() {
          this._element.off("mouseover.scrollBar");
          this._thumbElement.off("mouseover.scrollBar");
          this._element.off("mouseleave.scrollBar");
          this._thumbElement.off("mouseleave.scrollBar");
          if (this._displayTimer) {
            window.clearTimeout(this._displayTimer);
            this._displayTimer = null;
          }
          $super.destroy.call(this);
        },
      };
    });
    cls.WidgetFactory.register('ScrollBar', cls.ScrollBarWidget);
  });
