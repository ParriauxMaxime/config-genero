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

modulum('SessionWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.SessionWidget
     * @extends classes.WidgetGroupBase
     */
    cls.SessionWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.SessionWidget.prototype */
      return {
        __name: "SessionWidget",
        _waiter: null,
        _sidebarWidget: null,
        _endWidget: null,
        _waitingEndWidget: null,
        __zIndex: 0,
        _currentWidget: null,
        _currentWidgetStack: null,
        constructor: function() {
          this._currentWidgetStack = [];
          $super.constructor.call(this);
        },
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._endWidget = cls.WidgetFactory.create('SessionEnd');
          this._endWidget.setHidden(true);
          this._element.appendChild(this._endWidget.getElement());
          this._waitingEndWidget = cls.WidgetFactory.create('SessionWaitingEnd');
          this._waitingEndWidget.setHidden(true);
          this._element.appendChild(this._waitingEndWidget.getElement());
        },

        _initLayout: function() {
          // no layout
        },

        addChildWidget: function(widget, options) {
          options = options || {};
          options.noDOMInsert = true;
          $super.addChildWidget.call(this, widget, options);
          if (widget instanceof cls.ApplicationWidget) {
            this.getSidebarWidget().addChildWidget(widget.getSidebarWidget());
          }
        },

        _getNextApplication: function(previousWidget) {
          var nextApp = null;
          if (this._currentWidgetStack.length) {
            nextApp = this._currentWidgetStack[this._currentWidgetStack.length - 1];
            if (nextApp === previousWidget && this._currentWidgetStack.length > 1) {
              nextApp = this._currentWidgetStack[this._currentWidgetStack.length - 2];
            }
          }
          return nextApp;
        },

        removeChildWidget: function(widget) {
          var displayedWidget = null;
          if (widget instanceof cls.ApplicationWidget) {
            displayedWidget = this._getNextApplication(widget);
            if (displayedWidget) {
              this.setCurrentWidget(displayedWidget);
            }

            this._currentWidgetStack.remove(widget);

            var sidebar = widget.getSidebarWidget();
            if (sidebar) {
              this.getSidebarWidget().removeChildWidget(sidebar);
            }
          }
          if (!displayedWidget) {
            $super.removeChildWidget.call(this, widget);
          }
        },

        /**
         *
         * @param {classes.ApplicationWidget} widget
         */
        setCurrentWidget: function(widget) {
          if (this._currentWidget !== widget) {
            if (widget) {
              var isBuffering = context.styler.isBuffering();
              if (!isBuffering) {
                context.styler.bufferize();
              }
              var previousWidget = this.getCurrentWidget();

              // Magical stuff to keep webcomponent in dom to preserve context
              if ((previousWidget && previousWidget.hasWebComponent()) || (widget && widget.hasWebComponent())) {
                if (previousWidget && previousWidget.hasWebComponent()) {
                  previousWidget.addClass("gbc_out_of_view");

                  if (widget && !widget.hasWebComponent() && this.getContainerElement()) {
                    this.getContainerElement().appendChild(widget.getElement());
                  }
                }
                if (widget && widget.hasWebComponent()) {
                  if (previousWidget && !previousWidget.hasWebComponent() && this.getContainerElement()) {
                    this.getContainerElement().removeChild(previousWidget.getElement());
                  }
                  widget.removeClass("gbc_out_of_view");
                }
              } else if (previousWidget) {
                previousWidget.disable();
                if (this.getContainerElement()) {
                  this.getContainerElement().replaceChild(widget.getElement(), previousWidget.getElement());
                }
              } else {
                if (this.getContainerElement()) {
                  this.getContainerElement().appendChild(widget.getElement());
                }
              }

              if (!this._currentWidgetStack.contains(widget)) {
                this._currentWidgetStack.push(widget);
              }
              widget.activate();
              if (!isBuffering) {
                context.styler.flush();
              }
            }
            this._currentWidget = widget;
          }
        },
        getCurrentWidget: function() {
          return this._currentWidget;
        },
        getSidebarWidget: function() {
          return this._sidebarWidget;
        },
        setSidebarWidget: function(widget) {
          this._sidebarWidget = widget;
        },
        showWaitingEnd: function() {
          this._waitingEndWidget.setHidden(false);
        },
        showEnd: function() {
          this._waitingEndWidget.setHidden(true);
          this._endWidget.setHidden(false);
        },
        getEndWidget: function() {
          return this._endWidget;
        },
        getWaitingEndWidget: function() {
          return this._waitingEndWidget;
        }
      };
    });
    cls.WidgetFactory.register('Session', cls.SessionWidget);
  });
