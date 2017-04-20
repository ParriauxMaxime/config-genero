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

modulum('ApplicationHostMenuWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationHostMenuWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ApplicationHostMenuWidget.prototype */
      return {
        __name: "ApplicationHostMenuWidget",
        _windowIconImage: null,
        _hasWindowIcon: false,
        _titleElement: null,
        _defaultTitle: "Genero Browser Client",

        /** @lends classes.ApplicationHostMenuWidget */
        $static: {
          toggleClickEvent: "g_toggleClick"
        },
        /**
         * @type {Element}
         */
        _sidebarToggle: null,
        _aboutMenu: null,
        _debugMenu: null,
        _settingsMenu: null,
        _runtimeStatus: null,
        _uploadStatus: null,
        _toggleSettings: null,
        _sidebarBackdrop: null,
        _barsContainerZindex: 0,

        constructor: function() {
          $super.constructor.call(this);
          this._createMenuItems();
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._sidebarToggle.off("click.ApplicationHostMenuWidget");
          this._destroyMenuItems();

          if (this._toggleSettings) {
            this._toggleSettings.off("click.ApplicationHostMenuWidgetSettings", this._toggleSettingsBar.bind(this));
            this._element.querySelector(".mt-actions").offSwipe("MenuWidgetSettings", "right");
          }

          if (this._windowIconImage) {
            this._windowIconImage.destroy();
            this._windowIconImage = null;
          }
          $super.destroy.call(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._sidebarToggle = this._element.getElementsByClassName("mt-sidebar-toggle")[0];
          this._sidebarToggle.on("click.ApplicationHostMenuWidget", this._onClick.bind(this));
          if (!this._titleElement) {
            this._titleElement = this._element.getElementsByClassName("currentDisplayedWindow")[0];
            this.setText();
          }

          this._toggleSettings = this._element.querySelector(".mt-sidebar-action-toggle");
          if (this._toggleSettings) {
            this._toggleSettings.on("click.ApplicationHostMenuWidgetSettings", this._toggleSettingsBar.bind(this));
            this._element.querySelector(".mt-actions").onSwipe("MenuWidgetSettings", this._closeSettingsBar.bind(this), {
              direction: "right",
              swipeEnd: true,
              debounce: true
            });
          }
        },

        _createMenuItems: function() {
          this._uploadStatus = cls.WidgetFactory.create('ApplicationHostUploadsMenu');
          this.addChildWidget(this._uploadStatus);
          this._runtimeStatus = cls.WidgetFactory.create('ApplicationHostMenuRuntime');
          this.addChildWidget(this._runtimeStatus);
          this._aboutMenu = cls.WidgetFactory.create('ApplicationHostAboutMenu');
          this.addChildWidget(this._aboutMenu);
          this._settingsMenu = cls.WidgetFactory.create('ApplicationHostSettingsMenu');
          this.addChildWidget(this._settingsMenu);
          //debug
          this._proxyLogMenu = cls.WidgetFactory.create('ApplicationHostMenuProxyLog');
          this.addChildWidget(this._proxyLogMenu);
          this._vmLogMenu = cls.WidgetFactory.create('ApplicationHostMenuVmLog');
          this.addChildWidget(this._vmLogMenu);
          this._runInGwcMenu = cls.WidgetFactory.create('ApplicationHostMenuRunInGwc');
          this.addChildWidget(this._runInGwcMenu);
          this._runInGdcMenu = cls.WidgetFactory.create('ApplicationHostMenuRunInGdc');
          this.addChildWidget(this._runInGdcMenu);
          this._debugMenu = cls.WidgetFactory.create('ApplicationHostDebugMenu');
          this.addChildWidget(this._debugMenu);
        },

        _destroyMenuItems: function() {
          this._destroyMenuItem(this._runtimeStatus);
          this._runtimeStatus = null;
          this._destroyMenuItem(this._proxyLogMenu);
          this._proxyLogMenu = null;
          this._destroyMenuItem(this._vmLogMenu);
          this._vmLogMenu = null;
          this._destroyMenuItem(this._runInGwcMenu);
          this._runInGwcMenu = null;
          this._destroyMenuItem(this._runInGdcMenu);
          this._runInGdcMenu = null;
          this._destroyMenuItem(this._aboutMenu);
          this._aboutMenu = null;
          this._destroyMenuItem(this._debugMenu);
          this._debugMenu = null;
          this._destroyMenuItem(this._settingsMenu);
          this._settingsMenu = null;
          this._destroyMenuItem(this._uploadStatus);
          this._uploadStatus = null;
        },

        _destroyMenuItem: function(item) {
          if (item) {
            this.removeChildWidget(item);
            item.destroy();
          }
        },

        _onClick: function() {
          this.emit(cls.ApplicationHostMenuWidget.toggleClickEvent);
        },

        _toggleSettingsBar: function() {
          this._sidebarBackdrop = this._element.querySelector(".mt-sidebar-backdrop");

          if (this._toggleSettings.hasClass("open")) {
            this._toggleSettings.removeClass("open");
            this._sidebarBackdrop.removeClass("mt-sidebar-displayed");
            this._element.querySelector(".mt-actions").removeClass("open");
            this._parentWidget._element.querySelector(".gbc_barsContainer").style["z-index"] = this._barsContainerZindex;
            this._sidebarBackdrop.off("click.rightSidebar");
          } else {
            this._toggleSettings.addClass("open");
            this._element.querySelector(".mt-actions").addClass("open");
            this._barsContainerZindex = this._parentWidget._element.querySelector(".gbc_barsContainer").style["z-index"];
            this._parentWidget._element.querySelector(".gbc_barsContainer").style["z-index"] = "0";
            this._sidebarBackdrop.addClass("mt-sidebar-displayed");
            this._sidebarBackdrop.on("click.rightSidebar", this._toggleSettingsBar.bind(this));
          }
        },

        _closeSettingsBar: function() {
          if (this._toggleSettings.hasClass("open")) {
            this._toggleSettings.removeClass("open");
            this._element.querySelector(".mt-actions").removeClass("open");
          }
        },

        setSidebarUnavailable: function(unavailable) {
          this._sidebarToggle.toggleClass("mt-sidebar-unavailable", !!unavailable);
        },
        setText: function(title) {
          if (title) {
            this._titleElement.innerHTML = title;
          } else {
            this._titleElement.innerHTML = this._defaultTitle;
          }
        },
        setIcon: function(image, appIcon) {
          if (image && image !== "") {
            if (!appIcon) { // set global icon using app icon only if not previously set with window icon
              this._hasWindowIcon = true;
            } else if (this._hasWindowIcon === true) {
              return;
            }
            this._element.getElementsByClassName('zmdi')[0].addClass('hidden');
            if (!this._windowIconImage) {
              this._windowIconImage = cls.WidgetFactory.create("Image");
              this._sidebarToggle.appendChild(this._windowIconImage.getElement());
            }
            this._windowIconImage.setSrc(image);
            this._windowIconImage.setAlignment("verticalCenter", "horizontalCenter");
            this._windowIconImage.setHidden(false);
          } else {
            this._element.getElementsByClassName('zmdi')[0].removeClass('hidden');
            if (this._windowIconImage) {
              this._windowIconImage.setHidden(true);
            }
          }
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostMenu', cls.ApplicationHostMenuWidget);
  });
