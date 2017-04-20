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

modulum('ApplicationHostSidebarBackdropWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostSidebarBackdropWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostSidebarBackdropWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostSidebarBackdropWidget.prototype */
      return {
        __name: "ApplicationHostSidebarBackdropWidget",
        /** @lends classes.ApplicationHostSidebarBackdropWidget */
        $static: {
          clickEvent: "click"
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostSidebarBackdropWidget", this._onClick.bind(this));
        },

        _initLayout: function() {
          // no layout
        },

        setDisplayed: function(displayed) {
          this.getElement().toggleClass("mt-sidebar-displayed", !!displayed);
        },

        setUnavailable: function(unavailable) {
          this.getElement().toggleClass("mt-sidebar-unavailable", !!unavailable);
        },

        _onClick: function() {
          this.emit(cls.ApplicationHostSidebarBackdropWidget.clickEvent);
        },
        onClick: function(hook) {
          return this.when(cls.ApplicationHostSidebarBackdropWidget.clickEvent, hook);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostSidebarBackdrop', cls.ApplicationHostSidebarBackdropWidget);
  });
