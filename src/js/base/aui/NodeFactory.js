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
/**
 * @typedef {Object} nodeInfo
 * @property {string} type
 * @property {number} id
 * @property {Object.<string, *>} attributes
 * @property {nodeInfo[]} children
 */

modulum('NodeFactory', ['Factory', 'StandardNode'],

  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.NodeFactory
     */
    cls.NodeFactory = context.oo.StaticClass(function() {
      var factory = new cls.Factory("Node", cls.StandardNode);
      /** @lends classes.NodeFactory */
      return {
        /**
         *
         * @param {string} type
         * @param {Function} constructor
         */
        register: function(type, constructor) {
          factory.register(type, constructor);
        },
        /**
         *
         * @param {string} type
         */
        unregister: function(type) {
          factory.unregister(type);
        },
        /**
         *
         * @param {string} type
         * @returns {classes.NodeBase}
         */
        create: function(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          return factory.create(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        },
        /**
         *
         * @param {classes.NodeBase} parent
         * @param {nodeInfo} nodeInfo
         * @param {classes.VMApplication=} app
         * @returns {classes.NodeBase[]}
         */
        createRecursive: function(parent, nodeInfo, app, treeModificationTrack) {
          if (!treeModificationTrack) {
            treeModificationTrack = [];
          }
          return this._createRecursive(parent, nodeInfo, app, treeModificationTrack);
        },
        /**
         *
         * @param {classes.NodeBase[]} result
         * @param {classes.NodeBase} parent
         * @param {nodeInfo} nodeInfo
         * @param {classes.VMApplication=} app
         * @private
         */
        _createRecursive: function(parent, nodeInfo, app, treeModificationTrack) {
          var current = factory.create.call(factory, nodeInfo.type, parent, nodeInfo, app);
          treeModificationTrack[current._id] = true;
          if (nodeInfo.children && Array.isArray(nodeInfo.children)) {
            for (var i = 0; i < nodeInfo.children.length; i++) {
              this._createRecursive(current, nodeInfo.children[i], app, treeModificationTrack);
            }
          }
          current.childrenCreated();
          return current;
        }
      };
    });
  });
