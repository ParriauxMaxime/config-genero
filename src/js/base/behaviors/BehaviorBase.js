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

modulum('BehaviorBase', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base class for all behaviors
     * @class classes.BehaviorBase
     */
    cls.BehaviorBase = context.oo.Class(function($super) {
      /** @lends classes.BehaviorBase.prototype */
      return {
        __name: "BehaviorBase",
        /**
         * @protected
         * @type {watchedAttribute[]}
         */
        _watchedAttributes: null,
        usedStyleAttributes: [],
        /**
         * @constructs {classes.BehaviorBase}
         */
        constructor: function() {
          this.watchedBindings = this.watchedAttributes && Object.keys(this.watchedAttributes);
          this.watchedBindingsCount = this.watchedBindings && this.watchedBindings.length;
        },
        /**
         * Applies the behavior on the widget
         */
        apply: function(controller, data) {
          data.dirty = false;
          return this._apply(controller, data);
        },
        /**
         * @protected
         */
        _apply: function(controller, data) {
          context.LogService.error("Behavior " + this.__name + " must override apply()");
        },
        /**
         * Attaches the needed observers to the AUI tree.
         * This is the top level implementation. Checks that the behavior isn't already attached
         */
        attach: function(controller, data) {
          if (data._attached) {
            this.detach(controller, data);
          }
          if (this._attach) {
            this._attach(controller, data);
          }
          data._attached = true;
        },
        /**
         * get a list of pair node/attribute names
         * @protected
         * @returns {watchedAttribute[]}
         */
        _getWatchedAttributes: function() {
          return this._watchedAttributes;
        },

        /**
         * Attaches the needed observers to the AUI tree
         * @protected
         */
        _attach: null,
        /**
         * Detached all AUI tree observers*
         * This is the top level implementation. Checks that the behavior is attached
         */
        detach: function(controller, data) {
          if (data._attached) {
            if (this._detach) {
              this._detach(controller, data);

            }
            data._attached = false;
          }
        },
        /**
         * Detached all AUI tree observers
         * @protected
         */
        _detach: null,
        /**
         * Attaches the needed observers Widget.
         * This is the top level implementation. Checks that the behavior isn't already attached
         */
        attachWidget: function(controller, data) {
          if (data._attachedWidget) {
            this.detachWidget(controller, data);
          }
          if (this._attachWidget) {
            this._attachWidget(controller, data);
            data._attachedWidget = true;
          }
        },
        /**
         * Attaches the needed observers to Widget
         * @protected
         */
        _attachWidget: null,
        /**
         * Detached all Widget observers*
         * This is the top level implementation. Checks that the behavior is attached
         */
        detachWidget: function(controller, data) {
          if (data._attachedWidget) {
            this._detachWidget(controller, data);
            data._attachedWidget = false;
          }
        },
        /**
         * Detached all Widget observers
         * @protected
         */
        _detachWidget: function(controller, data) {

        },

        firstAttach: function(controller, data) {
          if (!data._attached) {
            this.attach(controller, data);
          }
          if (!data._attachedWidget) {
            this.attachWidget(controller, data);
          }
        },

        canApply: function(controller, data, treeModificationTrack) {
          if (data.dirty) {
            return true;
          }

          if (this.watchedAttributes) {
            var len = this.watchedBindingsCount;
            for (var i = 0; i < len; ++i) {
              var nodeBinding = this.watchedBindings[i];
              var node = controller._nodeBindings[nodeBinding];
              if (!!node) {
                var modifiedAttributes = !treeModificationTrack || treeModificationTrack[node._id];
                if (modifiedAttributes === true) {
                  return true;
                }
                if (!!modifiedAttributes) {
                  var nodeWatchedAttributes = this.watchedAttributes[nodeBinding],
                    attrLen = nodeWatchedAttributes.length;
                  for (var j = 0; j < attrLen; ++j) {
                    if (modifiedAttributes[nodeWatchedAttributes[j]]) {
                      return true;
                    }
                  }
                }
              }
            }
          }
          //return false;

          var watched = this._getWatchedAttributes();
          if (watched) {
            var xi = 0,
              xlen = watched.length;

            for (; xi < xlen; xi++) {
              var current = watched[xi];
              if (!current.node) {
                continue;
              }
              var a = treeModificationTrack[current.node._id];
              if (a === true) {
                return true;
              }
              if (!!a && !!a[current.attribute]) {
                return true;
              }
            }
          }
          return false;
        },
        /**
         * Cleans up the behavior
         */
        destroy: function(controller, data) {
          this.detachWidget(controller, data);
          this.detach(controller, data);
        }
      };
    });
  });
