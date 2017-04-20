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

modulum('CompleterWidget', ['TextWidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.CompleterWidget
     * @extends classes.TextWidgetBase
     */
    cls.CompleterWidget = context.oo.Class(cls.TextWidgetBase, function($super) {
      /** @lends classes.CompleterWidget.prototype */
      return {
        __name: "CompleterWidget",
        _dropDown: null,
        _isVisible: null,
        _size: 0,
        _completerDelay: 50,
        _input: null,
        _enterHandler: null,
        _escHandler: null,
        stopPropagation: false,

        _initElement: function() {
          $super._initElement.call(this);

          this._dropDown = cls.WidgetFactory.create("ChoiceDropDown");
          this._dropDown.setParentWidget(this);

          this._enterHandler = this.when(context.constants.widgetEvents.enter, function(event, sender, domEvent) {
            // on enter, stop key event propagation to parent
            this.stopPropagation = true;
            this._dropDown.emit(context.constants.widgetEvents.enter, domEvent);
          }.bind(this));
          this._escHandler = this.when(context.constants.widgetEvents.esc, function(event, sender, domEvent) {
            this._dropDown.emit(context.constants.widgetEvents.esc, domEvent);
          }.bind(this));
        },
        destroy: function() {
          this._enterHandler();
          this._escHandler();
          this._dropDown.destroy();
          this._dropDown = null;
          $super.destroy.call(this);
        },
        /**
         * Will add a completer to the parent widget
         * @param {classes.WidgetBase} parentWidget to which is attached completer
         */
        addCompleterWidget: function(parentWidget) {
          this.setParentWidget(parentWidget);

          /* If widget is dirty, any action will send an event to VM without without checking if the value has changed.
           * Edit being attached to completer have to always send pressed key to VM even if it's same that current AUI.
           * This avoid special case where completer results could not be displayed because no AUI changes were detected.
           */
          parentWidget._alwaysSend = true;
          var parentElement = parentWidget.getElement();
          parentElement.parentNode.insertBefore(this.getElement(), parentElement.nextSibling);

          var input = parentWidget.getElement().getElementsByTagName("input")[0];
          cls.KeyboardHelper.bindKeyboardNavigation(input, this);
          var keyboardInstance = context.keyboard(input);
          keyboardInstance.bind(['left', 'right'], function(evt) {
            this.stopPropagation = true; // stop propagation of keyup event for parent
          }.bind(this));
          keyboardInstance.bind(['esc'], function(evt) {
            this.stopPropagation = true; // stop propagation of keyup event for parent
            this.emit(context.constants.widgetEvents.esc, evt);
          }.bind(this));
          keyboardInstance.bind(['tab'], function() {
            this.stopPropagation = true; // stop propagation of keyup event for parent
            this.show(false);
          }.bind(this));
          keyboardInstance.bind(['shift+tab'], function() {
            this.stopPropagation = true; // stop propagation of keyup event for parent
            this.show(false);
          }.bind(this));

        },

        onCurrentChildrenChange: function(fn) {
          this._dropDown.onCurrentChildrenChange(function(evt, parent, children) {
            fn(children.getValue());
          });
        },

        navigateTo: function(jump, up, event) {
          this.stopPropagation = true; // stop propagation of keyup event for parent
          if (this._dropDown.isVisible()) {
            this._dropDown.jumpTo(jump, up);
          }
        },

        isReversed: function() {
          return this._parentWidget.isReversed();
        },

        isVisible: function() {
          return this._dropDown.isVisible();
        },

        addChoice: function(choice) {
          var label = cls.WidgetFactory.create("Label");
          label.setValue(choice);
          this._dropDown.addChildWidget(label, function() {
            this.getParentWidget().setValue(this.getValue());
            this.getParentWidget().setFocus();
          }.bind(this));
        },

        clearChoices: function() {
          this._dropDown.empty();
        },

        setSize: function(size) {
          this._size = size;
        },

        getSize: function() {
          return this._size;
        },

        getValue: function() {
          return this.getParentWidget().getValue();
        },

        setValue: function(value) {
          this.getParentWidget().setValue(value, true);
        },

        hasFocus: function() {
          var parent = this.getParentWidget();
          return parent.hasFocus() || parent.getParentWidget().hasFocus();
        },

        show: function(visibility) {
          window.setTimeout(this._show.bind(this, visibility), this._completerDelay);
        },

        _show: function(visibility) {
          if (visibility === true) {
            if (!this.hasFocus()) {
              return;
            }
            var element = this.getParentWidget().getElement();
            if (element) {
              this._dropDown.x = element.getBoundingClientRect().left;
              this._dropDown.width = element.getBoundingClientRect().width;
            }
          }
          if (this._dropDown) {
            this._dropDown.show(visibility, true);
          }
        }

      };
    });
    cls.WidgetFactory.register('Completer', cls.CompleterWidget);
  });
