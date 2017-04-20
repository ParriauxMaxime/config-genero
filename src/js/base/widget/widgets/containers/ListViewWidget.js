/// FOURJS_START_COPYRIGHT(D,2017)
/// Property of Four Js*
/// (c) Copyright Four Js 2017, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('ListViewWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Grid widget.
     * @class classes.ListViewWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ListViewWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ListViewWidget.prototype */
      return {
        __name: "ListViewWidget",

        /**
         * Init Layout
         * @private
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.ListViewLayoutEngine(this);

          this._layoutInformation._stretched.setDefaultX(true);
          this._layoutInformation._stretched.setDefaultY(true);
        },

        /**
         * Returns columns widgets
         * @returns {object} columns widget
         */
        getColumns: function() {
          return this.getChildren();
        },

      };
    });
    cls.WidgetFactory.register("Table", "listview", cls.ListViewWidget);
  });
