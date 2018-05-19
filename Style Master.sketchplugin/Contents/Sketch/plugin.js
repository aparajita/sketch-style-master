
var that = this;
function run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {"name":"Style Master","version":"1.0.1","identifier":"com.aparajita.style-master","description":"Shared style renaming.","author":"Aparajita Fishman","authorEmail":"aparajita@aparajita.com","homepage":"https://github.com/aparajita/sketch-style-master","compatibleVersion":4,"bundleVersion":1,"disableCocoaScriptPreprocessor":true,"appcast":"https://raw.githubusercontent.com/aparajita/sketch-style-master/master/appcast.xml","nibProject":"nib","nibBundle":"UIBundle","commands":[{"name":"Rename Text Styles","script":"plugin.js","handler":"renameTextStyles","identifier":"rename-text-styles","description":"Rename shared text styles","icon":"rename-styles.png"},{"name":"Rename Layer Styles","script":"plugin.js","handler":"renameLayerStyles","identifier":"rename-layer-styles","description":"Rename shared layer styles","icon":"rename-styles.png"}],"menu":{"title":"Style Master","items":["rename-text-styles","rename-layer-styles"]}}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// webpack build dependency

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _renameStyles = __webpack_require__(2);

Object.keys(_renameStyles).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renameStyles[key];
    }
  });
});

__webpack_require__(0);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameTextStyles = renameTextStyles;
exports.renameLayerStyles = renameLayerStyles;

var _sharedStyleRenamer = __webpack_require__(3);

function renameTextStyles(context) {
  var styles = context.document.documentData().layerTextStyles();
  var renamer = new _sharedStyleRenamer.SharedStyleRenamer(context, styles, 'text');
  renamer.run();
}

