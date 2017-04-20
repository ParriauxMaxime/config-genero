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

modulum('ApplicationLauncherWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationLauncherWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationLauncherWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ApplicationLauncherWidget.prototype */
      return {
        __name: "ApplicationLauncherWidget",
        _startLogPlayer: null,
        _urlInput: null,
        _history: null,
        _bookmark: null,
        constructor: function() {
          $super.constructor.call(this);
          if (!context.HostService.isLogPlayerRequested()) {
            this._urlInput = cls.WidgetFactory.create('ApplicationLauncherUrlInput');
            this._element.prependChild(this._urlInput.getElement());
            this._startLogPlayer = cls.WidgetFactory.create('ApplicationLauncherStartLogPlayer');
            this._element.prependChild(this._startLogPlayer.getElement());
            this._history = cls.WidgetFactory.create('ApplicationLauncherHistory');
            this.addChildWidget(this._history);
            this._bookmark = cls.WidgetFactory.create('ApplicationLauncherBookmark');
            this.addChildWidget(this._bookmark);
          }
        },
        destroy: function() {
          this._urlInput.destroy();
          this._urlInput = null;
          this._history.destroy();
          this._history = null;
          this._bookmark.destroy();
          this._bookmark = null;
          $super.destroy.call(this);
        },
        getHistory: function() {
          return this._history;
        },
        setHidden: function(hidden) {
          $super.setHidden.call(this, hidden);
          if (this.getParentWidget()) {
            this.getParentWidget().enableSidebar(hidden);
          }
        },
        /**
         *
         * @param {classes.ApplicationHostWidget} widget
         */
        setParentWidget: function(widget) {
          $super.setParentWidget.call(this, widget);
          widget.enableSidebar(!this.isVisible());
        }
      };
    });
    cls.WidgetFactory.register('ApplicationLauncher', cls.ApplicationLauncherWidget);
  });
