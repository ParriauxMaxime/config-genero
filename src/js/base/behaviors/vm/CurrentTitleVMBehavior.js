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

modulum('CurrentTitleVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.CurrentTitleVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.CurrentTitleVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.CurrentTitleVMBehavior.prototype */
      return {
        __name: "CurrentTitleVMBehavior",

        watchedAttributes: {
          anchor: ['name', 'text', 'image']
        },

        /**
         * Switches the current window
         */
        _apply: function(controller, data) {
          var anchorNode = controller.getAnchorNode();
          var userInterfaceNode = anchorNode.getApplication().getNode(0);
          var uititle = userInterfaceNode.isAttributesSetByVM("text") ? userInterfaceNode.attribute("text") : userInterfaceNode.attribute(
            "name");
          var uiimage = userInterfaceNode.isAttributesSetByVM("image") ? userInterfaceNode.attribute('image') : null;
          var windowNode = anchorNode.getTag() === "Window" ? anchorNode : anchorNode.getAncestor("Window");
          windowNode = windowNode || userInterfaceNode.getFirstChildWithId(userInterfaceNode.attribute("currentWindow"));
          if (windowNode !== null) {
            var title = null;
            var image = null;

            var formNode = windowNode.getFirstChild("Form");
            var menuNode = null;
            // look for image
            if (windowNode.isAttributesSetByVM("image")) {
              image = windowNode.attribute("image");
            }
            if (formNode !== null && formNode.isAttributesSetByVM("image")) {
              image = formNode.attribute("image");
            } else {
              menuNode = windowNode.getLastChild("Menu");
              if (menuNode !== null && menuNode.isAttributesSetByVM("image")) {
                image = menuNode.attribute("image");
              }
            }

            // look for text / name
            if (formNode !== null) {
              if (windowNode.isAttributesSetByVM("text")) {
                title = windowNode.attribute("text");
              } else if (windowNode.isAttributesSetByVM("name")) {
                title = windowNode.attribute("name");
              }
            } else {
              if (!menuNode) {
                menuNode = windowNode.getLastChild("Menu");
              }
              if (menuNode !== null) {
                if (menuNode.isAttributesSetByVM("text")) {
                  title = menuNode.attribute("text");
                } else if (windowNode.isAttributesSetByVM("text")) {
                  title = windowNode.attribute("text");
                } else if (menuNode.isAttributesSetByVM("name")) {
                  title = menuNode.attribute("name");
                } else if (!windowNode.isAttributesSetByVM("name")) {
                  title = windowNode.attribute("name");
                }
              }
            }

            var windowWidget = windowNode.getController().getWidget();
            if (title) {
              if (windowWidget.setText) {
                windowWidget.setText(title);
              }
            }

            if (image) {
              if (windowWidget.setImage) {
                windowWidget.setImage(image);
              }
            }

            if (context.HostService.getCurrentWindow() === windowWidget) {
              context.HostService.setCurrentTitle(title);
              context.HostService.setCurrentIcon(image ? image : uiimage); // this is typical rule which enforces to manage title icon directly here and not in widgets
            }
          } else {
            var userInterfaceWidget = userInterfaceNode.getController().getWidget();
            if (userInterfaceWidget.setText) {
              userInterfaceWidget.setText(uititle);
            }
            if (userInterfaceWidget.setImage) {
              userInterfaceWidget.setImage(uiimage);
            }
            if (uiimage) {
              context.HostService.setCurrentIcon(uiimage, true);
            } else {
              context.HostService.setCurrentIcon("", true);
            }
          }
        }
      };
    });
  });
