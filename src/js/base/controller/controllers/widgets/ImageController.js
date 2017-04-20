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

modulum('ImageController', ['ValueContainerControllerBase', 'ControllerFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.ImageController
     * @extends classes.ValueContainerControllerBase
     */
    cls.ImageController = context.oo.Class(cls.ValueContainerControllerBase, function($super) {
      /** @lends classes.ImageController.prototype */
      return {
        __name: "ImageController",
        _initBehaviors: function() {
          $super._initBehaviors.call(this);
          var decorator = this.getNodeBindings().decorator;
          var container = this.getNodeBindings().container;

          var isStatic = !decorator && !container;

          // These behaviors should stay added at first
          // WARNING : DO NOT ADD BEHAVIORS BEFORE
          if (this.isInTable) {
            this._addBehavior(cls.TableSizeVMBehavior);
          }
          if (!this.isInTable || this.isInFirstTableRow) {
            this._addBehavior(cls.LayoutInfoVMBehavior);
          }
          this._addBehavior(cls.StyleVMBehavior);
          // END WARNING

          // pseudo-selector behaviors
          if (!isStatic) {
            this._addBehavior(cls.ActivePseudoSelectorBehavior);
            this._addBehavior(cls.DialogTypePseudoSelectorBehavior);
            if (this.isInMatrix) {
              this._addBehavior(cls.MatrixCurrentRowVMBehavior);
            }
          }
          this._addBehavior(cls.FontStyle4STBehavior);
          this._addBehavior(cls.FontSize4STBehavior);
          this._addBehavior(cls.Border4STBehavior);
          this._addBehavior(cls.Alignment4STBehavior);
          this._addBehavior(cls.Reverse4STBehavior);

          // vm behaviors
          this._addBehavior(cls.EnabledVMBehavior);
          this._addBehavior(cls.HiddenVMBehavior);
          this._addBehavior(cls.ColorVMBehavior);
          this._addBehavior(cls.BackgroundColorVMBehavior);
          this._addBehavior(cls.FontWeightVMBehavior);
          this._addBehavior(cls.FontFamilyVMBehavior);
          this._addBehavior(cls.TextDecorationVMBehavior);
          this._addBehavior(cls.TitleVMBehavior);
          this._addBehavior(cls.AutoScaleVMBehavior);

          this._addBehavior(cls.DefaultTTFColor4STBehavior);
          this._addBehavior(cls.ClickableImageVMBehavior);

          if (isStatic) {
            this._addBehavior(cls.ImageVMBehavior);
          } else {
            this._addBehavior(cls.RequestFocusUIBehavior);
            this._addBehavior(cls.ValueVMBehavior);
          }
          // ui behaviors
          this._addBehavior(cls.OnClickUIBehavior);
          if (this.isInTable) {
            this._addBehavior(cls.TableImageVMBehavior);
            this._addBehavior(cls.RowSelectionUIBehavior);
            this._addBehavior(cls.TableItemCurrentRowVMBehavior);
          }
        },
        _createWidget: function(type) {
          var styleNode = this.getNodeBindings().decorator ? this.getNodeBindings().decorator : this.getAnchorNode();
          var imgWidget = cls.WidgetFactory.create(type, styleNode.attribute('style'), {
            appHash: this.getAnchorNode().getApplication().applicationHash,
            auiTag: this.getAnchorNode().getId(),
            inTable: this.isInTable,
            inFirstTableRow: this.isInFirstTableRow,
            inMatrix: this.isInMatrix
          });
          imgWidget.setStandaloneImage(!this.isInTable);
          imgWidget.when(context.constants.widgetEvents.ready, this._imageLoaded.bind(this));
          var application = this.getAnchorNode() && this.getAnchorNode().getApplication();
          if (application) {
            application.layout.afterLayout(imgWidget._whenLayouted.bind(imgWidget));
          }
          return imgWidget;
        },
        _imageLoaded: function() {
          var application = this.getAnchorNode() && this.getAnchorNode().getApplication();
          if (application) {
            application.layout.refreshLayout();
          }
        }
      };
    });
    cls.ControllerFactory.register("Image", cls.ImageController);

  });
