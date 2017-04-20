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

modulum('StretchableScrollGridPageSizeVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.StretchableScrollGridPageSizeVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.StretchableScrollGridPageSizeVMBehavior = context.oo.Singleton(cls.BehaviorBase, function($super) {
      /** @lends classes.StretchableScrollGridPageSizeVMBehavior.prototype */
      return {
        __name: "StretchableScrollGridPageSizeVMBehavior",

        watchedAttributes: {
          anchor: ['wantFixedPageSize', 'pageSize', 'bufferSize']
        },

        setup: function(controller, data) {
          data.linesCount = 0;
        },

        _apply: function(controller, data) {
          window.requestAnimationFrame(function() {
            var scrollGridNode = controller.getAnchorNode();
            //var pageSize = scrollGridNode.isAttributesSetByVM('bufferSize') ? scrollGridNode.attribute('bufferSize') : scrollGridNode.attribute('pageSize');
            var pageSize = scrollGridNode.attribute('pageSize');
            var children = scrollGridNode.getChildren();
            var scrollGridHeight = scrollGridNode.attribute('height');
            var scrollgridWidget = controller.getWidget();
            var newControllers = [];
            var lineIndex, i = 0;
            for (lineIndex = data.linesCount; lineIndex < pageSize; ++lineIndex) {
              // Add widgets
              for (i = 0; i < children.length; ++i) {
                this.createControllers(newControllers, children[i], lineIndex, scrollGridHeight, scrollgridWidget);
              }
            }
            for (lineIndex = data.linesCount - 1; lineIndex >= pageSize; --lineIndex) {
              // Remove Widgets
              for (i = 0; i < children.length; ++i) {
                this.recursiveRemove(children[i], lineIndex);
              }
            }
            data.linesCount = pageSize;
          }.bind(this));
        },

        createControllers: function(newControllers, node, lineIndex, scrollGridHeight, parentWidget, rec) {
          var ctrl = null;
          var widget = null;
          if (node.getTag() === "Matrix") {
            if (node._controller === null) {
              node._controller = node._createController(newControllers, true);
            }
            var valueList = node.getFirstChild("ValueList");
            if (valueList) {
              var valueNode = valueList.getChildren()[lineIndex];
              ctrl = valueNode.getController();
              if (!ctrl) {
                ctrl = valueNode._createController(newControllers, true);
                valueNode._controller = ctrl;
                widget = ctrl.createWidget();
                ctrl.applyBehaviors();
                parentWidget.addChildWidget(widget);
              }
            }
          } else {
            var ctrlGroup = node._controller;
            if (!ctrlGroup) {
              ctrlGroup = new cls.ControllerGroup(node);
              node._controller = ctrlGroup;
            }
            ctrl = node._createController(newControllers);
            ctrlGroup.addController(ctrl);
            if (ctrl) {
              widget = ctrl.createWidget();
              ctrl.applyBehaviors();
              if (widget) {
                var info = widget.getLayoutInformation();
                info.setGridY(scrollGridHeight * lineIndex + info.getGridY());
              }

              parentWidget.addChildWidget(widget);
              if (node.getTag() === "HBox" || node.getTag() === "Group") {
                var nodeChildren = node.getChildren();
                for (var i = 0; i < nodeChildren.length; ++i) {
                  this.createControllers(newControllers, nodeChildren[i], lineIndex, 0, widget, true);
                }
              }
            }
          }
        },

        recursiveRemove: function(node, lineIndex) {
          var children = node.getChildren();
          for (var i = 0; i < children.length; ++i) {
            this.recursiveRemove(children[i], lineIndex);
          }
          if (node._controller) {
            if (node._controller instanceof cls.ControllerGroup) {
              var ctrls = node._controller.getControllers();
              ctrls[lineIndex].destroy();
              ctrls.splice(lineIndex);
            } else if (node.getTag() === "Value" && node.getIndex() === lineIndex) {
              node._controller.destroy();
              node._controller = null;
            }
          }
        }
      };
    });
  }
);
