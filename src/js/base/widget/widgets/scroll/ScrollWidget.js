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

modulum('ScrollWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * HBox or VBox widget.
     * @class classes.ScrollWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ScrollWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ScrollWidget.prototype */
      return {
        __name: "ScrollWidget",
        _lineHeight: 0,
        _pageSize: 0,
        _size: 0,
        _offset: 0,
        _spacer: null,
        _lastPosition: 0,

        //override default
        _initElement: function() {
          $super._initElement.call(this);

          this._element.on('scroll.ScrollWidget', this._onScroll.bind(this));

          this._spacer = this.getElement().getElementsByTagName("div")[0];
        },
        destroy: function() {
          this._element.off('scroll.ScrollWidget');
          $super.destroy.call(this);

        },
        _onScroll: function(event) {
          this.getParentWidget().emit(context.constants.widgetEvents.scroll, event, this._lineHeight);
        },
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ScrollLayoutEngine(this);
        },

        setParentWidget: function(widget) {
          this._detachScrollBar();
          $super.setParentWidget.call(this, widget);
          if (widget) {
            this._attachScrollBar();
          }
        },

        setEnabled: function(state) {
          $super.setEnabled.call(this, state);
          if (!state) {
            this.setTotalHeight(0);
          }
          //this.setThinScrollBar(1);
        },

        setPageSize: function(pageSize) {
          this._pageSize = pageSize;
        },

        setSize: function(size) {
          this._size = size;
        },

        setLineHeight: function(lineHeight) {
          this._lineHeight = lineHeight;
        },

        getLineHeight: function() {
          return this._lineHeight;
        },

        setOffset: function(offset) {
          this._offset = offset;
        },

        // Refresh the scrollBar
        refreshScroll: function() {
          if (this._lastPosition !== this._offset) {
            this._lastPosition = this._offset;
            var pixelOffset = this._lineHeight * this._offset;
            window.requestAnimationFrame(function() {
              this.getElement().scrollTop = pixelOffset;
            }.bind(this));
          }
        },

        /**
         * Will set the visible height of the scroll Area
         * @param {Number} height visible
         */
        setVisibleHeight: function(height) {
          this.setStyle({
            "height": height + "px"
          });
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
        },

        /**
         * Will add a scrollbar to parent container
         * */
        _attachScrollBar: function() {
          var parentElement = this.getParentWidget().getElement();
          parentElement.appendChild(this.getElement());

          // Add a listener on parent scroll
          // usage of requestAnimationFrame for firefox optimization (ENGGCS-3347)
          window.requestAnimationFrame(function() {
            var mouseWheelFunc = function(event) {
              if (this.isEnabled()) {
                this.getParentWidget().emit(context.constants.widgetEvents.mousewheel, event, this._lineHeight);
              }
            }.bind(this);
            var touchMoveFunc = function(event) {
              if (this.isEnabled()) {
                this.getParentWidget().emit(context.constants.widgetEvents.touchmove, event, this._lineHeight);
              }
            }.bind(this);
            var touchStartFunc = function(event) {
              if (this.isEnabled()) {
                this.getParentWidget().emit(context.constants.widgetEvents.touchstart, event, this._lineHeight);
              }
            }.bind(this);
            var touchEndFunc = function(event) {
              if (this.isEnabled()) {
                this.getParentWidget().emit(context.constants.widgetEvents.touchend, event, this._lineHeight);
              }
            }.bind(this);

            parentElement.on('wheel.ScrollWidget', mouseWheelFunc);
            parentElement.on('touchstart.ScrollWidget', touchStartFunc);
            parentElement.on('touchend.ScrollWidget', touchEndFunc);
            parentElement.on('touchmove.ScrollWidget', touchMoveFunc);

          }.bind(this));
        },

        /**
         * Will remove scrollbar to parent container
         * */
        _detachScrollBar: function() {
          if (this.getParentWidget()) {
            var parentElement = this.getParentWidget().getElement();
            parentElement.off('wheel.ScrollWidget');
            parentElement.off('touchstart.ScrollWidget');
            parentElement.off('touchend.ScrollWidget');
            parentElement.off('touchmove.ScrollWidget');
          }
        }

      };
    });
    cls.WidgetFactory.register('Scroll', cls.ScrollWidget);
  });
