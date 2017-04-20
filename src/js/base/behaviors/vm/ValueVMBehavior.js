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

modulum('ValueVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ValueVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ValueVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ValueVMBehavior.prototype */
      return {
        __name: "ValueVMBehavior",

        watchedAttributes: {
          anchor: ['value']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setValue) {
            var value = controller.getAnchorNode().attribute('value');
            widget._dirty = false;
            widget.setValue(value);
          }
        }
      };
    });
  });
