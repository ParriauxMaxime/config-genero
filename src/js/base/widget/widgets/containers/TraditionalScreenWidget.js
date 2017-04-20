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

modulum('TraditionalScreenWidget', ['WidgetGridLayoutBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Base class for widget group.
     * @class classes.TraditionalScreenWidget
     * @extends classes.WidgetGridLayoutBase
     */
    cls.TraditionalScreenWidget = context.oo.Class(cls.WidgetGridLayoutBase, function($super) {
      /** @lends classes.TraditionalScreenWidget.prototype */
      return {
        __name: "TraditionalScreenWidget",

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.TraditionalLayoutEngine(this);
        }
      };
    });
    cls.WidgetFactory.register('TraditionalScreen', cls.TraditionalScreenWidget);
  });
