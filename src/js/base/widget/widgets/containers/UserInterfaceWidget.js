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

modulum('UserInterfaceWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * UserInterface widget.
     * @class classes.UserInterfaceWidget
     * @extends classes.WidgetGroupBase
     */
    cls.UserInterfaceWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.UserInterfaceWidget.prototype */
      return {
        __name: "UserInterfaceWidget",

        $static: {
          startMenuPosition: 'gStartMenuPosition'
        },

        _text: "",
        _image: null,
        _topMenuContainer: null,
        _toolBarContainer: null,
        _startMenuContainer: null,
        _sidebarWidget: null,
        _traditionalWindowContainer: null,
        /** @type {number} */
        _currentWindowIdRef: null,
        /** @type {classes.WidgetBase} */
        _focusedWidget: null,
        _dbDate: "MDY4/", // default format
        _unBindLayoutHandler: null,
        _activeWindow: null,
        /**
         * Typeahead
         */
        _isBufferingKeys: null,

        constructor: function() {
          $super.constructor.call(this);
          this._topMenuContainer = this._element.getElementsByClassName("gbc_topMenuContainer")[0];
          this._toolBarContainer = this._element.getElementsByClassName("gbc_toolBarContainer")[0];
          this._startMenuContainer = this._element.getElementsByClassName("gbc_startMenuContainer")[0];
        },
        destroy: function() {
          this._topMenuContainer = null;
          this._toolBarContainer = null;
          if (this._unBindLayoutHandler) {
            this._unBindLayoutHandler();
            this._unBindLayoutHandler = null;
          }
          $super.destroy.call(this);
        },
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.UserInterfaceLayoutEngine(this);
          this._unBindLayoutHandler = this._layoutEngine.onLayoutApplied(this._onLayoutApplied.bind(this));
        },
        _onLayoutApplied: function() {
          if (this.getContainerElement().children.length > 1) {
            for (var i = 0; i < this.getChildren().length; i++) {
              var current = this.getChildren()[i];
              if (this._canBeRemoved(current)) {
                current.getElement().remove();
              }
            }
          }

          if (this._unBindLayoutHandler) {
            this._unBindLayoutHandler();
            this._unBindLayoutHandler = null;
          }
        },

        _canBeRemoved: function(widget) {
          return widget instanceof cls.WindowWidget &&
            (context.HostService.getCurrentWindow() &&
              widget !== context.HostService.getCurrentWindow()) &&
            !widget._forceVisible;
        },

        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        setSidebarWidget: function(widget) {
          this._sidebarWidget = widget;
        },

        setTypeahead: function(active) {
          this._isBufferingKeys = active;
        },

        isTypeaheadActive: function() {
          return this._isBufferingKeys;
        },
        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          $super.addChildWidget.call(this, widget, options);
          if (widget instanceof cls.WindowWidget && !!this.getSidebarWidget()) {
            this.getSidebarWidget().addChildWidget(widget.getSidebarWidget());
          }
          this._syncCurrentWindow();
        },

        removeChildWidget: function(widget) {
          if (widget instanceof cls.WindowWidget && !!this.getSidebarWidget()) {
            this.getSidebarWidget().removeChildWidget(widget.getSidebarWidget());
          }
          $super.removeChildWidget.call(this, widget);
        },

        addTopMenu: function(widget, order) {
          widget.setOrder(order);
          if (widget.getParentWidget() === null) {
            this.addChildWidget(widget, {
              noDOMInsert: true
            });
          }
          this._topMenuContainer.appendChild(widget.getElement());
        },

        addStartMenu: function(widget) {
          this._startMenuContainer.appendChild(widget.getElement());
        },

        addToolBar: function(widget, order, container) {
          if (container && container.__name === "UserInterfaceWidget") {
            widget.addClass("globalToolbar");
          }
          console.log(container);
          widget.setOrder(order);
          if (widget.getParentWidget() === null) {
            this.addChildWidget(widget, {
              noDOMInsert: true
            });
          }
          this._toolBarContainer.appendChild(widget._element);
        },
        /**
         * Sets the current window
         * @param {classes.WindowWidget} window the window to set as current
         */
        setCurrentWindowId: function(windowIdRef) {
          var currentChanged = this._currentWindowIdRef !== windowIdRef;
          if (currentChanged) {
            this._currentWindowIdRef = windowIdRef;
          }
          this._syncCurrentWindow();
        },

        _syncCurrentWindow: function() {
          var currentWin = this.getCurrentWindow();
          if (currentWin) {

            currentWin._sidebarItemWidget.setCurrent();
            context.HostService.setDisplayedWindow(currentWin);

            this.getLayoutEngine().invalidateAllocatedSpace();
            this.emit(cls.UserInterfaceWidget.startMenuPosition, currentWin._auiTag);
          }
        },
        /**
         * @returns {classes.WindowWidget} the current window
         */
        getCurrentWindow: function() {
          var i;
          var win = null;
          for (i = 0; i < this.getChildren().length; ++i) {
            win = this.getChildren()[i];
            if (!!this._currentWindowIdRef && win._auiTag === this._currentWindowIdRef) {
              return win;
            }
          }
          // If no window has been found, return the traditional window container
          for (i = 0; i < this.getChildren().length; ++i) {
            win = this.getChildren()[i];
            if (win.hasClass("gbc_TraditionalContainerWindow")) {
              return win;
            }
          }
          return null;
        },
        /**
         *
         * @param {classes.WidgetBase} widget which gains VM focus
         */
        setFocusedWidget: function(focusedWidget) {
          if (this._focusedWidget && this._focusedWidget !== focusedWidget) {
            if (this._focusedWidget.getElement()) {
              this._focusedWidget.getElement().removeClass("gbc_Focus");
            }
            this._focusedWidget.loseFocus();
          }
          if (!this._focusedWidget || this._focusedWidget !== focusedWidget) {
            this._focusedWidget = focusedWidget;
            this._focusedWidget.getElement().addClass("gbc_Focus");
          }
        },
        /**
         * @returns {classes.WidgetBase} current focused widget (by VM)
         */
        getFocusedWidget: function() {
          return this._focusedWidget;
        },
        /**
         * @param {String} text The window title
         */
        setText: function(text) {
          this._text = text;
        },
        /**
         * @returns {String} The window title
         */
        getText: function() {
          return this._text;
        },

        setImage: function(image) {
          this._image = image;
          this.getSidebarWidget().setApplicationIcon(image);
        },

        getImage: function() {
          return this._image;
        },

        getDbDateFormat: function() {
          return this._dbDate;
        },

        setDbDateFormat: function(format) {
          this._dbDate = format;
        },

        getTraditionalWindowContainer: function() {
          if (!this._traditionalWindowContainer) {
            this._traditionalWindowContainer = cls.WidgetFactory.create("TraditionalWindowContainer");
          }
          return this._traditionalWindowContainer;
        },

        removeTraditionalWindowContainer: function() {
          if (this._traditionalWindowContainer) {
            this.removeChildWidget(this._traditionalWindowContainer);
            this._traditionalWindowContainer = null;
          }
        },
        isLayoutTerminator: function() {
          return true;
        },
        activate: function() {
          this.emit(context.constants.widgetEvents.activate);
        },

        onActivate: function(hook) {
          return this.when(context.constants.widgetEvents.activate, hook);
        },
        onDisable: function(hook) {
          return this.when(context.constants.widgetEvents.disable, hook);
        }
      };
    });
    cls.WidgetFactory.register('UserInterface', cls.UserInterfaceWidget);
  });
