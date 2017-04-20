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

modulum('I18NService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Localization Service to translate the app
     * @class gbc.I18NService
     */
    gbc.I18NService = context.oo.StaticClass( /** @lends gbc.I18NService */ {
      __name: 'I18NService',
      _init: false,

      /**
       * Language to use if not defined by user or browser
       * @type {string}
       */
      _fallBackLng: 'en-US',

      /**
       * Event listener object
       * @type {*}
       */
      _eventListener: new cls.EventListener(), //used to listen when i18next is ready

      /**
       * Event name once I18N is ready
       */
      _i18nReady: 'i18nReady',

      /**
       * Flag to determine if service is ready or not
       * @type {boolean}
       */
      isReady: false,

      /**
       * Init service method. should be called only once.
       */
      init: function() {
        // jshint ignore:start
        window.i18next
          .use(window.i18nextBrowserLanguageDetector)
          .init({
            resources: window.gbcLocales,
            detection: {
              lookupQuerystring: 'setLng',
              lookupCookie: 'lang',
              caches: ['cookie']
            }
          }, this._onReady.bind(this));
        // jshint ignore:end
      },

      /**
       * Set the language of the app
       * @param locale language code to set
       */
      setLng: function(locale) {
        window.i18next.changeLanguage(locale); //, callback)
      },

      /**
       * Tranlate a widget with i18n data
       * @param widget Widget to translate
       */
      translate: function(widget) {
        if (this.isReady) {
          widget.translate();
        } else {
          this._eventListener.when(this._i18nReady, widget.translate.bind(widget));
        }
      },

      /**
       * Get an Array of all available translations with locales id
       * @returns {Array}
       */
      getAllLng: function() {
        return Object.keys(window.gbcLocales).map(function(key) {
          if (key !== 'undefined') {
            return {
              'locale': key,
              'language': window.i18next.exists('gwc.lngName', {
                lng: key,
                fallbackLng: 'undef'
              }) ? window.i18next.t('gwc.lngName', {
                lng: key
              }) : key
            };
          }
        });
      },

      /**
       * Ready Handler
       * @private
       */
      _onReady: function() {
        this._checkLanguageCompatibility();
        // Emit I18n ready
        this._eventListener.emit(this._i18nReady);
        this.isReady = true;
      },

      /**
       * Try to find the closest language as defined by browser
       * @private
       */
      _checkLanguageCompatibility: function() {
        var storedLng = gbc.StoredSettingsService.getLanguage();
        var cookieLng = gbc.StoredSettingsService._getCookie('lang');
        var language = cookieLng || storedLng || this._fallBackLng;

        if (language && !window.gbcLocales[language]) {
          var allLngKeys = Object.keys(window.gbcLocales);
          for (var i = 0; i < allLngKeys.length; i++) {
            if (language.startsWith(allLngKeys[i].substring(0, 2))) {
              this.setLng(allLngKeys[i]);
              gbc.StoredSettingsService.setSettings('gwc.app.locale', allLngKeys[i]);
              break;
            }
          }
        }
      }

    });
    context.InitService.register(context.I18NService);
  });
