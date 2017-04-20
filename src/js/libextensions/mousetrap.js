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
/*jslint latedef:false*/
(function(window, Mousetrap) {
  //var registeredElements = [];
  var registered = {};
  var unicId = 0;
  var fireAll = false;

  /**
   * Disable default IE behavior when pressing F1 key (which launch a new page toward microsoft website)
   * ref: https://agile.strasbourg.4js.com/jira/browse/ENGGCS-3879
   */
  if ('onhelp' in window) {
    // To avoid IE to popup the help dialog on F1, we override associated 'onhelp' event
    window.onhelp = function() {
      return false;
    };
  }

  Mousetrap.prototype.destroy = function() {
    this.reset();
    this.target = null;
  };

  var mousetrapped = function(targetElement) {
    var idx = 0;
    var instance = null;
    if (!targetElement) { // document
      targetElement = document;
      instance = registered[0];
      if (!instance) {
        instance = new Mousetrap(targetElement);
        registered[0] = instance;
      }
    } else {
      idx = targetElement.getAttribute("mousetrapId");
      if (!idx) { // create new instance
        instance = new Mousetrap(targetElement);
        unicId++;
        targetElement.setAttribute("mousetrapId", unicId);
        registered[unicId] = instance;
        //registered.push(instance);
      } else {
        instance = registered[idx];
      }
    }
    return instance;
  };

  mousetrapped.release = function(element) {
    var idx = element.getAttribute("mousetrapId");
    if (idx) {
      registered[idx].destroy();
      delete registered[idx];
    }
  };

  mousetrapped.fireAll = function(fire) {
    fireAll = fire;
  };

  var _hooks = [];
  mousetrapped.onKey = function(hook) {
    var remove = function() {
      _hooks.remove(hook);
    };
    _hooks.push(hook);
    return remove;
  };
  window.mousetrapped = mousetrapped;

  /**
   * the sequence currently being recorded
   *
   * @type {Array}
   */
  var _recordedSequence = [],

    /**
     * a callback to invoke after recording a sequence
     *
     * @type {Function|null}
     */
    _recordedSequenceCallback = null,

    /**
     * a list of all of the keys currently held down
     *
     * @type {Array}
     */
    _currentRecordedKeys = [],

    /**
     * temporary state where we remember if we've already captured a
     * character key in the current combo
     *
     * @type {boolean}
     */
    _recordedCharacterKey = false,

    /**
     * a handle for the timer of the current recording
     *
     * @type {null|number}
     */
    _recordTimer = null,

    /**
     * the original handleKey method to override when Mousetrap.record() is
     * called
     *
     * @type {Function}
     */
    _origHandleKey = Mousetrap.prototype.handleKey;

  /**
   * test if character is a browser combo (ex: ctrl-c, ctrl-v, ...)
   * @param character
   * @private
   */
  function _isReservedModifier(character, evt) {
    return ["c"].indexOf(character) !== -1 && (evt.ctrlKey === true || evt.metaKey === true);
  }

  /**
   * handles a character key event
   *
   * @param {string} character
   * @param {Array} modifiers
   * @param {Event} e
   * @returns void
   */
  function _handleKey(character, modifiers, e) {
    /* jshint validthis: true */
    if (!this.recording) { // if not recording keys anymore, we execute bound action (if existing)
      _origHandleKey.apply(this, [character, modifiers, e]);
      return;
    }

    // record keys combinaison
    if (e.type === 'keydown') {
      if (character.length >= 1 && _recordedCharacterKey) {
        _recordCurrentCombo();
      }

      for (var i = 0; i < modifiers.length; ++i) {
        _recordKey(modifiers[i]);
      }
      _recordKey(character);

      if (character.length >= 1 && _recordedCharacterKey) {
        _recordCurrentCombo();
      }

      // once a key is released, all keys that were held down at the time
      // count as a keypress
    } else if (e.type === 'keyup' && _currentRecordedKeys.length > 0) {
      _recordCurrentCombo();
    }
  }

  /**
   * marks a character key as held down while recording a sequence
   *
   * @param {string} key
   * @returns void
   */
  function _recordKey(key) {
    var i;

    // one-off implementation of Array.indexOf, since IE6-9 don't support it
    for (i = 0; i < _currentRecordedKeys.length; ++i) {
      if (_currentRecordedKeys[i] === key) {
        return;
      }
    }

    _currentRecordedKeys.push(key);

    if (key.length >= 1) {
      _recordedCharacterKey = true;
    }
  }

  /**
   * marks whatever key combination that's been recorded so far as finished
   * and gets ready for the next combo
   *
   * @returns void
   */
  function _recordCurrentCombo() {
    _recordedSequence.push(_currentRecordedKeys);
    _currentRecordedKeys = [];
    _recordedCharacterKey = false;
    _restartRecordTimer();
  }

  /**
   * ensures each combo in a sequence is in a predictable order and formats
   * key combos to be '+'-delimited
   *
   * modifies the sequence in-place
   *
   * @param {Array} sequence
   * @returns void
   */
  function _normalizeSequence(sequence) {
    var i;

    var sortFn = function(x, y) {
      // modifier keys always come first, in alphabetical order
      if (x.length > 1 && y.length === 1) {
        return -1;
      } else if (x.length === 1 && y.length > 1) {
        return 1;
      }

      // character keys come next (list should contain no duplicates,
      // so no need for equality check)
      return x > y ? 1 : -1;
    };

    for (i = 0; i < sequence.length; ++i) {
      sequence[i].sort(sortFn);

      sequence[i] = sequence[i].join('+');
    }
  }

  /**
   * finishes the current recording, passes the recorded sequence to the stored
   * callback, and sets Mousetrap.handleKey back to its original function
   *
   * @returns void
   */
  function _finishRecording() {
    if (_recordedSequenceCallback) {
      _normalizeSequence(_recordedSequence);
      _recordedSequenceCallback(_recordedSequence);
    }

    // reset all recorded state
    _recordedSequence = [];
    _recordedSequenceCallback = null;
    _currentRecordedKeys = [];
  }

  /**
   * called to set a 1 second timeout on the current recording
   *
   * this is so after each key press in the sequence the recording will wait for
   * 1 more second before executing the callback
   *
   * @returns void
   */
  function _restartRecordTimer() {
    clearTimeout(_recordTimer);
    _recordTimer = setTimeout(_finishRecording, 1);
  }

  var cbfn = function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    this.self.recording = false;
    this.callback.apply(this.self, [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9]);
  };

  /**
   * records the next sequence and passes it to a callback once it's
   * completed
   *
   * @param {Function} callback
   * @returns void
   */
  Mousetrap.prototype.record = function(callback) {
    this.recording = true;
    _recordedSequenceCallback = cbfn.bind({
      self: this,
      callback: callback
    });
  };

  Mousetrap.prototype.handleKey = function(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    _handleKey.apply(this, [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9]);
  };

  Mousetrap.prototype.stopCallback = function(e, element) {
    return false;
  };

  Mousetrap.init();
  var onSequence = function(sequence) {
    if (sequence.length) {
      for (var s = 0; s < sequence.length; s++) {
        for (var i = 0; i < _hooks.length; i++) {
          _hooks[i](sequence[s]);
        }
      }
    }
    window.requestAnimationFrame(function() {
      mousetrapped().record(onSequence);
    });
  };
  mousetrapped().record(onSequence);

})(window, Mousetrap);
