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

modulum('TableColumnWidget', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Table column widget.
     * @class classes.TableColumnWidget
     * @extends classes.WidgetGroupBase
     */
    cls.TableColumnWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.TableColumnWidget.prototype */
      return {
        __name: "TableColumnWidget",
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",

        /**
         * the title widget
         * @type {classes.TableColumnTitleWidget}
         */
        _title: null,

        /**
         * the aggregate widget
         * @type {classes.TableColumnTitleWidget}
         */
        _aggregate: null,

        _isTreeView: false,
        _isUnhidable: false,
        _isMovable: true,
        _isSizable: true,
        _alwaysHidden: false,
        _order: -1,
        _current: false,
        _dndItemEnabled: false,
        _itemsDetachedFromDom: false,
        _width: null,
        _defaultWidth: null,
        _initialWidth: null,
        _isFrozen: false,
        _firstWidgetMeasured: false,

        /**
         * @constructs {classes.TableColumnWidget}
         */
        constructor: function(opts) {
          opts = opts || {};
          opts.inTable = true;
          this._isTreeView = opts.isTreeView;
          $super.constructor.call(this, opts);
        },

        _initElement: function() {
          $super._initElement.call(this);
          this._title = cls.WidgetFactory.create("TableColumnTitle");
          this._title.setParentWidget(this);
        },

        _initLayout: function() {
          // no layout
        },

        measureSize: function() {
          if (!this._firstWidgetMeasured && this.getParentWidget().getLayoutInformation()._charSize.hasSize() && this.getParentWidget()
            .isElementInDom) {
            var columnItemWidget = this.getChildren()[0];
            if (columnItemWidget) {
              var widget = columnItemWidget.getChildren()[0];
              if (widget) {
                widget._layoutInformation._charSize = this.getParentWidget().getLayoutInformation()._charSize;
                widget._layoutInformation.getSizePolicyConfig().mode = "fixed";
                widget._layoutInformation.updatePreferred();
                widget._layoutEngine.measure();

                var height = widget._layoutInformation.getMeasured().getHeight();
                this.setRowHeight(height);

                var measuredWidth = widget._layoutInformation.getMeasured().getWidth();
                var preferredWidth = widget._layoutInformation.getPreferred().getWidth();
                var width = Math.max(measuredWidth, preferredWidth);

                this._initialWidth = width;
                if (this._defaultWidth === null) {
                  this.setWidth(width);
                } else {
                  this.setWidth(this._defaultWidth);
                }

                this._firstWidgetMeasured = true;
              }
            }
          }
        },

        destroy: function() {
          this._title.destroy();
          this._title = null;
          if (this._aggregate) {
            this._aggregate.destroy();
            this._aggregate = null;
          }
          var children = this.getChildren();
          if (children) {
            for (var i = children.length - 1; i > -1; i--) {
              var currentChildren = children[i];
              currentChildren.destroy();
              currentChildren = null;
            }
          }
          $super.destroy.call(this);
        },

        /**
         * @inheritDoc
         */
        addChildWidget: function(widget, options) {
          options = options || {};
          var tableColumnItem = cls.WidgetFactory.create("TableColumnItem", null, {
            isTreeItem: this._isTreeView,
            inTable: true
          });
          if (this._isTreeView) {
            tableColumnItem.clickHandler = tableColumnItem.when(context.constants.widgetEvents.click, function(event, sender) {
              var index = sender.getItemIndex();
              this.emit(context.constants.widgetEvents.click, index);
            }.bind(this));
          }

          tableColumnItem.setDndEnabled(this._dndItemEnabled);
          tableColumnItem.addChildWidget(widget);

          $super.addChildWidget.call(this, tableColumnItem, options);

          if (this.getParentWidget()) {
            // if first widget has not been measured need to relayout to measure it
            if (!this._firstWidgetMeasured) {
              this.getParentWidget().getLayoutEngine().forceMeasurement();
              this.getParentWidget().getLayoutEngine().invalidateMeasure();
            }
            // Set the current row
            tableColumnItem.setCurrent(tableColumnItem.getItemIndex() === this.getParentWidget()._currentRow);
          }
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          var item = widget.getParentWidget() !== this ? widget.getParentWidget() : widget;
          $super.removeChildWidget.call(this, item);
        },

        /**
         *  Remove all items (container element) from DOM
         */
        detachItemsFromDom: function() {
          if (this._itemsDetachedFromDom === false) {
            this._itemsDetachedFromDom = true;
            this.getContainerElement().remove();
          }
        },

        /**
         * Attach all items (container element) to DOM
         */
        attachItemsToDom: function() {
          if (this._itemsDetachedFromDom === true) {
            this._itemsDetachedFromDom = false;
            this.getContainerElement().insertAt(0, this.getElement());
          }
        },

        /**
         * Returns true if column is a treeview
         * @returns {boolean} treeview ?
         */
        isTreeView: function() {
          return this._isTreeView;
        },

        /**
         * Sets if the column must be always hidden
         * @param {boolean}
         */
        setAlwaysHidden: function(b) {
          this._alwaysHidden = b;
        },

        /**
         * Returns true if column must be always hidden
         * @returns {boolean}
         */
        isAlwaysHidden: function() {
          return this._alwaysHidden;
        },

        /**
         * Sets if the column can be moved by the user
         * @param {boolean}
         */
        setMovable: function(b) {
          this._isMovable = b;
        },

        /**
         * Returns true if column is movable
         * @returns {boolean}
         */
        isMovable: function() {
          return this._isMovable;
        },

        /**
         * Sets if the column can be sized by the user
         * @param {boolean}
         */
        setSizable: function(b) {
          if (this._isSizable !== b) {
            this._isSizable = b;
            if (b) {
              this.getTitleWidget().getResizer().removeClass("unresizable");
            } else {
              this.getTitleWidget().getResizer().addClass("unresizable");
            }
          }
        },

        /**
         * Returns true if column is sizable
         * @returns {boolean}
         */
        isSizable: function() {
          return this._isSizable;
        },

        /**
         * Sets if the column can be hidden by the user
         * @param {boolean}
         */
        setUnhidable: function(b) {
          this._isUnhidable = b;
        },

        /**
         * Returns true if column is unhidable
         * @returns {boolean}
         */
        isUnhidable: function() {
          return this._isUnhidable;
        },

        /**
         * Update aggregate width
         */
        updateAggregateWidth: function() {

          // search column which contain an aggregate
          var tableWidget = this.getParentWidget();
          if (!!tableWidget) {
            var columns = tableWidget.getOrderedColumns();
            for (var i = this.getOrderedColumnIndex(); i < columns.length; i++) {
              var col = columns[i];
              if (!!col._aggregate && !col.isHidden()) {
                col.setAggregate(col._aggregate.getText());
                break;
              }
            }
          } else if (!!this._aggregate) {
            this.setAggregate(this._aggregate.getText());
          }
        },

        /**
         * Set/add an aggregate cell
         * @param text aggregate text & value
         */
        setAggregate: function(text, width) {
          var tableWidget = this.getParentWidget();
          if (text !== "") {
            if (!this._aggregate) {
              this._aggregate = cls.WidgetFactory.create("TableColumnAggregate");
              this._aggregate.setParentWidget(this);
              var footer = tableWidget.getColumnsFooter();
              if (!!footer) {
                footer.appendChild(this._aggregate.getElement());
                tableWidget.setHasFooter(true);
              }
            }

            this._aggregate.setText(text);
            this._aggregate.setHidden(this.isHidden());

            var aggregateWidth = this.getWidth();

            if (!width) {
              var columns = tableWidget.getOrderedColumns();
              for (var i = this.getOrderedColumnIndex() - 1; i >= 0; i--) {
                var col = columns[i];
                if (col._aggregate === null) {
                  if (!col.isHidden()) {
                    aggregateWidth += col.getWidth();
                  }
                } else {
                  if (!col.isHidden()) {
                    break;
                  }
                }
              }
            } else {
              aggregateWidth += width;
            }
            this._aggregate.setWidth(aggregateWidth);

          } else {
            if (this._aggregate) {
              this._aggregate.setText(text);
            }
          }
        },

        /**
         * Returns index of the column in the parent table
         * @returns {number} index of the column in the table
         */
        getColumnIndex: function() {
          var parent = this.getParentWidget();
          if (!!parent) {
            return parent.getColumns().indexOf(this);
          }
          return -1;
        },

        /**
         * Returns index of the column in the parent table
         * @returns {number} index of the column in the table
         */
        getOrderedColumnIndex: function() {
          var parent = this.getParentWidget();
          if (!!parent) {
            return parent.getOrderedColumns().indexOf(this);
          }
          return -1;
        },

        /**
         * @param {number} height row height (pixels)
         */
        setRowHeight: function(height) {
          var parent = this.getParentWidget();
          if (!!parent && height > parent.getRowHeight()) {
            parent.setRowHeight(height);
          }
        },

        /**
         *
         * @param {number} index
         * @returns {classes.TableColumnItemWidget}
         */
        getColumnItem: function(index) {
          return this._children[index];
        },

        /**
         * @returns {classes.TableColumnTitleWidget} the title widget
         */
        getTitleWidget: function() {
          return this._title;
        },

        /**
         * @returns {classes.TableColumnAggregateWidget} the aggregate widget
         */
        getAggregateWidget: function() {
          return this._aggregate;
        },

        /**
         * @param {string} text the text to display
         */
        setText: function(text) {
          this.getTitleWidget().setText(text);
        },

        /**
         * @returns {string} the text to display
         */
        getText: function() {
          return this.getTitleWidget().getText();
        },

        /**
         * @param {number|null} width column width (pixels)
         */
        setWidth: function(width) {
          if (this._width !== width) {
            this._width = width;
            this.setStyle({
              "width": width + "px"
            });
            this.getTitleWidget().setWidth(width);
            this.updateAggregateWidth();
          }
        },

        /**
         * Set width ( from a user interaction)
         * @param {number|null} width column width (pixels)
         */
        setWidthFromUserInteraction: function(width) {
          this.setWidth(width);
          this.emit(gbc.constants.widgetEvents.tableResizeCol, width);
          this.getParentWidget().autoSetLastColumnWidthToFillEmptySpace();
        },

        /**
         * @returns {number|null} column width
         */
        getWidth: function() {
          return this._width;
        },

        /**
         * @returns {number|null} initial column width
         */
        getInitialWidth: function() {
          return this._initialWidth;
        },

        /**
         * reset width column
         */
        resetWidth: function() {
          this.setWidth(this._initialWidth);
        },

        /**
         * @returns {string} column width (ex:"42px")
         */
        getWidthStyle: function() {
          return this.getStyle("width");
        },

        /**
         * @param {number} index order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
          this._order = index;

          this.getTitleWidget().setOrder(index);
          if (!!this._aggregate) {
            this._aggregate.setOrder(index);
          }
          this.getParentWidget().resetOrderedColumns();
          this.getParentWidget().updateAllAggregate();

        },

        /**
         * @returns {number} order index
         */
        getOrder: function() {
          return this._order;
        },

        /**
         * @param {number} row current row
         */
        setCurrentRow: function(row) {
          var children = this.getChildren();
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var tableColumnItem = children[i];
            tableColumnItem.setCurrent(i === row);
          }
        },

        /**
         * @param {boolean} current true if the column is the current one, false otherwise
         */
        setCurrent: function(current) {
          if (current !== this._current) {
            this._current = !!current;
            this.getElement().toggleClass("currentColumn", !!current);
            this.attachItemsToDom(); // current should be always attached to DOM
          }
        },

        /**
         * Check if column is current one
         * @returns {boolean}
         */
        isCurrent: function() {
          return this._current;
        },

        /**
         * Updates rows visibility depending on the number of visible rows defined in the parent TableWidget
         */
        updateRowsVisibility: function() {
          var visibleRows = this.getParentWidget().getVisibleRows();
          var children = this.getChildren();
          for (var i = 0; i < children.length; ++i) {
            var tableColumnItemWidget = children[i];
            tableColumnItemWidget.setHidden(i >= visibleRows);
          }
        },

        /**
         *
         * @param {number} row index of the row
         * @param {boolean} selected true if the row should be selected, false otherwise
         */
        setRowSelected: function(row, selected) {
          var children = this.getChildren();
          if (row < children.length) {
            children[row].setSelected(selected);
          }
        },

        /**
         * @param {number} row index of the row
         * @returns {boolean} true if the row is selected, false otherwise
         */
        isRowSelected: function(row) {
          var children = this.getChildren();
          if (row < children.length) {
            return children[row].isSelected();
          }
          return false;
        },

        /**
         * setHidden
         * @param {boolean} state
         */
        setHidden: function(state) {

          $super.setHidden.call(this, state);
          //hide title as well
          this.getTitleWidget().setHidden(state);
          //hide aggregate as well too
          if (!!this._aggregate) {
            this._aggregate.setHidden(state);
          }
          this.getParentWidget().updateAllAggregate();
        },

        /**
         * Returns afterLastItemZone element
         * @returns {object} afterLastItemZone jquery element
         */
        getAfterLastItemZone: function() {
          return this._element.getElementsByClassName("gbc_TableAfterLastItemZone")[0];
        },

        /**
         * @param {number} row
         * @returns {object} item widget
         */
        getItemWidget: function(row) {
          return this.getChildren()[row].getChildren()[0];
        },

        /**
         * @param itemUuid
         * @returns {TableColumnItemWidget}
         */
        getItemWidgetFromUuid: function(itemUuid) {
          var children = this.getChildren();
          for (var i = 0; i < children.length; i++) {
            var item = children[i];
            if (item.getUniqueIdentifier() === itemUuid) {
              return item;
            }
          }
          return null;
        },

        /**
         * Auto set width according to max length of column values
         */
        autoSetWidth: function() {
          if (this.isSizable()) {
            var children = this.getChildren();
            var width = null;

            var titleWidget = this.getTitleWidget();
            titleWidget.getElement().addClass("g_TableColumnWidthMeasuring");
            var maxWidth = titleWidget.getElement().getBoundingClientRect().width;
            titleWidget.getElement().removeClass("g_TableColumnWidthMeasuring");

            for (var i = 0; i < children.length; ++i) {
              var tableColumnItemWidget = children[i];
              var widget = tableColumnItemWidget.getChildren()[0];

              widget.getElement().addClass("g_TableColumnWidthMeasuring");
              width = widget.getElement().getBoundingClientRect().width;
              widget.getElement().removeClass("g_TableColumnWidthMeasuring");

              if (width > maxWidth) {
                maxWidth = width;
              }
            }
            this.setWidthFromUserInteraction(maxWidth);
          }
        },

        /**
         * Enable Dnd of items
         * @param b
         */
        setDndItemEnabled: function(b) {
          if (this._dndItemEnabled !== b) {

            this._dndItemEnabled = b;
            var items = this.getChildren();
            for (var j = 0; j < items.length; j++) {
              var item = items[j];
              item.setDndEnabled(b);
            }
          }
        },

        /**
         * Handle double click event
         * @param evt
         * @private
         */
        onDoubleClick: function() {
          this.emit(context.constants.widgetEvents.doubleClick);
        },

        /**
         * Handle click event after last item
         * @param evt
         * @private
         */
        onClickAfterLastItem: function() {
          this.emit(context.constants.widgetEvents.tableColumnAfterLastItemClick);
        },

        /**
         * Handle drop event
         * @param evt
         */
        onDropAfterLastItem: function(evt) {
          this.emit(gbc.constants.widgetEvents.tableDrop, this.getParentWidget().getVisibleRows());
        },

        /**
         * Handle dragOver event
         * @param evt
         */
        onDragOverAfterLastItem: function(evt) {
          this.emit(gbc.constants.widgetEvents.tableDragOver, this.getParentWidget().getVisibleRows(), evt);
        }
      };
    });
    cls.WidgetFactory.register('TableColumn', cls.TableColumnWidget);
  });
