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
 * @property {NodeBase} anchor
 * @property {?NodeBase} decorator
 * @property {?NodeBase} container
 */

modulum('ControllerBase', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base controller for an AUI node.
     * Manages client side life cycle representation of the node.
     * @class classes.ControllerBase
     * @extends classes.EventListener
     */
    cls.ControllerBase = context.oo.Class(cls.EventListener, function($super) {
      /** @lends classes.ControllerBase.prototype */
      return {
        __name: "ControllerBase",
        /**
         * @type {ControllerBindings}
         */
        _nodeBindings: null,
        /**
         * @type {Object[]}
         */
        _behaviors: null,
        /**
         * @type classes.WidgetBase
         */
        _widget: null,
        /**
         * @type string
         */
        _widgetKind: null,
        /**
         * @type boolean
         */
        _widgetActive: null,
        /**
         * @type string
         */
        _widgetType: null,

        /**
         * @constructs {classes.ControllerBase}
         * @param {ControllerBindings} bindings
         */
        constructor: function(bindings) {
          $super.constructor.call(this);
          this._nodeBindings = bindings;
          this._behaviors = [];
          this.createWidget();
          this._initBehaviors();
          if (gbc.qaMode) {
            this._addBehavior(cls.QAInfoVMBehavior);
          }
        },

        _initWidgetKind: function() {
          if (this._nodeBindings.container) {
            this._widgetKind = this._nodeBindings.container.attribute("dialogType");
            this._widgetActive = this._nodeBindings.container.attribute("active");
          }
          this._widgetType = this._getWidgetType(this._widgetKind, this._widgetActive);
        },

        /**
         *
         * @protected
         * @abstract
         */
        _initBehaviors: Function.noop,
        /**
         * @protected
         */
        _addBehavior: function(BehaviorClass, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          var behaviorContainer = {
            _behavior: BehaviorClass,
            dirty: true
          };
          if (BehaviorClass.setup) {
            BehaviorClass.setup(this, behaviorContainer, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
          }
          this._behaviors.push(behaviorContainer);
          BehaviorClass.firstAttach(this, behaviorContainer);
        },
        /**
         * Applies all behaviors attached to this controller
         */
        applyBehaviors: function(treeModificationTrack, force) {
          var remainingDirty = false;
          var invalidatesFollowing = false;
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            var behavior = behaviorContainer._behavior;
            if (behavior === cls.QAInfoVMBehavior) {
              behavior.apply(this, behaviorContainer);
            } else {
              if (force || invalidatesFollowing || behavior.canApply(this, behaviorContainer, treeModificationTrack)) {
                invalidatesFollowing = behavior.apply(this, behaviorContainer) || invalidatesFollowing;
              }
              remainingDirty = remainingDirty || behavior.dirty;
            }
          }
          return remainingDirty;
        },
        /**
         *
         * @protected
         */
        _attachWidget: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.attachWidget(this, behaviorContainer);
          }
        },
        /**
         *
         * @protected
         */
        _detachWidget: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.detachWidget(this, behaviorContainer);
          }
        },
        /**
         *
         * @protected
         */
        _destroyBehaviors: function() {
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            behaviorContainer._behavior.destroy(this, behaviorContainer);
          }
          this._behaviors.length = 0;
        },
        /**
         *
         */
        destroy: function() {
          this._destroyBehaviors();
          this.detachUI();
          this._nodeBindings = null;
          $super.destroy.call(this);
        },
        /**
         * Get the anchor node
         * @returns {classes.NodeBase}
         */
        getAnchorNode: function() {
          return this._nodeBindings.anchor;
        },
        /**
         * Get the application node
         * @returns {classes.NodeBase}
         */
        getUINode: function() {
          return this._nodeBindings.ui;
        },
        /**
         *
         * @returns {ControllerBindings}
         */
        getNodeBindings: function() {
          return this._nodeBindings;
        },
        /**
         *
         * @returns {classes.WidgetBase}
         */
        createWidget: function() {
          if (!this._widget && this.shouldCreateWidget()) {
            this._initWidgetKind();
            this._widget = this._createWidget(this._widgetType);
          }
          return this._widget;
        },

        /**
         * Check if the widget should be created.
         */
        shouldCreateWidget: function() {
          return true;
        },

        /**
         * Basic widget types depending of dialogType. To override for specific rules
         * @param {string} kind widget dialogType
         * @param {boolean} active is dialog active ?
         * @returns {string} widget type
         * @protected
         */
        _getWidgetType: function(kind, active) {
          return this.__name.replace("Controller", "");
        },

        /**
         *
         * @param {string=} type
         * @returns {classes.WidgetBase}
         * @protected
         */
        _createWidget: function(type) {
          return cls.WidgetFactory.create(type, this.getAnchorNode().attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable,
            inMatrix: this.isInMatrix
          });
        },
        /**
         * Recreate widget depending on dialogType
         * @param {string} kind
         * @param {boolean} active is dialog active ?
         */
        changeWidgetKind: function(kind, active) {
          if ((kind !== this._widgetKind || active !== this._widgetActive) && this.shouldCreateWidget()) {
            this._widgetKind = kind;
            this._widgetActive = active;
            var type = this._getWidgetType(kind, active);
            if (type !== this._widgetType) {
              this._widgetType = type;
              var oldWidget = this._widget;
              this._detachWidget();
              this._widget = this._createWidget(type);
              if (this._widget) {
                if (oldWidget) {
                  oldWidget.replaceWith(this._widget);
                } else {
                  // No older widget to replace, attach new one
                  this.attachUI();
                }
              }

              if (oldWidget) {
                oldWidget.destroy();
              }
              this._attachWidget();
              return true;
            }
          }
          return false;
        },

        attachUI: function() {
          cls.NodeHelper.addToParentWidget(this.getAnchorNode());
        },

        detachUI: function() {
          if (this._widget) {
            this._widget.destroy();
            this._widget = null;
          }
        },

        /**
         *
         * @returns {classes.WidgetBase}
         */
        getWidget: function() {
          return this._widget;
        },

        /**
         * Ensures the widget corresponding to this controller is visible to the user
         */
        ensureVisible: function() {
          var p = this.getAnchorNode().getParentNode();
          while (p !== null) {
            var controller = p.getController();
            if (controller !== null) {
              controller.ensureVisible();
              break;
            }
            p = p.getParentNode();
          }
        },

        setFocus: function() {
          if (this._widget && this._widget.setFocus) {
            this._widget.setFocus();
          }
        },

        setStyleBasedBehaviorsDirty: function(noUsageCheck, noRecurse) {
          var app = this.getAnchorNode().getApplication();
          for (var i = 0; i < this._behaviors.length; i++) {
            var behaviorContainer = this._behaviors[i];
            var behavior = behaviorContainer._behavior,
              len = behavior.usedStyleAttributes && behavior.usedStyleAttributes.length;
            if (len) {
              if (noUsageCheck) {
                behaviorContainer.dirty = true;
              } else {
                for (var j = 0; j < len; ++j) {
                  if (app.usedStyleAttributes[behavior.usedStyleAttributes[j]]) {
                    behaviorContainer.dirty = true;
                    break;
                  }
                }
              }
            }
          }
          if (!noRecurse) {
            var children = this.getAnchorNode().getChildren();
            for (i = 0; i < children.length; ++i) {
              var child = children[i];
              var ctrl = child.getController();
              if (ctrl) {
                ctrl.setStyleBasedBehaviorsDirty();
              }
            }
          }
        }
      };
    });
  });
