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

modulum('ApplicationHostWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationHostWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ApplicationHostWidget.prototype */
      return {
        __name: "ApplicationHostWidget",
        /**
         * @type {classes.ApplicationHostSidebarWidget}
         */
        _sidebar: null,
        /**
         * @type {classes.ApplicationHostSidebarBackdropWidget}
         */
        _sidebarBackdrop: null,
        /**
         * @type {classes.ApplicationHostMenuWidget}
         */
        _menu: null,
        /**
         * left css position of the container
         * @type {number=}
         */
        _position: null,
        /**
         * @type {Element}
         */
        _centralContainer: null,
        _launcher: null,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
        },

        _initLayout: function() {
          // no layout
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._centralContainer = this._element.firstElementChild;
          this._sidebar = cls.WidgetFactory.create('ApplicationHostSidebar');
          this._sidebar.setParentWidget(this);
          this._sidebar.onDisplayChanged(this._onDisplayedChanged);
          this._element.prependChild(this._sidebar.getElement());
          this._sidebarBackdrop = cls.WidgetFactory.create('ApplicationHostSidebarBackdrop');
          this._sidebarBackdrop.setParentWidget(this);
          this._element.appendChild(this._sidebarBackdrop.getElement());
          this._menu = cls.WidgetFactory.create('ApplicationHostMenu');
          this._menu.setParentWidget(this);
          this._containerElement.parentNode.insertBefore(this._menu.getElement(), this._containerElement);
          this._menu.when(cls.ApplicationHostMenuWidget.toggleClickEvent, this._showSidebar.bind(this));
          this._sidebar.when(cls.ApplicationHostMenuWidget.toggleClickEvent, this._hideSidebar.bind(this));
          this._sidebarBackdrop.onClick(this._hideSidebar.bind(this));
          this._launcher = cls.WidgetFactory.create('ApplicationLauncher');
          this._launcher.setHidden(true);
          this.addChildWidget(this._launcher);
        },
        destroy: function() {
          this._sidebar.destroy();
          this._sidebarBackdrop.destroy();
          this._menu.destroy();
          this._launcher.destroy();
          this._centralContainer = null;
          $super.destroy.call(this);
        },
        getLauncher: function() {
          return this._launcher;
        },

        /**
         *
         * @returns {classes.ApplicationHostSidebarWidget}
         */
        getSideBar: function() {
          return this._sidebar;
        },
        getMenu: function() {
          return this._menu;
        },
        getCentralContainerPosition: function() {
          return this._position;
        },
        /**
         *
         * @param position
         * @returns {boolean} true if position has changed
         */
        setCentralContainerPosition: function(position) {
          if (position !== this._position) {
            this._position = position;
            this._centralContainer.style.left = position + "px";
            return true;
          } else {
            return false;
          }
        },
        _showSidebar: function() {
          this._sidebar.setDisplayed(true);
          this._sidebarBackdrop.setDisplayed(true);
          //Save it to the stored settings
          gbc.StoredSettingsService.setSideBarVisible(true);
        },
        _hideSidebar: function() {
          this._sidebar.setDisplayed(false);
          this._sidebarBackdrop.setDisplayed(false);
          //Save it to the stored settings
          gbc.StoredSettingsService.setSideBarVisible(false);
        },
        enableSidebar: function(enable) {
          if (!gbc.StoredSettingsService.isSideBarVisible()) {
            this._sidebar.setUnavailable(!enable);
            this._sidebarBackdrop.setUnavailable(!enable);
            this._menu.setSidebarUnavailable(!enable);
            this._centralContainer.toggleClass("mt-sidebar-unavailable", !enable);
            this._hideSidebar();
          } else {
            this._showSidebar();
          }
        },
        _onDisplayedChanged: function() {
          var app = context.SessionService.getCurrent() && context.SessionService.getCurrent().getCurrentApplication();
          if (app && app.layout) {
            app.layout.refreshLayout({
              resize: true
            });
          }
        }

      };
    });
    cls.WidgetFactory.register('ApplicationHost', cls.ApplicationHostWidget);
  });
