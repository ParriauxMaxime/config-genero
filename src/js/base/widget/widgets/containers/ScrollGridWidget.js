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

modulum('ScrollGridWidget', ['WidgetGridLayoutBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Grid widget.
     * @class classes.ScrollGridWidget
     * @extends classes.WidgetGridLayoutBase
     */
    cls.ScrollGridWidget = context.oo.Class(cls.GridWidget, function($super) {
      /** @lends classes.ScrollGridWidget.prototype */
      return {
        __name: "ScrollGridWidget",
        /**
         * @type {classes.ScrollWidget}
         */
        _scrollWidget: null, // used only for no stretchable scrollgrid
        _isStretchable: null,
        _pageSize: null,
        _size: null,
        _offset: null,
        lastSentOffset: null,

        /** Handlers */
        _uiActivateHandler: null,

        /** Parent widgets */
        _appWidget: null,

        /**
         * @constructs {classes.ScrollGridWidget}
         */
        constructor: function(opts) {
          opts = opts || {};
          this._appWidget = opts.appWidget;
          $super.constructor.call(this, opts);
        },

        _initElement: function() {
          $super._initElement.call(this);

          this._element.on('click.ScrollGridWidget', function(event) {
            this.emit(context.constants.widgetEvents.click, event);
          }.bind(this));
          this._element.on('dblclick.ScrollGridWidget', function(event) {
            this.emit(context.constants.widgetEvents.doubleClick, event);
          }.bind(this));
          if (this._appWidget) {
            this._uiActivateHandler = this._appWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          }
        },

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ScrollGridLayoutEngine(this);
        },

        setStretchable: function(isStretchable) {
          if (this._isStretchable === null) { // can execute this code only one time
            this._isStretchable = isStretchable;

            if (isStretchable) {
              // in this case we use a native scrollbar
              this.setStyle({
                overflow: 'auto'
              });
              this._element.on('scroll.ScrollGridWidget', this._onScroll.bind(this));
            } else {
              // in this case wa add a specific scrollbar (scrollWidget)
              if (!this._scrollWidget) {
                this._scrollWidget = cls.WidgetFactory.create("Scroll");
                this.addChildWidget(this._scrollWidget, {
                  noDOMInsert: true
                });
                this._element.appendChild(this._scrollWidget.getElement());
              }
            }
          }
        },

        _listChildrenToMoveWhenGridChildrenInParent: function() {
          return this._children.filter(function(item) {
            return item !== this._scrollWidget;
          }.bind(this));
        },

        /**
         * @returns {number} scroll data area height
         */
        getDataAreaHeight: function() {
          return this.getLayoutInformation().getAvailable().getHeight();
        },

        setFixedPageSize: function(state) {
          this.setStretchable(!state);
        },

        getScrollWidget: function() {
          return this._scrollWidget;
        },

        getRowHeight: function() {
          if (this._scrollWidget) {
            return this._layoutInformation.getMeasured().getHeight() / this._pageSize;
          }
          return this.getLayoutInformation().lineHeight;
        },

        getScrollableArea: function() {
          if (this._scrollWidget) {
            return this._scrollWidget.getElement();
          }
          return this.getElement();
        },

        setPageSize: function(pageSize) {
          this._pageSize = pageSize;
          if (this._scrollWidget) {
            this._scrollWidget.setPageSize(pageSize);
          }
        },

        setSize: function(size) {
          this._size = size;
          if (this._scrollWidget) {
            this._scrollWidget.setSize(size);
          }
        },

        setOffset: function(offset) {
          this._offset = offset;
          if (this._scrollWidget) {
            this._scrollWidget.setOffset(offset);
          }
        },
        setTotalHeight: function(size) {
          if (this._scrollWidget) {
            this._scrollWidget.setTotalHeight(size);
          }
        },

        // used only for no stretchable scrollgrid
        refreshScroll: function() {
          if (this._scrollWidget) {
            this._scrollWidget.setLineHeight(this.getRowHeight());
            this._scrollWidget.refreshScroll();
          }
        },

        /**
         * Update vertical scroll
         * @param forceScroll
         */
        updateVerticalScroll: function(forceScroll) {
          this.setVerticalScroll(this._size, this._pageSize, this._offset, forceScroll);
        },

        // used only for stretchable scrollgrid
        // BEWARE this code should be the same as TableWidget::setVerticalScroll
        setVerticalScroll: function(size, pageSize, offset, forceScroll) {

          if (!this._scrollWidget) {

            this.setSize(size);
            this._pageSize = pageSize;

            var top = offset * this.getRowHeight();
            var height = (size - offset) * this.getRowHeight();

            this.setStyle("> .containerElement", {
              "top": top + "px",
              "height": height + "px"
            });

            if (!!forceScroll || (this.lastSentOffset === null || this.lastSentOffset === offset) && offset !== this._offset) {
              this._offset = offset;
              // need to do this because to scroll we need to wait the style "height" set just before is really applied in the dom
              window.requestAnimationFrame(function() {
                this.getScrollableArea().scrollTop = top;
              }.bind(this));
            }

            this.lastSentOffset = null;
          }
        },

        _onScroll: function(event) {
          this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());
        },

        /**
         * redefined destroy to remove the scrollWidgetBefore
         */
        destroy: function() {
          if (this._scrollWidget) {
            this._scrollWidget.destroy();
            this._scrollWidget = null;
          }

          if (this._uiActivateHandler) {
            this._uiActivateHandler();
            this._uiActivateHandler = null;
          }

          this._element.off('click.ScrollGridWidget');
          this._element.off('dblclick.ScrollGridWidget');
          this._element.off('scroll.ScrollGridWidget');
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.register('ScrollGrid', cls.ScrollGridWidget);
  });