function renameLayerStyles(context) {
  var styles = context.document.documentData().layerStyles();
  var renamer = new _sharedStyleRenamer.SharedStyleRenamer(context, styles, 'layer');
  renamer.run();
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
  Handler for 'Rename Text Styles' command.
*/



// Code being used

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharedStyleRenamer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// webpack build dependencies


exports.renameTextStyles = renameTextStyles;
exports.renameLayerStyles = renameLayerStyles;

var _utils = __webpack_require__(4);

var _sketchNibui = __webpack_require__(5);

__webpack_require__(7);

__webpack_require__(8);

var _manifest = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PREVIEW_COLUMN_COUNT = 2;
var PREVIEW_CELL_SPACING = NSMakeSize(16, 2);
var PREVIEW_VISIBLE_ROWS = 27;

var FIND_FIELD_TAG = 1;
var REPLACE_FIELD_TAG = 2;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

var SharedStyleRenamer = exports.SharedStyleRenamer = function () {
  function SharedStyleRenamer(context, styles, layerType) {
    _classCallCheck(this, SharedStyleRenamer);

    this.context = context;
    this.sketch = context.api();
    this.styles = styles;
    this.styleInfo = [];
    this.renamedStyles = [];
    this.find = '';
    this.replace = '';
    this.cellFontRegular = NSFont.systemFontOfSize(NSFont.systemFontSize());
    this.cellFontBold = NSFont.boldSystemFontOfSize(NSFont.systemFontSize());
    this.layerType = layerType;
    this.dialogTitle = 'Rename ' + capitalize(layerType) + ' Styles';

    this.ivars = {
      styles: styles,
      renameCount: 0,
      findPattern: '',
      ignoreCase: false,
      useRegex: false,
      replacePattern: '',
      showMatchingStyles: false,
      autoScroll: true,
      findColor: NSColor.textColor()
    };
  }

  _createClass(SharedStyleRenamer, [{
    key: 'makeAlert',
    value: function makeAlert() {
      var alert = NSAlert.new();
      alert.setMessageText(this.dialogTitle);

      var icon = NSImage.alloc().initByReferencingFile(this.sketch.resourceNamed('rename-styles@2x.png').path());
      alert.setIcon(icon);

      return alert;
    }
  }, {
    key: 'loadNib',
    value: function loadNib() {
      this.nib = new _sketchNibui.NibUI(this.context, 'UIBundle', 'RenameStyles', this, this.ivars);
      this.nib.outlets.window.setTitle(this.dialogTitle);
      this.nib.outlets.versionLabel.setStringValue('v' + _manifest.version);
    }
  }, {
    key: 'windowWillClose',
    value: function windowWillClose() {
      NSApp.stopModal();
    }
  }, {
    key: 'controlTextDidChange',
    value: function controlTextDidChange(notification) {
      var tag = notification.object().tag();

      if (tag == FIND_FIELD_TAG) {
        this.searchForMatchingStyles();
      } else if (tag == REPLACE_FIELD_TAG) {
        this.updateReplacedNames();
      }
    }
  }, {
    key: 'toggleShowOnlyMatchingStyles',
    value: function toggleShowOnlyMatchingStyles() {
      if (!this.nib.ivars.showMatchingStyles.boolValue()) {
        this.resetRenamedStyles();
      }

      this.searchForMatchingStyles();
    }
  }, {
    key: 'toggleFindOption',
    value: function toggleFindOption() {
      this.searchForMatchingStyles();
    }
  }, {
    key: 'toggleAutoscroll',
    value: function toggleAutoscroll() {
      this.scrollToFirstRenamedStyle();
    }
  }, {
    key: 'handleRename',
    value: function handleRename() {
      this.renameStyles();
      NSApp.stopModal();
    }
  }, {
    key: 'handleApply',
    value: function handleApply() {
      this.applyRename();
    }
  }, {
    key: 'handleCancel',
    value: function handleCancel() {
      NSApp.stopModal();
    }
  }, {
    key: 'applyRename',
    value: function applyRename() {
      this.renameStyles();
      this.initStyleInfo();
      this.nib.ivars.findPattern = '';
      this.nib.ivars.replacePattern = '';
      this.nib.ivars.showMatchingStyles = false;
      this.nib.outlets.window.makeFirstResponder(this.nib.outlets.window.initialFirstResponder());
      this.searchForMatchingStyles();
    }
  }, {
    key: 'scrollToFirstRenamedStyle',
    value: function scrollToFirstRenamedStyle() {
      if (!this.nib.ivars.autoScroll.boolValue()) {
        return;
      }

      var insets = this.nib.outlets.scrollView.contentInsets();
      var point = NSMakePoint(0, 0);

      if (this.renamedStyles.length > 0) {
        for (var i = 0; i < this.renamedStyles.length; i++) {
          var info = this.renamedStyles[i];

          if (info.newName.length > 0) {
            point = this.matrix.cellFrameAtRow_column(i, 0).origin;
            break;
          }
        }
      } else {
        point = this.matrix.cellFrameAtRow_column(0, 0).origin;
      }

      point.y -= insets.top - 1; // Not sure why - 1 is necessary, but it is
      this.matrix.scrollPoint(point);
      this.nib.outlets.scrollView.reflectScrolledClipView(this.nib.outlets.scrollView.contentView());
    }
  }, {
    key: 'searchForMatchingStyles',
    value: function searchForMatchingStyles() {
      // We always want to replace all occurrences of the find string within
      // a style name, so we have to transform a plain search into a RegExp with
      // the 'g' flag, because a plain text replace only replaces the first occurrence.
      var flags = this.nib.ivars.ignoreCase.boolValue() ? 'gi' : 'g';
      var regex = !!this.nib.ivars.useRegex.boolValue();

      // When the text field's value is empty, the bound value is returning null,
      // so make sure we have at least an empty string.
      var find = String(this.nib.ivars.findPattern || '');

      // RegExp constructor can fail, be sure to catch exceptions!
      try {
        if (regex) {
          this.find = new RegExp(find, flags);
        } else {
          this.find = new RegExp((0, _utils.regExpEscape)(find), flags);
        }

        this.nib.ivars.findColor = NSColor.textColor();
      } catch (ex) {
        this.nib.ivars.findColor = NSColor.redColor();
        find = '';
        this.find = new RegExp('', flags);
      }

      this.updateStylesToRename(find.length === 0);
      this.setMatrixData();
      this.scrollToFirstRenamedStyle();
    }
  }, {
    key: 'updateReplacedNames',
    value: function updateReplacedNames() {
      this.replace = String(this.nib.ivars.replacePattern || '');
      this.updateRenamedStyles();
      this.setMatrixData();
    }
  }, {
    key: 'initStyleInfo',
    value: function initStyleInfo() {
      var styles = this.styles.objects();
      this.styleInfo = new Array(styles.length);

      for (var i = 0; i < styles.length; i++) {
        var style = styles[i];

        this.styleInfo[i] = {
          style: style,
          name: style.name()
        };
      }

      this.styleInfo.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }

        if (a.name > b.name) {
          return 1;
        }

        return 0;
      });

      this.nib.ivars.renameCount = 0;
      this.resetRenamedStyles();
    }
  }, {
    key: 'resetRenamedStyles',
    value: function resetRenamedStyles() {
      this.renamedStyles = new Array(this.styleInfo.length);

      for (var i = 0; i < this.styleInfo.length; i++) {
        var info = this.styleInfo[i];
        this.renamedStyles[i] = {
          style: info.style,
          oldName: info.name,
          newName: ''
        };
      }
    }
  }, {
    key: 'updateStylesToRename',
    value: function updateStylesToRename(empty) {
      var renamedStyles = [];
      var renameCount = 0;

      for (var i = 0; i < this.styleInfo.length; i++) {
        var info = this.styleInfo[i];
        var found = !empty && this.find.test(info.name);
        var newName = void 0;

        if (found) {
          newName = info.name.replace(this.find, this.replace);

          if (newName.length === 0) {
            newName = '<empty>';
          } else {
            renameCount++;
          }

          if (this.nib.ivars.showMatchingStyles.boolValue()) {
            renamedStyles.push({
              style: info.style,
              oldName: info.name,
              newName: newName
            });
          } else {
            this.renamedStyles[i].newName = newName;
          }
        } else if (!this.nib.ivars.showMatchingStyles.boolValue()) {
          this.renamedStyles[i].newName = '';
        }
      }

      if (this.nib.ivars.showMatchingStyles.boolValue()) {
        this.renamedStyles = renamedStyles;
      }

      this.nib.ivars.renameCount = renameCount;
    }
  }, {
    key: 'updateRenamedStyles',
    value: function updateRenamedStyles() {
      var renameCount = 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.renamedStyles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var info = _step.value;

          if (info.newName) {
            info.newName = info.oldName.replace(this.find, this.replace);

            if (info.newName.length === 0) {
              info.newName = '<empty>';
            } else {
              renameCount++;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.nib.ivars.renameCount = renameCount;
    }
  }, {
    key: 'renameStyles',
    value: function renameStyles() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.renamedStyles[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var info = _step2.value;

          if (info.newName.length > 0) {
            var copy = info.style.copy();
            copy.setName(info.newName);
            info.style.syncPropertiesFromObject(copy);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.context.document.reloadInspector();
    }
  }, {
    key: 'alignLabelWithColumn',
    value: function alignLabelWithColumn(label, column) {
      var insets = this.nib.outlets.scrollView.contentInsets();
      var scrollViewOrigin = this.nib.outlets.scrollView.frame().origin;
      var cellOrigin = this.matrix.cellFrameAtRow_column(0, column).origin;
      var labelOrigin = label.frame().origin;
      labelOrigin.x = scrollViewOrigin.x + insets.left + cellOrigin.x;
      label.setFrameOrigin(labelOrigin);
    }
  }, {
    key: 'setMatrixData',
    value: function setMatrixData() {
      var maxWidth = 0;
      this.matrix.renewRows_columns(this.renamedStyles.length, PREVIEW_COLUMN_COUNT);
      this.matrix.sizeToCells();
      var cells = this.matrix.cells();

      for (var row = 0; row < this.renamedStyles.length; row++) {
        var info = this.renamedStyles[row];

        // After setting the cell's value, get its width so we can calculate
        // the maximum width we'll need for cells.
        var index = row * PREVIEW_COLUMN_COUNT;
        var cell = cells[index];
        cell.setFont(info.newName.length === 0 ? this.cellFontRegular : this.cellFontBold);
        cell.setStringValue(info.oldName);
        var size = cell.cellSize();
        maxWidth = Math.max(maxWidth, size.width);

        cell = cells[index + 1];
        cell.setFont(this.cellFontRegular);
        cell.setStringValue(info.newName);
        size = cell.cellSize();
        maxWidth = Math.max(maxWidth, size.width);
      }

      return NSMakeSize(maxWidth, cells[0].cellSize().height);
    }
  }, {
    key: 'initMatrix',
    value: function initMatrix() {
      var BORDER_STYLE = NSBezelBorder;

      var scrollViewSize = this.nib.outlets.scrollView.frame().size;
      var contentSize = NSScrollView.contentSizeForFrameSize_horizontalScrollerClass_verticalScrollerClass_borderType_controlSize_scrollerStyle(scrollViewSize, null, NSScroller, BORDER_STYLE, NSRegularControlSize, NSScrollerStyleOverlay);

      var insets = this.nib.outlets.scrollView.contentInsets();
      contentSize.width -= insets.left + insets.right;
      contentSize.height -= insets.top + insets.bottom;

      // Start with a default size, we'll fix that later
      var cellSize = NSMakeSize(100, 16);
      var cellPrototype = NSCell.alloc().initTextCell('');
      this.matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(0, 0, cellSize.width * PREVIEW_COLUMN_COUNT, cellSize.height * this.renamedStyles.length), NSListModeMatrix, cellPrototype, this.renamedStyles.length, PREVIEW_COLUMN_COUNT);

      cellSize = this.setMatrixData();

      // Add 25% to the cell width to allow for longer names when renaming
      cellSize.width *= 1.25;

      // Make sure the cell width is no less than half of the initial scrollview width
      var minWidth = Math.floor(scrollViewSize.width / 2);
      cellSize.width = Math.max(cellSize.width, minWidth);

      this.matrix.setCellSize(CGSizeMake(cellSize.width, cellSize.height));
      this.matrix.setIntercellSpacing(PREVIEW_CELL_SPACING);
      this.matrix.sizeToCells();

      this.nib.outlets.scrollView.setDocumentView(this.matrix);

      this.alignLabelWithColumn(this.nib.outlets.beforeLabel, 0);
      this.alignLabelWithColumn(this.nib.outlets.afterLabel, 1);

      // Resize the window to fit the matrix
      var matrixHeight = cellSize.height * PREVIEW_VISIBLE_ROWS;
      matrixHeight += PREVIEW_CELL_SPACING.height * (PREVIEW_VISIBLE_ROWS - 1);
      var matrixSize = NSMakeSize(this.matrix.frame().size.width, matrixHeight);

      // Now adjust the containing view width and column labels to fit the matrix
      var frameSize = NSScrollView.frameSizeForContentSize_horizontalScrollerClass_verticalScrollerClass_borderType_controlSize_scrollerStyle(matrixSize, null, NSScroller, BORDER_STYLE, NSRegularControlSize, NSScrollerStyleOverlay);

      // Take content insets into account
      frameSize.width += insets.left + insets.right;
      frameSize.height += insets.top + insets.bottom;

      // Calculate the difference in the old size vs. new size, apply that to the view frame
      var sizeDiff = NSMakeSize(frameSize.width - scrollViewSize.width, frameSize.height - scrollViewSize.height);
      var windowFrame = this.nib.outlets.window.frame();
      windowFrame.size.width += sizeDiff.width;
      windowFrame.size.height += sizeDiff.height;

      var minSize = this.nib.outlets.window.minSize();
      windowFrame.size.width = Math.max(windowFrame.size.width, minSize.width);
      windowFrame.size.height = Math.max(windowFrame.size.height, minSize.height);

      this.nib.outlets.window.setFrame_display(windowFrame, true);
    }
  }, {
    key: 'showAlert',
    value: function showAlert(message) {
      var alert = this.makeAlert();
      alert.setInformativeText(message);
      alert.runModal();
    }
  }, {
    key: 'showFindDialog',
    value: function showFindDialog() {
      if (this.styles.numberOfSharedStyles() === 0) {
        var alert = this.makeAlert();
        alert.setInformativeText('This document has no shared ' + this.layerType + ' styles.');
        alert.runModal();
        return 0;
      }

      this.loadNib();
      this.initStyleInfo();
      this.initMatrix();

      return NSApp.runModalForWindow(this.nib.outlets.window);
    }
  }, {
    key: 'run',
    value: function run() {
      var response = this.showFindDialog();

      if (response !== 0) {
        this.nib.outlets.window.orderOut(null);
      }

      return response;
    }
  }]);

  return SharedStyleRenamer;
}();

