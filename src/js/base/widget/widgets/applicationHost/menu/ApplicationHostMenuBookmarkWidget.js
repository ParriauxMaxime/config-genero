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

modulum('ApplicationHostMenuBookmarkWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuBookmarkWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuBookmarkWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuBookmarkWidget.prototype */
      return {
        __name: "ApplicationHostMenuBookmarkWidget",
        _activated: false,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuBookmarkWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._element.off("click.ApplicationHostMenuBookmarkWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          var url = context.UrlService.currentUrl();
          this.setActivated(!this._activated);
          context.BookmarkService.switchBookmark(gbc.SessionService.getCurrent().getAppId(), url.toString());
        },
        setActivated: function(activated) {
          this._activated = activated;
          var i = this._element.getElementsByTagName("i")[0];
          i.toggleClass("zmdi-bookmark", !!activated)
            .toggleClass("zmdi-bookmark-outline", !activated);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationBookmarkHostMenu', cls.ApplicationHostMenuBookmarkWidget);
  });
