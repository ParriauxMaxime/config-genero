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

modulum('GroupWidget', ['WidgetGridLayoutBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Group widget.
     * @class classes.GroupWidget
     * @extends classes.WidgetGridLayoutBase
     */
    cls.GroupWidget = context.oo.Class(cls.WidgetGridLayoutBase, function($super) {
      /** @lends classes.GroupWidget.prototype */
      return {
        __name: "GroupWidget",
        /**
         * @type {classes.GroupTitleWidget}
         */
        _title: null,
        /**
         * @type {HandleRegistration}
         */
        _gridWidthHandle: null,
        /**
         * @type {Element}
         */
        _groupWidgetContent: null,
        _groupContent: null,
        constructor: function() {
          $super.constructor.call(this);
          this._title = cls.WidgetFactory.create("GroupTitle");
          this._gridWidthHandle = this.getLayoutInformation().onGridInfoChanged(this._onGridWidthChanged.bind(this));
          this._groupWidgetContent = this._element.getElementsByClassName("gbc_GroupWidgetContent")[0];
          this._groupWidgetContent.prependChild(this._title.getElement());
          this._groupContent = this._groupWidgetContent.getElementsByClassName("containerElement")[0];
        },

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.GroupLayoutEngine(this);
        },

        _onGridWidthChanged: function() {
          this._title.getLayoutInformation().setGridWidth(this.getLayoutInformation().getGridWidth());
        },
        destroy: function() {
          this._title.destroy();
          this._title = null;
          this._gridWidthHandle();
          this._gridWidthHandle = null;
          $super.destroy.call(this);
        },
        setGridChildrenInParent: function(isGridChildrenInParent) {
          if (this._isGridChildrenInParent !== isGridChildrenInParent) {
            if (!isGridChildrenInParent) {
              this._groupContent.removeClass("gridChildrenInParent");
            }
            $super.setGridChildrenInParent.call(this, isGridChildrenInParent);
            if (isGridChildrenInParent) {
              this._groupContent.addClass("gridChildrenInParent");
            }
          }
        },
        /**
         * @param {string} text text describing the group content
         */
        setText: function(text) {
          this._title.setText(text);
          this.getLayoutEngine().forceMeasurement();
          this.getLayoutEngine().invalidateMeasure();
        },

        /**
         * @returns {string} text describing the group content
         */
        getText: function() {
          return this._title.getText();
        }
      };
    });
    cls.WidgetFactory.register('Group', cls.GroupWidget);
  });
