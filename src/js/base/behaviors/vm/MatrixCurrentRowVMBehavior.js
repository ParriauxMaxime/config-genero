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

modulum('MatrixCurrentRowVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.MatrixCurrentRowVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.MatrixCurrentRowVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.MatrixCurrentRowVMBehavior.prototype */
      return {
        __name: "MatrixCurrentRowVMBehavior",

        watchedAttributes: {
          container: ['currentRow', 'offset', 'size']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget) {
            var bindings = controller.getNodeBindings();
            var app = bindings.container.getApplication();
            var uiNode = app.uiNode();
            var currentRow = bindings.container.attribute("currentRow");
            var offset = bindings.container.attribute("offset");
            var size = bindings.container.attribute("size");
            var hasFocus = bindings.container.getId() === uiNode.attribute("focus");
            if (currentRow < size && currentRow - offset === bindings.anchor.getIndex()) {
              widget.addClass("currentRow");
            } else {
              widget.removeClass("currentRow");
            }
            var parentForm = bindings.container.getAncestor("Form");
            var visibleId = null;
            if (parentForm) {
              visibleId = parentForm.attribute("visibleId");
            }
            // if matrix has vm focus and no visibleId is set on its parent form, then we display it
            if (hasFocus && (!visibleId || visibleId === -1)) {
              controller.ensureVisible();
            }
          }
        }
      };
    });
  }
);
