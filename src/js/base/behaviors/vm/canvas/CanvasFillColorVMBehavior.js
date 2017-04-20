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

modulum('CanvasFillColorVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.CanvasFillColorVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CanvasFillColorVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CanvasFillColorVMBehavior.prototype */
      return {
        __name: "CanvasFillColorVMBehavior",

        watchedAttributes: {
          anchor: ['fillColor']
        },

        _apply: function(controller, data) {
          var color = controller.getAnchorNode().attribute('fillColor');
          var themedColor = gbc.constants.theme["gbc-genero-" + color];
          if (!!themedColor) {
            color = themedColor;
          }
          controller.getWidget().setColor(color);
        }
      };
    });
  });
