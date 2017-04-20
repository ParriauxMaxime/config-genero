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

modulum('ChoiceDropDownWidget', ['DropDownWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Choice DropDown widget.
     * @class classes.ChoiceDropDownWidget
     * @extends classes.DropDownWidget
     */
    cls.ChoiceDropDownWidget = context.oo.Class(cls.DropDownWidget, function($super) {
      /** @lends classes.ChoiceDropDownWidget.prototype */
      return {
        $static: {
          widgetEvents: {
            currentChildrenChange: "currentChildrenChange",
            close: "dropDownClose",
          }
        },
        __name: "ChoiceDropDownWidget",
        __templateName: "DropDownWidget",
        autoSize: true,
        alignToLeft: true,
        _enterHandler: null,
        _escHandler: null,
        _multipleChoices: false,

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._enterHandler = this.when(context.constants.widgetEvents.enter, function(event, sender, domEvent) {
            if (this.isVisible()) {
              var currentChildren = this.getCurrentChildren();
              this._onClick.call(this, event, currentChildren, domEvent);
            }
          }.bind(this));
          this._escHandler = this.when(context.constants.widgetEvents.esc, function(event, sender, domEvent) {
            if (this.isVisible()) {
              domEvent.stopPropagation();
              this.show(false);
            }
          }.bind(this));
        },

        destroy: function() {
          this._enterHandler();
          this._escHandler();
          $super.destroy.call(this);
        },

        /**
         * Manage keyboard navigation over dropdown children.
         * Scroll to widget located at corresponding position
         * @param {Number} jump position requested over current position
         * @param {Boolean} up if true, indicates navigation is going to previous items, otherwise to next items
         * @private
         */
        jumpTo: function(jump, up) {
          if (this.isVisible()) {
            var pos = 0;
            var childsLength = this.getChildren().length;
            if (up === false && jump === 0) {
              jump = childsLength;
            }
            if (jump !== 0 && jump !== childsLength - 1) {
              pos = this.getIndexOfChild(this.getCurrentChildren()) + jump;
              if (pos < 0) {
                pos = 0;
              } else if (pos >= childsLength - 1) {
                pos = childsLength - 1;
              }
            } else {
              pos = jump;
            }
            this.setCurrentChildren(pos, up);
          }
        },

        navigateTo: function(pos) {
          if (this.isVisible()) {
            var up = this.getIndexOfChild(this.getCurrentChildren()) > pos;
            this.setCurrentChildren(pos, up);
          }
        },

        setCurrentChildren: function(pos, up) {
          var current = $super.setCurrentChildren.call(this, pos);
          if (current !== null) {
            this.scrollChildrenIntoView(current, up);
            this.getParentWidget().emit(cls.ChoiceDropDownWidget.widgetEvents.currentChildrenChange, current);

          }
        },

        /**
         *  Returns position of value in dropdown choices list
         * @param {*} value
         * @returns {number}
         */
        getValueIndex: function(value) {
          var children = this.getChildren();
          for (var i = 0; i < children.length; i++) {
            if (children[i].getValue() === value) {
              return i;
            }
          }
          return -1;
        },

        onCurrentChildrenChange: function(fn) {
          return this.getParentWidget().when(cls.ChoiceDropDownWidget.widgetEvents.currentChildrenChange, fn);
        },

        /**
         * On click handler raised when selecting an item in the dropdown :
         * Parent widget get value of clicked item and dropdown is closed.
         * @param event
         * @param sender
         * @param domEvent
         * @private
         */
        _onClick: function(event, sender, domEvent) {
          if (sender && sender.getValue) {
            var value = sender.getValue();
            if (this.getParentWidget()._setMultiValue) {
              this.getParentWidget()._setMultiValue(value);
            } else if (this.getParentWidget().setValue) {
              this.getParentWidget().setValue(value);
              //this.getParentWidget().emit(context.constants.widgetEvents.change, event, false);
            }
          }
          domEvent.stopPropagation();
          if (!this._multipleChoices) {
            this.show(false);
          }

          this.getParentWidget().emit(context.constants.widgetEvents.focus, event);
          if (sender && sender.ddOnClickCallback) {
            sender.ddOnClickCallback();
          }
        },

        /**
         * Add widget as child and bind onclick event on it
         * @param {Widget} widget
         * @param {Function} clickCallback
         * @param {*} options
         */
        addChildWidget: function(widget, clickCallback, options) {
          $super.addChildWidget.call(this, widget, options);
          widget.ddOnClickCallback = clickCallback;
          widget.when(context.constants.widgetEvents.click, function(event, sender, domEvent) {
            this._onClick.call(this, event, widget, domEvent);
          }.bind(this));
        },

        /**
         * To call when an external widget wants to show/hide its dropdown.
         * @param {Boolean} visible
         * @param {Boolean} userClick indicates if request is made by user or not. If not, dropdown won't be displayed.
         * @returns {Boolean} forceDisplay true if dropdown as been displayed.
         */
        show: function(visible, userClick, forceDisplay) {
          var isDisplayed = $super.show.call(this, visible, userClick, forceDisplay);
          if (isDisplayed === true) {
            if (this.getParentWidget().getValue) {
              var defaultValue = this.getParentWidget().getValue();
              this.setCurrentChildren(this.getValueIndex(defaultValue));
            }
          }
          return isDisplayed;
        },

        allowMultipleChoices: function(allow) {
          this._multipleChoices = allow;
        }
      };
    });
    cls.WidgetFactory.register('ChoiceDropDown', cls.ChoiceDropDownWidget);
  });
