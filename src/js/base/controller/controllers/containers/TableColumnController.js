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

modulum('TableColumnController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableColumnController
     * @extends classes.ControllerBase
     */
    cls.TableColumnController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.TableColumnController.prototype */
      return {
        __name: "TableColumnController",
        _isTreeViewColumn: false,

        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE

          // END WARNING

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TableTextVMBehavior);
          this._addBehavior(cls.TableRowHeightVMBehavior);
          this._addBehavior(cls.AggregateVMBehavior);
          this._addBehavior(cls.TableTabIndexVMBehavior);
          this._addBehavior(cls.TextAlignVMBehavior);
          this._addBehavior(cls.UnhidableVMBehavior);
          this._addBehavior(cls.UnmovableVMBehavior);
          this._addBehavior(cls.UnsizableVMBehavior);

          // ui behaviors
          this._addBehavior(cls.OnDoubleClickUIBehavior);
          this._addBehavior(cls.TableColumnSortUIBehavior);
          this._addBehavior(cls.TableColumnHideUIBehavior);
          this._addBehavior(cls.TableColumnOrderUIBehavior);
          this._addBehavior(cls.TableColumnDndUIBehavior);
          this._addBehavior(cls.TableColumnResizeUIBehavior);
          this._addBehavior(cls.TableColumnAfterLastItemClickUIBehavior);
          if (this._isTreeViewColumn) {
            this._addBehavior(cls.TreeItemKeyExpandUIBehavior);
            this._addBehavior(cls.TreeItemToggleUIBehavior);
          }

          // 4st behaviors
          this._addBehavior(cls.Reverse4STBehavior);

        },
        _createWidget: function() {

          var tableColumnNode = this.getNodeBindings().anchor;
          var tableNode = tableColumnNode.getParentNode();

          this._isTreeViewColumn = !!tableNode.getFirstChild('TreeInfo') && tableNode.getFirstChild('TableColumn') ===
            tableColumnNode;

          var style = this.getAnchorNode().attribute('style');
          if (!style) {
            style = this.getAnchorNode().getParentNode().attribute('style');
          }
          var widget = cls.WidgetFactory.create('TableColumn', style, {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            isTreeView: this._isTreeViewColumn
          });

          widget._defaultWidth = this.getStoredSetting("width");

          return widget;
        },

        /** Set a stored setting for this tableColumn
         * @param key
         * @param value
         */
        setStoredSetting: function(key, value) {
          var anchor = this.getNodeBindings().anchor;
          var columnIndex = anchor.getParentNode().getChildren("TableColumn").indexOf(anchor);
          anchor.getParentNode().getController().setStoredSetting("columns.col" + columnIndex +
            "." + key, value);
        },

        /** Get a stored setting for this table
         * @param key
         * @returns {*}
         */
        getStoredSetting: function(key) {
          var anchor = this.getNodeBindings().anchor;
          var columnIndex = anchor.getParentNode().getChildren("TableColumn").indexOf(anchor);
          return anchor.getParentNode().getController().getStoredSetting("columns.col" + columnIndex +
            "." + key);
        }
      };
    });
    cls.ControllerFactory.register("TableColumn", cls.TableColumnController);

  });
