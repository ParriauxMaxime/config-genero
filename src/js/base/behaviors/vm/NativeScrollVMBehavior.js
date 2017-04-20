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

modulum('NativeScrollVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.NativeScrollVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.NativeScrollVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.NativeScrollVMBehavior.prototype */
      return {
        __name: "NativeScrollVMBehavior",

        watchedAttributes: {
          anchor: ['offset', 'size', 'pageSize', 'currentRow']
        },

        _apply: function(controller, data) {
          var node = controller.getAnchorNode();
          var widget = controller.getWidget();

          if (widget && widget.setVerticalScroll) {
            var currentRow = node.attribute('currentRow');
            var pageSize = node.attribute('pageSize');
            var size = currentRow !== -1 ? node.attribute('size') : 0;
            var offset = currentRow !== -1 ? node.attribute('offset') : 0;
            widget.setVerticalScroll(size, pageSize, offset);
          }
        }
      };
    });
  });
