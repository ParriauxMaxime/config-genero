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

modulum('MonitorDebugNodeInfoWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.MonitorDebugNodeInfoWidget
     * @extends classes.WidgetBase
     */
    cls.MonitorDebugNodeInfoWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.MonitorDebugNodeInfoWidget.prototype */
      return {
        __name: "MonitorDebugNodeInfoWidget",
        _propertiesContainer: null,
        _initElement: function() {
          $super._initElement.call(this);
          this._propertiesContainer = this._element.querySelector("table>tbody");
          this._element.on("click", "table>thead>tr", this._onClick.bind(this));
        },
        _onClick: function() {
          var table = this._element.childTag("table");
          if (table) {
            var i = 0,
              cats = table.querySelectorAll(".category"),
              len = cats.length;
            for (; i < len; i++) {
              context.DebugService.auiview[".cat_" + cats[i].textContent] = true;
              gbc.DebugService.catClicked(cats[i].textContent, true);
            }
          }
          event.stopPropagation();
        },
        getPropertiesContainer: function() {
          return this._propertiesContainer;
        }
      };
    });
    cls.WidgetFactory.register('MonitorDebugNodeInfo', cls.MonitorDebugNodeInfoWidget);
  });
