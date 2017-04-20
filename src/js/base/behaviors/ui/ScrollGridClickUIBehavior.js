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

modulum('ScrollGridClickUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ScrollGridClickUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.ScrollGridClickUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.ScrollGridClickUIBehavior.prototype */
      return {
        __name: "ScrollGridClickUIBehavior",

        _attachWidget: function(controller, data) {
          var widget = controller.getWidget();
          data.clickHandle = widget.when(context.constants.widgetEvents.click, this._handle.bind(this, controller, data, false));
          data.doubleClickHandle = widget.when(context.constants.widgetEvents.doubleClick, this._handle.bind(this, controller, data,
            true));
        },

        _detachWidget: function(controller, data) {
          if (data.clickHandle) {
            data.clickHandle();
            data.clickHandle = null;
          }
          if (data.doubleClickHandle) {
            data.doubleClickHandle();
            data.doubleClickHandle = null;
          }
        },

        _handle: function(controller, data, isDoubleClick, e, sender, nativeEvent) {
          var anchorNode = controller.getAnchorNode();
          if (anchorNode.attribute("active") === 1) {
            var widget = controller.getWidget();
            var rowHeight = widget.getRowHeight();
            var scrollGridTop = widget.getElement().getBoundingClientRect().top;
            var scrollTop = widget.getElement().scrollTop;
            var globalY = nativeEvent.clientY + scrollTop - scrollGridTop;
            var newCurrentRow = Math.floor(globalY / rowHeight);
            if (anchorNode.attribute("wantFixedPageSize") !== 0) {
              newCurrentRow += anchorNode.attribute("offset");
            }
            var event = null;
            if (newCurrentRow !== anchorNode.attribute("currentRow")) {
              event = new cls.VMConfigureEvent(anchorNode.getId(), {
                currentRow: newCurrentRow
              });
              anchorNode.getApplication().event(event);
            }
            if (isDoubleClick) {
              if (anchorNode.isAttributesSetByVM("doubleClick")) {
                event = new cls.VMActionEvent(anchorNode.getId());
                anchorNode.getApplication().event(event);
              } else {
                var dialog = anchorNode.getAncestor('Window').getActiveDialog();
                var acceptAction = dialog.getFirstChildWithAttribute(null, 'name', 'accept');
                if (acceptAction) {
                  event = new cls.VMActionEvent(acceptAction.getId());
                  anchorNode.getApplication().event(event);
                }
              }
            }
          }
        },
      };
    });
  });
