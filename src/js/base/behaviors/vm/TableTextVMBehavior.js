/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('TableTextVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TableTextVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TableTextVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TableTextVMBehavior.prototype */
      return {
        __name: "TableTextVMBehavior",

        watchedAttributes: {
          anchor: ['text']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var bindings = controller.getNodeBindings();
            var text = bindings.anchor.attribute('text');
            widget.setText(text);
          }
        }
      };
    });
  });
