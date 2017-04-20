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

modulum('ApplicationInformationWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationInformationWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationInformationWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationInformationWidget.prototype */
      return {
        __name: "ApplicationInformationWidget",
        /**
         * @type Element
         */
        _currentUARElement: null,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._currentUARElement = this._element.getElementsByClassName("applicationUAR")[0];
          this._currentUARElement.on('click.ApplicationInformationWidget', this._onClick.bind(this));
        },
        _initLayout: function() {
          // no layout
        },
        destroy: function() {
          this._currentUARElement.off('click.ApplicationInformationWidget');
        },
        _onClick: function() {
          this._currentUARElement.selectText();
        },
        getCurrentUAR: function() {
          return this._currentUARElement.value;
        },
        setCurrentUAR: function(uar) {
          this._currentUARElement.value = uar;
        }
      };
    });
    cls.WidgetFactory.register('ApplicationInformation', cls.ApplicationInformationWidget);
  });
