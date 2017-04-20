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

modulum('TableColumnTitleWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Table column title widget.
     * @class classes.TableColumnTitleWidget
     * @extends classes.WidgetBase
     */
    cls.TableColumnTitleWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.TableColumnTitleWidget.prototype */
      return {
        __name: "TableColumnTitleWidget",

        _resizerDragX: null,
        _contextMenu: null,
        _autoAlignment: false,

        _sortIconElement: null,
        _sortGlyph: null,

        /**
         * @constructs {classes.TableColumnItemWidget}
         */
        constructor: function(opts) {
          opts = (opts || {});
          opts.inTable = true;
          $super.constructor.call(this, opts);
        },

        _initLayout: function() {
          // no layout
        },

        destroy: function() {
          if (this._contextMenu) {
            this._contextMenu.destroy();
            this._contextMenu = null;
          }
          $super.destroy.call(this);
        },

        onContextMenu: function(e) {
          if (e.shiftKey) {
            return;
          }
          e.preventDefault();
          this._buildContextMenu();
        },

        /**
         * Add a context menu to the table
         * @private
         */
        _buildContextMenu: function() {
          if (this._contextMenu && this._contextMenu.isVisible()) {
            this._contextMenu.show(false);
          }
          var table = this.getTableWidget();
          if (table) {
            this._contextMenu = cls.WidgetFactory.create("ChoiceDropDown");
            this._contextMenu.autoSize = false;
            this._contextMenu.alignToLeft = false;
            this._contextMenu.allowMultipleChoices(true);
            this._contextMenu.setParentWidget(this);
            this._contextMenu.getElement().addClass("menu");

            this._contextMenu._blurHandler = this._contextMenu.destroy.bind(this);

            var columns = table.getColumns();
            var tableColumn = this.getParentWidget();

            // Hide/show columns
            var hideShowFunc = function(columnTitle) {
              this.emit(gbc.constants.widgetEvents.tableShowHideCol, "toggle");
            };

            // Be sure that the last checkbox is always check (cannot hide all columns)
            var checkLast = function(checkWidget, columnTitle) {
              var children = columnTitle.getContextMenu().getChildren();
              var checkCount = children.filter(function(c) {
                if (c._tc) {
                  c.setEnabled(!c._tc.isUnhidable());
                  if (c.__name === "CheckBoxWidget" && c.getValue()) {
                    return c;
                  }
                }
              });
              if (checkCount.length === 1) {
                checkCount[0].setEnabled(false);
              }
            };

            for (var i = 0; i < columns.length; i++) {
              var tc = columns[i];
              if (!tc.isAlwaysHidden()) {
                var check = cls.WidgetFactory.create("CheckBox");
                check._tc = tc;
                check.setEnabled(!tc.isUnhidable());
                check.setText(tc.getTitleWidget().getText());
                check.setValue(!tc.isHidden());
                checkLast(check, this);
                check.when(context.constants.widgetEvents.change, checkLast.bind(tc, check, this));
                this._contextMenu.addChildWidget(check, hideShowFunc.bind(tc, this));
              }
            }

            this._contextMenu.addChildWidget(cls.WidgetFactory.create("HLine"));

            // Show all columns action
            var showAllColumnsLabel = cls.WidgetFactory.create("Label");
            showAllColumnsLabel.setValue(i18next.t("gwc.contextMenu.showAllColumns"));
            showAllColumnsLabel.addClass("gbc_showAllColumns_action");
            this._contextMenu.addChildWidget(showAllColumnsLabel, function() {
              this._contextMenu.destroy();
              var columns = this.getTableWidget().getColumns();
              for (var i = 0; i < columns.length; i++) {
                var tc = columns[i];
                if (!tc.isAlwaysHidden() && !tc.isUnhidable()) {
                  tc.emit(gbc.constants.widgetEvents.tableShowHideCol, "show");
                }
              }
            }.bind(this));

            // hide other columns action
            var hideOtherColumnsLabel = cls.WidgetFactory.create("Label");
            hideOtherColumnsLabel.setValue(i18next.t("gwc.contextMenu.hideAllButSelected"));
            hideOtherColumnsLabel.addClass("gbc_hideAllButSelected_action");
            this._contextMenu.addChildWidget(hideOtherColumnsLabel, function() {
              this._contextMenu.destroy();
              var columns = this.getTableWidget().getColumns();
              for (var i = 0; i < columns.length; i++) {
                var tc = columns[i];
                if (!tc.isAlwaysHidden() && !tc.isUnhidable() && tc !== this.getParentWidget()) {
                  tc.emit(gbc.constants.widgetEvents.tableShowHideCol, "hide");
                }
              }
            }.bind(this));

            // Reset to default action
            var resetDefaultLabel = cls.WidgetFactory.create("Label");
            resetDefaultLabel.setValue("Reset to Default");
            resetDefaultLabel.addClass("gbc_restoreColumnSort_action");
            this._contextMenu.addChildWidget(resetDefaultLabel, function() {
              this._contextMenu.destroy();
              table.emit(context.constants.widgetEvents.tableResetToDefault);
            }.bind(this));

            // Reset sort order action
            var resetLabel = cls.WidgetFactory.create("Label");
            resetLabel.setValue(i18next.t("gwc.contextMenu.restoreColumnSort"));
            resetLabel.addClass("gbc_restoreColumnSort_action");
            this._contextMenu.addChildWidget(resetLabel, function() {
              this._contextMenu.destroy();
              tableColumn.emit(context.constants.widgetEvents.tableHeaderClick, "reset");
            }.bind(this));

            //Frozen columns
            if (table.isFrozenTable()) {
              this._contextMenu.addChildWidget(cls.WidgetFactory.create("HLine"));

              var leftFrozenLabel = cls.WidgetFactory.create("Label");
              var rightFrozenLabel = cls.WidgetFactory.create("Label");
              var unfreezeLabel = cls.WidgetFactory.create("Label");
              var freezeIndex = 0;
              var columnCount = 0;

              leftFrozenLabel.setValue(i18next.t("gwc.contextMenu.freezeLeft"));
              rightFrozenLabel.setValue(i18next.t("gwc.contextMenu.freezeRight"));
              unfreezeLabel.setValue(i18next.t("gwc.contextMenu.unfreezeAll"));

              leftFrozenLabel.addClass("gbc_freezeLeft_action");
              rightFrozenLabel.addClass("gbc_freezeRight_action");
              unfreezeLabel.addClass("gbc_unfreezeAll_action");

              this._contextMenu.addChildWidget((this.isReversed() ? rightFrozenLabel : leftFrozenLabel), function() {
                this._contextMenu.destroy();
                freezeIndex = tableColumn.getOrderedColumnIndex() + 1;
                table.setLeftFrozenColumns(freezeIndex);
                table.emit(gbc.constants.widgetEvents.tableLeftFrozen, freezeIndex);
              }.bind(this));
              this._contextMenu.addChildWidget((this.isReversed() ? leftFrozenLabel : rightFrozenLabel), function() {
                this._contextMenu.destroy();
                columnCount = columns.length;
                freezeIndex = tableColumn.getOrderedColumnIndex();
                table.setRightFrozenColumns(columnCount - freezeIndex);
                table.emit(gbc.constants.widgetEvents.tableRightFrozen, columnCount - freezeIndex);
              }.bind(this));
              this._contextMenu.addChildWidget(unfreezeLabel, function() {
                this._contextMenu.destroy();
                table.setLeftFrozenColumns(0);
                table.setRightFrozenColumns(0);
                table.emit(gbc.constants.widgetEvents.tableLeftFrozen, 0);
                table.emit(gbc.constants.widgetEvents.tableRightFrozen, 0);
              }.bind(this));
            }

            this._element.focus();
            cls.KeyboardHelper.bindKeyboardNavigation(this._element, this._contextMenu);
            context.keyboard(this._element).bind(['esc'], function(evt) {
              this._contextMenu.emit(context.constants.widgetEvents.esc, evt);
            }.bind(this));
            this._contextMenu.show(true, true);
          }
        },

        /**
         * @returns {*|jQuery} the resizer element
         */
        getResizer: function() {
          return this._element.getElementsByClassName("resizer")[0];
        },

        /**
         * @returns {*|jQuery} the headerText element
         */
        getHeaderText: function() {
          return this._element.getElementsByClassName("headerText")[0];
        },

        /**
         *
         * @returns {widget} the context menu widget
         */
        getContextMenu: function() {
          return this._contextMenu;
        },

        /**
         * @returns {*|jQuery} the sortIcon element
         */
        getSortIconElement: function() {
          return this._sortIconElement;
        },

        /**
         * @returns {classes.WidgetBase} the resizer element
         */
        getTableWidget: function() {
          return this._parentWidget._parentWidget;
        },

        /**
         * Handle click event on text
         * @param evt
         * @private
         */
        onTextClick: function() {
          this.getParentWidget().emit(context.constants.widgetEvents.tableHeaderClick);
        },

        /**
         * Handle resizer double click event
         * @param evt
         * @private
         */
        onResizerDoubleClick: function() {
          this.getParentWidget().autoSetWidth();
        },

        /**
         * Handle resizer dragStart event
         * @param evt
         * @private
         */
        onResizerDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }
          if (this.getParentWidget().isSizable()) {
            this.getTableWidget()._dndMode = "columnResizing";
            this.getParentWidget().getElement().addClass("resizing");
            this._resizerDragX = evt.clientX || evt.screenX;
          } else {
            evt.preventDefault();
          }
        },

        /**
         * Handle resizer drag event
         * @param evt
         * @private
         */
        onResizerDrag: function(evt) {
          if (this.getTableWidget()._dndMode === "columnResizing") {
            if (!this._resizerDragX || !this.getTableWidget()._dndMouseDragX) {
              return;
            }
            var size = this.getTableWidget()._dndMouseDragX - this._resizerDragX;
            var initialWidth = this.getParentWidget().getWidth();

            var newWidth = initialWidth + size;
            if (this.isReversed()) {
              newWidth = initialWidth - size;
            }
            if (newWidth > 30) {
              this._resizerDragX = this.getTableWidget()._dndMouseDragX;
              this.getParentWidget().setWidthFromUserInteraction(newWidth);
            }
          }
        },

        /**
         * Handle resizer dragEnd event
         * @param evt
         * @private
         */
        onResizerDragEnd: function(evt) {
          var tc = this.getParentWidget();
          tc._element.removeClass("resizing");

          this._resizerDragX = null;
          evt.preventDefault();

          this.getTableWidget()._dndMode = null;

          // Save stored settings
          var width = tc.getWidth();
          this.getParentWidget().setWidthFromUserInteraction(width);
        },

        /**
         * Handle reordering dragStart event
         * @param evt
         * @private
         */
        onReorderingDragStart: function(evt) {
          if (window.browserInfo.isFirefox) { // Firefox 1.0+
            try {
              evt.dataTransfer.setData('text/plain', ''); // for Firefox compatibility
            } catch (ex) {
              console.error("evt.dataTransfer.setData('text/plain', ''); not supported");
            }
          }

          if (this.getParentWidget().isMovable()) {
            this.getTableWidget()._dndMode = "columnReordering";
            this.getTableWidget()._dndDraggedColumnWidget = this.getParentWidget();
          } else {
            evt.preventDefault();
          }
        },

        /**
         * Handle reordering dragEnd event
         * @param evt
         * @private
         */
        onReorderingDragEnd: function(evt) {
          if (this.getTableWidget()._dndReorderingDragOverWidget !== null) {
            this.getTableWidget()._dndReorderingDragOverWidget.getElement()
              .removeClass("reordering_left").removeClass("reordering_right");
            this.getTableWidget()._dndReorderingDragOverWidget = null;
          }
          // When releasing the drag, remove all noDrop classes
          var allNoDrop = this.getTableWidget().getElement().querySelectorAll(".noDrop");
          for (var i = 0; i < allNoDrop.length; i++) {
            allNoDrop[i].removeClass("noDrop");
          }
          this.getTableWidget()._noDrop = {
            "left": false,
            "right": false,
            "center": false
          };
          this.getTableWidget()._dndMode = null;
          this.getTableWidget()._dndDraggedColumnWidget = null;
        },

        /**
         * Handle reordering drop event
         * @param evt
         * @private
         */
        onReorderingDrop: function(evt) {
          if (this.getTableWidget()._dndMode === "columnReordering") {
            if (this.getTableWidget()._dndReorderingDragOverWidget && this.getTableWidget()._dndDraggedColumnWidget !== this.getTableWidget()
              ._dndReorderingDragOverWidget) {

              this.reorderColumns(this.getTableWidget()._dndDraggedColumnWidget, this.getTableWidget()._dndReorderingDragOverWidget);
            }
          }
        },

        /**
         *
         * @param draggedColumn
         * @param dropColumn
         */
        reorderColumns: function(draggedColumn, dropColumn) {
          var tableWidget = this.getTableWidget();
          tableWidget.resetOrderedColumns();
          var orderedColumns = tableWidget.getOrderedColumns();
          var newOrderedColumns = orderedColumns.slice();

          var dragColIndex = newOrderedColumns.indexOf(draggedColumn);
          var dropColIndex = newOrderedColumns.indexOf(dropColumn);

          newOrderedColumns.removeAt(dragColIndex);
          newOrderedColumns.insert(this.getTableWidget()._dndDraggedColumnWidget, dropColIndex);

          for (var i = 0; i < newOrderedColumns.length; i++) {
            var col = newOrderedColumns[i];
            col.emit(context.constants.widgetEvents.tableOrderColumn, i + 1);
            col.setOrder(i);
          }
        },

        /**
         * Handle reordering dragOver event
         * @param evt
         * @private
         */
        onReorderingDragOver: function(evt) {

          if (this.getTableWidget()._dndMode === "columnReordering") {

            var lastReorderingDragOverColumnWidget = this.getTableWidget()._dndReorderingDragOverWidget;
            if (lastReorderingDragOverColumnWidget !== this.getParentWidget()) {

              if (lastReorderingDragOverColumnWidget !== null) {
                lastReorderingDragOverColumnWidget.getElement()
                  .removeClass("reordering_left").removeClass("reordering_right");
              }
              this.getTableWidget()._dndReorderingDragOverWidget = this.getParentWidget();
            }

            var overIndex = this.getParentWidget().getOrderedColumnIndex();
            var startIndex = this.getTableWidget()._dndDraggedColumnWidget.getOrderedColumnIndex();

            // Make a visual difference to "show" that it's not permitted to drop frozen columns in other containers
            if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableLeftColumnsHeaders")) {
              //noDrop on gbc_TableColumnsHeaders or gbc_TableRightColumnsHeaders
              if (!this.getTableWidget()._noDrop.left) {
                this.getTableWidget().getRightColumnsContainer().addClass("noDrop");
                this.getTableWidget().getRightColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getColumnsContainer().addClass("noDrop");
                this.getTableWidget().getColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": false,
                  "right": true,
                  "center": true
                };
              }
            } else if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableRightColumnsHeaders")) {
              //noDrop on gbc_TableColumnsHeaders or gbc_TableLeftColumnsHeaders
              if (!this.getTableWidget()._noDrop.right) {
                this.getTableWidget().getLeftColumnsContainer().addClass("noDrop");
                this.getTableWidget().getLeftColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getColumnsContainer().addClass("noDrop");
                this.getTableWidget().getColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": true,
                  "right": false,
                  "center": true
                };
              }
            } else if (evt.currentTarget && evt.currentTarget.hasClass("gbc_TableColumnsHeaders")) {
              if (!this.getTableWidget()._noDrop.center) {
                this.getTableWidget().getLeftColumnsContainer().addClass("noDrop");
                this.getTableWidget().getLeftColumnsHeaders().addClass("noDrop");
                this.getTableWidget().getRightColumnsContainer().addClass("noDrop");
                this.getTableWidget().getRightColumnsHeaders().addClass("noDrop");
                this.getTableWidget()._noDrop = {
                  "left": true,
                  "right": true,
                  "center": false
                };
              }
            }
            this.getParentWidget().getElement().addClass(overIndex >= startIndex ? "reordering_right" : "reordering_left");
          }
        },

        /**
         * Handle reordering dragLeave event
         * @param evt
         * @private
         */
        onReorderingDragLeave: function(evt) {

          if (this.getTableWidget()._dndMode === "columnReordering") {
            this.getParentWidget().getElement().removeClass("reordering_left").removeClass("reordering_right");
            this.getTableWidget()._dndReorderingDragOverWidget = null;
          }
        },

        /**
         * @param {string} text the text to display
         */
        setText: function(text) {
          this._element.getElementsByClassName("headerText")[0].textContent = text;
        },

        /**
         * @returns {string} the text to display
         */
        getText: function() {
          return this._element.getElementsByClassName("headerText")[0].textContent;
        },

        /**
         * @param {number} width title width (pixels)
         */
        setWidth: function(width) {
          this.setStyle({
            "width": width + "px"
          });
        },

        /**
         * @returns {string} title width (ex:"42px")
         */
        getWidthStyle: function() {
          return this.getStyle("width");
        },

        /**
         * Sets the sort decorator caret.
         * @param sortType "asc", "desc" or ""
         */
        setSortDecorator: function(sortType) {

          var glyphClass = "hidden";
          if (sortType === "asc") {
            glyphClass = "caret-up";
          }
          if (sortType === "desc") {
            glyphClass = "caret-down";
          }

          if (!this._sortIconElement && glyphClass !== "hidden") {
            this._sortIconElement = document.createElement("span");
            this._sortIconElement.addClass("sortIcon");
            this._element.prependChild(this._sortIconElement);
          }

          if (this._sortIconElement) {
            this._sortIconElement.removeClass(this._sortGlyph);
            this._sortIconElement.addClass(glyphClass);
          }

          this._sortGlyph = glyphClass;
        },

        /**
         * @param {number} index order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
        },

        hasFocus: function() {
          return true;
        },

        /**
         * Set text alignment
         * @param alignment (left, center, right, auto)
         */
        setTextAlign: function(alignment) {
          if (alignment === "auto") {
            this._autoAlignment = true;
          } else {
            this.setStyle(" .headerText", {
              "text-align": alignment
            });
          }
        },

        isReversed: function() {
          // executed on table column
          return this._parentWidget._parentWidget.isReversed();
        }
      };
    });
    cls.WidgetFactory.register('TableColumnTitle', cls.TableColumnTitleWidget);
  });
