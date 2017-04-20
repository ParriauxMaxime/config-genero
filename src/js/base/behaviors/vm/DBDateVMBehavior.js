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

modulum('DBDateVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.DBDateVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.DBDateVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.DBDateVMBehavior.prototype */
      return {
        __name: "DBDateVMBehavior",

        watchedAttributes: {
          anchor: ['dbDate']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setDbDateFormat) {
            var anchorNode = controller.getAnchorNode();
            if (anchorNode.isAttributesSetByVM('dbDate')) {
              var dbDate = anchorNode.attribute('dbDate');
              widget.setDbDateFormat(dbDate);
            }
          }
        }
      };
    });
  });
