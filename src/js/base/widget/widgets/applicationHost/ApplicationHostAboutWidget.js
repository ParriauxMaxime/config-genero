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

modulum('ApplicationHostAboutWidget', ['ModalWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostAboutWidget
     * @extends classes.ModalWidget
     */
    cls.ApplicationHostAboutWidget = context.oo.Class(cls.ModalWidget, function($super) {
      /** @lends classes.ApplicationHostAboutWidget.prototype */
      return {
        __name: "ApplicationHostAboutWidget",
        __templateName: "ModalWidget",
        /**
         * @type {classes.ProductInformationWidget}
         */
        _productInformation: null,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._gbcSystemModal();
        },

        _initLayout: function() {
          // no layout
        },

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._element.addClass("mt-dialog-about");
          var dialogContents = document.createElement("div");

          this.setContent(dialogContents);
          var footer = document.createElement("div");
          footer.addClass("copyright");
          footer.innerHTML = "<small>Property of Four Js<sup>*</sup><br>" +
            "&#169; Copyright Four Js 2017. All Rights Reserved.<br>" +
            "* Trademark of Four Js Development Tools Europe Ltd in the United States and elsewhere</small>";
          this.setFooter(footer);
          this._productInformation = cls.WidgetFactory.create("ProductInformation");
          this._productInformation.setVersion(context.version);
          this._productInformation.setBuild(context.build + (context.dirtyFlag || ""));
          if (context.tag === "dev-snapshot") {
            this._productInformation.setTag(context.tag);
          }
          this._productInformation.setLogo("resources/img/logo.png");
          this._productInformation.setLogoAlt("Genero Browser Client");
          dialogContents.appendChild(this._productInformation.getElement());

          this.setClosable(true, true);
        },

        destroy: function() {
          if (this._productInformation) {
            this._productInformation.destroy();
            this._productInformation = null;
          }
          $super.destroy.call(this);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostAbout', cls.ApplicationHostAboutWidget);
  });
