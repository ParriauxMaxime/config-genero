/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2016, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

modulum('FilePickerWidget', ['ModalWidget', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * @class classes.FilePickerWidget
     * @extends classes.ModalWidget
     */
    cls.FilePickerWidget = context.oo.Class(cls.ModalWidget, function($super) {
      /** @lends classes.FilePickerWidget.prototype */
      return {
        __name: "FilePickerWidget",
        __templateName: "ModalWidget",
        $static: {
          fileSelectionChangedEvent: "fileSelectionChanged"
        },

        _headerTitleDom: null,
        /**
         * @type {classes.FileInputWidget}
         */
        _fileInput: null,

        _initContainerElement: function() {
          $super._initContainerElement.call(this);
          this._element.addClass("gbc_ModalWidget").addClass("mt-dialog-filetransfer");
          var dialogContents = document.createElement("div");

          this._headerTitleDom = document.createElement('span');
          this._headerTitleDom.innerHTML = '<i class="zmdi zmdi-upload"></i> <span>' + i18next.t("gwc.file.upload.select") +
            '<span>';
          this.setHeader(this._headerTitleDom);

          this.setClosable(false);
          this.setContent(dialogContents);

          this._fileInput = cls.WidgetFactory.create("FileInput");
          dialogContents.appendChild(this._fileInput.getElement());
          this._fileInput.setParentWidget(this);
          this._fileInput.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this));
          this.when(context.constants.widgetEvents.modalOut, function() {
            this.hide(false);
          }.bind(this));
        },
        destroy: function() {
          $super.destroy.call(this);
        },

        hide: function(gotFile) {
          var wasDisplayed = this.isVisible();
          $super.hide.call(this);
          if (wasDisplayed && !gotFile) {
            this.emit(cls.FilePickerWidget.fileSelectionChangedEvent, this._fileInput && this._fileInput._allowMultipleFiles ? [] :
              null);
          }
        },
        setExtension: function(extension) {
          this._fileInput.setExtension(extension);
        },
        setCaption: function(caption) {
          this._headerTitleDom.querySelector("span").textContent = caption || i18next.t("gwc.file.upload.select");
        },
        allowMultipleFiles: function(allow) {
          this._fileInput.allowMultipleFiles(allow);
        },
        _whenFileSelectionChanged: function(event, src, data) {
          this.emit(cls.FilePickerWidget.fileSelectionChangedEvent, data);
          this.hide(true);
        },

        whenFileSelectionChanged: function(hook) {
          return this.when(cls.FileInputWidget.fileSelectionChangedEvent, hook);
        },

        send: function(filename, url, callback, errorCallback) {
          this._fileInput.send(filename, url, callback, errorCallback);
        }
      };
    });
    cls.WidgetFactory.register('FilePicker', cls.FilePickerWidget);
  });
