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

modulum('TableColumnAggregateWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Table column aggregate.
     * @class classes.TableColumnAggregateWidget
     * @extends classes.WidgetBase
     */
    cls.TableColumnAggregateWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.TableColumnAggregateWidget.prototype */
      return {
        __name: "TableColumnAggregateWidget",

        _textElement: null,

        /**
         * @constructs {classes.TableColumnItemWidget}
         */
        constructor: function(opts) {
          opts = (opts || {});
          opts.inTable = true;
          $super.constructor.call(this, opts);
        },

        _initLayout: function() {
          this._textElement = this._element.getElementsByClassName("gbc_TableAggregateText")[0];
        },

        /**
         * @param {string} text the text to display
         */
        setText: function(text) {
          this._textElement.textContent = text;
        },

        /**
         * @returns {string} the text to display
         */
        getText: function() {
          return this._textElement.textContent;
        },

        /**
         * @param {number} width title width (pixels)
         */
        setWidth: function(width) {
          this.setStyle({
            "width": width + "px"
          });
        },

        /**
         * @returns {string} title width (ex:"42px")
         */
        getWidth: function() {
          return this.getStyle("width");
        },

        /**
         * @param {number} index order index
         */
        setOrder: function(index) {
          this.setStyle({
            "order": index
          });
        }

      };
    });
    cls.WidgetFactory.register('TableColumnAggregate', cls.TableColumnAggregateWidget);
  });
