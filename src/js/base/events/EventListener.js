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

/**
 * @typedef {Function} HandleRegistration
 */
modulum('EventListener', ['Event'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * @class classes.EventListener
     * @classdesc A base class to support eventing
     */
    cls.EventListener = context.oo.Class(function() {
      var listenerIdentifier = 0,
        listeners = new Array(100000);
      /** @lends classes.EventListener.prototype */
      return {
        __name: "EventListener",
        /**
         * @type {Object}
         * @private
         */
        _events: null,
        /**
         * @type {bool} indicates if object has been destroyed
         * @protected
         */
        _destroyed: false,

        /**
         * initializes event system
         * @constructs {classes.EventListener}
         */
        constructor: function() {
          this._events = {};
        },
        /**
         *
         */
        destroy: function() {
          this._destroyed = true;
          this._events = null;
        },
        /**
         *
         * @param {String} type
         * @param {...any} arguments - arguments (excluding type) will be set in event.data
         */
        emit: function(type, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
          if (this._events && this._events[type] && this._events[type].length) {
            var event = new cls.Event(type);
            event.data = [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9];
            var list = this._events[type].slice(),
              len = list.length;
            for (var i = 0; i < len; i++) {
              var handler = listeners[list[i]];
              if (!!handler && !event.cancel) {
                handler.call(this, event, this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
              }
            }
          }
        },
        /**
         * registers a handler for this event type
         * @param {String} type - event type (e.g. "attribute changed")
         * @param {Function} handler - handler to trigger when the event type is emitted
         * @returns {HandleRegistration} a registration handle (for unbind purpose)
         */
        when: function(type, handler, once) {
          var ident = listenerIdentifier++;
          this._events[type] = this._events[type] || [];
          this._events[type].push(ident);
          var hdlr = handler;
          if (once) {
            hdlr = function(event, src, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
              handler.call(this, event, src, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
              this._off(type, ident);
            };
          }
          listeners[ident] = hdlr;
          return this._off.bind(this, type, ident);
        },
        _off: function(type, ident) {
          listeners[ident] = null;
        }
      };
    });
  });
