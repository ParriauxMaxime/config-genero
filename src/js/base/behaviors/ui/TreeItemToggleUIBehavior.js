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

modulum('TreeItemToggleUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TreeItemToggleUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.TreeItemToggleUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.TreeItemToggleUIBehavior.prototype */
      return {
        __name: "TreeItemToggleUIBehavior",

        /**
         * @protected
         */
        _attachWidget: function(controller, data) {
          var treeViewColumnWidget = controller.getWidget();
          if (treeViewColumnWidget) {
            data.onClickHandle = treeViewColumnWidget.when(context.constants.widgetEvents.click, this._toggleState.bind(this,
              controller, data));
          }

        },

        /**
         * @protected
         */
        _detachWidget: function(controller, data) {
          if (data.onClickHandle) {
            data.onClickHandle();
            data.onClickHandle = null;
          }
        },

        _toggleState: function(controller, data, event, sender, index) {
          var node = controller.getAnchorNode();
          var tableNode = node.getParentNode();
          var treeItemNode = tableNode.findNodeWithAttributeValue("TreeItem", "row", index);

          if (treeItemNode.attribute('hasChildren') !== 0) {
            var expanded = treeItemNode.attribute('expanded');
            if (expanded === 0) {
              expanded = 1;
            } else {
              expanded = 0;
            }
            var vmEvent = new cls.VMConfigureEvent(treeItemNode.getId(), {
              expanded: expanded
            });
            treeItemNode.getApplication().event(vmEvent);
          }
        }
      };
    });
  });
