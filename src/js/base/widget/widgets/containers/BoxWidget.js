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

modulum('BoxWidget', ['WidgetGroupBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.BoxWidget
     * @extends classes.WidgetGroupBase
     */
    cls.BoxWidget = context.oo.Class(cls.WidgetGroupBase, function($super) {
      /** @lends classes.BoxWidget.prototype */
      return {
        __name: "BoxWidget",
        _canSplit: null,
        _splitters: null,
        _splitterIdentifier: null,
        _ignoreStoredSettings: false,

        /**
         * @constructs {classes.WidgetGroupBase}
         */
        constructor: function() {
          this._splitters = [];
          $super.constructor.call(this);
        },
        destroy: function() {
          if (this._splitters) {
            for (var i = this._splitters.length - 1; i > -1; i--) {
              var currentChildren = this._splitters[i].widget;
              currentChildren.destroy();
              currentChildren = null;
            }
            this._splitters.length = 0;
          }
          $super.destroy.call(this);
        },
        addChildWidget: function(widget, options) {
          if (!(widget instanceof cls.SplitterWidget)) {
            options = options || {
              position: ((this._children.length || -1) + 1) / 2
            };
            if (Object.isNumber(options.position)) {
              options.position = options.position * 2;
            }
            if (!!options.position) {
              var splitter = this._createSplitter();
              splitter.activateSplitter(this._canSplit);
              var onSplit = splitter.when(context.constants.widgetEvents.splitter, this._onSplit.bind(this));
              var onSplitStart = splitter.when(context.constants.widgetEvents.splitterStart, this._onSplitStart.bind(this));
              var onSplitEnd = splitter.when(context.constants.widgetEvents.splitterEnd, this._onSplitEnd.bind(this));
              this.addChildWidget(splitter, {
                position: options.position - 1
              });
              this._splitters.splice(options.position / 2, 0, {
                widget: splitter,
                onSplit: onSplit,
                onSplitStart: onSplitStart,
                onSplitEnd: onSplitEnd
              });
            }
          }
          $super.addChildWidget.call(this, widget, options);
        },

        _createSplitter: function() {
          return null;
        },

        _onSplit: function(event, sender, delta) {
          this._layoutEngine.splitting(delta);
          this.emit(context.constants.widgetEvents.splitter);
        },

        _onSplitStart: function(event, sender) {
          this._layoutEngine.startSplitting((this._children.indexOf(sender) - 1) / 2);
        },

        _onSplitEnd: function(event, sender) {
          this._layoutEngine.stopSplitting();
          if (!this._ignoreStoredSettings) {
            context.StoredSettingsService.setSplitter(this._splitterIdentifier.formName,
              this._splitterIdentifier.id, this._layoutEngine._referenceSplitHints);
          }
        },

        removeChildWidget: function(widget) {
          if (!(widget instanceof cls.SplitterWidget)) {
            var pos = this._children.indexOf(widget) - 1;
            if (pos > 0) {
              this._children[pos].destroy();
            }
          } else {
            var item = this._splitters.find(function(item) {
              return item.widget === widget;
            });
            if (item) {
              item.onSplit();
              item.onSplitStart();
              item.onSplitEnd();
              this._splitters.remove(item);
            }
          }
          $super.removeChildWidget.call(this, widget);
        },

        _addChildWidgetToDom: function(widget, position) {
          this.getLayoutEngine().registerChild(widget, position);
          var widgetHost = document.createElement('div');
          widgetHost.addClass('g_BoxElement');
          widget.getLayoutInformation().setHost(widgetHost);
          widgetHost.appendChild(widget._element);
          widgetHost.insertAt(position, this._containerElement);
        },
        _removeChildWidgetFromDom: function(widget) {
          this.getLayoutEngine().unregisterChild(widget);
          var info = widget.getLayoutInformation(),
            host = info && info.getHost();
          if (host && host.parentNode === this._containerElement) {
            widget._element.remove();
            host.remove();
            host = null;
          }
        },
        getIndexOfChild: function(widget) {
          if (!(widget instanceof cls.SplitterWidget)) {
            return this._children.indexOf(widget) / 2;
          } else {
            return this._children.indexOf(widget);
          }
        },
        ignoreStoredSettings: function(ignore) {
          this._ignoreStoredSettings = !!ignore;
        },
        switchSplitters: function(canSplit, splitterId) {
          if (this._canSplit !== canSplit) {
            this._splitterIdentifier = splitterId;
            if (!this._ignoreStoredSettings) {
              this._layoutEngine.initSplitHints(context.StoredSettingsService.getSplitter(
                this._splitterIdentifier.formName, this._splitterIdentifier.id));
            }
            this._canSplit = canSplit;
            for (var i = 0; i < this._splitters.length; i++) {
              this._splitters[i].widget.activateSplitter(this._canSplit);
            }
          }
        }
      };
    });
    cls.WidgetFactory.register('Box', cls.BoxWidget);
  });
