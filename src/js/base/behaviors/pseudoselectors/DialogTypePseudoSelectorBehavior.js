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

modulum('DialogTypePseudoSelectorBehavior', ['PseudoSelectorBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DialogTypePseudoSelectorBehavior
     * @extends classes.PseudoSelectorBehaviorBase
     */
    cls.DialogTypePseudoSelectorBehavior = context.oo.Singleton(cls.PseudoSelectorBehaviorBase, function($super) {
      /** @lends classes.DialogTypePseudoSelectorBehavior.prototype */
      return {
        __name: "DialogTypePseudoSelectorBehavior",

        dialogTypeChanged: function(controller, data, event, eventData) {
          var node = controller.getNodeBindings().container;
          if (node._pseudoSelectorsUsedInSubTree.display ||
            node._pseudoSelectorsUsedInSubTree.input ||
            node._pseudoSelectorsUsedInSubTree.display) {
            this.setStyleBasedBehaviorsDirty(node);
          }
        },

        _attach: function(controller, data) {
          var node = controller.getNodeBindings().container;
          data.onDialogTypeAttributeChanged = node.onAttributeChanged('dialogType', this.dialogTypeChanged.bind(this, controller,
            data));
        },

        _detach: function(controller, data) {
          if (data.onDialogTypeAttributeChanged) {
            data.onDialogTypeAttributeChanged();
          }
        }
      };
    });
  }
);
