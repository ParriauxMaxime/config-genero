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

modulum('AuiApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base class of application scoped services
     * @class classes.AuiApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.AuiApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.AuiApplicationService.prototype */
      return {
        __name: "AuiApplicationService",
        nodeHash: null,
        // logs
        contents: null,
        file: null,
        constructor: function(app) {
          $super.constructor.call(this, app);
          this.nodeHash = [];
          //   this.endingNode = new cls.EndingNode(app);   // TODO USELESS ?
          this.contents = ["LOGVERSION=2"];
        },
        stop: function() {
          this.nodeHash.length = 0;
        },
        destroy: function() {
          this.contents.length = 0;
          $super.destroy.call(this);
          //  this.endingNode.destroy();
        },
        /**
         * Get a node object
         * @param   {Number} id of the Node to get
         * @returns {classes.NodeBase} Node Object
         */
        getNode: function(id) {
          if (Object.isNumber(id)) {
            return this.nodeHash[id];
          }
          if (Object.isString(id)) {
            return this.nodeHash[parseInt(id, 10)];
          }
          if (this._application.ending) {
            return this.endingNode;
          }
          return null;
        },
        getNodesFrom: function(id, currentBag) {
          var result = currentBag || [];
          var localRoot = Object.isNumber(id) ? this.getNode(id || 0) : id;
          if (localRoot) {
            result.push(localRoot);
            for (var i = 0; i < localRoot.children.length; i++) {
              this.getNodesFrom(localRoot.children[i], result);
            }
          }
          if (!currentBag) {
            return result;
          } else {
            return null;
          }
        },
        addNode: function(id, node) {
          this.nodeHash[id] = node;
        },
        getNodeByAttribute: function(attr, value) {
          return this.nodeHash.find(function(node) {
            return node ? node.attribute(attr) === value : false;
          });
        },
        getNodesByTag: function(tag) {
          return this.nodeHash.filter(function(node) {
            return node ? node.getTag() === tag : false;
          });
        },
        removeNode: function(id) {
          this.nodeHash[id] = null;
        },
        commandAdd: function(omCommand, treeModificationTrack) {
          var parentNode = (omCommand.node.id === 0) ? null : this.getNode(omCommand.parent);
          var partRootNode = gbc.classes.NodeFactory.createRecursive(parentNode, omCommand.node, this._application,
            treeModificationTrack);
          partRootNode.createController();
          partRootNode.attachUI();
          return partRootNode;
        },
        commandUpdate: function(omCommand, treeModificationTrack) {
          var needRelayout = false,
            node = this.getNode(omCommand.id),
            attrsKeys = Object.keys(omCommand.attributes);
          if (omCommand.attributes && attrsKeys.length) {
            var a = treeModificationTrack[omCommand.id];
            if (a !== true) {
              if (!a) {
                treeModificationTrack[omCommand.id] = a = {};
              }
              var i = 0,
                len = attrsKeys.length;
              for (; i < len; i++) {
                var attr = attrsKeys[i];
                needRelayout = needRelayout || !!cls.LayoutTriggerAttributes[omCommand.type][attr];
                a[attr] = true;
              }
            }
          }
          node.updateAttributes(omCommand.attributes);
          return needRelayout;
        },
        remove: function(omNode) {
          var nodeToRemove = omNode || this._application.uiNode();
          if (nodeToRemove) {
            nodeToRemove.destroy();
          }
        },

        logFireEvent: function(eventContents) {

          // TODO USELESS ?

          var logItem = "" + this._application.applicationHash + ":FE:0:" + eventContents;

          /* if (context.$app._dvmLogger !== this) {
           context.$app._dvmLogger.contents.push(logItem);
           } else {
           this.contents.push(logItem);
           }*/
        },

        logDvm: function(dvmContents) {

          // TODO USELESS ?

          var logItem = "" + this._application.applicationHash + ":DVM:0:" + dvmContents;
          /* if (context.$app._dvmLogger !== this) {
           context.$app._dvmLogger.contents.push(logItem);
           } else {
           this.contents.push(logItem);
           }*/
        },
        linkDownload: function() {
          var data = new Blob([this.contents.join("\n")], {
            type: "text/plain"
          });

          if (this.file !== null) {
            window.URL.revokeObjectURL(this.file);
          }
          this.file = window.URL.createObjectURL(data);
          this._application.getSession().getWidget().getEndWidget().setAuiLogUrl(this._application.info().session, this.file);
          //          link.click();     // TODO USELESS ?
        }
      };
    });
    cls.ApplicationServiceFactory.register("Model", cls.AuiApplicationService);
  });
