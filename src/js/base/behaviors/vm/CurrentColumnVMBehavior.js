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

modulum('CurrentColumnVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CurrentColumnVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CurrentColumnVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CurrentColumnVMBehavior.prototype */
      return {
        __name: "CurrentColumnVMBehavior",

        watchedAttributes: {
          anchor: ['currentColumn']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setCurrentColumn) {
            var currentColumn = controller.getAnchorNode().attribute('currentColumn');
            widget.setCurrentColumn(currentColumn);

          }
        }
      };
    });
  });
