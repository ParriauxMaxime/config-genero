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

modulum('WidgetBase', ['EventListener'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    var SPACES_RE = /\s+/;

    /**
     * Base class for widgets.
     * @class classes.WidgetBase
     * @extends classes.EventListener
     */
    cls.WidgetBase = context.oo.Class({
      base: cls.EventListener
    }, function($super) {

      var __charMeasurer = document.createElement('char-measurer');
      __charMeasurer.className = "g_layout_charMeasurer";
      var __charMeasurer1 = document.createElement('char-measurer-item');
      __charMeasurer1.className = "g_layout_charMeasurer1";
      __charMeasurer1.textContent = "MMMMMMMMMM\nM\nM\nM\nM\nM\nM\nM\nM\nM";
      var __charMeasurer2 = document.createElement('char-measurer-item');
      __charMeasurer2.className = "g_layout_charMeasurer2";
      __charMeasurer2.textContent = "0000000000";
      __charMeasurer.appendChild(__charMeasurer1);
      __charMeasurer.appendChild(__charMeasurer2);

      /** @lends classes.WidgetBase.prototype */
      return {
        /** @lends classes.WidgetBase */
        $static: {
          /** @lends Generic click events handler */
          _onClick: function(event) {
            this.emit(context.constants.widgetEvents.click, event);
          },
          _onRightClick: function(event) {
            this.emit(context.constants.widgetEvents.rightClick, event);
          },
          _onRequestFocus: function(event) {
            this.emit(context.constants.widgetEvents.requestFocus, event);
          },
          /** @lends Generic keyup events handler */
          _onKeyUp: function(event) {
            this.emit(context.constants.widgetEvents.change, event, true);
          },
          /** @lends Generic focus events handler */
          _onFocus: function(event) {
            this.emit(context.constants.widgetEvents.focus, event);
          },
          /**
           * Need to listen mouseup event on body to be able to focus an input field if selection ends outside of the field.
           * If selection ends inside the field, click event will be raised
           * @param {Element} source input field
           * @protected
           */
          _onSelect: function() {
            this._ignore = true;
            document.body.on('mouseup.DetectTextSelection', function(event) {
              document.body.off('mouseup.DetectTextSelection');
              this._element.off('mouseleave.DetectTextSelection');
              this._ignore = false;
            }.bind(this));
            this._element.on('mouseleave.DetectTextSelection', function(event) {
              document.body.off('mouseup.DetectTextSelection');
              this._element.off('mouseleave.DetectTextSelection');
              this.emit(context.constants.widgetEvents.requestFocus, event);
            }.bind(this));
          },
          selfDataContent: {}
        },
        __name: "WidgetBase",
        __templateName: null,
        __charMeasurer: null,
        __dataContentPlaceholderSelector: null,
        /**
         * Current widget's unique ID
         * @type {?string}
         */
        _uuid: null,
        _wuuid: null,
        _auiTag: null,
        /**
         * @protected
         * @type {Element}
         */
        _element: null,

        /**
         * @protected
         * @type {Element}
         */
        _inputElement: null,
        /**
         * @protected
         * @type {classes.WidgetBase}
         */
        _parentWidget: null,

        /**
         * Current instance stylesheet
         * @type {Object}
         */
        _stylesheet: null,
        /**
         * @protected
         * @type {classes.LayoutEngineBase}
         */
        _layoutEngine: null,
        /**
         * @protected
         * @type {classes.LayoutInformation}
         */
        _layoutInformation: null,
        /**
         * @protected
         * @type {classes.WidgetBase}
         */
        _uiWidget: null,
        _windowWidget: null,
        _formWidget: null,

        _i18NList: null,

        _enabled: true,
        _noBorder: false,
        _hidden: false,
        /**
         * If alwaysSend, any action will send an event to VM without without checking if the value has changed.
         * By default it's false
         * @protected
         * @type {Boolean}
         */
        _alwaysSend: false,
        _startKey: null,
        _endKey: null,

        _inTable: false,
        _inFirstTableRow: false,
        _ignoreLayout: false,

        // arabic mode
        _isReversed: false,

        _applicationStyles: null,
        /**
         * flag updated by gbcReadOnly during typeahead
         */
        _keyEventsBound: false,

        /**
         * @constructs {classes.WidgetBase}
         */
        constructor: function(opts) {
          opts = (opts || {});
          this._appHash = opts.appHash;
          this._auiTag = opts.auiTag;
          this._inTable = (opts.inTable === true);
          this._inFirstTableRow = (opts.inFirstTableRow === true);
          this._ignoreLayout = (this._inTable && !this._inFirstTableRow);

          $super.constructor.call(this, opts);
          this._uuid = context.InitService.uniqueId();
          this._wuuid = "w_" + this._uuid;
          this._initElement();
          this._afterInitElement();
          this._initLayout();
          this._initTranslation();
          if (this._auiTag) {
            this._element.addClass("aui__" + this._auiTag);
          }
          context.WidgetService._emit(context.WidgetService.widgetCreatedEvent, this);
        },

        destroy: function() {
          //this.unbindKeyEvents();
          this._keyEventsBound = false;
          context.WidgetService._emit(context.WidgetService.widgetDestroyEvent, this);
          if (this._layoutEngine) {
            this._layoutEngine.destroy();
            this._layoutEngine = null;
          }
          if (this._parentWidget && this._parentWidget.removeChildWidget) {
            this._parentWidget.removeChildWidget(this);
          }
          if (this._layoutInformation) {
            this._layoutInformation.destroy();
            this._layoutInformation = null;
          }
          document.body.off('mouseup.DetectTextSelection');
          if (this._element) {
            this._element.off('click.WidgetBase');
            this._element.off('contextmenu.WidgetBase');
            this._element.remove();
          }
          this._element = null;
          $super.destroy.call(this);
        },
        _afterInitElement: function() {

        },
        /**
         * @protected
         */
        _initLayout: function() {
          this._layoutInformation = new cls.LayoutInformation(this);
          this._layoutEngine = new cls.NoLayoutEngine(this);
        },
        /**
         *
         * @returns {classes.LayoutInformation}
         */
        getLayoutInformation: function() {
          return this._layoutInformation;
        },
        /**
         *
         * @returns {classes.LayoutEngineBase}
         */
        getLayoutEngine: function() {
          return this._layoutEngine;
        },

        /**
         * Setups the DOM element
         * @private
         */
        _initElement: function() {
          this._element = context.TemplateService.renderDOM(this.__templateName || this.__name, this.__ascendance);
          var id = this._getRootClassName();
          this._element.id = id;
          this._element.className += ["", this.__ascendanceClasses, id, "g_measureable"].join(
            " ");
          if (!this._ignoreLayout) {
            this._initCharMeasurer();
          }
          this._element.on('click.WidgetBase', this._onClickForMousePosition.bind(this));
          this._element.on('contextmenu.WidgetBase', cls.WidgetBase._onFocus.bind(this));
          //this.gbcReadonly(true); //initial state should be readonly
        },
        _initCharMeasurer: function() {
          this.__charMeasurer = __charMeasurer.cloneNode(true);
          this.__charMeasurer1 = this.__charMeasurer.children[0];
          this.__charMeasurer2 = this.__charMeasurer.children[1];
          this._element.appendChild(this.__charMeasurer);
        },
        _onClickForMousePosition: function(event) {
          var rect = null;
          if ((!event.clientX || event.clientX < 0) && (!event.clientY || event.clientY < 0)) {
            rect = event.target.getBoundingClientRect();
            context.WidgetService.cursorX = rect.left;
            context.WidgetService.cursorY = rect.top;
          } else {
            context.WidgetService.cursorX = event.clientX;
            context.WidgetService.cursorY = event.clientY;
          }
        },
        setFocusable: function(focusable) {
          this._element.setAttribute('tabindex', focusable ? 0 : null);
        },

        _initTranslation: function() {
          // Will ask the translation once ready
          this._i18NList = this._element.querySelectorAll("[data-i18n]");
          context.I18NService.translate(this);
        },

        translate: function() {
          var allSelectors = this._i18NList;
          for (var i = 0; i < allSelectors.length; i++) {
            allSelectors[i].innerHTML = i18next.t(allSelectors[i].getAttribute("data-i18n"));
          }
        },

        /**
         *
         * @returns {string}
         */
        getUniqueIdentifier: function() {
          return this._uuid;
        },
        /**
         * Get the root element of the widget
         * @returns {Element}
         */
        getElement: function() {
          return this._element;
        },

        getInputElement: function() {
          return this._inputElement;
        },

        getClassName: function() {
          return "gbc_" + this.__name;
        },

        getName: function() {
          return this.__name;
        },

        _getAuiTagClass: function() {
          return ".aui__" + this._auiTag;
        },

        /**
         * @returns {string} the unique class name identifying a widget instance
         * @protected
         */
        _getRootClassName: function() {
          return this._wuuid;
        },

        /**
         * @param {string=} subSelector selector targeting an element below the widget's root node
         * @param appliesOnRoot {boolean=} true if the returned selector should match the root too.
         * @returns {string} the CSS selector corresponding to the requested DOM element
         * @protected
         */
        _getCssSelector: function(subSelector, appliesOnRoot, preSelector) {
          return (preSelector || "") + "#" + this._getRootClassName() +
            (appliesOnRoot ? "" : " ") +
            (subSelector || "");
        },
        /**
         * Get widget style property value
         * @param {String} [selector] additional sub selector
         * @param {String} property property name
         * @returns {*} property value if set, undefined otherwise
         */
        getStyle: function(selector, property) {
          if (!property) {
            property = selector;
            selector = null;
          }
          var cssSelector = this._getCssSelector(selector);
          return this._stylesheet && this._stylesheet[cssSelector] && this._stylesheet[cssSelector][property];
        },

        /**
         * Updates widget style with new rules
         * @param {String|{selector:String, appliesOnRoot:boolean=}} [selector] additional sub selector
         * @param {Object.<string, *>} style style properties to set
         */
        setStyle: function(selector, style) {
          if (!style) {
            style = selector;
            selector = null;
          }
          var subSelector = selector,
            preSelector = null,
            appliesOnRoot = null;
          if (!!selector && selector.selector) {
            subSelector = selector.selector;
            preSelector = selector.preSelector;
            appliesOnRoot = selector.appliesOnRoot;
          }
          var cssSelector = this._getCssSelector(subSelector, appliesOnRoot, preSelector);
          if (!this._stylesheet) {
            this._stylesheet = {};
          }
          var localStyle = this._stylesheet[cssSelector];
          if (!localStyle) {
            localStyle = this._stylesheet[cssSelector] = {};
          }
          var keys = Object.keys(style);
          for (var k = 0; k < keys.length; k++) {
            localStyle[keys[k]] = style[keys[k]];
          }
          styler.appendStyleSheet(this._stylesheet, this._getRootClassName());
        },

        setApplicationStyles: function(styles) {
          var i, oldClasses = this._applicationStyles,
            oldlen = oldClasses ? oldClasses.length : 0,
            newClasses = styles && styles.split(SPACES_RE),
            newlen = newClasses ? newClasses.length : 0;
          for (i = 0; i < oldlen; i++) {
            if (!newClasses || newClasses.indexOf(oldClasses[i]) < 0) {
              this.getElement().removeClass("gbc_style_" + oldClasses[i]);
            }
          }
          for (i = 0; i < newlen; i++) {
            if (!oldClasses || oldClasses.indexOf(newClasses[i]) < 0) {
              this.getElement().addClass("gbc_style_" + newClasses[i]);
            }
          }
          this._applicationStyles = newClasses;
        },

        /**
         * @param {classes.WidgetGroupBase} widget the widget ot use as parent
         */
        setParentWidget: function(widget) {
          this._parentWidget = widget;
          if (!!this._layoutEngine) {
            this._layoutEngine.invalidateMeasure();
          }
        },

        /**
         * @returns {classes.WidgetGroupBase} the parent widget
         */
        getParentWidget: function() {
          return this._parentWidget;
        },

        /**
         *
         * @returns {classes.WidgetBase} UserInterfaceWidget
         */
        getUserInterfaceWidget: function() {
          if (this._uiWidget === null) {
            var result = this;
            while (result && !(result instanceof gbc.classes.UserInterfaceWidget)) {
              result = result.getParentWidget();
            }
            this._uiWidget = result;
          }
          return this._uiWidget;
        },
        /**
         *
         * @returns {classes.WidgetBase} WindowWidget
         */
        getWindowWidget: function() {
          if (this._windowWidget === null) {
            var result = this;
            while (result && result.__name !== "WindowWidget") {
              result = result.getParentWidget();
            }
            this._windowWidget = result;
          }
          return this._windowWidget;
        },

        /**
         *
         * @returns {classes.WidgetBase} FormWidget
         */
        getFormWidget: function() {
          if (this._formWidget === null) {
            var result = this;
            while (result && result.__name !== "FormWidget") {
              result = result.getParentWidget();
            }
            this._formWidget = result;
          }
          return this._formWidget;
        },

        isChildOf: function(parent) {
          var result = this.getParentWidget();
          while (result && result !== parent) {
            result = result.getParentWidget();
          }
          return !!result;
        },
        replaceWith: function(widget) {
          if (this._parentWidget) {
            this._parentWidget.replaceChildWidget(this, widget);
          }
        },
        detach: function() {
          this._element.parentNode.removeChild(this._element);
        },
        /**
         * @param {boolean} enabled true if the widget allows user interaction, false otherwise.
         */
        setEnabled: function(enabled, force) {
          if (this._enabled !== enabled || force) {
            this._enabled = !!enabled;
            if (this._enabled) {
              this._element.removeClass("disabled");
            } else {
              this._element.addClass("disabled");
            }
          }
        },

        /**
         * @returns {boolean} true if the widget allows user interaction, false otherwise.
         */
        isEnabled: function() {
          return this._enabled;
        },

        /**
         * @param hidden {boolean} true if the widget is hidden, false otherwise
         */
        setHidden: function(hidden) {
          if (this._hidden !== hidden) {
            this._hidden = !!hidden;
            if (this._hidden) {
              this._element.addClass("hidden");
            } else {
              this._element.removeClass("hidden");
            }
            if (this._layoutEngine) {
              this._layoutEngine.changeHidden(hidden);
            }
            this.emit(context.constants.widgetEvents.visibilityChange);
          }
        },

        /**
         * @returns {boolean} true if the widget is hidden, false otherwise
         */
        isHidden: function() {
          return this._hidden;
        },

        isLayoutMeasureable: function(deep) {
          if (!deep) {
            return !this.isHidden();
          } else {
            if (this.isHidden()) {
              return false;
            } else {
              var parent = this;
              while (!!parent) {
                if (!parent.isLayoutMeasureable()) {
                  return false;
                }
                if (parent.isLayoutTerminator() && parent.isLayoutMeasureable()) {
                  return true;
                }
                parent = parent.getParentWidget();
              }
              return true;
            }
          }
        },
        isVisible: function() {
          return !this.isHidden();
        },

        isHiddenRecursively: function() {
          if (this.isHidden()) {
            return true;
          } else {
            var parent = this;
            while (!!parent) {
              if (parent.isHidden()) {
                return true;
              }
              parent = parent.getParentWidget();
            }
            return false;
          }
        },

        isVisibleRecursively: function() {
          return !this.isHiddenRecursively();
        },

        isLayoutTerminator: function() {
          return false;
        },

        /**
         * @param noBorder {boolean} true if the widget has no border class, false otherwise
         */
        setNoBorder: function(noBorder) {
          if (this._noBorder !== noBorder) {
            this._noBorder = !!noBorder;
            if (this._noBorder) {
              this._element.addClass("gbc_NoBorder");
            } else {
              this._element.removeClass("gbc_NoBorder");
            }
          }
        },

        /**
         * @returns {boolean} true if the widget has no border class, false otherwise
         */
        isNoBorder: function() {
          return this._noBorder;
        },
        /**
         * @param {string} title the tooltip text
         */
        setTitle: function(title) {
          if (title === "") {
            this._element.removeAttribute("title");
          } else {
            this._element.setAttribute("title", title);
          }
        },

        /**
         * @returns {string} the tooltip text
         */
        getTitle: function() {
          return this._element.getAttribute("title");
        },
        /**
         * Called by FocusService when widget obtains VM focus
         */
        setFocus: function() {
          var userInterfaceWidget = this.getUserInterfaceWidget();
          if (userInterfaceWidget) {
            userInterfaceWidget.setFocusedWidget(this);
          }
        },
        /**
         * Called before setFocus to notify previous focused widget
         */
        loseFocus: function() {},

        isReadOnly: function() {
          return false;
        },

        /**
         * When a formfield is inactive we must put it in readonly mode
         * @param readonly
         * @private
         */
        gbcReadonly: function(readonly) {
          // set input to readonly to make them not editable
          if (this._inputElement) {
            if (readonly) {
              this._inputElement.setAttribute("readonly", "readonly");
              if (window.browserInfo.isIE || window.browserInfo.isEdge) {
                this._inputElement.setAttribute("contentEditable", "false");
              }
            } else {
              this._inputElement.removeAttribute("readonly");
              if (window.browserInfo.isIE || window.browserInfo.isEdge) {
                // need to add this to be sure that user can enter text in the field
                // even if setCursorPosition is called before
                this._inputElement.setAttribute("contentEditable", "true");
              }
            }
          }

          // bind/unbind keys events
          if (readonly) {
            if (this._keyEventsBound) {
              this._keyEventsBound = false;
              this.unbindKeyEvents();
            }
          } else {
            if (!this._keyEventsBound) {
              this._keyEventsBound = true;
              this.bindKeyEvents();
            }
          }
        },

        bindKeyEvents: Function.noop,
        unbindKeyEvents: Function.noop,

        /**
         * true if widget node has VM focus
         * @returns {boolean}
         */
        hasFocus: function() {
          var ui = this.getUserInterfaceWidget();
          return ui && (this === ui.getFocusedWidget());
        },

        /**
         * Checks if tje element has the given class
         * @param className to check
         */
        hasClass: function(className) {
          return this._element.hasClass(className);
        },

        /**
         * Add the given class to element
         * @param className to add
         */
        addClass: function(className) {
          this._element.addClass(className);
        },

        /**
         * Remove the given class from element
         * @param className to delete
         */
        removeClass: function(className) {
          this._element.removeClass(className);
        },

        /**
         * @returns {DOMTokenList} the list of classes defined on this widget
         */
        getClassList: function() {
          return this._element.classList;
        },

        setQAInfo: function(name, value) {
          if (!!this._element) {
            var attributeName = "data-gqa-" + name;
            if (typeof(value) === "undefined" || value === "") {
              this._element.removeAttribute(attributeName);
            } else {
              this._element.setAttribute(attributeName, value);
            }
          }
        },

        /**
         * @returns {boolean} true if the widget is in a table, false otherwise.
         */
        isInTable: function() {
          return this._inTable;
        },

        /**
         * @returns {boolean} true if the widget ignore all layout.
         */
        ignoreLayout: function() {
          return this._ignoreLayout;
        },

        /* Arabic mode */

        setReverse: function(rtl) {
          if (this._isReversed !== rtl) {
            this._isReversed = rtl;
            if (rtl) {
              this.addClass("reverse");
            } else {
              this.removeClass("reverse");
            }
          }
        },

        isReversed: function() {
          return this._isReversed;
        },

        getStart: function() {
          return this.isReversed() ? "right" : "left";
        },

        getEnd: function() {
          return this.isReversed() ? "left" : "right";
        },
        _setDOMAttachedOrDetached: function() {

        },
        setInterruptable: function(interruptable) {
          if (this._element) {
            if (interruptable) {
              this._element.setAttribute("interruptable", "interruptable");
            } else {
              this._element.removeAttribute("interruptable");
            }
          }
        }
      };
    });
  });
