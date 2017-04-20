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

modulum('VisibleIdVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.VisibleIdVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.VisibleIdVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.VisibleIdVMBehavior.prototype */
      return {
        __name: "VisibleIdVMBehavior",

        watchedAttributes: {
          anchor: ['visibleId']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var formNode = controller.getAnchorNode();
          var visibleId = formNode.attribute('visibleId');
          if (visibleId >= 0) {
            var visibleNode = formNode.getApplication().getNode(visibleId);
            this._setVisible(visibleNode);
          }
        },

        /**
         * routine
         * @param node
         * @private
         */
        _setVisible: function(node) {
          var pageNode = null;
          if (node && node._tag === "Page") {
            pageNode = node;
          } else {
            pageNode = node && node.getAncestor("Page");
          }

          // Be sure we are in a Folder context
          if (pageNode) {
            var pageWidget = pageNode.getController().getWidget();
            var parentWidget = pageWidget.getParentWidget();
            if (parentWidget && parentWidget.setCurrentPage) {
              parentWidget.setCurrentPage(pageWidget);
              var pageAncestorNode = pageNode.getAncestor("Page");
              // Redo operation if cascading multiple Folder
              if (pageAncestorNode) {
                this._setVisible(pageAncestorNode);
              }
            }
          }
        }
      };
    });
  });
