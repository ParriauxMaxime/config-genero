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

modulum('RowSelectionUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RowSelectionUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.RowSelectionUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.RowSelectionUIBehavior.prototype */
      return {
        __name: "RowSelectionUIBehavior",

        /**
         * @inheritDoc
         * @protected
         */
        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          if (!!widget) {
            data.onClickHandle = widget.when(context.constants.widgetEvents.click, this._onClick.bind(this, controller, data));
          }
        },
        /**
         * @inheritDoc
         * @protected
         */
        _detachWidget: function(controller, data) {
          if (data.onClickHandle) {
            data.onClickHandle();
            data.onClickHandle = null;
          }
        },

        _onClick: function(controller, data, event, sender, domEvent) {
          var bindings = controller.getNodeBindings();
          var anchorNode = bindings.anchor;
          var tableNode = bindings.container.getParentNode();
          if (tableNode.attribute('multiRowSelection') !== 0) {
            var offset = tableNode.attribute('offset');
            var index = anchorNode.getIndex();
            var clickedRow = offset + index;

            var vmEvent = tableNode.getController().buildRowSelectionEvent(clickedRow, domEvent.ctrlKey, domEvent.shiftKey);
            tableNode.getApplication().event(vmEvent);
          }
        }
      };
    });
  });