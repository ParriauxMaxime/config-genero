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

modulum('MonitorDebugTreeWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.MonitorDebugTreeWidget
     * @extends classes.WidgetGroupBase
     */
    cls.MonitorDebugTreeWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.MonitorDebugTreeWidget.prototype */
      return {
        __name: "MonitorDebugTreeWidget",
        _nodeDebug: null,
        _layoutInfo: null,
        _initElement: function() {
          $super._initElement.call(this);
          this._nodeDebug = this._element.getElementsByClassName('nodeDebug')[0];
          this._layoutInfo = this._element.getElementsByClassName('layoutInfo')[0];
        },
        destroy: function() {
          this._nodeDebug.innerHTML = "";
          this._layoutInfo.innerHTML = "";
          $super.destroy.call(this);
        },
        setNodeDebugContent: function(content) {
          this._nodeDebug.innerHTML = "";
          this._nodeDebug.appendChild(content);
        },
        setLayoutInfoContent: function(content) {
          this._layoutInfo.innerHTML = "";
          this._layoutInfo.appendChild(content);
        },
        setSelectedItem: function(id, items) {
          var matchingItem = null;
          if (items === undefined) {
            matchingItem = this.setSelectedItem(id, this.getChildren());
            if (matchingItem) {
              var view = this._element.child('part');
              var itemRect = matchingItem._container.getBoundingClientRect();
              var viewRect = view.getBoundingClientRect();
              if (itemRect.bottom > viewRect.height || itemRect.top < 0) {
                view.scrollTop += itemRect.top - viewRect.height / 2;
              }
            }
          } else {
            for (var i = 0; i < items.length; ++i) {
              var item = items[i];
              var match = item.getIdRef() === id;
              item.setHighlighted(match);
              var childMatchingItem = this.setSelectedItem(id, item.getChildren());
              if (match) {
                matchingItem = item;
              } else if (!matchingItem) {
                matchingItem = childMatchingItem;
              }
            }
          }
          return matchingItem;
        }
      };
    });
    cls.WidgetFactory.register('MonitorDebugTree', cls.MonitorDebugTreeWidget);
  });
