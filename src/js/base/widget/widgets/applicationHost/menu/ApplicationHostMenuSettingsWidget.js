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

modulum('ApplicationHostMenuSettingsWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuSettingsWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuSettingsWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuSettingsWidget.prototype */
      return {
        __name: "ApplicationHostMenuSettingsWidget",

        _settingsModal: null,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.setAttribute('title', "Stored settings");
          this._element.on("click.ApplicationHostMenuSettingsWidget", this._onClick.bind(this));

          if (gbc.LocalSettingsService._quotaExceededError) {
            this.addClass("error");
          }
          gbc.LocalSettingsService._eventListener.when("QuotaExceededError", function() {
            this.addClass("error");
          }.bind(this));

        },
        _initLayout: function() {
          // no layout
        },
        _onClick: function() {
          if (this._settingsModal === null) {
            this._settingsModal = cls.WidgetFactory.create('ApplicationHostSettings');
            document.body.appendChild(this._settingsModal.getElement());
            this._settingsModal.when(context.constants.widgetEvents.close, function() {
              this._settingsModal.destroy();
              this._settingsModal = null;
            }.bind(this));
          }
          this._settingsModal.show();
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostSettingsMenu', cls.ApplicationHostMenuSettingsWidget);
  });
