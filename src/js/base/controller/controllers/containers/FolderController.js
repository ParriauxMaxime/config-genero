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

modulum('FolderController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.FolderController
     * @extends classes.ControllerBase
     */
    cls.FolderController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.FolderController.prototype */
      return {
        __name: "FolderController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // 4st behaviors
          this._addBehavior(cls.TabPosition4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          // ui behaviors

          var layoutService = this.getAnchorNode().getApplication().layout;
          this._afterLayoutHandler = layoutService.afterLayout(this.onAfterLayout.bind(this));
        },

        _createWidget: function(type) {
          var folder = $super._createWidget.call(this, type);
          folder.when(context.constants.widgetEvents.change, this._pageChanged.bind(this));
          return folder;
        },
        _pageChanged: function() {
          this.getAnchorNode().getApplication().getUI().getWidget().getLayoutInformation().invalidateMeasure();
          this.getAnchorNode().getApplication().layout.refreshLayout(); //{resize:true});
        },

        onAfterLayout: function() {
          if (this.getWidget() && this.getWidget()._scroller) {
            var isVertical = ["left", "right"].indexOf(this.getWidget()._tabsPosition) >= 0;
            var isHorizontal = ["top", "bottom"].indexOf(this.getWidget()._tabsPosition) >= 0;

            var sizeAttr = isVertical ? "height" : isHorizontal ? "width" : false;

            if (sizeAttr) {
              // Check if there is space enough to display the full bar or need scrolling
              var tabsTitlesSize = this.getWidget()._tabsTitlesElement.getBoundingClientRect()[sizeAttr];
              var tabsTitlesHostSize = this.getWidget()._scroller._tabsTitlesHost.getBoundingClientRect()[sizeAttr];

              if (tabsTitlesHostSize - tabsTitlesSize <= 0) {
                this.getWidget()._scroller.showScroller(true);
              } else {
                this.getWidget()._scroller.showScroller(false);
              }
            }
          }
        },

        destroy: function() {
          if (this._afterLayoutHandler) {
            this._afterLayoutHandler();
          }
          $super.destroy.call(this);
        }

      };
    });
    cls.ControllerFactory.register("Folder", cls.FolderController);

  });
