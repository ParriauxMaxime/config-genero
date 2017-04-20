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

modulum('ApplicationHostSettingsWidget', ['ModalWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostSettingsWidget
     * @extends classes.ModalWidget
     */
    cls.ApplicationHostSettingsWidget = context.oo.Class(cls.ModalWidget, function($super) {
      /** @lends classes.ApplicationHostSettingsWidget.prototype */
      return {
        __name: "ApplicationHostSettingsWidget",
        __templateName: "ModalWidget",

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

          var headerTitleDom = document.createElement('span');
          headerTitleDom.innerHTML = '<i class="zmdi zmdi-settings"></i> ' + i18next.t("gwc.settings");
          this.setHeader(headerTitleDom);

          this.setClosable(true, true);
          this.setContent(dialogContents);

          this._settings = cls.WidgetFactory.create("Settings");
          dialogContents.appendChild(this._settings.getElement());
          this._settings.setParentWidget(this);

        },
        destroy: function() {
          $super.destroy.call(this);
        },

        hide: function() {
          this._settings._restoreDefaultButton();
          $super.hide.call(this);
        },

        /**
         * Handle a change in the way of displaying the modal
         * @private
         */
        _modalLayoutChangedHandler: function() {
          window.onresize = function() {
            // will force modal remeasure
            this._moved = false;
            this._bounds = {};
            // Reset modal position
            this._dialogPane.style.top = "";
            this._dialogPane.style.left = "";
          }.bind(this);
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostSettings', cls.ApplicationHostSettingsWidget);
  });
