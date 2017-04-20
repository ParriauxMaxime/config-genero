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

modulum('ApplicationHostSidebarWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostSidebarWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationHostSidebarWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ApplicationHostSidebarWidget.prototype */
      return {
        /** @lends classes.ApplicationHostSidebarWidget */
        $static: {
          displayChangedEvent: "displayChanged"
        },
        __name: "ApplicationHostSidebarWidget",
        _resizerElement: null,
        _dragHandle: null,
        _sidebarToggle: null,
        /**
         * For mobile only
         */
        _screenOrientation: null,
        /**
         * @type ?number
         */
        _resizeHandle: null,
        _origin: null,
        _titleElement: null,
        _titleTextElement: null,
        /**
         * @type ?number
         */
        _currentSize: null,
        _initElement: function() {
          this._ignoreLayout = true;
          this._currentSize = cls.Size.translate(context.constants.theme["gbc-sidebar-default-width"]);
          $super._initElement.call(this);
          this._titleElement = this._element.getElementsByClassName("mt-sidebar-title")[0];
          this._titleTextElement = this._element.getElementsByClassName("mt-sidebar-title-text")[0];

          this._sidebarToggle = this._element.getElementsByClassName("mt-sidebar-toggle")[0];
          this._sidebarToggle.on("click.ApplicationHostMenuWidget", this._onClick.bind(this));

          this._element.on("transitionend.ApplicationHostSidebarWidget", this._onTransitionEnd.bind(this));
          this._element.on("oTransitionend.ApplicationHostSidebarWidget", this._onTransitionEnd.bind(this));
          this._element.on("webkitTransitionend.ApplicationHostSidebarWidget", this._onTransitionEnd.bind(this));

          this._resizerElement = this._element.getElementsByClassName("resizer")[0];
          this._dragHandle = this._resizerElement.getElementsByClassName("firefox_placekeeper")[0];
          this._resizerElement.setAttribute("draggable", "true");
          this._resizerElement.on("dragstart.ApplicationHostSidebarWidget", this._onDragStart.bind(this));
          this._resizerElement.on("dragend.ApplicationHostSidebarWidget", this._onDragEnd.bind(this));
          this._resizerElement.on("drag.ApplicationHostSidebarWidget", this._onDrag.throttle(5).bind(this));
          if (window.browserInfo.isIE || window.browserInfo.isEdge) {
            this._resizerElement.on("mousedown.ApplicationHostSidebarWidget", function() {
              this._resizerElement.style.opacity = 0;
            }.bind(this));
            this._resizerElement.on("mouseup.ApplicationHostSidebarWidget", function() {
              this._resizerElement.style.opacity = "";
            }.bind(this));
          }
          window.addEventListener("resize", this.updateResizeTimer.bind(this));

          this._element.onSwipe('ApplicationHostSidebarWidget', this._onSwipe.bind(this), {
            direction: "left",
            swipeEnd: true,
            debounce: true
          });

        },
        _initLayout: function() {
          // no layout
        },
        _onClick: function() {
          this.emit(cls.ApplicationHostMenuWidget.toggleClickEvent);
        },
        updateResizeTimer: function() {
          // for mobiles, only relayout on screen orientation
          if (!window.isMobile() || this._screenOrientation !== window.orientation) {
            this._screenOrientation = window.orientation;
            window.clearTimeout(this._resizeHandle);
            this._resizeHandle = window.setTimeout(this.updateResize.bind(this, null, false), 100);
          }
        },
        updateResize: function(deltaX, absolute) {
          var previousSize = this._currentSize;

          var max = cls.Size.translate(gbc.constants.theme["gbc-sidebar-max-width"]);
          if (absolute) {
            this._currentSize = deltaX;
          } else {
            this._currentSize = (Object.isNumber(this._origin) ? this._origin : this._currentSize) + (deltaX || 0);
            if (this._currentSize < 16) {
              this._currentSize = 16;
            }
          }
          if (this._currentSize > max) {
            this._currentSize = max;
          }
          if (!this.isAlwaysVisible()) {
            this.getParentWidget().setCentralContainerPosition(0);
          } else {
            this.getParentWidget().setCentralContainerPosition(this._currentSize);
          }
          // if sidebar size or visibility changed, we emit displayChangedEvent
          if (this._currentSize !== previousSize) {
            // if sidebar size changed only, we update size
            this.setStyle({
              width: this._currentSize + "px"
            });
            // Save sidebar width into storedSettings
            gbc.StoredSettingsService.setSideBarwidth(this._currentSize);
          }
          this.emit(cls.ApplicationHostSidebarWidget.displayChangedEvent);
        },
        /**
         *
         * @returns {classes.ApplicationHostWidget}
         */
        getParentWidget: function() {
          return $super.getParentWidget.call(this);
        },

        setParentWidget: function(widget) {
          $super.setParentWidget.call(this, widget);
          var sidebarwidth = gbc.StoredSettingsService.getSideBarwidth();
          if (sidebarwidth) {
            this._origin = !!this._origin ? this._origin : sidebarwidth;
            this.updateResize(sidebarwidth, true);
          }
        },

        setDisplayed: function(displayed) {
          this.getElement().toggleClass("mt-sidebar-displayed", !!displayed);
        },

        setUnavailable: function(unavailable) {
          this.getElement().toggleClass("mt-sidebar-unavailable", !!unavailable);
        },

        _onTransitionEnd: function(evt) {
          if (evt.target.hasClass("mt-sidebar")) {
            var positionUpdated = this.getParentWidget().setCentralContainerPosition(!this.isAlwaysVisible() ? 0 : this._currentSize);
            if (positionUpdated) {
              this.emit(cls.ApplicationHostSidebarWidget.displayChangedEvent);
            }
          }
        },
        getCurrentSize: function() {
          return this._currentSize;
        },
        getTitle: function() {
          return this._titleTextElement.textContent;
        },
        setTitle: function(title) {
          this._titleTextElement.textContent = title;
        },
        onDisplayChanged: function(hook) {
          return this.when(cls.ApplicationHostSidebarWidget.displayChangedEvent, hook);
        },

        _onDragOver: function(evt) {
          this._pageX = evt.clientX || evt.screenX || evt.pageX;
          evt.preventDefault();
        },
        _onDragStart: function(evt) {
          document.body.on("dragover.ApplicationHostSidebarWidget", this._onDragOver.bind(this));
          this._isDragging = true;
          if (window.browserInfo.isFirefox) {
            evt.dataTransfer.setData('text', ''); // for Firefox compatibility
          }
          if (evt.dataTransfer.setDragImage) {
            evt.dataTransfer.setDragImage(this._dragHandle, 0, 0);
          }
          evt.dataTransfer.effectAllowed = "move";
          this._pageX = this._resizerDragX = evt.clientX || evt.screenX || evt.pageX;
          this._origin = this._currentSize;
        },
        _onDragEnd: function(evt) {
          document.body.off("dragover.ApplicationHostSidebarWidget");
          this._isDragging = false;
          this._origin = this._currentSize;
          // Save sidebar width into storedSettings
          gbc.StoredSettingsService.setSideBarwidth(this._currentSize);
        },
        _onDrag: function(evt) {
          if (this._isDragging) {
            var deltaX = this._pageX - this._resizerDragX;
            this.updateResize(deltaX);

          }
        },
        isAlwaysVisible: function() {
          return window.matchMedia(
            "screen and (min-width: " + gbc.constants.theme["gbc-sidebar-always-visible-min-width"] + ")"
          ).matches;
        },

        setActiveWindow: function(win) {
          var sidebarSessionsItems = this.getChildren();
          for (var a = 0; a < sidebarSessionsItems.length; a++) {
            var sidebarSessionsItem = sidebarSessionsItems[a];
            var sidebarAppItems = sidebarSessionsItem.getChildren();
            for (var w = 0; w < sidebarAppItems.length; w++) {
              var sidebarAppItem = sidebarAppItems[w];
              sidebarAppItem._element.removeClass('activeWindow');
              var sidebarWinItems = sidebarAppItem.getChildren();
              for (var s = 0; s < sidebarWinItems.length; s++) {
                var sidebarWinItem = sidebarWinItems[s];
                var isActiveWindow = sidebarWinItem._windowWidget === win;
                sidebarWinItem._element.toggleClass('visibleWindow', isActiveWindow);
                if (isActiveWindow) {
                  sidebarAppItem._element.addClass('activeWindow');
                }
              }
            }
          }
        },
        setTitleText: function(text) {
          if (this._titleTextElement) {
            this._titleTextElement.textContent = text;
          }
        },

        _onSwipe: function(evt, distance) {
          this.emit(cls.ApplicationHostMenuWidget.toggleClickEvent);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostSidebar', cls.ApplicationHostSidebarWidget);
  });
