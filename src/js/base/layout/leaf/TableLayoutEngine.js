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

modulum('TableLayoutEngine', ['LeafLayoutEngine'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableLayoutEngine
     * @extends classes.LeafLayoutEngine
     */
    cls.TableLayoutEngine = context.oo.Class(cls.LeafLayoutEngine, function($super) {
      /** @lends classes.TableLayoutEngine.prototype */
      return {
        __name: "TableLayoutEngine",
        _decorationMeasured: false,
        _firstMeasuredColumns: false,
        _minWidth: 0,
        _initialPreferredSize: false,
        _ratio: parseFloat(window.gbc.constants.theme["gbc-font-size-ratio"]),

        translate: function(height, baseSize, rowHeight) {
          baseSize = +baseSize || (16 * this._ratio);
          var rowResult = 0;
          if (!!height) {
            if (Object.isNumber(height)) {
              rowResult = height;
            } else {
              var result = cls.Size.valueRE.exec(height);
              if (result) {
                var numeric = +result[1],
                  unit = result[2];
                switch (unit) {
                  case "ln":
                  case "row":
                    rowResult = numeric;
                    break;
                  case "ch":
                  case "em":
                    rowResult = Math.ceil((numeric * baseSize) / rowHeight);
                    break;
                  case "px":
                    rowResult = Math.ceil(numeric / rowHeight);
                    break;
                  default:
                    rowResult = numeric;
                    break;
                }
              }
            }
          }
          return rowResult;
        },

        setHint: function(widthHint, heightHint) {
          this._widget.getLayoutInformation().setSizeHint(
            ((typeof(widthHint) === "undefined") || widthHint === null || widthHint === "") ? 0 : widthHint, ((typeof(heightHint) ===
              "undefined") || heightHint === null || heightHint === "") ? 0 : heightHint
          );
        },

        prepareMeasure: function() {
          $super.prepareMeasure.call(this);
          var columns = this._widget.getColumns();
          for (var i = 0; i < columns.length; i++) {
            var columnWidget = columns[i];
            if (!columnWidget._firstWidgetPreparedMeasure) {
              var columnItemWidget = columnWidget.getChildren()[0];
              if (columnItemWidget) {
                var widget = columnItemWidget.getChildren()[0];
                if (widget) {
                  widget._layoutEngine.prepareMeasure();
                  columnWidget._firstWidgetPreparedMeasure = true;
                }
              }
            }
          }
        },

        measure: function() {
          $super.measure.call(this);
          var layoutInfo = this._widget.getLayoutInformation();

          // Search row height, foreach column search the height of first widget
          // and compute column width
          var maxRowHeight = this._widget.getRowHeight();
          var columns = this._widget.getColumns(),
            len = columns.length,
            i;
          this._minWidth = 0;
          for (i = 0; i < len; i++) {
            var columnWidget = columns[i];

            columnWidget.measureSize();

            if (!columnWidget.isHidden()) {
              this._minWidth += columnWidget.getWidth();
            }
          }

          var minimalPageSize = this._widget._firstPageSize ? Math.max(this._widget._firstPageSize, 1) :
            1;

          // Compute decoration size
          if (!this._decorationMeasured) {
            this._decorationMeasured = true;
            var footerElement = this._widget.hasFooter() ? this._widget.getColumnsFooter() : null;
            var scrollAreaElement = this._widget.getScrollableArea();

            this._widget._decorateHeight = this._widget.getElement().offsetHeight - scrollAreaElement.offsetHeight + (!!
              footerElement ?
              footerElement.offsetHeight : 0);
            this._widget._decorateWidth = this._widget.getElement().offsetWidth - scrollAreaElement.offsetWidth;
          }

          if (!this._initialPreferredSize) {
            this._initialPreferredSize = true;
            if (!layoutInfo.getSizeHint().getWidth()) {
              layoutInfo.getSizeHint().setWidth(Math.round(this._minWidth) + "px");
            }
            if (!!layoutInfo.getSizeHint().getHeight()) {
              minimalPageSize = Math.max(this.translate(layoutInfo.getSizeHint().getHeight(), layoutInfo.getCharSize().getHeight(),
                maxRowHeight), 1);
              this._widget._firstPageSize = minimalPageSize;
            }
            var h = this._widget._firstPageSize ? this._widget._firstPageSize * (this._widget.getRowHeight() || cls.TableWidget
              .defaultRowHeight) : 1;
            layoutInfo.getSizeHint().setHeight(Math.round(h + this._widget._decorateHeight + window.scrollBarSize) + "px");
            layoutInfo.updatePreferred();
          }

          // default minimum height of a table
          var minHeight = cls.TableWidget.minPageSize *
            (this._widget.getRowHeight() || cls.TableWidget.defaultRowHeight) +
            this._widget._decorateHeight + window.scrollBarSize;
          layoutInfo.getMinimal().setHeight(minHeight);
          // default minimum width of a table
          var minWidth = cls.TableWidget.minWidth + this._widget._decorateWidth + window.scrollBarSize;
          layoutInfo.getMinimal().setWidth(minWidth);

          var parentModalElement = this._widget.getElement().parent("gbc_ModalWidget");
          var isInModal = !!parentModalElement;

          // Set minimal table size
          if (isInModal) {
            var applicationElement = parentModalElement.parent("gbc_ApplicationWidget");
            var maximalWidth = applicationElement.clientWidth - 200; // Hack 200 (get padding of the modal)
            var calculateWidth = Math.ceil(this._minWidth) + this._widget._decorateWidth + window.scrollBarSize + 1;
            layoutInfo.getMinimal().setWidth(Math.min(calculateWidth, maximalWidth));

            var maximalHeight = applicationElement.clientHeight - 200; // Hack 200 (get padding of the modal)
            layoutInfo.getMeasured().setHeight(Math.min(layoutInfo.getPreferred().getHeight(), maximalHeight));
          }

          // WANTFIXEDPAGE
          if (this._widget.isFixedPageSize()) {
            minHeight = minimalPageSize *
              (this._widget.getRowHeight() || cls.TableWidget.defaultRowHeight) +
              this._widget._decorateHeight + window.scrollBarSize;
            layoutInfo.getMinimal().setHeight(minHeight);
            layoutInfo.getMeasured().setHeight(minHeight);
            layoutInfo.getMaximal().setHeight(minHeight);
          }
          layoutInfo.getMeasured().setWidth(Math.max(layoutInfo.getMinimal().getWidth(true), layoutInfo.getPreferred().getWidth(
            true)));
        },

        ajust: function() {

        },

        prepare: function() {
          $super.prepare.call(this);
          if (this._widget.isFixedPageSize()) {
            this._widget.setStyle({
              preSelector: ".g_measured ",
              selector: ".g_measureable",
              appliesOnRoot: true
            }, {
              height: this._getLayoutInfo().getAvailable().getHeight() + "px"
            });
          }
        },

        apply: function() {
          // set correct height of the table when measuring to avoid reset of vertical scrollbar
          $super.apply.call(this);
          this._widget.setStyle({
            preSelector: ".g_measuring ",
            selector: ".g_measureable",
            appliesOnRoot: true
          }, {
            height: this._getLayoutInfo().getAllocated().getHeight() + "px !important"
          });
        },

        invalidateMeasure: function(invalidation, from) {
          if (!from) {
            this._decorationMeasured = false; // need to measure decoration
            $super.invalidateMeasure.call(this, invalidation);
          }
        },

        invalidateAllocatedSpace: function(invalidation) {
          this._invalidatedAllocatedSpace = invalidation || cls.LayoutEngineBase.nextInvalidation();
        },

        getRenderableChildren: function() {
          return [];
        }

      };
    });
  });
