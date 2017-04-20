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

modulum('ScrollTabDecorator',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Add scroll tab mechanism to widget elements
     * @class classes.ScrollTabDecorator
     */
    cls.ScrollTabDecorator = context.oo.Class(function($super) {
      /** @lends classes.ScrollTabDecorator.prototype */
      return {
        __name: "ScrollTabDecorator",

        _tabsHost: null,
        _tabsTitlesBar: null,
        _tabsTitlesHost: null,
        _tabsTitlesElement: null,
        _previousScroller: null,
        _nextScroller: null,
        _leftScrollInterval: null,
        _rightScrollInterval: null,
        _offsetPos: "offsetLeft",
        _offsetSize: "offsetWidth",
        _scrollPos: "scrollLeft",
        _scrollStep: 6,

        _position: "top",
        _scrollerPosition: 0,

        /**
         * Initializes the helper object. You need to provide a widget instance which will be instrumented
         * @param widget the widget to handle
         */
        constructor: function(widget) {
          $super.constructor.call(this);
          this._widget = widget;

          this._tabsHost = this._widget.getElement().getElementsByClassName("mt-tabs")[0];
          this._tabsTitlesBar = this._widget.getElement().getElementsByClassName("mt-tab-titles-bar")[0];
          this._tabsTitlesHost = this._widget.getElement().getElementsByClassName("mt-tab-titles")[0];
          this._tabsTitlesElement = this._widget.getElement().getElementsByClassName("mt-tab-titles-container")[0];
          this._previousScroller = this._widget.getElement().getElementsByClassName("mt-tab-previous")[0];
          this._nextScroller = this._widget.getElement().getElementsByClassName("mt-tab-next")[0];

          this._widget.getElement().on("mouseover.FolderWidget", function() {
            this.refreshScrollers();
            this._widget.getElement().off("mouseover.FolderWidget");
          }.bind(this));
          this._previousScroller
            .on("mouseover.FolderWidget", this._beginScrollTabsLeft.bind(this))
            .on("mouseout.FolderWidget", this._endScrollTabsLeft.bind(this));
          this._nextScroller
            .on("mouseover.FolderWidget", this._beginScrollTabsRight.bind(this))
            .on("mouseout.FolderWidget", this._endScrollTabsRight.bind(this));

          if (this._tabsTitlesBar) {
            this._tabsTitlesBar.on("touchstart.scrolltab", this._startTouchScroll.bind(this));
            this._tabsTitlesBar.on("touchend.scrolltab", this._endTouchScroll.bind(this));
            this._tabsTitlesBar.on("touchmove.scrolltab", this._touchMove.bind(this));
          } else if (this._tabsTitlesElement) {
            this._tabsTitlesElement.on("touchstart.scrolltab", this._startTouchScroll.bind(this));
            this._tabsTitlesElement.on("touchend.scrolltab", this._endTouchScroll.bind(this));
            this._tabsTitlesElement.on("touchmove.scrolltab", this._touchMove.bind(this));
          }

        },

        destroy: function() {
          this._widget.getElement().off("mouseover.FolderWidget");
          this._previousScroller.off("mouseover.FolderWidget");
          this._previousScroller.off("mouseout.FolderWidget");
          this._nextScroller.off("mouseover.FolderWidget");
          this._nextScroller.off("mouseout.FolderWidget");

          if (this._tabsTitlesBar) {
            this._tabsTitlesBar.off("touchstart.scrolltab");
            this._tabsTitlesBar.off("touchend.scrolltab");
            this._tabsTitlesBar.off("touchmove.scrolltab");
          }

          this._widget = null;
        },

        _beginScrollTabsLeft: function() {
          if (!this._leftScrollInterval) {
            this._leftScrollInterval = window.setInterval(function() {
              var scroll = this._tabsTitlesHost[this._scrollPos];
              if (scroll > 0) {
                this._tabsTitlesHost[this._scrollPos] = scroll = scroll - this._scrollStep;
              }
              if (scroll <= 0) {
                this._previousScroller.removeClass("overflown-previous");
                this._endScrollTabsLeft();
              } else {
                this._previousScroller.addClass("overflown-previous");
              }
              this._nextScroller.toggleClass("overflown-next",
                scroll + this._tabsTitlesHost[this._offsetSize] < this._tabsTitlesElement[this._offsetSize]
              );
            }.bind(this), 10);
          }
        },
        _endScrollTabsLeft: function() {
          if (!!this._leftScrollInterval) {
            window.clearInterval(this._leftScrollInterval);
            this._leftScrollInterval = null;
          }
        },
        _beginScrollTabsRight: function() {
          if (!this._rightScrollInterval) {
            this._rightScrollInterval = window.setInterval(function() {
              var scroll = this._tabsTitlesHost[this._scrollPos],
                now;
              this._tabsTitlesHost[this._scrollPos] = scroll + this._scrollStep;
              if ((now = this._tabsTitlesHost[this._scrollPos]) <= scroll) {
                this._nextScroller.removeClass("overflown-next");
                this._endScrollTabsRight();
              } else {
                this._nextScroller.addClass("overflown-next");
              }
              this._previousScroller.toggleClass("overflown-previous", now > 0);
            }.bind(this), 10);
          }
        },
        _endScrollTabsRight: function() {
          if (!!this._rightScrollInterval) {
            window.clearInterval(this._rightScrollInterval);
            this._rightScrollInterval = null;
          }
        },

        refreshScrollers: function() {
          window.requestAnimationFrame(function() {
            var scroll = this._tabsTitlesHost[this._scrollPos];
            this._nextScroller.toggleClass("overflown-next",
              scroll + this._tabsTitlesHost[this._offsetSize] < this._tabsTitlesElement[this._offsetSize]
            );
            this._previousScroller.toggleClass("overflown-previous", scroll > 0);
          }.bind(this));
        },

        showScroller: function(display) {
          if (display) {
            this._previousScroller.removeClass("vanished");
            this._nextScroller.removeClass("vanished");
          } else {
            this._previousScroller.addClass("vanished");
            this._nextScroller.addClass("vanished");
          }
        },

        /**
         *
         * @param {classes.PageWidget} page
         */
        scrollTo: function(element) {
          window.requestAnimationFrame(function() {
            if (element) {
              var scroll = this._tabsTitlesHost[this._scrollPos];
              var titleLeft = element[this._offsetPos],
                titleWidth = element[this._offsetSize],
                hostWidth = this._tabsTitlesHost[this._offsetSize],
                deltaLeft = titleLeft - scroll;
              if ((deltaLeft) < 0 || (deltaLeft + titleWidth) > hostWidth) {
                this._tabsTitlesHost[this._scrollPos] = titleLeft;
              }
            }
            this.refreshScrollers();
          }.bind(this));
        },

        _updateOffset: function(position) {
          switch (position) {
            case "top":
            case "bottom":
              this._offsetPos = "offsetLeft";
              this._offsetSize = "offsetWidth";
              this._scrollPos = "scrollLeft";
              this._scrollStep = 6;
              break;
            case "left":
            case "right":
              this._offsetPos = "offsetTop";
              this._offsetSize = "offsetHeight";
              this._scrollPos = "scrollTop";
              this._scrollStep = 2;
              break;
          }
        },

        updatePosition: function(tag, position) {
          this._position = position;
          if (this._tabsHost) {
            this._tabsHost.setAttribute(tag, position);
          }
          if (this._tabsTitlesBar) {
            this._tabsTitlesBar.setAttribute(tag, position);
          }
          if (this._tabsTitlesHost) {
            this._tabsTitlesHost.setAttribute(tag, position);
          }
          if (this._tabsTitlesElement) {
            this._tabsTitlesElement.setAttribute(tag, position);
          }
          if (this._previousScroller) {
            this._previousScroller.setAttribute(tag, position);
          }
          if (this._nextScroller) {
            this._nextScroller.setAttribute(tag, position);
          }

          this._updateOffset(position);
        },

        /**
         Touch / Mobile specific methods
         **/

        /**
         * Handler when a finger touches the screen
         * @param evt
         * @private
         */
        _startTouchScroll: function(evt) {
          var styleAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "margin-left" : "margin-top";
          this._scrollTouching = true;
          this._scrollTouchingPos = evt.changedTouches[0];
          this._scrollerPosition = parseInt(this._tabsTitlesElement.style[styleAttr] = this._tabsTitlesElement.style[styleAttr] ===
            "" ? "0px" : this._tabsTitlesElement.style[styleAttr]);

          this._nextScroller.addClass("overflown-next");
          this._previousScroller.addClass("overflown-previous");
        },

        /**
         * Handler when a finger stop touching the screen
         * @param evt
         * @private
         */
        _endTouchScroll: function(evt) {
          var styleAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "margin-left" : "margin-top";
          var rectAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "clientWidth" : "clientHeight";
          this._scrollTouching = false;
          this._scrollTouchingPos = null;
          var margin = parseInt(this._tabsTitlesElement.style[styleAttr], 10);

          // Replace scroller in view
          if (margin >= 0) {
            this._tabsTitlesElement.style[styleAttr] = "0px";
            this._nextScroller.addClass("overflown-next");
            this._previousScroller.removeClass("overflown-previous");
          } else if (Math.abs(margin) > this._tabsTitlesElement[rectAttr] - this._tabsTitlesHost[rectAttr]) {
            var max = this._tabsTitlesElement[rectAttr] - this._tabsTitlesHost[rectAttr];
            this._tabsTitlesElement.style[styleAttr] = "-" + max + "px";
            this._nextScroller.removeClass("overflown-next");
            this._previousScroller.addClass("overflown-previous");
          }
        },

        /**
         * Moves the scroller as the finger moves on touchscreen
         * @param evt
         * @private
         */
        _touchMove: function(evt) {
          var styleAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "margin-left" : "margin-top";
          var rectAttr = ["top", "bottom"].indexOf(this._position) >= 0 ? "clientX" : "clientY";
          if (this._scrollTouching) {
            var move = this._scrollerPosition + evt.changedTouches[0][rectAttr] - this._scrollTouchingPos[rectAttr];
            this._tabsTitlesElement.style[styleAttr] = move + "px";
          }
        }

      };
    });
  });
