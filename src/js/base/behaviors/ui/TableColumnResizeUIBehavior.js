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

modulum('TableColumnResizeUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableColumnResizeUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.TableColumnResizeUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.TableColumnResizeUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "TableColumnResizeUIBehavior",

        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            data.resizeHandle = widget.when(gbc.constants.widgetEvents.tableResizeCol, this._resizeColumn.bind(this, controller,
              data));
          }
        },

        _detachWidget: function(controller, data) {
          if (data.resizeHandle) {
            data.resizeHandle();
            data.resizeHandle = null;
          }
        },

        /**
         *
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param opt new width of the column
         * @private
         */
        _resizeColumn: function(controller, data, opt) {

          // Save new width in stored settings
          var width = opt.data[0];
          controller.setStoredSetting("width", width);
        }
      };
    });
  });
