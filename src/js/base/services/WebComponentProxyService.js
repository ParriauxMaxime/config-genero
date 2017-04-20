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

modulum('WebComponentProxyService', ['InitService'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Proxy Service used to forward webcomponent api
     * @class gbc.WebComponentProxyService
     */
    context.WebComponentProxyService = context.oo.StaticClass( /** @lends gbc.WebComponentProxyService */ {
      __name: "WebComponentProxyService",
      /**
       * List of proxies
       * @type {Object}
       */
      _proxies: {},

      /**
       * Keep track of webcomponent URL provided by the GAS
       * @type {url}
       */
      _webcomponentUrl: null,

      /**
       * Init function, called once and mandatory
       */
      init: function() {

      },

      /**
       * Add or edit a new proxy
       * @param uid
       * @param widget
       */
      setProxy: function(uid, widget) {
        this._proxies[uid] = this._api(widget);
      },

      /**
       * Get a registered proxy
       * @param uid
       * @returns {*}
       */
      getProxy: function(uid) {
        return this._proxies[uid];
      },

      /**
       * Get the webcomponent URL defined by the GAS
       * @returns {url}
       */
      getWebcomponentUrl: function() {
        return this._webcomponentUrl;
      },

      /**
       * Set the webcomponent URL
       * @param url
       */
      setWebcomponentUrl: function(url) {
        this._webcomponentUrl = url;
      },

      /**
       * Api that will be binded to webcomponent
       * @returns {{setFocus: setFocus, setData: setData, action: action}}
       * @private
       */
      _api: function() {
        return {
          //Generates a focus request
          setFocus: function(element) {
            element.emit(context.constants.widgetEvents.requestFocus);
          },
          //Registers data to be sent to the program, in order to set the form field value in the program.
          setData: function(element, dataStr) {
            element.emit(cls.WebComponentWidget.dataEvent, dataStr);
          },
          //Triggers an action event, which will execute the corresponding ON ACTION code.
          action: function(element, actionName) {
            element.emit(cls.WebComponentWidget.actionEvent, actionName);
          }
        };
      }
    });
    context.InitService.register(context.WebComponentProxyService);
  });
