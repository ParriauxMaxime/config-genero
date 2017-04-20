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

modulum('ApplicationWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationWidget
     * @extends classes.WidgetGroupBase
     */
    cls.ApplicationWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.ApplicationWidget.prototype */
      return {
        __name: "ApplicationWidget",
        _waiter: null,
        /**
         * @type {classes.SessionSidebarApplicationItemWidget}
         */
        _sidebarWidget: null,
        _messageWidget: null,
        _applicationHash: null,
        _handlers: null,
        _uiWidget: null,
        _hasWebcomp: false,

        constructor: function() {
          $super.constructor.call(this);
          this._handlers = [];
          this._sidebarWidget = cls.WidgetFactory.create("SessionSidebarApplicationItem");
          this._sidebarWidget.setApplicationWidget(this);
          this._messageWidget = cls.WidgetFactory.create("Message");
          this._messageWidget.setHidden(true);
        },
        destroy: function() {
          if (this._handlers) {
            for (var i = 0; i < this._handlers.length; i++) {
              this._handlers[i]();
            }
            this._handlers.length = 0;
          }
          this._sidebarWidget.destroy();
          this._sidebarWidget = null;
          this._messageWidget.destroy();
          this._messageWidget = null;
          if (this._waiter) {
            this._waiter.destroy();
            this._waiter = null;
          }
          $super.destroy.call(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._waiter = cls.WidgetFactory.create("Waiting");
          this._element.appendChild(this._waiter.getElement());
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         * @param {Object=} options - possible options
         * @param {boolean=} options.noDOMInsert - won't add child to DOM
         * @param {number=} options.position - insert position
         * @param {string=} options.tag - context tag
         * @param {string=} options.mode - context mode : null|"replace"
         */
        addChildWidget: function(widget, options) {
          this._uiWidget = widget;
          $super.addChildWidget.call(this, widget, options);
        },
        setApplicationHash: function(applicationHash) {
          this._applicationHash = applicationHash;
        },
        showWaiter: function() {
          this._element.appendChild(this._waiter.getElement());
        },
        hideWaiter: function() {
          this._waiter.getElement().remove();
        },
        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        getMessageWidget: function() {
          return this._messageWidget;
        },

        setProcessing: function(isProcessing) {
          if (isProcessing) {
            this.getElement().setAttribute("processing", "processing");
          } else {
            this.getElement().removeAttribute("processing");
          }
          this._sidebarWidget.setProcessing(isProcessing);
        },
        activate: function() {
          this.emit(context.constants.widgetEvents.activate);
          if (this._uiWidget) {
            this._uiWidget.emit(context.constants.widgetEvents.activate);
          }
        },
        onActivate: function(hook) {
          this._handlers.push(this.when(context.constants.widgetEvents.activate, hook));
          return this._handlers[this._handlers.length - 1];
        },
        disable: function() {
          this.emit(context.constants.widgetEvents.disable);
          if (this._uiWidget) {
            this._uiWidget.emit(context.constants.widgetEvents.disable);
          }
        },
        layoutRequest: function() {
          this.emit(context.constants.widgetEvents.layoutRequest);
        },
        onLayoutRequest: function(hook) {
          this._handlers.push(this.when(context.constants.widgetEvents.layoutRequest, hook));
          return this._handlers[this._handlers.length - 1];
        },

        hasWebComponent: function() {
          return this._hasWebcomp; // Tell window that it has a webcomp
        },

        setHasWebComponent: function(has) {
          this._hasWebcomp = has;
        },

        /**
         * Sets the focus to the widget
         */
        setFocus: function() {
          $super.setFocus.call(this);
          this.getElement().domFocus();
        },

      };
    });
    cls.WidgetFactory.register('Application', cls.ApplicationWidget);
  });
