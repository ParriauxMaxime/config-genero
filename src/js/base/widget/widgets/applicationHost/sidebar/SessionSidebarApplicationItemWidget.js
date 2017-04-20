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

modulum('SessionSidebarApplicationItemWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.SessionSidebarApplicationItemWidget
     * @extends classes.WidgetGroupBase
     */
    cls.SessionSidebarApplicationItemWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.SessionSidebarApplicationItemWidget.prototype */
      return {
        __name: "SessionSidebarApplicationItemWidget",
        _applicationName: null,
        _applicationIconImage: null,
        /**
         * @type {classes.ApplicationWidget}
         */
        _applicationWidget: null,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._applicationName = this._element.getElementsByClassName("applicationName")[0];
          this._element.on("click.SessionSidebarApplicationItemWidget", this._onClick.bind(this));
          /*this._element.getElementsByClassName("close")[0].on("click.SessionSidebarApplicationItemWidget", function() {
            this.emit(context.constants.widgetEvents.close);
          }.bind(this));*/
        },
        _onClick: function(event) {
          this._applicationWidget.getParentWidget().setCurrentWidget(this._applicationWidget);
          this._children[0]._windowWidget.getUserInterfaceWidget()._syncCurrentWindow();
          this.closeSidebar();
          event.preventDefault();
        },
        destroy: function() {
          this._element.off("click.SessionSidebarApplicationItemWidget");
          this._applicationWidget = null;
          if (this._applicationIconImage) {
            this._applicationIconImage.destroy();
            this._applicationIconImage = null;
          }
          $super.destroy.call(this);
        },
        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _addChildWidgetToDom: function(widget) {
          var itemHost = document.createElement('li');
          itemHost.addClass('mt-action');
          widget.getLayoutInformation().setHost(itemHost);
          this._containerElement.appendChild(itemHost);
          itemHost.appendChild(widget._element);
        },

        /**
         *
         * @param {classes.WidgetBase} widget
         */
        _removeChildWidgetFromDom: function(widget) {
          var info = widget.getLayoutInformation(),
            host = info && info.getHost();
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },
        setApplicationName: function(text) {
          this._applicationName.textContent = text;
          this._applicationName.setAttribute("title", text);
        },
        getApplicationName: function() {
          return this._applicationName.textContent;
        },
        setApplicationWidget: function(widget) {
          this._applicationWidget = widget;
        },
        setApplicationIcon: function(image) {
          if (!this._applicationIconImage) {
            this._applicationIconImage = cls.WidgetFactory.create("Image");
            this._element.getElementsByClassName("applicationIcon")[0].prependChild(this._applicationIconImage.getElement());
          }
          this._applicationIconImage.setHidden(true);
          if (image && image !== "") {
            this._applicationIconImage.setSrc(image);
            this._applicationIconImage.setHidden(false);
          }
        },
        onClose: function(hook) {
          this.when(context.constants.widgetEvents.close, hook);
        },
        closeSidebar: function() {
          this.getParentWidget().getParentWidget().getParentWidget()._hideSidebar();
        },
        unfreeze: function() {
          this.getContainerElement().removeClass("noAction");
        },
        freeze: function() {
          this.getContainerElement().addClass("noAction");
        },
        setProcessing: function(isProcessing) {
          if (isProcessing) {
            this.getElement().setAttribute("processing", "processing");
          } else {
            this.getElement().removeAttribute("processing");
          }
        }
      };
    });
    cls.WidgetFactory.register('SessionSidebarApplicationItem', cls.SessionSidebarApplicationItemWidget);
  });
