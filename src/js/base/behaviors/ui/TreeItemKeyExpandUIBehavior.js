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

modulum('TreeItemKeyExpandUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TreeItemKeyExpandUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.TreeItemKeyExpandUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.TreeItemKeyExpandUIBehavior.prototype */
      return {
        __name: "TreeItemKeyExpandUIBehavior",

        /**
         * @protected
         */
        _attachWidget: function(controller, data) {
          if (!!controller.getWidget()) {
            var tableWidget = controller.getAnchorNode().getParentNode().getController().getWidget();
            data.rightHandle = tableWidget.when(context.constants.widgetEvents.keyRight, this._expandOrCollapse.bind(this,
              controller,
              data, 1));
            data.leftHandle = tableWidget.when(context.constants.widgetEvents.keyLeft, this._expandOrCollapse.bind(this, controller,
              data,
              0));
          }
        },

        /**
         * @protected
         */
        _detachWidget: function(controller, data) {
          if (data.rightHandle) {
            data.rightHandle();
            data.rightHandle = null;
          }
          if (data.leftHandle) {
            data.leftHandle();
            data.leftHandle = null;
          }
        },

        /**
         * @param {classes.ControllerBase} controller
         * @param {Object} data
         * @param {boolean} expand
         * @private
         */
        _expandOrCollapse: function(controller, data, expand, mousetrapEvent, source, event) {
          var node = controller.getAnchorNode();
          var tableNode = node.getParentNode();
          var offset = tableNode.attribute('offset');
          var currentRow = tableNode.attribute('currentRow');
          var treeItemNode = tableNode.findNodeWithAttributeValue("TreeItem", "row", currentRow - offset);
          if (treeItemNode &&
            (expand === 1 || (source.getScrollableArea() && source.getScrollableArea().scrollLeft === 0))) { // if we have previously horizontally scrolled, we need to scroll back before collapsing nodes
            var vmEvent = null;
            if (expand && (treeItemNode.attribute("expanded") === 1)) {
              event.preventDefault(); // preventDefault avoid horizontal scroll

              vmEvent = new cls.VMConfigureEvent(tableNode.getId(), {
                currentRow: treeItemNode.attribute("row") + offset + 1
              });
            } else if (!expand && (treeItemNode.attribute("expanded") === 0)) {
              event.preventDefault(); // preventDefault avoid horizontal scroll

              var parent = treeItemNode.getParentNode();
              if (parent._tag === "TreeItem") {
                vmEvent = new cls.VMConfigureEvent(tableNode.getId(), {
                  currentRow: treeItemNode.attribute("row") - (parent.getChildren().indexOf(treeItemNode) + 1) + offset
                });
              }
            } else if (treeItemNode.attribute("hasChildren")) {
              event.preventDefault(); // preventDefault avoid horizontal scroll

              vmEvent = new cls.VMConfigureEvent(treeItemNode.getId(), {
                expanded: expand
              });
            }
            if (vmEvent) {
              treeItemNode.getApplication().event(vmEvent);
            }
          }
        }
      };
    });
  });
