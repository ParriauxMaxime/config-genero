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

modulum('FileInputWidget', ['WidgetBase', 'WidgetFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {

    /**
     * Upload widget.
     * @class classes.FileInputWidget
     * @extends classes.WidgetBase
     */
    cls.FileInputWidget = context.oo.Class(cls.WidgetBase, function($super) {
      /** @lends classes.FileInputWidget.prototype */
      return {
        __name: "FileInputWidget",
        /** @lends classes.FileInputWidget */
        $static: {
          statusChangedEvent: "statusChanged",
          fileSelectionChangedEvent: "fileSelectionChanged",
          progressChangedEvent: "progressChanged"
        },
        _allowMultipleFiles: false,
        _files: null,
        /**
         * @type {Element}
         */
        _hiddenInput: null,
        _initElement: function() {
          $super._initElement.call(this);
          this._hiddenInput = this._element.querySelector("input");
          this._element.on("click.FileInputWidget", this._onClick.bind(this));
          this._element.on("drop.FileInputWidget", this._onDrop.bind(this));
          this._element.on("dragenter.FileInputWidget", this._onDragEnter.bind(this));
          this._element.on("dragleave.FileInputWidget", this._onDragLeave.bind(this));
          this._element.on("dragover.FileInputWidget", this._onDragOver.bind(this));
          this._element.on("mouseover.FileInputWidget", this._onMouseOver.bind(this));
          this._element.on("mouseout.FileInputWidget", this._onMouseOut.bind(this));
          this._hiddenInput.on("change.FileInputWidget", this._onFileChanged.bind(this));
          this.setCaption();
        },
        destroy: function() {
          this._hiddenInput = null;
          this._element.off("click.FileInputWidget");
          this._element.off("drop.FileInputWidget");
          this._element.off("dragenter.FileInputWidget");
          this._element.off("dragleave.FileInputWidget");
          this._element.off("dragover.FileInputWidget");
          this._element.off("mouseover.FileInputWidget");
          this._element.off("mouseout.FileInputWidget");
          $super.destroy.call(this);
        },
        _onClick: function() {
          this._hiddenInput.click();
        },
        _onDrop: function(event) {
          this._element.removeClass("dropping");
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.preventDefault();
          this._files = event.dataTransfer.files;
          this._onFileChanged();
        },
        _onDragEnter: function(event) {
          this._element.addClass("dropping");
        },
        _onDragLeave: function(event) {
          this._element.removeClass("dropping");
        },
        _onDragOver: function(event) {
          this._element.addClass("dropping");
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.preventDefault();
          try {
            var effects = event && event.dataTransfer && !window.browserInfo.isIE && event.dataTransfer.effectAllowed;
            event.dataTransfer.dropEffect = 'move' === effects || 'linkMove' === effects ? 'move' : 'copy';
          } catch (e) {}
        },
        _onMouseOver: function(event) {
          this._element.addClass("dropping");
        },
        _onMouseOut: function(event) {
          this._element.removeClass("dropping");
        },
        _onFileChanged: function() {
          var result, i;
          if (this._allowMultipleFiles) {
            result = [];
            if (this._files) {
              for (i = 0; i < this._files.length; i++) {
                if (this._files[i]) {
                  result.push(this._files[i].name);
                }
              }
            }
            if (this._hiddenInput.files) {
              for (i = 0; i < this._hiddenInput.files.length; i++) {
                if (this._hiddenInput.files[i]) {
                  result.push(this._hiddenInput.files[i].name);
                }
              }
            }
          } else {
            if (this._files && this._files[0] && this._files[0].name) {
              result = this._files[0].name;
            }
            if (this._hiddenInput.files && this._hiddenInput.files[0] && this._hiddenInput.files[0].name) {
              result = this._hiddenInput.files[0].name;
            }
          }
          if (!!result) {
            this.emit(cls.FileInputWidget.fileSelectionChangedEvent, result);
          }
        },
        setExtension: function(extension) {
          if (extension !== ".*") {
            this._hiddenInput.setAttribute("accept", extension);
          }
        },
        setCaption: function(caption) {
          this._element.querySelector("span").textContent = caption || i18next.t("gwc.file.upload.droporclick");
        },
        allowMultipleFiles: function(allow) {
          this._allowMultipleFiles = !!allow;
          if (allow) {
            this._hiddenInput.setAttribute("multiple", "multiple");
          } else {
            this._hiddenInput.removeAttribute("multiple");
          }
        },
        whenFileSelectionChanged: function(hook) {
          return this.when(cls.FileInputWidget.fileSelectionChangedEvent, hook);
        },
        send: function(filename, url, callback, errorCallback) {
          var formData = null,
            i, file;
          if (this._files) {
            formData = new FormData();
            for (i = 0; i < this._files.length; ++i) {
              file = this._files[i];
              if (file.name === filename) {
                formData.append(file.name, file);
                break;
              }
              //TODO : manage multifile support
            }
          } else {
            formData = new FormData();
            var files = this._element.querySelector("form").file.files;
            for (i = 0; i < files.length; ++i) {
              file = files[i];
              if (file.name === filename) {
                formData.append(file.name, file);
                break;
              }
              //TODO : manage multifile support
            }
          }
          var request = new XMLHttpRequest();
          request.onload = function() {
            callback();
          }.bind(this);
          request.onerror = function() {
            errorCallback();
          };
          request.open("POST", url);
          request.send(formData);

        }
      };
    });
    cls.WidgetFactory.register('FileInput', cls.FileInputWidget);
  });
