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

modulum('WebComponentWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Button widget.
     * @class classes.WebComponentWidget
     * @extends classes.TextWidgetBase
     */
    cls.WebComponentWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.WebComponentWidget.prototype */
      return {
        $static: {
          gICAPIVersion: "1.0",
          focusEvent: context.constants.widgetEvents.focus,
          dataEvent: "wc_data",
          actionEvent: "wc_action",
          ready: "wc_ready"
        },

        __name: "WebComponentWidget",
        __dataContentPlaceholderSelector: cls.WidgetBase.selfDataContent,
        _webComponentType: null,
        _webComponentWindow: null,
        _webComponentProxy: null,
        _flushValue: "",
        _url: null,
        _isReady: false,
        _value: null,

        /**
         * @type Element
         */
        _iframeElement: null,

        _initLayout: function() {
          if (!this._ignoreLayout) {
            this._layoutInformation = new cls.LayoutInformation(this);
            this._layoutEngine = new cls.LeafLayoutEngine(this);
            this._layoutInformation.forcedMinimalWidth = 20;
            this._layoutInformation.forcedMinimalHeight = 20;
          }
        },

        /**
         *
         * @private
         */
        _initElement: function() {
          $super._initElement.call(this);
          // TODO Init loader spinner
          this._iframeElement = this._element.getElementsByTagName('iframe')[0];
          this._iframeElement.on('load.WebComponentWidget', this._onLoad.bind(this));
        },

        /**
         *
         * @private
         */
        _onLoad: function() {
          if (this.getUrl()) {
            if (this._webComponentType === "api") {
              this._injectApi();
            }
            this._onReady();
          }
        },

        /**
         *
         */
        destroy: function() {
          this._iframeElement.off('load.WebComponentWidget');
          this._iframeElement = null;
          $super.destroy.call(this);
        },

        /**
         * Defines the address of the webComponent
         * @param url {String} address
         */
        setUrl: function(url) {
          this._url = url;
          url = url ? url : "about:blank";
          if (this._iframeElement.contentWindow) {
            this._iframeElement.contentWindow.location.replace(url);
          } else {
            this._iframeElement.setAttribute("src", url);
          }
        },

        /**
         * @returns {String} address of the webcomponent
         */
        getUrl: function() {
          return this._iframeElement.getAttribute("src") || this._url;
        },

        /**
         * Function to transmit gICAPI orders to webcomponent
         * @param verb
         * @param args
         * @private
         */
        _toICAPI: function(verb, args) {
          try {
            var arg = args;
            if (verb === "onData" && arg === null) {
              arg = [null];
            } else {
              if (!arg && arg !== false && arg !== "" && arg !== 0) {
                arg = [];
              }
              if (arg.prototype !== Array) {
                arg = [arg];
              }
            }
            if (this._webComponentWindow && this._webComponentWindow.gICAPI && this._webComponentWindow.gICAPI[verb]) {
              this._webComponentWindow.gICAPI[verb].apply(this._webComponentWindow.gICAPI, arg);
            }
          } catch (e) {
            context.error("Web Component threw an error : " + e.toString(), e);
          }
        },

        /**
         * Set the value of the webComponent
         * @param value
         */
        setValue: function(value) {
          if (value === "") {
            value = null;
          }
          this._value = value;
          if (this._webComponentType === "url") {
            this.setUrl(value);
          } else {
            if (this._isReady) {
              this._toICAPI("onData", this._value ? this._value : "");
            } else {
              this.when(cls.WebComponentWidget.ready, this._onReadyData.bind(this));
            }
          }
        },

        /**
         * handler for onData
         * @private
         */
        _onReadyData: function() {
          this._toICAPI("onData", this._value ? this._value : "");
        },

        setFocus: function() {
          if (this._isReady) {
            this._iframeElement.domFocus(); //force focus to blur other elements
            this._toICAPI("onFocus", true);
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyFocus.bind(this));
          }
          $super.setFocus.call(this);
        },

        /**
         * handler for onFocus
         * @private
         */
        _onReadyFocus: function() {
          if (this._uiWidget && this._uiWidget._focusedWidget !== this) {
            this.emit(context.constants.widgetEvents.change);
            this._toICAPI("onFocus", false);
          } else {
            this._toICAPI("onFocus", true);
          }
        },

        /**
         *
         */
        loseFocus: function() {
          $super.loseFocus.call(this);
          if (this._isReady) {
            this._onReadyBlur();
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyBlur.bind(this));
          }
        },

        /**
         * handler for onBlur
         * @private
         */
        _onReadyBlur: function() {
          this.getValue();
          this.emit(context.constants.widgetEvents.blur);
          this._toICAPI("onFocus", false);
        },

        /**
         * Called when the WC formfield's state has changed
         * @param active
         * @param dialogType
         */
        onStateChanged: function(active, dialogType) {
          if (this._isReady) {
            this._onReadyStateChanged(active, dialogType);
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyStateChanged.bind(this, active, dialogType));
          }
        },

        /**
         * OnStateChanged handler
         * @param active
         * @param dialogType
         * @private
         */
        _onReadyStateChanged: function(active, dialogType) {
          this._toICAPI("onStateChanged", JSON.stringify({
            "active": active.toString(),
            "dialogType": dialogType.toString()
          }));
        },

        /**
         * Get The value of the webComponent
         * @returns {String} value or url of the webcomponent
         */
        getValue: function() {
          this.flushWebcomponentData();
          return this._webComponentType === "api" ? this._flushValue ? this._flushValue : this._value : this.getUrl();
        },

        /**
         * Defines the scrollBars to display
         * @param horizontal
         * @param vertical
         */
        setSrollBars: function(horizontal, vertical) {
          this.setStyle({
            "overflow-x": horizontal ? "sroll" : "hidden",
            "overflow-y": vertical ? "sroll" : "hidden"
          });
        },

        /**
         *
         * @param property
         * @private
         */
        _setProperty: function(property) {
          var pty = property;
          if (this._isReady) {
            this._toICAPI("onProperty", pty);
          } else {
            this.when(cls.WebComponentWidget.ready, this._onReadyProperty.bind(this, pty));
          }
        },

        /**
         *
         * @param pty
         * @private
         */
        _onReadyProperty: function(pty) {
          this._toICAPI("onProperty", pty);
        },

        /**
         * Define the type of component
         * @param {String} type should be api or url
         */
        setWebComponentType: function(type) {
          this._webComponentType = type;
        },

        /**
         * Inject the API on the webcomponent
         * @returns {boolean} false if not applicable
         * @private
         */
        _injectApi: function() {
          //Add a new proxy for this webcomponent
          context.WebComponentProxyService.setProxy(this.getUniqueIdentifier());
          this._webComponentProxy = context.WebComponentProxyService.getProxy(this.getUniqueIdentifier());

          //Get the content of the ifram window to put api on
          this._webComponentWindow = this._iframeElement.contentWindow;
          try {
            this._webComponentWindow.gICAPIVersion = cls.WebComponentWidget.gICAPIVersion;
            // Bind WebComponent API to the iframe
            this._webComponentWindow.gICAPI = this._gICAPI();
            // Tell the WebComponent that host is ready
            if (this._webComponentWindow.onICHostReady) {
              this._webComponentWindow.onICHostReady(1.0);
            } else {
              console.error("onICHostReady no present in webcomponent, cannot continue!");
              this._webComponentNotFound();
              return false;
            }
          } catch (e) {
            console.error("onICHostReady no present in webcomponent, cannot continue!");
            this._webComponentNotFound();
            return false;
          }
          this.emit(cls.WebComponentWidget.ready);
        },

        /**
         * When the iframe is loaded
         * @private
         */
        _onReady: function() {
          //TODO remove loader image
          this._isReady = true;
          this.emit(context.constants.widgetEvents.ready);
        },

        /**
         * Api to bind to the webcomponent window
         * */
        _gICAPI: function() {
          return {
            SetFocus: function() {
              // Generates a focus change request. The focus is entirely managed by the runtime system
              this._webComponentProxy.setFocus(this); //._webComponentWindow.frameElement.parentElement.id);
            }.bind(this),
            SetData: function(dataStr) {
              this._webComponentProxy.setData(this, dataStr);
            }.bind(this),
            Action: function(actionName) {
              this._webComponentProxy.action(this, actionName);
            }.bind(this),

            version: "1.0"
          };
        },

        /**
         * Force webcomponent to get data
         */
        flushWebcomponentData: function() {
          this._toICAPI("onFlushData");
        },

        /**
         * Stop VMApplication with a message
         * @private
         */
        _webComponentNotFound: function() {
          if (!context.bootstrapInfo.ignoreWebComponentFails) {
            //VMApplication stop with a message
            var currentApp = gbc.SessionService.getCurrent() && gbc.SessionService.getCurrent().getCurrentApplication();
            if (currentApp) {
              currentApp.close();
              currentApp.stop(i18next.t("gwc.app.webcompNotFound.message"));
            }
          }
        },

        /**
         * override this for webcomponents
         * @param readonly
         * @private
         */
        gbcReadonly: function(readonly) {}

      };
    });
    cls.WidgetFactory.register('WebComponent', cls.WebComponentWidget);
  });
