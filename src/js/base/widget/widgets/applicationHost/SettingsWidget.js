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

modulum('SettingsWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.SettingsWidget
     * @extends classes.WidgetBase
     */
    cls.SettingsWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.SettingsWidget.prototype */
      return {
        __name: "SettingsWidget",

        _lngWidget: null,
        _enableWidget: null,
        _resetWidget: null,
        _msgWidget: null,
        _typeaheadWidget: null,

        _lngElement: null,
        _enableElement: null,
        _resetElement: null,
        _resetConfirm: false,

        _storeSettingsEnabled: false,

        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);

          this._storeSettingsEnabled = gbc.StoredSettingsService.areEnabled();

          //Language widget
          this._lngWidget = cls.WidgetFactory.create("ComboBox");
          this._lngWidget.setEnabled(true);
          // Redefine the onclickFunction
          this._lngWidget._element.off('click.ComboBoxWidget');
          this._lngWidget._element.on('click.ComboBoxWidget', function(event) {
            event.stopPropagation();
            this._lngWidget.emit(context.constants.widgetEvents.click, event);
            this._lngWidget.emit(context.constants.widgetEvents.focus, event);
          }.bind(this));

          var allLng = gbc.I18NService.getAllLng();
          this._lngWidget.addChoices(allLng.map(function(lng) {
            return {
              text: lng.language,
              value: lng.locale
            };
          }));
          this._lngWidget.setValue(context.StoredSettingsService.getLanguage());

          this._lngWidget.when(context.constants.widgetEvents.click, function(event, data) {
            this._lngWidget._dropDown.toggle(true);
          }.bind(this));
          this._lngWidget.when(context.constants.widgetEvents.change, function(data) {
            if (typeof(data.data[0]) === "string") {
              this.setLanguage(data.data[0]);
            }
          }.bind(this));

          // Enable StoredSettings button
          this._enableWidget = cls.WidgetFactory.create("CheckBox");
          this._enableWidget.setEnabled(true);
          this._enableWidget.setText(i18next.t("gwc.storedSettings.enable"));
          this.enableStoredSettings(this._storeSettingsEnabled);
          this._enableWidget.when(context.constants.widgetEvents.click, function() {
            this.toggleStoredSettings();
          }.bind(this));

          // Reset StoredSettings button
          this._resetWidget = cls.WidgetFactory.create("Button");
          this._resetWidget.setText(i18next.t("gwc.storedSettings.reset"));
          this._resetWidget.when(context.constants.widgetEvents.click, function() {
            this.resetStoredSettings(this._resetConfirm);
          }.bind(this));

          // Get containers for each widget
          this._lngElement = this._element.getElementsByClassName("lngSettings")[0];
          this._enableElement = this._element.getElementsByClassName("enableStoredSettings")[0];
          this._resetElement = this._element.getElementsByClassName("clearStoredSettings")[0];

          // Add widgets in each container
          this._lngElement.appendChild(this._lngWidget.getElement());
          this._enableElement.appendChild(this._enableWidget.getElement());
          this._resetElement.appendChild(this._resetWidget.getElement());

          this._msgWidget = this._element.querySelector(".message");

          if (gbc.LocalSettingsService._quotaExceededError) {
            this._msgWidget.removeClass("hidden");
          }
          gbc.LocalSettingsService._eventListener.when("QuotaExceededError", function() {
            this._msgWidget.removeClass("hidden");
          }.bind(this));

          // Debug & QA
          if (context.DebugService.isActive()) {
            this._typeaheadWidget = cls.WidgetFactory.create("Edit");
            this._typeaheadWidget.setType("number");
            this._typeaheadWidget.setValue("" + gbc.SessionService.getCurrent().getCurrentApplication().keyboard.__getTypeaheadMinDuration());
            this._typeaheadWidget.getInputElement().on('input', function(evt) {
              var val = parseInt(this._typeaheadWidget.getValue(), 10);
              if (val > 0) {
                gbc.SessionService.getCurrent().getCurrentApplication().keyboard.__setTypeaheadMinDuration(val);
              }
            }.bind(this));

            this._element.getElementsByClassName("debugTopic")[0].removeClass("hidden");
            this._debugTypeaheadElement = this._element.getElementsByClassName("typeahead")[0];
            this._debugTypeaheadElement.appendChild(this._typeaheadWidget.getElement());

            this._loglevelWidget = cls.WidgetFactory.create("LogLevelSelector");
            this._loglevelWidget.when("loglevel", function(evt, src, level) {
              context.LogService.changeLevel(level);
              context.StoredSettingsService.setLoglevel(level);
            });
            this._debugLoglevelElement = this._element.getElementsByClassName("loglevel")[0];
            this._debugLoglevelElement.appendChild(this._loglevelWidget.getElement());
          }
        },

        _initLayout: function() {
          // no layout
        },

        _restoreDefaultButton: function() {
          // Restore default button
          this._resetConfirm = false;
          this._resetWidget.setText(i18next.t("gwc.storedSettings.reset"));
          this._resetWidget.setEnabled(true);
          this._resetWidget.setBackgroundColor(null);
          this._resetWidget.setColor(null);
        },

        setLanguage: function(lng) {
          gbc.StoredSettingsService.setLanguage(lng);
          this.getParentWidget().setFooter(i18next.t("gwc.storedSettings.changed"));
        },

        toggleStoredSettings: function() {
          if (this._storeSettingsEnabled) {
            this.enableStoredSettings(false);
          } else {
            this.enableStoredSettings(true);
          }
        },

        /**
         *
         * @param status
         */
        enableStoredSettings: function(status) {
          this._enableWidget.setValue(status ? this._enableWidget._checkedValue : this._enableWidget._uncheckedValue);
          this._storeSettingsEnabled = status;
          gbc.StoredSettingsService.enable(status);

        },
        /**
         *
         * @param force if not true, will ask for confirmation
         */
        resetStoredSettings: function(force) {
          // Ask for confirmation first
          if (!force) {
            this._resetWidget.setBackgroundColor(window.gbc.constants.theme["gbc-genero-lightRed"]);
            this._resetWidget.setColor(window.gbc.constants.theme["gbc-genero-black"]);
            this._resetWidget.setText(i18next.t("gwc.storedSettings.confirm"));
            this._resetConfirm = true;
          } else { // Reset once confirmed
            gbc.StoredSettingsService.reset();
            this._resetConfirm = false;
            this._resetWidget.setText(i18next.t("gwc.storedSettings.done"));
            this._resetWidget.setEnabled(false);
            this._resetWidget.setBackgroundColor(window.gbc.constants.theme["gbc-genero-lightGreen"]);
            this._resetWidget.setColor(window.gbc.constants.theme["gbc-genero-black"]);
            window.setTimeout(function() {
              this._restoreDefaultButton();
            }.bind(this), 2000);
          }
        }
      };
    });
    cls.WidgetFactory.register('Settings', cls.SettingsWidget);
  });
