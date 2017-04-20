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

modulum('ApplicationLauncherBookmarkItemWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationLauncherBookmarkItemWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationLauncherBookmarkItemWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationLauncherBookmarkItemWidget.prototype */
      return {
        __name: "ApplicationLauncherBookmarkItemWidget",
        constructor: function(opts) {
          var bookmarkItem = (opts || {}).bookmark;
          $super.constructor.call(this, opts);
          this._element.getElementsByClassName("title")[0].textContent = bookmarkItem.name;
          this._element.getElementsByClassName("link")[0].textContent = bookmarkItem.url;
          this._element.getElementsByClassName("desc")[0].on("click.ApplicationLauncherBookmarkItemWidget", function() {
            var data = context.BookmarkService.getBookmark("" + bookmarkItem.name);
            if (data) {
              context.UrlService.goTo(data.url);
            }
          });
          this._element.getElementsByClassName("logs")[0].on("click.ApplicationLauncherBookmarkItemWidget", function() {
            //TODO : pop logs
          });
          this._element.getElementsByClassName("delete")[0].on("click.ApplicationLauncherBookmarkItemWidget", function() {
            var deleter = this._element.getElementsByClassName("delete")[0];
            if (deleter.hasClass("deleting")) {
              return true;
            }
            deleter.addClass("deleting");
            this._element.getElementsByClassName("desc")[0].addClass("hidden");
            var removed = context.BookmarkService.removeBookmark(bookmarkItem.name, true);
            var timer = window.setTimeout(function() {
              this.destroy();
            }.bind(this), 10000);

            deleter.getElementsByTagName("i")[0].removeClass("zmdi-delete");
            deleter.getElementsByTagName("i")[0].addClass("zmdi-undo");
            var undo = document.createElement("b");
            undo.addClass("undo");
            undo.textContent = "Undo";
            deleter.appendChild(undo);
            deleter.on("click.undo", function() {
              window.clearTimeout(timer);
              deleter.getElementsByTagName("i")[0].addClass("zmdi-delete");
              deleter.getElementsByTagName("i")[0].removeClass("zmdi-undo");
              deleter.removeClass("deleting");
              this._element.getElementsByClassName("desc")[0].removeClass("hidden");
              context.BookmarkService.getBookmarks().add(removed, this._element.index());
              context.LocalSettingsService.write("bookmarks", context.BookmarkService.getBookmarks());
              undo.remove();
              deleter.off("click.undo");
              return false;
            }.bind(this));
          }.bind(this));
        },
        destroy: function() {
          this._element.getElementsByClassName("desc")[0].off("click.ApplicationLauncherBookmarkItemWidget");
          this._element.getElementsByClassName("logs")[0].off("click.ApplicationLauncherBookmarkItemWidget");
          this._element.getElementsByClassName("delete")[0].off("click.ApplicationLauncherBookmarkItemWidget");
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationLauncherBookmarkItem', cls.ApplicationLauncherBookmarkItemWidget);
  });
