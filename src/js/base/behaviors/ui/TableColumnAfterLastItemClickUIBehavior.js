/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableColumnAfterLastItemClickUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableColumnAfterLastItemClickUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnAfterLastItemClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.TableColumnAfterLastItemClickUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "TableColumnAfterLastItemClickUIBehavior",

        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            data.clickHandle = widget.when(gbc.constants.widgetEvents.tableColumnAfterLastItemClick, this._onClick.bind(this,
              controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data

         * @private
         */
        _onClick: function(controller, data) {

          var tableColumnNode = controller.getAnchorNode();

          if (tableColumnNode.attribute('active') === 0 || tableColumnNode.attribute('noEntry') === 1) {
            return; // Nothing to done
          }

          // when click after the last row, we must send currentRow = size to VM 
          var tableNode = tableColumnNode.getParentNode();
          var columnIndex = tableColumnNode.getIndex('TableColumn');
          var rowIndex = tableNode.attribute("size");

          var event = new cls.VMConfigureEvent(tableNode.getId(), {
            currentColumn: columnIndex,
            currentRow: rowIndex
          });

          tableNode.getApplication().event(event);
        }
      };
    });
  });
