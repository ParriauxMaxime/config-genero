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

modulum('ComponentTypeVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ComponentTypeVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.ComponentTypeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.ComponentTypeVMBehavior.prototype */
      return {
        __name: "ComponentTypeVMBehavior",

        watchedAttributes: {
          decorator: ['componentType']
        },

        /**
         *
         */
        _apply: function(controller, data) {
          var decoratorNode = controller.getNodeBindings().decorator;
          var widget = controller.getWidget();
          if (widget && widget.setWebComponentType) {
            var componentType = decoratorNode.attribute('componentType');
            var isApi = !!componentType;
            widget.setWebComponentType(componentType ? "api" : "url");
            if (isApi) {
              var webcompUrl = decoratorNode.getApplication().info().webComponent;
              widget.setUrl(webcompUrl + "/" + componentType + "/" + componentType + ".html");
            }
          }
        }
      };
    });
  });
