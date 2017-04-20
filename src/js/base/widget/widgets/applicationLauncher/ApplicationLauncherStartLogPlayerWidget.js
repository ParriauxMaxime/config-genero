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

modulum('ApplicationLauncherStartLogPlayerWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationLauncherWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationLauncherStartLogPlayerWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationLauncherStartLogPlayerWidget.prototype */
      return {
        __name: "ApplicationLauncherStartLogPlayerWidget",

        /**
         * @type Element
         */
        _buttonElement: null,
        constructor: function() {
          $super.constructor.call(this);
          this._buttonElement = this._element.getElementsByTagName("button")[0];
          this._buttonElement.on("click.ApplicationLauncherStartLogPlayerWidget", this.startLogPlayer.bind(this));
        },
        destroy: function() {
          this._buttonElement.off("click.ApplicationLauncherStartLogPlayerWidget");
        },
        startLogPlayer: function() {
          window.location.href = document.location.origin + document.location.pathname + "?logplayer=1";
        }
      };
    });
    cls.WidgetFactory.register('ApplicationLauncherStartLogPlayer', cls.ApplicationLauncherStartLogPlayerWidget);
  });
