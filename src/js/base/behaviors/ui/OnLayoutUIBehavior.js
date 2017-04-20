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

modulum('OnLayoutUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.OnLayoutUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.OnLayoutUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.OnLayoutUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "OnLayoutUIBehavior",

        _attachWidget: function(controller, data) {
          var node = controller.getAnchorNode();
          data.afterLayoutHandler = node.getApplication().layout.afterLayout(this._onLayout.bind(this, controller, data));
        },

        _detachWidget: function(controller, data) {
          if (data.afterLayoutHandler) {
            data.afterLayoutHandler();
            data.afterLayoutHandler = null;
          }
        },

        /**
         * On layout widget event: send new page size to vm
         * @private
         */
        _onLayout: function(controller, data) {
          var node = controller.getAnchorNode();
          var pageSize = node.attribute('pageSize');
          var bufferSize = node.attribute('bufferSize');

          var widget = controller.getWidget();

          var isVisible = widget.isPageVisible ? widget.isPageVisible() : true;
          // if widget is in a page which is not visible it is not necessary to send a pageSize
          if (isVisible && widget.getDataAreaHeight && widget.getRowHeight) {
            var dataAreaHeight = widget.getDataAreaHeight();
            if (!isNaN(dataAreaHeight)) {
              var rowHeight = widget.getRowHeight();

              var newPageSize = Math.floor(dataAreaHeight / rowHeight);
              newPageSize = Number.isNaN(newPageSize) ? 1 : Math.max(newPageSize, 1);

              var newBufferSize = newPageSize;
              if (node.attribute("wantFixedPageSize") === 0) {
                newBufferSize += 1;
              }

              if (newPageSize !== data.requestedPageSize && pageSize !== newPageSize) {
                var event = new cls.VMConfigureEvent(node.getId(), {
                  pageSize: newPageSize,
                  bufferSize: newBufferSize
                });

                node.getApplication().event(event);
                data.requestedPageSize = newPageSize;
              }
            }
          }
        }
      };
    });
  });
