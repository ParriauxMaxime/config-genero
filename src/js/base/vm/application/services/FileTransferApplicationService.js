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

modulum('FileTransferApplicationService', ['ApplicationServiceBase', 'ApplicationServiceFactory'],
  /**
   * @param {gbc} context
   * @param {classes} cls
   */
  function(context, cls) {
    /**
     * Base class of application scoped services
     * @class classes.FileTransferApplicationService
     * @extends classes.ApplicationServiceBase
     */
    cls.FileTransferApplicationService = context.oo.Class(cls.ApplicationServiceBase, function($super) {
      /** @lends classes.FileTransferApplicationService.prototype */
      return {
        __name: "FileTransferApplicationService",
        _closing: false,
        _fileChoosers: null,
        constructor: function(app) {
          $super.constructor.call(this, app);
          this._fileChoosers = [];
        },
        _whenFileSelectionChanged: function(callback, errorCallback, event, src, data) {
          if (data) {
            if (Array.isArray(data)) {
              for (var i = 0; i < data.length; i++) {
                this._fileChoosers[data[i]] = src;
                src._processing = true;
              }
            } else {
              this._fileChoosers[data] = src;
              src._processing = true;
            }
            callback(data);
          } else {
            src.destroy();
            callback(null);
          }
        },
        openFile: function(options, callback, errorCallback) {
          var filePicker = cls.WidgetFactory.create("FilePicker");
          this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
          filePicker.setExtension(this._extractExtensions(options && options.wildcards || ""));
          filePicker.setCaption(options && options.caption || "");
          filePicker.show();
          filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, callback, errorCallback));
        },
        openFiles: function(options, callback, errorCallback) {
          var filePicker = cls.WidgetFactory.create("FilePicker");
          this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
          filePicker.setExtension(this._extractExtensions(options && options.wildcards || ""));
          filePicker.setCaption(options && options.caption || "");
          filePicker.allowMultipleFiles(true);
          filePicker.show();
          filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, callback, errorCallback));
        },
        getFile: function(options, callback, errorCallback) {
          var filePicker;
          var onSuccess = function() {
              if (filePicker._processing) {
                this._application.getMenu("uploadStatus").setIdle();
              }
              callback();
              filePicker.destroy();
            }.bind(this),
            onError = function() {
              if (filePicker._processing) {
                this._application.getMenu("uploadStatus").setIdle();
              }
              errorCallback();
              filePicker.destroy();
            }.bind(this),
            onFile = function(file) {
              if (!file) {
                onError();
              } else {
                this._application.getMenu("uploadStatus").setProcessing();
                var url = options.fileTransferUrl;
                filePicker.send(file, url, onSuccess, onError);
              }
            }.bind(this);
          if (this._fileChoosers[options.filename]) {
            filePicker = this._fileChoosers[options.filename];
            this._fileChoosers[options.filename] = null;
            onFile(options.filename);
          } else {
            filePicker = cls.WidgetFactory.create("FilePicker");
            this._application.getUI().getWidget().getElement().appendChild(filePicker.getElement());
            filePicker.setExtension("." + options.filename.split('.').pop());
            filePicker.show();
            filePicker.whenFileSelectionChanged(this._whenFileSelectionChanged.bind(this, onFile, onError));
          }
        },
        destroy: function() {
          $super.destroy.call(this);
        },

        _extractExtensions: function(raw) {
          var regex = /[^\s]*(\.[^.\s]+)/g,
            m, res = [];
          while ((m = regex.exec(raw)) !== null) {
            var ext = m[1];
            if (ext === ".*") {
              res.length = 0;
              break;
            }
            res.push(ext);
          }
          return res.join(",") || "";
        }
      };
    });
    cls.ApplicationServiceFactory.register("FileTransfer", cls.FileTransferApplicationService);
  });
