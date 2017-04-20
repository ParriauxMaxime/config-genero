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

modulum('ApplicationHostMenuUploadsWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.ApplicationHostMenuUploadsWidget
     * @extends classes.WidgetBase
     */
    cls.ApplicationHostMenuUploadsWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.ApplicationHostMenuUploadsWidget.prototype */
      return {
        __name: "ApplicationHostMenuUploadsWidget",
        _count: 0,
        _initElement: function() {
          this._ignoreLayout = true;
          $super._initElement.call(this);
          this._element.querySelector('a').title = i18next.t("gwc.file.upload.processing");
        },
        _initLayout: function() {
          // no layout
        },

        setIdle: function() {
          this._count--;
          if (!this._count) {
            this.removeClass("processing");
          }
        },
        setProcessing: function() {
          this._count++;
          this.addClass("processing");
        }
      };
    });
    cls.WidgetFactory.register('ApplicationHostUploadsMenu', cls.ApplicationHostMenuUploadsWidget);
  });