function renameTextStyles(context) {
  var styles = context.document.documentData().layerTextStyles();
  var renamer = new SharedStyleRenamer(context, styles, 'text');
  renamer.run();
}

function renameLayerStyles(context) {
  var styles = context.document.documentData().layerStyles();
  var renamer = new SharedStyleRenamer(context, styles, 'layer');
  renamer.run();
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regExpEscape = regExpEscape;
/* eslint no-control-regex: 0 */

/**
  Utility functions
*/

function regExpEscape(s) {
  return String(s).replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NibUI = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MochaJSDelegate = __webpack_require__(6);

var _MochaJSDelegate2 = _interopRequireDefault(_MochaJSDelegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NibUI = exports.NibUI = function () {
  function NibUI(context, resourceBundleName, nibName, delegate, ivars) {
    _classCallCheck(this, NibUI);

    var bundlePath = context.plugin.urlForResourceNamed(resourceBundleName).path();
    this._bundle = NSBundle.bundleWithPath(bundlePath);
    this._nibName = nibName;
    this._delegate = delegate;
    this.outlets = Object.create(null);
    this.ivars = Object.create(null);
    this._delegateProxy = null;

    // Construct a class that will be the nib's owner
    this._createNibOwner(nibName);

    // Get the list of outlets and actions as defined in the nib
    var connections = this._loadConnections(nibName);
    this._prepareOutletConnections(connections.outlets);

    if (delegate) {
      this._connectActionsToDelegate(connections.actions, delegate);
    }

    if (ivars) {
      this._addIvars(ivars);
    }

    // Now that the nib owner class is completely constructed, register it with the ObjC runtime
    this._registerNibOwner();

    if (ivars) {
      this._initIvars(ivars);
    }

    this._load();
  }

  // Create a class name that doesn't exist yet. Note that we can't reuse the same
  // definition lest Sketch will throw an MOJavaScriptException when binding the UI,
  // probably due to JavaScript context / plugin lifecycle incompatibility.


  _createClass(NibUI, [{
    key: '_createNibOwner',
    value: function _createNibOwner(nibName) {
      var className = void 0;

      do {
        className = nibName + NSUUID.UUID().UUIDString();
      } while (NSClassFromString(className) != null);

      this._cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, NSObject);

      // We need to add the NSObject protocol so it will be KVC compliant
      var protocol = MOProtocolDescription.descriptionForProtocolWithName('NSObject');
      this._cls.addProtocol(protocol);
    }
  }, {
    key: '_registerNibOwner',
    value: function _registerNibOwner() {
      this._cls.registerClass();
      this._nibOwner = NSClassFromString(this._cls.name()).alloc().init();
    }

    // Create setter methods that will be called when connecting each outlet during nib loading.
    // The setter methods register the connected view.

  }, {
    key: '_prepareOutletConnections',
    value: function _prepareOutletConnections(outlets) {
      var _this = this;

      var _loop = function _loop(i) {
        var outletName = outlets[i];
        var selector = 'set' + outletName.charAt(0).toUpperCase() + outletName.substring(1) + ':';
        var setterFunc = function setterFunc(view) {
          _this.outlets[outletName] = view;
        };

        _this._cls.addInstanceMethodWithSelector_function(NSSelectorFromString(selector), setterFunc);
      };

      for (var i = 0; i < outlets.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: '_connectDelegateMethods',
    value: function _connectDelegateMethods() {
      if (!this._delegate) {
        return;
      }

      var objectsToConnect = [];
      var view = null;

      if ('window' in this.outlets) {
        objectsToConnect.push(this.outlets.window);
        view = this.outlets.window.contentView();
      } else if ('view' in this.outlets) {
        view = this.outlets.view;
      }

      if (!view) {
        return;
      }

      this._checkForTextViewsToConnect(view, objectsToConnect);

      if (objectsToConnect.length) {
        var delegateProxy = this._getDelegateProxy();

        if (delegateProxy) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = objectsToConnect[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var object = _step.value;

              object.setDelegate(delegateProxy);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }
  }, {
    key: '_checkForTextViewsToConnect',
    value: function _checkForTextViewsToConnect(view, objectsToConnect) {
      var children = view.subviews();

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(children)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var childView = _step2.value;

          if (childView.isKindOfClass(NSTextField) && childView.isEditable() && childView.tag() > 0) {
            objectsToConnect.push(childView);
          }

          this._checkForTextViewsToConnect(childView, objectsToConnect);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: '_getDelegateProxy',
    value: function _getDelegateProxy() {
      if (!this._delegateProxy) {
        var selectors = ['windowWillClose:', 'control:textShouldBeginEditing:', 'controlTextDidBeginEditing:', 'controlTextDidChange:', 'control:textShouldEndEditing:', 'controlTextDidEndEditing:'];
        var delegateConfig = {};

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = selectors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var selector = _step3.value;

            var methodName = selector.replace(/(:.)/g, function (match, subpattern) {
              return subpattern.charAt(1).toUpperCase();
            }).replace(/:$/, '');

            var method = this._delegate[methodName];

            if (method) {
              delegateConfig[selector] = method.bind(this._delegate);
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var delegate = new _MochaJSDelegate2.default(delegateConfig);
        this._delegateProxy = delegate.getClassInstance();
      }

      return this._delegateProxy;
    }

    // Hook up actions with the delegate

  }, {
    key: '_connectActionsToDelegate',
    value: function _connectActionsToDelegate(actions, delegate) {
      var _this2 = this;

      var _loop2 = function _loop2(action) {
        var funcName = action.slice(0, -1); // Trim ':' from end of action
        var func = delegate[funcName];

        if (typeof func === 'function') {
          var forwardingFunc = function forwardingFunc(sender) {
            // javascriptCore tends to die a horrible death if an uncaught exception occurs in an action method
            try {
              func.call(delegate, sender);
            } catch (ex) {
              log(NSString.stringWithFormat('%@: %@\nStack:\n%@', ex.name, ex.message, ex.stack));
            }
          };

          _this2._cls.addInstanceMethodWithSelector_function(NSSelectorFromString(action), forwardingFunc);
        }
      };

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = actions[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var action = _step4.value;

          _loop2(action);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }, {
    key: '_addIvars',
    value: function _addIvars(ivars) {
      var _this3 = this;

      var _loop3 = function _loop3(name) {
        // Step 1: add an ivar to the nib owner class
        var value = ivars[name];
        var typeEncoding = _this3.constructor._typeEncodingForValue(value);

        if (!typeEncoding) {
          log('Cannot determine the type encoding for the ivar \'' + name + '\', value = ' + value);
          return 'continue';
        }

        if (_this3._cls.addInstanceVariableWithName_typeEncoding(name, typeEncoding)) {
          // Step 2: add a getter/setter to the ivar proxy object
          Object.defineProperty(_this3.ivars, name, {
            get: function get() {
              return _this3.getIvar(name);
            },
            set: function set(value) {
              return _this3.setIvar(name, value);
            }
          });
        } else {
          log('Unable to add ivar: ' + name);
        }
      };

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.keys(ivars)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var name = _step5.value;

          var _ret3 = _loop3(name);

          if (_ret3 === 'continue') continue;
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: '_initIvars',
    value: function _initIvars(ivars) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = Object.keys(ivars)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var name = _step6.value;

          this.setIvar(name, ivars[name]);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  }, {
    key: '_loadConnections',
    value: function _loadConnections(nibName) {
      var path = this._bundle.resourcePath() + '/' + nibName + '.json';
      var json = NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null);

      if (json) {
        return JSON.parse(json);
      }

      return {
        outlets: [],
        actions: []
      };
    }
  }, {
    key: '_load',
    value: function _load() {
      var tloPointer = MOPointer.alloc().initWithValue(null);

      if (!this._bundle.loadNibNamed_owner_topLevelObjects(this._nibName, this._nibOwner, tloPointer)) {
        throw new Error('Could not load nib \'' + this._nibName + '\'');
      }

      this._connectDelegateMethods();
    }
  }, {
    key: 'getIvar',
    value: function getIvar(name) {
      return this._nibOwner.valueForKey(name);
    }
  }, {
    key: 'setIvar',
    value: function setIvar(name, value) {
      this._nibOwner.setValue_forKey(value, name);
    }
  }], [{
    key: '_typeEncodingForValue',
    value: function _typeEncodingForValue(value) {
      var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);

      switch (valueType) {
        case 'string':
        case 'object':
          return '@';

        case 'number':
          return 'd';

        case 'boolean':
          return 'i';

        default:
          return null;
      }
    }
  }]);

  return NibUI;
}();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MochaJSDelegate = function () {
  function MochaJSDelegate(selectorHandlerDict, superclass) {
    _classCallCheck(this, MochaJSDelegate);

    this.uniqueClassName = 'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString();
    this.delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(this.uniqueClassName, superclass || NSObject);
    this.delegateClassDesc.registerClass();
    this.handlers = {};

    if ((typeof selectorHandlerDict === 'undefined' ? 'undefined' : _typeof(selectorHandlerDict)) === 'object') {
      var selectors = Object.keys(selectorHandlerDict);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = selectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var selectorString = _step.value;

          this.setHandlerForSelector(selectorString, selectorHandlerDict[selectorString]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  _createClass(MochaJSDelegate, [{
    key: 'setHandlerForSelector',
    value: function setHandlerForSelector(selectorString, func) {
      var handlerHasBeenSet = selectorString in this.handlers;
      this.handlers[selectorString] = func;

      /*
        For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
        We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
      */
      if (!handlerHasBeenSet) {
        var args = [];
        var regex = /:/g;

        while (regex.exec(selectorString)) {
          args.push('arg' + args.length);
        }

        // JavascriptCore tends to die a horrible death if an uncaught exception occurs in an action method
        var body = '{\n        try {\n          return func.apply(this, arguments)\n        }\n        catch(ex) {\n          log(ex)\n        }\n      }';
        var code = NSString.stringWithFormat('(function (%@) %@)', args.join(', '), body);
        var dynamicFunction = eval(String(code));
        var selector = NSSelectorFromString(selectorString);
        this.delegateClassDesc.addInstanceMethodWithSelector_function_(selector, dynamicFunction);
      }
    }
  }, {
    key: 'removeHandlerForSelector',
    value: function removeHandlerForSelector(selectorString) {
      delete this.handlers[selectorString];
    }
  }, {
    key: 'getHandlerForSelector',
    value: function getHandlerForSelector(selectorString) {
      return this.handlers[selectorString];
    }
  }, {
    key: 'getAllHandlers',
    value: function getAllHandlers() {
      return this.handlers;
    }
  }, {
    key: 'getClass',
    value: function getClass() {
      return NSClassFromString(this.uniqueClassName);
    }
  }, {
    key: 'getClassInstance',
    value: function getClassInstance() {
      return this.getClass().new();
    }
  }]);

  return MochaJSDelegate;
}();

exports.default = MochaJSDelegate;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "364254f0-5b9d-11e8-9e19-7fc4f2360286";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "36283d40-5b9d-11e8-9e19-7fc4f2360286";

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}

that['onRun'] = run.bind(this, 'default');
that['renameTextStyles'] = run.bind(this, 'renameTextStyles');
that['renameLayerStyles'] = run.bind(this, 'renameLayerStyles');
