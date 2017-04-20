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

modulum('FolderWidget', ['WidgetGroupBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Folder widget.
     * @class classes.FolderWidget
     * @extends classes.WidgetGroupBase
     */
    cls.FolderWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.FolderWidget.prototype */
      return {
        __name: "FolderWidget",
        _tabsTitlesElement: null,
        _tabsPosition: "top",
        _scroller: null,
        /**
         * @type {classes.PageWidget}
         */
        _currentPage: null,

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.FolderLayoutEngine(this);
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._tabsTitlesElement = this._element.getElementsByClassName("mt-tab-titles-container")[0];

          this._scroller = new cls.ScrollTabDecorator(this);
        },

        destroy: function() {
          if (this._scroller) {
            this._scroller.destroy();
            this._scroller = null;
          }
          $super.destroy.call(this);
        },
        /**
         * @param {classes.PageWidget} page the page to add to the folder
         */
        addChildWidget: function(page, options) {
          if (page.__name !== "PageWidget") {
            throw "Only PageWidgets can be added in FolderWidgets";
          }
          $super.addChildWidget.call(this, page, options);
          var titleWidget = page.getTitleWidget();
          this._tabsTitlesElement.appendChild(titleWidget.getElement());
          titleWidget.clickHandler = titleWidget.when(gbc.constants.widgetEvents.click, this._onClick.bind(this, page));
          titleWidget.closeHandler = titleWidget.when(gbc.constants.widgetEvents.close, this.removeChildWidget.bind(this, page));
          if (this._children.length === 1) {
            // First page to be added, set it as current
            this.setCurrentPage(page);
          }
        },

        /**
         * @param {classes.PageWidget} page the page to remove from the folder
         */
        removeChildWidget: function(page) {
          var nextCurrentIndex = -1;

          if (page === this.getCurrentPage()) {
            this._currentPage = null;
            nextCurrentIndex = this._children.indexOf(page);
            if (nextCurrentIndex >= this._children.length - 1) {
              nextCurrentIndex = this._children.length - 2;
            }
          }
          if (page.getTitleWidget()) {
            page.getTitleWidget().getElement().remove();
          }

          page.getElement().remove();
          $super.removeChildWidget.call(this, page);
          if (!!this._children.length && nextCurrentIndex !== -1) {
            this.setCurrentPage(this._children[nextCurrentIndex]);
          }
        },

        _onClick: function(page) {
          this.setCurrentPage(page);
          var focusedWidget = this.getUserInterfaceWidget() && this.getUserInterfaceWidget().getFocusedWidget();
          if (focusedWidget && focusedWidget.isChildOf(page)) {
            if (focusedWidget.getCursors && focusedWidget.setCursors) {
              var previous = focusedWidget.getCursors();
              focusedWidget.setFocus();
              focusedWidget.setCursors(previous.start, previous.end);
            }
          }
        },

        /**
         * @param {classes.PageWidget} page the new current page
         */
        setCurrentPage: function(page) {
          if (this._currentPage !== page) {
            for (var i = 0; i < this._children.length; ++i) {
              var child = this._children[i];
              child.getTitleWidget().setCurrent(child === page);
            }
            if (this._currentPage) {
              this._currentPage.getElement().removeClass("currentPage");
              this._currentPage.disable();
            }
            this._currentPage = page;
            this._currentPage.getElement().addClass("currentPage");
            this._currentPage.activate();
            this.scrollTo(page);
            if (page) {
              this.getLayoutEngine().invalidateAllocatedSpace();
            }
            this.emit(context.constants.widgetEvents.change, page);
          }
        },

        updateCurrentPage: function() {
          if (this._children) {
            for (var i = 0; i < this._children.length; i++) {
              var page = this._children[i];
              if (!page.isHidden()) {
                this.setCurrentPage(page);
                break;
              }
            }
          }
        },

        /**
         * @returns {classes.PageWidget} the current page
         */
        getCurrentPage: function() {
          return this._currentPage;
        },

        getTabsPosition: function() {
          return this._tabsPosition;
        },

        setTabPosition: function(position) {
          if (["top", "bottom", "left", "right"].indexOf(position) < 0) {
            position = "top";
          }
          this._element.setAttribute("__FolderWidget", position);
          this._scroller.updatePosition("__FolderWidget", position);

          this._tabsPosition = position;
        },
        /**
         *
         * @param {classes.PageWidget} page
         */
        scrollTo: function(page) {
          var title = page && page.getTitleWidget();
          if (title) {
            this._scroller.scrollTo(title.getElement());
          }
          this._scroller.refreshScrollers();
        }
      };
    });
    cls.WidgetFactory.register('Folder', cls.FolderWidget);
  });
