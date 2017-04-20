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

modulum('TitleVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.TitleVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.TitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.TitleVMBehavior.prototype */
      return {
        __name: "TitleVMBehavior",

        watchedAttributes: {
          anchor: ['comment', 'actionIdRef'],
          decorator: ['comment']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var widget = controller.getWidget();
          if (widget && widget.setTitle) {
            var bindings = controller.getNodeBindings();
            var commentNode = bindings.decorator ? bindings.decorator : bindings.anchor;
            var isDefined = commentNode.isAttributesSetByVM('comment');
            var text = commentNode.attribute('comment');
            if (!isDefined) {
              var actionIdRef = commentNode.attribute('actionIdRef');
              if (actionIdRef) {
                var actionNode = commentNode.getApplication().getNode(actionIdRef);
                if (!!actionNode) {
                  isDefined = actionNode.isAttributesSetByVM('comment');
                  text = actionNode.attribute('comment');
                }
              }
            }
            if (isDefined) {
              widget.setTitle(text);
            }
          }
        }
      };
    });
  });
