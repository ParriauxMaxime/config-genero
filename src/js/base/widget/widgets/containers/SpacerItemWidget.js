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

modulum('SpacerItemWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * SpacerItem widget.
     * @class classes.SpacerItemWidget
     * @extends classes.WidgetBase
     */
    cls.SpacerItemWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.SpacerItemWidget.prototype */
      return {
        __name: "SpacerItemWidget",

        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.LeafLayoutEngine(this);

          this._layoutInformation.setXStretched(true);
          this._layoutInformation.setYStretched(false);
          this._layoutInformation.setSizeHint(0, 0);
          this._layoutInformation.setMinimal(0, 0);
        }
      };
    });
    cls.WidgetFactory.register('SpacerItem', cls.SpacerItemWidget);
  });
