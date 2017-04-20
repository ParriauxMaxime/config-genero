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

modulum('TableImageVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableImageVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TableImageVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TableImageVMBehavior.prototype */
      return {
        __name: "TableImageVMBehavior",

        watchedAttributes: {
          anchor: ['image']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (!widget) {
            return;
          }
          var tableItemWidget = widget.getParentWidget();
          if (tableItemWidget && tableItemWidget.setImage) {
            var image = controller.getAnchorNode().attribute('image');
            tableItemWidget.setImage(image);
          }
        }
      };
    });
  });
