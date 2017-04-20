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

modulum('HasWebComponentUIBehavior', ['UIBehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.HasWebComponentUIBehavior
     * @extends classes.UIBehaviorBase
     */
    cls.HasWebComponentUIBehavior = context.oo.Singleton(cls.UIBehaviorBase, function($super) {
      /** @lends classes.HasWebComponentUIBehavior.prototype */
      return {
        /** @type {string} */
        __name: "HasWebComponentUIBehavior",

        _attachWidget: function(controller, data) {
          if (!!controller.getWidget() && controller.getWidget()._iframeElement) {
            var windowNode = controller.getAnchorNode().getAncestor("Window");
            //Tell application it contains a window with webcomponent
            var application = windowNode.getAncestor("UserInterface").getApplication(),
              applicationWidget = application.getUI().getWidget();
            applicationWidget.setHasWebComponent(true);

            //Tell window it contains a webcomponent
            var windowWidget = windowNode.getController().getWidget();
            windowWidget.setHasWebComponent(true);

          }
        },

        _detachWidget: function(controller, data) {
          //TODO many Webcomp

        }

      };
    });
  });
