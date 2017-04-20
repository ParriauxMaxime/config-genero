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

modulum('TableColumnItemWidget', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Table column widget.
     * @class classes.TableColumnItemWidget
     * @extends classes.WidgetGroupBase
     */
    cls.TableColumnItemWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.TableColumnItemWidget.prototype */
      return {
        __name: "TableColumnItemWidget",

        _leafSymbol: ' ',
        _collapsedSymbol: '\u25ba',
        _expandedSymbol: '\u25bc',
        /**
         * @type Element
         */
        _treeAnchor: null,
        _imageWidget: null,
        _imageSpanElement: null,

        clickHandler: null,
        _dndEnabled: false,
        _currentImagePath: null,

        _current: false,
        _clientSelected: false,

        /**
         * @constructs {classes.TableColumnItemWidget}
         */
        constructor: function(opts) {
          opts = (opts || {});
          var isTreeItem = opts.isTreeItem;
          opts.inTable = true;
          $super.constructor.call(this, opts);

          if (isTreeItem) {
            this._treeAnchor = document.createElement("span");
            this._treeAnchor.addClass("gbc_TreeAnchor");
            this._element.prependChild(this._treeAnchor);
            this._treeAnchor.on('click.TableColumnItemWidget', this._treeAnchorClick.bind(this));
            this._element.onDoubleTap("TreeAnchor", this._treeAnchorClick.bind(this));
            this.setLeaf(true);
          }
        },

        _initLayout: function() {
          // no layout
        },

        destroy: function() {
          if (this.clickHandler) {
            this.clickHandler();
          }
          if (this._treeAnchor) {
            this._treeAnchor.off('click.TableColumnItemWidget');
            this._element.offDoubleTap("TreeAnchor");
          }
          if (this._imageWidget) {
            this._imageWidget.destroy();
            this._imageWidget = null;
          }
          $super.destroy.call(this);
        },

        _treeAnchorClick: function() {
          this.emit(context.constants.widgetEvents.click);
        },
        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          if (this._children.length !== 0) {
            throw "A item only contain a single child";
          }
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * Sets the background color
         * @see http://www.w3.org/wiki/CSS/Properties/background-color
         * @param {String} color a CSS color definition. Can be a color name ('red', 'blue'),
         *                 an hex code ('#f5d48a') or a color function ('rgb(128, 255, 0)')
         *                 null restores the default value.
         */
        setBackgroundColor: function(color) {
          this._backgroundColor = color;
          this.setStyle({
            selector: ":not(.currentRow)",
            appliesOnRoot: true
          }, {
            "background-color": !!color && !this._ignoreBackgroundColor ? color : null
          });
        },

        /**
         * Enable Dnd
         * @param b
         */
        setDndEnabled: function(b) {
          if (this._dndEnabled !== b) {
            this._dndEnabled = b;
            if (b) {
              this._element.setAttribute("draggable", "true");
            } else {
              this._element.removeAttribute("draggable");
            }
          }
        },

        /**
         * @returns {boolean} true if the element is a tree item, false otherwise
         */
        isTreeItem: function() {
          return !!this._treeAnchor;
        },

        /**
         * @param {boolean} leaf true if the item is a leaf item, false otherwise
         */
        setLeaf: function(leaf) {
          if (this.isTreeItem()) {
            if (leaf) {
              this._treeAnchor.textContent = this._leafSymbol;
            } else {
              this._treeAnchor.textContent = this._collapsedSymbol;
            }
          }
        },

        /**
         * @returns {boolean} leaf true if the item is a leaf item, false otherwise
         */
        isLeaf: function() {
          return this.isTreeItem() && this._treeAnchor.textContent === this._leafSymbol;
        },

        /**
         * @param {boolean} expanded true if the item should be expanded, false otherwise
         */
        setExpanded: function(expanded) {
          if (this.isTreeItem() && !this.isLeaf()) {
            if (expanded) {
              this._treeAnchor.textContent = this._expandedSymbol;
            } else {
              this._treeAnchor.textContent = this._collapsedSymbol;
            }
            var qaElement = this.getContainerElement().querySelector("[data-gqa-name]");
            if (qaElement) {
              qaElement.setAttribute('data-gqa-expanded', expanded.toString());
            }
          }
        },

        /**
         * @returns {boolean} true if the item is expanded, false otherwise
         */
        isExpanded: function() {
          return this.isTreeItem() && this._treeAnchor.textContent === this._expandedSymbol;
        },

        isReversed: function() {
          // executed on table column
          return this._parentWidget.isReversed();
        },

        /**
         * Updates visibility depending on the number of visible rows defined in the parent TableWidget
         */
        updateVisibility: function() {
          var visibleRows = this.getParentWidget().getParentWidget().getVisibleRows();
          this.setHidden(this.getItemIndex() >= visibleRows);
        },

        /**
         * @param {number} depth item depth
         */
        setDepth: function(depth) {
          var depthObj = {};
          depthObj["padding-" + this.getStart()] = depth + 'em';
          this.setStyle(depthObj);
        },

        /**
         * @returns {number} item depth
         */
        getDepth: function() {
          var depth = this.getStyle('padding-left');
          if (depth) {
            return parseInt(depth, 10);
          }
          return 0;
        },

        /**
         * @param {boolean} current true if the item is part of the current line, false otherwise
         */
        setCurrent: function(current) {
          if (this._current !== current) {
            this._current = current;
            if (!!current) {
              this._element.addClass("currentRow");
            } else {
              this._element.removeClass("currentRow");
            }
          }
        },

        /**
         * @param {string} image path
         */
        setImage: function(path) {
          if (this._currentImagePath !== path) {
            if (path && path !== "") {

              if (!this._imageSpanElement) {
                this._imageSpanElement = document.createElement("span");
                this._imageSpanElement.addClass("gbc_TableItemImage");
                this._element.insertBefore(this._imageSpanElement, this.getContainerElement());
              }

              if (!this._imageWidget) {
                this._imageWidget = cls.WidgetFactory.create("Image", null, {
                  inTable: true
                });
                this._element.getElementsByClassName("gbc_TableItemImage")[0].prependChild(this._imageWidget.getElement());
              }

              this._imageWidget.setSrc(path);
              this._imageWidget.setHidden(false);
            } else if (this._imageWidget) {
              this._imageWidget.setHidden(true);
            }
            this._currentImagePath = path;
          }
        },

        /**
         * @returns {boolean} true if the item is part of the current line, false otherwise
         */
        isCurrent: function() {
          return this._element.hasClass("currentRow");
        },

        /**
         * @param {boolean} selected true if the item should be selected, false otherwise
         */
        setSelected: function(selected) {
          var children = this.getChildren();
          if (children.length !== 0) {
            children[0].setIgnoreBackgroundColor(!!selected);
          }
          this._element.toggleClass("selectedRow", !!selected);
        },

        /**
         * @returns {boolean} true if the row item is selected, false otherwise
         */
        isSelected: function() {
          return this._element.hasClass("selectedRow");
        },

        /**
         * @returns {boolean} true if the row item is client selected, false otherwise
         */
        isClientSelected: function() {
          return this._clientSelected;
        },

        /**
         * @param {boolean} selected true if the item is client selected, false otherwise
         */
        setClientSelected: function(selected) {
          this._clientSelected = selected;
        },

        /**
         * Returns index of the item in the parent column
         * @returns {number} index of the item in the column
         */
        getItemIndex: function() {
          var parent = this.getParentWidget();
          if (!!parent) {
            return parent.getChildren().indexOf(this);
          }
          return -1;
        },

        /**
         * Handle dragStart event
         * @param evt
         */
        onDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragStart, this.getItemIndex(), evt);
        },

        /**
         * Handle dragEnd event
         * @param evt
         */
        onDragEnd: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragEnd);
        },

        /**
         * Handle dragOver event
         * @param evt
         */
        onDragOver: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragOver, this.getItemIndex(), evt);
        },

        /**
         * Handle dragLeave event
         * @param evt
         */
        onDragLeave: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragLeave, this.getItemIndex(), evt);
        },

        /**
         * Handle dragEnter event
         * @param evt
         */
        onDragEnter: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDragEnter, this.getItemIndex(), evt);
        },

        /**
         * Handle drop event
         * @param evt
         */
        onDrop: function(evt) {
          var tableColumn = this.getParentWidget();
          tableColumn.emit(gbc.constants.widgetEvents.tableDrop, this.getItemIndex());
        },

        isLayoutMeasureable: function() {
          return true;
        }
      };
    });
    cls.WidgetFactory.register('TableColumnItem', cls.TableColumnItemWidget);
  });
