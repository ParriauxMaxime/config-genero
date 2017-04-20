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

modulum('CursorsVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CursorsVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CursorsVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CursorsVMBehavior.prototype */
      return {
        __name: "CursorsVMBehavior",

        watchedAttributes: {
          container: ['cursor', 'cursor2', 'currentRow', 'currentColumn', 'dialogType'],
          ui: ['focus'],
          table: ['currentRow', 'currentColumn', 'dialogType']
        },

        _getMainArrayContainer: function(containerNode) {
          switch (containerNode.getTag()) {
            case 'TableColumn':
              return containerNode.getParentNode();
            case 'Matrix':
              return containerNode;
            default:
              return null;
          }
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = null;
          var containerNode = controller.getNodeBindings().container;
          var uiNode = containerNode.getApplication().uiNode();
          var focusedNodeId = uiNode.attribute('focus');

          var arrayContainer = this._getMainArrayContainer(containerNode);
          if (arrayContainer) {
            // Table or Matrix
            if (focusedNodeId === arrayContainer._id) {
              var currentRow = arrayContainer.attribute("currentRow");
              var offset = arrayContainer.attribute("offset");
              var anchorRowIndex = controller.getAnchorNode().getIndex();
              if (anchorRowIndex === currentRow - offset) {
                if (arrayContainer.getTag() === "Table") { // consider also currentColumn for table
                  var currentColumn = arrayContainer.attribute("currentColumn");
                  var anchorColumnIndex = containerNode.getIndex();
                  if (anchorColumnIndex === currentColumn) {
                    widget = controller.getWidget();
                  }
                } else {
                  widget = controller.getWidget();
                }
              }
            }
          } else {
            // FormField
            if (focusedNodeId === controller.getAnchorNode().getId()) {
              widget = controller.getWidget();
            }
          }

          if (widget && widget.setCursors) {
            var cursor = containerNode.attribute('cursor');
            var cursor2 = containerNode.attribute('cursor2');

            // set cursor should be done after restoreVMFocus so we have to done it after all orders management
            context.FocusService._eventListener.when("focusRestored", function() {
              widget.setCursors(cursor, cursor2);
            }.bind(this), true);
          }
        }
      };
    });
  });
