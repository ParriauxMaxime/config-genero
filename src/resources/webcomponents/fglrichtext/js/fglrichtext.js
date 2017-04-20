/// FOURJS_START_COPYRIGHT(D,2016)
/// Property of Four Js*
/// (c) Copyright Four Js 2015, 2016. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
///
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

"use strict";

var hasFocus = false;
var editorInitialized = false;
var postInitContent = "";
var postInitFocus = false;
var _showToolBox = false;


function FglRichText(gICAPI, editorProperties) {

  /**
   * Default Properties of the editor
   */
  this.properties = {
    selector: 'textarea#richtext',
    plugins: [
      "advlist autolink lists link charmap preview hr anchor pagebreak",
      "searchreplace wordcount visualblocks visualchars code fullscreen",
      "insertdatetime media nonbreaking save table directionality",
      "emoticons template paste textcolor colorpicker textpattern"
    ],
    resize: false, // disable the resize handle
    menubar: false,
    statusbar: false,
    nonbreaking_force_tab: true, // let tinymce manages TAB key as an indent

    setup: function(editor) {
      // jshint ignore:start
      editor.eventListenerResize = function() {
        this.resizeEditor(editor, document.body.clientHeight);
      }.bind(this);
      // jshint ignore:end

      editor.on('focus', function(e) {
        if (!hasFocus) {
          // Ask focus to VM, will fire onFocus!
          gICAPI.SetFocus();
        }
      }.bind(this));

      editor.on('init', function(e) {
        if (postInitContent !== null) {
          editor.setContent(postInitContent);
          postInitContent = null;
        }
        if (postInitFocus === true) {
          editor.focus(false);
          hasFocus = true; // editor.focus() triggers "focus" event!
          postInitFocus = false;
        }
        window.addEventListener("resize", editor.eventListenerResize);

        setTimeout(editor.eventListenerResize, 200);
        editorInitialized = true;
        $("#richtext").trigger("richtextready");
      });

      editor.on('remove', function(e) {
        window.removeEventListener("resize", editor.eventListenerResize);
      });
    }.bind(this)
  };

  /**
   * Set content of the RichText
   * @param string html content
   */
  this.setContent = function(content) {
    this._onceRichTextReady(function() {
      this.activeEditor.setContent(content);
    }.bind(this));
  };

  /**
   * Get the content of the RichText
   */
  this.getContent = function(){
    return this.activeEditor.getContent();
  };

  /**
   * Will focus the editor
   */
  this.focus = function() {
    this._onceRichTextReady(function() {
      this.activeEditor.focus(); // will trigger editor focus event!
    }.bind(this));
  };


  this.disableEditor = function (disabled) {
    if (disabled) {
      $("body").addClass("disabled");
      $("body iframe")[0].contentWindow.document.querySelector("body").classList.add("disabled");
      $("body iframe")[0].contentWindow.document.querySelector("body").style["background-color"] = "#EEEEEE";
    }
    else{
      $("body").removeClass("disabled");
      $("body iframe")[0].contentWindow.document.querySelector("body").classList.remove("disabled");
      $("body iframe")[0].contentWindow.document.querySelector("body").style["background-color"] = "";
    }
  };

  /**
   * Set property of the Richtext
   * @param property
   */
  this.setProperty = function(property) {
    this._onceRichTextReady(function() {
      this.activeEditor.getBody().setAttribute('contenteditable', 'true');
      this.activeEditor.getBody().setAttribute('draggable', 'false');
      this.disableEditor(false);

      if (property.showEditToolBox) {
        _showToolBox = property.showEditToolBox === "show" || property.showEditToolBox === "auto" ? true : false;
        this.showToolBox(_showToolBox);
      }
      if (property.disableEditor) {
        this.activeEditor.setMode(property.disableEditor === "disabled" ? "readonly" : "design");
        this.disableEditor(property.disableEditor === "disabled");
      }
    }.bind(this));
  };

  /**
   * Called when state has Changed
   * @param strParams
   */
  this.stateChanged = function(strParams) {
    this._onceRichTextReady(function() {
      var params = JSON.parse(strParams);
      var active = params.active === "1" ? true : false;
      var dialogType = params.dialogType;

      if (!active) {
        this.showToolBox(false, "hide");
        this.disableEditor(true);
      }
      else{
        this.showToolBox(true);
        this.disableEditor(false);
      }
    }.bind(this));
  };

  /**
   * Function to resize the editor according to the viewbox height
   */
  this.resizeEditor = function(editor, height) {
    try {
      var mceBarsHeight = 0;
      $('.mce-toolbar, .mce-statusbar, .mce-menubar').each(function() {
        mceBarsHeight += $(this).height();
      });
      var editorHeight = height - mceBarsHeight - 8;
      editor.theme.resizeTo('100%', editorHeight);
    } catch (err) {
      console.error("error in resizeEditor", err);
    }
  };

  /**
   * Show/Hide the Toolbox
   * @param show
   * @param forcedVal
   */
  this.showToolBox = function(show, forcedVal) {
    if (forcedVal === "hide") {
      $(".mce-toolbar-grp").hide();
      return;
    }
    if (show && _showToolBox) {
      $(".mce-toolbar-grp").show();
    } else {
      $(".mce-toolbar-grp").hide();
    }
  };

  /**
   * Execute a callback function once richText is ready or now if ready
   * @param callback
   * @private
   */
  this._onceRichTextReady = function(callback) {
    if (editorInitialized) {
      callback();
    } else {
      $("#richtext").on("richtextready", function() {
        callback();
      });
    }
  };

  //Init part
  //default hide toolbar
  $(".mce-toolbar-grp").hide();

  if (editorProperties) {
    $.extend(this.properties, editorProperties);
  }

  tinymce.init(this.properties);
  this.activeEditor = tinymce.activeEditor;
}


/**
 * Genero API
 * @param version
 */
var onICHostReady = function(version) {
  var richText = new FglRichText(gICAPI);

  if (version !== 1.0) {
    console.error('Invalid API version');
  }

  /**
   * Once we got data from the VM
   * @param content
   */
  gICAPI.onData = function(content) {
    if (content === null || content.length === 0) {
      content = "";
    }
    if (richText !== null) {
      richText.setContent(content);
    } else if (!editorInitialized) {
      postInitContent = content;
    } else {
      alert("onData: Cannot set content!");
    }
  };

  /**
   * The focus has change at a VM point of view
   * @param polarity
   */
  gICAPI.onFocus = function(polarity) {
    if (polarity === true) {
      hasFocus = true;
      if (richText !== null) {
        richText.focus(); // will trigger editor focus event!
      } else if (!editorInitialized) {
        postInitFocus = true;
      } else {
        alert("onFocus: Cannot set focus!");
      }
    } else {
      hasFocus = false;
    }
  };

  /**
   * Set property of the editor
   * @param property
   */
  gICAPI.onProperty = function(property) {
    richText.setProperty(property);
  };

  /**
   * Force a send data when Genero client ask it
   */
  gICAPI.onFlushData = function() {
    gICAPI.SetData(richText.getContent());
  };

  /**
   * If dialog or active attribute changed, call this
   * @param params
   */
  gICAPI.onStateChanged = function(strParams) {
    console.log("onStateChanged");
    richText.stateChanged(strParams);
  };

};