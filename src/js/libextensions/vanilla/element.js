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
(function() {
  /**
   *
   * @param {String} name
   */
  Element.prototype.getIntAttribute = function(name) {
    var result = parseInt(this.getAttribute(name), 10);
    return Object.isNaN(result) ? null : result;
  };

  var classedEventRE = /([^.]+)+(\..+)?/;

  /**
   *
   * @param {String} type
   * @param {String=} subFilter
   * @param {Function} callback
   */
  Element.prototype.on = function(type, subFilter, callback) {
    this._registeredEvents = this._registeredEvents || {};
    var t = classedEventRE.exec(type || ""),
      event = t && t[1],
      eventClass = t && t[2];
    if (!!event) {
      var registered = (this._registeredEvents[event] = this._registeredEvents[event] || {
        __default: []
      });
      var cb;
      if (!callback) {
        cb = subFilter;
      } else {
        cb = function(event) {
          if (!subFilter || this.querySelectorAll(subFilter).contains(event.target) ||
            this.querySelectorAll(subFilter + " *").contains(event.target)) {
            callback(event);
          }
        }.bind(this);
      }
      (registered[eventClass || "__default"] = registered[eventClass || "__default"] || []).push(cb);
      this.addEventListener(event, cb, false);
    }
    return this;
  };

  /**
   *
   * @param {String} type
   */
  Element.prototype.off = function(type) {
    this._registeredEvents = this._registeredEvents || {};
    var t = classedEventRE.exec(type || "") || [],
      event = t[1],
      eventClass = t[2];
    if (!!event) {
      var registered = this._registeredEvents[event];
      if (!!eventClass) {
        if (!!registered && !!registered[eventClass]) {
          while (registered[eventClass].length) {
            this.removeEventListener(event, registered[eventClass].pop());
          }
        }
      } else {
        var keys = Object.keys(registered);
        for (var i = 0; i < keys.length; i++) {
          while (registered[keys[i]].length) {
            this.removeEventListener(event, registered[keys[i]].pop());
          }
        }
      }
    }
    return this;
  };

  /**
   *
   * @param {Function=} callback
   */
  Element.prototype.domFocus = function(callback, noScrollContainer) {
    // We don't want modifier keys to raise focus change and to be recorded
    if (this !== document.activeElement) {
      if (noScrollContainer && !this.setActive) {
        // hack to prevent automatic scrolling when focus()
        var scrollTop = noScrollContainer.scrollTop;
        var scrollLeft = noScrollContainer.scrollLeft;

        this.on("focus.NOScrollFocus", function(e) {
          noScrollContainer.scrollTop = scrollTop;
          noScrollContainer.scrollLeft = scrollLeft;
          this.off("focus.NOScrollFocus");
        }.bind(this));

        this.focus();
      } else if (noScrollContainer) {
        try {
          this.setActive(); // IE: setActive gives the focus but don't scroll into view
        } catch (e) {
          this.focus();
        }
      } else {
        this.focus();
      }
    }
    if (!!callback) {
      window.requestAnimationFrame(callback);
    }
  };

  Element.prototype.hasParentOfType = function(nodeName) {
    var el = this;
    while (el.parentNode !== null) {
      el = el.parentNode;
      if (el.nodeName === nodeName) {
        return true;
      }
    }
    return false;
  };

  Element.prototype.setCursorPosition = function(pos, pos2) {
    var run = function() {
      try {
        if (!this.hasParentOfType("#document-fragment")) {
          this.setSelectionRange(pos, pos2);
        }
      } catch (e) {}
    }.bind(this);
    if (!pos2 || pos2 === 0) {
      pos2 = pos;
    }

    run();
  };

  /**
   *
   * @param {Element} element
   */
  Element.prototype.replaceWith = function(element) {
    this.parentNode.insertBefore(element, this);
    this.remove();
  };

  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  /**
   *
   * @param {Element} element
   */
  Element.prototype.prependChild = function(element) {
    var refElement = null;
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof window.SVGElement) {
      refElement = this.childNodes[0];
    } else {
      refElement = this.children[0];
    }
    this.insertBefore(element, refElement);
  };

  /**
   *
   * @param index
   * @param {Element} parentNode
   */
  Element.prototype.insertAt = function(index, parentNode) {
    var parentChildren = null;
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof window.SVGElement) {
      parentChildren = parentNode.childNodes;
    } else {
      parentChildren = parentNode.children;
    }

    if (index === 0) {
      if (parentChildren.length) {
        parentNode.prependChild(this);
      } else {
        parentNode.appendChild(this);
      }
    } else {
      var where = !!index && parentChildren[index];
      if (!!where) {
        parentNode.insertBefore(this, where);
      } else {
        parentNode.appendChild(this);
      }
    }
  };
  /**
   *
   * @param {Element} refNode
   */
  Element.prototype.insertAfter = function(refNode) {
    if (refNode && refNode.parentNode) {
      refNode.parentNode.insertBefore(this, refNode.nextSibling);
    }
  };
  /**
   * Remove all children
   */
  Element.prototype.empty = function() {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  };
  /**
   *
   * @param className
   * @returns {Element}
   */
  Element.prototype.parent = function(className) {
    var found = false,
      parent = this.parentNode;
    while (!found) {
      if (!parent) {
        found = true;
        break;
      }
      if (parent.nodeType === Node.ELEMENT_NODE && parent.hasClass(className)) {
        found = true;
        break;
      }
      parent = parent.parentNode;
    }
    return parent;
  };
  /**
   *
   * @param className
   * @returns {Element}
   */
  Element.prototype.child = function(className) {
    var children = this.children,
      found = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].hasClass(className)) {
        found = children[i];
        break;
      }
    }
    return found;
  };

  /**
   *
   * @param tagName
   * @returns {Element}
   */
  Element.prototype.childTag = function(tagName) {
    var children = this.children,
      found = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName.toLowerCase() === tagName.toLowerCase()) {
        found = children[i];
        break;
      }
    }
    return found;
  };

  /**
   *
   * @param className
   * @returns {Element}
   */
  Element.prototype.allchild = function(className) {
    var children = this.children,
      result = [];
    for (var i = 0; i < children.length; i++) {
      if (children[i].hasClass(className)) {
        result.push(children[i]);
      }
    }
    return result;
  };

  /**
   *
   * @param item
   * @returns {Element}
   */
  Element.prototype.childrenExcept = function(item) {
    var children = this.children,
      result = [];
    for (var i = 0; i < children.length; i++) {
      if (children[i] !== item) {
        result.push(children[i]);
      }
    }
    return result;
  };

  /**
   *
   * @param {String} cssClass
   * @returns {boolean}
   */
  Element.prototype.hasClass = function(cssClass) {
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof window.SVGElement) {
      return (this.getAttribute("class") || "").split(" ").indexOf(cssClass) >= 0;
    } else {
      return this.classList.contains(cssClass);
    }
  };

  /**
   *
   * @param {String} cssClass
   * @returns {Element}
   */
  Element.prototype.addClass = function(cssClass) {
    if ((window.browserInfo.isIE || window.browserInfo.isEdge) && this instanceof window.SVGElement) {
      var currentClasses = (this.getAttribute("class") || "").split(" "),
        exists = currentClasses.indexOf(cssClass);
      if (exists >= 0) {
        currentClasses.splice(exists, 1);
      }
      currentClasses.push(cssClass);
      this.setAttribute("class", currentClasses.join(" "));
    } else {
      this.classList.add(cssClass);
    }
    return this;
  };

  /**
   *
   * @returns {Element}
   */
  Element.prototype.addClasses = function() {
    for (var i = 0; i < arguments.length; ++i) {
      this.classList.add(arguments[i]);
    }
    return this;
  };

  /**
   *
   * @param {String} cssClass
   * @param {Boolean=} switcher
   * @returns {Element}
   */
  Element.prototype.toggleClass = function(cssClass, switcher) {
    if (window.browserInfo.isIE) {
      if (!!switcher) {
        this.classList.add(cssClass);
      } else {
        this.classList.remove(cssClass);
      }
    } else {
      if (switcher === true || switcher === false) {
        this.classList.toggle(cssClass, switcher);
      } else {
        this.classList.toggle(cssClass);
      }
    }
    return this;
  };

  /**
   *
   * @param {String} cssClass
   * @returns {Element}
   */
  Element.prototype.removeClass = function(cssClass) {
    this.classList.remove(cssClass);
    return this;
  };

  Element.prototype.index = function() {
    var index = 0;
    var i = 0,
      parent = this.parentNode,
      children = parent.childNodes,
      len = children.length;
    for (; i < len; i++) {
      var item = children[i];
      if (item === this) {
        return index;
      }
      if (item.nodeType === Node.ELEMENT_NODE) {
        index++;
      }
    }
    return -1;
  };

  Element.prototype.selectText = function() {
    var range, selection;
    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  Element.prototype.closest = function(className) {
    if (this.hasClass(className)) {
      return this;
    } else {
      return this.parent(className);
    }
  };

  if (!NodeList.prototype.contains) {
    /*jshint -W121 */
    NodeList.prototype.contains = function(element) {
      var i = 0,
        len = this.length;
      for (; i < len; i++) {
        if (this[i] === element) {
          return true;
        }
      }
      return false;
    };
  }

  if (!SVGElement.prototype.getElementsByClassName) {
    SVGElement.prototype.getElementsByClassName = function(cssClass) {
      return this.querySelectorAll(cssClass);
    };
  }

  Element.prototype.emitEvent = function(type) {
    var event = document.createEvent("Event");
    event.initEvent(type, false, true);
    this.dispatchEvent(event);
  };
})();
