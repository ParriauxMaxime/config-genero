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

modulum('TreeItemDecorationVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TreeItemDecorationVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TreeItemDecorationVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TreeItemDecorationVMBehavior.prototype */
      return {
        __name: "TreeItemDecorationVMBehavior",

        watchedAttributes: {
          anchor: ['expanded', 'hasChildren', 'row']
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         */
        setup: function(controller, data) {
          data.depth = 0;
          var n = controller.getAnchorNode().getParentNode();
          while (n && n.getTag() === 'TreeItem') {
            n = n.getParentNode();
            ++data.depth;
          }
        },
        /**
         *
         */
        _apply: function(controller, data) {
          var treeItemNode = controller.getAnchorNode();
          var treeViewColumnNode = treeItemNode.getAncestor('Table').getFirstChild('TableColumn');

          var row = treeItemNode.attribute('row');
          if (row !== -1) {
            var valueList = treeViewColumnNode.getFirstChild("ValueList");
            if (valueList) {
              var valueNode = valueList.getChildren()[row];
              valueNode.getController().getNodeBindings().treeItem = treeItemNode; // set treeItem binding for value node

              var hasChildren = treeItemNode.attribute('hasChildren') !== 0;
              var isExpanded = hasChildren && treeItemNode.attribute('expanded') !== 0;
              var treeViewColumnWidget = treeViewColumnNode.getController().getWidget(),
                cellWidget = treeViewColumnWidget.getColumnItem(row);
              if (cellWidget) {
                cellWidget.setDepth(data.depth);
                cellWidget.setLeaf(!hasChildren);
                if (hasChildren) {
                  cellWidget.setExpanded(isExpanded);
                }
              }
            }
          }
        }
      };
    });
  });
