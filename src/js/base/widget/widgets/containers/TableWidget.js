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

modulum('TableWidget', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Table widget.
     *
     * OPTIMS:
     * - Remove from DOM leftContainer or/and right container if there is no frozen columns
     * - TableColumnItemWidget: remove from DOM gbc_TableItemImage span if there is no image
     * - Move DnD column and resize column event handler from TableColumnTitleWidget to TableWidget
     *
     * @class classes.TableWidget
     * @extends classes.WidgetGroupBase
     */
    cls.TableWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.TableWidget.prototype */
      return {
        __name: "TableWidget",
        /** @lends classes.TableWidget */
        $static: {
          defaultRowHeight: 14,
          minPageSize: null,
          minWidth: null,
        },

        _rowHeight: 0,
        _currentRow: 0,
        _currentRowChanged: false,
        _currentColumn: 0,
        _decorateHeight: 0,
        _decorateWidth: 0,
        _inputMode: null,
        _visibleRows: 0,
        _orderedColumns: null,
        _addOnlyVisibleColumnsToDom: true, // to enable/disable this optimization
        _layoutDone: false,
        _hasFooter: false,
        _isPageVisible: false,
        _firstDisplay: true,
        isElementInDom: true,
        _needToUpdateVerticalScroll: false,
        _focusOnField: false,

        /** Item client selection */
        _defaultItemSelection: false,
        _firstItemSelected: null,
        _itemSelectionInProgress: false,
        _itemSelectionElement: null,

        /** DOM Elements */
        _leftContainerElement: null,
        _rightContainerElement: null,
        _columnsContainerElement: null,
        _leftColumnsContainer: null,
        _rightColumnsContainer: null,
        _columnsHeaders: null,
        _leftColumnsHeaders: null,
        _rightColumnsHeaders: null,
        _columnsFooter: null,
        _scrollAreaElement: null,
        _rightScrollAreaElement: null,
        _leftScrollAreaElement: null,
        _replacerElement: null,
        _aggregateGlobalTextElement: null,

        /** frozen table attributes */
        _frozenTable: false,
        _leftFrozenColumns: 0,
        _rightFrozenColumns: 0,

        /** scroll attributes */
        _pageSize: null,
        _size: null,
        _firstPageSize: null,
        _fixedPageSize: false,
        _offset: 0,
        _previousScrollLeftValue: 0,
        lastSentOffset: null,

        /** Dnd attributes */
        _dndItemEnabled: false,
        _dndMode: null,
        _dndMouseDragX: null, // mouse X position when dragging (ugly hack for FF because drag event does not contain mouse coordinates)
        _dndReorderingDragOverWidget: null,
        _dndDraggedColumnWidget: null,
        _noDrop: {
          "left": false,
          "right": false,
          "center": false
        },

        /** styles */
        _highlightColor: null,
        _highlightTextColor: null,
        _highlightCurrentCell: null,
        _highlightCurrentRow: null,
        _showGrid: null,
        _headerAlignment: null,
        _headerHidden: null,
        _resizeFillsEmptySpace: false,
        _columnResizeFillsEmptySpace: null,

        /** KeyCode widget events */
        _keyCodeEvents: null,

        /** Handlers */
        _uiActivateHandler: null,
        _pageActivateHandler: null,
        _pageDisableHandler: null,

        /** Parent widgets */
        _appWidget: null,
        _folderPageWidget: null,

        /**
         * @constructs {classes.TableWidget}
         */
        constructor: function(opts) {
          opts = opts || {};
          this._appWidget = opts.appWidget;
          this._folderPageWidget = opts.folderPageWidget;
          if (!this._folderPageWidget) {
            this._isPageVisible = true;
          }
          $super.constructor.call(this, opts);

          var minPageSize = parseInt(context.constants.theme["table-min-pageSize"]);
          cls.TableWidget.minPageSize = isNaN(minPageSize) ? 1 : minPageSize;
          var minWidth = parseInt(context.constants.theme["table-min-width"]);
          cls.TableWidget.minWidth = isNaN(minWidth) ? 60 : minWidth;
        },

        _initElement: function() {
          $super._initElement.call(this);

          var startKey = !this.isReversed() ? "keyLeft" : "keyRight";
          var endKey = !this.isReversed() ? "keyRight" : "keyLeft";

          this._keyCodeEvents = {
            32: "keySpace",
            33: "keyPageUp",
            34: "keyPageDown",
            35: "keyEnd",
            36: "keyHome",
            37: startKey,
            38: "keyUp",
            39: endKey,
            40: "keyDown"
          };

          this.setFocusable(true);

          this.setRowHeight(cls.TableWidget.defaultRowHeight);

          // Prevent default on dragover, to remove forbidden icon on drag
          var preventDefault = function(event) {
            this._dndMouseDragX = event.clientX || event.screenX; // Fix for FF
            if (!!this._dndMode) {
              event.preventDefault();
            }
          }.bind(this);
          //drag events
          this.getColumnsHeaders().on("dragover.TableWidget", preventDefault);
          this.getLeftColumnsHeaders().on("dragover.TableWidget", preventDefault);
          this.getRightColumnsHeaders().on("dragover.TableWidget", preventDefault);

          //left container
          this.getLeftColumnsHeaders().on("drop.TableWidget", this._onHeaderDrop.bind(this));
          this.getLeftColumnsHeaders().on("dragstart.TableWidget", this._onHeaderDragStart.bind(this));
          this.getLeftColumnsHeaders().on("dragend.TableWidget", this._onHeaderDragEnd.bind(this));
          this.getLeftColumnsHeaders().on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this));
          this.getLeftColumnsHeaders().on("dragover.TableWidget", this._onHeaderDragOver.bind(this));
          this.getLeftColumnsHeaders().on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this));
          this.getLeftColumnsHeaders().on('contextmenu.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getLeftColumnsHeaders().onLongTouch('longTouch.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getLeftColumnsHeaders().on("dblclick.TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getLeftColumnsHeaders().onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getLeftColumnsHeaders().on('click.TableWidget', this._onHeaderClick.bind(this));

          //right container
          this.getRightColumnsHeaders().on("drop.TableWidget", this._onHeaderDrop.bind(this));
          this.getRightColumnsHeaders().on("dragstart.TableWidget", this._onHeaderDragStart.bind(this));
          this.getRightColumnsHeaders().on("dragend.TableWidget", this._onHeaderDragEnd.bind(this));
          this.getRightColumnsHeaders().on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this));
          this.getRightColumnsHeaders().on("dragover.TableWidget", this._onHeaderDragOver.bind(this));
          this.getRightColumnsHeaders().on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this));
          this.getRightColumnsHeaders().on('contextmenu.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getRightColumnsHeaders().onLongTouch('longTouch.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getRightColumnsHeaders().on("dblclick.TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getRightColumnsHeaders().onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getRightColumnsHeaders().on('click.TableWidget', this._onHeaderClick.bind(this));

          //main container
          this.getColumnsHeaders().on("drop.TableWidget", this._onHeaderDrop.bind(this));
          this.getColumnsHeaders().on("dragstart.TableWidget", this._onHeaderDragStart.bind(this));
          this.getColumnsHeaders().on("dragend.TableWidget", this._onHeaderDragEnd.bind(this));
          this.getColumnsHeaders().on("drag.TableWidget", this._onHeaderDrag.throttle(5).bind(this));
          this.getColumnsHeaders().on("dragover.TableWidget", this._onHeaderDragOver.bind(this));
          this.getColumnsHeaders().on("dragleave.TableWidget", this._onHeaderDragLeave.bind(this));
          this.getColumnsHeaders().on('contextmenu.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getColumnsHeaders().onLongTouch('longTouch.TableWidget', this._onHeaderContextMenu.bind(this));
          this.getColumnsHeaders().on("dblclick.TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getColumnsHeaders().onDoubleTap("TableWidget", this._onHeaderDoubleClick.bind(this));
          this.getColumnsHeaders().on('click.TableWidget', this._onHeaderClick.bind(this));

          this.getScrollableArea().on('scroll.TableWidget', this._onScroll.bind(this));
          this.getLeftScrollableArea().on('scroll.TableWidget', this._onScrollOnLeftColumns.bind(this));
          this.getRightScrollableArea().on('scroll.TableWidget', this._onScrollOnRightColumns.bind(this));

          this.getColumnsContainer().on('dblclick.TableWidget', this._onDoubleClick.bind(this));
          this.getColumnsContainer().onDoubleTap("TableWidget", this._onDoubleClick.bind(this));
          this.getColumnsContainer().on('click.TableColumnWidget', this._onClick.bind(this));

          // events for client select items
          this.getElement().on("mousedown.item_TableWidget", this._onItemMouseDown.bind(this));
          this.getElement().on("mouseup.item_TableWidget", this._onItemMouseUp.bind(this));
          this.getElement().on("mousemove.item_TableWidget", this._onItemMouseMove.bind(this));
          this.getElement().on("mouseleave.item_TableWidget", this._onItemMouseLeave.bind(this));

          this.setStyle(".gbc_TableColumnsHeaders", {
            "margin-right": window.scrollBarSize + "px"
          });
          this.setStyle(".gbc_TableColumnsFooter", {
            "margin-bottom": window.scrollBarSize + "px"
          });

          if (this._appWidget) {
            this._uiActivateHandler = this._appWidget.onActivate(this.updateVerticalScroll.bind(this, true));
          }
          if (this._folderPageWidget) {
            this._pageActivateHandler = this._folderPageWidget.onActivate(function() { // when one of the parents page is activated (we manage multiple level)
              if (this._folderPageWidget.getParentWidget().getCurrentPage() === this._folderPageWidget) { // only do something if parent page is active
                this._isPageVisible = true;
                if (this._firstDisplay) { // on first display, remove column content from DOM if they are not visible and update footer width
                  this._firstDisplay = false;
                  this._updateVisibleColumnsInDom();
                  this._updateFooterWidth();
                }

                this.addTable();
                this.updateVerticalScroll(true);
              }
            }.bind(this));

            this._pageDisableHandler = this._folderPageWidget.onDisable(function() { // when one of the parents page is disabled (we manage multiple level)
              if (this._folderPageWidget.getParentWidget().getCurrentPage() === this._folderPageWidget) { // only do something if parent page is active
                this._isPageVisible = false;
                this.removeTable();
              }
            }.bind(this));
          }
        },

        destroy: function() {
          this._isPageVisible = false;
          if (this._uiActivateHandler) {
            this._uiActivateHandler();
            this._uiActivateHandler = null;
          }
          if (this._pageActivateHandler) {
            this._pageActivateHandler();
            this._pageActivateHandler = null;
          }
          if (this._pageDisableHandler) {
            this._pageDisableHandler();
            this._pageDisableHandler = null;
          }
          this.getColumnsHeaders().off("dragover.TableWidget");
          this.getLeftColumnsHeaders().off("dragover.TableWidget");
          this.getRightColumnsHeaders().off("dragover.TableWidget");

          this.getLeftColumnsHeaders().off('contextmenu.TableWidget');
          this.getRightColumnsHeaders().off('contextmenu.TableWidget');

          this.getLeftColumnsHeaders().off("dblclick.TableWidget");
          this.getRightColumnsHeaders().off("dblclick.TableWidget");

          this.getColumnsHeaders().off("drop.TableWidget");
          this.getColumnsHeaders().off("dragstart.TableWidget");
          this.getColumnsHeaders().off("dragend.TableWidget");
          this.getColumnsHeaders().off("drag.TableWidget");
          this.getColumnsHeaders().off("dragover.TableWidget");
          this.getColumnsHeaders().off("dragleave.TableWidget");
          this.getColumnsHeaders().off("contextmenu.TableWidget");
          this.getColumnsHeaders().off("dblclick.TableWidget");
          this.getColumnsHeaders().off("click.TableWidget");

          this.getScrollableArea().off('scroll.TableWidget');
          this.getLeftScrollableArea().off('scroll.TableWidget');
          this.getRightScrollableArea().off('scroll.TableWidget');

          this.getLeftScrollableArea().off('wheel.TableWidget');
          this.getScrollableArea().off('wheel.TableWidget');

          this.getColumnsContainer().off('dblclick.TableWidget');
          this.getColumnsContainer().off('click.TableWidget');

          this.getElement().off('keydown.TableWidget');

          this.getElement().offDoubleTap("TableWidget");

          if (this._dndItemEnabled) {
            var columnsContainer = this.getColumnsContainer();
            columnsContainer.off("dragstart.item_TableWidget");
            columnsContainer.off("dragend.item_TableWidget");
            columnsContainer.off("dragover.item_TableWidget");
            columnsContainer.off("drop.item_TableWidget");
            columnsContainer.off("dragleave.item_TableWidget");
            columnsContainer.off("dragenter.item_TableWidget");
          }

          this._orderedColumns = null;

          if (this._layoutEngine) {
            this._layoutEngine.destroy();
          }
          $super.destroy.call(this);
        },

        bindKeyEvents: function() {
          this._element.on('keydown.TableWidget', this._onKeys.bind(this));
        },

        unbindKeyEvents: function() {
          this._element.off('keydown.TableWidget');
        },

        _onKeys: function(event) {
          var isDisplayTable = !this._inputMode;

          /*
           Using mousetrap keyboard isn't sufficient anymore since we don't set focus() on table  on each row/column click.
           Since mousetrap can't catch all, we need to catch all direction keys using native dom event which is always fired.
           */
          var widgetEvent = this._keyCodeEvents[event.keyCode];
          if (widgetEvent && isDisplayTable) {
            event.stopPropagation();
            this.emit(context.constants.widgetEvents[widgetEvent], event);
          } else {
            var char = String.fromCharCode(event.which || event.keyCode);

            if (isDisplayTable && char.toLowerCase() === 'a' && (event.ctrlKey === true || event.metaKey === true)) {
              this.emit(context.constants.widgetEvents.selectAll, event);
            } else if (char.toLowerCase() === 'c' && (event.ctrlKey === true || event.metaKey === true)) {
              if (this.hasItemsSelected()) { // copy selection
                event.stopPropagation();
                this._copySelectionInClipboard();
              } else if (isDisplayTable) { // copy current row
                this._copyCurrentRowInClipboard();
              }
            }
          }
          return false; // return false to avoid additional events propagation and performance issues
        },

        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled) {
          if (this._enabled !== enabled) {
            $super.setEnabled.call(this, enabled);

            this._resetItemsSelection();
            this.updateVerticalScroll(true);
          }
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {

          if (this.isElementInDom) {
            this.domFocus();
          } else {
            var applicationWidget = context.SessionService.getCurrent().getCurrentApplication().getUI().getWidget();
            if (applicationWidget) {
              applicationWidget.getElement().domFocus();
            }
          }
          $super.setFocus.call(this);
        },

        /**
         * Set the DOM focus to the widget
         */
        domFocus: function() {
          this._element.domFocus(null, this.hasFocus() ? this.getFormWidget().getContainerElement() : null);
        },

        /**
         * Init Layout
         * @private
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.TableLayoutEngine(this);

          this._layoutEngine.onLayoutApplied(this._layoutApplied.bind(this));
          this._layoutInformation._stretched.setDefaultX(true);
          this._layoutInformation._stretched.setDefaultY(!this._fixedPageSize);
        },

        /**
         * Call when layout is finished
         */
        _layoutApplied: function() {
          // first layout apply, we remove table from DOM if not visible
          if (!this._layoutDone) {
            if (!this._isPageVisible) {
              this.removeTable();
            }
          }
          this._layoutDone = true;
          // if table is visible and was already active
          if (this._isPageVisible) {
            this._updateVisibleColumnsInDom(); // remove not visible column content
            this._updateFooterWidth();
            this.updateVerticalScroll(this._needToUpdateVerticalScroll);
            this._needToUpdateVerticalScroll = false;
          }

          this.autoSetLastColumnWidthToFillEmptySpace();
        },

        /**
         * Auto set last column width
         */
        autoSetLastColumnWidthToFillEmptySpace: function() {
          if (this._resizeFillsEmptySpace) {

            var lastVisibleColumn = this.getLastOrderedColumn(true);

            if (this._columnResizeFillsEmptySpace && this._columnResizeFillsEmptySpace !== lastVisibleColumn) {
              this._columnResizeFillsEmptySpace.resetWidth();
              this._columnResizeFillsEmptySpace.setSizable(true);
            }
            this._columnResizeFillsEmptySpace = lastVisibleColumn;

            this._columnResizeFillsEmptySpace.resetWidth();
            this._columnResizeFillsEmptySpace.setSizable(false);

            var visibleColumnsWidth = this.getVisibleColumnsWidth();
            var tableWidth = this.getDataAreaWidth();

            var emptySpaceWidth = tableWidth - visibleColumnsWidth;
            if (emptySpaceWidth >= 0) {
              this._columnResizeFillsEmptySpace.setWidth(this._columnResizeFillsEmptySpace.getWidth() + emptySpaceWidth, true);
            }
          }
        },

        /**
         * Update the list of columns which are in the DOM according to visibility
         * @private
         */
        _updateVisibleColumnsInDom: function() {
          window.requestAnimationFrame(function() {
            if (this._addOnlyVisibleColumnsToDom && this._layoutInformation) {
              var offset = this.getScrollableArea().scrollLeft;
              var columns = this.getOrderedColumns();
              var tableWidth = this._layoutInformation.getAllocated().getWidth();
              var currentWidth = 0;
              for (var i = 0; i < columns.length; i++) {
                var col = columns[i];
                if (col._isFrozen === false && col.isHidden() === false) {
                  var colWidth = col.getWidth();

                  if (col.isCurrent()) {
                    col.attachItemsToDom(); // current column should be always in the dom
                  }
                  // Detach columns which are not visible at left
                  else if (offset > (currentWidth + colWidth)) {
                    col.detachItemsFromDom();
                  }
                  // Detach columns which are not visible at right
                  else if ((currentWidth - offset) > tableWidth) {
                    col.detachItemsFromDom();
                  } else {
                    col.attachItemsToDom();
                  }
                  currentWidth += colWidth;
                } else {
                  if (col.isHidden()) {
                    col.detachItemsFromDom();
                  } else {
                    col.attachItemsToDom();
                  }
                }
              }
            }
          }.bind(this));
        },

        addTable: function() {
          if (this._replacerElement && this._replacerElement.parentNode) {
            this._replacerElement.parentNode.replaceChild(this.getElement(), this._replacerElement);
            this.isElementInDom = true;
            if (this.hasFocus()) {
              this.getElement().domFocus();
            }

            // force relayout
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        removeTable: function() {
          if (!this._replacerElement) {
            this._replacerElement = document.createElement("div");
            this._replacerElement.setAttribute("tabindex", "0");
            this._replacerElement.addClass("gbc_EmptyTableInHiddenPage");
          }
          if (this.getElement() && this.getElement().parentNode) {
            this.getElement().parentNode.replaceChild(this._replacerElement, this.getElement());
            this.isElementInDom = false;
          }
        },

        /**
         * @param {classes.TableColumnWidget} tableColumn the child table column
         * @param {Object=} options - possible options
         */
        addChildWidget: function(tableColumn, options) {

          if (tableColumn.__name !== "TableColumnWidget") {
            throw "Only TableColumnWidgets can be added in TableWidgets";
          }

          // Set Table as parent
          tableColumn.setParentWidget(this);
          this.getColumnsHeaders().appendChild(tableColumn.getTitleWidget().getElement());
          tableColumn.setCurrentRow(this._currentRow);
          tableColumn.setOrder(this.getColumns().length);

          this.resetOrderedColumns();
          this.updateFrozenColumns();

          $super.addChildWidget.call(this, tableColumn, options);
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          $super.removeChildWidget.call(this, widget);
          this.resetOrderedColumns();
        },

        /**
         * Set sorted column an type
         * @param sortType sort type "asc" or "desc" (empty string for no sort)
         * @param sortColumn column sorted (-1 for no sort)
         */
        setSort: function(sortType, sortColumn) {
          var columns = this.getColumns();

          for (var i = 0; i < columns.length; i++) {
            if (i === sortColumn) {
              columns[i].getTitleWidget().setSortDecorator(sortType);
            } else {
              if (columns[i].getTitleWidget) {
                columns[i].getTitleWidget().setSortDecorator("");
              }
            }
          }
        },

        /**
         * Returns true if table is a treeview
         * @returns {boolean} treeview ?
         */
        isTreeView: function() {
          var firstColumn = this.getColumns()[0];
          return firstColumn && firstColumn._isTreeView;
        },

        /**
         * Returns true if table is in a visible folder page or not in a folder
         * @returns {boolean}
         */
        isPageVisible: function() {
          return this._isPageVisible;
        },

        /**
         * Sets if table is in "input" mode.
         * @param {boolean} input mode
         */
        setInputMode: function(b) {
          if (this._inputMode !== b) {
            this._inputMode = b;
            this._element.toggleClass("inputMode", !!b);
          }
        },

        /**
         * Returns true if table is in "input" mode.
         * @returns {boolean|null} input mode
         */
        isInputMode: function() {
          return this._inputMode;
        },

        /**
         * Returns columns widgets
         * @returns {object} columns widget
         */
        getColumns: function() {
          return this.getChildren();
        },

        resetOrderedColumns: function() {
          this._orderedColumns = null;
        },

        /**
         * Returns columns widgets (ordered)
         * @returns {object} columns widget
         */
        getOrderedColumns: function() {
          if (this._orderedColumns === null) {
            var children = this.getColumns().slice();
            children.sort(function(a, b) {
              return a.getOrder() - b.getOrder();
            });
            this._orderedColumns = children;
          }
          return this._orderedColumns;
        },

        /**
         * Returns last ordered columns
         * @param visible if true return the last visible ordered columns
         * @returns {object} columns widget
         */
        getLastOrderedColumn: function(visible) {
          var columns = this.getOrderedColumns();
          for (var i = columns.length - 1; i >= 0; i--) {
            var currentColumn = columns[i];
            if (!visible || !currentColumn.isHidden()) {
              return currentColumn;
            }
          }
          return null;
        },

        /**
         * Returns the width of all visible columns
         * @returns {number} columns width
         */
        getVisibleColumnsWidth: function() {
          var visibleColumnsWidth = 0;
          var columns = this.getOrderedColumns();
          for (var i = 0; i < columns.length; i++) {
            var currentColumn = columns[i];
            if (!currentColumn.isHidden()) {
              visibleColumnsWidth += currentColumn.getWidth();
            }
          }
          return visibleColumnsWidth;
        },

        /**
         * @param {number} height row height (pixels)
         */
        setRowHeight: function(height) {
          this._rowHeight = height;
          this.setStyle(" .gbc_TableColumnItemWidget", {
            "height": height + "px"
          });
          this.setStyle(" .gbc_TableColumnItemWidget .gbc_TableItemImage", {
            "width": height + "px",
            "height": height + "px"
          });
          this.updateVerticalScroll(true); // refresh vertical scroll if row height has changed
        },

        /**
         * @returns {string} row height (ex:"42px")
         */
        getRowHeightString: function() {
          return this.getStyle(" .gbc_TableColumnItemWidget", "height");
        },

        /**
         * @returns {number} row height
         */
        getRowHeight: function() {
          return this._rowHeight;
        },

        /**
         * @returns {number} table data area height
         */
        getDataAreaHeight: function() {
          return this.getLayoutInformation().getAllocated().getHeight() - this._decorateHeight - window.scrollBarSize;
        },

        /**
         * @returns {number} table data area width
         */
        getDataAreaWidth: function() {
          return this.getLayoutInformation().getAllocated().getWidth() - this._decorateWidth - window.scrollBarSize;
        },

        /**
         * @param {number} row current row
         * @param {number} offset
         */
        setCurrentRow: function(row) {
          this._currentRow = row;
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            columns[i].setCurrentRow(row);
          }
        },

        /**
         * @param {number} col current column
         */
        setCurrentColumn: function(col) {
          this._currentColumn = col;
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            if (columns[i].setCurrent) {
              columns[i].setCurrent(i === col);
            }
          }
        },

        /**
         * @returns {object} current item widget
         */
        getCurrentItemWidget: function() {
          return this.getItemWidget(this._currentColumn, this._currentRow);
        },

        /**
         * @param {number} column
         * @param {number} row
         * @returns {object} item widget
         */
        getItemWidget: function(column, row) {
          return this.getColumns()[column].getItemWidget(row);
        },

        /**
         * @param columnUuid
         * @returns {TableColumnWidget}
         */
        getColumnWidgetFromUuid: function(columnUuid) {
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            if (col.getUniqueIdentifier() === columnUuid) {
              return col;
            }
          }
          return null;
        },

        /**
         * @param columnTitleUuid
         * @returns {TableColumnTitleWidget}
         */
        getColumnTitleWidgetFromUuid: function(columnTitleUuid) {
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            if (col.getTitleWidget().getUniqueIdentifier() === columnTitleUuid) {
              return col.getTitleWidget();
            }
          }
          return null;
        },

        /**
         * @param columnUuid
         * @param itemUuid
         * @returns {TableColumnItemWidget}
         */
        getItemWidgetFromUuid: function(columnUuid, itemUuid) {
          var column = this.getColumnWidgetFromUuid(columnUuid);
          if (!!column) {
            return column.getItemWidgetFromUuid(itemUuid);
          }
          return null;
        },

        /**
         * @param element dom
         * @returns {TableColumnItemWidget}
         */
        getItemWidgetFromDomElement: function(element) {
          var itemWidget = null;
          element = !element.hasClass ? element.parentNode : element;
          var itemElement = element.hasClass("gbc_TableColumnItemWidget") ? element : element.parent("gbc_TableColumnItemWidget");
          if (itemElement) {
            var columnElement = itemElement.parent("gbc_TableColumnWidget");

            var itemUuid = itemElement.id.slice(2);
            var columnUuid = columnElement.id.slice(2);

            itemWidget = this.getItemWidgetFromUuid(columnUuid, itemUuid);
          }
          return itemWidget;
        },

        /**
         * @param element dom
         * @returns {TableColumnWidget}
         */
        getColumnWidgetFromDomElement: function(element) {
          var columnWidget = null;
          var columnElement = element.hasClass("gbc_TableColumnWidget") ? element : element.parent(
            "gbc_TableColumnWidget");
          if (columnElement) {
            var columnUuid = columnElement.id.slice(2);
            columnWidget = this.getColumnWidgetFromUuid(columnUuid);
          }
          return columnWidget;
        },

        /**
         * @param element dom
         * @returns {TableColumnTitleWidget}
         */
        getColumnTitleWidgetFromDomElement: function(element) {
          var columnTitleWidget = null;
          var columnTitleElement = element && (element.hasClass("gbc_TableColumnTitleWidget") ? element : element.parent(
            "gbc_TableColumnTitleWidget"));
          if (columnTitleElement) {
            var columnTitleUuid = columnTitleElement.id.slice(2);
            columnTitleWidget = this.getColumnTitleWidgetFromUuid(columnTitleUuid);
          }
          return columnTitleWidget;
        },

        /**
         * Sets the number of visible rows
         * @param {number} visibleRows
         */
        setVisibleRows: function(visibleRows) {
          if (this._visibleRows !== visibleRows) {
            this._visibleRows = visibleRows;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              var tableColumn = columns[i];
              if (tableColumn.updateRowsVisibility) {
                tableColumn.updateRowsVisibility();
              }
            }
          }
        },

        /**
         * @returns {number} the size of the columns row buffers
         */
        getVisibleRows: function() {
          return this._visibleRows;
        },

        /**
         * @param {boolean} enable true if the table should allow multi-row selection, false otherwise
         */
        setMultiRowSelectionEnabled: function(enable) {
          this._element.toggleClass("multiRowSelection", !!enable);
        },

        /**
         * @returns {boolean} true if the table should allow multi-row selection, false otherwise
         */
        isMultiRowSelectionEnabled: function() {
          return this._element.hasClass("multiRowSelection");
        },

        /**
         *
         * @param {number} row index of the row
         * @param {boolean} selected true if the row should be selected, false otherwise
         */
        setRowSelected: function(row, selected) {
          var columns = this.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var tableColumn = columns[i];
            tableColumn.setRowSelected(row, selected);
          }
        },

        /**
         * @param {number} row index of the row
         * @returns {boolean} true if the row is selected, false otherwise
         */
        isRowSelected: function(row) {
          var columns = this.getColumns();
          if (!!columns.length) {
            return columns[row].isRowSelected(row);
          }
          return false;
        },

        /**
         * Defines the table pageSize
         * @param pageSize
         */
        setPageSize: function(pageSize) {
          this._setFirstPageSize(pageSize);
          this._pageSize = pageSize;
        },

        _setFirstPageSize: function(pageSize) {
          if (this._firstPageSize === null) {
            this._firstPageSize = pageSize;
          }
        },

        /**
         * @returns the page size
         */
        getPageSize: function() {
          return this._pageSize;
        },

        /**
         * Defines if pageSize is fixed
         * @param fixed
         */
        setFixedPageSize: function(fixed) {
          if (this._fixedPageSize !== fixed) {
            this._fixedPageSize = fixed;
            this._layoutInformation._stretched.setDefaultY(!this._fixedPageSize);
          }
        },

        /**
         * @returns {boolean} pageSize is fixed ?
         */
        isFixedPageSize: function() {
          return this._fixedPageSize;
        },

        /**
         * Define the table size
         * @param size
         */
        setSize: function(size) {
          this._size = size;
        },

        /**
         * Define the table offset
         * @param offset
         */
        setOffset: function(offset) {
          this._offset = offset;
        },

        /**
         * @param focusOnField
         */
        setFocusOnField: function(focusOnField) {
          this._focusOnField = focusOnField;
        },

        /**
         * @returns {boolean} focusOnField
         */
        hasFocusOnField: function() {
          return this._focusOnField;
        },

        // ============== START - FOOTER/AGGREGATE FUNCTIONS ===================

        _updateFooterWidth: function() {
          // Synchronize footer width
          if (this.hasFooter()) {
            this.setStyle(".gbc_TableColumnsFooter", {
              "width": this.getDataAreaWidth() + "px"
            });
          }
        },

        /**
         * Define if the footer element is needed
         * @param b
         */
        setHasFooter: function(b) {
          if (this._hasFooter !== b) {
            this._hasFooter = b;
            this.getColumnsFooter().toggleClass("hidden", !b);
            if (b) {
              this.updateAllAggregate(); // need to update all aggregate
            }
            // need to measure table
            this.getLayoutEngine().forceMeasurement();
            this.getLayoutEngine().invalidateMeasure();
          }
        },

        /**
         * @returns {boolean}
         */
        hasFooter: function() {
          return this._hasFooter;
        },

        /**
         * Update all aggregates
         */
        updateAllAggregate: function() {
          if (this.hasFooter()) {
            // search column which contain an aggregate
            this.resetOrderedColumns();
            var columns = this.getOrderedColumns();
            var firstAggregate = null;
            var aggregateWidth = 0;
            for (var i = 0; i < columns.length; i++) {
              var col = columns[i];
              var agg = col.getAggregateWidget();
              if (!!agg) {
                col.setAggregate(agg.getText(), aggregateWidth);
                aggregateWidth = 0;

                if (!firstAggregate && !agg.isHidden()) {
                  firstAggregate = agg;
                }
              } else {
                if (!col.isHidden()) {
                  aggregateWidth += col.getWidth();
                }
              }
            }

            // Add globalText element to first aggregate widget
            if (firstAggregate) {
              this.getAggregateGlobalTextElement().remove();
              firstAggregate.getElement().prependChild(this.getAggregateGlobalTextElement());
            }
          }
        },

        /**
         * Global text for aggregates
         * @param text
         */
        setAggregateGlobalText: function(text) {
          if (!this._aggregateGlobalTextElement) {
            this._aggregateGlobalTextElement = document.createElement("div");
            this._aggregateGlobalTextElement.addClass("gbc_TableAggregateGlobalText");
          }
          this._aggregateGlobalTextElement.textContent = text;
        },
        // ============== END - FOOTER/AGGREGATE FUNCTIONS ===================

        // ============== START - SCROLL FUNCTIONS ===================
        /**
         * Do native scroll
         * @param value
         * @param delta
         */
        doScroll: function(value, delta) {
          var isTableVisible = this.isVisibleRecursively();
          if (isTableVisible) {
            var top = value;
            if (delta) {
              top = (this.getScrollableArea().scrollTop + value);
            }

            if (this.hasRightFrozenColumns()) {
              this.getRightScrollableArea().scrollTop = top;
            } else {
              this.getScrollableArea().scrollTop = top;
            }
          } else {
            this._needToUpdateVerticalScroll = true;
          }
        },

        /**
         * Do a horizontal scrolling (column by column)
         * @param direction "left" or "right"
         */
        doHorizontalScroll: function(direction) {
          var scrollArea = this.getScrollableArea();
          var scrollPos = scrollArea.scrollLeft;
          var columns = this.getOrderedColumns();
          var width = 0;
          for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            if (col._isFrozen === false && col.isHidden() === false) {
              var colWidth = col.getWidth();

              var isScrollAtStartColumn = (Math.abs(scrollPos - width) <= 2);
              var isScrollAtEndColumn = (Math.abs(scrollPos - (width + colWidth)) <= 2);
              if ((isScrollAtStartColumn || scrollPos > width) && (isScrollAtEndColumn || scrollPos < width + colWidth)) {
                if (isScrollAtStartColumn && direction === "right") {
                  scrollPos = width + colWidth;
                  direction = "left";
                } else if (isScrollAtEndColumn && direction === "right") {
                  scrollPos = width + colWidth;
                } else {
                  scrollArea.scrollLeft = direction === "right" ? width + colWidth : width;
                  break;
                }
              }
              width += colWidth;
            }
          }
        },

        /**
         * Called when a mousewheel is done
         * @param event
         * @private
         */
        _onMouseWheel: function(event) {
          if (this.isEnabled()) {
            this.doScroll(event.deltaY, true);
          }
        },

        /**
         * Called when a scroll is done
         * @param event
         * @private
         */
        _onScroll: function(event) {
          this._resetItemsSelection(); // reset items selection after each scroll change

          window.requestAnimationFrame(function() {
            if (event.target) {
              var targetScrollLeft = event.target.scrollLeft;
              if (this._previousScrollLeftValue !== targetScrollLeft) {
                this._previousScrollLeftValue = targetScrollLeft;

                // Update visible columns
                if (this._throttleUpdateVisibleColumnsInDom) {
                  window.clearTimeout(this._throttleUpdateVisibleColumnsInDom);
                }
                this._throttleUpdateVisibleColumnsInDom = window.setTimeout(function() {
                  this._throttleUpdateVisibleColumnsInDom = null;
                  this._updateVisibleColumnsInDom();
                }.bind(this), 10);

                // Synchronize Columns headers horizontal scroll
                var scrollLeft = this.getScrollableArea().scrollLeft;
                this.getColumnsHeaders().scrollLeft = scrollLeft;

                // Synchronize columns footer horizontal scroll
                if (this.hasFooter()) {
                  this.getColumnsFooter().scrollLeft = scrollLeft;
                }
              }

              if (!this.hasRightFrozenColumns()) {
                // Emit scroll event for vertical scrolling
                this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());

                var scrollTop = event.target.scrollTop;
                this.getLeftScrollableArea().scrollTop = scrollTop;
                this.getRightScrollableArea().scrollTop = scrollTop;
              }
            }
          }.bind(this));
        },

        /**
         * Called when a scroll is done on left frozen columns
         * @param event
         * @private
         */
        _onScrollOnLeftColumns: function(event) {
          // Synchronize Columns headers horizontal scroll
          window.requestAnimationFrame(function() {
            this.getLeftColumnsHeaders().scrollLeft = event.target.scrollLeft;
          }.bind(this));
        },

        /**
         * Called when a scroll is done on right frozen columns
         * @param event
         * @private
         */
        _onScrollOnRightColumns: function(event) {
          // Synchronize Columns headers horizontal scroll
          window.requestAnimationFrame(function() {
            this.getRightColumnsHeaders().scrollLeft = event.target.scrollLeft;

            if (this.hasRightFrozenColumns()) {
              // Emit scroll event for vertical scrolling
              this.emit(context.constants.widgetEvents.scroll, event, this.getRowHeight());

              var scrollTop = event.target.scrollTop;
              this.getLeftScrollableArea().scrollTop = scrollTop;
              this.getScrollableArea().scrollTop = scrollTop;
            }
          }.bind(this));
        },

        /**
         * Update vertical scroll
         * @param forceScroll
         */
        updateVerticalScroll: function(forceScroll) {
          this.setVerticalScroll(this._size, this._pageSize, this._offset, forceScroll);
        },

        /**
         *
         * @param size
         * @param pageSize
         * @param offset
         * @param forceScroll
         */
        // BEWARE this code should be the same as ScrollGridWidget::setVerticalScroll
        setVerticalScroll: function(size, pageSize, offset, forceScroll) {

          if (size !== null) {
            this.setSize(size);
            if (this._pageSize !== pageSize) {
              this._pageSize = pageSize;
              this._resetItemsSelection(); // reset items selection after pageSize change
            }

            var top = 0;
            var height = 0;

            if (this.isEnabled()) {
              top = offset * this.getRowHeight();
              height = (size - offset) * this.getRowHeight();
              if (size < pageSize) { // Height should be always greater than getDataAreaHeight to display correctly gbc_TableAfterLastItemZone
                height = Math.max(Math.floor(this.getDataAreaHeight() - 2), height); // -2 to be sure that container is smaller than scrollarea
              }
            }

            this.setStyle(".gbc_TableColumnsContainer", {
              "margin-top": top + "px",
              "height": height + (this.hasFooter() ? this.getRowHeight() : 0) + "px"
            });

            if (this.hasLeftFrozenColumns()) {
              this.setStyle(".gbc_TableLeftColumnsContainer", {
                "margin-top": top + "px",
                "height": height + "px"
              });
            }

            if (this.hasRightFrozenColumns()) {
              this.setStyle(".gbc_TableRightColumnsContainer", {
                "margin-top": top + "px",
                "height": height + "px"
              });
            }

            // if offset is different or if scrolltop value of current scrollarea is different too different from calculated value
            // need to rest scrolltop of scrollablearea
            if (!!forceScroll || (this.lastSentOffset === null || this.lastSentOffset === offset) && offset !== this._offset) {
              this._offset = offset;
              // need to do this because to scroll we need to wait the style "height" set just before is really applied in the dom
              window.requestAnimationFrame(function() {
                this.doScroll(top, false);
              }.bind(this));
            }
            this.lastSentOffset = null;
          }
        },
        // ============== END - SCROLL FUNCTIONS =====================

        // ============== START - FROZEN COLUMNS FUNCTIONS ===================
        /**
         * Update frozen columns.
         */
        updateFrozenColumns: function() {

          if (this._frozenTable) {
            this._renderFrozenColumns();

            this.getScrollableArea().off('wheel.TableWidget');
            this.getLeftScrollableArea().off('wheel.TableWidget');
            this.getRightScrollableArea().off('wheel.TableWidget');

            if (this.hasLeftFrozenColumns()) {
              this.getLeftScrollableArea().on('wheel.TableWidget', this._onMouseWheel.bind(this));
            }

            if (this.hasRightFrozenColumns()) {
              this.getScrollableArea().on('wheel.TableWidget', this._onMouseWheel.bind(this));

              this.setStyle(".gbc_TableColumnsHeaders", {
                "margin-right": 0
              });
              this.setStyle(".gbc_TableRightColumnsHeaders", {
                "margin-right": window.scrollBarSize + "px"
              });

              this.setStyle(".gbc_TableScrollArea", {
                "overflow-y": "hidden"
              });

            } else {
              this.setStyle(".gbc_TableRightColumnsHeaders", {
                "margin-right": 0
              });
              this.setStyle(".gbc_TableColumnsHeaders", {
                "margin-right": window.scrollBarSize + "px"
              });

              this.setStyle(".gbc_TableScrollArea", {
                "overflow-y": "scroll"
              });
            }

            this.getLeftContainer().toggleClass("hidden", !this.hasLeftFrozenColumns());
            this.getRightContainer().toggleClass("hidden", !this.hasRightFrozenColumns());

            this.updateVerticalScroll();
            var scrollTop = this.getScrollableArea().scrollTop;
            this.getLeftScrollableArea().scrollTop = scrollTop;
            this.getRightScrollableArea().scrollTop = scrollTop;
          }
        },

        /**
         * Returns true if table has left frozen columns
         * @returns {boolean}
         */
        hasLeftFrozenColumns: function() {
          return (this._leftFrozenColumns > 0);
        },

        /**
         * Returns true if table has right frozen columns
         * @returns {boolean}
         */
        hasRightFrozenColumns: function() {
          return (this._rightFrozenColumns > 0);
        },

        /**
         * Render frozen columns.
         */
        _renderFrozenColumns: function() {

          if (this._frozenTable) {
            var columns = this.getOrderedColumns();

            for (var i = 0; i < columns.length; i++) {
              var currentColumn = columns[i];
              currentColumn._isFrozen = true;
              if (i < this._leftFrozenColumns) {
                this.getLeftColumnsContainer().appendChild(currentColumn.getElement());
                this.getLeftColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
              } else if (columns.length - i <= this._rightFrozenColumns) {
                this.getRightColumnsContainer().appendChild(currentColumn.getElement());
                this.getRightColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
              } else {
                currentColumn._isFrozen = false;
                this.getColumnsContainer().appendChild(currentColumn.getElement());
                this.getColumnsHeaders().appendChild(currentColumn.getTitleWidget().getElement());
              }
            }
            this._updateVisibleColumnsInDom();
          }
        },

        /**
         * Returns true if table can have frozen columns
         * @returns {boolean} frozen table ?
         */
        isFrozenTable: function() {
          return this._frozenTable;
        },

        /**
         * Sets if table can contains frozen table.
         * @param {boolean} frozen
         */
        setFrozenTable: function(frozen) {
          if (this._frozenTable !== frozen) {
            this._frozenTable = frozen;
            this.updateFrozenColumns();
          }
        },

        /**
         * Sets the number of left frozen columns.
         * @param {number} n number of left frozen columns
         */
        setLeftFrozenColumns: function(n) {
          if (this._leftFrozenColumns !== n) {
            this._leftFrozenColumns = n;
            this.updateFrozenColumns();
          }
        },

        /**
         * Sets the number of right frozen columns.
         * @param {number} n number of right frozen columns
         */
        setRightFrozenColumns: function(n) {
          if (this._rightFrozenColumns !== n) {
            this._rightFrozenColumns = n;
            this.updateFrozenColumns();
          }
        },

        /**
         * Returns number of left frozen columns
         * @returns {number} number of left frozen columns
         */
        getLeftFrozenColumns: function() {
          return this._leftFrozenColumns;
        },

        /**
         * Returns number of right frozen columns
         * @returns {number} number of right frozen columns
         */
        getRightFrozenColumns: function() {
          return this._rightFrozenColumns;
        },
        // ============== END - FROZEN COLUMNS FUNCTIONS =====================

        // ============== START - STYLE FUNCTIONS ===================
        /**
         * Hide/Show column headers
         * @param {boolean} hidden true if header must be hidden
         */
        setHeaderHidden: function(hidden) {
          if (this._headerHidden !== hidden) {
            this._headerHidden = hidden;
            this.getColumnsHeaders().toggleClass("hidden", !!hidden);
            this.getLeftColumnsHeaders().toggleClass("hidden", !!hidden);
            this.getRightColumnsHeaders().toggleClass("hidden", !!hidden);
          }
        },

        /**
         * Show/hide table grid
         * @param {boolean} showGrid if true always show grid
         */
        setShowGrid: function(showGrid) {
          if (this._showGrid !== showGrid) {
            this._showGrid = showGrid;
            this._element.toggleClass("showGrid", !!showGrid);
          }
        },

        /**
         * Set header columns alignment
         * @param alignment (default, left, center, right, auto)
         */
        setHeaderAlignment: function(alignment) {

          if (this._headerAlignment !== alignment) {
            this._headerAlignment = alignment;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              var col = columns[i];
              col.getTitleWidget().setTextAlign(alignment);
            }
          }

        },

        /**
         * Defines the highlight color of rows for the table, used for selected rows
         * @param color
         */
        setHighlightColor: function(color) {

          if (this._highlightColor !== color) {
            this._highlightColor = color;

            color = (color === null ? null : color + " !important");

            this.setStyle({
              selector: ":not(.disabled) .highlightRow .containerElement .currentRow *",
              appliesOnRoot: true
            }, {
              "background-color": color
            });
          }

        },

        /**
         * Defines the highlighted text color of rows for the table, used for selected rows
         * @param color
         */
        setHighlightTextColor: function(color) {

          if (this._highlightTextColor !== color) {
            this._highlightTextColor = color;

            this.setStyle({
              selector: ":not(.disabled) .highlightRow .containerElement .currentRow *",
              appliesOnRoot: true
            }, {
              "color": color === null ? null : color + " !important",
              "fill": color === null ? null : color + " !important"
            });
          }
        },

        /**
         * Indicates if the current cell must be highlighted in a table
         * @param {boolean} b
         */
        setHighlightCurrentCell: function(b) {

          if (this._highlightCurrentCell !== b) {
            this._highlightCurrentCell = b;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              columns[i]._element.toggleClass("highlightCell", !!b);
            }

            var color = b ? this._highlightColor : null;
            this.setStyle({
              selector: ":not(.disabled) .currentColumn.highlightCell .containerElement .currentRow *",
              appliesOnRoot: true
            }, {
              "background-color": color === null ? null : color + " !important"
            });

            color = b ? this._highlightTextColor : null;
            this.setStyle({
              selector: ":not(.disabled) .currentColumn.highlightCell .containerElement .currentRow *",
              appliesOnRoot: true
            }, {
              "color": color === null ? null : color + " !important"
            });
          }
        },

        /**
         * Indicates if the current row must be highlighted in a table.
         * @param {boolean} b
         */
        setHighlightCurrentRow: function(b) {
          if (this._highlightCurrentRow !== b) {
            this._highlightCurrentRow = b;
            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              columns[i]._element.toggleClass("highlightRow", !!b);
            }

            var bg = null;
            if (!b) {
              // diff between null and false
              bg = (bg === null) ? null : "inherit !important";
              this.setHighlightColor(null);
              this.setHighlightTextColor(null);
            }
            this.setStyle(
              ".currentRow", {
                "background-color": bg
              });
          }
        },

        /**
         * Indicates if the last visible column should fill the empty space.
         * @param {boolean} b
         */
        setResizeFillsEmptySpace: function(b) {
          this._resizeFillsEmptySpace = b;

        },

        /**
         * Indicates if the last visible column should fill the empty space.
         * @return {boolean}
         */
        isResizeFillsEmptySpace: function(b) {
          return this._resizeFillsEmptySpace;
        },
        // ============== END - STYLE FUNCTIONS =====================

        // ============== START - HEADER Event/DnD FUNCTIONS ===================

        /**
         * Handle click on header
         * @param evt
         * @private
         */
        _onHeaderClick: function(evt) {
          if (evt.target.hasClass("headerText")) { // click on header text
            var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
            if (!!columnTitleWidget) {
              columnTitleWidget.onTextClick(evt);
            }
          }
        },

        /**
         * Handle double click on header
         * @param evt
         * @private
         */
        _onHeaderDoubleClick: function(evt) {
          if (evt.target.hasClass("resizer")) { // double click on resizer
            var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
            if (!!columnTitleWidget) {
              columnTitleWidget.onResizerDoubleClick(evt);
            }
          }
        },

        /**
         * Handle contextmenu on header
         * @param evt
         * @private
         */
        _onHeaderContextMenu: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!columnTitleWidget) {
            return;
          }
          columnTitleWidget.onContextMenu(evt);
        },

        /**
         * Handle reordering drop event
         * @param evt
         * @private
         */
        _onHeaderDrop: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!!columnTitleWidget) {
            columnTitleWidget.onReorderingDrop(evt);
          } else if (this._dndMode === "columnReordering") {
            if (this._dndReorderingDragOverWidget === null) { // it means user drop column on the header but after the last column
              var orderedColumns = this.getOrderedColumns();
              this._dndDraggedColumnWidget.getTitleWidget().reorderColumns(this._dndDraggedColumnWidget, orderedColumns[
                orderedColumns.length - 1]);
            }
          }
        },

        /**
         * Handle drag start on header
         * @param evt
         * @private
         */
        _onHeaderDragStart: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!columnTitleWidget) {
            return;
          }

          if (evt.target.hasClass("resizer")) { // drag start on resizer
            columnTitleWidget.onResizerDragStart(evt);
          } else if (evt.target.hasClass("headerText")) { // drag start on headerText
            columnTitleWidget.onReorderingDragStart(evt);
          }
        },

        /**
         * Handle drag start on header
         * @param evt
         * @private
         */
        _onHeaderDragEnd: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!columnTitleWidget) {
            return;
          }

          if (evt.target.hasClass("resizer")) { // drag end on resizer
            columnTitleWidget.onResizerDragEnd(evt);
          } else if (evt.target.hasClass("headerText")) { // drag end on headerText
            columnTitleWidget.onReorderingDragEnd(evt);
          }
        },

        /**
         * Handle drag over on header
         * @param evt
         * @private
         */
        _onHeaderDragOver: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!columnTitleWidget) {
            return;
          }
          columnTitleWidget.onReorderingDragOver(evt);
        },

        /**
         * Handle drag leave on header
         * @param evt
         * @private
         */
        _onHeaderDragLeave: function(evt) {
          var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
          if (!columnTitleWidget) {
            return;
          }
          columnTitleWidget.onReorderingDragLeave(evt);
        },

        /**
         * Handle drag start on header
         * @param evt
         * @private
         */
        _onHeaderDrag: function(evt) {
          if (evt.target.hasClass("resizer")) { // drag start on resizer
            var columnTitleWidget = this.getColumnTitleWidgetFromDomElement(evt.target);
            if (!!columnTitleWidget) {
              columnTitleWidget.onResizerDrag(evt);
            }
          }
        },

        // ============== END - HEADER Event/DnD FUNCTIONS ===================

        // ============== START - ITEMS CLIENT SELECTION FUNCTIONS ===================

        /**
         * Set if item selection is the default behavior (disable dnd in this case)
         * @param b
         */
        setDefaultItemSelection: function(b) {
          this._defaultItemSelection = b;
          if (b === true) {
            this.setDndItemEnabled(false);
          }
        },

        /**
         * Check wtih this mousevent can allow item selection
         * @param evt
         * @returns {boolean}
         */
        _isEventAllowItemSelection: function(evt) {
          return (!this._inputMode && (evt.ctrlKey || evt.metaKey || this._defaultItemSelection)) || (this._inputMode && (evt.ctrlKey ||
            evt.metaKey || (this._defaultItemSelection &&
              !this._enabled)));
        },

        /**
         * Returns true if there are some items selected
         * @returns {boolean}
         */
        hasItemsSelected: function() {
          return this._firstItemSelected !== null;
        },

        /**
         * Reset items selection
         * @private
         */
        _resetItemsSelection: function() {
          if (this.hasItemsSelected()) {
            this._itemSelectionInProgress = false;
            this._firstItemSelected = null;
            if (this._itemSelectionElement) {
              this._itemSelectionElement.addClass("hidden");
            }
            this._setItemSelection(false);
          }
        },

        /**
         * Handle mouseDown event for table items
         * @param evt
         * @private
         */
        _onItemMouseDown: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);

          this._resetItemsSelection();

          // Start item selection
          if (!!itemWidget && this._isEventAllowItemSelection(evt)) {

            // To avoid text selection in input array
            evt.stopPropagation();
            evt.preventDefault();

            // Create selection rect element
            if (this._itemSelectionElement === null) {
              this._itemSelectionElement = document.createElement("span");
              this._itemSelectionElement.addClass("gbc_TableItemSelectionArea");
              this._element.appendChild(this._itemSelectionElement);
            }
            this._itemSelectionInProgress = true;
            this._firstItemSelected = itemWidget;

            // disable dnd
            this._temporaryEnabledDndOnItem(false, this._firstItemSelected);
          }
        },

        /**
         * Stop item selection in progress
         * @param evt
         * @private
         */
        _stopInProgressItemSelection: function(evt) {
          this._itemSelectionInProgress = false;
          if (this._isEventAllowItemSelection(evt)) {
            // renable dnd
            this._temporaryEnabledDndOnItem(this._dndItemEnabled, this._firstItemSelected);

            var itemWidget = this.getItemWidgetFromDomElement(evt.target);
            if (itemWidget === this._firstItemSelected) {
              this._resetItemsSelection();
            }
          }
        },

        /**
         * Handle mouseUp event for table items
         * @param evt
         * @private
         */
        _onItemMouseUp: function(evt) {
          this._stopInProgressItemSelection(evt);
        },

        /**
         * Handle mouseLeave event for table items
         * @param evt
         * @private
         */
        _onItemMouseLeave: function(evt) {
          this._stopInProgressItemSelection(evt);
        },

        /**
         * Handle mouseMove event for table items
         * @param evt
         * @private
         */
        _onItemMouseMove: function(evt) {
          if (this._itemSelectionInProgress && this._isEventAllowItemSelection(evt)) {
            var itemWidget = this.getItemWidgetFromDomElement(evt.target);
            if (!!itemWidget) {
              if (this.hasItemsSelected()) {
                this._setItemSelection(true, this._firstItemSelected, itemWidget);
              }
            }
          }
        },

        /**
         * Copy current items selection in the clipboard
         * @private
         */
        _copySelectionInClipboard: function() {
          var rows = [];
          var rowIndex;

          for (var i = 0; i < this.getOrderedColumns().length; i++) {
            var col = this.getOrderedColumns()[i];

            rowIndex = 0;
            for (var j = 0; j < col.getChildren().length; j++) {
              var item = col.getChildren()[j];

              if (item.isClientSelected()) {

                var text = item.getChildren()[0].getValue() + "\t";
                if (rows.length <= rowIndex) {
                  rows.push(text);
                } else {
                  rows[rowIndex] += text;
                }
                rowIndex++;
              }
            }
          }
          cls.ClipboardHelper.copyTo(rows.join("\r\n"), this._element);
        },

        /**
         * Copy current row items in the clipboard
         * @private
         */
        _copyCurrentRowInClipboard: function() {
          var row = "";

          for (var i = 0; i < this.getOrderedColumns().length; i++) {
            var col = this.getOrderedColumns()[i];
            if (!col.isHidden()) {
              if (this._currentRow >= 0 && this._currentRow < col.getChildren().length) {
                var item = col.getChildren()[this._currentRow];
                row += item.getChildren()[0].getValue() + "\t";
              }
            }
          }

          cls.ClipboardHelper.copyTo(row, this._element);
        },

        /**
         * Select items
         * @param b true/false select or unselect items
         * @param startSelectedItem
         * @param endSelectedItem
         * @private
         */
        _setItemSelection: function(b, startSelectedItem, endSelectedItem) {

          var realStartRow = -1;
          var realEndRow = -1;
          var realStartCol = -1;
          var realEndCol = -1;

          if (b && !!startSelectedItem && !!endSelectedItem) {

            var startCol = startSelectedItem.getParentWidget().getOrderedColumnIndex();
            var startRow = startSelectedItem.getItemIndex();
            var endCol = !endSelectedItem ? startCol : endSelectedItem.getParentWidget().getOrderedColumnIndex();
            var endRow = !endSelectedItem ? startRow : endSelectedItem.getItemIndex();

            realStartRow = (startRow < endRow) ? startRow : endRow;
            realEndRow = (startRow < endRow) ? endRow : startRow;
            realStartCol = (startCol < endCol) ? startCol : endCol;
            realEndCol = (startCol < endCol) ? endCol : startCol;

            var mostLeftItem = (realStartCol === startCol) ? startSelectedItem : endSelectedItem;
            var mostRightItem = (realStartCol === startCol) ? endSelectedItem : startSelectedItem;
            var left = mostLeftItem.getElement().getBoundingClientRect().left;
            var right = mostRightItem.getElement().getBoundingClientRect().right;

            var mostTopItem = (realStartRow === startRow) ? startSelectedItem : endSelectedItem;
            var mostBottomItem = (realStartRow === startRow) ? endSelectedItem : startSelectedItem;
            var top = mostTopItem.getElement().getBoundingClientRect().top;
            var bottom = mostBottomItem.getElement().getBoundingClientRect().bottom;
            var tableTop = this.getElement().getBoundingClientRect().top;
            var tableLeft = this.getElement().getBoundingClientRect().left;

            this.setStyle(".gbc_TableItemSelectionArea", {
              "left": (left - tableLeft) + "px",
              "top": (top - tableTop) + "px",
              "width": (right - left) + "px",
              "height": (bottom - top) + "px"
            });

            this._itemSelectionElement.removeClass("hidden");
          }

          for (var i = 0; i < this.getOrderedColumns().length; i++) {
            var col = this.getOrderedColumns()[i];
            for (var j = 0; j < col.getChildren().length; j++) {
              var item = col.getChildren()[j];

              var select = (b && i >= realStartCol && i <= realEndCol && j >= realStartRow && j <= realEndRow);
              item.setClientSelected(select);
            }
          }
        },

        /**
         * Enable or diasble Dnd on a item
         * @param b true/false enable/disable Dnd on item
         * @param item
         * @private
         */
        _temporaryEnabledDndOnItem: function(b, item) {
          if (item) {
            item.setDndEnabled(b);

            if (b) {
              this.getColumnsContainer().setAttribute("draggable", "true");
            } else {
              this.getColumnsContainer().removeAttribute("draggable");
            }
          }
        },
        // ============== END - ITEMS CLIENT SELECTION FUNCTIONS ===================

        // ============== START - ITEMS DnD FUNCTIONS ===================
        /**
         * Enable Dnd of items
         * @param b
         */
        setDndItemEnabled: function(b) {
          if (b && this._defaultItemSelection) {
            return; // no dnd if default is item selection
          }

          if (this._dndItemEnabled !== b) {
            this._dndItemEnabled = b;

            var columns = this.getColumns();
            for (var i = 0; i < columns.length; i++) {
              columns[i].setDndItemEnabled(b);
            }

            var columnsContainer = this.getColumnsContainer();
            if (b) {
              columnsContainer.setAttribute("draggable", "true");
              columnsContainer.on("dragstart.item_TableWidget", this._onItemDragStart.bind(this));
              columnsContainer.on("dragend.item_TableWidget", this._onItemDragEnd.bind(this));
              columnsContainer.on("dragover.item_TableWidget", this._onItemDragOver.bind(this));
              columnsContainer.on("drop.item_TableWidget", this._onItemDrop.bind(this));
              columnsContainer.on("dragleave.item_TableWidget", this._onItemDragLeave.bind(this));
              columnsContainer.on("dragenter.item_TableWidget", this._onItemDragEnter.bind(this));
            } else {
              columnsContainer.removeAttribute("draggable");
              columnsContainer.off("dragstart.item_TableWidget");
              columnsContainer.off("dragend.item_TableWidget");
              columnsContainer.off("dragover.item_TableWidget");
              columnsContainer.off("drop.item_TableWidget");
              columnsContainer.off("dragleave.item_TableWidget");
              columnsContainer.off("dragenter.item_TableWidget");
            }
          }
        },

        /**
         * Handle dragStart event for table items
         * @param evt
         * @private
         */
        _onItemDragStart: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDragStart(evt);
          }
        },
        /**
         * Handle dragEnd event for table items
         * @param evt
         * @private
         */
        _onItemDragEnd: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDragEnd(evt);
          }
        },
        /**
         * Handle dragOver event for table items
         * @param evt
         * @private
         */
        _onItemDragOver: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDragOver(evt);
          } else {
            if (evt.target.hasClass("gbc_TableAfterLastItemZone")) {
              var columnElement = evt.target.parent("gbc_TableColumnWidget");
              var columnWidget = this.getColumnWidgetFromUuid(columnElement.id.slice(2));
              columnWidget.onDragOverAfterLastItem(evt);
            }
          }
        },
        /**
         * Handle drop event for table items
         * @param evt
         * @private
         */
        _onItemDrop: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDrop(evt);
          } else {
            if (evt.target.hasClass("gbc_TableAfterLastItemZone")) {
              var columnElement = evt.target.parent("gbc_TableColumnWidget");
              var columnWidget = this.getColumnWidgetFromUuid(columnElement.id.slice(2));
              columnWidget.onDropAfterLastItem(evt);
            }
          }
        },
        /**
         * Handle dragLeave event for table items
         * @param evt
         * @private
         */
        _onItemDragLeave: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDragLeave(evt);
          }
        },
        /**
         * Handle dragEnter event for table items
         * @param evt
         * @private
         */
        _onItemDragEnter: function(evt) {
          var itemWidget = this.getItemWidgetFromDomElement(evt.target);
          if (!!itemWidget) {
            itemWidget.onDragEnter(evt);
          }
        },
        // ============== END - ITEMS DnD FUNCTIONS =====================

        // ============== START - Other Event handler FUNCTIONS ===================

        /**
         * Handle double click event
         * @param evt
         * @private
         */
        _onDoubleClick: function(evt) {
          var columnWidget = this.getColumnWidgetFromDomElement(evt.target);
          if (!columnWidget) {
            return;
          }
          columnWidget.onDoubleClick(evt);
        },

        /**
         * Handle click event
         * @param evt
         * @private
         */
        _onClick: function(evt) {
          if (evt.target.hasClass("gbc_TableAfterLastItemZone")) { // click on afterLastItemZone {
            var columnWidget = this.getColumnWidgetFromDomElement(evt.target);
            if (!columnWidget) {
              return;
            }
            columnWidget.onClickAfterLastItem(evt);
          }
        },
        // ============== END - Other Event handler FUNCTIONS ===================

        // ============== START - DOM ELEMENT GETTERS ===================
        getLeftContainer: function() {
          if (!this._leftContainerElement) {
            this._leftContainerElement = this._element.getElementsByClassName("gbc_TableLeftContainer")[0];
          }
          return this._leftContainerElement;
        },

        getRightContainer: function() {
          if (!this._rightContainerElement) {
            this._rightContainerElement = this._element.getElementsByClassName("gbc_TableRightContainer")[0];
          }
          return this._rightContainerElement;
        },

        getColumnsContainer: function() {
          if (!this._columnsContainerElement) {
            this._columnsContainerElement = this._element.getElementsByClassName("gbc_TableColumnsContainer")[0];
          }
          return this._columnsContainerElement;
        },

        getLeftColumnsContainer: function() {
          if (!this._leftColumnsContainer) {
            this._leftColumnsContainer = this._element.getElementsByClassName("gbc_TableLeftColumnsContainer")[0];
          }
          return this._leftColumnsContainer;
        },

        getRightColumnsContainer: function() {
          if (!this._rightColumnsContainer) {
            this._rightColumnsContainer = this._element.getElementsByClassName("gbc_TableRightColumnsContainer")[0];
          }
          return this._rightColumnsContainer;
        },

        getColumnsHeaders: function() {
          if (!this._columnsHeaders) {
            this._columnsHeaders = this._element.getElementsByClassName("gbc_TableColumnsHeaders")[0];
          }
          return this._columnsHeaders;
        },

        getLeftColumnsHeaders: function() {
          if (!this._leftColumnsHeaders) {
            this._leftColumnsHeaders = this._element.getElementsByClassName("gbc_TableLeftColumnsHeaders")[0];
          }
          return this._leftColumnsHeaders;
        },

        getRightColumnsHeaders: function() {
          if (!this._rightColumnsHeaders) {
            this._rightColumnsHeaders = this._element.getElementsByClassName("gbc_TableRightColumnsHeaders")[0];
          }
          return this._rightColumnsHeaders;
        },

        getColumnsFooter: function() {
          if (!this._columnsFooter) {
            this._columnsFooter = this.getElement().getElementsByClassName("gbc_TableColumnsFooter")[0];
          }
          return this._columnsFooter;
        },

        getScrollableArea: function() {
          if (!this._scrollAreaElement) {
            this._scrollAreaElement = this._element.getElementsByClassName("gbc_TableScrollArea")[0];
          }
          return this._scrollAreaElement;
        },

        getRightScrollableArea: function() {
          if (!this._rightScrollAreaElement) {
            this._rightScrollAreaElement = this._element.getElementsByClassName("gbc_TableRightScrollArea")[0];
          }
          return this._rightScrollAreaElement;
        },

        getLeftScrollableArea: function() {
          if (!this._leftScrollAreaElement) {
            this._leftScrollAreaElement = this._element.getElementsByClassName("gbc_TableLeftScrollArea")[0];
          }
          return this._leftScrollAreaElement;
        },

        getAggregateGlobalTextElement: function() {
          return this._aggregateGlobalTextElement;
        }

        // ============== END - DOM ELEMENT GETTERS =====================
      };
    });
    cls.WidgetFactory.register('Table', cls.TableWidget);
  });
