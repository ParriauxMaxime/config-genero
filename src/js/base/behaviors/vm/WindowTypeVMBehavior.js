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

modulum('WindowTypeVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.WindowTypeVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.WindowTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.WindowTypeVMBehavior.prototype */
      return {
        __name: "WindowTypeVMBehavior",

        usedStyleAttributes: ["windowType"],

        watchedAttributes: {
          anchor: ['style']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var styleNode = controller.getAnchorNode();
          var widget = styleNode.getController().getWidget();
          if (widget && widget.setAsModal) {
            var windowTypeAttr = styleNode.attribute("style");
            if (!this._isMenuSpecial(widget, windowTypeAttr)) {
              windowTypeAttr = styleNode.getStyleAttribute("windowType");
            }
            if (this._isMenuSpecial(widget, windowTypeAttr)) {
              widget.setAsModal(windowTypeAttr);
            } else if (widget.__name === "WindowWidget" && styleNode.isModal()) {
              var modalWidget = widget.setAsModal(windowTypeAttr);

              //modalWidget.setClosable(true);

              var sidebarApplicationItemWidget = styleNode.getApplication().getUI().getWidget().getSidebarWidget();
              modalWidget.onClose(sidebarApplicationItemWidget.unfreeze.bind(sidebarApplicationItemWidget));
              sidebarApplicationItemWidget.freeze();
            }

          }
        },

        _isMenuSpecial: function(widget, styleAttr) {
          return (widget.__name === "MenuWidget" && (styleAttr === "winmsg" || styleAttr === "dialog" || styleAttr === "popup"));
        }
      };
    });
  });
