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

modulum("VMSession", ["EventListener"],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * A gas Session
     * @class classes.VMSession
     * @extends classes.EventListener
     */
    cls.VMSession = context.oo.Class(cls.EventListener, function($super) {
      /** @lends classes.VMSession.prototype */
      return {
        __name: "VMSession",
        /** @lends classes.VMSession */
        $static: {
          applicationAddedEvent: "applicationAdded",
          applicationRemovedEvent: "applicationRemoved",
          idleChangedEvent: "idleChanged",
          displayEndEvent: "displayEnd"
        },
        /**
         * @type {string=}
         */
        _identifier: null,
        _sessionId: null,
        /**
         * @type {classes.VMApplication[]}
         */
        _applications: null,
        _baseInfos: null,
        _closeHandler: null,
        _restartHandler: null,
        /**
         * @type {classes.SessionWidget}
         */
        _widget: null,
        _sidebarWidget: null,
        _bookmarkWidget: null,
        _applicationIdentifier: 0,
        _applicationQueue: null,

        _browserMultiPageMode: false,
        _browserMultiPageModeAsChild: false,
        _childrenWindows: null,

        _waitingNewTasks: 0,
        _showEnding: false,
        _flushingApplications: false,
        _flushingApplicationsListener: false,
        _unloadListener: false,
        _flushableApplications: null,

        constructor: function(identifier) {
          $super.constructor.call(this);
          this._widget = cls.WidgetFactory.create("Session");
          context.HostService.getApplicationHostWidget().addChildWidget(this._widget);
          this._sidebarWidget = cls.WidgetFactory.create("SessionSidebar");
          context.HostService.getApplicationHostWidget().getSideBar().addChildWidget(this._sidebarWidget);
          this._widget.setSidebarWidget(this._sidebarWidget);
          this._identifier = identifier;
          this._applications = [];
          this._applicationQueue = [];
          this._closeHandler = this._widget.getEndWidget().when(context.constants.widgetEvents.close, this.destroy.bind(this));
          this._restartHandler = this._widget.getEndWidget().when(cls.SessionEndWidget.restartEvent, this._onRestart.bind(this));

          this._flushableApplications = [];
          context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.title"));
          this._browserMultiPageModeAsChild = context.bootstrapInfo.subAppInfo;
          if (!this._browserMultiPageModeAsChild) {
            this._bookmarkWidget = cls.WidgetFactory.create("ApplicationBookmarkHostMenu");
            context.HostService.getApplicationHostWidget().getMenu().addChildWidget(this._bookmarkWidget);
          }
          this._childrenWindows = [];
          this._flushingApplicationsListener = context.InitService.when(gbc.constants.widgetEvents.onBeforeUnload, this._flushWaitingApplications
            .bind(this));
          this._unloadListener = context.InitService.when(gbc.constants.widgetEvents.onUnload, this._destroyChildrenWindows.bind(
            this));

        },
        _onRestart: function() {
          var info = this._baseInfos;
          this.destroy(true);
          context.SessionService.start(info.appId, info.urlParameters);
        },
        getWidget: function() {
          return this._widget;
        },
        getApplicationIdentifier: function() {
          return this._applicationIdentifier++;
        },
        destroy: function(restarting) {
          if (this._bookmarkWidget) {
            context.HostService.getApplicationHostWidget().getMenu().removeChildWidget(this._bookmarkWidget);
            this._bookmarkWidget.destroy();
            this._bookmarkWidget = null;
          }
          context.SessionService.remove(this, true === restarting);
          this._closeHandler();
          this._restartHandler();

          this._sidebarWidget.destroy();
          this._sidebarWidget = null;
          this._widget.destroy();
          this._widget = null;
          this._applications.length = 0;
          this._flushingApplicationsListener();
          this._destroyChildrenWindows();
          $super.destroy.call(this);
        },
        getConnector: function() {
          return this._baseInfos.connector;
        },
        getSessionId: function() {
          return this._sessionId;
        },
        setSessionId: function(id) {
          if (!this._sessionId) {
            this._sessionId = id;
            context.SessionService.updateSessionId(this, id);
          } else if (id !== this._sessionId) {
            this.error("Session Id Changed");
          }
        },
        getAppId: function() {
          return this._baseInfos.appId;
        },
        error: function(msg) {

        },
        /**
         *
         * @param {classes.VMApplication} application
         */
        add: function(application) {
          this._applications.push(application);
          application.__idleChangedSessionHook = application.dvm.onIdleChanged(this._onIdleChanged.bind(this, application));
          this.emit(cls.VMSession.applicationAddedEvent, application);
        },
        /**
         *
         * @param {classes.VMApplication} application
         */
        remove: function(application) {
          application.__idleChangedSessionHook();
          this._applications.remove(application);
          this._applicationQueue.remove(application);
          this._applicationEnding = application.info().ending;
          var pos = 0;
          while (pos < this._applicationQueue.length) {
            if (this._applicationQueue[pos] === this._applicationQueue[pos + 1]) {
              this._applicationQueue.splice(pos, 1);
            } else {
              pos++;
            }
          }
          this.emit(cls.VMSession.applicationRemovedEvent, application);
          var currentApp = this.getCurrentApplication();
          if (currentApp) {
            var currentWindow = currentApp.getVMWindow();
            if (currentWindow) {
              var winWidget = currentWindow.getController().getWidget();
              context.HostService.setDisplayedWindow(winWidget);
              context.HostService.getApplicationHostWidget().getSideBar().setActiveWindow(winWidget);
            }
          }
          this._showEnding = true;
          this._updateDisplayEnd();
        },
        _updateDisplayEnd: function() {
          if (this._showEnding && !this._applications.length) {
            if (this._childrenWindows.length || (this._browserMultiPageMode && this._waitingNewTasks > 0)) {
              this.getWidget().showWaitingEnd();
              context.HostService.setDisplayedWindow(null);
            } else {
              this.displayEnd();
            }
          }
        },
        _autoclose: function() {
          window.setTimeout(function() {
            var can = !this._flushableApplications || !this._flushableApplications.length;
            if (can) {
              cls.WindowHelper.closeWindow();
            } else {
              this._autoclose();
            }
          }.bind(this), 200);
        },
        displayEnd: function() {
          if (this._browserMultiPageModeAsChild) {
            this._autoclose();
            return;
          }
          this.emit(cls.VMSession.displayEndEvent, this._baseInfos.session);
          this.getWidget().getEndWidget().setHeader(i18next.t("gwc.app.ending.title"));
          if (this._baseInfos.session) {
            this.getWidget().getEndWidget().showSessionActions();
            this.getWidget().getEndWidget().setSessionLinks(this._baseInfos.customUA || this._baseInfos.connector || "",
              this._baseInfos.session);
            //cls.AuiApplicationService.linkDownload();
            this.getWidget().getEndWidget().setSessionID(this._baseInfos.session);
          }
          if (this._baseInfos.mode === "ua") {
            this.getWidget().getEndWidget().showUAActions();
          }
          if (!this._applicationEnding.normal) {

            switch (this._applicationEnding.flag) {
              case "notFound":
                this.getWidget().getEndWidget().setHeader(i18next.t("gwc.app.notFound.title"));
                this.getWidget().getEndWidget().setMessage(i18next.t("gwc.app.notFound.message", {
                  appId: "<strong>\"" + this._baseInfos.appId + "\"</strong>"
                }));
                break;
              case "notok":
                this.getWidget().getEndWidget().setMessage(
                  "<p>" + i18next.t("gwc.app.error.message") + ".</p><p>" + this._applicationEnding.message + "</p>");
                break;
              case "forbidden":
                this.getWidget().getEndWidget().setMessage(
                  "<p>" + i18next.t("gwc.app.forbidden.message") + ".</p><p>" + this._applicationEnding.message + "</p>");
                break;
              case "autoLogout":
                this.getWidget().getEndWidget().setMessage(
                  "<p>" + i18next.t("gwc.app.autologout.message") + ".</p>");
                break;
              case "uaProxy":
                this.getWidget().getEndWidget().setMessage(
                  "<p>" + i18next.t("gwc.app.uaProxy.message") + ".</p><p>" + this._applicationEnding.message + "</p>");
                break;
            }
          }
          this.getWidget().showEnd();
          context.HostService.setDisplayedWindow(null);
        },
        /**
         *
         * @returns {boolean}
         */
        isEmpty: function() {
          return !this._applications.length;
        },
        start: function(appName, params) {
          var info = new cls.VMApplicationInfo({
            appId: appName,
            urlParameters: params || context.UrlService.currentUrl().getQueryStringObject()
          });
          info.connector = info.urlParameters.connector || context.bootstrapInfo.connectorUri || "";
          info.customUA = info.urlParameters.customUA || null;
          info.mode = info.urlParameters.mode || "ua";
          info.inNewWindow = !!this._browserMultiPageModeAsChild;
          if (info.inNewWindow) {
            info.session = this._sessionId = context.bootstrapInfo.sessionId;
            context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
          }
          this._baseInfos = info;
          if (this._bookmarkWidget) {
            this._bookmarkWidget.setActivated(context.BookmarkService.getBookmark(this.getAppId()));
          }
          var application = new cls.VMApplication(info, this);
          var appWidget = application.getUI().getWidget();
          this._widget.setCurrentWidget(appWidget);
          this.add(application);
          application.start();
          this._registerNewTask(application.protocolInterface);
        },
        startTask: function(taskId, callback) {
          callback = callback || Function.noop;
          var info = {},
            keys;
          if (this._baseInfos) {
            keys = Object.keys(this._baseInfos);
            for (var k = 0; k < keys.length; k++) {
              info[keys[k]] = this._baseInfos[keys[k]];
            }
          }
          info.inNewWindow = this._browserMultiPageMode || (this._browserMultiPageModeAsChild &&
            (this._browserMultiPageModeAsChild !== taskId));

          if (info.inNewWindow) {
            info.urlParameters = context.UrlService.currentUrl().getQueryStringObject();
            info.connector = info.urlParameters.connector || context.bootstrapInfo.connectorUri || "";
            info.customUA = info.urlParameters.customUA || null;
            info.mode = info.urlParameters.mode || "ua";
          }
          if (!!this._browserMultiPageModeAsChild) {
            context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
            this._sessionId = context.bootstrapInfo.sessionId;
            info.session = this._sessionId;
          }

          info.task = true;
          info.page = 2;
          info.app = taskId;

          var application = new cls.VMApplication(new cls.VMApplicationInfo(info), this);
          if (!info.inNewWindow) {
            var appWidget = application.getUI().getWidget();
            this._widget.setCurrentWidget(appWidget);
            this.add(application);
            application.start();
            this.waitedForNewTask();
            callback();
          } else {
            application.waitForNewApp(function() {
              this.waitedForNewTask();
              callback();
            }.bind(this), function() {

            });
          }
        },

        startDirect: function(connection) {
          var info = new cls.VMApplicationInfo({
            pingTimeout: 1000,
            page: 1,
            auiOrder: 0,
            mode: "direct"
          });
          info.connection = connection;
          var application = new cls.VMApplication(info, this);
          this.add(application);
          application.start();
        },
        onApplicationAdded: function(hook) {
          return this.when(cls.VMSession.applicationAddedEvent, hook);
        },
        onApplicationRemoved: function(hook) {
          return this.when(cls.VMSession.applicationRemovedEvent, hook);
        },

        info: function() {
          return this._baseInfos;
        },
        /**
         *
         * @returns {classes.VMApplication[]}
         */
        getApplications: function() {
          return this._applications;
        },
        /**
         *
         * @returns {classes.VMApplication}
         */
        getCurrentApplication: function() {
          return (this._applicationQueue.length && this._applicationQueue[this._applicationQueue.length - 1]) ||
            this._applications[this._applications.length - 1];
        },
        setCurrentApplication: function(application) {
          this._applicationQueue.push(application);
        },
        _onIdleChanged: function(application) {
          this.emit(cls.VMSession.idleChangedEvent, application);
        },
        whenIdleChanged: function(hook) {
          return this.when(cls.VMSession.idleChangedEvent, hook);
        },
        isCurrentIdle: function() {
          var app = this.getCurrentApplication();
          return !app || app.dvm.processed && app.dvm.idle && app.layout.idle;
        },
        activateBrowserMultiPageMode: function() {
          this._browserMultiPageMode = true;
          context.HostService.getApplicationHostWidget().getSideBar().setTitleText(i18next.t("gwc.main.sidebar.multitab_title"));
        },
        _addWaitingApplication: function(application) {
          this._flushableApplications.push(application);
        },
        _removeWaitingApplication: function(application) {
          this._flushableApplications.remove(application);
        },
        _flushWaitingApplications: function() {
          this._flushingApplications = true;
          while (this._flushableApplications && this._flushableApplications.length) {
            cls.WindowHelper.openWindow(cls.UANetwork.newApp(this._flushableApplications.shift()), true);
          }
        },
        _registerNewTask: function(protocolInterface) {
          this._storedProtocol = protocolInterface;
        },
        newTask: function() {
          if (this._storedProtocol) {
            this._storedProtocol.newTask();
          }
        },
        _registerChildWindow: function(win) {
          this._childrenWindows.push(win);
          win.addEventListener("unload", function() {
            if (win.location.href !== "about:blank") { // thank you firefox
              this._childrenWindows.remove(win);
              this._updateDisplayEnd();
            }
          }.bind(this));
        },
        _destroyChildrenWindows: function() {
          while (this._childrenWindows.length) {
            var w = this._childrenWindows.pop();
            w.__desactivateEndingPopup = true;
            w.close();
          }
        },
        waitingForNewTask: function() {
          this._waitingNewTasks++;
        },
        waitedForNewTask: function() {
          this._waitingNewTasks--;
          this._updateDisplayEnd();
        }
      };
    });
  });
