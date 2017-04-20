/// FOURJS_START_COPYRIGHT(D,2014)
/// Property of Four Js*
/// (c) Copyright Four Js 2014, 2017. All Rights Reserved.
/// * Trademark of Four Js Development Tools Europe Ltd
///   in the United States and elsewhere
/// 
/// This file can be modified by licensees according to the
/// product manual.
/// FOURJS_END_COPYRIGHT

/* global Handlebars : false */
/* global docTemplates: false */

"use strict";

var selectItem = function(itemname){
  var selectedItem = $("#menu-" + itemname + ">.menu-title");
  selectedItem.click();
  selectedItem.parents(".sub-menu").each(function(){
    $(this).prev(".menu-block").addClass("open");
    $(this).show("slow");
  });
};
$("body")
  .on("click", ".menu-toggle", function() {
    $(this).parent().toggleClass("open");
    $("#sub-" + $(this).parent().attr("id")).toggle("slow");
  })
  .on("click", ".menu-title", function() {
    $(".descriptions>div").hide();
    var id = $(this).parent().attr("id").replace(/^menu-/, "");
    $("#desc-" + id).show();

    $(this).parent().addClass("open");
    $("#sub-" + $(this).parent().attr("id")).show("slow");

    window.location.hash = id;
    document.title = $(this).find(".name").text().trim() + " | GBC documentation";

    $(".menu .selected").removeClass("selected");
    $(this).parent().addClass("selected");
  })
  .on("click", ".orphans .panel-heading", function() {
    $(this).next().toggleClass("in");
  } );


//handlebars
(function() {
  Handlebars.registerHelper("notempty", function (item, options) {
    if (JSON.stringify(item) !== "{}") {
      return options.fn(this);
    }
  });
  Handlebars.registerHelper("exists", function (item, options) {
    if (!!item) {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper("hasChildren", function (item, options) {
    if (!!item && (
      (item.namespaces && item.namespaces.length) || (item.classes && item.classes.length) || (item.members && item.members.length) || (item.functions && item.functions.length))) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper("menuitem_kind_class", function (item) {
    return "__" + item.kind;
  });
  Handlebars.registerHelper("menuitem_kind_labelclass", function (item) {
    return ({
      namespace: "label-default",
      "class": "label-primary",
      constructor: "label-success",
      member: "label-info",
      "function": "label-warning"
    })[item.kind];
  });
  Handlebars.registerHelper("menuitem_kind_labeltitle", function (item) {
    return ({
      namespace: "Namespace",
      "class": "Class",
      constructor: "Constructor",
      member: "Member",
      "function": "Function"
    })[item.kind];
  });
  Handlebars.registerHelper("menuitem_kind_label", function (item) {
    return ({namespace: "NS", "class": "CLS", constructor: "CTOR", member: "M", "function": "F"})[item.kind];
  });
  Handlebars.registerHelper("json", function (object) {
    return JSON.stringify(object, null, " ");
  });
  Handlebars.registerHelper("safe", function (object) {
    return new Handlebars.SafeString(object);
  });
  Object.each(docTemplates, function (name, tpl) {
    Handlebars.registerPartial(name, tpl);
  });
})();

//data
(function() {
  var filter = function (item) {
    var i = null, result = null, value = null;
    var alreadyExists = function (target, item) {
      return target.some(function (r) {
        return r.name === item.name && r.comment;
      });
    };
    if (Array.isArray(item)) {
      result = [];
      for (i in item) {
        if (!alreadyExists(result, item[i])) {
          value = filter(item[i]);
          if (value) {
            result.push(value);
          }
        }
      }
    } else if (Object.isObject(item)) {
      if (item && (!item.name ||
        (item.name.indexOf("\"")<0&& item.name.indexOf("[")<0&& item.name.indexOf("__name")<0&& item.name.indexOf("constructor")<0))) {
        result = {};
        for (i in item) {
          value = filter(item[i]);
          if (value) {
            result[i] = value;
          }
        }
      }
    } else {
        result = item;
    }
    return result;
  };

  var manageNamespaces = function(data){
    var ns = data.namespaces.clone();
    var findParent = function(ns, memberof){
      return ns.find(function (item) {
        return item.longname === memberof;
      });
    };
    ns.forEach(function(names){
      data.orphans.clone().forEach(function(item){
        if (item.memberof === names.longname){
          (names.classes = names.classes || []).push(item);
          data.orphans.remove(item);
        }
      });
      if (names.memberof) {
        var parent = findParent(ns, names.memberof);
        if (parent) {
          (parent.namespaces = parent.namespaces || []).push(names);
        }
      }
    });
    data.namespaces.remove(function (item) {
      return item.memberof;
    });
  };

  var source = "{{> maintemplate}}";
  var template = Handlebars.compile(source);
  var d = filter(window.documentation);
  manageNamespaces(d);
  $("body").append($(template(d)));
  $(".undocumented").parents(".sub-menu").each(function(){
    $(this).prev(".menu-block").addClass("undocumented_content");
  });
  selectItem(window.location.hash.slice(1));
})();
