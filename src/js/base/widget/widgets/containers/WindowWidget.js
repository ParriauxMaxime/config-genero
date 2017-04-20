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

modulum('WindowWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for widgets.
     * @class classes.WindowWidget
     * @extends classes.WidgetGroupBase
     */
    cls.WindowWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.WindowWidget.prototype */
      return {
        __name: "WindowWidget",
        /**
         * @type {classes.ModalWidget}
         */
        _modalWidget: null,

        /**
         * title
         * @type {string}
         */
        _text: null,
        _image: null,
        /** @type {classes.SessionSidebarWindowItemWidget} */
        _sidebarItemWidget: null,
        /** @type {classes.TopMenuWidget} */
        _topMenuWidget: null,
        /** @type {classes.MenuWidget} */
        _menuWidget: null,
        /** @type {classes.ToolBarWidget} */
        _toolBarWidget: null,
        /** @type {classes.ApplicationHostMenuWindowCloseWidget} */
        _closeHostMenuWidget: null,
        _closeHostMenuOnClickHandler: null,
        _topContainer: null,
        _toolBarContainer: null,
        _windowContent: null,
        _windowMenuContainerRight: null,
        _toolBarPosition: "top",
        _startMenuType: null,
        _actionsEnabled: false,
        _disabled: false,
        _hasWebcomp: false,
        _position: null,

        /**
         * @type {Boolean}
         */
        isModal: false,

        constructor: function(opts) {
          $super.constructor.call(this, opts);
          this._sidebarItemWidget = cls.WidgetFactory.create("SessionSidebarWindowItem");
          this._sidebarItemWidget.setWindowWidget(this);
          this._sidebarItemWidget.onClose(this.emit.bind(this, context.constants.widgetEvents.close));
          this._closeHostMenuWidget = cls.WidgetFactory.create("ApplicationHostWindowCloseMenu");
          this._closeHostMenuOnClickHandler = this._closeHostMenuWidget.onClick(this.emit.bind(this, context.constants.widgetEvents
            .close));

          this._topContainer = this._element.getElementsByClassName("gbc_WindowMenuContainerTop")[0];
          this._toolBarContainer = this._element.getElementsByClassName("gbc_WindowToolbarContainer")[0];
          this._windowContent = this._element.getElementsByClassName("gbc_WindowContent")[0];
          this._windowMenuContainerRight = this._element.getElementsByClassName("gbc_WindowMenuContainerRight")[0];

          context.HostService.getApplicationHostWidget().getMenu().addChildWidget(this._closeHostMenuWidget);
        },

        destroy: function() {
          this._position = null;
          if (context.HostService.getCurrentWindow() === this) {
            context.HostService.setCurrentWindow(null);
          }
          if (this.getParentWidget()._activeWindow === this) {
            this.getParentWidget()._activeWindow = null;
          }
          if (this._modalWidget) {
            this._modalWidget.hide();
            this._modalWidget.destroy();
            this._modalWidget = null;
          }
          this._topContainer = null;
          this._toolBarContainer = null;
          this._windowContent = null;
          this._windowMenuContainerRight = null;
          context.HostService.getApplicationHostWidget().getMenu().removeChildWidget(this._closeHostMenuWidget);
          if (this._closeHostMenuOnClickHandler) {
            this._closeHostMenuOnClickHandler();
          }
          this._closeHostMenuWidget.destroy();
          this._closeHostMenuWidget = null;
          $super.destroy.call(this);

          this._sidebarItemWidget.destroy();
          this._sidebarItemWidget = null;

          gbc.InitService.emit(gbc.constants.widgetEvents.onBeforeUnload); // Store stored settings before leaving

        },
        /**
         * @param {string} text window title
         */
        setText: function(text) {
          this._text = text;
          if (this._modalWidget) {
            this._modalWidget.setHeader(text);
          }
        },

        /**
         * @returns {string} window title
         */
        getText: function() {
          return this._text;
        },

        setImage: function(image) {
          this._image = image;
          this.getSidebarWidget().setWindowIcon(image);
          if (this._modalWidget) {
            this._modalWidget.setImage(image);
          }
        },

        getImage: function() {
          return this._image;
        },

        unfreeze: function() {
          this._disabled = false;
          this.enableActions();
          if (this._modalWidget) {
            this._modalWidget._element.removeClass("hidden");
          }
          //this._element.removeClass("frozenWindow");
          this._sidebarItemWidget.setFrozen(false);
          this._shouldShowOrHideGlobalToolBar();
        },
        freeze: function() {
          this._disabled = true;
          this.disableActions();
          /*if (this._element) {
           this._element.addClass("frozenWindow");
           }*/
          if (this._sidebarItemWidget) {
            this._sidebarItemWidget.setFrozen(true);
          }
          if (this._modalWidget) {
            this._modalWidget._element.addClass("hidden");
          }

        },

        /**
         * @param hidden {boolean} true if the widget is hidden, false otherwise
         */
        setHidden: function(hidden) {
          if (this._modalWidget) {
            this._modalWidget.hide();
          }
          if (this._topMenuWidget) {
            this._topMenuWidget.setHidden(hidden);
          }
          if (this._toolBarWidget) {
            this._toolBarWidget.setHidden(hidden || this._toolBarPosition === "none");
          }
          this.getLayoutEngine().changeHidden(hidden);
        },

        /**
         * Defines the menu to be displayed as a modal one
         */
        setAsModal: function() {
          if (!this._modalWidget) {
            this._modalWidget = cls.WidgetFactory.create("Modal");
            this._modalWidget.addClass('gbc_ModalWindowDialog');
            this.getParentWidget().getContainerElement().appendChild(this._modalWidget.getElement());
          }
          this._modalWidget.setHeader(this.getText());
          this._modalWidget.setImage(this.getImage());
          this._modalWidget.setClosable(this._actionsEnabled);
          this._modalWidget.setUiWidget(this._uiWidget);

          if (this._actionsEnabled) {
            this._modalWidget._closeButton.on("click.ModalWidget", function() {
              this._closeHostMenuWidget._onClick();
            }.bind(this));
          }

          this._modalWidget.setContent(this.getElement());
          this.isModal = true;
          window.requestAnimationFrame(function() {
            this._modalWidget.show();
          }.bind(this));
          return this._modalWidget;
        },

        getModal: function() {
          return this._modalWidget;
        },

        getWindowContent: function() {
          return this._windowContent;
        },

        getWindowMenuContainerRight: function() {
          return this._windowMenuContainerRight;
        },

        /**
         * Set position of the window based on position 4ST attribute.
         * At the moment, only a modal window will be affected by this attribute, a normal window is always displayed full screen.
         * For the modal window, by default it's centered. If 4ST is set to 'field', pos parameter is referent widget.
         * @param pos {string|classes.WidgetBase}
         */
        setPosition: function(pos) {
          var cssPos = {};
          if (!pos || typeof(pos) === "string") {
            if (this._modalWidget && !this._modalWidget.hasClass("centered")) {
              this._modalWidget.addClass("centered");
              cssPos.top = "0";
              cssPos.left = "0";
              cssPos.right = "auto";
              this._modalWidget.setStyle(">.mt-dialog-pane", cssPos);
            }
          } else { // setting position to field without having windowType to modal makes no sense, it's considered as modal by GDC but not by HTMLv1. Let's do same that HTMLv1 for simplicity reason.
            if (this._modalWidget) {
              if (pos) { // update css of modal widget
                this._modalWidget.removeClass("centered");
                var rect = pos.getElement().getBoundingClientRect();
                var sidebar = this.getSidebarWidget().getSidebar();
                var sidebarSize = sidebar && sidebar.isAlwaysVisible() ? sidebar.getCurrentSize() : 0;
                var left = rect.left + document.body.scrollLeft - sidebarSize;
                if (this.isReversed()) {
                  left = document.body.clientWidth - rect.right;
                }
                var poffset = {
                  top: rect.top + document.body.scrollTop,
                  left: left
                };
                cssPos.top = poffset.top - 8 + "px";
                if (this.isReversed()) {
                  cssPos.right = poffset.left + "px";
                  cssPos.left = "auto";
                } else {
                  cssPos.left = poffset.left + "px";
                  cssPos.right = "auto";
                }
              }
              this._modalWidget.setStyle(">.mt-dialog-pane", cssPos);
            }
          }
        },

        /**
         * @returns {boolean} true if the widget is hidden, false otherwise
         */
        isHidden: function() {
          return !this._element || this._element.hasClass("windowHidden");
        },
        getSidebarWidget: function() {
          return this._sidebarItemWidget;
        },
        onClose: function(hook) {
          this.when(gbc.constants.widgetEvents.close, hook);
        },
        setClosable: function(closable) {
          this._sidebarItemWidget.setClosable(closable);
          this._closeHostMenuWidget.setActive(closable);
        },
        enableActions: function() {
          this._closeHostMenuWidget.setHidden(false);
          this._actionsEnabled = true;
        },
        disableActions: function() {
          if (this._closeHostMenuWidget) {
            this._closeHostMenuWidget.setHidden(true);
            this._actionsEnabled = false;
          }
        },

        setBackgroundImage: function(path) {
          if (path) {
            this.setStyle({
              "background-image": "url('" + path + "')"
            });
          } else {
            this.setStyle({
              "background-image": null
            });
          }
        },

        /**
         * @param {classes.TopMenuWidget} topMenu
         */
        addTopMenu: function(topMenu, order, topMenuContainer) {
          this.addChildWidget(topMenu, {
            noDOMInsert: true
          });
          this._topMenuWidget = topMenu;
          if (topMenuContainer !== this) {
            topMenuContainer.addTopMenu(this._topMenuWidget, order);
          } else {
            this._topContainer.appendChild(this._topMenuWidget.getElement());
          }
          this._topMenuWidget.setHidden(!this.isVisible());
        },
        removeTopMenu: function(topMenu) {
          if (this._topMenuWidget === topMenu) {
            this._topMenuWidget = null;
          }
        },
        addToolBar: function(toolBar, order, toolBarContainer) {
          this.addChildWidget(toolBar, {
            noDOMInsert: true
          });
          this._toolBarWidget = toolBar;
          if (toolBarContainer !== this) {
            toolBarContainer.addToolBar(this._toolBarWidget, order);
          } else {
            this._toolBarContainer.appendChild(this._toolBarWidget.getElement());
          }
          this._toolBarWidget.setHidden(!this.isVisible() || this._toolBarPosition === "none");
        },
        removeToolBar: function(toolBar) {
          if (this._toolBarWidget === toolBar) {
            this._toolBarWidget = null;
          }
        },
        addMenu: function(widget) {
          this._menuWidget = widget;
          this.addChildWidget(widget, {
            noDOMInsert: true
          });
        },

        setToolBarPosition: function(position) {
          // only TOP and NONE value are supported
          if (this._toolBarPosition !== position) {
            this._toolBarPosition = position;
            var visible = (position !== "none");

            if (this._toolBarWidget) {
              this._toolBarWidget.setHidden(!visible);
            }

            this._shouldShowOrHideGlobalToolBar();
          }
        },

        // HACK GBC-605 if window has style toolBarPosition === none --> global toolbar should be hidden
        _shouldShowOrHideGlobalToolBar: function() {
          if (this.getParentWidget() && this.getParentWidget()._toolBarContainer) {
            var toolBarHidden = (this._toolBarPosition === "none") && !this.isModal;
            if (toolBarHidden) {
              this.getParentWidget()._toolBarContainer.addClass("hidden");
            } else {
              this.getParentWidget()._toolBarContainer.removeClass("hidden");
            }
          }
        },

        setStartMenuType: function(type) {
          this._startMenuType = type;
        },

        getStartMenuType: function() {
          return this._startMenuType;
        },

        setHasWebComponent: function(has) {
          this._hasWebcomp = has;
        },

        hasWebComponent: function() {
          return this._hasWebcomp; // Tell window that it has a webcomp
        },
        _setProcessingStyle: function(processing) {
          if (this._closeHostMenuWidget && this._closeHostMenuWidget._setProcessingStyle) {
            this._closeHostMenuWidget._setProcessingStyle(processing);
          }
        }

      };
    });
    cls.WidgetFactory.register('Window', cls.WindowWidget);
  });
