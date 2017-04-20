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
modulum('NodeBase', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Memory implementation of an AUI Node.
     *
     * Reflects the state of the AUI node in the DVM.
     *
     * @class classes.NodeBase
     * @extends classes.EventListener
     */
    cls.NodeBase = context.oo.Class(cls.EventListener, function($super) {
      /** @lends classes.NodeBase.prototype */
      return {
        /** @lends classes.NodeBase */
        $static: {
          __attributeChangedEventNames: {},
          __attributeChangedEvent: "attributeChanged",
          attributeChangedEventName: function(attrName) {
            if (!this.__attributeChangedEventNames[attrName]) {
              this.__attributeChangedEventNames[attrName] = this.__attributeChangedEvent + attrName;
            }
            return this.__attributeChangedEventNames[attrName];
          },
          controllerCreatedEvent: "controllerCreated",
          nodeCreatedEvent: "nodeCreated",
          nodeRemovedEvent: "nodeRemoved",
          childrenCreatedEvent: "nodeChildrenCreated"
        },
        __name: "NodeBase",
        /** @type {classes.NodeBase} */
        _parent: null,
        /** @type {number} */
        _id: null,
        /** @type {classes.NodeBase[]} */
        _children: null,
        /** @protected
         *  @type {classes.ControllerBase}
         */
        _controller: null,
        /** @type classes.VMApplication */
        _application: null,
        /** @type {string} */
        _tag: null,
        /** @type {Object.<string, *>} */
        _attributes: null,
        /** @type {Object.<string, boolean>} */
        _attributesSetByVM: null,
        /** @type {Object} */
        _previousAttributes: null,
        /** @type {Object} */
        _stylesByPseudoSelectors: null,
        /** @type {string[]} */
        _activePseudoSelectors: null,
        /** @type {Object} */
        _pseudoSelectorsUsedInSubTree: {},
        /** @protected
         *  @type {boolean}
         */
        _canEmitNodeMutation: false,

        /**
         * Node object (AUI model)
         * @constructs {classes.NodeBase}
         * @param {classes.NodeBase} parent parent node
         * @param {string|nodeInfo} tag tag name (WINDOW, GROUP, MENU, etc...) or an object containing type, id, attributes
         * @param {number=} id id
         * @param {Object=} attributes attributes list
         * @param {classes.VMApplication} app application
         */
        constructor: function(parent, tag, id, attributes, app) {
          $super.constructor.call(this);

          if (!!tag && !!tag.attributes) {
            app = id;
            attributes = tag.attributes;
            id = tag.id;
            tag = tag.type;
          }
          this._parent = parent;
          this._id = id;
          this._application = app;
          this._children = [];
          this._tag = tag;

          this._attributes = {};
          this._attributesSetByVM = {};
          this._previousAttributes = {};
          // Set the default attributes
          var nodeAttributes = cls.NodeHelper.getDefaultAttributes(tag);
          for (var i = 0; i < nodeAttributes.length; i++) {
            cls.NodeHelper.setAttributeDefaultValue(this, nodeAttributes[i]);
          }
          // Set the attributes with VM info
          var attributesToSet = Object.keys(attributes);
          for (var a = 0; a < attributesToSet.length; a++) {
            var attributeName = attributesToSet[a];
            this._attributesSetByVM[attributeName] = true;
            this._attributes[attributeName] = attributes[attributeName];
          }

          // Attaching the node to its parent children list
          if (parent !== null) {
            parent.addChildNode(this);
          }

          // Registering the node in the global hash
          if (this._application) {
            this._application.model.addNode(id, this);
          }
          if (this._parent && (context.constants.theme["aui-mutation-watch"] || this._canEmitNodeMutation)) {
            this._parent._emitNodeCreated(this);
          }
          this.updateApplicableStyles();
        },
        /**
         * Destroy a node (and remove all its references)
         */
        destroy: function() {
          // destroy children first
          while (this._children.length > 0) {
            this._children[this._children.length - 1].destroy();
          }
          if (this._parent) {
            this._parent._emitNodeDestroyed(this);
          }
          // Remove node from the parent children list
          if (this._id !== 0) {
            this._parent.removeChildNode(this);
          }

          this.destroyController();
          if (this._application) {
            this._application.model.removeNode(this._id);
            this._application = null;
          }
          this._children = null;
          this._parent = null;
          $super.destroy.call(this);
        },

        _emitNodeCreated: function(node) {
          this.emit(cls.NodeBase.nodeCreatedEvent, node);
          if (this._parent) {
            this._parent._emitNodeCreated(node);
          }
        },
        _emitNodeDestroyed: function(node) {
          this.emit(cls.NodeBase.nodeRemovedEvent, node);
          if (this._parent) {
            this._parent._emitNodeDestroyed(node);
          }
        },
        isRootNode: function() {
          return this._id === 0;
        },

        /**
         * @returns {string} tag name of this node
         */
        getTag: function() {
          return this._tag;
        },

        /**
         *
         * @param {classes.NodeBase} node
         */
        addChildNode: function(node) {
          this._children.push(node);
        },
        /**
         *
         * @param {classes.NodeBase} node
         */
        removeChildNode: function(node) {
          this._children.splice(this._children.indexOf(node), 1);
        },
        /**
         *
         * @returns {classes.NodeBase}
         */
        getParentNode: function() {
          return this._parent;
        },
        /**
         * @param {string=} tag if provided, returns only child nodes of the given type.
         * @returns {classes.NodeBase[]}
         */
        getChildren: function(tag) {
          if (tag) {
            var result = [];
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._tag === tag) {
                result.push(child);
              }
            }
            return result;
          } else {
            return this._children;
          }
        },
        /**
         * @param {string=} tag if provided, returns only a child node of the given type.
         * @returns {classes.NodeBase}
         */
        getFirstChild: function(tag) {
          if (tag) {
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._tag === tag) {
                return child;
              }
            }
          } else if (!!this._children.length) {
            return this._children[0];
          }
          return null;
        },
        /**
         * @param {string=} tag if provided, returns only a child node of the given type.
         * @returns {classes.NodeBase}
         */
        getLastChild: function(tag) {
          if (tag) {
            var length = this._children.length;
            for (var i = length - 1; i > -1; i--) {
              var child = this._children[i];
              if (child._tag === tag) {
                return child;
              }
            }
          } else if (!this._children.isEmpty()) {
            return this._children[this._children.length - 1];
          }
          return null;
        },
        /**
         * Usage:
         *  - getChildrenWithAttribute("TagName", "attributeName", "attributeValue");
         *  - getChildrenWithAttribute("attributeName", "attributeValue");
         *  - getChildrenWithAttribute("attributeName");
         * @param {string=} tag node tag name
         * @param {string} attributeName searched attribute name
         * @param {string=} attributeValue searched attribute value
         * @returns {classes.NodeBase[]} List of matching nodes
         */
        getChildrenWithAttribute: function(tag, attributeName, attributeValue) {
          if (!attributeName) {
            attributeName = tag;
            tag = null;
          }
          var result = [];
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            if (!tag || child._tag === tag) {
              var value = child.attribute(attributeName);
              if (value) {
                if (!attributeValue || attributeValue === value) {
                  result.push(child);
                }
              }
            }
          }
          return result;
        },
        /**
         * Usage:
         *  - getFirstChildWithAttribute("TagName", "attributeName", "attributeValue");
         *  - getFirstChildWithAttribute("attributeName", "attributeValue");
         *  - getFirstChildWithAttribute("attributeName");
         * @param {string=} tag node tag name
         * @param {string} attributeName searched attribute name
         * @param {string=} attributeValue searched attribute value
         * @returns {classes.NodeBase} first matching node or null
         */
        getFirstChildWithAttribute: function(tag, attributeName, attributeValue) {
          if (!attributeName) {
            attributeName = tag;
            tag = null;
          }
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            if (!tag || child._tag === tag) {
              var value = child.attribute(attributeName);
              if (value) {
                if (!attributeValue || attributeValue === value) {
                  return child;
                }
              }
            }
          }
          return null;
        },
        /**
         * @param {string} node id
         * @returns {classes.NodeBase} first matching node or null
         */
        getFirstChildWithId: function(id) {
          if (this._children) {
            var length = this._children.length;
            for (var i = 0; i < length; ++i) {
              var child = this._children[i];
              if (child._id === id) {
                return child;
              }
            }
          }
          return null;
        },
        /**
         * Will return the first ancestor that has this tag, null otherwise.
         * @param {String} tag name of the ancestor node
         * @returns {classes.NodeBase} a node if found, null otherwise
         */
        getAncestor: function(tag) {
          var result = this._parent;
          while (result && result._tag !== tag) {
            result = result._parent;
          }
          return result;
        },
        /**
         * @param tag tag name of the descendants
         * @returns {classes.NodeBase[]} list of descendants matching the given tag
         * @private
         */
        getDescendants: function(tag) {
          return this._getDescendants(tag);
        },

        /**
         * @param tag tag name of the descendants
         * @param {classes.NodeBase[]} result optional array to populate. (For internal use only)
         * @returns {classes.NodeBase[]} list of descendants matching the given tag
         * @private
         */
        _getDescendants: function(tag, result) {
          if (result === undefined) {
            result = [];
          } else if (tag === this._tag) {
            // Matching tags should only be added for children
            result.push(this);
          }
          var length = this._children.length;
          for (var i = 0; i < length; ++i) {
            var child = this._children[i];
            child._getDescendants(tag, result);
          }
          return result;
        },

        /**
         * @param {string=} tag tag name of the siblings to consider
         * @returns {number} The index of this node in its parent's children array
         */
        getIndex: function(tag) {
          var siblings = this._parent._children;
          var length = siblings.length;
          var index = 0;
          for (var i = 0; i < length; ++i) {
            var sibling = siblings[i];
            if (sibling === this) {
              break;
            }
            if (!tag || sibling._tag === tag) {
              ++index;
            }
          }
          return index;
        },

        /**
         * Will get the previous Sibling node
         * @param {String} tag optional tag name to limit result by name
         * @returns {*|node} next Sibling if exists
         */
        getPreviousSibling: function(tag) {
          var children = this.getParentNode().getChildren();
          var initialIndex = children.indexOf(this);
          var index = -1;
          if (tag) {
            if (!Array.isArray(tag)) {
              tag = [tag];
            }
            for (var i = initialIndex - 1; i >= 0; i--) {
              var child = children[i];
              if (tag.indexOf(child._tag) !== -1) {
                index = i;
                break;
              }
            }
          } else {
            index = initialIndex - 1;
          }
          if (index < 0) {
            return null;
          }
          return children[index];
        },

        /**
         * Will get the next Sibling node
         * @param {String} tag optional tag name to limit result by name
         * @returns {*|node} next Sibling if exists
         */
        getNextSibling: function(tag) {
          var children = this.getParentNode().getChildren(),
            len = children.length;
          var initialIndex = children.indexOf(this);
          var index = len;
          if (tag) {
            if (!Array.isArray(tag)) {
              tag = [tag];
            }
            for (var i = initialIndex + 1; i < len; i++) {
              var child = children[i];
              if (tag.indexOf(child._tag) !== -1) {
                index = i;
                break;
              }
            }
          } else {
            index = initialIndex + 1;
          }
          if (index >= len) {
            return null;
          } else {
            return children[index];
          }
        },
        findNodeWithAttributeValue: function(tag, attributeName, attributeValue) {
          var tagged = this.getDescendants(tag);
          for (var i = 0; i < tagged.length; i++) {
            if (tagged[i].attribute(attributeName) === attributeValue) {
              return tagged[i];
            }
          }
          return null;
        },

        forThisAndEachDescendant: function(callback) {
          callback(this);
          for (var i = 0; i < this._children.length; ++i) {
            this._children[i].forThisAndEachDescendant(callback);
          }
        },

        /**
         *
         * @returns {classes.VMApplication}
         */
        getApplication: function() {
          return this._application;
        },
        /**
         *
         * @param {Object.<string, *>} attributes
         */
        updateAttributes: function(attributes) {
          //          this._previousAttributes = Object.clone(this._attributes);
          var attributesToSet = Object.keys(attributes);
          for (var a = 0; a < attributesToSet.length; a++) {
            var attributeName = attributesToSet[a];
            this._attributesSetByVM[attributeName] = true;
            var oldValue = this._previousAttributes[attributeName] = this._attributes[attributeName];
            var newValue = attributes[attributeName];
            //if (oldValue !== newValue) {
            this._attributes[attributeName] = newValue;
            this.emit(cls.NodeBase.attributeChangedEventName(attributeName), {
              node: this,
              attr: attributeName,
              old: oldValue,
              new: newValue,
              changed: newValue !== oldValue
            });
            //}
          }
        },
        /**
         *
         * @param {string} attributeName
         * @returns {*}
         */
        attribute: function(attributeName) {
          return this._attributes[attributeName];
        },
        /**
         *
         * @param {string} attributeName
         * @returns {*}
         */
        previousAttribute: function(attributeName) {
          return this._previousAttributes[attributeName];
        },

        /**
         * @param attributeName name of the attribute
         * @returns {boolean} true if the attribute has been set by the VM, false otherwise
         */
        isAttributesSetByVM: function(attributeName) {
          return this._attributesSetByVM.hasOwnProperty(attributeName);
        },
        isAttributePresent: function(attributeName) {
          return this._attributes.hasOwnProperty(attributeName);
        },
        /**
         *
         * @param {string} attributeName
         * @param {Function} handler
         * @returns {HandleRegistration}
         */
        onAttributeChanged: function(attributeName, handler) {
          return this.when(cls.NodeBase.attributeChangedEventName(attributeName), this._onAttributeChanged.bind(null, handler));
        },
        _onAttributeChanged: function(handler, event, node, data) {
          handler(event, node, data);
        },
        updateApplicableStyles: function(recursive) {
          var i, ui = this.getApplication().uiNode();
          var matchingAttributesByPseudoSelectors = {};
          var styleLists = ui.getChildren('StyleList');
          for (i = 0; i < styleLists.length; i++) {
            var styleList = styleLists[i];
            styleList.populateMatchingStyles(matchingAttributesByPseudoSelectors, this);
          }
          this._stylesByPseudoSelectors = [];
          var pseudoSelectorKeys = Object.keys(matchingAttributesByPseudoSelectors);
          for (i = 0; i < pseudoSelectorKeys.length; i++) {
            var pseudoSelectorKey = pseudoSelectorKeys[i];
            var styleAttributes = matchingAttributesByPseudoSelectors[pseudoSelectorKey];
            var styles = {};
            var styleAttributeKeys = Object.keys(styleAttributes);
            for (var k = 0; k < styleAttributeKeys.length; k++) {
              var styleAttributeName = styleAttributeKeys[k];
              styles[styleAttributeName] = styleAttributes[styleAttributeName];
            }
            this._stylesByPseudoSelectors.push({
              pseudoSelector: styleAttributes[styleAttributeKeys[0]].getParentNode().getPseudoSelectors(),
              styles: styles
            });
          }
          // Sort by pseudo-selector priority
          this._stylesByPseudoSelectors.sort(this._pseudoSelectorPrioritySorter);
          if (!!recursive) {
            for (i = 0; i < this._children.length; ++i) {
              this._children[i].updateApplicableStyles(true);
            }
          }
        },
        resetActivePseudoSelectors: function() {
          this._activePseudoSelectors = null;
        },
        resetPseudoSelectorsUsedInSubTree: function() {
          this._pseudoSelectorsUsedInSubTree = {};
        },
        updatePseudoSelectorsUsedInSubTree: function(recursive) {
          var pseudoSelectors = {};
          for (var i = 0; i < this._stylesByPseudoSelectors.length; ++i) {
            var entry = this._stylesByPseudoSelectors[i];
            for (var j = 0; j < entry.pseudoSelector.length; ++j) {
              pseudoSelectors[entry.pseudoSelector[j]] = true;
            }
          }
          pseudoSelectors = Object.keys(pseudoSelectors);
          for (i = 0; i < pseudoSelectors.length; ++i) {
            var pseudoSelector = pseudoSelectors[i];
            var p = this;
            while (p !== null) {
              if (!p._pseudoSelectorsUsedInSubTree[pseudoSelector]) {
                p._pseudoSelectorsUsedInSubTree[pseudoSelector] = true;
                p = p._parent;
              } else {
                break;
              }
            }
          }

          if (!!recursive) {
            for (i = 0; i < this._children.length; ++i) {
              this._children[i].updatePseudoSelectorsUsedInSubTree(true);
            }
          }
        },
        _pseudoSelectorPrioritySorter: function(pss1, pss2) {
          var firstStyleAttr1 = pss1.styles[Object.keys(pss1.styles)[0]];
          var firstStyleAttr2 = pss2.styles[Object.keys(pss2.styles)[0]];
          var pss1Weight = firstStyleAttr1.getParentNode().getPseudoSelectorWeight();
          var pss2Weight = firstStyleAttr2.getParentNode().getPseudoSelectorWeight();
          return pss2Weight - pss1Weight;
        },
        /**
         * return the value of the specified style attribute for the current node
         * @param {string} styleAttr
         * @param {Array.string=} forcedPseudoSelectors
         * @returns {string}
         */
        getStyleAttribute: function(styleAttr, forcedPseudoSelectors) {
          return this._getStyleAttributeImpl(styleAttr, forcedPseudoSelectors);
        },

        /**
         * return the value of the specified style attribute for the current node
         * This is the implementation method which computes the style.
         * The public getStyleAttribute method invokes this method directly or forwards it
         * to the appropriate node depending on the context (FormFieldNode, ValueNode)
         * @param {string} styleAttr
         * @param {Array.string=} forcedPseudoSelectors
         * @returns {string}
         */
        _getStyleAttributeImpl: function(styleAttr, forcedPseudoSelectors) {
          if (!this._application.usedStyleAttributes[styleAttr]) {
            return null;
          }
          var pseudoSelectors = forcedPseudoSelectors;
          if (!pseudoSelectors) {
            if (!this._activePseudoSelectors) {
              this._activePseudoSelectors = this._computePseudoSelectors();
            }
            pseudoSelectors = this._activePseudoSelectors;
          }
          var matchingStyleAttribute = null;
          var pseudoSelectorCheck = function(ps) {
            return pseudoSelectors.indexOf(ps) !== -1;
          };
          for (var i = 0; i < this._stylesByPseudoSelectors.length; ++i) {
            var pseudoSelectorStyle = this._stylesByPseudoSelectors[i];
            // dict lookup first, as it is faster
            var styleAttribute = pseudoSelectorStyle.styles[styleAttr];
            if (styleAttribute !== undefined) {
              var matches = pseudoSelectorStyle.pseudoSelector.every(pseudoSelectorCheck);
              if (matches) {
                matchingStyleAttribute = styleAttribute;
                break;
              }
            }
          }
          if (matchingStyleAttribute) {
            return matchingStyleAttribute.attribute('value');
          } else {
            var parent = this.getParentNode();
            if (parent) {
              return parent._getStyleAttributeImpl(styleAttr, pseudoSelectors);
            } else {
              return null;
            }
          }
        },

        _computePseudoSelectors: function() {
          var focusedNodeIdRef = this.getApplication().uiNode().attribute('focus');
          var pseudoSelectors = this._populatePseudoSelectors({
            __dialogTypeDefined: false,
            __activeDefined: false
          }, focusedNodeIdRef);
          var availableSelectors = [];
          var keys = Object.keys(pseudoSelectors);
          for (var i = 0; i < keys.length; i++) {
            var ps = keys[i];
            if (pseudoSelectors[ps]) {
              availableSelectors.push(ps);
            }
          }
          return availableSelectors;
        },

        /**
         * @param pseudoSelectors a dictionnary which will be populated. Keys are the active pseudo-selectors
         * @param focusedNodeIdRef the idref of the focused node. Passed as parameter to avoid tree lookups.
         * @returns {Object} returns the pseudoSelectors parameter
         * @private
         */
        _populatePseudoSelectors: function(pseudoSelectors, focusedNodeIdRef) {
          var dialogType = this.attribute('dialogType');
          if (focusedNodeIdRef === this._id &&
            (dialogType && (dialogType === 'Display' || dialogType === 'DisplayArray') || this._tag !== 'Table' && this._tag !==
              'Matrix') && !Object.isBoolean(pseudoSelectors.focus)) {
            // Table and Matrix focus is ignored as the real focused item is their current element
            pseudoSelectors.focus = true;
          }
          var active = this.attribute('active');
          // active will be undefined if the current node doesn't have this attribute
          if (active !== undefined) {
            var noEntry = this.attribute('noEntry');
            if (!pseudoSelectors.__dialogTypeDefined) {
              if (!!active || !!noEntry) {
                if (!!dialogType) {
                  pseudoSelectors.__dialogTypeDefined = true;
                  if (dialogType === 'Display' || dialogType === 'DisplayArray') {
                    pseudoSelectors.display = true;
                    pseudoSelectors.input = false;
                    pseudoSelectors.query = false;
                  } else if (dialogType === 'Input' || dialogType === 'InputArray') {
                    pseudoSelectors.display = false;
                    pseudoSelectors.input = true;
                    pseudoSelectors.query = false;
                  } else if (dialogType === 'Construct') {
                    pseudoSelectors.display = false;
                    pseudoSelectors.input = false;
                    pseudoSelectors.query = true;
                  }
                }
              } else {
                pseudoSelectors.__dialogTypeDefined = true;
                pseudoSelectors.display = false;
                pseudoSelectors.input = false;
                pseudoSelectors.query = false;
              }
            }
            if (!pseudoSelectors.__activeDefined) {
              pseudoSelectors.__activeDefined = true;
              if (!!active) {
                pseudoSelectors.active = true;
              } else {
                pseudoSelectors.inactive = true;
              }
            }
          }

          if (!!this._parent) {
            return this._parent._populatePseudoSelectors(pseudoSelectors, focusedNodeIdRef);
          } else {
            return pseudoSelectors;
          }
        },

        /**
         * @returns {classes.ControllerBase}
         */
        createController: function(_queue, force) {
          if (!this.isInStretchableScrollGrid() || force) {
            var queue = _queue || [];
            if (!this._controller) {
              queue.push(this._id);
              this._createChildrenControllers(queue);
            }
            if (!_queue) {
              for (var i = 0; i < queue.length; i++) {
                var node = this._application.model.getNode(queue[i]);
                node._controller = node._createController();
                node.emit(cls.NodeBase.controllerCreatedEvent);
              }
            }
          }
        },
        whenControllerCreated: function(hook) {
          return this.when(cls.NodeBase.controllerCreatedEvent, hook);
        },
        /**
         * Applies all behaviors
         */
        applyBehaviors: function(treeModificationTrack, recursive, force) {
          var stillDirty = false;
          var start = 0;
          var park = [this];
          if (recursive) {
            while (park.length) {
              var i = park.shift();
              park.unshift.apply(park, i._children);
              if (i._controller) {
                stillDirty = i._controller.applyBehaviors(treeModificationTrack, force) || stillDirty;
              }
            }
          } else {
            if (this._controller) {
              stillDirty = this._controller.applyBehaviors(treeModificationTrack, force) || stillDirty;
            }
          }
          return stillDirty;
        },
        /**
         *
         * @returns {classes.ControllerBase}
         * @protected
         */
        _createController: function() {
          return null;
        },
        /**
         *
         * @protected
         */
        _createChildrenControllers: function(_queue) {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i].createController(_queue);
          }
        },
        /**
         * Removes the associated controller
         */
        destroyController: function() {
          if (this._controller) {
            this._controller.destroy();
            this._controller = null;
          }
        },
        /**
         *
         * @returns {Element | Element[]}
         */
        attachUI: function() {
          for (var i = 0; i < this._children.length; i++) {
            this._children[i].attachUI();
          }
          if (!!this.getController() && !!this.getController().getWidget()) {
            this.getController().attachUI();
            return this.getController().getWidget().getElement();
          } else {
            return null;
          }
        },
        /**
         *
         * @returns {classes.ControllerBase}
         */
        getController: function() {
          return this._controller;
        },

        /**
         *
         * @returns {number}
         */
        getId: function() {
          return this._id;
        },
        onNodeCreated: function(hook, tag) {
          return this.when(cls.NodeBase.nodeCreatedEvent, this._onNodeCreated.bind(null, tag, hook));
        },
        _onNodeCreated: function(tag, hook, event, src, node) {
          if (!tag || tag === node._tag) {
            hook(event, src, node);
          }
        },
        onNodeRemoved: function(hook, tag) {
          return this.when(cls.NodeBase.nodeRemovedEvent, this._onNodeRemoved.bind(this, tag, hook));
        },
        _onNodeRemoved: function(tag, hook, event, src, node) {
          if (!tag || tag === node._tag) {
            hook(event, src, node);
          }
        },
        /**
         * Once all children are created, emit the corresponding event
         */
        childrenCreated: function() {
          this.emit(cls.NodeBase.childrenCreatedEvent);
        },

        getJson: function(recursive) {
          if (typeof recursive === "undefined") {
            recursive = false;
          }

          var jsonTree = {
            id: this._id,
            name: this._tag,
            attributes: this._attributes,
            children: recursive ? [] : null
          };

          if (recursive) {
            if (this._children.length > 0) {
              for (var i = 0; i < this._children.length; i++) {
                jsonTree.children.push(this._children[i].getJson(true));
              }
            } else {
              jsonTree.children = false;
            }
          }

          return this._id === 0 ? [jsonTree] : jsonTree;
        },

        isInStretchableScrollGrid: function() {
          var parent = this._parent;
          while (parent) {
            if (parent.getTag() === "ScrollGrid" && parent.attribute("wantFixedPageSize") === 0) {
              return true;
            }
            parent = parent._parent;
          }
          return false;
        }
      };
    });
  });
