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

modulum('RowSelectedVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RowSelectedVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.RowSelectedVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.RowSelectedVMBehavior.prototype */
      return {
        __name: "RowSelectedVMBehavior",

        watchedAttributes: {
          anchor: ['selected'],
          table: ['multiRowSelection']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var bindings = controller.getNodeBindings();

          var tableWidget = bindings.table.getController().getWidget();
          if (tableWidget && tableWidget.setRowSelected) {
            var multiRowSelection = bindings.table.attribute('multiRowSelection');
            var selected = multiRowSelection && bindings.anchor.attribute('selected');
            tableWidget.setRowSelected(bindings.anchor.getIndex(), selected);
          }
        }
      };
    });
  });
