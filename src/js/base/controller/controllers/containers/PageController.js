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

modulum('PageController', ['ControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.PageController
     * @extends classes.ControllerBase
     */
    cls.PageController = context.oo.Class(cls.ControllerBase, function($super) {
      /** @lends classes.PageController.prototype */
      return {
        __name: "PageController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          this._addBehavior(cls.LayoutInfoVMBehavior);
          // END WARNING

          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
          // 4st behaviors
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.StyleVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextVMBehavior);
          this._addBehavior(cls.ImageVMBehavior);
        },

        /**
         *
         * @param {string=} kind
         * @returns {classes.WidgetBase}
         * @protected
         */
        _createWidget: function(type) {
          var pageWidget = $super._createWidget.call(this, type);
          var parentPageWidget = null;
          var parentPageNode = this.getAnchorNode().getAncestor("Page");
          if (parentPageNode) {
            parentPageWidget = parentPageNode.getController().getWidget();
          }
          pageWidget.emit(context.constants.widgetEvents.ready, parentPageWidget);
          return pageWidget;
        },

        /**
         * @inheritDoc
         */
        ensureVisible: function() {
          var folderWidget = this.getAnchorNode().getParentNode().getController().getWidget();
          folderWidget.setCurrentPage(this.getWidget());
          $super.ensureVisible.call(this);
        }
      };
    });
    cls.ControllerFactory.register("Page", cls.PageController);

  });
