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

modulum('MenuEnabledVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Behavior controlling the widget's Menu
     * @class classes.HiddenVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.MenuEnabledVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.MenuEnabledVMBehavior.prototype */
      return {
        __name: "MenuEnabledVMBehavior",

        usedStyleAttributes: ["actionPanelPosition", "ringMenuPosition"],

        watchedAttributes: {
          anchor: ['active']
        },

        /**
         * Updates the widget's visibility depending on the AUI tree information
         */
        _apply: function(controller, data) {
          var thisWidget = controller.getWidget();
          if (!thisWidget) {
            return;
          }
          var anchorNode = controller.getAnchorNode();
          var isActive = anchorNode.attribute('active') === 1;

          if (thisWidget.setEnabled) {
            thisWidget.setEnabled(isActive);
          }
        }
      };
    });
  });
