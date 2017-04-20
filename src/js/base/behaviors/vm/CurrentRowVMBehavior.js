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

modulum('CurrentRowVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CurrentRowVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CurrentRowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CurrentRowVMBehavior.prototype */
      return {
        __name: "CurrentRowVMBehavior",

        watchedAttributes: {
          anchor: ['currentRow', 'offset']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCurrentRow) {
            var tableNode = controller.getAnchorNode();
            var app = tableNode.getApplication();
            var uiNode = app.uiNode();
            var currentRow = tableNode.attribute('currentRow');
            var offset = tableNode.attribute('offset');
            widget.setCurrentRow(currentRow - offset);
            var hasFocus = tableNode.getId() === uiNode.attribute("focus");
            var parentForm = tableNode.getAncestor("Form");
            var visibleId = null;
            if (parentForm) {
              visibleId = parentForm.attribute("visibleId");
            }
            // if table has vm focus and no visibleId is set on its parent form, then we display it
            if (hasFocus && (!visibleId || visibleId === -1)) {
              controller.ensureVisible();
            }

            // =====================================
            if (controller._updateMultiRowSelectionRoot) {
              controller._multiRowSelectionRoot = currentRow;
            }
            controller._updateMultiRowSelectionRoot = true;
            // =====================================
          }
        }
      };
    });
  });
