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

modulum('TableItemCurrentRowVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableItemCurrentRowVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TableItemCurrentRowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TableItemCurrentRowVMBehavior.prototype */
      return {
        __name: "TableItemCurrentRowVMBehavior",

        watchedAttributes: {
          table: ['currentRow', 'offset', 'dialogType', 'active']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setEnabled) {
            var tableNode = controller.getNodeBindings().table;
            var dialogType = tableNode.attribute('dialogType');

            if (dialogType === "Input" || dialogType === "Construct") {
              var currentRow = tableNode.attribute('currentRow');
              var offset = tableNode.attribute('offset');
              var itemNode = controller.getAnchorNode();
              var index = itemNode.getParentNode().getChildren().indexOf(itemNode);
              var enabled = (index === (currentRow - offset)) && (itemNode.getParentNode().getParentNode().attribute('active') ===
                1);
              widget.setEnabled(enabled);
            }
          }
        }
      };
    });
  });
