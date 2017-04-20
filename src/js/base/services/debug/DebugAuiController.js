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

modulum('DebugAuiController',
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.DebugAuiController
     */
    cls.DebugAuiController = context.oo.Class(function() {
      /** @lends classes.DebugAuiController.prototype */
      return {
        __name: "DebugAuiController",
        $static: {
          defaultTreeViewItemTemplate: {
            color: "#000000",
            collapsed: false
          },
          highlightAui: 'highlightAui'
        },
        _treeWidget: null,
        _nodeWidget: null,
        _layoutWidget: null,
        /**
         * @type classes.NodeBase
         */
        _lastRootNode: null,
        auiSerial: null,

        constructor: function() {
          this._treeWidget = cls.WidgetFactory.create("MonitorDebugTree");
        },
        destroy: function() {
          if (this._layoutWidget) {
            this._layoutWidget.destroy();
          }
          if (this._nodeWidget) {
            this._nodeWidget.destroy();
          }
          this._treeWidget.destroy();
          this._treeWidget = null;
        },
        getWidget: function() {
          return this._treeWidget;
        },
        _createNodeInfo: function(id) {
          var info = cls.WidgetFactory.create("MonitorDebugNodeInfo");
          this._displayProperties(info.getPropertiesContainer(), id);
          return info.getElement();
        },
        _createLayoutInfo: function(id) {
          var info = cls.WidgetFactory.create("MonitorDebugLayoutInfo");
          this._displayLayout(info, id);
          return info.getElement();
        },

        _createSub: function(node) {
          var widget = cls.WidgetFactory.create("MonitorDebugTreeItem");
          var label = node._tag;
          if (node.attribute("name")) {
            label += " (" + node.attribute("name") + ")";
          } else if (node.attribute("value")) {
            var value = node.attribute("value");
            label += " (" + (value.length > 16 ? value.substr(0, 16) + "\u2026" : value) + ")";
          }
          widget.setLabel(label);
          widget.setIdRef(node._id);
          widget.setIconColor((context.constants.debugInfo.auiTreeNodeInfo[node._tag] || cls.DebugAuiController.defaultTreeViewItemTemplate)
            .color);
          widget.setCollapsed((context.constants.debugInfo.auiTreeNodeInfo[node._tag] || cls.DebugAuiController.defaultTreeViewItemTemplate)
            .collapsed);
          widget.when(gbc.constants.widgetEvents.click, this.showNode.bind(this, node));
          return widget;
        },
        showNode: function(node) {
          var event = document.createEvent('CustomEvent');
          event.initEvent(cls.DebugAuiController.highlightAui, true, false);
          event.auiNodeId = node._id;
          window.dispatchEvent(event);
          this._treeWidget.setSelectedItem(node._id);
          this._treeWidget.setNodeDebugContent(this._createNodeInfo(node._id));
          this._treeWidget.setLayoutInfoContent(this._createLayoutInfo(node._id));
        },
        refreshDebugAui: function(node) {
          styler.bufferize();
          this.auiSerial = node.getApplication().getNode(0).auiSerial;
          this._lastRootNode = node;
          var subs = function(w, children) {
            for (var i = 0; i < children.length; i++) {
              var widget = this._createSub(children[i]);
              w.addChildWidget(widget);
              subs(widget, children[i].getChildren());
            }
          }.bind(this);
          var rootWidget = this._createSub(node);
          subs(rootWidget, node.getChildren());

          this._treeWidget.empty();
          this._treeWidget.addChildWidget(rootWidget);
          context.styler.flush();

        },
        _displayLayout: function(widget, refId) {
          var app = this._lastRootNode.getApplication();
          var omNode = app.getNode(refId);
          if (omNode) {
            var w = omNode.getController() && omNode.getController().getWidget();
            if (w) {
              var layoutInfo = w.getLayoutInformation();
              widget.setLayoutEngineName(w.getLayoutEngine() && w.getLayoutEngine().__name);

              widget.setPosX(layoutInfo.getGridX());
              widget.setPosY(layoutInfo.getGridY());
              widget.setGridWidth(layoutInfo.getGridWidth());
              widget.setGridHeight(layoutInfo.getGridHeight());
              widget.setWidth(layoutInfo.getPreferred().getWidth());
              widget.setHeight(layoutInfo.getPreferred().getHeight());
              widget.setMeasuredHasSize(layoutInfo.getMeasured().hasSize());
              widget.setMeasuredWidth(layoutInfo.getMeasured().getWidth());
              widget.setMeasuredHeight(layoutInfo.getMeasured().getHeight());
              widget.setMinimalHasSize(layoutInfo.getMinimal().hasSize());
              widget.setMinimalWidth(layoutInfo.getMinimal().getWidth());
              widget.setMinimalHeight(layoutInfo.getMinimal().getHeight());
              widget.setMaximalHasSize(layoutInfo.getMaximal().hasSize());
              widget.setMaximalWidth(layoutInfo.getMaximal().getWidth());
              widget.setMaximalHeight(layoutInfo.getMaximal().getHeight());
              widget.setAvailableHasSize(layoutInfo.getAvailable().hasSize());
              widget.setAvailableWidth(layoutInfo.getAvailable().getWidth());
              widget.setAvailableHeight(layoutInfo.getAvailable().getHeight());
              widget.setAllocatedHasSize(layoutInfo.getAllocated().hasSize());
              widget.setAllocatedWidth(layoutInfo.getAllocated().getWidth());
              widget.setAllocatedHeight(layoutInfo.getAllocated().getHeight());
              widget.setDecoratingHasSize(layoutInfo.getDecorating().hasSize());
              widget.setDecoratingWidth(layoutInfo.getDecorating().getWidth());
              widget.setDecoratingHeight(layoutInfo.getDecorating().getHeight());
              widget.setDecoratingoffsetHasSize(layoutInfo.getDecoratingOffset().hasSize());
              widget.setDecoratingoffsetWidth(layoutInfo.getDecoratingOffset().getWidth());
              widget.setDecoratingoffsetHeight(layoutInfo.getDecoratingOffset().getHeight());
              widget.setStretchX(layoutInfo.getStretched().getX(true));
              widget.setStretchY(layoutInfo.getStretched().getY(true));
              widget.setChildrenStretchX(layoutInfo.isChildrenXStretched());
              widget.setChildrenStretchY(layoutInfo.isChildrenYStretched());
              widget.setInvalidatedMeasure(w._layoutEngine._invalidatedMeasure);
              widget.setInvalidatedAllocatedSpace(w._layoutEngine._invalidatedAllocatedSpace);
            }
          }
        },
        _displayProperties: function(propertyContainer, refId) {
          var app = this._lastRootNode.getApplication();
          var omNode = app && app.getNode(refId);
          if (omNode) {
            var values = {};
            var categories = {};
            context.constants.nodeAttributes[omNode._tag].forEach(function(property) {
              values[property] = null;
              var cat = categories[context.constants.debugInfo.attributeCategory[property]] || [];
              cat.push(property);
              categories[context.constants.debugInfo.attributeCategory[property]] = cat.sort();
            });
            Object.keys(omNode._attributes).forEach(function(key) {
              values[key] = omNode._attributes[key];
            });

            var cats = document.createDocumentFragment();

            Object.keys(categories).sort().forEach(function(category) {
              var hidden = !!gbc.DebugService.auiview['.cat_' + category];
              var cat = document.createElement("tr"),
                catText = document.createElement("td");
              cat.setAttribute("onclick", "gbc.DebugService.catClicked('" + category + "');");
              catText.setAttribute("colspan", "5");
              catText.addClass("category");
              catText.textContent = category;
              cat.appendChild(catText);
              cats.appendChild(cat);

              var pties = categories[category],
                len = pties.length,
                i = 0;
              for (; i < len; i++) {
                var property = pties[i],
                  defaultValue = cls.NodeHelper.getAttributeDefaultValue(omNode.tag, property);
                var pty = document.createElement("tr"),
                  info = document.createElement("td");
                pty.addClasses("property", "cat_" + category);
                if (!!omNode._attributesSetByVM[property]) {
                  pty.addClass("changed");
                }
                if (hidden) {
                  pty.addClass("hidden");
                }
                info.textContent = "&nbsp;";
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = property;
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = (values[property] === null) ? defaultValue : values[property];
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = property === "value" ? values[property] : ("" + values[property]).replace(new RegExp("\\s",
                  "g"), "_");
                pty.appendChild(info);
                info = document.createElement("td");
                info.textContent = defaultValue;
                pty.appendChild(info);

                cats.appendChild(pty);
              }
            });

            propertyContainer.empty();
            propertyContainer.appendChild(cats);
          }
        }
      };
    });
  });
