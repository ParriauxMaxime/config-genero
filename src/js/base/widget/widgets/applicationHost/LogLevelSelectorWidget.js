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

modulum('LogLevelSelectorWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.LogLevelSelectorWidget
     * @extends classes.WidgetBase
     */
    cls.LogLevelSelectorWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.LogLevelSelectorWidget.prototype */
      return {
        __name: "LogLevelSelectorWidget",

        _currentItem: null,

        _initElement: function() {
          $super._initElement.call(this);
          this.setCurrent(context.LogService.getCurrentLevel());
          this._element.on("click", function(evt) {
            if (evt.target.dataset.loglevel) {
              this.setCurrent(evt.target.dataset.loglevel);
              this.emit("loglevel", evt.target.dataset.loglevel);
            }
          }.bind(this));
        },
        setCurrent: function(level) {
          if (this._currentItem) {
            this._currentItem.removeClass("active");
          }
          this._currentItem = this._element.querySelector("." + level);
          if (!this._currentItem) {
            this._currentItem = this._element.querySelector(".none");
          }
          this._currentItem.addClass("active");
        }
      };
    });
    cls.WidgetFactory.register('LogLevelSelector', cls.LogLevelSelectorWidget);
  });
