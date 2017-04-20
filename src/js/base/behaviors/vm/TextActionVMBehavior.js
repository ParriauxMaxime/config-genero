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

modulum('TextActionVMBehavior', ['BehaviorBase'],
  /**
   * Manage "Text" attribute only for Action widgets
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TextActionVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TextActionVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TextActionVMBehavior.prototype */
      return {
        __name: "TextActionVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'text', 'actionIdRef']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setText) {
            var anchorNode = controller.getAnchorNode();
            var text = anchorNode.attribute('text');
            var isTextDefined = anchorNode.isAttributesSetByVM('text');
            if (!isTextDefined) { // for actions if there is no text we use name attribute
              var actionIdRef = anchorNode.attribute('actionIdRef');
              if (actionIdRef !== 0) {
                var actionNode = anchorNode.getApplication().getNode(actionIdRef);
                if (!!actionNode) {
                  isTextDefined = actionNode.isAttributesSetByVM('text');
                  text = actionNode.attribute('text');
                }
              }
            }
            var image = anchorNode.attribute('image');
            var nameAllowed = anchorNode.getTag() === "Action" || anchorNode.getTag() === "Menu" || anchorNode.getTag() ===
              "MenuAction";
            if (nameAllowed && !isTextDefined && !image) { // for actions if there is no text we use name attribute
              text = anchorNode.attribute('name');
            }
            //remove first occurence of & symbol (quick shortcut not available in webclient)
            text = text.toString().replace(/&(.)/g, "$1");
            widget.setText(text);
          }
        }
      };
    });
  });
