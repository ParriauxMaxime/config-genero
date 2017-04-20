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
 * @typedef {Object} ControllerBindings
 * @property {classes.NodeBase} anchor
 * @property {?classes.NodeBase} decorator
 * @property {?classes.NodeBase} container
 */

modulum('ControllerGroup', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class classes.ControllerGroup
     * @extends classes.EventListener
     */
    cls.ControllerGroup = context.oo.Class(cls.EventListener, function($super) {
      /** @lends classes.ControllerGroup.prototype */
      return {
        __name: "ControllerGroup",
        /**
         * @type {NodeBase}
         */
        _anchorNode: null,
        /**
         * @type {ControllerBase[]}
         */
        _controllers: null,

        /**
         * @constructs {classes.ControllerGroup}
         * @param {ControllerBindings} anchorNode bindings
         */
        constructor: function(anchorNode) {
          $super.constructor.call(this);
          this._anchorNode = anchorNode;
          this._controllers = [];
        },

        addController: function(controller) {
          this._controllers.push(controller);
        },

        getControllers: function() {
          return this._controllers;
        },

        /**
         * Applies all behaviors of sub-controllers
         */
        applyBehaviors: function(treeModificationTrack, force) {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].applyBehaviors(treeModificationTrack, force);
          }
        },

        destroy: function() {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].destroy();
          }
        },
        /**
         * Get the anchor node
         * @returns {classes.NodeBase}
         */
        getAnchorNode: function() {
          return this._anchorNode;
        },

        getWidget: function() {
          if (this._controllers.length) {
            return this._controllers[this._controllers.length - 1].getWidget();
          } else {
            return null;
          }
        },

        setStyleBasedBehaviorsDirty: function(noUsageCheck, noRecurse) {
          for (var i = 0; i < this._controllers.length; ++i) {
            this._controllers[i].setStyleBasedBehaviorsDirty(noUsageCheck, noRecurse);
          }
        },

        ensureVisible: function() {}
      };
    });
  }
);
