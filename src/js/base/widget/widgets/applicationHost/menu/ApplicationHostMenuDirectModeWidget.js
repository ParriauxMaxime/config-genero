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

modulum('ApplicationHostMenuDirectModeWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuDirectModeWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuDirectModeWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuDirectModeWidget.prototype */
      return {
        __name: "ApplicationHostMenuDirectModeWidget",
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.on("click.ApplicationHostMenuDirectModeWidget", this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._element.off("click.ApplicationHostMenuDirectModeWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          context.DirectModeService.activate();
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostDirectModeMenu', cls.ApplicationHostMenuDirectModeWidget);
  });
