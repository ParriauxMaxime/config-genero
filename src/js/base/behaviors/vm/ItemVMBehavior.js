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

modulum('ItemVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the completer items
     * @class classes.ItemVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ItemVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ItemVMBehavior.prototype */
      return {
        __name: "ItemVMBehavior",

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();

          if (widget && widget.addChoices) {
            var children = controller.getNodeBindings().decorator._children;
            widget.clearChoices();
            widget.addChoices(children.map(function(child) {
              return {
                text: child.attribute("text"),
                value: child.attribute("name")
              };
            }));
          }
        },

        _onItemsCountChanged: function(controller, data, event, src, node) {
          data.dirty = true;
        },

        /**
         * @inheritDoc
         * @protected
         */
        _attach: function(controller, data) {
          var decoratorNode = controller.getNodeBindings().decorator;
          //on new Item node
          data._onNodeCreateHandle = decoratorNode.onNodeCreated(this._onItemsCountChanged.bind(this, controller, data), "Item");
          data._onNodeRemoveHandle = decoratorNode.onNodeRemoved(this._onItemsCountChanged.bind(this, controller, data), "Item");
        },

        /**
         * @inheritDoc
         * @protected
         */
        _detach: function(controller, data) {
          if (data._onNodeCreateHandle) {
            data._onNodeCreateHandle();
          }
          if (data._onNodeRemoveHandle) {
            data._onNodeRemoveHandle();
          }
        }
      };
    });
  });
