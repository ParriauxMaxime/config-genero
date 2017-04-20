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

modulum('HostService', ['InitService', 'DebugService', 'EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.HostService
     */
    context.HostService = context.oo.StaticClass( /** @lends gbc.HostService */ {
      __name: "HostService",
      /** @type classes.MainContainerWidget */
      _widget: null,
      /** @type classes.LogPlayerWidget */
      _logPlayer: null,
      _defaultTitle: "",
      /** @type classes.ApplicationHostWidget */
      _applicationHostWidget: null,
      /** @type classes.WindowWidget */
      _currentWindow: null,
      /** @type {Function[]} */
      _currentWindowChangesListeners: [],

      _eventListener: new cls.EventListener(),
      init: function() {
        var existingOnError = window.onerror;
        window.onerror = function(msg, file, line, col, error) {
          if (existingOnError) {
            existingOnError(msg, file, line, col, error);
          }
          context.HostService._eventListener.emit('error', error, msg, file, line, col);
          return false;
        };
      },

      isLogPlayerRequested: function() {
        var variables = window.location.search.substr(1).split("&");
        for (var i = 0; i < variables.length; ++i) {
          if (variables[i].indexOf("logplayer=") === 0) {
            return true;
          }
        }
        return false;
      },

      preStart: function() {
        if (!context.DebugService.isMonitorWindow()) {
          this._widget = cls.WidgetFactory.create("MainContainer");
          if (this.isLogPlayerRequested()) {
            this._logPlayer = cls.WidgetFactory.create("LogPlayer");
            this._logPlayer.addChildWidget(this._widget);
          }
          window.requestAnimationFrame(function() {
            var w = this._logPlayer ? this._logPlayer : this._widget;
            document.body.appendChild(w.getElement());
            if (this.isLogPlayerRequested()) {
              this.setSidebarAvailable(true);
            }
          }.bind(this));
          this._defaultTitle = document.title;
          this._applicationHostWidget = cls.WidgetFactory.create("ApplicationHost");
          this._widget.addChildWidget(this._applicationHostWidget);
        }
      },
      getWidget: function() {
        return this._widget;
      },

      /**
       *
       * @returns {classes.ApplicationHostWidget}
       */
      getApplicationHostWidget: function() {
        return this._applicationHostWidget;
      },

      getLogPlayer: function() {
        return this._logPlayer;
      },

      /**
       *
       * @param {boolean} enable
       */
      setSidebarAvailable: function(enable) {
        this._applicationHostWidget.enableSidebar(enable);
      },
      start: function() {
        var params = context.UrlService.currentUrl().getQueryStringObject();
        if (!!params.app || context.bootstrapInfo.appName) {
          context.SessionService.start(params.app || context.bootstrapInfo.appName);
        } else {
          this.displayNoSession();
        }
      },
      displaySession: function() {
        this._applicationHostWidget.getLauncher().setHidden(true);
      },
      displayNoSession: function() {
        this._applicationHostWidget.getLauncher().setHidden(false);
      },
      whenError: function(cb) {
        this._eventListener.when('error', cb);
      },
      wrapGlobalErrors: function() {
        this.whenError(function(error, msg, file, line, col) {
          context.error(error);
          console.error("======= error");
          return false;
        });
      },
      getCurrentWindow: function() {
        return this._currentWindow;
      },
      setCurrentWindow: function(win) {
        this._currentWindow = win;
      },

      /**
       * - Manage switch of window in the DOM depending of whether they are modal or not and having WebComponent or not.
       * - Display/hide topmenu & toolbars of active/inactive windows.
       * - Set window title
       * @param win
       */
      setDisplayedWindow: function(win) {
        // determine if switch of application occured using _currentWindow static variable
        var switchingApplication = (!this._currentWindow && !!win) || (!!win && !!this._currentWindow && win.getUserInterfaceWidget() !==
          this._currentWindow.getUserInterfaceWidget());

        if (!win) {
          return;
        }

        var session = context.SessionService.getCurrent(),
          app = session && session.getCurrentApplication();

        // If new window is a modal, we don't remove/insert it in DOM. Modal is fully managed by WindowTypeVMBehavior
        if (this._currentWindow) {
          this._currentWindow.freeze();
        }
        if (!!win) {
          // determine if in current application a switch of window occured
          // if only a switch of application occured without change of window in current app, we do nothing (application management done by SessionWidget did all the job)
          var currentUI = win.getUserInterfaceWidget();
          var previousWindow = currentUI._activeWindow;
          var appWindowChanged = previousWindow !== win;

          if ((switchingApplication || appWindowChanged && win) && !win.isModal) { // if app window changed and new active window isn't a modal, we add it to DOM

            // WebComponent Management
            if ((previousWindow && previousWindow.hasWebComponent()) || (win && win.hasWebComponent())) {
              // if window to remove has a webcomponent, just send it far away out of view, without removing it
              if (previousWindow && previousWindow.hasWebComponent()) {
                previousWindow.addClass("gbc_out_of_view");
                if (win && !win.hasWebComponent() && currentUI && currentUI.getContainerElement()) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              }
              // if window to be displayed has a webcomponent, just put it back in the view
              if (win && win.hasWebComponent()) {
                win.removeClass("gbc_out_of_view");
                if (!win.getElement().parentNode) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              }
              // if neighter previous and new window has WebComponent
            } else if (appWindowChanged && win && currentUI) {
              if (currentUI.getContainerElement()) {
                // if previous window wasn't a modal neither, we can safely remove it from DOM
                if (previousWindow && !previousWindow.isModal) {
                  currentUI.getContainerElement().removeChild(previousWindow.getElement());
                }
                if (win && !win.hasWebComponent()) {
                  currentUI.getContainerElement().appendChild(win.getElement());
                }
              }
              currentUI.activate(); // send activate signal to inform elements that window is append to DOM
            }
          } else if ((switchingApplication || appWindowChanged && win) && win.isModal) {
            var childrenWin = currentUI.getChildren();
            var nonModalPrevWin = null;
            var winIndex = childrenWin.indexOf(win);

            // Get the previous non modal window to display it
            for (winIndex; winIndex >= 0; winIndex--) {
              nonModalPrevWin = childrenWin[winIndex - 1];
              if (nonModalPrevWin && !nonModalPrevWin.isModal) {
                break;
              }
            }
            if (nonModalPrevWin && (nonModalPrevWin.hasWebComponent && !nonModalPrevWin.hasWebComponent())) {
              currentUI.getContainerElement().appendChild(nonModalPrevWin.getElement());
              nonModalPrevWin._forceVisible = true;
            }
          }

          // hide topmenu/toolbar of previous windows if none previous and new window are modal. In that case, topmenu/toolbar container is shared
          if (previousWindow && !previousWindow.isModal && win && !win.isModal) {
            if (previousWindow._topMenuWidget) {
              previousWindow._topMenuWidget.setHidden(true);
            }
            if (previousWindow._toolBarWidget) {
              previousWindow._toolBarWidget.setHidden(true);
            }
          }
          // display topmenu/toolbar of new current window
          if (win) {
            if (win._topMenuWidget) {
              win._topMenuWidget.setHidden(false);
            }
            if (win._toolBarWidget) {
              win._toolBarWidget.setHidden(false);
            }
          }

          this._currentWindow = win;
          currentUI._activeWindow = win;

          if (this._currentWindow) {
            this._currentWindow.unfreeze();
          }

          // if we switched of application we need to invalidate allocated space
          if (previousWindow && win && switchingApplication) {
            win.getUserInterfaceWidget().getLayoutEngine().invalidateAllocatedSpace();
          }
          // set current window title (icon + text) as application host menu title
          this.setCurrentTitle(win ? (win.getText() || win.getUserInterfaceWidget().getText()) : "");
          this.setCurrentIcon(win ? (win.getImage() || win.getUserInterfaceWidget().getImage()) : "");

          // execute listeners (used in ModelHelper only)
          for (var i = 0; i < this._currentWindowChangesListeners.length; ++i) {
            this._currentWindowChangesListeners[i](win);
          }
        }
        // need to refresh current application layout for potential background dynamic VM update
        app = session && session.getCurrentApplication();
        if (app) {
          if (app.dvm) {
            app.dvm.updateProcessingStatus();
          }
          app.layout.refreshLayout();
        }
      },
      setCurrentTitle: function(title) {
        this._applicationHostWidget.getMenu().setText(title);
        document.title = title ? title : this._defaultTitle;
      },
      setCurrentIcon: function(img, appIcon) {
        this._applicationHostWidget.getMenu().setIcon(img, appIcon);
      },
      unsetDisplayedWindow: function(win) {
        if (win && this._currentWindow === win) {
          this._currentWindow.disableActions();
        }
      }
    });
    context.InitService.register(context.HostService);
  });
