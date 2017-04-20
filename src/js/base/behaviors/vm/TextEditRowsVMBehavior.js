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

modulum('TextEditRowsVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextEditRowsVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TextEditRowsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TextEditRowsVMBehavior.prototype */
      return {
        __name: "TextEditRowsVMBehavior",

        watchedAttributes: {
          decorator: ['gridHeight']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setRows) {
            var decoratorNode = controller.getNodeBindings().decorator;
            var gridHeight = decoratorNode.attribute('gridHeight');
            widget.setRows(gridHeight);
          }
        }
      };
    });
  });
