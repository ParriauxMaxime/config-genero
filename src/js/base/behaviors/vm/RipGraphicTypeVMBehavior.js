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

modulum('RipGraphicTypeVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.RipGraphicTypeVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.RipGraphicTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.RipGraphicTypeVMBehavior.prototype */
      return {
        __name: "RipGraphicTypeVMBehavior",

        watchedAttributes: {
          anchor: ['type']
        },

        _apply: function(controller, data) {
          controller.getWidget().setType(controller.getAnchorNode().attribute('type'));
        }
      };
    });
  });
