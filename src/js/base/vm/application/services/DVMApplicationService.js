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

modulum('DVMApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Application Service to manage DVM interactions for an application
     *
     * @class classes.DVMApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.DVMApplicationService = context.oo.Class(cls.ApplicationServiceBase,
      function($super) {

        /** @lends classes.DVMApplicationService.prototype */
        return {
          /** @lends classes.DVMApplicationService */
          $static: {
            ordersManagedEvent: "ordersManaged",
            idleChangedEvent: "idleChanged"
          },

          __name: "DVMApplicationService",
          /** Indicator to know if DVM is idle or not */
          idle: true,
          processed: false,
          eventListener: null,
          constructor: function(app) {
            $super.constructor.call(this, app);
            this.eventListener = new cls.EventListener();
          },

          destroy: function() {
            $super.destroy.call(this);
          },

          updateProcessingStatus: function() {
            var menu = this._getMenu("runtimeStatus");
            if (menu) {
              if (this.idle) {
                menu.setIdle();
              } else {
                menu.setProcessing();
              }
            }
          },

          setIdle: function(isIdle) {
            this.idle = isIdle;
            if (!this.processed && this.idle) {
              this.processed = true;
            }
            this.updateProcessingStatus();
            this.emit(cls.DVMApplicationService.idleChangedEvent);

          },
          onOrdersManaged: function(hook, once) {
            return this.eventListener.when(cls.DVMApplicationService.ordersManagedEvent, hook, once);
          },
          onIdleChanged: function(hook) {
            return this.eventListener.when(cls.DVMApplicationService.idleChangedEvent, hook);
          },
          /**
           * Find and check if Order is an om order
           * @param {Object}   order       Order Object
           */
          readOrder: function(order, treeModificationTrack, nodesWithDom) {
            if (order.type !== "om") {
              throw "Received auiTree bad format : " + order;
            }
            return this.manageAuiOrder(order, treeModificationTrack, nodesWithDom);
          },
          manageAuiOrders: function(data, callback) {
            var treeModificationTrack = [],
              nodesWithDom = [];
            var vmMessages = cls.AuiProtocolReader.translate(data);
            styler.bufferize();
            var needLayout = false;
            var hasAddedRemovedNodes = false;
            var initialOrder = vmMessages.length && vmMessages[0] && vmMessages[0].id === 0 && vmMessages[0];
            // 1. readOrder : create controllers (widgets + behaviors) and attachUI
            while (vmMessages.length) {
              if (this._application) {
                var result = this.readOrder(vmMessages.shift(), treeModificationTrack, nodesWithDom);
                needLayout = needLayout || result.needLayout;
                hasAddedRemovedNodes = hasAddedRemovedNodes || result.hasAddedRemovedNodes;
              }
            }
            var rootNode = this._application && this._application.getNode(0);
            if (!!rootNode) {
              if (!treeModificationTrack[0]) {
                treeModificationTrack[0] = {
                  "runtimeStatus": true
                };
              } else if (treeModificationTrack[0] !== true) {
                treeModificationTrack[0].runtimeStatus = true;
              } else if (treeModificationTrack[0] && initialOrder) {
                treeModificationTrack[0] = {
                  runtimeStatus: true,
                  focus: true
                };
              }

              var nodes = this._application.model.nodeHash;
              var node = null;
              for (var i = 0; i < nodes.length; ++i) {
                node = nodes[i];
                if (node) {
                  node.resetActivePseudoSelectors();
                }
              }

              // 2. update styles
              if (this._application.styleListsChanged || hasAddedRemovedNodes) {
                rootNode.updateApplicableStyles(true);
                this._application.styleListsChanged = false;
                this._application.usedStyleAttributes = {};
                var styleLists = rootNode.getChildren('StyleList');
                for (i = 0; i < styleLists.length; i++) {
                  var styles = styleLists[i].getChildren();
                  for (var j = 0; j < styles.length; ++j) {
                    var styleAttributes = styles[j].getChildren();
                    for (var k = 0; k < styleAttributes.length; ++k) {
                      this._application.usedStyleAttributes[styleAttributes[k].attribute('name')] = true;
                    }
                  }
                }
                for (i = 0; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node) {
                    node.resetPseudoSelectorsUsedInSubTree();
                  }
                }
                for (i = 0; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node) {
                    node.updatePseudoSelectorsUsedInSubTree();
                    var controller = node.getController();
                    if (controller) {
                      controller.setStyleBasedBehaviorsDirty(true, true);
                    }
                  }
                }
              }

              var stillDirty = true;
              // 3. Apply behaviors
              while (stillDirty) {
                stillDirty = rootNode.applyBehaviors(treeModificationTrack, true);
              }

              // 4. Add root widget to DOM
              for (i = 0; i < nodesWithDom.length; i++) {
                if (!nodesWithDom[i].getParentNode()) {
                  this._application.attachRootWidget(nodesWithDom[i].getController().getWidget());
                }
              }
            }
            context.styler.flush();
            var needFocus = this._application && context.SessionService.getCurrent().getCurrentApplication() === this._application;
            this._application.layout.refreshLayout();
            if (!!callback) {
              callback();
            }
            if (needFocus) {
              this._application.layout.when(context.constants.widgetEvents.afterLayoutFocusRestored, function() {
                this._application.keyboard.flushBufferedKeys();
                this.eventListener.emit(cls.DVMApplicationService.ordersManagedEvent);
              }.bind(this), true);
            } else {
              if (document.activeElement === document.body) { // by default, ApplicationWidget should have focus (needed to manage KeyEvents properly)
                this._application.getUI().getWidget().getElement().domFocus();
              }
              this.eventListener.emit(cls.DVMApplicationService.ordersManagedEvent);
            }
          },

          manageAuiOrder: function(order, treeModificationTrack, nodesWithDom) {
            var result = {
              needLayout: false,
              hasAddedRemovedNodes: false
            };
            var node;
            var i;
            for (var index = 0; index < order.operations.length; index++) {
              var cmd = order.operations[index];
              switch (cmd.type) {
                case "update":
                  result.needLayout = this._application.model.commandUpdate(cmd, treeModificationTrack) || result.needLayout;
                  this._application.getNode(0).auiSerial = order.id;
                  break;
                case "add":
                  node = this._application.model.commandAdd(cmd, treeModificationTrack);
                  nodesWithDom.push(node);
                  result.needLayout = result.needLayout || !!cls.LayoutTriggerAttributes[cmd.type][node._tag];
                  result.hasAddedRemovedNodes = true;
                  this._application.getNode(0).auiSerial = order.id;
                  break;
                case "remove":
                  node = null;
                  for (i = 0; i < nodesWithDom.length; ++i) {
                    if (nodesWithDom[i].getId() === cmd.id) {
                      nodesWithDom.splice(i, 1);
                      break;
                    }
                  }
                  var toDestroy = this._application.getNode(cmd.id);
                  if (toDestroy) {
                    toDestroy.destroy();
                  }
                  if (cmd.id === 0) {
                    this._application.setEnding();
                  } else {
                    this._application.getNode(0).auiSerial = order.id;
                  }
                  result.needLayout = result.needLayout || !!cls.LayoutTriggerAttributes[cmd.type][toDestroy._tag];
                  result.hasAddedRemovedNodes = true;
                  break;
                default:
                  node = null;
                  context.LogService.error("dvm.manageAuiOrder: Invalid command (" + cmd.type + ")");
              }
            }

            return result;
          },

          _getMenu: function(name) {
            if (this._application) {
              var sessionWidget = this._application._ui._applicationWidget.getParentWidget();
              var applicationHostWidget = sessionWidget.getParentWidget();
              var menu = applicationHostWidget._menu;
              return name ? menu["_" + name] : menu;
            } else {
              return null;
            }
          }
        };
      });
    cls.ApplicationServiceFactory.register("Dvm", cls.DVMApplicationService);
  });
