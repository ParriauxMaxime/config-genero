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

modulum('VisibleRowsVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.VisibleRowsVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.VisibleRowsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.VisibleRowsVMBehavior.prototype */
      return {
        __name: "VisibleRowsVMBehavior",

        watchedAttributes: {
          anchor: ['size', 'offset', 'bufferSize', 'dialogType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var tableWidget = controller.getWidget();
          if (tableWidget && tableWidget.setVisibleRows) {
            var tableNode = controller.getAnchorNode();
            var size = tableNode.attribute('size');
            var offset = tableNode.attribute('offset');
            var bufferSize = tableNode.attribute('bufferSize');

            var visibleRows = Math.min(bufferSize, size - offset);
            var dialogType = tableNode.attribute('dialogType');
            if ((dialogType === "Construct" || dialogType === "Input" || dialogType === "InputArray") && visibleRows === 0) {
              visibleRows = 1;
            }
            tableWidget.setVisibleRows(visibleRows);
          }
        }
      };
    });
  });
