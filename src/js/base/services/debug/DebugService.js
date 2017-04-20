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

modulum('DebugService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class gbc.DebugService
     */
    context.DebugService = context.oo.StaticClass(function() {
      /** @lends gbc.DebugService */
      return {
        __name: "DebugService",
        /** @type Window */
        _monitorWindow: null,
        /**
         * @type classes.MonitorWidget
         */
        _widget: null,
        /**
         * @type classes.DebugAuiController
         */
        _debugAuiController: null,
        auiview: null,
        _isDebugWindow: false,
        /**
         * @type classes.EventListener
         */
        _eventListener: null,

        _debugUis: null,
        _active: false,
        _disabled: false,

        _highlightElement: null,
        _highlightTimer: null,
        _nodeToShow: null,

        _isMonitor: function() {
          return !!context.UrlService.currentUrl().getQueryStringObject().monitor;
        },

        init: function() {
          this._debugUis = [];
          this._eventListener = new cls.EventListener();
          if (this._isMonitor()) {
            this.auiview = {};
            this._isDebugWindow = true;
            this._widget = cls.WidgetFactory.create("Monitor");
            document.body.appendChild(this._widget.getElement());
            this._debugAuiController = new cls.DebugAuiController();
            this._widget.addChildWidget(this._debugAuiController.getWidget());

            window.setTimeout(function() {
              var session = window.opener && window.opener.gbc && window.opener.gbc.SessionService.getCurrent();
              var app = session && session.getCurrentApplication();
              this._debugAuiController.refreshDebugAui(app.getNode(0));
              window.opener.gbc.DebugService.attach(window);
            }.bind(this), 100);
          }
        },
        isMonitorWindow: function() {
          return this._isDebugWindow;
        },
        destroy: function() {
          if (this._monitorWindow) {
            this._monitorWindow.close();
          }
        },
        show: function() {
          if (!this._monitorWindow) {
            var url = context.UrlService.currentUrl();
            window.open(url.removeQueryString("app").addQueryString("monitor", true).toString());
          } else {
            var uiNode = context.SessionService.getCurrent().getCurrentApplication().getNode(0);
            var debugAuiController = this._monitorWindow.gbc.DebugService._debugAuiController;
            if (uiNode.auiSerial !== debugAuiController.auiSerial) {
              debugAuiController.refreshDebugAui(uiNode);
            }
            this._monitorWindow.focus();
          }
        },
        attach: function(monitorWindow) {
          if (this._monitorWindow !== monitorWindow) {
            this._monitorWindow = monitorWindow;
            this._monitorWindow.document.title = "GBC Debug tools";
            this._monitorWindow.onunload = function() {
              this._monitorWindow = null;
            }.bind(this);
            if (this._nodeToShow !== null) {
              this._monitorWindow.gbc.DebugService._debugAuiController.showNode(this._nodeToShow);
              this._nodeToShow = null;
            }
            this._monitorWindow.addEventListener(context.classes.DebugAuiController.highlightAui, this.onHighlightAuiNode.bind(this));
          }
        },

        registerDebugUi: function(widget) {
          if (this._debugUis.indexOf(widget) < 0) {
            this._debugUis.push(widget);
          }
          widget.activate(this._active);
        },

        unregisterDebugUi: function(widget) {
          if (this._debugUis.indexOf(widget) >= 0) {
            this._debugUis.remove(widget);
          }
        },

        whenActivationChanged: function(hook) {
          return this._eventListener.when("debugActivationChanged", hook);
        },

        disable: function() {
          this._disabled = true;
        },

        activate: function() {
          if (!this._active && !this._disabled) {
            this._active = true;
            for (var i = 0; i < this._debugUis.length; i++) {
              this._debugUis[i].activate(this._active);
            }
            context.classes.DebugHelper.activateDebugHelpers();
            this._registerDebugContextMenu();
            this._eventListener.emit("debugActivationChanged", true);
          }
        },

        _registerDebugContextMenu: function() {
          if (!this._isMonitor() && !this.__debugContextMenuRegistered) {
            this.__debugContextMenuRegistered = true;
            window.addEventListener('contextmenu', function(event) {
              if (window.navigator.platform.indexOf('Mac') === 0 ? event.metaKey : event.ctrlKey) {
                var auiNode = window.gbcNode(event.target);
                if (auiNode) {
                  this.show();
                  if (this._monitorWindow) {
                    var uiNode = auiNode.getApplication().getNode(0);
                    var debugAuiController = this._monitorWindow.gbc.DebugService._debugAuiController;
                    if (uiNode.auiSerial !== debugAuiController.auiSerial) {
                      debugAuiController.refreshDebugAui(uiNode);
                    }
                    this._monitorWindow.gbc.DebugService._debugAuiController.showNode(auiNode);
                  } else {
                    this._nodeToShow = auiNode;
                  }
                  event.preventDefault();
                }
              }
            }.bind(this));
          }
        },
        isActive: function() {
          return this._active;
        },

        onHighlightAuiNode: function(event) {
          var node = gbc.SessionService.getCurrent().getCurrentApplication().getNode(event.auiNodeId);
          if (node.getTag() === 'TreeItem') {
            var table = node;
            while (table.getTag() !== 'Table') {
              table = table.getParentNode();
            }
            var valueIndex = node.attribute('row');
            if (valueIndex === -1) {
              return;
            }
            node = table.getFirstChild('TableColumn').getFirstChild('ValueList').getChildren()[valueIndex];
          }
          var widget = null;
          while (!widget) {
            var ctrl = node.getController();
            if (ctrl) {
              widget = ctrl.getWidget();
            }
            node = node.getParentNode();
          }

          if (this._highlightElement) {
            window.clearTimeout(this._highlightTimer);
            document.body.removeChild(this._highlightElement);
            this._highlightElement = null;
          }

          if (widget._layoutEngine) {
            if (widget._layoutEngine instanceof cls.GridLayoutEngine) {
              this._highlightElement = this.createGridHighlightElement(widget);
            } else if (widget._layoutEngine instanceof cls.DBoxLayoutEngine) {
              this._highlightElement = this.createDBoxHighlightElement(widget);
            }
          }
          if (!this._highlightElement) {
            this._highlightElement = this.createDefaultHighlightElement(widget);
          }

          document.body.appendChild(this._highlightElement);
          this._highlightTimer = window.setTimeout(function() {
            document.body.removeChild(this._highlightElement);
            this._highlightTimer = null;
            this._highlightElement = null;
          }.bind(this), 2000);
        },

        createDefaultHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = document.createElement("div");
          element.style.position = 'fixed';
          element.style.backgroundColor = "rgba(255,0,0,0.5)";
          element.style.border = "1px solid red";
          element.style.zIndex = 999999;
          element.style.top = widgetRect.top + "px";
          element.style.left = widgetRect.left + "px";
          element.style.width = widgetRect.width + "px";
          element.style.height = widgetRect.height + "px";
          return element;
        },

        createGridHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = document.createElement("div");
          element.style.position = 'fixed';
          element.style.border = "1px solid red";
          element.style.zIndex = 999999;
          element.style.top = widgetRect.top + "px";
          element.style.left = widgetRect.left + "px";
          element.style.width = widgetRect.width + "px";
          element.style.height = widgetRect.height + "px";

          var decorating = {
            offsetLeft: widget.getLayoutInformation().getDecoratingOffset().getWidth(true),
            offsetTop: widget.getLayoutInformation().getDecoratingOffset().getHeight(true),
            width: widget.getLayoutInformation().getDecorating().getWidth(true),
            height: widget.getLayoutInformation().getDecorating().getHeight(true)
          };
          var dimensionElementsList = [
            widget._layoutEngine._xspace.dimensionManager.dimensionElements,
            widget._layoutEngine._yspace.dimensionManager.dimensionElements
          ];
          for (var i = 0; i < dimensionElementsList.length; ++i) {
            var dimensionElements = dimensionElementsList[i];
            var total = 0;
            for (var j = 0; j < dimensionElements.length; ++j) {
              var bandSize = dimensionElements[j].getSize(true, true);
              var band = document.createElement("div");
              band.style.position = 'absolute';
              band.style.backgroundColor = j % 2 ? "rgba(255,100,0,0.3)" : "rgba(255,0,0,0.3)";
              if (i === 0) {
                band.style.top = 0 + decorating.offsetTop + "px";
                band.style.left = total + decorating.offsetLeft + "px";
                band.style.width = bandSize + "px";
                band.style.height = widgetRect.height - decorating.height + "px";
              } else {
                band.style.top = total + decorating.offsetTop + "px";
                band.style.left = 0 + decorating.offsetLeft + "px";
                band.style.width = widgetRect.width - decorating.width + "px";
                band.style.height = bandSize + "px";
              }
              total += bandSize;
              element.appendChild(band);
            }
          }

          var children = widget.getChildren();
          for (i = 0; i < children.length; ++i) {
            var childWidgetRect = children[i].getElement().getBoundingClientRect();
            var childRectElement = document.createElement("div");
            childRectElement.style.position = 'fixed';
            childRectElement.style.border = "1px solid red";
            childRectElement.style.top = childWidgetRect.top + "px";
            childRectElement.style.left = childWidgetRect.left + "px";
            childRectElement.style.width = childWidgetRect.width + "px";
            childRectElement.style.height = childWidgetRect.height + "px";
            element.appendChild(childRectElement);
          }

          return element;
        },

        createDBoxHighlightElement: function(widget) {
          var widgetRect = widget.getElement().getBoundingClientRect();
          var element = document.createElement("div");
          element.style.position = 'fixed';
          element.style.border = "1px solid red";
          element.style.zIndex = 999999;
          element.style.top = widgetRect.top + "px";
          element.style.left = widgetRect.left + "px";
          element.style.width = widgetRect.width + "px";
          element.style.height = widgetRect.height + "px";

          var children = widget.getChildren();
          var total = 0;
          for (var i = 0; i < children.length; ++i) {
            var bandSize = widget._layoutEngine._getAllocatedSize(children[i]);
            var band = document.createElement("div");
            band.style.position = 'absolute';
            band.style.backgroundColor = i % 2 ? "rgba(255,100,0,0.5)" : "rgba(255,0,0,0.5)";
            if (widget._layoutEngine instanceof cls.HBoxLayoutEngine) {
              band.style.top = 0;
              band.style.left = total + "px";
              band.style.width = bandSize + "px";
              band.style.height = widgetRect.height + "px";
            } else {
              band.style.top = total + "px";
              band.style.left = 0;
              band.style.width = widgetRect.width + "px";
              band.style.height = bandSize + "px";
            }
            total += bandSize;
            element.appendChild(band);
          }

          return element;
        },

        catClicked: function(catName, noToggle) {
          if (!noToggle) {
            this.auiview['.cat_' + catName] = !this.auiview['.cat_' + catName];
          }
          var elements = document.body.getElementsByClassName('cat_' + catName),
            i = 0,
            len = elements.length;
          for (; i < len; i++) {
            elements[i].toggleClass("hidden", !!this.auiview['.cat_' + catName]);
          }
        }
      };
    });
    context.InitService.register(context.DebugService);
  });
