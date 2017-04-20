/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TraditionalLayoutEngine', ['LayoutEngineBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.TraditionalLayoutEngine
     * @extends classes.LayoutEngineBase
     */
    cls.TraditionalLayoutEngine = context.oo.Class(cls.LayoutEngineBase, function($super) {
      /** @lends classes.TraditionalLayoutEngine.prototype */
      return {
        __name: "TraditionalLayoutEngine",

        _children: null,

        /**
         * @param {classes.WidgetGroupBase} widget
         */
        constructor: function(widget) {
          $super.constructor.call(this, widget);
          this._children = [];
        },

        /**
         * @param {classes.WidgetBase} widget
         */
        registerChild: function(widget) {
          this._children.push(widget);
          var li = widget.getLayoutInformation();
          li.className = 'tgl_' + widget.getUniqueIdentifier();
          li.styleRules = {};
          li.styleRulesContent = {};
          li.styleRules['.' + li.className] = li.styleRulesContent;
        },
        /**
         * @param {classes.WidgetBase} widget
         */
        unregisterChild: function(widget) {
          this._children.remove(widget);
        },

        prepare: function() {
          var heightpadding = parseFloat(gbc.constants.theme["gbc-field-height-ratio"]);
          var fieldheight = parseFloat(gbc.constants.theme["field-default-height"]);
          for (var i = 0; i < this._children.length; ++i) {
            var child = this._children[i];
            var layoutInfo = child.getLayoutInformation();
            if (layoutInfo) {
              var left = layoutInfo.getGridX();
              var top = (layoutInfo.getGridY()) * (fieldheight + 2 * heightpadding) + heightpadding;
              var width = layoutInfo.getGridWidth();
              var height = layoutInfo.getGridHeight() * fieldheight;
              var li = child.getLayoutInformation();
              li.getHost().toggleClass(li.className, true);
              var letterSpacing = gbc.constants.theme["traditional-mode-letter-spacing"];
              li.styleRulesContent.left = 'calc(' + left + 'ch + ' + left + ' * ' + letterSpacing + ')';
              li.styleRulesContent.top = top + 'px';
              li.styleRulesContent.width = 'calc(' + width + 'ch + ' + width + ' * ' + letterSpacing + ')';
              li.styleRulesContent.height = height + 'px';
              styler.appendStyleSheet(li.styleRules, "traditionalGridLayout_" + child.getUniqueIdentifier());
            }
          }
        },
        getRenderableChildren: function() {
          return [];
        }
      };
    });
  });
