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

modulum('ListViewColumnWidget', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * ListView column widget.
     * @class classes.ListViewColumnWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ListViewColumnWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ListViewColumnWidget.prototype */
      return {
        __name: "ListViewColumnWidget",
        __dataContentPlaceholderSelector: ".gbc_dataContentPlaceholder",

        _initElement: function() {
          $super._initElement.call(this);
        },

        _initLayout: function() {
          // no layout
        },

        destroy: function() {
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
          $super.addChildWidget.call(this, widget, options);
        },

        /**
         * @inheritDoc
         */
        removeChildWidget: function(widget) {
          var item = widget.getParentWidget() !== this ? widget.getParentWidget() : widget;
          $super.removeChildWidget.call(this, item);
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
         * @param {number} row current row
         */
        setCurrentRow: function(row) {
          var children = this.getChildren();
          var length = children.length;
          for (var i = 0; i < length; ++i) {
            var tableColumnItem = children[i];
            tableColumnItem.setCurrent(i === row);
          }
        }
      };
    });
    cls.WidgetFactory.register('TableColumn', 'listview', cls.ListViewColumnWidget);
  });
