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

modulum('LayoutInfoVMBehavior', ['BehaviorBase'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.LayoutInfoVMBehavior
     * @extends classes.BehaviorBase
     */
    cls.LayoutInfoVMBehavior = context.oo.Singleton(cls.BehaviorBase, function() {
      /** @lends classes.LayoutInfoVMBehavior.prototype */
      return {
        __name: "LayoutInfoVMBehavior",

        widgetsIgnoringSizePolicy: ["ButtonEdit", "DateEdit", "DateTimeEdit", "Edit", "ProgressBar", "Slider", "SpinEdit",
          "TextEdit", "TimeEdit"
        ],

        watchedAttributes: {
          anchor: ['width', 'gridWidth', 'height', 'gridHeight', 'posX', 'posY', 'stretch', 'sizePolicy'],
          container: ['gridChildrenInParent', 'stepX', 'stepY', 'columnCount'],
          decorator: ['width', 'gridWidth', 'height', 'gridHeight', 'posX', 'posY', 'stretch', 'sizePolicy']
        },

        /**
         *
         */
        _apply: function(controller) {
          var widget = controller.getWidget(),
            anchorNode = controller.getNodeBindings().anchor,
            layoutInfoNode = controller.getNodeBindings().decorator || anchorNode,
            containerNode = controller.getNodeBindings().container;
          var doUpdate = false;
          var isDeepInStretchableScrollGrid = false;
          if (containerNode && containerNode.getTag() === "Matrix") {
            var parentNode = containerNode.getParentNode();
            var grandParentNode = parentNode.getParentNode();
            isDeepInStretchableScrollGrid = parentNode.getTag() !== "ScrollGrid" && grandParentNode.getTag() === "ScrollGrid" &&
              grandParentNode.attribute("wantFixedPageSize") === 0;
          }
          if (widget && widget.getLayoutInformation) {
            var info = widget.getLayoutInformation();
            var layoutEngine = widget.getLayoutEngine();
            var sizePolicy = layoutInfoNode.attribute('sizePolicy');
            if (this.widgetsIgnoringSizePolicy.indexOf(layoutInfoNode.getTag()) !== -1) {
              sizePolicy = "initial";
            }
            if (layoutEngine && layoutEngine.setHint) {
              var widthHint = layoutInfoNode.attribute('width');
              var heightHint = layoutInfoNode.attribute('height');
              if (sizePolicy === 'fixed') {
                if (!widthHint) {
                  widthHint = layoutInfoNode.attribute('gridWidth');
                }
                if (!heightHint) {
                  heightHint = layoutInfoNode.attribute('gridHeight');
                }
              }
              layoutEngine.setHint(widthHint, heightHint);
            }

            if (info.setMinSizeHint) {
              var minWidthHint = layoutInfoNode.attribute('minWidth');
              var minHeightHint = layoutInfoNode.attribute('minHeight');
              info.setMinSizeHint(minWidthHint, minHeightHint);
            }

            var autoscale = layoutInfoNode.attribute('autoScale');
            info.setSizePolicyMode(controller.isInMatrix || (sizePolicy === "dynamic" && autoscale) ? "fixed" : sizePolicy);

            doUpdate = info.setGridWidth(layoutInfoNode.attribute('gridWidth'), true) || doUpdate;
            if (widget.setCols) {
              var rawWidth = layoutInfoNode.attribute('width');
              if (!layoutInfoNode.attribute('gridWidth') && cls.Size.isCols(rawWidth)) {
                widget.setCols(parseInt(rawWidth, 10));
              } else {
                widget.setCols(layoutInfoNode.attribute('gridWidth') || 1);
              }
            }
            doUpdate = info.setGridHeight(layoutInfoNode.attribute('gridHeight'), true) || doUpdate;

            var position = {
              x: layoutInfoNode.attribute('posX') || 0,
              y: layoutInfoNode.attribute('posY') || 0
            };
            if (containerNode && (containerNode !== anchorNode) && !isDeepInStretchableScrollGrid) {
              var index = anchorNode.getParentNode()._children.indexOf(anchorNode),
                columnCount = containerNode.attribute('columnCount') || 1,
                stepX = (containerNode.attribute('stepX') || 0),
                stepY = (containerNode.attribute('stepY') || 0);
              var shiftX = index % columnCount;
              var shiftY = Math.floor(index / columnCount);

              position.x += (shiftX * stepX);
              position.y += (shiftY * stepY);
            }

            doUpdate = info.setGridX(position.x, true) || doUpdate;
            doUpdate = info.setGridY(position.y, true) || doUpdate;
            var stretch = layoutInfoNode.attribute('stretch');
            if (stretch) {
              info.getStretched().setX(stretch === 'x' || stretch === 'both');
              info.getStretched().setY(stretch === 'y' || stretch === 'both');
            }
            if (layoutInfoNode.getTag() === "ScrollGrid" && layoutInfoNode.attribute("wantFixedPageSize") === 0) {
              info.getStretched().setY(true);
            }
            var gridChildrenInParent = +(layoutInfoNode.attribute('gridChildrenInParent') || 0);
            if (widget.setGridChildrenInParent) {
              widget.setGridChildrenInParent(!!gridChildrenInParent);
            }
            if (doUpdate) {
              info.invalidateInfos();
            }
          }
        }
      };
    });
  });
