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

modulum('OnDoubleClickUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Handling double click actions
     * @class classes.OnDoubleClickUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnDoubleClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnDoubleClickUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnDoubleClickUIBehavior",

        /**
         * @inheritDoc
         */
        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            data.doubleClickHandle = controller.getWidget().when(gbc.constants.widgetEvents.doubleClick, this._onDoubleClick.bind(
              this, controller, data));
          }
        },

        /**
         * @inheritDoc
         */
        _detachWidget: function(controller, data) {
          if (data.doubleClickHandle) {
            data.doubleClickHandle();
            data.doubleClickHandle = null;
          }
        },

        /**
         * Creates an action event and sends it to the VM if the table accept doubleclicks
         * @param controller
         * @param data
         * @private
         */
        _onDoubleClick: function(controller, data) {
          var anchorNode = controller.getAnchorNode();

          if (anchorNode.getTag() === 'TableColumn') {
            var tableNode = anchorNode.getParentNode();
            var active = tableNode.attribute('actionActive');
            var tableWidget = tableNode.getController().getWidget();
            var noEntry = anchorNode.attribute('noEntry');
            var doubleClickEnable = tableNode.attribute('doubleClick').length > 0 || !tableWidget.isInputMode();

            if (tableWidget && active && doubleClickEnable && (!tableWidget.isInputMode() || noEntry === 1)) {
              anchorNode.getApplication().action.execute(tableNode.getId());
            }
          }
        }
      };
    });
  });
