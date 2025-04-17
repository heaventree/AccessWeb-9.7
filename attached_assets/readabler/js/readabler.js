/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/micromodal/dist/micromodal.es.js":
/*!*******************************************************!*\
  !*** ./node_modules/micromodal/dist/micromodal.es.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function e(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function t(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return o(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var n,i,a,r,s,l=(n=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'],i=function(){function o(e){var n=e.targetModal,i=e.triggers,a=void 0===i?[]:i,r=e.onShow,s=void 0===r?function(){}:r,l=e.onClose,c=void 0===l?function(){}:l,d=e.openTrigger,u=void 0===d?"data-micromodal-trigger":d,f=e.closeTrigger,h=void 0===f?"data-micromodal-close":f,v=e.openClass,g=void 0===v?"is-open":v,m=e.disableScroll,b=void 0!==m&&m,y=e.disableFocus,p=void 0!==y&&y,w=e.awaitCloseAnimation,E=void 0!==w&&w,k=e.awaitOpenAnimation,M=void 0!==k&&k,A=e.debugMode,C=void 0!==A&&A;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),this.modal=document.getElementById(n),this.config={debugMode:C,disableScroll:b,openTrigger:u,closeTrigger:h,openClass:g,onShow:s,onClose:c,awaitCloseAnimation:E,awaitOpenAnimation:M,disableFocus:p},a.length>0&&this.registerTriggers.apply(this,t(a)),this.onClick=this.onClick.bind(this),this.onKeydown=this.onKeydown.bind(this)}var i,a,r;return i=o,(a=[{key:"registerTriggers",value:function(){for(var e=this,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];o.filter(Boolean).forEach((function(t){t.addEventListener("click",(function(t){return e.showModal(t)}))}))}},{key:"showModal",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.activeElement=document.activeElement,this.modal.setAttribute("aria-hidden","false"),this.modal.classList.add(this.config.openClass),this.scrollBehaviour("disable"),this.addEventListeners(),this.config.awaitOpenAnimation){var o=function t(){e.modal.removeEventListener("animationend",t,!1),e.setFocusToFirstNode()};this.modal.addEventListener("animationend",o,!1)}else this.setFocusToFirstNode();this.config.onShow(this.modal,this.activeElement,t)}},{key:"closeModal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=this.modal;if(this.modal.setAttribute("aria-hidden","true"),this.removeEventListeners(),this.scrollBehaviour("enable"),this.activeElement&&this.activeElement.focus&&this.activeElement.focus(),this.config.onClose(this.modal,this.activeElement,e),this.config.awaitCloseAnimation){var o=this.config.openClass;this.modal.addEventListener("animationend",(function e(){t.classList.remove(o),t.removeEventListener("animationend",e,!1)}),!1)}else t.classList.remove(this.config.openClass)}},{key:"closeModalById",value:function(e){this.modal=document.getElementById(e),this.modal&&this.closeModal()}},{key:"scrollBehaviour",value:function(e){if(this.config.disableScroll){var t=document.querySelector("body");switch(e){case"enable":Object.assign(t.style,{overflow:""});break;case"disable":Object.assign(t.style,{overflow:"hidden"})}}}},{key:"addEventListeners",value:function(){this.modal.addEventListener("touchstart",this.onClick),this.modal.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onKeydown)}},{key:"removeEventListeners",value:function(){this.modal.removeEventListener("touchstart",this.onClick),this.modal.removeEventListener("click",this.onClick),document.removeEventListener("keydown",this.onKeydown)}},{key:"onClick",value:function(e){(e.target.hasAttribute(this.config.closeTrigger)||e.target.parentNode.hasAttribute(this.config.closeTrigger))&&(e.preventDefault(),e.stopPropagation(),this.closeModal(e))}},{key:"onKeydown",value:function(e){27===e.keyCode&&this.closeModal(e),9===e.keyCode&&this.retainFocus(e)}},{key:"getFocusableNodes",value:function(){var e=this.modal.querySelectorAll(n);return Array.apply(void 0,t(e))}},{key:"setFocusToFirstNode",value:function(){var e=this;if(!this.config.disableFocus){var t=this.getFocusableNodes();if(0!==t.length){var o=t.filter((function(t){return!t.hasAttribute(e.config.closeTrigger)}));o.length>0&&o[0].focus(),0===o.length&&t[0].focus()}}}},{key:"retainFocus",value:function(e){var t=this.getFocusableNodes();if(0!==t.length)if(t=t.filter((function(e){return null!==e.offsetParent})),this.modal.contains(document.activeElement)){var o=t.indexOf(document.activeElement);e.shiftKey&&0===o&&(t[t.length-1].focus(),e.preventDefault()),!e.shiftKey&&t.length>0&&o===t.length-1&&(t[0].focus(),e.preventDefault())}else t[0].focus()}}])&&e(i.prototype,a),r&&e(i,r),o}(),a=null,r=function(e){if(!document.getElementById(e))return console.warn("MicroModal: ❗Seems like you have missed %c'".concat(e,"'"),"background-color: #f8f9fa;color: #50596c;font-weight: bold;","ID somewhere in your code. Refer example below to resolve it."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<div class="modal" id="'.concat(e,'"></div>')),!1},s=function(e,t){if(function(e){e.length<=0&&(console.warn("MicroModal: ❗Please specify at least one %c'micromodal-trigger'","background-color: #f8f9fa;color: #50596c;font-weight: bold;","data attribute."),console.warn("%cExample:","background-color: #f8f9fa;color: #50596c;font-weight: bold;",'<a href="#" data-micromodal-trigger="my-modal"></a>'))}(e),!t)return!0;for(var o in t)r(o);return!0},{init:function(e){var o=Object.assign({},{openTrigger:"data-micromodal-trigger"},e),n=t(document.querySelectorAll("[".concat(o.openTrigger,"]"))),r=function(e,t){var o=[];return e.forEach((function(e){var n=e.attributes[t].value;void 0===o[n]&&(o[n]=[]),o[n].push(e)})),o}(n,o.openTrigger);if(!0!==o.debugMode||!1!==s(n,r))for(var l in r){var c=r[l];o.targetModal=l,o.triggers=t(c),a=new i(o)}},show:function(e,t){var o=t||{};o.targetModal=e,!0===o.debugMode&&!1===r(e)||(a&&a.removeEventListeners(),(a=new i(o)).showModal())},close:function(e){e?a.closeModalById(e):a.closeModal()}});"undefined"!=typeof window&&(window.MicroModal=l);/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (l);


/***/ }),

/***/ "./node_modules/tippy.js/dist/tippy.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/tippy.js/dist/tippy.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animateFill: () => (/* binding */ animateFill),
/* harmony export */   createSingleton: () => (/* binding */ createSingleton),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   delegate: () => (/* binding */ delegate),
/* harmony export */   followCursor: () => (/* binding */ followCursor),
/* harmony export */   hideAll: () => (/* binding */ hideAll),
/* harmony export */   inlinePositioning: () => (/* binding */ inlinePositioning),
/* harmony export */   roundArrow: () => (/* binding */ ROUND_ARROW),
/* harmony export */   sticky: () => (/* binding */ sticky)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/


var ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};

function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function isElement(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser ? // @ts-ignore
!!window.msCrypto : false;

function createMemoryLeakWarning(method) {
  var txt = method === 'destroy' ? 'n already-' : ' ';
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
}

function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
}

function getFormattedMessage(message) {
  return [getDevMessage(message), // title
  'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
  'line-height: 1.5', // footer
  'color: #a6a095;'];
} // Assume warnings and errors never have the same message

var visitedMessages;

if (true) {
  resetVisitedMessages();
}

function resetVisitedMessages() {
  visitedMessages = new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;

    visitedMessages.add(message);

    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;

    visitedMessages.add(message);

    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
  errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
}

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {
  /* istanbul ignore else */
  if (true) {
    validateProps(partialProps, []);
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }

  if (plugins === void 0) {
    plugins = [];
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop); // Check if the prop exists in `plugins`

    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function (plugin) {
        return plugin.name === prop;
      }).length === 0;
    }

    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
  });
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {
    if (true) {
      errorWhen(true, 'render() function has not been supplied.');
    }

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
    /* istanbul ignore else */

    if (true) {
      // Accessibility check
      warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ['Interactive tippy element may not be accessible via keyboard', 'navigation because it is not directly after the reference element', 'in the DOM source order.', '\n\n', 'Using a wrapper <div> or <span> tag around the reference element', 'solves this by creating a new parentNode context.', '\n\n', 'Specifying `appendTo: document.body` silences this warning, but it', 'assumes you are using a focus management solution to handle', 'keyboard navigation.', '\n\n', 'See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity'].join(' '));
    }
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('setProps'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('show'));
    } // Early bail-out


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hide'));
    } // Early bail-out


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hideWithInteractivity'));
    }

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('unmount'));
    }

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('destroy'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  /* istanbul ignore else */

  if (true) {
    validateTargets(targets);
    validateProps(optionalProps, plugins);
  }

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);
  /* istanbul ignore else */

  if (true) {
    var isSingleContentElement = isElement(passedProps.content);
    var isMoreThanOneReferenceElement = elements.length > 1;
    warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ['tippy() was passed an Element as the `content` prop, but more than', 'one tippy instance was created by this invocation. This means the', 'content element will only be appended to the last tippy instance.', '\n\n', 'Instead, pass the .innerHTML of the element, or use a function that', 'returns a cloned version of the element instead.', '\n\n', '1) content: element.innerHTML\n', '2) content: () => element.cloneNode(true)'].join(' '));
  }

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var hideAll = function hideAll(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      excludedReferenceOrInstance = _ref.exclude,
      duration = _ref.duration;

  mountedInstances.forEach(function (instance) {
    var isExcluded = false;

    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
    }

    if (!isExcluded) {
      var originalDuration = instance.props.duration;
      instance.setProps({
        duration: duration
      });
      instance.hide();

      if (!instance.state.isDestroyed) {
        instance.setProps({
          duration: originalDuration
        });
      }
    }
  });
};

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

var applyStylesModifier = Object.assign({}, _popperjs_core__WEBPACK_IMPORTED_MODULE_1__["default"], {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

var createSingleton = function createSingleton(tippyInstances, optionalProps) {
  var _optionalProps$popper;

  if (optionalProps === void 0) {
    optionalProps = {};
  }

  /* istanbul ignore else */
  if (true) {
    errorWhen(!Array.isArray(tippyInstances), ['The first argument passed to createSingleton() must be an array of', 'tippy instances. The passed value was', String(tippyInstances)].join(' '));
  }

  var individualInstances = tippyInstances;
  var references = [];
  var triggerTargets = [];
  var currentTarget;
  var overrides = optionalProps.overrides;
  var interceptSetPropsCleanups = [];
  var shownOnCreate = false;

  function setTriggerTargets() {
    triggerTargets = individualInstances.map(function (instance) {
      return normalizeToArray(instance.props.triggerTarget || instance.reference);
    }).reduce(function (acc, item) {
      return acc.concat(item);
    }, []);
  }

  function setReferences() {
    references = individualInstances.map(function (instance) {
      return instance.reference;
    });
  }

  function enableInstances(isEnabled) {
    individualInstances.forEach(function (instance) {
      if (isEnabled) {
        instance.enable();
      } else {
        instance.disable();
      }
    });
  }

  function interceptSetProps(singleton) {
    return individualInstances.map(function (instance) {
      var originalSetProps = instance.setProps;

      instance.setProps = function (props) {
        originalSetProps(props);

        if (instance.reference === currentTarget) {
          singleton.setProps(props);
        }
      };

      return function () {
        instance.setProps = originalSetProps;
      };
    });
  } // have to pass singleton, as it maybe undefined on first call


  function prepareInstance(singleton, target) {
    var index = triggerTargets.indexOf(target); // bail-out

    if (target === currentTarget) {
      return;
    }

    currentTarget = target;
    var overrideProps = (overrides || []).concat('content').reduce(function (acc, prop) {
      acc[prop] = individualInstances[index].props[prop];
      return acc;
    }, {});
    singleton.setProps(Object.assign({}, overrideProps, {
      getReferenceClientRect: typeof overrideProps.getReferenceClientRect === 'function' ? overrideProps.getReferenceClientRect : function () {
        var _references$index;

        return (_references$index = references[index]) == null ? void 0 : _references$index.getBoundingClientRect();
      }
    }));
  }

  enableInstances(false);
  setReferences();
  setTriggerTargets();
  var plugin = {
    fn: function fn() {
      return {
        onDestroy: function onDestroy() {
          enableInstances(true);
        },
        onHidden: function onHidden() {
          currentTarget = null;
        },
        onClickOutside: function onClickOutside(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            currentTarget = null;
          }
        },
        onShow: function onShow(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            prepareInstance(instance, references[0]);
          }
        },
        onTrigger: function onTrigger(instance, event) {
          prepareInstance(instance, event.currentTarget);
        }
      };
    }
  };
  var singleton = tippy(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
    plugins: [plugin].concat(optionalProps.plugins || []),
    triggerTarget: triggerTargets,
    popperOptions: Object.assign({}, optionalProps.popperOptions, {
      modifiers: [].concat(((_optionalProps$popper = optionalProps.popperOptions) == null ? void 0 : _optionalProps$popper.modifiers) || [], [applyStylesModifier])
    })
  }));
  var originalShow = singleton.show;

  singleton.show = function (target) {
    originalShow(); // first time, showOnCreate or programmatic call with no params
    // default to showing first instance

    if (!currentTarget && target == null) {
      return prepareInstance(singleton, references[0]);
    } // triggered from event (do nothing as prepareInstance already called by onTrigger)
    // programmatic call with no params when already visible (do nothing again)


    if (currentTarget && target == null) {
      return;
    } // target is index of instance


    if (typeof target === 'number') {
      return references[target] && prepareInstance(singleton, references[target]);
    } // target is a child tippy instance


    if (individualInstances.indexOf(target) >= 0) {
      var ref = target.reference;
      return prepareInstance(singleton, ref);
    } // target is a ReferenceElement


    if (references.indexOf(target) >= 0) {
      return prepareInstance(singleton, target);
    }
  };

  singleton.showNext = function () {
    var first = references[0];

    if (!currentTarget) {
      return singleton.show(0);
    }

    var index = references.indexOf(currentTarget);
    singleton.show(references[index + 1] || first);
  };

  singleton.showPrevious = function () {
    var last = references[references.length - 1];

    if (!currentTarget) {
      return singleton.show(last);
    }

    var index = references.indexOf(currentTarget);
    var target = references[index - 1] || last;
    singleton.show(target);
  };

  var originalSetProps = singleton.setProps;

  singleton.setProps = function (props) {
    overrides = props.overrides || overrides;
    originalSetProps(props);
  };

  singleton.setInstances = function (nextInstances) {
    enableInstances(true);
    interceptSetPropsCleanups.forEach(function (fn) {
      return fn();
    });
    individualInstances = nextInstances;
    enableInstances(false);
    setReferences();
    setTriggerTargets();
    interceptSetPropsCleanups = interceptSetProps(singleton);
    singleton.setProps({
      triggerTarget: triggerTargets
    });
  };

  interceptSetPropsCleanups = interceptSetProps(singleton);
  return singleton;
};

var BUBBLING_EVENTS_MAP = {
  mouseover: 'mouseenter',
  focusin: 'focus',
  click: 'click'
};
/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */

function delegate(targets, props) {
  /* istanbul ignore else */
  if (true) {
    errorWhen(!(props && props.target), ['You must specity a `target` prop indicating a CSS selector string matching', 'the target elements that should receive a tippy.'].join(' '));
  }

  var listeners = [];
  var childTippyInstances = [];
  var disabled = false;
  var target = props.target;
  var nativeProps = removeProperties(props, ['target']);
  var parentProps = Object.assign({}, nativeProps, {
    trigger: 'manual',
    touch: false
  });
  var childProps = Object.assign({
    touch: defaultProps.touch
  }, nativeProps, {
    showOnCreate: true
  });
  var returnValue = tippy(targets, parentProps);
  var normalizedReturnValue = normalizeToArray(returnValue);

  function onTrigger(event) {
    if (!event.target || disabled) {
      return;
    }

    var targetNode = event.target.closest(target);

    if (!targetNode) {
      return;
    } // Get relevant trigger with fallbacks:
    // 1. Check `data-tippy-trigger` attribute on target node
    // 2. Fallback to `trigger` passed to `delegate()`
    // 3. Fallback to `defaultProps.trigger`


    var trigger = targetNode.getAttribute('data-tippy-trigger') || props.trigger || defaultProps.trigger; // @ts-ignore

    if (targetNode._tippy) {
      return;
    }

    if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
      return;
    }

    if (event.type !== 'touchstart' && trigger.indexOf(BUBBLING_EVENTS_MAP[event.type]) < 0) {
      return;
    }

    var instance = tippy(targetNode, childProps);

    if (instance) {
      childTippyInstances = childTippyInstances.concat(instance);
    }
  }

  function on(node, eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(eventType, handler, options);
    listeners.push({
      node: node,
      eventType: eventType,
      handler: handler,
      options: options
    });
  }

  function addEventListeners(instance) {
    var reference = instance.reference;
    on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
    on(reference, 'mouseover', onTrigger);
    on(reference, 'focusin', onTrigger);
    on(reference, 'click', onTrigger);
  }

  function removeEventListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function applyMutations(instance) {
    var originalDestroy = instance.destroy;
    var originalEnable = instance.enable;
    var originalDisable = instance.disable;

    instance.destroy = function (shouldDestroyChildInstances) {
      if (shouldDestroyChildInstances === void 0) {
        shouldDestroyChildInstances = true;
      }

      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach(function (instance) {
          instance.destroy();
        });
      }

      childTippyInstances = [];
      removeEventListeners();
      originalDestroy();
    };

    instance.enable = function () {
      originalEnable();
      childTippyInstances.forEach(function (instance) {
        return instance.enable();
      });
      disabled = false;
    };

    instance.disable = function () {
      originalDisable();
      childTippyInstances.forEach(function (instance) {
        return instance.disable();
      });
      disabled = true;
    };

    addEventListeners(instance);
  }

  normalizedReturnValue.forEach(applyMutations);
  return returnValue;
}

var animateFill = {
  name: 'animateFill',
  defaultValue: false,
  fn: function fn(instance) {
    var _instance$props$rende;

    // @ts-ignore
    if (!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy)) {
      if (true) {
        errorWhen(instance.props.animateFill, 'The `animateFill` plugin requires the default render function.');
      }

      return {};
    }

    var _getChildren = getChildren(instance.popper),
        box = _getChildren.box,
        content = _getChildren.content;

    var backdrop = instance.props.animateFill ? createBackdropElement() : null;
    return {
      onCreate: function onCreate() {
        if (backdrop) {
          box.insertBefore(backdrop, box.firstElementChild);
          box.setAttribute('data-animatefill', '');
          box.style.overflow = 'hidden';
          instance.setProps({
            arrow: false,
            animation: 'shift-away'
          });
        }
      },
      onMount: function onMount() {
        if (backdrop) {
          var transitionDuration = box.style.transitionDuration;
          var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
          // tooltip element. `clip-path` is the other alternative but is not
          // well-supported and is buggy on some devices.

          content.style.transitionDelay = Math.round(duration / 10) + "ms";
          backdrop.style.transitionDuration = transitionDuration;
          setVisibilityState([backdrop], 'visible');
        }
      },
      onShow: function onShow() {
        if (backdrop) {
          backdrop.style.transitionDuration = '0ms';
        }
      },
      onHide: function onHide() {
        if (backdrop) {
          setVisibilityState([backdrop], 'hidden');
        }
      }
    };
  }
};

function createBackdropElement() {
  var backdrop = div();
  backdrop.className = BACKDROP_CLASS;
  setVisibilityState([backdrop], 'hidden');
  return backdrop;
}

var mouseCoords = {
  clientX: 0,
  clientY: 0
};
var activeInstances = [];

function storeMouseCoords(_ref) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY;
  mouseCoords = {
    clientX: clientX,
    clientY: clientY
  };
}

function addMouseCoordsListener(doc) {
  doc.addEventListener('mousemove', storeMouseCoords);
}

function removeMouseCoordsListener(doc) {
  doc.removeEventListener('mousemove', storeMouseCoords);
}

var followCursor = {
  name: 'followCursor',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;
    var doc = getOwnerDocument(instance.props.triggerTarget || reference);
    var isInternalUpdate = false;
    var wasFocusEvent = false;
    var isUnmounted = true;
    var prevProps = instance.props;

    function getIsInitialBehavior() {
      return instance.props.followCursor === 'initial' && instance.state.isVisible;
    }

    function addListener() {
      doc.addEventListener('mousemove', onMouseMove);
    }

    function removeListener() {
      doc.removeEventListener('mousemove', onMouseMove);
    }

    function unsetGetReferenceClientRect() {
      isInternalUpdate = true;
      instance.setProps({
        getReferenceClientRect: null
      });
      isInternalUpdate = false;
    }

    function onMouseMove(event) {
      // If the instance is interactive, avoid updating the position unless it's
      // over the reference element
      var isCursorOverReference = event.target ? reference.contains(event.target) : true;
      var followCursor = instance.props.followCursor;
      var clientX = event.clientX,
          clientY = event.clientY;
      var rect = reference.getBoundingClientRect();
      var relativeX = clientX - rect.left;
      var relativeY = clientY - rect.top;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.setProps({
          // @ts-ignore - unneeded DOMRect properties
          getReferenceClientRect: function getReferenceClientRect() {
            var rect = reference.getBoundingClientRect();
            var x = clientX;
            var y = clientY;

            if (followCursor === 'initial') {
              x = rect.left + relativeX;
              y = rect.top + relativeY;
            }

            var top = followCursor === 'horizontal' ? rect.top : y;
            var right = followCursor === 'vertical' ? rect.right : x;
            var bottom = followCursor === 'horizontal' ? rect.bottom : y;
            var left = followCursor === 'vertical' ? rect.left : x;
            return {
              width: right - left,
              height: bottom - top,
              top: top,
              right: right,
              bottom: bottom,
              left: left
            };
          }
        });
      }
    }

    function create() {
      if (instance.props.followCursor) {
        activeInstances.push({
          instance: instance,
          doc: doc
        });
        addMouseCoordsListener(doc);
      }
    }

    function destroy() {
      activeInstances = activeInstances.filter(function (data) {
        return data.instance !== instance;
      });

      if (activeInstances.filter(function (data) {
        return data.doc === doc;
      }).length === 0) {
        removeMouseCoordsListener(doc);
      }
    }

    return {
      onCreate: create,
      onDestroy: destroy,
      onBeforeUpdate: function onBeforeUpdate() {
        prevProps = instance.props;
      },
      onAfterUpdate: function onAfterUpdate(_, _ref2) {
        var followCursor = _ref2.followCursor;

        if (isInternalUpdate) {
          return;
        }

        if (followCursor !== undefined && prevProps.followCursor !== followCursor) {
          destroy();

          if (followCursor) {
            create();

            if (instance.state.isMounted && !wasFocusEvent && !getIsInitialBehavior()) {
              addListener();
            }
          } else {
            removeListener();
            unsetGetReferenceClientRect();
          }
        }
      },
      onMount: function onMount() {
        if (instance.props.followCursor && !wasFocusEvent) {
          if (isUnmounted) {
            onMouseMove(mouseCoords);
            isUnmounted = false;
          }

          if (!getIsInitialBehavior()) {
            addListener();
          }
        }
      },
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          mouseCoords = {
            clientX: event.clientX,
            clientY: event.clientY
          };
        }

        wasFocusEvent = event.type === 'focus';
      },
      onHidden: function onHidden() {
        if (instance.props.followCursor) {
          unsetGetReferenceClientRect();
          removeListener();
          isUnmounted = true;
        }
      }
    };
  }
};

function getProps(props, modifier) {
  var _props$popperOptions;

  return {
    popperOptions: Object.assign({}, props.popperOptions, {
      modifiers: [].concat((((_props$popperOptions = props.popperOptions) == null ? void 0 : _props$popperOptions.modifiers) || []).filter(function (_ref) {
        var name = _ref.name;
        return name !== modifier.name;
      }), [modifier])
    })
  };
}

var inlinePositioning = {
  name: 'inlinePositioning',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;

    function isEnabled() {
      return !!instance.props.inlinePositioning;
    }

    var placement;
    var cursorRectIndex = -1;
    var isInternalUpdate = false;
    var triedPlacements = [];
    var modifier = {
      name: 'tippyInlinePositioning',
      enabled: true,
      phase: 'afterWrite',
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (isEnabled()) {
          if (triedPlacements.indexOf(state.placement) !== -1) {
            triedPlacements = [];
          }

          if (placement !== state.placement && triedPlacements.indexOf(state.placement) === -1) {
            triedPlacements.push(state.placement);
            instance.setProps({
              // @ts-ignore - unneeded DOMRect properties
              getReferenceClientRect: function getReferenceClientRect() {
                return _getReferenceClientRect(state.placement);
              }
            });
          }

          placement = state.placement;
        }
      }
    };

    function _getReferenceClientRect(placement) {
      return getInlineBoundingClientRect(getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
    }

    function setInternalProps(partialProps) {
      isInternalUpdate = true;
      instance.setProps(partialProps);
      isInternalUpdate = false;
    }

    function addModifier() {
      if (!isInternalUpdate) {
        setInternalProps(getProps(instance.props, modifier));
      }
    }

    return {
      onCreate: addModifier,
      onAfterUpdate: addModifier,
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          var rects = arrayFrom(instance.reference.getClientRects());
          var cursorRect = rects.find(function (rect) {
            return rect.left - 2 <= event.clientX && rect.right + 2 >= event.clientX && rect.top - 2 <= event.clientY && rect.bottom + 2 >= event.clientY;
          });
          var index = rects.indexOf(cursorRect);
          cursorRectIndex = index > -1 ? index : cursorRectIndex;
        }
      },
      onHidden: function onHidden() {
        cursorRectIndex = -1;
      }
    };
  }
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
  // Not an inline element, or placement is not yet known
  if (clientRects.length < 2 || currentBasePlacement === null) {
    return boundingRect;
  } // There are two rects and they are disjoined


  if (clientRects.length === 2 && cursorRectIndex >= 0 && clientRects[0].left > clientRects[1].right) {
    return clientRects[cursorRectIndex] || boundingRect;
  }

  switch (currentBasePlacement) {
    case 'top':
    case 'bottom':
      {
        var firstRect = clientRects[0];
        var lastRect = clientRects[clientRects.length - 1];
        var isTop = currentBasePlacement === 'top';
        var top = firstRect.top;
        var bottom = lastRect.bottom;
        var left = isTop ? firstRect.left : lastRect.left;
        var right = isTop ? firstRect.right : lastRect.right;
        var width = right - left;
        var height = bottom - top;
        return {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        };
      }

    case 'left':
    case 'right':
      {
        var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
          return rects.left;
        }));
        var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
          return rects.right;
        }));
        var measureRects = clientRects.filter(function (rect) {
          return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
        });
        var _top = measureRects[0].top;
        var _bottom = measureRects[measureRects.length - 1].bottom;
        var _left = minLeft;
        var _right = maxRight;

        var _width = _right - _left;

        var _height = _bottom - _top;

        return {
          top: _top,
          bottom: _bottom,
          left: _left,
          right: _right,
          width: _width,
          height: _height
        };
      }

    default:
      {
        return boundingRect;
      }
  }
}

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function getReference() {
      return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
    }

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        if (instance.popperInstance) {
          instance.popperInstance.update();
        }
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

tippy.setDefaultProps({
  render: render
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tippy);

//# sourceMappingURL=tippy.esm.js.map


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/actions/actionKeyboardNavigation.js":
/*!************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/actions/actionKeyboardNavigation.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionKeyboardNavigation: () => (/* binding */ actionKeyboardNavigation)
/* harmony export */ });
/* harmony import */ var _includes_utilities_focus_snail__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../includes/utilities/focus-snail */ "./wp-content/plugins/readabler/source/js/includes/utilities/focus-snail.js");


/**
 * Keyboard Navigation.
 **/
let actionKeyboardNavigation = {

    /**
     * Initialise Keyboard Navigation action.
     **/
    init: function () {

        /** Listen for Keyboard Navigation change. */
        let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation' );
        keyboardNavigation.addEventListener( 'ReadablerToggleBoxChanged', actionKeyboardNavigation.keyboardNavigation );

    },

    keyboardNavigation: function ( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-keyboard-navigation' );

            /** Restore original tabIndexes. */
            actionKeyboardNavigation.restoreOriginalTabIndex();

            /** Disable Focus Snail. */
            _includes_utilities_focus_snail__WEBPACK_IMPORTED_MODULE_0__.focusSnail.enabled = false;

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-keyboard-navigation' );

        /** Make all elements focusable. */
        actionKeyboardNavigation.makeFocusable();

        /** Enable Focus Snail. */
        _includes_utilities_focus_snail__WEBPACK_IMPORTED_MODULE_0__.focusSnail.enabled = true;

    },

    /**
     * Make all elements focusable.
     **/
    makeFocusable: function () {

        document.querySelectorAll(
            'nav, [role="navigation"], ' +                          // Make all Menus focusable.
            'h1, h2, h3, h4, h5, h6, [role="heading"], ' +                  // Make all Headings focusable.
            'form:not([disabled]), ' +                                      // Make all Forms focusable.
            'button:not([disabled]), [role="button"]:not([disabled]), ' +   // Make all Buttons focusable.
            'img, picture, svg'                                             // Make all Graphics focusable.
        ).forEach((element) => {

            /** Don't change tabIndex if element already has it. */
            if ( element.tabIndex < 0 ) {
                element.dataset.readablerOriginalTabIndex = element.tabIndex;
                element.tabIndex = 0;
            }

        } );

    },

    /**
     * Restore original tabIndex value.
     **/
    restoreOriginalTabIndex: function () {

        document.querySelectorAll(
            'nav, [role="navigation"], ' +                          // Make all Menus focusable.
            'h1, h2, h3, h4, h5, h6, [role="heading"], ' +                  // Make all Headings focusable.
            'form:not([disabled]), ' +                                      // Make all Forms focusable.
            'button:not([disabled]), [role="button"]:not([disabled]), ' +   // Make all Buttons focusable.
            'img, picture, svg'                                             // Make all Graphics focusable.
        ).forEach( ( element ) => {

            /** If element has original tabIndex - set it. */
            if ( null != element.dataset.readablerOriginalTabIndex ) {
                element.tabIndex = element.dataset.readablerOriginalTabIndex;
                delete element.dataset.readablerOriginalTabIndex;
            }

        } );

    },

    /**
     * Set focus to next/prev element.
     **/
    setFocus: function ( focusableElements, next = true ) {

        if ( document.activeElement ) {

            let focusable = Array.prototype.filter.call( document.querySelectorAll( focusableElements ),
                function ( element ) {

                    /** Check for visibility while always include the current activeElement. */
                    return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement

                } );

            let index = focusable.indexOf( document.activeElement );

            if ( index > -1 ) {

                let nextElement;

                /** Next element. */
                if ( next ) {

                    nextElement = focusable[index + 1] || focusable[0];

                }

                /** Prev element. */
                else {

                    nextElement = focusable[index - 1] || focusable[focusable.length - 1];

                }

                nextElement.focus();

            } else {

                /** Next element. */
                if ( next ) {

                    focusable[0].focus();

                }

                /** Prev element. */
                else {
                    focusable[focusable.length - 1].focus();
                }

            }

        }

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/actions/actionVirtualKeyboard.js":
/*!*********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/actions/actionVirtualKeyboard.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionVirtualKeyboard: () => (/* binding */ actionVirtualKeyboard)
/* harmony export */ });
/* harmony import */ var _includes_utilities_language__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../includes/utilities/language */ "./wp-content/plugins/readabler/source/js/includes/utilities/language.js");


const options = window.mdpReadablerOptions ?? {};

/**
 * Virtual Keyboard.
 **/
let actionVirtualKeyboard = {

    /**
     * Keyboard Window.
     **/
    keyboardBox: document.getElementById( 'mdp-readabler-keyboard-box' ),

    /**
     * Virtual Keyboard instance.
     **/
    keyboard: null,

    selectedInput: null,

    /**
     * Initialise Virtual Keyboard action.
     **/
    init: function () {

        if ( ! options.virtualKeyboard ) { return; }

        /** Listen for Virtual Keyboard change. */
        let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard' );
        virtualKeyboard.addEventListener( 'ReadablerToggleBoxChanged', actionVirtualKeyboard.virtualKeyboard );

        /**
         * Attach events to input and textarea.
         **/
        document.addEventListener( 'focusin', () => {

            const $focused = actionVirtualKeyboard.isTextInput();
            const $keyboardBox = actionVirtualKeyboard.keyboardBox;

            if ( $focused ) {

                actionVirtualKeyboard.onInputFocus( $focused );
                $focused.addEventListener( 'input', actionVirtualKeyboard.onInputChange );

            } else {

                if ( $keyboardBox.style !== 'none' ) {
                    $keyboardBox.style.display = 'none';
                }

            }

        }, true );

        /**
         * Hide Keyboard on click outside.
         **/
        document.addEventListener( 'click', event => {

            // noinspection JSUnresolvedVariable
            let elType = event.target.nodeName.toLowerCase();

            // noinspection JSUnresolvedFunction
            if (

                /** Target is not keyboard element. */
                null === event.target.closest( '#mdp-readabler-keyboard-box' ) &&
                /** And not input. */
                elType !== 'input' &&
                /** And not textarea. */
                elType !== 'textarea'

            ) {

                /** Hide keyboard. */
                actionVirtualKeyboard.keyboardBox.style.display = 'none';

            }

        } );

        /** Make Keyboard Box draggable. */
        actionVirtualKeyboard.makeKeyboardDraggable();

    },

    /**
     * Is focused element are text input or textarea
     * @returns {string|boolean}
     */
    isTextInput: function () {

        const allowedTags = [ 'TEXTAREA', 'INPUT' ];
        const disallowedTypes = [ 'radio', 'checkbox', 'hidden' ];
        const $focused = document.activeElement;
        const focusedTag = $focused.tagName;
        const focusedType = $focused.getAttribute( 'type' );

        if ( allowedTags.includes( focusedTag ) && ( ! disallowedTypes.includes( focusedType ) || focusedType === null ) ) {

            return $focused;

        }

        return false;

    },

    /**
     * Show keyboard when input get focus.
     **/
    onInputFocus: function ( $target ) {

        /** Work only with enabled keyboard. */
        if ( ! document.body.classList.contains( 'mdp-readabler-virtual-keyboard' ) ) { return; }

        /** Show keyboard. */
        actionVirtualKeyboard.keyboardBox.style.display = 'block';

        /** We need id for each input. */
        if ( ! $target.id ) {

            $target.id = actionVirtualKeyboard.uid();

        }

        actionVirtualKeyboard.selectedInput = `#${ $target.id }`;

        actionVirtualKeyboard.keyboard.setOptions( { inputName: $target.id} );

    },

    /**
     * Update virtual keyboard when input is changed directly.
     **/
    onInputChange: function ( event ) {

        /** Work only with enabled keyboard. */
        if ( ! document.body.classList.contains( 'mdp-readabler-virtual-keyboard' ) ) { return; }

        actionVirtualKeyboard.keyboard.setInput( event.target.value, event.target.id );

    },

    /**
     * Toggle Virtual Keyboard.
     **/
    virtualKeyboard: function ( e ) {

        /** Remove class from body to flag state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-virtual-keyboard' );

            /** Destroy keyboard. */
            actionVirtualKeyboard.keyboard.destroy();

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-virtual-keyboard' );

        // Set options
        let simpleKeyboardOptions = {
            newLineOnEnter: true,
            onChange: input => actionVirtualKeyboard.onChange( input ),
            onKeyPress: button => actionVirtualKeyboard.onKeyPress( button ),
            theme: 'mdp-readabler-simple-keyboard',
            physicalKeyboardHighlight: true,
        }

        // Set layout
        let layout = actionVirtualKeyboard.simpleKeyboardLayout();

        if ( layout ) {
            simpleKeyboardOptions.layout = layout;
        }

        /** Create keyboard. */
        actionVirtualKeyboard.keyboard = new window.SimpleKeyboard.default( simpleKeyboardOptions );

    },

    /**
     * Set simple keyboard layout.
     */
    simpleKeyboardLayout: function () {

        // Set layout
        let layout = options.virtualKeyboardLayouts[ (0,_includes_utilities_language__WEBPACK_IMPORTED_MODULE_0__.baseLang)() ] ?? false;
        if ( ! layout ) { return false; }

        // Remove escape slash for unicode symbols
        layout = layout.replace(/\\\\u/g, '\\u');

        try {

            return JSON.parse( layout );

        } catch (e) {

            console.warn( e );
            return false;

        }

    },

    /**
     * onChange handler for keyboard.
     **/
    onChange: function ( input ) {

        document.querySelector( actionVirtualKeyboard.selectedInput ).value = input;

    },

    /**
     * onKeyPress handler for keyboard.
     **/
    onKeyPress: function ( button ) {

        /** Shift functionality. */
        if ( button === '{lock}' || button === '{shift}' ) {
            actionVirtualKeyboard.handleShiftButton();
        }

    },

    /**
     * Change keys case on shift key.
     **/
    handleShiftButton: function () {

        let currentLayout = actionVirtualKeyboard.keyboard.options.layoutName;
        let shiftToggle = currentLayout === "default" ? "shift" : "default";

        actionVirtualKeyboard.keyboard.setOptions( {
            layoutName: shiftToggle
        } );

    },

    /**
     * Generates unique IDs that are sorted by its generated Date.
     **/
    uid: function() {

        return 'mdp-' + Date.now().toString( 36 ) + Math.random().toString( 36 ).substring( 2 );

    },

    /**
     * Make keyboard box draggable.
     **/
    makeKeyboardDraggable: function () {

        let dragItem = actionVirtualKeyboard.keyboardBox;
        let container = document.documentElement;

        let active = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        container.addEventListener("touchstart", dragStart, false);
        container.addEventListener("touchend", dragEnd, false);
        container.addEventListener("touchmove", drag, false);

        container.addEventListener("mousedown", dragStart, false);
        container.addEventListener("mouseup", dragEnd, false);
        container.addEventListener("mousemove", drag, false);

        function dragStart( e ) {

            if ( e.type === "touchstart" ) {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if ( e.target === dragItem ) {
                active = true;
            }

        }

        function dragEnd() {

            initialX = currentX;
            initialY = currentY;

            active = false;

        }

        function drag( e ) {

            if ( active ) {

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, dragItem);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/analytics/analytics.js":
/*!***********************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/analytics/analytics.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Analytics: () => (/* binding */ Analytics)
/* harmony export */ });
/* harmony import */ var _cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cache */ "./wp-content/plugins/readabler/source/js/analytics/cache.js");
/* harmony import */ var _inspect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inspect */ "./wp-content/plugins/readabler/source/js/analytics/inspect.js");
/* harmony import */ var _scanner_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scanner/query */ "./wp-content/plugins/readabler/source/js/scanner/query.js");




let uid = '';
const readablerOptions = window.mdpReadablerOptions;

class Analytics {

    /**
     * Constructor
     */
    constructor() {

        // If analyzer is on, don't run analytics
        if ( (0,_scanner_query__WEBPACK_IMPORTED_MODULE_2__.isAnalyzeQuery)() ) { return; }

        // Unique ID
        uid = (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.generateRandomUID)();

        // Blur event
        window.addEventListener( 'blur', _inspect__WEBPACK_IMPORTED_MODULE_1__.isTabFocused );

        // Focus event
        window.addEventListener( 'focus', _inspect__WEBPACK_IMPORTED_MODULE_1__.isTabFocused );

        // Processing event
        window.addEventListener( 'ReadablerAnalyticsEvent', this.processing );

        // Initial analytics data
        this.pageLoadAnalytics();

        // Send data to analytics
        const analyticsInterval = parseInt( readablerOptions.analyticsSendInterval ) * 1000;
        setInterval(
            () => {

                if ( ! _inspect__WEBPACK_IMPORTED_MODULE_1__.isOpen || ! _inspect__WEBPACK_IMPORTED_MODULE_1__.isTabFocus ) { return; }
                Analytics.send( Analytics.requestData() );

            },
            analyticsInterval
        );

    }

    /**
     * Sen general date and geolocation data to analytics after a page load
     */
    pageLoadAnalytics() {

        let generalData = this.sessionData();

        // If GDPR is on, send data to analytics
        if ( readablerOptions.analyticsGDPR === 'on' ) {

            Analytics.send( generalData );
            return;

        }

        /**
         * Get geolocation data
         */
        fetch('https://ipapi.co/json/')
            .then( response => response.json() )
            .then( data => {

                // Set data
                generalData.country_code = data.country_code ?? 'unknown';

                // Send data to analytics
                Analytics.send( generalData );

            } )
            .catch( error => {

                console.error( 'Error fetching IP address:', error );

                // Send data to analytics
                Analytics.send( generalData );

            } );

    }

    /**
     * Static data
     * @returns {{clientID: (string|*)}}
     */
    sessionData() {

        return {
            uid: uid,
            post_id: readablerOptions.postID ?? '',
            post_type: readablerOptions.postType ?? '',
            page_lang: document.documentElement.lang ?? '',
            is_mobile: (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.isMobile)() ?? false,
            events: (0,_cache__WEBPACK_IMPORTED_MODULE_0__.getCache)(),
            open_timer: (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.getOpenTimer)(),
        }

    }

    /**
     * Processing event
     * @param ev
     */
    processing( ev ) {

        if ( ! ev.detail ) { return; }
        let { id, value } = ev.detail;

        id = id.replace( 'readabler-', '' );
        id = id.replace( 'mdp-action-', '' );
        id = id.replaceAll( '-', '_' );

        (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.isReadablerOpen)( ev.detail );

        (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.updateOpenTimer)( ev.detail );

        // Add new event to cache
        (0,_cache__WEBPACK_IMPORTED_MODULE_0__.setCache)(
            {
                id: id,
                value: value,
            }
        )

        // Send data to analytics if immediate is true
        if ( (0,_cache__WEBPACK_IMPORTED_MODULE_0__.sendNow)( ev.detail ) ) {
            Analytics.send( Analytics.requestData() );
        }

    }

    /**
     * Construct request data object
     * @returns {{uid: string, events: *[], timestamp: number}}
     */
    static requestData() {

        return {
            uid: uid,
            events: (0,_cache__WEBPACK_IMPORTED_MODULE_0__.getCache)(),
            open_timer: (0,_inspect__WEBPACK_IMPORTED_MODULE_1__.getOpenTimer)(),
        }

    }

    /**
     * Send data to analytics
     */
    static send( data = null ) {

        // If data is null, get data from cache
        if ( ! data ) { return; }

        const { ajaxurl, nonce } = readablerOptions;

        fetch(
            `${ ajaxurl }?action=readabler_usage_analytics&nonce=${ nonce }`,
            {
                method: 'PUT',
                cache: 'no-cache',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( data ),
            }
        )
            .then(
                ( res) => res.json()
            )
            .then(
                ( json ) => {

                    // Display error message
                    if ( ! json.success ) {
                        console.warn( json.data );
                    }

                }
            )
            .catch( (err) => console.error( "Error:", err ) );

        // Clear cache
        (0,_cache__WEBPACK_IMPORTED_MODULE_0__.clearCache)();

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/analytics/cache.js":
/*!*******************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/analytics/cache.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearCache: () => (/* binding */ clearCache),
/* harmony export */   getCache: () => (/* binding */ getCache),
/* harmony export */   sendNow: () => (/* binding */ sendNow),
/* harmony export */   setCache: () => (/* binding */ setCache)
/* harmony export */ });
let eventsCache = [];

/**
 * Set cache
 * @param data
 */
function setCache( data ) {

    eventsCache.push( data );

}

/**
 * Get cache
 * @returns {*[]}
 */
function getCache() {

    return eventsCache;

}

/**
 * Clear cache
 */
function clearCache() {

    eventsCache = [];

}

/**
 * Send data now or wait for analyticsInterval
 * @param ev
 * @returns {boolean}
 */
function sendNow( ev ) {

    let { id, value } = ev;

    return ( id === 'open' && value === 0 ) || id === 'reset' || id === 'hide';

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/analytics/inspect.js":
/*!*********************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/analytics/inspect.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateRandomUID: () => (/* binding */ generateRandomUID),
/* harmony export */   getOpenTimer: () => (/* binding */ getOpenTimer),
/* harmony export */   isMobile: () => (/* binding */ isMobile),
/* harmony export */   isOpen: () => (/* binding */ isOpen),
/* harmony export */   isReadablerOpen: () => (/* binding */ isReadablerOpen),
/* harmony export */   isTabFocus: () => (/* binding */ isTabFocus),
/* harmony export */   isTabFocused: () => (/* binding */ isTabFocused),
/* harmony export */   updateOpenTimer: () => (/* binding */ updateOpenTimer)
/* harmony export */ });
let isTabFocus = true;
let isOpen = false;
let isMainOpen = false;
let isVoiceNavigationOpen = false;
let openTimer = 0;
let lastTimestamp = 0;
let openStartTime = 0;
let openEndTime = 0;

/**
 * Readabler options
 * @param readablerOptions.analyticsSendInterval
 * @type {{cognitiveReadingFocus, cognitiveReadingFixation}|{scrollDownValue, scrollUpValue, scrollRightValue, scrollLeftValue}|*}
 */
const readablerOptions = window.mdpReadablerOptions;

/**
 * Check is mobile
 */
function isMobile() {

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ? 1 : 0;

}

/**
 * Generate random UID
 * @returns {*}
 */
function generateRandomUID() {

    const randomValue = Math.random().toString( 36 ) + Math.random().toString( 36 );

    return btoa( randomValue.replace( '0.', '' ), true ).toLowerCase();

}

/**
 * Check if the accessibility popup is open or close
 * @param ev
 */
function isReadablerOpen(ev) {

    const { id, value } = ev;

    // Main window open or close
    if ( id === 'open' ) {
        isMainOpen = value;
    }

    // Voice navigation window open or close
    if ( id === 'action-voice-navigation' ) {

        if ( value === 1 ) {
            isVoiceNavigationOpen = true;
        } else if ( value === 0 ) {
            isVoiceNavigationOpen = false;
        }

    }

    isOpen = ( isMainOpen || isVoiceNavigationOpen );

}

/**
 * Check if tab focused
 * @param ev
 */
function isTabFocused( ev ) {

    if ( ev.type === 'focus' ) {
        isTabFocus = true;
    } else if ( ev.type === 'blur' ) {
        isTabFocus = false;
    }

}

/**
 * Update open timer
 * @param ev
 */
function updateOpenTimer( ev ) {

    let { id, value } = ev;
    if ( id !== 'open' ) { return; }

    if ( value === 1 ) {

        // Set openStartTime
        openStartTime = new Date().getTime();

    } else {

        // Set openEndTime
        openEndTime = new Date().getTime();

        // Update openTimer
        openTimer += openEndTime - lastTimestamp;

        // Reset openStartTime and openEndTime
        openStartTime = 0;
        openEndTime = 0;

    }

    lastTimestamp = new Date().getTime();

}

/**
 * Get open timer
 * @returns {number}
 */
function getOpenTimer() {

    // Not open
    if ( openStartTime === 0 ) {
        return openTimer;
    }

    // Open but not close
    if ( openEndTime === 0 && openStartTime !== 0 ) {

        if ( openTimer === 0 ) {
            openTimer = new Date().getTime() - openStartTime;
        } else {

            const { analyticsSendInterval } = readablerOptions;
            let delta = new Date().getTime() - lastTimestamp;

            if ( delta < analyticsSendInterval * 1000 ) {
                openTimer += delta;
            } else {
                openTimer += analyticsSendInterval * 1000;
            }

        }

    }

    lastTimestamp = new Date().getTime();

    // If openTimer > hour to prevent saves too large number
    if ( openTimer > 3600000 ) {
        openTimer = 0;
    }

    return openTimer;

}





/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigBlackCursor.js":
/*!*********************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigBlackCursor.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionBigBlackCursor: () => (/* binding */ actionBigBlackCursor)
/* harmony export */ });
let options = window.mdpReadablerOptions;

/**
 * Big Black Cursor.
 **/
let actionBigBlackCursor = {

    bigBlackCursorStyle: document.createElement( 'style' ),

    /**
     * Initialise Big Black Cursor action.
     **/
    init: function () {

        /** Listen for Big Black Cursor change. */
        let bigBlackCursor = document.querySelector( '#mdp-readabler-action-big-black-cursor' );
        bigBlackCursor.addEventListener( 'ReadablerToggleBoxChanged', actionBigBlackCursor.bigBlackCursor );

    },

    bigBlackCursor: function ( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-big-black-cursor' );
            return;

        }

        /** Disable Big White Cursor if  it's enabled. */
        actionBigBlackCursor.disableWhite();

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-big-black-cursor' );

        /** Add CSS to header. */
        //language=CSS
        actionBigBlackCursor.bigBlackCursorStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-big-black-cursor,
                body.mdp-readabler-big-black-cursor * {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${options.pluginURL}images/cursor/black-cursor.svg"), default !important
                }
                
                body.mdp-readabler-big-black-cursor * input, 
                body.mdp-readabler-big-black-cursor * textarea, 
                body.mdp-readabler-big-black-cursor * select, 
                body.mdp-readabler-big-black-cursor * a, 
                body.mdp-readabler-big-black-cursor * button, 
                body.mdp-readabler-big-black-cursor * [role=button] {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${options.pluginURL}images/cursor/black-pointer.svg"), default !important;
                }
                
            `;

        document.head.appendChild( actionBigBlackCursor.bigBlackCursorStyle );

    },

    disableWhite: function () {

        /** Disable Big White Cursor if it's enabled. */
        let bigWhiteCursorBtn = document.getElementById( 'mdp-readabler-action-big-white-cursor' );

        if ( null === bigWhiteCursorBtn ) { return; }

        if ( bigWhiteCursorBtn.classList.contains( 'mdp-active') ) {
            bigWhiteCursorBtn.click();
        }

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigWhiteCursor.js":
/*!*********************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigWhiteCursor.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionBigWhiteCursor: () => (/* binding */ actionBigWhiteCursor)
/* harmony export */ });
let options = window.mdpReadablerOptions;

/**
 * Big White Cursor.
 **/
let actionBigWhiteCursor = {

    bigWhiteCursorStyle: document.createElement( 'style' ),

    /**
     * Initialise Big White Cursor action.
     **/
    init: function () {

        /** Listen for Big White Cursor change. */
        let bigWhiteCursor = document.querySelector( '#mdp-readabler-action-big-white-cursor' );
        bigWhiteCursor.addEventListener( 'ReadablerToggleBoxChanged', actionBigWhiteCursor.bigWhiteCursor );

    },

    bigWhiteCursor: function ( e ) {

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-big-white-cursor' );
            return;

        }

        /** Disable black cursor. */
        actionBigWhiteCursor.disableBlack();

        /** Add class to body as flag. */
        document.body.classList.add( 'mdp-readabler-big-white-cursor' );

        /** Add CSS to header. */
        //language=CSS
        actionBigWhiteCursor.bigWhiteCursorStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-big-white-cursor,
                body.mdp-readabler-big-white-cursor * {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${options.pluginURL}images/cursor/white-cursor.svg"), default !important
                }
                
                body.mdp-readabler-big-white-cursor * input, 
                body.mdp-readabler-big-white-cursor * textarea, 
                body.mdp-readabler-big-white-cursor * select, 
                body.mdp-readabler-big-white-cursor * a, 
                body.mdp-readabler-big-white-cursor * button, 
                body.mdp-readabler-big-white-cursor * [role=button] {
                    /*noinspection CssUnknownTarget*/
                    cursor: url("${options.pluginURL}images/cursor/white-pointer.svg"), default !important;
                }
                
            `;

        document.head.appendChild( actionBigWhiteCursor.bigWhiteCursorStyle );

    },

    disableBlack: function () {

        /** Disable Big Black Cursor if it's enabled. */
        let bigBlackCursorBtn = document.getElementById( 'mdp-readabler-action-big-black-cursor' );

        if ( null === bigBlackCursorBtn ) { return; }

        if ( bigBlackCursorBtn.classList.contains( 'mdp-active') ) {
            bigBlackCursorBtn.click();
        }

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionDarkContrast.js":
/*!*****************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/contrast/_actionDarkContrast.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionDarkContrast: () => (/* binding */ actionDarkContrast)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * Dark Contrast.
 **/
let actionDarkContrast = {

    darkContrastStyle: document.createElement( 'style' ),

    /**
     * Initialise DarkContrast action.
     **/
    init: function () {

        /** Listen for Dark Contrast change. */
        let darkContrast = document.querySelector( '#mdp-readabler-action-dark-contrast' );
        darkContrast.addEventListener( 'ReadablerToggleBoxChanged', actionDarkContrast.darkContrast );

    },

    /**
     * Toggle Dark Contrast styles.
     **/
    darkContrast: function ( e ) {

        /** Remove class from body to reset Dark Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-dark-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-dark-contrast' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionHighContrast.js":
/*!*****************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/contrast/_actionHighContrast.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionHighContrast: () => (/* binding */ actionHighContrast)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * High Contrast.
 **/
const actionHighContrast = {

    /**
     * Initialise High Contrast action.
     **/
    init: function () {

        /** Listen for High Contrast change. */
        let highContrast = document.querySelector( '#mdp-readabler-action-high-contrast' );
        highContrast.addEventListener( 'ReadablerToggleBoxChanged', actionHighContrast.highContrast );

    },

    /**
     * Toggle High Contrast styles.
     **/
    highContrast: function ( e ) {

        /** Remove class from body to reset High Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-high-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-high-contrast' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionLightContrast.js":
/*!******************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/contrast/_actionLightContrast.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionLightContrast: () => (/* binding */ actionLightContrast)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * Light Contrast.
 **/
let actionLightContrast = {

    lightContrastStyle: document.createElement( 'style' ),

    /**
     * Initialise Light Contrast action.
     **/
    init: function () {

        /** Listen for Light Contrast change. */
        let lightContrast = document.querySelector( '#mdp-readabler-action-light-contrast' );
        lightContrast.addEventListener( 'ReadablerToggleBoxChanged', actionLightContrast.lightContrast );

    },

    /**
     * Toggle Light Contrast styles.
     **/
    lightContrast: function ( e ) {

        /** Remove class from body to reset Light Contrast to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-light-contrast' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-light-contrast' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionMonochrome.js":
/*!***************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/contrast/_actionMonochrome.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionMonochrome: () => (/* binding */ actionMonochrome)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * Monochrome.
 **/
const actionMonochrome = {

    /**
     * Initialise Monochrome action.
     **/
    init: function () {

        /** Listen for Monochrome change. */
        let monochrome = document.querySelector( '#mdp-readabler-action-monochrome' );
        monochrome.addEventListener( 'ReadablerToggleBoxChanged', actionMonochrome.monochrome );

    },

    /**
     * Toggle Monochrome styles.
     **/
    monochrome: function ( e ) {

        /** Remove class from body to reset Monochrome to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-monochrome' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-monochrome' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/hotkeys/hotKeys.js":
/*!****************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/hotkeys/hotKeys.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hotKeys: () => (/* binding */ hotKeys)
/* harmony export */ });
/* harmony import */ var _popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../popup/popup-helper */ "./wp-content/plugins/readabler/source/js/includes/popup/popup-helper.js");
/* harmony import */ var _actions_actionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../actions/actionKeyboardNavigation */ "./wp-content/plugins/readabler/source/js/actions/actionKeyboardNavigation.js");



function hotKeys( options ) {

    /** Open popup by hotkey. */
    openInterface( options );

    /** Navigate to next/prev Menu. */
    focusElements( options.hotKeyMenu, 'nav, [role="navigation"]' );

    /** Navigate to next/prev Heading. */
    focusElements( options.hotKeyHeadings, 'h1, h2, h3, h4, h5, h6, [role="heading"]' );

    /** Navigate to next/prev Form. */
    focusElements( options.hotKeyForms, 'form:not([disabled])' );

    /** Navigate to next/prev Button. */
    focusElements( options.hotKeyButtons, 'button:not([disabled]), [role="button"]:not([disabled])' );

    /** Navigate to next/prev Graphic. */
    focusElements( options.hotKeyGraphics, 'img, picture, svg' );

    /** Enable/Disable controls by spacer. */
    document.body.onkeydown = function ( e ) {

        let key = e.keyCode || e.charCode || e.which;

        /** Spacer pressed. */
        if ( key === 32 ) {
            spacePressed( e );
        }

    }

}

/**
 * Run when Spacer pressed.
 **/
function spacePressed( e ) {

    let activeElement = document.activeElement;

    /** Profile switchers. */
    if ( activeElement.classList.contains( 'mdp-readabler-accessibility-profile-item' ) ) {
        e.preventDefault();
        activeElement.click();
    }

    /** Toggle boxes. */
    else if ( activeElement.classList.contains( 'mdp-readabler-toggle-box' ) ) {
        e.preventDefault();
        activeElement.click();
    }

    /** Palette boxes. */
    else if ( activeElement.classList.contains( 'mdp-readabler-color' ) ) {
        e.preventDefault();
        activeElement.click();
    }

}

/**
 * Open popup by hotkey.
 **/
function openInterface( options ) {

    hotkeys( options.hotKeyOpenInterface, function ( event ) {

        /** Prevent the default behavior. */
        event.preventDefault();

        /** Open/Close popup. */
        (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.togglePopup)();

    } );

}

/**
 * Set focus on next/prev elements.
 **/
function focusElements( shortcutKey, selector ) {

    /** Navigate to next/prev element. */
    hotkeys( shortcutKey + ',' + 'shift+' + shortcutKey, function ( event, handler ) {

        /** Check if Keyboard Navigation is enabled. */
        if ( ! document.body.classList.contains( 'mdp-readabler-keyboard-navigation' ) ) { return; }

        /** Prevent the default behavior. */
        event.preventDefault();

        /** Focus previously element if shift is pressed. */
        let next = true;
        if ( handler.key.startsWith( 'shift+' ) ) { next = false; }

        /** Set focus to next heading element. */
        _actions_actionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_1__.actionKeyboardNavigation.setFocus( selector, next );

    } );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/interface/_toggleBox.js":
/*!*********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/interface/_toggleBox.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toggleBox: () => (/* binding */ toggleBox)
/* harmony export */ });
/* harmony import */ var _utilities_localStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/_localStorage */ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js");


/**
 * Toggle Box control.
 **/
let toggleBox = {

    /**
     * Initialise Toggle Box.
     **/
    init: function () {

        /** Toggle Button click. */
        let toggleBoxes = document.querySelectorAll( '.mdp-readabler-toggle-box' );

        /** Listen click. */
        toggleBoxes.forEach( box => box.addEventListener( 'click', ( e ) => toggleBox.toggle( e ) ) );

        /** Listen keydown. */
        toggleBoxes.forEach( box => box.addEventListener( 'keydown', ( e ) => toggleBox.toggle( e ) ) );

    },

    /**
     * Toggle control state.
     **/
    toggle: function ( e ) {

        if ( e.type === 'keydown' && e.keyCode !== 13 ) { return }

        /** All Toggle Boxes. */
        let toggleBox = e.target.closest( '.mdp-readabler-toggle-box' );

        /** Activate/Deactivate control. */
        toggleBox.classList.toggle( 'mdp-active' );

        /** Save value in localStorage. */
        (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_0__.setLocal)( toggleBox.id, toggleBox.classList.contains( 'mdp-active' ) );

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerToggleBoxChanged', {
            detail: {
                isTrusted: e.isTrusted,
            }
        } );

        /** Fire custom event ReadablerToggleBoxChanged. */
        toggleBox.dispatchEvent( event );

        /** Analytics event */
        const analyticsEvent = new CustomEvent( 'ReadablerAnalyticsEvent', {
            detail: {
                category: 'toggle-box',
                id: toggleBox.id,
                value: toggleBox.classList.contains( 'mdp-active' ) ? 1 : 0,
                timestamp: new Date().getTime()
            }
        } );
        window.dispatchEvent( analyticsEvent );

    },

    /**
     * Enable some toggleBoxes from localstorage.
     **/
    loadSaved: function () {

        /** All Toggle Boxes. */
        let toggleBoxes = document.querySelectorAll( '.mdp-readabler-toggle-box' );

        toggleBoxes.forEach( box => {

            if ( 'true' === (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id ) ) {
                box.click();
            }

        } );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/popup/popup-helper.js":
/*!*******************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/popup/popup-helper.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closePopup: () => (/* binding */ closePopup),
/* harmony export */   popupHelper: () => (/* binding */ popupHelper),
/* harmony export */   showPopup: () => (/* binding */ showPopup),
/* harmony export */   togglePopup: () => (/* binding */ togglePopup)
/* harmony export */ });
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromodal */ "./node_modules/micromodal/dist/micromodal.es.js");
/* harmony import */ var _utilities_remove_select2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/_remove-select2 */ "./wp-content/plugins/readabler/source/js/includes/utilities/_remove-select2.js");
/* harmony import */ var _utilities_clickHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/clickHandler */ "./wp-content/plugins/readabler/source/js/includes/utilities/clickHandler.js");
/* harmony import */ var _popup_position__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./popup-position */ "./wp-content/plugins/readabler/source/js/includes/popup/popup-position.js");





/** Popup modal window. */
const popup = document.getElementById( 'mdp-readabler-popup' );

/**
 * Popup helper.
 * @param options
 */
function popupHelper( options ) {

    /**
     * Clone MicroModal to global scope to fix issue with closing modal
     * @link https://github.com/ghosh/Micromodal/issues/338
     */
    window.mdpReadablerMicroModal = micromodal__WEBPACK_IMPORTED_MODULE_0__["default"];

    /** Initialise Popup but not show */
    window.mdpReadablerMicroModal.init( 'mdp-readabler-popup-box', {
        onClose: ( el ) => {

            if ( el.id && el.id === 'mdp-readabler-popup-box' ) {
                releaseTriggerButtons();
            }

        },
        openTrigger: 'data-readabler-trigger', // or 'data-readabler-show'
        closeTrigger: 'data-readabler-close',
        disableScroll: ! options.popupScroll,
        disableFocus: false,
    } );

    /** Start to listen click event. */
    document.addEventListener( 'click', _utilities_clickHandler__WEBPACK_IMPORTED_MODULE_2__.clickHandler, false );

    /** Draggable popup */
    (0,_popup_position__WEBPACK_IMPORTED_MODULE_3__.popupPosition)( options );

}

/**
 * Show/Hide Accessibility Popup.
 **/
function togglePopup() {

    /** Toggle popup state. */
    const isPopupOpen = document.querySelector( '#mdp-readabler-popup-box' ).getAttribute( 'aria-hidden' ) === 'false';
    ! isPopupOpen ? showPopup() : closePopup();

}

/**
 * Show popup
 */
function showPopup() {

    /** Show Popup. */
    window.mdpReadablerMicroModal.show( 'mdp-readabler-popup-box' );

    /** Remove Select2 styling. */
    (0,_utilities_remove_select2__WEBPACK_IMPORTED_MODULE_1__.removeSelect2)( popup );

    /** Hold all trigger buttons. */
    holdTriggerButtons();

    /** Set popup position if we have it in localstorage. */
    (0,_popup_position__WEBPACK_IMPORTED_MODULE_3__.setPopupPosition)();

    /** Analytics event */
    const analyticsEvent = new CustomEvent( 'ReadablerAnalyticsEvent', {
        detail: {
            category: 'popup',
            id: 'open',
            value: 1,
            timestamp: new Date().getTime()
        }
    } );
    window.dispatchEvent( analyticsEvent, false );

}

/**
 * Close popup
 */
function closePopup() {

    /** Close Popup. */
    window.mdpReadablerMicroModal.close( 'mdp-readabler-popup-box' );

    /** Release all trigger buttons. */
    releaseTriggerButtons();

    /** Analytics event */
    const analyticsEvent = new CustomEvent( 'ReadablerAnalyticsEvent', {
        detail: {
            category: 'popup',
            id: 'open',
            value: 0,
            timestamp: new Date().getTime()
        }
    } );
    window.dispatchEvent( analyticsEvent, false );

}

/**
 * Add class .mdp-opened to all trigger buttons.
 **/
function holdTriggerButtons() {

    const triggerButtons = document.querySelectorAll( '[data-readabler-trigger]' );
    if ( ! triggerButtons ) { return; }

    triggerButtons.forEach( el  => el.classList.add( 'mdp-opened' ) );

}

/**
 * Remove class .mdp-opened from all trigger buttons.
 **/
function releaseTriggerButtons() {

    const triggerButtons = document.querySelectorAll( '[data-readabler-trigger]' );
    if ( ! triggerButtons ) { return; }

    triggerButtons.forEach( el  => el.classList.remove( 'mdp-opened' ) );

    closeStatementBox();

}

/**
 * Close Accessibility Statement.
 */
function closeStatementBox() {

    let statementBox = document.getElementById( 'mdp-readabler-accessibility-statement-box' );

    if ( statementBox !== null && statementBox.classList.contains( 'mdp-open' ) ) {
        statementBox.classList.remove( 'mdp-open' );
    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/popup/popup-position.js":
/*!*********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/popup/popup-position.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   popupPosition: () => (/* binding */ popupPosition),
/* harmony export */   setPopupPosition: () => (/* binding */ setPopupPosition)
/* harmony export */ });
/* harmony import */ var _utilities_delay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/_delay */ "./wp-content/plugins/readabler/source/js/includes/utilities/_delay.js");
/* harmony import */ var _utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/_localStorage */ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js");



/** Popup modal window. */
const popup = document.getElementById( 'mdp-readabler-popup' );

/**
 * Popup position if popupDraggable is on.
 * @param options
 */
function popupPosition( options ) {

    /** Draggable popup */
    if ( options.popupDraggable !== '1' ) { return; }

    /** Make popup draggable. */
    draggablePopup();

    /** Set popup position if we have it in localstorage. */
    setPopupPosition();

    /** Fix popup position on resize. */
    window.addEventListener('resize', ( e ) => { (0,_utilities_delay__WEBPACK_IMPORTED_MODULE_0__.delay)( setPopupPosition( e ), 300 ) } );

}

/**
 * Set popup position, if we have it in localstorage.
 **/
function setPopupPosition( e = undefined ) {

    let top = (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.getLocal)( 'popupTop' );
    let left = (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.getLocal)( 'popupLeft' );

    if ( null === top || null === left ) { return false; }

    /** Apply popup position. */
    applyPopupPosition( top, left, e );

    return true;

}

/**
 * Make popup draggable.
 **/
function draggablePopup() {

    let dragZoneElement = document.getElementById( 'mdp-readabler-popup-header' );

    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;

    dragZoneElement.onmousedown = dragMouseDown;

    /**
     * Start popup dragging.
     **/
    function dragMouseDown( e ) {

        // noinspection JSDeprecatedSymbols
        e = e || window.event;

        /** Drag popup only on left mouse. */
        if ( ! detectLeftButton( e ) ) { return; }

        e.preventDefault();

        /** Get the mouse cursor position at startup. */
        pos3 = e.clientX;
        pos4 = e.clientY;

        /** Call a function whenever the cursor moves. */
        document.addEventListener( 'mousemove', startDragging );

        /** Stop dragging on mouseup. */
        document.addEventListener( 'mouseup', stopDragging );

    }

    /**
     * Calculate dragging position.
     **/
    function startDragging( e ) {

        // noinspection JSDeprecatedSymbols
        e = e || window.event;

        e.preventDefault();

        /** Calculate the new cursor position. */
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        /** Calculate popup new position. */
        let top = popup.offsetTop - pos2;
        let left = popup.offsetLeft - pos1;

        /** Apply popup position. */
        applyPopupPosition( top, left );

        /** Save popup position in local storage. */
        (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupTop', top.toString() );
        (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupLeft', left.toString() );

    }

    /**
     * Stop moving when mouse button is released.
     **/
    function stopDragging() {

        document.removeEventListener('mousemove', startDragging );
        document.removeEventListener('mouseup', stopDragging );

    }

    /**
     * Detect if the left and only the left mouse button is pressed.
     *
     * @param event
     *
     * @return {boolean}
     **/
    function detectLeftButton( event ) {

        if ( 'buttons' in event ) { return event.buttons === 1; }

        let button = event.which || event.button;

        return button === 1;

    }

}

/**
 * Apply popup position.
 **/
function applyPopupPosition( top, left, e = undefined ) {

    top = topInBound( top );
    left = leftInBound( left );

    /** Set popup new position. */
    popup.style.top = top + 'px';
    popup.style.left = left + 'px';

    /** If we have event then we here from resize event and need small animation. */
    if ( 'undefined' !== typeof e ) {
        popup.style.transition = 'top 0.3s ease, left 0.3s ease';
    } else {
        popup.style.transition = 'none';
    }

    (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupTop', top );
    (0,_utilities_localStorage__WEBPACK_IMPORTED_MODULE_1__.setLocal)( 'popupLeft', left );

    popup.removeAttribute( 'data-start' );

}

/**
 * Fix top position if it's out of view.
 **/
function topInBound( top ) {

    let vh = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 )

    /** Don't allow popup out of bounds. */
    if ( top < 0 ) { top = 0; }
    if ( top > ( vh - popup.offsetHeight ) ) { top = vh - popup.offsetHeight; }

    return top;

}

/**
 * Fix left position if it's out of view.
 **/
function leftInBound( left ) {

    let vw = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 );

    /** Don't allow popup out of bounds. */
    if ( left < 0 ) { left = 0; }
    if ( left > ( vw - popup.offsetWidth ) ) { left = vw - popup.offsetWidth; }

    return left;

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js":
/*!*******************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   visuallyPleasingExperience: () => (/* binding */ visuallyPleasingExperience)
/* harmony export */ });
/**
 * General methods for Visually Pleasing Experience group.
 **/
const visuallyPleasingExperience = {

    /**
     * Disable other buttons in button group.
     **/
    disableOthers: function ( el ) {

        let activeBtns = document.querySelectorAll('#mdp-readabler-visually-pleasing-experience-box .mdp-readabler-toggle-box.mdp-active');
        activeBtns.forEach( btn  => {

            if ( el.id !== btn.id ) {
                btn.click();
            }

        } );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/saturation/_actionHighSaturation.js":
/*!*********************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/saturation/_actionHighSaturation.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionHighSaturation: () => (/* binding */ actionHighSaturation)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * High Saturation.
 **/
const actionHighSaturation = {

    /**
     * Initialise High Saturation action.
     **/
    init: function () {

        /** Listen for High Saturation change. */
        let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation' );
        highSaturation.addEventListener( 'ReadablerToggleBoxChanged', actionHighSaturation.highSaturation );

    },

    /**
     * Toggle High Saturation styles.
     **/
    highSaturation: function ( e ) {

        /** Remove class from body to reset High Saturation to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-high-saturation' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply align styles. */
        document.body.classList.add( 'mdp-readabler-high-saturation' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/saturation/_actionLowSaturation.js":
/*!********************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/saturation/_actionLowSaturation.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionLowSaturation: () => (/* binding */ actionLowSaturation)
/* harmony export */ });
/* harmony import */ var _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../profiles/_profiles */ "./wp-content/plugins/readabler/source/js/includes/profiles/_profiles.js");


/**
 * Low Saturation.
 **/
let actionLowSaturation = {

    /**
     * Initialise Low Saturation action.
     **/
    init: function () {

        /** Listen for Low Saturation change. */
        let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation' );
        lowSaturation.addEventListener( 'ReadablerToggleBoxChanged', actionLowSaturation.lowSaturation );

    },

    /**
     * Toggle Low Saturation styles.
     **/
    lowSaturation: function ( e ) {

        /** Remove class from body to reset Low Saturation to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( 'mdp-readabler-low-saturation' );
            return;

        }

        /** Disable other buttons in button group. */
        _profiles_profiles__WEBPACK_IMPORTED_MODULE_0__.visuallyPleasingExperience.disableOthers( e.target );

        /** Add class to body, to apply to align styles. */
        document.body.classList.add( 'mdp-readabler-low-saturation' );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text-to-speech/_action.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text-to-speech/_action.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionTextToSpeech: () => (/* binding */ actionTextToSpeech)
/* harmony export */ });
/* harmony import */ var _textToSpeech__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_textToSpeech */ "./wp-content/plugins/readabler/source/js/includes/text-to-speech/_textToSpeech.js");

let options = window.mdpReadablerOptions;

/**
 * Text To Speech.
 **/
let actionTextToSpeech = {

    readabler: null,

    /** @param window.webkitAudioContext */
    AudioContext: window.AudioContext || window.webkitAudioContext || false,

    mdp_readabler_context: null,

    /**
     * Initialise Text To Speech action.
     **/
    init: function () {

        if ( document.querySelectorAll( '#mdp-readabler-action-text-to-speech' ).length < 1 ) { return }

        /** Listen for Text To Speech change. */
        let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech' );
        textToSpeech.addEventListener( 'ReadablerToggleBoxChanged', actionTextToSpeech.textToSpeech );

    },

    /** Unlocking Web Audio for f#cking Safari. */
    webAudioTouchUnlock: function(e) {

        if ( null !== actionTextToSpeech.mdp_readabler_context ) { return; }

        if ( e.isTrusted === false ) { return; }
        actionTextToSpeech.mdp_readabler_context = new AudioContext();
        actionTextToSpeech.mdp_readabler_context.resume();

    },

    /**
     * Toggle Text To Speech.
     **/
    textToSpeech: function ( e ) {

        const isTrustedClick = e.detail.isTrusted ?? false;

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            actionTextToSpeech.readabler = null;

            document.body.removeEventListener( 'click', actionTextToSpeech.webAudioTouchUnlock, false );

        } else {

            actionTextToSpeech.readabler = new _textToSpeech__WEBPACK_IMPORTED_MODULE_0__.TextToSpeechSelection(); // Initialise TTS
            actionTextToSpeech.readabler.init();

            document.body.addEventListener( 'click', actionTextToSpeech.webAudioTouchUnlock, false ); // Unlocking Web Audio for Safari

            // Play a voice guide only if human clicked on the element.
            if ( isTrustedClick === true ) {
                actionTextToSpeech.voiceGuide( e.target.title );
            }

            actionTextToSpeech.highlightParagraph();

        }

    },

    /**
     * Voice guide
     * @param {string} msg - Voice guide message
     */
    voiceGuide: function ( msg ) {

        if ( msg.length < 1 ) { return; } // Exit if string is empty
        if ( msg.match( /^([\w\-]+)/g ) === null ) { return; } // Exit if first letter is not A-Z

        /** AJAX Request with vanilla JS. */
        let request = new XMLHttpRequest();
        let options = window.mdpReadablerOptions;

        request.open( 'POST', options.textToSpeechAjaxUrl, true );
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.onload = function () {

            /** If successful. */
            if ( this.status >= 200 && this.status < 400 ) {

                if ( ! actionTextToSpeech.AudioContext ) {
                    console.warn( 'Error with creating AudioContext.' );
                    return;
                }

                actionTextToSpeech.mdp_readabler_context.decodeAudioData( this.response, function( buffer ) {
                    const source = actionTextToSpeech.mdp_readabler_context.createBufferSource();
                    source.buffer = buffer;
                    source.connect( actionTextToSpeech.mdp_readabler_context.destination );
                    source.start( 0 );

                }, ( e ) => console.warn( 'Error with decoding audio data' + e.err ) );

            } else {
                /** If fail. */
                console.error( this.response );
            }

        };
        request.onerror = function() {
            /** Connection error. */
            console.error( 'Connection error.' );
        };
        request.responseType = 'arraybuffer';
        request.send( `action=readablergspeak&nonce=${ options.textToSpeechNonce }&text=${ msg }` );

    },

    /**
     * Highlight paragraph.
     * @param e
     */
    highlightParagraph: function () {

        if ( ! options.highlightP ) { return }

        document.querySelectorAll( 'p' ).forEach( function ( p ) {

            p.addEventListener( 'click', function ( e ) {

                let range = document.createRange();
                let selection = window.getSelection();

                range.selectNodeContents( p );

                selection.removeAllRanges();
                selection.addRange(range);

            } );

        } );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text-to-speech/_textToSpeech.js":
/*!*****************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text-to-speech/_textToSpeech.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextToSpeechSelection: () => (/* binding */ TextToSpeechSelection)
/* harmony export */ });
/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_action */ "./wp-content/plugins/readabler/source/js/includes/text-to-speech/_action.js");


/**
 * This functionality from Voicer.
 * @see https://1.envato.market/voicer
 **/
const TextToSpeechSelection = (function () {

    "use strict";

    let mdp_readabler_active_source = null;

    /**
     * Detect touch device
     * @type {boolean}
     */
    let USER_IS_TOUCHING = false;

    function _selection() {
        const menu = {
            gspeak: true,
            disable: false
        };

        const gSpeakConfig = {
            icon: '<svg class="selection__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" enable-background="new 0 0 24 24" width="24" height="24"><path d="M19.3,10.7L9.1,4.2C8.8,4,8.4,4,8.1,4C7,4,7,4.9,7,5.1v13.4c0,0.2,0,1.1,1.1,1.1c0.3,0,0.7,0,1-0.2l10.2-6.5c0.8-0.5,0.7-1.1,0.7-1.1S20.1,11.2,19.3,10.7z"/></svg>',
            preloader_icon: '<svg class="selection__icon" id="mdp-readabler-tts-preloader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="7" rx="2" ry="2" width="4" height="10"><animate attributeName="y" calcMode="spline" values="7;9;7" keyTimes="0;0.5;1" dur=".6" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/><animate attributeName="height" calcMode="spline" values="10;6;10" keyTimes="0;0.5;1" dur=".6" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/></rect><rect x="8" y="2" rx="2" ry="2" width="4" height="20"><animate attributeName="y" calcMode="spline" values="2;4;2" keyTimes="0;0.5;1" dur=".5" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/><animate attributeName="height" calcMode="spline" values="20;16;20" keyTimes="0;0.5;1" dur=".5" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/></rect><rect x="13" y="4" rx="2" ry="2" width="4" height="16"><animate attributeName="y" calcMode="spline" values="4;7;4" keyTimes="0;0.5;1" dur=".7" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/><animate attributeName="height" calcMode="spline" values="16;10;16" keyTimes="0;0.5;1" dur=".7" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/></rect><rect x="18" y="8" rx="2" ry="2" width="4" height="8"><animate attributeName="y" calcMode="spline" values="8;10;8" keyTimes="0;0.5;1" dur=".8" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/><animate attributeName="height" calcMode="spline" values="8;4;8" keyTimes="0;0.5;1" dur=".8" keySplines="0 0.5 0.5 1;0 0.5 0.5 1" begin="0" repeatCount="indefinite"/></rect></svg>',
            stop_icon: '<svg class="selection__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M18.001 4.2H6A1.8 1.8 0 0 0 4.2 5.999V18A1.8 1.8 0 0 0 5.999 19.8H18a1.8 1.8 0 0 0 1.799-1.799V6c0-.992-.807-1.799-1.799-1.799z"/></svg>'
        };

        let selection = '';
        let selectionHTML = '';
        let text = '';

        let _icons = {};
        let iconsize = 52;
        let top = 0;
        let left = 0;

        function gspeakButton() {

            return new Button( gSpeakConfig.icon, function ( ) {

                if ( this.disabled ) {
                    return;
                }

                /** Stop playing. */
                if ( document.querySelector( '.mdp-readabler-tts.stop' ) ) {
                    stopActiveSource();
                    onVoiceEnded();
                    return;
                }

                const $speakButton = this;
                $speakButton.disabled = true;

                /** Set 'loading' icon. */
                setPreloaderIcon();

                /** AJAX Request with vanilla JS. */
                let request = new XMLHttpRequest();
                let options = window.mdpReadablerOptions;

                request.open( 'POST', options.textToSpeechAjaxUrl, true );
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.onload = function () {

                    $speakButton.disabled = false;

                    /** If successful. */
                    if ( this.status >= 200 && this.status < 400 ) {

                        if ( ! _action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.AudioContext ) {
                            console.warn( 'Error with creating AudioContext.' );
                            return;
                        }

                        // noinspection JSIgnoredPromiseFromCall
                        _action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.mdp_readabler_context.decodeAudioData( this.response, function( buffer ) {
                            const source = _action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.mdp_readabler_context.createBufferSource();
                            source.buffer = buffer;
                            stopActiveSource(); // Stop the active one if any.
                            mdp_readabler_active_source = source;
                            source.connect( _action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.mdp_readabler_context.destination );
                            source.onended = onVoiceEnded;
                            source.start( 0 );

                            /** Set 'stop' icon. */
                            setStopIcon();

                        }, function( e ){
                            console.warn( 'Error with decoding audio data' + e.err );
                        });

                    } else {
                        /** If fail. */
                        console.error( this.response );
                    }
                };
                request.onerror = function() {
                    $speakButton.disabled = false;
                    /** Connection error. */
                    console.error( 'Connection error.' );
                };
                request.responseType = 'arraybuffer';
                request.send( `action=readablergspeak&nonce=${ options.textToSpeechNonce }&text=${ encodeURIComponent( text ) }&lang=${ document.documentElement.lang }` );

            } );

        }

        /** On Playback Finished. */
        function onVoiceEnded() {

            /** Hide tooltip, if new selection wasn't made. */
            if ( document.querySelector( '.mdp-readabler-tts.stop'  ) ) {
                document.querySelector('.mdp-readabler-tts').remove();
            }

            /** Reset text selection */
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }

        }

        /** Set Play Icon . */
        function setPlayIcon() {
            /** Select old icon that will be replaced. */
            const el = document.querySelector('.mdp-readabler-tts .selection__icon');

            /** Create a new icon that will take the place of "el". */
            const newEl = document.createElement('div');
            newEl.innerHTML = gSpeakConfig.icon;

            /** Replace el with newEL. */
            el.parentNode.replaceChild( newEl, el );

            /** Mark tooltip as 'Play' button. */
            const stop_popup = document.querySelector('.mdp-readabler-tts');
            stop_popup.classList.remove( 'stop' );
            stop_popup.classList.remove( 'loading' );

        }

        /** Set Preloader Icon . */
        function setPreloaderIcon() {

            const stop_popup = document.querySelector('.mdp-readabler-tts');
            if ( ! stop_popup ) {
                return;
            }

            /** Select old icon that will be replaced. */
            const el = document.querySelector('.mdp-readabler-tts .selection__icon');

            /** Create a new icon that will take the place of "el". */
            const newEl = document.createElement('div');
            newEl.innerHTML = gSpeakConfig.preloader_icon;

            /** Replace el with newEL. */
            el.parentNode.replaceChild( newEl, el );

            /** Mark tooltip as 'Stop' button. */
            stop_popup.classList.remove( 'stop' );
            // stop_popup.classList.add( 'loading' );

        }

        /** Set Stop Icon. */
        function setStopIcon() {

            /** Select old icon that will be replaced. */
            const el = document.querySelector('.mdp-readabler-tts .selection__icon');

            /** Create a new icon that will take the place of "el". */
            const newEl = document.createElement('div');
            newEl.innerHTML = gSpeakConfig.stop_icon;

            /** Replace el with newEL. */
            el.parentNode.replaceChild(newEl, el);

            /** Mark tooltip as 'Stop' button. */
            const stop_popup = document.querySelector('.mdp-readabler-tts');
            stop_popup.classList.remove( 'loading' );
            stop_popup.classList.add( 'stop' );

        }

        function appendIcons() {

            const myitems = [
                { feature: 'gspeak', call: gspeakButton() }
            ];
            const div = document.createElement('div');
            let count = 0;
            myitems.forEach( function ( item) {
                if ( menu[item.feature] ) {
                    div.appendChild(item.call);
                    count++;
                }
            });

            return {
                icons: div,
                length: count
            };

        }

        function setTooltipPosition() {
            const position = selection.getRangeAt(0).getBoundingClientRect();
            const DOCUMENT_SCROLL_TOP = window.pageXOffset || document.documentElement.scrollTop || document.body.scrollTop;

            left = position.left + (position.width - iconsize * _icons.length) / 2;

            /** Set position for desktop **/
            if ( ! USER_IS_TOUCHING ) {

                top = position.top + DOCUMENT_SCROLL_TOP - iconsize - 10;

                /** Set position for mobile **/
            } else {

                top = position.bottom + DOCUMENT_SCROLL_TOP + 10;

            }

        }

        function moveTooltip() {

            if ( !!document.querySelector('.mdp-readabler-tts') ) {
                setTooltipPosition();
                let tooltip = document.querySelector('.mdp-readabler-tts');
                tooltip.style.top = top + 'px';
                tooltip.style.left = left + 'px';
            }

        }

        function drawTooltip() {
            _icons = appendIcons();
            setTooltipPosition();

            const div = document.createElement('div');
            div.className = 'mdp-readabler-tts';
            // noinspection JSValidateTypes
            div.style =
                'top:' + top + 'px;' +
                'left:' + left + 'px;';

            div.appendChild( _icons.icons );

            const arrow = document.createElement( 'div' );
            arrow.classList.add( 'mdp-readabler-tts-arrow' );

            // Revert arrow to show bottom below the selected text
            if ( USER_IS_TOUCHING ) {
                arrow.classList.add( 'mdp-readabler-tts-arrow-mobile' );
            }

            // noinspection JSValidateTypes
            arrow.style =
                'left:' + ( iconsize * _icons.length / 2 - 8 ) + 'px;';

            if ( ! menu.disable ) {
                div.appendChild( arrow );
            }

            document.body.appendChild( div );
        }

        function attachEvents() {

            /**
             * Return selection or false if TTS of
             * @return {boolean}
             */
            function hasSelection() {

                return null !== _action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.readabler ?
                    !!window.getSelection().toString() :
                    false;

            }

            function hasTooltipDrawn() {
                return !!document.querySelector('.mdp-readabler-tts');
            }

            /** Return HTML of selected text. */
            function getHTMLOfSelection () {
                let range;
                if ( document.selection && document.selection.createRange ) {

                    range = document.selection.createRange();

                    // noinspection JSUnresolvedVariable
                    return range.htmlText;

                }
                else if (window.getSelection) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        range = selection.getRangeAt(0);
                        const clonedSelection = range.cloneContents();
                        const div = document.createElement('div');
                        div.appendChild(clonedSelection);
                        return div.innerHTML;
                    }
                    else {
                        return '';
                    }
                }
                else {
                    return '';
                }
            }

            /** Selecting the full word if only its parts are selected. */
            function snapSelectionToWord() {
                let sel;

                /** Do not Modify Selection for Touch devices. */
                if ( USER_IS_TOUCHING ) {
                    if( window.getSelection ) {
                        sel = window.getSelection();
                    } else if ( document.getSelection ) {
                        sel = document.getSelection();
                    } else if ( document.selection ) {
                        sel = document.selection.createRange().text;
                    }
                    return sel;
                }

                /**
                 * Check for existence of window.getSelection() and that it has a
                 * modify() method. IE 9 has both selection APIs but no modify() method.
                 **/
                // noinspection JSUnresolvedVariable
                if ( window.getSelection && (sel = window.getSelection()).modify ) {
                    sel = window.getSelection();
                    if ( ! sel.isCollapsed ) {

                        /** Detect if selection is backwards. */
                        const range = document.createRange();
                        range.setStart(sel.anchorNode, sel.anchorOffset);
                        range.setEnd(sel.focusNode, sel.focusOffset);
                        const backwards = range.collapsed;
                        range.detach();

                        /** Modify() works on the focus of the selection. */
                        const endNode = sel.focusNode, endOffset = sel.focusOffset;
                        sel.collapse(sel.anchorNode, sel.anchorOffset);

                        let direction;
                        if (backwards) {
                            direction = ['backward', 'forward'];
                        } else {
                            direction = ['forward', 'backward'];
                        }

                        // noinspection JSUnresolvedFunction
                        sel.modify( 'move', direction[0], 'character' );
                        // noinspection JSUnresolvedFunction
                        sel.modify( 'move', direction[1], 'word' );
                        sel.extend( endNode, endOffset);
                        // noinspection JSUnresolvedFunction
                        sel.modify( 'extend', direction[1], 'character' );
                        // noinspection JSUnresolvedFunction
                        sel.modify( 'extend', direction[0], 'word' );
                    }
                } else if ( ( sel = document.selection ) && sel.type !== 'Control' ) {
                    const textRange = sel.createRange();
                    if ( textRange.text ) {
                        textRange.expand( 'word' );

                        /** Move the end back to not include the word's trailing space(s), if necessary. */
                        while ( /\s$/.test( textRange.text ) ) {
                            // noinspection JSUnresolvedFunction
                            textRange.moveEnd( 'character', -1 );
                        }
                        textRange.select();
                    }
                }

                return sel;
            }

            const onMouseUp = function () {

                setTimeout(function mouseTimeout() {
                    if (hasTooltipDrawn()) {

                        if (hasSelection()) {
                            selection = snapSelectionToWord();

                            selectionHTML = getHTMLOfSelection();
                            text = selectionHTML;

                            moveTooltip();

                            /** If now playing, set icon to play. */
                            if (
                                (document.querySelector('.mdp-readabler-tts.stop')) ||
                                (document.querySelector('.mdp-readabler-tts.loading'))
                            ) {

                                /** Set ion Play. */
                                setPlayIcon();
                            }

                        } else {

                            if ( ! USER_IS_TOUCHING ) {

                                /** Hide tooltip, If we're now not paying. */
                                if (
                                    (!document.querySelector('.mdp-readabler-tts.stop')) &&
                                    (!document.querySelector('.mdp-readabler-tts.loading'))
                                ) {
                                    document.querySelector('.mdp-readabler-tts').remove();
                                }

                            }

                        }

                    } else if ( hasSelection() ) {

                        selection = snapSelectionToWord();
                        selectionHTML = getHTMLOfSelection();
                        text = selectionHTML;
                        drawTooltip();

                    }
                }, 10);

            };

            window.addEventListener( 'mouseup', onMouseUp, true );
            window.addEventListener( 'touchend', onMouseUp, false );
            window.addEventListener( 'touchcancel', onMouseUp, false );
            window.addEventListener( 'selectionchange', onMouseUp, false );

            window.addEventListener( 'resize', moveTooltip, false );

            /** We want to detect human touch, not device touch. */
            window.addEventListener( 'touchstart', function onFirstTouch() {

                /** Set global flag. */
                USER_IS_TOUCHING = true;

                document.addEventListener('selectionchange', onMouseUp, true);

                /** We only need to know once that a human touched the screen, so we can stop listening now. */
                window.removeEventListener('touchstart', onFirstTouch, false );

            }, false );

        }

        function config( optionsL ) {

            menu.gspeak = optionsL.gspeak === undefined ? menu.gspeak : optionsL.gspeak;
            menu.disable = optionsL.disable === undefined ? menu.disable : optionsL.disable;

            return this;

        }

        function init() {

            // IconStyle();
            attachEvents();

            return this;

        }

        return {
            config: config,
            init: init
        };
    }

    /**
     * Render button.
     * @param icon - SVG icon
     * @param clickFn - Click event handler
     * @return {HTMLDivElement}
     * @constructor
     */
    function Button( icon, clickFn ) {

        const btn = document.createElement('button');
        btn.classList.add( 'mdp-readabler-tts-button' );
        btn.innerHTML = icon;
        btn.onclick = clickFn;

        if ( btn.id === 'mdp-readabler-tts-preloader' ) {

            btn.style.transition = 'none';

        } else {

            btn.onmouseover = function () {
                this.style.transform = 'scale(1.2)';
            };
            btn.onmouseout = function () {
                this.style.transform = 'scale(1)';
            };

        }

        return btn;
    }

    /**
     * Stop the active one if any.
     */
    function stopActiveSource() {
        if (mdp_readabler_active_source) {
            mdp_readabler_active_source.onended = null; // manual stop, no event
            mdp_readabler_active_source.stop(0);
        }
    }

    return _selection;

})();


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text/_actionCognitiveReading.js":
/*!*****************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text/_actionCognitiveReading.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionCognitiveReading: () => (/* binding */ actionCognitiveReading)
/* harmony export */ });
/**
 * Cognitive Reading Action.
 * TODO: ADHD mode.
 * @param window.mdpReadablerOptions.cognitiveReadingFocus
 * @param window.mdpReadablerOptions.cognitiveReadingFixation
 **/
const actionCognitiveReading = {

    textSelectors: 'h1, h2, h3, h4, h5, h6, p, a, span, li, label, legend, dd, dt, blockquote, time',

    /**
     * Initialise Cognitive Reading action.
     **/
    init: function () {

        /** Listen for Line Height change. */
        let control = document.querySelector( '#mdp-readabler-action-cognitive-reading' );
        control.addEventListener( 'ReadablerToggleBoxChanged', this.cognitiveReading );

    },

    /**
     * Toggle Cognitive Reading mode
     * @param e
     */
    cognitiveReading: function ( e ) {

        /** Get text elements. */
        if ( ! document.querySelectorAll( `${ actionCognitiveReading.textSelectors}` ) ) { return; }

        /** Enable or disable Cognitive Reading. */
        e.target.classList.contains( 'mdp-active' ) ? actionCognitiveReading.enableCognitiveReading() : actionCognitiveReading.disableCognitiveReading();

    },

    /**
     * Enable Cognitive Reading mode.
     */
    enableCognitiveReading: function () {

        /** Add class to body. */
        document.body.classList.add( 'mdp-readabler-cognitive-reading' );

        // Add cognitive experience to text elements.
        this.addCognitiveExperience();

    },

    /**
     * Disable Cognitive Reading mode.
     */
    disableCognitiveReading: function () {

        /** Remove class from body to reset Cognitive Reading to default state. */
        document.body.classList.remove( 'mdp-readabler-cognitive-reading' );

        // Remove cognitive experience from text elements.
        document.querySelectorAll( 'b.mdp-readabler-cognitive-reading' ).forEach( ( tag ) => {

            tag.outerHTML = tag.innerHTML;

        } );

        // Remove color from text elements.
        document.querySelectorAll( '.mdp-readabler-cognitive-reading-color' ).forEach( ( tag ) => {

            tag.style.color = '';
            tag.classList.remove( 'mdp-readabler-cognitive-reading-color' );

        } );

    },

    /**
     * Cognitive Reading for plain text without children nodes.
     * @param tag
     */
    cognitivePlaintNode: function ( tag ) {

        if ( this.isSkipNode( tag ) ) return;

        // Skip if the tag is empty or contains less than 2 characters.
        if ( tag.innerText === '' || tag.innerText.length < 2 ) { return; }

        // Get the text color of the tag.
        let color = getComputedStyle( tag ).color;

        // Make sentence more congnitive.
        tag.innerHTML = this.cognitiveSentence( tag.innerText, color );

        // Add cognitive focus to tag.
        this.addCognitiveFocus( tag );

    },

    /**
     * Cognitive Reading for mixed nodes contains plain text with children nodes.
     * @param tag
     */
    cognitiveMixedNode: function ( tag ) {

        if ( this.isSkipNode( tag ) ) return;

        // If tag has text in root
        const rootText = tag.innerHTML.replaceAll( /(<+.+>)/g, '');
        if ( rootText.trim().length === 0 ) {
            return;
        }

        // Get the text color of the tag.
        let color = getComputedStyle( tag ).color;

        // New tag innerHTML
        let newTagInnerHTML = [];

        // Split by tags
        const byT = tag.innerHTML.split(/(<+.+>)/g);
        byT.forEach( ( t ) => {

            if ( ! t ) {
                newTagInnerHTML.push( t );
                return;
            }

            if ( t.match( /(<[^>]+>)/g ) || t.match( /(<\/[^>]+>)/g ) ) {
                newTagInnerHTML.push( t );
                return;
            }

            if ( t.trim() === '' || t.trim() === '.' || t.trim() === ',' || t.trim() === ':' || t.trim() === ';' || t.trim() === '?' || t.trim() === '!' ) {
                newTagInnerHTML.push( t );
                return;
            }

            newTagInnerHTML.push( this.cognitiveSentence( t, color ) );

        } );

        // Join new tag innerHTML
        tag.innerHTML = newTagInnerHTML.join('');

        // Add cognitive focus to tag.
        this.addCognitiveFocus( tag );

    },

    /**
     * Add cognitive experience to text elements.
     */
    addCognitiveExperience: function () {

        /** Add cognitive experience to text elements without children nodes */
        document.querySelectorAll( `${ actionCognitiveReading.textSelectors}` ).forEach( ( tag ) => {

            if ( tag.children.length === 0 ) {
                this.cognitivePlaintNode( tag );
            }

        } );

        /** Add cognitive experience to text elements with children nodes */
        document.querySelectorAll( `${ actionCognitiveReading.textSelectors}` ).forEach( ( tag ) => {

            if ( tag.children.length !== 0 ) {
                this.cognitiveMixedNode( tag );
            }

        } );

    },

    /**
     * Manage colors to add a cognitive focus to text elements.
     * @param tag
     */
    addCognitiveFocus: function ( tag ) {

        // Get the text color of the tag.
        let color = getComputedStyle( tag ).color;

        // Color management.
        const isFocus = window.mdpReadablerOptions.cognitiveReadingFocus ?? false;
        if ( isFocus ) {
            tag.classList.add( 'mdp-readabler-cognitive-reading-color' );
            tag.style.color = actionCognitiveReading.toRGBA( color, 0.5 );
        }

    },

    /**
     * Change opacity of the color.
     * @param color
     * @param alpha
     * @returns {*|string}
     */
    toRGBA: function ( color, alpha = 1 ) {

        // Return RGBA if already RGBA.
        if ( color.indexOf( 'rgba' ) !== -1 ) { return color; }

        // Return RGB if already RGB.
        if ( color.indexOf( 'rgb' ) !== -1 ) { return color.replace( 'rgb', 'rgba' ).replace( ')', `, ${ alpha })` ); }

        // Return HEX if HEX.
        if ( color.indexOf( '#' ) !== -1 ) {

            // Remove the "#" symbol if present
            let hex = color.replace('#', '');

            // Parse the red, green, and blue components
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // Ensure the alpha value is within the range [0, 1]
            alpha = Math.min(Math.max(alpha, 0), 1);

            // Assemble and return the RGBA color value
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;

        }

        return color;

    },

    /**
     * Make sentence more congnitive.
     * @param sentence
     * @param color
     * @return {string}
     */
    cognitiveSentence: function( sentence, color ) {

        let words = [];
        sentence.split(/\s+/).forEach( ( word ) => {

            if ( word.trim().length === 0 ) {
                words.push( word );
                return;
            }

            words.push( actionCognitiveReading.congnitiveWord( word, color ) );

        } );

        return words.join(' ');

    },

    /**
     * Make word more congnitive.
     * @param word
     * @param color
     */
    congnitiveWord( word, color ) {

        const orp = actionCognitiveReading.charIndex( word );

        const isFocus = window.mdpReadablerOptions.cognitiveReadingFocus ?? false;
        const inlineStyle = isFocus ? ` style="color: ${ color } !important;"` : '';

        return `<b class="mdp-readabler-cognitive-reading"${ inlineStyle }>${ word.slice( 0, orp ) }</b>${ word.slice( orp ) }`;

    },

    /**
     * Calculate character index for Optimal Reading Position.
     * @param word
     * @returns {number}
     */
    charIndex: function ( word ) {

        // Skip if word is too short.
        if ( word.length < 3 ) { return 0; }

        // Skip if word contains numbers.
        if ( /\d/.test( word ) ) { return word.length; }

        // Skip masked links.
        if ( word.includes( '[[[mdp-readabler-cognitive-reading-a]]]' ) ) { return 0; }

        // Skip if word starts with @ # & ( ) – [ { } ] : ; ? / * ` ~ $ ^ + = < > . characters
        if ( /^[#@&()–\[\]{}:;?/*`~$^+=<>.,]/.test( word ) ) { return 0; }

        // Calculate Optimal Reading Position.
        const fixation = window.mdpReadablerOptions.cognitiveReadingFixation ?? 'normal';
        let orp = Math.min( Math.floor( word.length / 3 ), word.length - 1 );
        switch ( fixation ) {
            case 'low':
                orp = Math.min( Math.floor( word.length / 4 ), word.length - 1 );
                break;
            case 'strong':
                orp = Math.min( Math.floor( word.length / 2 ), word.length - 1 );
                break;
            default:
                break;

        }

        // Set Optimal Reading Position to 2 if word is longer than 3 characters.
        if ( orp === 1 && word.length > 2 ) { return 2; }

        return orp;

    },

    /**
     * Check if the node is skip.
     * @param tag
     * @returns {boolean}
     */
    isSkipNode: function ( tag ) {

        // Skip if tag is not an element.
        if ( tag.nodeType !== 1 ) {
            return true;
        }

        // Skip readabler nodes.
        if ( tag.className.includes( 'mdp-readabler' ) || tag.id.includes( 'mdp-readabler' ) ) {
            return true;
        }

        // Skip for every tag inside the popup box.
        return tag.closest( '#mdp-readabler-popup-box');

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text/_actionFontSizing.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text/_actionFontSizing.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionFontSizing: () => (/* binding */ actionFontSizing)
/* harmony export */ });
/**
 * Font Sizing.
 **/
const actionFontSizing = {

    fontSizingStyle: document.createElement('style'),

    /**
     * Text tags for processing
     */
    textTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p',
        'span',
        'a',
        'li',
        'label',
        'input',
        'select',
        'textarea',
        'legend',
        'code',
        'pre',
        'dd',
        'dt',
        'span',
        'blockquote',
        'th',
        'bdi',
        'button[type="submit"]',
        'button.fusion-button'
    ],

    /**
     * Initialise Font Sizing action.
     **/
    init: function () {

        /** Listen for Font Sizing change. */
        let fontSizing = document.querySelector( '#mdp-readabler-action-font-sizing .mdp-readabler-value' );
        fontSizing.addEventListener( 'ReadablerInputSpinnerChanged', this.fontSizing );

    },

    /**
     * Scaling font by inline element CSS
     * @param scale - Scale value in percents but without %
     * @param evDetail - Event detail
     */
    fontScaling: function ( scale, evDetail ) {

        // Detect Avada
        const isAvada = typeof avadaHeaderVars === 'object' || typeof avadaSelectVars === 'object';

        for ( let tag of actionFontSizing.textTags ) {

            if ( ! document.querySelectorAll( tag ) || document.querySelectorAll( tag ).length === 0 ) { continue; }

            for ( let textElement of document.querySelectorAll( tag ) ) {

                let applyParentSize = false;

                // Workaround wrong text scaling in Avada
                if ( isAvada ) {

                    if ( actionFontSizing.avadaFontScaling( textElement ) ) {
                        continue;
                    }

                }

                // Run only for a first load
                if ( evDetail.load ) {

                    // Find the closest element with original-size attribute
                    let closestElement = textElement.closest('[original-size]');
                    if ( closestElement ) {

                        const textElementSize = window.getComputedStyle(textElement).fontSize.split('px', 1)[0];
                        const closestElementSize = window.getComputedStyle(closestElement).fontSize.split('px', 1)[0];

                        if (parseInt(textElementSize) === parseInt(closestElementSize)) {
                            continue;
                        }

                    }

                } else {

                    // If a parent element has original-size attribute, then skip this element
                    if ( textElement.tagName !== 'INPUT' ) {

                        const textOgiSize = this.getElementOriginalSize( textElement );
                        const parentOriginalSize = this.getParentOriginalSize( textElement );

                        applyParentSize = parentOriginalSize !== null && textOgiSize === parentOriginalSize;

                    }

                }

                // Apply font size
                if ( applyParentSize ) {

                    const parentOriginalSize = this.getParentOriginalSize( textElement );
                    textElement.style.fontSize = `${ this.newFontSize( parentOriginalSize, scale ) }px`;

                } else {

                    const originalSize = this.getElementOriginalSize( textElement );
                    textElement.style.fontSize = `${ this.newFontSize( originalSize, scale ) }px`;

                }

            }

        }

    },

    /**
     * Increase/Decrease Font Size.
     * @param ev - Event.
     **/
    fontSizing: function ( ev ) {

        let scale = parseInt( ev.target.dataset.value );

        /** Remove class from body to reset font size to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-font-sizing' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-font-sizing' );

        /** Add inline css */
        actionFontSizing.fontScaling( scale, ev.detail ?? {} );

    },

    /**
     * Get original size
     * @param textElement
     * @returns {any}
     */
    getElementOriginalSize: function ( textElement ) {

        // Get original font size
        let originalSize = window.getComputedStyle( textElement ).fontSize.split( 'px', 1 )[ 0 ];
        originalSize = parseInt( originalSize );

        // Update original size from data attribute
        textElement.getAttribute( 'original-size' ) === null ?
            textElement.setAttribute( 'original-size', originalSize ) :
            originalSize = textElement.getAttribute( 'original-size' );

        return originalSize;

    },

    /**
     * Get parent original size
     * @param textElement
     * @returns {string|null}
     */
    getParentOriginalSize: function ( textElement ) {

        const parentEl = textElement.parentElement;
        if ( ! parentEl ) {
            return null;
        }

        return parentEl.getAttribute( 'original-size' );

    },

    /**
     * Calculate new font size
     * @param size
     * @param scale
     * @returns {number}
     */
    newFontSize: function ( size, scale ) {

        return Math.floor( parseInt( size ) + size * ( scale * .01 ) );

    },

    /**
     * Scaling font by inline element CSS
     * @param textElement
     * @returns {boolean}
     */
    avadaFontScaling: function ( textElement ) {

        setTimeout(function () {

            let styleAttribute = textElement.getAttribute('style');

            // Remove Avada's Responsive Typography class
            if ( styleAttribute && styleAttribute.includes('--fontSize')) {

                styleAttribute = styleAttribute.replace('--fontSize:', '--fusionFontSize:');
                textElement.setAttribute('style', styleAttribute);

            }

            // Remove Avada's Responsive Typography class
            if ( textElement.classList.contains( 'fusion-responsive-typography-calculated' ) ) {

                textElement.classList.remove( 'fusion-responsive-typography-calculated' );

            }

        }, 0 );

        if ( textElement.tagName !== 'INPUT' && textElement.tagName !== 'BUTTON' ) {

            // Apply only for parent text node
            if ( textElement.parentElement.getAttribute( 'original-size' ) !== null ||
                textElement.parentElement.parentElement.getAttribute( 'original-size' ) !== null
            ) {

                // If a text element has style attribute, then remove  font size from it
                if ( textElement.getAttribute( 'style' ) !== null ) {

                    let styleAttribute = textElement.getAttribute( 'style' );

                    styleAttribute = styleAttribute.replace( /font-size:.*?;/, '' );
                    styleAttribute = styleAttribute.replace( 'font-size:', '' );
                    textElement.setAttribute( 'style', styleAttribute );

                }

                return true;

            }

        }

        return false;

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text/_actionLetterSpacing.js":
/*!**************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text/_actionLetterSpacing.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionLetterSpacing: () => (/* binding */ actionLetterSpacing)
/* harmony export */ });
/**
 * Letter Spacing.
 **/
const actionLetterSpacing = {

    letterSpacingStyle: document.createElement( 'style' ),

    /**
     * Initialise Letter Spacing action.
     **/
    init: function () {

        /** Listen for Letter Spacing change. */
        let letterSpacing = document.querySelector( '#mdp-readabler-action-letter-spacing .mdp-readabler-value' );
        letterSpacing.addEventListener( 'ReadablerInputSpinnerChanged', this.letterSpacing );

    },

    /**
     * Increase/Decrease Letter Spacing.
     **/
    letterSpacing: function ( e ) {

        /** Scale factor. */
        let scale = parseInt( e.target.dataset.value );

        /** Remove class from body to reset font size to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-letter-spacing' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-letter-spacing' );

        /** Calculate font sizes. */
        let letterSpacing = (scale / 100);

        /** Add CSS to header. */
        //language=CSS
        actionLetterSpacing.letterSpacingStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-letter-spacing,
                body.mdp-readabler-letter-spacing h1,
                body.mdp-readabler-letter-spacing h1 span,
                body.mdp-readabler-letter-spacing h2,
                body.mdp-readabler-letter-spacing h2 span,
                body.mdp-readabler-letter-spacing h3,
                body.mdp-readabler-letter-spacing h3 span,
                body.mdp-readabler-letter-spacing h4,
                body.mdp-readabler-letter-spacing h4 span,
                body.mdp-readabler-letter-spacing h5,
                body.mdp-readabler-letter-spacing h5 span,
                body.mdp-readabler-letter-spacing h6,
                body.mdp-readabler-letter-spacing h6 span,
                
                body.mdp-readabler-letter-spacing p,
                body.mdp-readabler-letter-spacing li,
                body.mdp-readabler-letter-spacing label,
                body.mdp-readabler-letter-spacing input,
                body.mdp-readabler-letter-spacing select,
                body.mdp-readabler-letter-spacing textarea,
                body.mdp-readabler-letter-spacing legend,
                body.mdp-readabler-letter-spacing code,
                body.mdp-readabler-letter-spacing pre,
                body.mdp-readabler-letter-spacing dd,
                body.mdp-readabler-letter-spacing dt,
                body.mdp-readabler-letter-spacing span,
                body.mdp-readabler-letter-spacing blockquote {
                    letter-spacing: ${letterSpacing}px !important;    
                }
            `;

        document.head.appendChild( actionLetterSpacing.letterSpacingStyle );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/text/_actionLineHeight.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/text/_actionLineHeight.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionLineHeight: () => (/* binding */ actionLineHeight)
/* harmony export */ });
/**
 * Line Height.
 **/
const actionLineHeight = {

    lineHeightStyle: document.createElement('style'),

    /**
     * Initialise Line Height action.
     **/
    init: function () {

        /** Listen for Line Height change. */
        let lineHeight = document.querySelector( '#mdp-readabler-action-line-height .mdp-readabler-value' );
        lineHeight.addEventListener( 'ReadablerInputSpinnerChanged', this.lineHeight );

    },

    /**
     * Scaling line-height by inline element CSS
     * @param tags - Tags for processing
     * @param scale - Scale value in percents but without %
     */
    fontLeading: function ( tags, scale ) {

        for ( let tag of tags ) {

            if ( document.getElementsByTagName( tag ).length > 0 ) {

                for ( let textElement of document.getElementsByTagName( tag ) ) {

                    // Get original font size
                    let originalSize = window.getComputedStyle( textElement ).lineHeight.split( 'px', 1 )[ 0 ];

                    // Update original size from data attribute
                    textElement.getAttribute( 'original-leading' ) === null ?
                        textElement.setAttribute( 'original-leading', originalSize ) :
                        originalSize = textElement.getAttribute( 'original-leading' );

                    // Set new font size
                    textElement.style.lineHeight = `${ parseInt( originalSize ) + originalSize * ( scale * .01 ) }px`;

                }

            }

        }

    },

    /**
     * Increase/Decrease Line Height.
     **/
    lineHeight: function ( e ) {

        /** Scale factor. */
        let scale = parseInt( e.target.dataset.value );
        const textTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'p', 'a', 'li', 'label', 'input', 'select', 'textarea', 'legend', 'code', 'pre', 'dd', 'dt', 'span', 'blockquote'];

        /** Remove class from body to reset line-height to default values. */
        if ( 0 === scale ) {
            document.body.classList.remove( 'mdp-readabler-line-height' );
            return;
        }

        /** Add class to body, to apply styles. */
        document.body.classList.add( 'mdp-readabler-line-height' );

        /** Add inline css */
        actionLineHeight.fontLeading( textTags, scale );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/_delay.js":
/*!*****************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/_delay.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   delay: () => (/* binding */ delay)
/* harmony export */ });
/**
 * Executing a function after delay for a specified amount of time.
 * Example: the user has stopped typing.
 **/
function delay( fn, ms ) {

    let timer = 0

    return function ( ...args ) {

        clearTimeout( timer )

        timer = setTimeout( fn.bind( this, ...args ), ms || 0 )

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/_inputSpinner.js":
/*!************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/_inputSpinner.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inputSpinner: () => (/* binding */ inputSpinner)
/* harmony export */ });
/* harmony import */ var _localStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_localStorage */ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js");


/**
 * Input Spinner control.
 **/
const inputSpinner = {

    /**
     * Initialise Input Spinner.
     **/
    init: function () {

        /** Plus Button click. */
        let plusBtns = document.querySelectorAll( '.mdp-readabler-input-spinner-box .mdp-readabler-plus' );
        plusBtns.forEach( plusButton => plusButton.addEventListener( 'click', ( e ) => inputSpinner.step( e ) ) );

        /** Minus Button click. */
        let minusBtns = document.querySelectorAll( '.mdp-readabler-input-spinner-box .mdp-readabler-minus' );
        minusBtns.forEach( minusButton => minusButton.addEventListener( 'click', ( e ) => inputSpinner.step( e ) ) );

        let interval;

        /** Continuous mouse click event. */
        /** Plus button. */
        plusBtns.forEach( plusButton => plusButton.addEventListener( 'mousedown', ( e ) => {
            interval = setInterval( function () {
                inputSpinner.step( e );
            }, 500 );
        } ) );

        plusBtns.forEach( plusButton => plusButton.addEventListener( 'mouseup', () => {
            clearInterval( interval );
        } ) );

        plusBtns.forEach( plusButton => plusButton.addEventListener( 'mouseleave', () => {
            clearInterval( interval );
        } ) );

        /** Minus button. */
        minusBtns.forEach( minusButton => minusButton.addEventListener( 'mousedown', ( e ) => {
            interval = setInterval( function () {
                inputSpinner.step( e );
            }, 500 );
        } ) );

        minusBtns.forEach( minusButton => minusButton.addEventListener( 'mouseup', () => {
            clearInterval( interval );
        } ) );

        minusBtns.forEach( minusButton => minusButton.addEventListener( 'mouseleave', () => {
            clearInterval( interval );
        } ) );

    },

    /**
     * Increase/Decrease value.
     **/
    step: function ( e ) {

        let valueElement = e.target.closest( '.mdp-readabler-control' ).querySelector( '.mdp-readabler-value' );
        let value = parseInt( valueElement.dataset.value );

        let step = parseInt( e.target.closest( '.mdp-readabler-input-spinner-box' ).dataset.step );

        /** Increase/Decrease value by step. */
        if ( e.target.classList.contains( 'mdp-readabler-minus' ) ) {
            value = value - step;
        } else {
            value = value + step;
        }

        /** Save new value. */
        valueElement.dataset.value = value.toString();

        /** Set label by value. */
        inputSpinner.setLabel( valueElement, value );

        /** Save value to localStorage. */
        (0,_localStorage__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-action-box').id, valueElement.dataset.value );

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerInputSpinnerChanged', {} );

        /** Fire custom event ReadablerInputSpinnerChanged. */
        valueElement.dispatchEvent( event );

        const analyticsEvent = new CustomEvent(
            'ReadablerAnalyticsEvent',
            {
                detail: {
                    id: e.target.closest( '.mdp-readabler-action-box').id,
                    value: valueElement.dataset.value > 0 ? 1 : 0,
                }
            }
        );
        window.dispatchEvent( analyticsEvent );

    },

    /**
     * Set label by value.
     **/
    setLabel: function ( element, value ) {

        /** Now we for sure work with int. */
        value = parseInt( value );
        let options = window.mdpReadablerOptions;

        if ( 0 === value ) {
            element.innerHTML = options.DEFAULT;
        } else {
            let sign = value > 0 ? '+' : '';
            element.innerHTML = sign + value + '%';
        }

    },

    /**
     * Set value to some spinner box from localstorage.
     **/
    loadSaved: function () {

        /** All spinner Boxes. */
        let spinnerBoxes = document.querySelectorAll( '.mdp-readabler-spinner-box' );

        spinnerBoxes.forEach( box => {

            let value = (0,_localStorage__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id );

            if ( ! value ) { return; }

            value = parseInt( value );

            if ( 0 === value ) { return; }

            let valueElement = box.querySelector( '.mdp-readabler-value' );
            valueElement.dataset.value = value.toString();

            /** Set label by value. */
            inputSpinner.setLabel( valueElement, value );

            /** Fire change event. */
            const event = new CustomEvent(
                'ReadablerInputSpinnerChanged',
                {
                    detail: {
                        load: true
                    }
                }
            );

            /** Fire custom event ReadablerInputSpinnerChanged. */
            valueElement.dispatchEvent( event );


        } );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js":
/*!************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLocal: () => (/* binding */ getLocal),
/* harmony export */   setLocal: () => (/* binding */ setLocal)
/* harmony export */ });
// noinspection JSUnresolvedReference

/**
 * Wrapper for localStorage.getItem, add prefix to all keys.
 *
 * @param key
 **/
function getLocal( key ) {

    // If saveConfig is off, don't save anything.
    if ( ! window.mdpReadablerOptions.saveConfig || window.mdpReadablerOptions.saveConfig === 'off' ) {
        return null;
    }

    /** Prefix for all localStorage keys. */
    let prefix = 'mdpReadabler';

    try {

        return localStorage.getItem( prefix + key );

    } catch ( e ) {

        return null;

    }

}

/**
 * Wrapper for localStorage.setItem, add prefix to all keys.
 *
 * @param key
 * @param value
 **/
function setLocal( key, value ) {

    // If saveConfig is off, don't save anything.
    if ( ! window.mdpReadablerOptions.saveConfig || window.mdpReadablerOptions.saveConfig === 'off' ) {
        return false;
    }

    /** Prefix for all localStorage keys. */
    let prefix = 'mdpReadabler';

    try {

        return localStorage.setItem( prefix + key, value );

    } catch ( e ) {

        return false;

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/_paletteBox.js":
/*!**********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/_paletteBox.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   paletteBox: () => (/* binding */ paletteBox)
/* harmony export */ });
/* harmony import */ var _localStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_localStorage */ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js");


/**
 * Palette control.
 **/
const paletteBox = {

    /**
     * Initialise Palette.
     **/
    init: function () {


        let palettes = document.querySelectorAll( '.mdp-readabler-palette-box' );

        /** Color click. */
        palettes.forEach( palette => palette.addEventListener( 'click', ( e ) => paletteBox.selectColor( e ) ) );

        /** Color keydown. */
        palettes.forEach( palette => palette.addEventListener( 'keydown', ( e ) => paletteBox.selectColor( e ) ) );

    },

    /**
     * Select color by click.
     **/
    selectColor: function ( e ) {

        if ( e.type === 'keydown' && e.keyCode !== 13 ) { return }

        /** Process only color click. */
        if ( ! e.target.classList.contains( 'mdp-readabler-color' )  ) { return; }

        let currentPalette = e.target.closest( '.mdp-readabler-palette-box' );

        /** If clicked same color disable all colors. */
        if ( e.target.classList.contains( 'mdp-active' ) ) {

            /** Deactivate current color. */
            e.target.classList.remove( 'mdp-active' );

            /** Fire ReadablerPaletteChanged event. */
            paletteBox.firePaletteChange( currentPalette, null );

            /** Save value to localStorage. */
            (0,_localStorage__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-palette-box' ).id, null );

            /** Disable prev color and enable current. */
        } else {

            /** Deactivate another previous color. */
            let prevColor = currentPalette.querySelector( '.mdp-readabler-color.mdp-active' );
            if ( null !== prevColor ) {
                prevColor.classList.remove( 'mdp-active' );
            }

            /** Activate current color. */
            e.target.classList.add( 'mdp-active' );

            /** Fire ReadablerPaletteChanged event. */
            paletteBox.firePaletteChange( currentPalette, e.target.dataset.color );

            /** Save value to localStorage. */
            (0,_localStorage__WEBPACK_IMPORTED_MODULE_0__.setLocal)( e.target.closest( '.mdp-readabler-palette-box' ).id, e.target.dataset.color );

        }

    },

    /**
     * Enable some colors from localstorage.
     **/
    loadSaved: function () {

        /** All palette Boxes. */
        let paletteBoxes = document.querySelectorAll( '.mdp-readabler-palette-box' );

        paletteBoxes.forEach( box => {

            let colorValue = (0,_localStorage__WEBPACK_IMPORTED_MODULE_0__.getLocal)( box.id );
            if ( null === colorValue ) { return; }

            let colors = box.querySelectorAll( '.mdp-readabler-color' );

            colors.forEach( color => {

                if ( color.dataset.color === colorValue ) {
                    color.click();
                }

            } );

        } );

    },

    /**
     * Create and trigger custom event ReadablerPaletteChanged.
     **/
    firePaletteChange: function ( element, color ) {

        /** Create the event. */
        const event = new CustomEvent( 'ReadablerPaletteChanged', {detail: {color: color}} );

        /** Fire custom event ReadablerPaletteChanged. */
        element.dispatchEvent( event );

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/_remove-select2.js":
/*!**************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/_remove-select2.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   removeSelect2: () => (/* binding */ removeSelect2)
/* harmony export */ });
/**
 * Remove select2 in the Readabler popup
 * @param popup
 */
function removeSelect2( popup ) {

    const select2span = popup.querySelectorAll( '.select2' );
    select2span.forEach( span => span.remove() );

    const select2select = popup.querySelectorAll( '.select2-hidden-accessible' );
    select2select.forEach( select => {

        select.classList.remove( 'select2-hidden-accessible' );
        select.removeAttribute( 'tabindex' );

    } );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/clickHandler.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/clickHandler.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clickHandler: () => (/* binding */ clickHandler)
/* harmony export */ });
/* harmony import */ var _popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../popup/popup-helper */ "./wp-content/plugins/readabler/source/js/includes/popup/popup-helper.js");


/**
 * Click handler document
 * @param ev
 */
function clickHandler( ev ) {

    const options = window.mdpReadablerOptions;

    const $target = ev.target;
    const popupID = 'mdp-readabler-popup';
    const triggerButtonID = 'mdp-readabler-trigger-button';
    const closeButtonID = 'mdp-readabler-popup-close';

    /** Click on float trigger button. */
    if ( $target.id === triggerButtonID || $target.closest( `#${ triggerButtonID }` ) ) {

        ev.preventDefault();
        (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.togglePopup)( ev );

        return;

    }

    /**
     * Click on an element with class readabler-trigger
     */
    if ( $target.classList.contains( 'readabler-trigger' ) || $target.closest( '.readabler-trigger' ) ) {

        ev.preventDefault();
        (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.togglePopup)( ev );

        return;

    }

    /** Click on data-attribute = "data-readabler-show" */
    if ( $target.dataset.readablerShow ) {

        ev.preventDefault();
        (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.showPopup)();

        return;

    }

    /** Click on close(cross) button. */
    if ( $target.id === closeButtonID || $target.closest( `#${ closeButtonID }` ) ) {

        ev.preventDefault();
        (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.closePopup)( ev );

        return;

    }

    /** Click outside popup. */
    if ( options.closeAnywhere === '1' ) {

        if ( $target.id !== popupID && ! $target.closest( `#${ popupID }` ) ) {

            // Do only if the popup is open.
            if ( document.querySelector( `#mdp-readabler-popup-box.is-open` ) ) {
                ev.preventDefault();
                (0,_popup_popup_helper__WEBPACK_IMPORTED_MODULE_0__.closePopup)( ev );
            }

        }

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/focus-snail.js":
/*!**********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/focus-snail.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   focusSnail: () => (/* binding */ focusSnail)
/* harmony export */ });
/**
 * Focus Snail.
 * @see https://github.com/NV/focus-snail/
 *
 * Update with care, changes have been made.
 **/
const focusSnail = (function() {
    'use strict';

    const OFFSET_PX = 0;
    const MIN_WIDTH = 12;
    const MIN_HEIGHT = 8;

    const START_FRACTION = 0.4;
    const MIDDLE_FRACTION = 0.8;

    const focusSnail = {
        enabled: false,
        trigger: trigger
    };

    /**
     * @param {Element} prevFocused
     * @param {Element|EventTarget} target
     */
    function trigger(prevFocused, target) {
        if (svg) {
            onEnd();
        } else {
            initialize();
        }

        const prev = dimensionsOf( prevFocused );
        const current = dimensionsOf( target );

        let left = 0;
        let prevLeft = 0;
        let top = 0;
        let prevTop = 0;

        const distance = dist( prev.left, prev.top, current.left, current.top );
        const duration = animationDuration( distance );

        function setup() {
            const scroll = scrollOffset();
            svg.style.left = scroll.left + 'px';
            svg.style.top = scroll.top + 'px';
            svg.setAttribute('width', win.innerWidth.toString());
            svg.setAttribute('height', win.innerHeight.toString());
            svg.classList.add('focus-snail_visible');
            left = current.left - scroll.left;
            prevLeft = prev.left - scroll.left;
            top = current.top - scroll.top;
            prevTop = prev.top - scroll.top;
        }

        let isFirstCall = true;

        animate(function(fraction) {
            if (isFirstCall) {
                setup();
                setGradientAngle(gradient, prevLeft, prevTop, prev.width, prev.height, left, top, current.width, current.height);
                const list = getPointsList( {
                    top: prevTop,
                    right: prevLeft + prev.width,
                    bottom: prevTop + prev.height,
                    left: prevLeft
                }, {
                    top: top,
                    right: left + current.width,
                    bottom: top + current.height,
                    left: left
                } );
                enclose(list, polygon);
            }

            const startOffset = fraction > START_FRACTION ? easeOutQuad( (fraction - START_FRACTION) / (1 - START_FRACTION) ) : 0;
            const middleOffset = fraction < MIDDLE_FRACTION ? easeOutQuad( fraction / MIDDLE_FRACTION ) : 1;
            start.setAttribute('offset', startOffset * 100 + '%');
            middle.setAttribute('offset', middleOffset * 100 + '%');

            if (fraction >= 1) {
                onEnd();
            }

            isFirstCall = false;
        }, duration);
    }

    function animationDuration(distance) {
        return Math.pow(constrain(distance, 32, 1024), 1/3) * 50;
    }

    function easeOutQuad(x) {
        return 2*x - x*x;
    }

    let win = window;
    const doc = document;
    const docElement = doc.documentElement;
    const body = doc.body;

    let prevFocused = null;
    let animationId = 0;
    let keyDownTime = 0;

    // noinspection JSUnusedLocalSymbols
    docElement.addEventListener('keydown', function(event) {
        if (!focusSnail.enabled) {
            return;
        }
        keyDownTime = Date.now();
    }, false);

    docElement.addEventListener('blur', function(e) {
        if (!focusSnail.enabled) {
            return;
        }
        onEnd();
        if (isJustPressed()) {
            prevFocused = e.target;
        } else {
            prevFocused = null;
        }
    }, true);

    docElement.addEventListener('focus', function(event) {

        if (!prevFocused) {
            return;
        }
        if (!isJustPressed()) {
            return;
        }

        trigger( prevFocused, event.target );

    }, true);

    function setGradientAngle(gradient, ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {

        const centroidA = rectCentroid( ax, ay, aWidth, aHeight );
        const centroidB = rectCentroid( bx, by, bWidth, bHeight );
        const angle = Math.atan2( centroidA.y - centroidB.y, centroidA.x - centroidB.x );
        const line = angleToLine( angle );

        gradient.setAttribute( 'x1', line.x1 );
        gradient.setAttribute( 'y1', line.y1 );
        gradient.setAttribute( 'x2', !isNaN( line.x2 ) ? line.x2 : 0 );
        gradient.setAttribute( 'y2', !isNaN( line.y2 ) ? line.y2 : 0 );

    }

    function rectCentroid(x, y, width, height) {
        return {
            x: x + width / 2,
            y: y + height / 2
        };
    }

    function angleToLine(angle) {
        const segment = Math.floor( angle / Math.PI * 2 ) + 2;
        const diagonal = Math.PI / 4 + Math.PI / 2 * segment;

        const od = Math.sqrt( 2 );
        const op = Math.cos( Math.abs( diagonal - angle ) ) * od;
        const x = op * Math.cos( angle );
        const y = op * Math.sin( angle );

        return {
            x1: x < 0 ? 1 : 0,
            y1: y < 0 ? 1 : 0,
            x2: x >= 0 ? x : x + 1,
            y2: y >= 0 ? y : y + 1
        };
    }

    /** @type {SVGSVGElement} */
    let svg = null;

    /** @type {SVGPolygonElement} */
    let polygon = null;

    /** @type SVGStopElement */
    let start = null;

    /** @type SVGStopElement */
    let middle = null;

    /** @type SVGStopElement */
    let end = null;

    /** @type SVGLinearGradientElement */
    let gradient = null;

    function htmlFragment() {
        const div = doc.createElement( 'div' );
        // noinspection RequiredAttributes
        div.innerHTML = '<svg id="focus-snail_svg" width="1000" height="800">\
		<linearGradient id="focus-snail_gradient">\
			<stop id="focus-snail_start" offset="0%" stop-color="' + options.highlightFocusColor + '" stop-opacity="0"/>\
			<stop id="focus-snail_middle" offset="80%" stop-color="' + options.highlightFocusColor + '" stop-opacity="0.8"/>\
			<stop id="focus-snail_end" offset="100%" stop-color="' + options.highlightFocusColor + '" stop-opacity="0"/>\
		</linearGradient>\
		<polygon id="focus-snail_polygon" fill="url(#focus-snail_gradient)"/>\
	</svg>';
        return div;
    }

    function initialize() {
        const html = htmlFragment();
        svg = getId(html, 'svg');
        polygon = getId(html, 'polygon');
        start = getId(html, 'start');
        middle = getId(html, 'middle');
        end = getId(html, 'end');
        gradient = getId(html, 'gradient');
        body.appendChild(svg);
    }

    function getId(elem, name) {
        return elem.querySelector('#focus-snail_' + name);
    }

    function onEnd() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
            svg.classList.remove('focus-snail_visible');
        }
    }

    function isJustPressed() {
        return Date.now() - keyDownTime < 42
    }

    function animate(onStep, duration) {
        const start = Date.now();
        (function loop() {
            animationId = requestAnimationFrame(function() {
                const diff = Date.now() - start;
                const fraction = diff / duration;
                onStep(fraction);
                if (diff < duration) {
                    loop();
                }
            });
        })();
    }

    function getPointsList(a, b) {
        let x = 0;

        if (a.top < b.top)
            x = 1;

        if (a.right > b.right)
            x += 2;

        if (a.bottom > b.bottom)
            x += 4;

        if (a.left < b.left)
            x += 8;

        const dict = [
            [],
            [0, 1],
            [1, 2],
            [0, 1, 2],
            [2, 3],
            [0, 1], // FIXME: do two polygons
            [1, 2, 3],
            [0, 1, 2, 3],
            [3, 0],
            [3, 0, 1],
            [3, 0], // FIXME: do two polygons
            [3, 0, 1, 2],
            [2, 3, 0],
            [2, 3, 0, 1],
            [1, 2, 3, 0],
            [0, 1, 2, 3, 0]
        ];

        const points = rectPoints( a ).concat( rectPoints( b ) );
        const list = [];
        const indexes = dict[x];
        let i;
        for ( i = 0; i < indexes.length; i++) {
            list.push(points[indexes[i]]);
        }
        while (i--) {
            list.push(points[indexes[i] + 4]);
        }
        return list;
    }

    function enclose(list, polygon) {
        polygon.points.clear();
        for ( let i = 0; i < list.length; i++) {
            const p = list[i];
            addPoint(polygon, p);
        }
    }

    function addPoint(polygon, point) {

        const pt = polygon.ownerSVGElement.createSVGPoint();
        pt.x = !isNaN( point.x ) ? point.x : 0;
        pt.y = !isNaN( point.y ) ? point.y : 0;
        polygon.points.appendItem(pt);

    }

    function rectPoints(rect) {
        return [
            {
                x: rect.left,
                y: rect.top
            },
            {
                x: rect.right,
                y: rect.top
            },
            {
                x: rect.right,
                y: rect.bottom
            },
            {
                x: rect.left,
                y: rect.bottom
            }
        ];
    }

    function dimensionsOf(element) {
        const offset = offsetOf( element );
        return {
            left: offset.left - OFFSET_PX,
            top: offset.top - OFFSET_PX,
            width: Math.max(MIN_WIDTH, element.offsetWidth) + 2*OFFSET_PX,
            height: Math.max(MIN_HEIGHT, element.offsetHeight) + 2*OFFSET_PX
        };
    }

    function offsetOf(elem) {
        const rect = elem.getBoundingClientRect();
        const scroll = scrollOffset();

        const clientTop = docElement.clientTop || body.clientTop,
            clientLeft = docElement.clientLeft || body.clientLeft,
            top = rect.top + scroll.top - clientTop,
            left = rect.left + scroll.left - clientLeft;

        return {
            top: top || 0,
            left: left || 0
        };
    }

    function scrollOffset() {
        const top = win.pageYOffset || docElement.scrollTop;
        const left = win.pageXOffset || docElement.scrollLeft;
        return {
            top: top || 0,
            left: left || 0
        };
    }

    function dist(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function constrain(amt, low, high) {
        if (amt <= low) {
            return low;
        }
        if (amt >= high) {
            return high;
        }
        return amt;
    }

    const style = doc.createElement( 'style' );
    style.textContent = "#focus-snail_svg {\
	position: absolute;\
	top: 0;\
	right: 0;\
	bottom: 0;\
	left: 0;\
	margin: 0;\
	background: transparent;\
	visibility: hidden;\
	pointer-events: none;\
	-webkit-transform: translateZ(0);\
}\
\
#focus-snail_svg.focus-snail_visible {\
	visibility: visible;\
	z-index: 999;\
}\
\
#focus-snail_polygon {\
	stroke-width: 0;\
}\
";
    body.appendChild(style);

    return focusSnail;

})();


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/is-visible.js":
/*!*********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/is-visible.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isVisible: () => (/* binding */ isVisible)
/* harmony export */ });
/**
 * Check if an element is visible
 * @param $el
 * @return {boolean|boolean|*}
 */
function isVisible( $el ) {

    if ( ! $el || ! $el.parentNode || $el.parentNode === window || $el.parentNode === document ) { return true; }

    const parentStyles = window.getComputedStyle( $el.parentNode );
    if ( parentStyles.display === 'none' || parentStyles.visibility === 'hidden' || parentStyles.opacity === '0' ) {
        return false;
    } else {
        return isVisible( $el.parentNode );
    }

}




/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/utilities/language.js":
/*!*******************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/utilities/language.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   baseLang: () => (/* binding */ baseLang)
/* harmony export */ });
/**
 * Get the base language code.
 * @returns {string}
 */
function baseLang() {

    const systemLang = navigator.language ?? 'en';

    let pageLang = document.documentElement.lang ?? systemLang;
    pageLang = pageLang.replace( /-/g, '_' );

    let langParts = pageLang.split( '_' );

    return langParts[0];

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/_actionVoiceNavigation.js":
/*!****************************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/_actionVoiceNavigation.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionVoiceNavigation: () => (/* binding */ actionVoiceNavigation)
/* harmony export */ });
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromodal */ "./node_modules/micromodal/dist/micromodal.es.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/ui.js");
/* harmony import */ var _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./voiceRecognition */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js");




let actionVoiceNavigation = {

    /**
     * Initialise Voice Navigation action.
     **/
    init: function () {

        let voiceNavigation = document.querySelector( '#mdp-readabler-action-voice-navigation' );

        /** Try to start setup voice recognition in browser */
        if ( ! new _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__.VoiceRecognition() ) {
            voiceNavigation.classList.add( 'mdp-disabled' );
            return;
        }

        /**
         * Clone MicroModal to global scope to fix issue with closing modal
         * @link https://github.com/ghosh/Micromodal/issues/338
         */
        window.mdpReadablerVoiceNavigationMicroModal = micromodal__WEBPACK_IMPORTED_MODULE_0__["default"];

        /** Add commands modal to DOM. */
        (0,_ui__WEBPACK_IMPORTED_MODULE_1__.addCommandsModal)()

        /** Listen for Voice Navigation change. */
        voiceNavigation.addEventListener( 'ReadablerToggleBoxChanged', actionVoiceNavigation.voiceNavigation );

    },

    /**
     * Voice Navigation action. Open modal with commands.
     * @param e
     */
    voiceNavigation: function ( e ) {

        /** Unique Action ID. */
        const actionID = 'mdp-readabler-voice-navigation';

        /** Remove class from body to reset to default state. */
        if ( ! e.target.classList.contains( 'mdp-active' ) ) {

            document.body.classList.remove( actionID );
            window.mdpReadablerVoiceNavigationMicroModal.close( actionID );

            return;

        }

        /** Add class to body as flag. */
        document.body.classList.add( actionID );

        /** Initialise Voice Navigation. */
        window.mdpReadablerVoiceNavigationMicroModal.show(
            actionID,
            {
                onClose: ( el ) => {

                    if ( el.id && el.id === actionID ) {
                        _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__.VoiceRecognition.manageRecognition( false );
                    }

                },
                onShow: ( el ) => {

                    if ( el.id && el.id === actionID ) {
                        _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__.VoiceRecognition.manageRecognition( true );
                    }

                },
                closeTrigger: 'data-readabler-voice-navigation-close',
                openTrigger: 'data-readabler-voice-navigation-open',
                disableScroll: false,
                disableFocus: true,
                awaitOpenAnimation: false,
                awaitCloseAnimation: false,
            }
        );

    },

};


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/commands.js":
/*!**************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/commands.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $commands: () => (/* binding */ $commands)
/* harmony export */ });
/* harmony import */ var _voiceActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./voiceActions */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceActions.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/utils.js");
/* harmony import */ var _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./voiceRecognition */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js");




function $commands() {

    const { voiceNavigation, voiceNavigationAliases, voiceNavigationDescription } = window.mdpReadablerOptions;

    // Run voice commands event listener and actions
    new _voiceActions__WEBPACK_IMPORTED_MODULE_0__.VoiceActions();

    const $commands = document.createElement( 'div' );
    $commands.classList.add( 'mdp-readabler-voice-navigation-commands-list' );

    const $commandsContainer = document.createElement( 'div' );
    $commandsContainer.classList.add( 'mdp-readabler-voice-navigation-commands-container' );

    for ( const [ commandGroup, commands ] of Object.entries( voiceNavigation ) ) {

        const $row = document.createElement( 'div' );
        $row.classList.add( 'mdp-readabler-voice-navigation-command-group' );

        // Add command description
        const $rowDescription = document.createElement( 'p' );
        const commandTitle = (voiceNavigationAliases[ commandGroup ] ?? commandGroup).replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));;
        const commandIcon = `<img src="${ window.mdpReadablerOptions.pluginURL }images/voice-navigation/${ commandGroup.replaceAll( '_', '-' ) }.svg" alt="${ commandTitle }" >`;
        const commandDescription = voiceNavigationDescription[ commandGroup ].replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
        $rowDescription.innerHTML = `<span class="mdp-readabler-voice-navigation-icon">${ commandIcon }</span><strong>${ commandTitle }</strong><span>–</span><span>${ commandDescription }</span>`;
        $row.appendChild( $rowDescription );

        // Commands group
        const $commandsGroup = document.createElement( 'div' );
        $commandsGroup.classList.add( 'mdp-readabler-voice-navigation-commands' );

        commands.forEach( command => {

            const $commandButton = document.createElement( 'button' );
            $commandButton.classList.add( 'mdp-readabler-voice-navigation-command' );
            $commandButton.setAttribute( 'data-command', command );
            $commandButton.setAttribute( 'data-command-group', commandGroup );
            $commandButton.innerText = commandButtonCaption( commandGroup, command )

            $commandsGroup.appendChild( $commandButton );
            $row.appendChild( $commandsGroup );

        } );

        $commandsContainer.appendChild( $row );

    }

    $commands.appendChild( $commandsContainer );

    // Listen for open/close commands accordion events
    window.addEventListener( 'ReadablerVoiceCommandsAccordion', ( ev ) => {

        // Get trigger button
        const $triggerButton = document.querySelector( '#mdp-readabler-voice-navigation-commands-trigger' );
        if ( ! $triggerButton ) { return; }

        switch ( ev.detail ) {

            case 'collapse':

                // Change accordion state
                $commands.classList.remove( 'expand-commands-accordion' );
                $commands.classList.add( 'collapse-commands-accordion' );

                // Change trigger state
                $triggerButton.dataset.accordion = 'expand';

                break;

            case 'expand':

                // Change accordion state
                $commands.classList.remove( 'collapse-commands-accordion' );
                $commands.classList.add( 'expand-commands-accordion' );

                // Change trigger state
                $triggerButton.dataset.accordion = 'collapse';

                break;

            default:
                break;

        }

    } );

    // Add edge gradients on scrolling
    $commands.addEventListener( 'scroll', edgeGradients );

    // Listen for command click
    $commands.addEventListener( 'click', ( ev ) => {

        ev.preventDefault();
        if ( ev.target.tagName !== 'BUTTON' ) { return; }

        const $input = document.querySelector( '#mdp-readabler-voice-navigation-input' );
        if ( ! $input ) { return; }

        // Update input value
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.updateCommandInput)(
            voiceNavigationAliases[ ev.target.dataset.command ] ?? ev.target.dataset.command,
            window.mdpReadablerOptions.translation.voiceRecognitionStart
        );

        const event = new CustomEvent(
            'ReadablerVoiceNavigationAction',
            {
                detail: {
                    command: ev.target.dataset.command,
                    commandGroup: ev.target.dataset.commandGroup,
                    number: 'number' === ev.target.dataset.commandGroup ?
                        _voiceRecognition__WEBPACK_IMPORTED_MODULE_2__.VoiceRecognition.recognizeNumberCommand( ev.target.innerText ) : false,
                }
            }
        );
        window.dispatchEvent( event );


    } );

    return $commands;

}

/**
 * Get command button caption
 * @param commandGroup
 * @param command
 * @returns {*}
 */
function commandButtonCaption( commandGroup, command ) {

    const { voiceNavigationAliases, translation } = window.mdpReadablerOptions;

    // Return command slug if translation not found
    if ( ! voiceNavigationAliases[ command ] ) {
        return command;
    }

    // Return command translation
    if ( commandGroup === 'number' ) {

        // Random from 1 to 10
        const index = Math.floor( Math.random() * 10 );

        return `${ voiceNavigationAliases[ command ] } ${ translation.voiceRecognitionNumbers[ index ] }`

    } else {

        return voiceNavigationAliases[ command ].replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

    }

}

/**
 * Add edge gradients on scrolling
 * @param ev
 */
function edgeGradients( ev ) {

    const $outerContainer = ev.target;
    if ( ! $outerContainer ) { return; }

    const $innerContainer = $outerContainer.querySelector( '.mdp-readabler-voice-navigation-commands-container' );
    if ( ! $innerContainer ) { return; }

    // Top gradient
    const containerTop = $outerContainer.getBoundingClientRect().top;
    containerTop > $innerContainer.getBoundingClientRect().top ?
        $outerContainer.classList.add( 'scroll-up-gradient' ):
        $outerContainer.classList.remove( 'scroll-up-gradient' );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/ui.js":
/*!********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/ui.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCommandsModal: () => (/* binding */ addCommandsModal)
/* harmony export */ });
/* harmony import */ var _voiceRecognition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./voiceRecognition */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js");
/* harmony import */ var _commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commands */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/commands.js");


const {translation} = window.mdpReadablerOptions;

/**
 * Add commands modal to DOM.
 */
function addCommandsModal() {

    const baseID = 'mdp-readabler-voice-navigation';

    const $modalBox = document.createElement( 'div' );
    $modalBox.id = baseID;
    $modalBox.setAttribute( 'aria-hidden', 'true' );

    const $modalOverlay = document.createElement( 'div' );
    $modalOverlay.id = `${ baseID }-overlay`;
    $modalOverlay.setAttribute( 'tabindex', '-1' );

    const $modalContent = document.createElement( 'div' );
    $modalContent.id = `${ baseID }-content`;
    $modalContent.setAttribute( 'role', 'dialog' );
    $modalContent.setAttribute( 'aria-modal', 'true' );
    $modalContent.setAttribute( 'aria-label', translation.voiceRecognitionCommands );
    $modalContent.appendChild( $form() );

    $modalContent.appendChild( (0,_commands__WEBPACK_IMPORTED_MODULE_1__.$commands)() );

    $modalBox.appendChild( $modalContent );

    document.body.appendChild( $modalBox );

}

/**
 * Commands form HTML element.
 * @returns {*}
 */
function $form() {

    const $form = document.createElement( 'div' );
    $form.id = 'mdp-readabler-voice-navigation-commands-form';

    $form.appendChild( $recordButton() );

    $form.appendChild( $fieldset() );

    $form.appendChild( $commandsAccordion() );

    $form.appendChild( $closeButton() );

    return $form;

}

/**
 * Fieldset HTML element.
 * @returns {*}
 */
function $fieldset() {

    const $fieldset = document.createElement( 'fieldset' );
    $fieldset.id = 'mdp-readabler-voice-navigation-fieldset';

    const $legend = document.createElement( 'legend' );
    $legend.innerText = translation.voiceRecognitionLegend;
    $fieldset.appendChild( $legend );

    const $historyInput = document.createElement( 'input' );
    $historyInput.type = 'text';
    $historyInput.id = 'mdp-readabler-voice-navigation-history';
    $historyInput.name = 'mdp-readabler-voice-navigation-history';
    $historyInput.ariaLabel = translation.voiceRecognitionHistory;
    $historyInput.autocomplete = 'off';
    $historyInput.disabled = true;
    $fieldset.appendChild( $historyInput );

    const $inputLabel = document.createElement( 'label' );
    $inputLabel.htmlFor = 'mdp-readabler-voice-navigation-input';
    $inputLabel.innerText = translation.voiceRecognitionWait;
    $inputLabel.visibility = 'hidden';
    $fieldset.appendChild( $inputLabel );

    const $input = document.createElement( 'input' );
    $input.type = 'text';
    $input.id = 'mdp-readabler-voice-navigation-input';
    $input.autocomplete = 'off';
    $input.placeholder = translation.voiceRecognitionWait;
    $input.disabled = true;
    $fieldset.appendChild( $input );

    if ( window.mdpReadablerOptions.voiceNavigationVoiceGraph === 'on' ) {
        const canvas = document.createElement( 'canvas' );
        canvas.id = 'mdp-readabler-voice-visualization';
        $fieldset.appendChild( canvas );
    }

    return $fieldset;

}

/**
 * Record button HTML element.
 * @returns {*}
 */
function $recordButton() {

    const $recordButton = document.createElement( 'button' );
    $recordButton.id = 'mdp-readabler-voice-navigation-record-button';
    $recordButton.ariaLabel = translation.voiceRecognitionStart;
    $recordButton.disabled = true;

    $recordButton.addEventListener( 'click', () => {

        _voiceRecognition__WEBPACK_IMPORTED_MODULE_0__.VoiceRecognition.manageRecognition( ! document.body.classList.contains( 'mdp-readabler-recognition-running' ) );

    } );

    return $recordButton;

}

function $commandsAccordion() {

    // Append trigger button to the form box
    const $trigger = document.createElement( 'button' );
    $trigger.id = 'mdp-readabler-voice-navigation-commands-trigger';
    $trigger.dataset.accordion = 'collapse';
    $trigger.ariaLabel = translation.voiceRecognitionCommands;

    // Collapse and expand commands list
    $trigger.addEventListener( 'click', () => {

        const commandsListTrigger = new CustomEvent(
            'ReadablerVoiceCommandsAccordion',
            {
                'detail': $trigger.dataset.accordion,
            }
        );
        window.dispatchEvent( commandsListTrigger );

    } );

    return $trigger;

}

/**
 * Close button HTML element.
 * @returns {*}
 */
function $closeButton() {

    const baseID = 'mdp-readabler-voice-navigation';

    const $closeButton = document.createElement( 'button' );
    $closeButton.id = `${ baseID }-close-button`;
    $closeButton.ariaLabel = translation.voiceRecognitionClose;

    $closeButton.addEventListener( 'click', () => {

        _voiceRecognition__WEBPACK_IMPORTED_MODULE_0__.VoiceRecognition.manageRecognition( false );

        let voiceNavigation = document.querySelector( '#mdp-readabler-action-voice-navigation' );
        if( voiceNavigation ) {
            voiceNavigation.click();
        }

    } );

    return $closeButton;

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/utils.js":
/*!***********************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/utils.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateCommandInput: () => (/* binding */ updateCommandInput),
/* harmony export */   updateHistoryInput: () => (/* binding */ updateHistoryInput)
/* harmony export */ });
/**
 * Update command input
 * @param value
 * @param placeholder
 */
function updateCommandInput( value = '', placeholder = '' ) {

    const $input = document.querySelector( '#mdp-readabler-voice-navigation-input' );
    if ( ! $input ) { return; }

    $input.value = value;
    $input.placeholder = placeholder;

    window.mdpReadablerSpeechRecognitionTimestamp = Date.now();

}

/**
 * Update history input
 * @param value
 */
function updateHistoryInput( value = '' ) {

    const $input = document.querySelector( '#mdp-readabler-voice-navigation-history' );
    if ( ! $input ) { return; }

    $input.value = value;

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceActions.js":
/*!******************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceActions.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VoiceActions: () => (/* binding */ VoiceActions)
/* harmony export */ });
/* harmony import */ var tippy_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tippy.js */ "./node_modules/tippy.js/dist/tippy.esm.js");
/* harmony import */ var _voiceRecognition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./voiceRecognition */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/utils.js");
/* harmony import */ var _voiceFeedback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./voiceFeedback */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceFeedback.js");
/* harmony import */ var _utilities_is_visible__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/is-visible */ "./wp-content/plugins/readabler/source/js/includes/utilities/is-visible.js");
// noinspection JSUnusedGlobalSymbols







/**
 * @param window.mdpReadablerOptions.scrollDownValue
 * @param window.mdpReadablerOptions.scrollUpValue
 * @param window.mdpReadablerOptions.scrollRightValue
 * @param window.mdpReadablerOptions.scrollLeftValue
 */

class VoiceActions {

    /**
     * Initialise Voice Actions event listener.
     */
    constructor() {

        // Voice commands event listener
        window.addEventListener( 'ReadablerVoiceNavigationAction', ( ev ) => {

            // Get command
            const { voiceNavigationAliases, translation, voiceNavigationFeedbackOk } = window.mdpReadablerOptions;
            let { command, commandGroup } = ev.detail;
            if ( ! command  ) { return; }
            command = command.toLowerCase().trim();

            // Execute command
            try {

                // Voice feedback
                (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( voiceNavigationFeedbackOk[ Math.floor(Math.random() * voiceNavigationFeedbackOk.length ) ] );

                // Update commands input
                const $inputValue = voiceNavigationAliases[ command.replaceAll( ' ', '_' ) ] ?? command
                ;(0,_utils__WEBPACK_IMPORTED_MODULE_1__.updateCommandInput)( $inputValue, translation.voiceRecognitionStart );

                // Execute command
                VoiceActions[ commandGroup ]( ev );

                // Update history
                this.updateHistory( command );

            } catch ( e ) {

                console.warn( `Readabler: Command ${ command } not found.` );

            }

        } );

    }

    updateHistory( command ) {

        const $commandsInput = document.querySelector( '#mdp-readabler-voice-navigation-input' );
        const $historyInput = document.querySelector( '#mdp-readabler-voice-navigation-history' );
        if ( ! $commandsInput || !$historyInput ) { return; }

        // Remove preview history value
        (0,_utils__WEBPACK_IMPORTED_MODULE_1__.updateHistoryInput)( '' );

        // Manage classes
        $historyInput.classList.remove( 'mdp-readabler-voice-navigation-memorized' );
        $commandsInput.classList.add( 'mdp-readabler-voice-navigation-recognized' );

        setTimeout( () => {

            $commandsInput.classList.remove( 'mdp-readabler-voice-navigation-recognized' );
            $historyInput.classList.add( 'mdp-readabler-voice-navigation-memorized' );

            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.updateHistoryInput)( $commandsInput.value );
            $commandsInput.value = '';

        }, 1500 );

    }

    /**
     * Expand commands accordion.
     */
    static help() {

        const commandsListTrigger = new CustomEvent(
            'ReadablerVoiceCommandsAccordion',
            {
                'detail': 'expand',

            }
        );
        window.dispatchEvent( commandsListTrigger );

    }

    /**
     * Collapse commands accordion.
     */
    static hide_help() {

        const commandsListTrigger = new CustomEvent(
            'ReadablerVoiceCommandsAccordion',
            {
                'detail': 'collapse',

            }
        );
        window.dispatchEvent( commandsListTrigger );

    }

    /**
     * Scroll page down.
     */
    static scroll_down() {

        const options = window.mdpReadablerOptions ?? {};

        window.scrollBy({
            top: options.scrollDownValue ?? 200,
            behavior: 'smooth',
        } );

    }

    /**
     * Scroll page up.
     */
    static scroll_up() {

        const options = window.mdpReadablerOptions ?? {};

        window.scrollBy({
            top: options.scrollUpValue ?? -200,
            behavior: 'smooth',
        } );

    }

    /**
     * Scroll page right.
     */
    static scroll_right() {

        const options = window.mdpReadablerOptions ?? {};

        window.scrollBy({
            left: options.scrollRightValue ?? 200,
            behavior: 'smooth',
        } );

    }

    /**
     * Scroll page left.
     */
    static scroll_left() {

        const options = window.mdpReadablerOptions ?? {};

        window.scrollBy({
            left: options.scrollLeftValue ?? -200,
            behavior: 'smooth',
        } );

    }

    /**
     * Scroll page to top.
     */
    static go_to_top() {

        window.scrollTo( {
            top: 0,
            behavior: 'smooth',
        } );

    }

    /**
     * Scroll page to bottom.
     */
    static go_to_bottom() {

        window.scrollTo( {
            top: document.body.scrollHeight,
            behavior: 'smooth',
        } );

    }

    /**
     * Focus next element.
     */
    static tab() {

        const focusableNodes = document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
        const focusableElements = Array.from(focusableNodes).filter(el => !el.disabled && !el.hidden);
        const currentFocusedElement = document.activeElement;

        if (currentFocusedElement) {
            const currentIndex = Array.from(focusableElements).indexOf(currentFocusedElement);
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            const nextElement = focusableElements[nextIndex];

            nextElement.focus();
        } else {
            // If no element is focused, focus the first element
            focusableElements[0].focus();
        }

    }

    /**
     * Focus previous element.
     */
    static tab_back() {

        const focusableNodes = document.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
        const focusableElements = Array.from(focusableNodes).filter(el => !el.disabled && !el.hidden);
        const currentFocusedElement = document.activeElement;

        if (currentFocusedElement) {
            const currentIndex = Array.from(focusableElements).indexOf(currentFocusedElement);
            const nextIndex = (currentIndex - 1) % focusableElements.length;
            const nextElement = focusableElements[nextIndex];

            nextElement.focus();
        } else {
            // If no element is focused, focus the first element
            focusableElements[0].focus();
        }

    }

    /**
     * Show numbers on clickable elements.
     */
    static show_numbers() {

        // Get all clickable elements
        const $elements = document.querySelectorAll( 'a, button, input, select, textarea' );
        if ( ! $elements ) { return; }

        // Add tippy to all elements
        let elementIndex = 1;
        $elements.forEach( $element=> {

            // Check if the element is not in the Readabler popup
            if ( $element.closest( '#mdp-readabler-popup-box' ) ) { return; }
            if ( $element.closest( '#mdp-readabler-sidebar' ) ) { return; }
            if ( $element.closest( '#mdp-readabler-keyboard-box' ) ) { return; }
            if ( $element.closest( '#mdp-readabler-voice-navigation' ) ) { return; }

            // Is element visible
            if ( $element.style.display === 'none' ) { return; }
            if ( $element.style.visibility === 'hidden' ) { return; }
            if ( $element.style.opacity === '0' ) { return; }
            if ( $element.style.pointerEvents === 'none' ) { return; }

            // Recursively check if the parent is visible
            if ( ! (0,_utilities_is_visible__WEBPACK_IMPORTED_MODULE_3__.isVisible)( $element ) ) { return; }

            $element.setAttribute( 'data-readabler-number', elementIndex.toString() );
            $element.setAttribute( 'data-tippy-content', elementIndex.toString() );

            elementIndex++;

        } );

        (0,tippy_js__WEBPACK_IMPORTED_MODULE_4__["default"])( '[data-readabler-number]', {
            showOnCreate: true,
            hideOnClick: false,
            trigger: 'manual',
            interactive: false,
            arrow: true,
            onCreate( instance) {
                instance.popper.classList.add( 'mdp-readabler-voice-navigation-number' );
            }
        } );

    }


    /**
     * Click on element by number.
     * @param ev
     */
    static number( ev ) {

        if ( ! ev.detail.number ) { return; }

        // Get all clickable elements
        const $element = document.querySelector( `[data-readabler-number="${ ev.detail.number }"]` );
        if ( ! $element ) { return; }

        $element.click();

    }

    /**
     * Hide numbers on clickable elements.
     */
    static hide_numbers() {

        const $numbers = document.querySelectorAll( '[data-tippy-root]' );
        if ( ! $numbers ) { return; }

        $numbers.forEach( ( $number ) => {

            $number._tippy.hide();

        } );

    }

    /**
     * Clear input.
     */
    static clear_input() {

        // Get focused element
        const focusedElement = document.activeElement;

        // Check if focused element is an input
        if ( focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA' ) {
            focusedElement.value = '';
        }

    }

    /**
     * Submit form or click on focused element.
     */
    static enter() {

        // Get focused element
        const focusedElement = document.activeElement;

        // Check if focused element is a form
        if ( focusedElement.tagName === 'FORM' ) {
            focusedElement.submit();
        } else {
            focusedElement.click();
        }

    }

    /**
     * Reload page.
     */
    static reload() {

        window.location.reload();

    }

    /**
     * Stop voice recognition.
     */
    static stop() {

        _voiceRecognition__WEBPACK_IMPORTED_MODULE_0__.VoiceRecognition.manageRecognition( false );

    }

    /**
     * Close voice navigation popup.
     */
    static exit() {

        let voiceNavigation = document.querySelector( '#mdp-readabler-action-voice-navigation' );
        if( ! voiceNavigation ) { return; }

        voiceNavigation.click();

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceFeedback.js":
/*!*******************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceFeedback.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   voiceNavigationFeedback: () => (/* binding */ voiceNavigationFeedback)
/* harmony export */ });
const utterThis = new SpeechSynthesisUtterance();
const options = window.mdpReadablerOptions;

/**
 * Speak a message to the user
 * @param message
 */
function voiceNavigationFeedback( message ) {

    if ( options.voiceNavigationFeedback !== 'on' ) { return; }

    setSynthProperties( message ).then();

}

/**
 * Get a pair of language and voice
 */
async function setSynthProperties( message ) {

    const synth = window.speechSynthesis;

    // Stop the voice synthesis
    stopVoiceSynth();

    /**
     * Check if the browser supports speech synthesis
     */
    try {

        if ( synth.getVoices().length === 0 ) {

            /**
            * If the voices are not loaded yet, wait for them to be loaded
            */
            return new Promise( ( resolve, reject ) => {

                synth.onvoiceschanged = () => {

                    resolve();

                    /**
                     * Set the voice and language
                     */
                    try {

                        setVoice();
                        voiceSynth( message );

                    } catch (e) {

                        console.warn( 'SpeechSynthesisUtterance not supported in your browser' );
                        console.warn( e );
                        return false;

                    }

                };

            } );

        } else {

            voiceSynth( message );

        }

    } catch (e) {

        console.warn( 'SpeechSynthesisUtterance not supported in your browser' );
        console.warn( e );
        return false;

    }

}

/**
 * Set the voice and language to the utterance
 */
function setVoice() {

    const synth = window.speechSynthesis;
    const lang = document.documentElement.lang;

    /**
     * Select a voice and language and set them to the utterance
     * @type {SpeechSynthesisVoice}
     */
    const exactMatch = synth.getVoices().find( ( voice ) => voice.lang === lang );
    if ( exactMatch ) {

        // Exactly the same to the page language
        utterThis.voice = exactMatch;
        utterThis.lang = document.documentElement.lang;

    } else {

        // Similar to the page language
        utterThis.voice = synth.getVoices().find( ( voice ) => voice.lang.startsWith( lang ) );
        utterThis.lang = utterThis.voice.lang;

    }

    /**
     * Fallback for the case when no voice is available for the page language
     */
    if ( ! utterThis.voice ) {

        // Use default british english voice if
        utterThis.voice = synth.getVoices().find((voice) => voice.lang.startsWith('en-GB'));
        utterThis.lang = utterThis.voice.lang;

    }

}

/**
 * Speak the message
 * @param message
 */
function voiceSynth( message ) {

    const synth = window.speechSynthesis;

    stopVoiceSynth();

    utterThis.text = message;
    synth.speak( utterThis );

}

/**
 * Stop the voice synthesis
 */
function stopVoiceSynth() {

    const synth = window.speechSynthesis;
    synth.cancel();

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js":
/*!**********************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceRecognition.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VoiceRecognition: () => (/* binding */ VoiceRecognition)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/utils.js");
/* harmony import */ var _voiceVizualization__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./voiceVizualization */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceVizualization.js");
/* harmony import */ var _voiceFeedback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./voiceFeedback */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceFeedback.js");




const options = window.mdpReadablerOptions;

class VoiceRecognition {

    constructor() {

        // Set recognition properties
        const recognition = this.setRecognitionProperties();
        if ( ! recognition ) {
            console.warn( 'Speech recognition is not supported in your browser' );
            return false;
        }

        // Add recognition events
        window.mdpReadablerSpeechRecognition = false;
        window.ReadablerVoiceRecognition = recognition;
        this.addRecognitionEvents( recognition );

        return true;

    }

    /**
     * Set recognition properties.
     */
    setRecognitionProperties() {

        let recognition = null;

        if ( 'SpeechRecognition' in window ) {

            recognition = new SpeechRecognition();

        } else if ( 'webkitSpeechRecognition' in window ) {

            recognition = new webkitSpeechRecognition();

        } else {

            console.warn( 'Recognition is not supported' );
            return recognition;

        }

        recognition.lang = this.getPageLang();
        recognition.continuous = true;
        recognition.interimResults = options.voiceNavigationInterimResults === 'on';
        recognition.maxAlternatives = 0;

        return recognition;

    }

    /**
     * Add event recognition event
     * @param recognition
     */
    addRecognitionEvents( recognition ) {

        // Timestamp for recognition
        window.mdpReadablerSpeechRecognitionTimestamp = Date.now();

        // Start recognition event
        recognition.addEventListener( 'start', this.eventRecognitionStart );

        // Stop recognition event
        recognition.addEventListener( 'end', this.eventRecognitionEnd );

        // Speech recognition event
        recognition.addEventListener( 'result', ( e ) => {

            // Freezing recognition to prevent multiple commands
            if ( Date.now() - window.mdpReadablerSpeechRecognitionTimestamp < 2500 ) { return; }

            // Get transcript
            const { resultIndex } = e;
            let { transcript } = e.results[ resultIndex ][ 0 ];

            if ( transcript === '' ) { return; }
            transcript = transcript.trim();

            // Show transcript in input
            const $input = document.querySelector( '#mdp-readabler-voice-navigation-input' );
            if ( $input ) {
                $input.value = transcript;
            }

            // Recognize command
            let commandInfo = this.recognizeCommand( transcript );
            if ( commandInfo ) {
                window.mdpReadablerSpeechRecognitionTimestamp = Date.now();
            } else {
                return;
            }

            // Fire voice recognition event
            const event = new CustomEvent(
                'ReadablerVoiceNavigationAction',
                {
                    detail: {
                        command: transcript,
                        commandGroup: commandInfo.commandKey,
                        number: commandInfo.number ?? false,
                    }
                }
            );
            window.dispatchEvent( event );

        } );

        // Error recognition event
        recognition.addEventListener( 'error', this.eventRecognitionError );

    }

    /**
     * Remove old recognition status class and add new one.
     * @param recognitionStatus
     */
    static setBodyClass( recognitionStatus ) {

        document.body.classList.forEach( ( className ) => {

            if ( className.includes( 'mdp-readabler-recognition-' ) ) {
                document.body.classList.remove( className );
            }

        } );

        document.body.classList.add( `mdp-readabler-recognition-${ recognitionStatus }` );

    }

    /**
     * Manage recognition start/stop.
     * @param run
     */
    static manageRecognition( run = false ) {

        if ( ! window.ReadablerVoiceRecognition ) { return; }
        const recognitionStatus = window.mdpReadablerSpeechRecognition ?? false;

        if ( run && ! recognitionStatus ) {

            // Start recognition
            window.ReadablerVoiceRecognition.start();
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', options.translation.voiceRecognitionStart );
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateHistoryInput)( '' );

            new _voiceVizualization__WEBPACK_IMPORTED_MODULE_1__.VoiceVisualization();

        } else {

            // Stop recognition
            window.ReadablerVoiceRecognition.stop();
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', options.translation.voiceRecognitionEnd );

            // Stop voice visualization
            window.dispatchEvent( new Event( 'ReadablerVoiceVisualizationStop' ) );

        }

    }

    /**
     * Event recognition start event handler
     */
    eventRecognitionStart() {

        // Set flag for voice recognition
        window.mdpReadablerSpeechRecognition = true;

        // Voice feedback
        (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( options.voiceNavigationFeedbackStart[ Math.floor(Math.random() * options.voiceNavigationFeedbackStart.length ) ] );

        // Set body class
        VoiceRecognition.setBodyClass( 'running' );

        const $recButton = document.querySelector( '#mdp-readabler-voice-navigation-record-button' );
        if ( $recButton ) {
            $recButton.removeAttribute( 'disabled' );
        }

        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', options.translation.voiceRecognitionStart );

        const event = new CustomEvent( 'ReadablerRecognitionStart' );
        window.dispatchEvent( event );

    }

    /**
     * Event recognition end event handler
     */
    eventRecognitionEnd() {

        // Set flag for voice recognition
        window.mdpReadablerSpeechRecognition = false;

        // Voice feedback
        (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( options.voiceNavigationFeedbackEnd[ Math.floor(Math.random() * options.voiceNavigationFeedbackEnd.length ) ] );

        if ( document.body.classList.contains( 'mdp-readabler-recognition-error' ) ) { return; }

        VoiceRecognition.setBodyClass( 'paused' );

        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', options.translation.voiceRecognitionEnd );

        // Stop voice visualization
        window.dispatchEvent( new Event( 'ReadablerVoiceVisualizationStop' ) );

        const event = new CustomEvent( 'ReadablerRecognitionEnd' );
        window.dispatchEvent( event );

    }

    /**
     * Event recognition error
     * @param e
     */
    eventRecognitionError( e ) {

        // Set flag for voice recognition
        window.mdpReadablerSpeechRecognition = false;

        const { translation, voiceNavigationRerun } = options;

        VoiceRecognition.setBodyClass( 'error' );

        // Restart recognition if error is no-speech
        if ( e.error === 'no-speech' ) {

            const errorNoVoice = translation.voiceRecognitionErrorNoVoice.split( '. ' );

            (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( translation.voiceRecognitionErrorNoVoice );

            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', errorNoVoice[ 0 ] );
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateHistoryInput)( errorNoVoice[ 1 ] ?? '' );

            if ( voiceNavigationRerun === 'on' ) {
                setTimeout( () => {
                    window.ReadablerVoiceRecognition.start();
                }, 1000 );
            }

        } else if ( e.error === 'network' ) {

            const errorNoNetwork = translation.voiceRecognitionErrorNoNetwork.split( '. ' );

            (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( translation.voiceRecognitionErrorNoNetwork );

            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', errorNoNetwork[ 0 ] );
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateHistoryInput)( errorNoNetwork[ 1 ] ?? '' );

            if ( voiceNavigationRerun === 'on' ) {
                setTimeout( () => {
                    window.ReadablerVoiceRecognition.start();
                }, 1000 );
            }

        } else if ( e.error === 'not-allowed' ) {

            const errorNotAllowed = translation.voiceRecognitionErrorNotAllowed.split( '. ' );

            (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( translation.voiceRecognitionErrorNotAllowed );

            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', errorNotAllowed[ 0 ] );
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateHistoryInput)( errorNotAllowed[ 1 ] ?? '' );

        } else {

            (0,_voiceFeedback__WEBPACK_IMPORTED_MODULE_2__.voiceNavigationFeedback)( translation.voiceRecognitionErrorUnknown );

            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.updateCommandInput)( '', translation.voiceRecognitionErrorUnknown );

        }

        console.warn( `Speech recognition error: ${ e.error }` );

        // Stop voice visualization
        window.dispatchEvent( new Event( 'ReadablerVoiceVisualizationStop' ) );

        const event = new CustomEvent( 'ReadablerRecognitionError', { detail: { message: e.error } } );
        window.dispatchEvent( event );

    }

    /**
     * Recognize command
     * @param command
     * @returns {boolean|*}
     */
    recognizeCommand( command ) {

        let commandKey = false;
        command = command.toLowerCase().trim();

        // Recognize number command
        const number = VoiceRecognition.recognizeNumberCommand( command );
        if ( number ) {

            return {
                commandKey: 'number',
                number: number
            };

        }

        // Recognize command
        for ( const [ key, commandAliases ] of Object.entries( options.voiceNavigation ) ) {

            if ( key === 'number' ) { continue; } // Skip number commands

            commandAliases.forEach( ( optionsAlias ) => {

                let alias = options.voiceNavigationAliases[ optionsAlias ] ?? optionsAlias;

                // Command is alias
                if ( alias.toLowerCase().trim() === command ) {
                    commandKey = key;
                }

                // Command contains alias
                if ( command.includes( alias.toLowerCase().trim() ) ) {
                    commandKey = key;
                }

            } );

            if ( commandKey ) { break; }

        }

        return commandKey ?
            {
                commandKey: commandKey,
            } :
            commandKey;

    }

    /**
     * Recognize number command
     * @param command
     */
    static recognizeNumberCommand( command ) {

        let number = 0;

        const numberCommands = options.voiceNavigation.number;
        const commandsTranslations = options.voiceNavigationAliases;
        const wordNumbers = options.translation.voiceRecognitionNumbers;
        if ( ! numberCommands ) { return false; }

        // If command contains number
        if ( /\d/.test( command ) ) {

            const number = command.match( /\d+/ )[ 0 ];

            // Just number
            if ( command === number ) {
                return parseInt( number );
            }

            // Command + number
            let isNumberCommand = false;
            numberCommands.forEach( ( numberCommand ) => {

                // Skip if already defined as number command
                if ( isNumberCommand ) { return; }

                // Skip if command translation not found
                if ( ! commandsTranslations[ numberCommand ] ) { return; }

                if ( command.includes( commandsTranslations[ numberCommand ].toLowerCase().trim() ) ) {
                    isNumberCommand = true;
                }

            } );

            // Return command number
            if ( isNumberCommand ) {
                return number;
            }

        }

        // If the command contains a number defined by a word
        numberCommands.forEach( ( numberCommand ) => {

            if ( command.includes( numberCommand ) ) {

                wordNumbers.forEach( ( wordNumber, index ) => {

                    if ( command.includes( wordNumber ) ) {

                        number = index;

                    }

                } );

            }

        } );

        return number ? number : false;

    }

    /**
     * Get page language
     * @returns {*|boolean}
     */
    getPageLang() {

        const $html = document.querySelector( 'html' );
        if ( ! $html ) { return false; }

        let locale = $html.getAttribute( 'lang' );
        return locale.split( '-' )[ 0 ]

    }

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceVizualization.js":
/*!************************************************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/includes/voice-navigation/voiceVizualization.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VoiceVisualization: () => (/* binding */ VoiceVisualization)
/* harmony export */ });
class VoiceVisualization {

    constructor() {

        if ( window.mdpReadablerOptions.voiceNavigationVoiceGraph === 'off' ) { return; }

        // Try to get media stream
        let record = false;
        try {

            record = window.navigator.mediaDevices.getUserMedia(
                {
                    audio: true,
                    video: false
                }
            );

        } catch (e) {

            console.warn( 'Your browser does not have MediaStream support' );
            return;

        }

        record.then( function onSuccess( stream) {

            let context = getAudioContext();
            let audioInput = context.createMediaStreamSource( stream );
            let analyser = context.createAnalyser();

            // Connect audio input to the analyser
            audioInput.connect( analyser );

            // Connect analyser to the output
            drawSpectrum( analyser );

            // Add event to stop visualization
            window.addEventListener( 'ReadablerVoiceVisualizationStop', () => {

                stream.getTracks().forEach( function (track) {
                    track.stop();
                });

            } );

        });

        record.catch( function (e) {

            console.warn( 'Your browser does not have MediaStream support' );
            console.warn( e );

        } );

    }

}

/**
 * Get audio context
 * @returns {AudioContext|boolean}
 */
function getAudioContext() {

    let audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    let context;

    try {

        context = new audioContext();
        return context;

    } catch (e) {

        console.warn( 'Not support AudioContext' );
        console.warn( e );

        return false;

    }

}

/**
 * Draw spectrum
 * @param analyser
 */
function drawSpectrum( analyser ) {

    const canvas = document.querySelector( '#mdp-readabler-voice-visualization' );
    if ( ! canvas ) { return; }

    let meterWidth = 2,
        gap = 6,
        meterNum = canvas.width / (meterWidth + gap),
        ctx = canvas.getContext('2d');


    // Set bar style
    const gradient = ctx.createLinearGradient( 0, 0, 0, canvas.height );
    gradient.addColorStop(1, 'rgba(33, 111, 243, 1)');
    gradient.addColorStop(0.5, 'rgba(33, 111, 243, 1)');
    gradient.addColorStop(0, 'rgba(33, 111, 243, 1)');
    ctx.fillStyle = gradient;

    function drawMeter() {

        let array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        let step = Math.round(array.length / meterNum);
        ctx.clearRect(0, 0, canvas.width, canvas.height );

        for ( let i = 0; i < meterNum; i++) {

            const value = array[i * step];
            const valPercent = value / 320;
            const barHeight = canvas.height * valPercent;

            ctx.fillRect(
                i * (meterWidth + gap),
                Math.floor( ( canvas.height - barHeight ) / 2 ),
                meterWidth,
                Math.floor( barHeight )
            );

        }

        requestAnimationFrame( drawMeter );

    }

    requestAnimationFrame( drawMeter );

}


/***/ }),

/***/ "./wp-content/plugins/readabler/source/js/scanner/query.js":
/*!*****************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/scanner/query.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAnalyzeQuery: () => (/* binding */ isAnalyzeQuery)
/* harmony export */ });
/**
 * Run a scanner script only if URL argument 'readabler-analyzer' is set
 * @returns {any}
 */
function isAnalyzeQuery() {

    // Get URL arguments
    const urlParams = new URLSearchParams( window.location.search );
    const readablerScanner = urlParams.get( 'readabler-analyzer' );

    return JSON.parse( readablerScanner );

}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************************************!*\
  !*** ./wp-content/plugins/readabler/source/js/readabler.js ***!
  \*************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _includes_text_to_speech_action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./includes/text-to-speech/_action */ "./wp-content/plugins/readabler/source/js/includes/text-to-speech/_action.js");
/* harmony import */ var _includes_big_cursor_actionBigBlackCursor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./includes/big-cursor/_actionBigBlackCursor */ "./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigBlackCursor.js");
/* harmony import */ var _includes_big_cursor_actionBigWhiteCursor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./includes/big-cursor/_actionBigWhiteCursor */ "./wp-content/plugins/readabler/source/js/includes/big-cursor/_actionBigWhiteCursor.js");
/* harmony import */ var _includes_contrast_actionDarkContrast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./includes/contrast/_actionDarkContrast */ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionDarkContrast.js");
/* harmony import */ var _includes_contrast_actionLightContrast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./includes/contrast/_actionLightContrast */ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionLightContrast.js");
/* harmony import */ var _includes_saturation_actionHighSaturation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./includes/saturation/_actionHighSaturation */ "./wp-content/plugins/readabler/source/js/includes/saturation/_actionHighSaturation.js");
/* harmony import */ var _includes_saturation_actionLowSaturation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./includes/saturation/_actionLowSaturation */ "./wp-content/plugins/readabler/source/js/includes/saturation/_actionLowSaturation.js");
/* harmony import */ var _includes_contrast_actionMonochrome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./includes/contrast/_actionMonochrome */ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionMonochrome.js");
/* harmony import */ var _includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./includes/utilities/_localStorage */ "./wp-content/plugins/readabler/source/js/includes/utilities/_localStorage.js");
/* harmony import */ var _includes_interface_toggleBox__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./includes/interface/_toggleBox */ "./wp-content/plugins/readabler/source/js/includes/interface/_toggleBox.js");
/* harmony import */ var _includes_contrast_actionHighContrast__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./includes/contrast/_actionHighContrast */ "./wp-content/plugins/readabler/source/js/includes/contrast/_actionHighContrast.js");
/* harmony import */ var _includes_utilities_inputSpinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./includes/utilities/_inputSpinner */ "./wp-content/plugins/readabler/source/js/includes/utilities/_inputSpinner.js");
/* harmony import */ var _includes_utilities_paletteBox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./includes/utilities/_paletteBox */ "./wp-content/plugins/readabler/source/js/includes/utilities/_paletteBox.js");
/* harmony import */ var _includes_text_actionFontSizing__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./includes/text/_actionFontSizing */ "./wp-content/plugins/readabler/source/js/includes/text/_actionFontSizing.js");
/* harmony import */ var _includes_text_actionLineHeight__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./includes/text/_actionLineHeight */ "./wp-content/plugins/readabler/source/js/includes/text/_actionLineHeight.js");
/* harmony import */ var _includes_text_actionLetterSpacing__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./includes/text/_actionLetterSpacing */ "./wp-content/plugins/readabler/source/js/includes/text/_actionLetterSpacing.js");
/* harmony import */ var _includes_text_actionCognitiveReading__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./includes/text/_actionCognitiveReading */ "./wp-content/plugins/readabler/source/js/includes/text/_actionCognitiveReading.js");
/* harmony import */ var _includes_voice_navigation_actionVoiceNavigation__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./includes/voice-navigation/_actionVoiceNavigation */ "./wp-content/plugins/readabler/source/js/includes/voice-navigation/_actionVoiceNavigation.js");
/* harmony import */ var _includes_popup_popup_helper__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./includes/popup/popup-helper */ "./wp-content/plugins/readabler/source/js/includes/popup/popup-helper.js");
/* harmony import */ var _includes_hotkeys_hotKeys__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./includes/hotkeys/hotKeys */ "./wp-content/plugins/readabler/source/js/includes/hotkeys/hotKeys.js");
/* harmony import */ var _actions_actionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./actions/actionKeyboardNavigation */ "./wp-content/plugins/readabler/source/js/actions/actionKeyboardNavigation.js");
/* harmony import */ var _actions_actionVirtualKeyboard__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./actions/actionVirtualKeyboard */ "./wp-content/plugins/readabler/source/js/actions/actionVirtualKeyboard.js");
/* harmony import */ var _analytics_analytics__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./analytics/analytics */ "./wp-content/plugins/readabler/source/js/analytics/analytics.js");
/* harmony import */ var _analytics_cache__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./analytics/cache */ "./wp-content/plugins/readabler/source/js/analytics/cache.js");
/**
 * Readabler
 * Web accessibility for Your WordPress site.
 * Exclusively on https://1.envato.market/readabler
 *
 * @encoding        UTF-8
 * @version         1.7.11
 * @copyright       (C) 2018 - 2024 Merkulove ( https://merkulov.design/ ). All rights reserved.
 * @license         Envato License https://1.envato.market/KYbje
 * @contributors    Nemirovskiy Vitaliy (nemirovskiyvitaliy@gmail.com), Dmitry Merkulov (dmitry@merkulov.design)
 * @support         help@merkulov.design
 * @license         Envato License https://1.envato.market/KYbje
 **/




























/**
 * Namespace trick in javascript.
 **/
let mdpReadabler = ( function() {

    /**
     * Readabler plugin settings.
     *
     * @param options
     * @param options.ajaxurl
     * @param options.nonce
     * @param options.pluginURL
     *
     * @param options.onlineDictionary
     * @param options.language

     * @param options.profileEpilepsy
     * @param options.profileVisuallyImpaired
     * @param options.profileCognitiveDisability
     * @param options.profileAdhdFriendly
     * @param options.profileBlindUsers

     * @param options.contentScaling
     * @param options.readableFont
     * @param options.dyslexiaFont
     * @param options.highlightTitles
     * @param options.highlightLinks
     * @param options.textMagnifier
     * @param options.fontSizing
     * @param options.lineHeight
     * @param options.letterSpacing
     * @param options.alignCenter
     * @param options.alignLeft
     * @param options.alignRight

     * @param options.darkContrast
     * @param options.lightContrast
     * @param options.monochrome
     * @param options.highSaturation
     * @param options.highContrast
     * @param options.lowSaturation
     * @param options.textColors
     * @param options.titleColors
     * @param options.backgroundColors

     * @param options.muteSounds
     * @param options.hideImages
     * @param options.virtualKeyboard
     * @param options.readingGuide
     * @param options.usefulLinks
     * @param options.stopAnimations
     * @param options.readingMask
     * @param options.highlightHover
     * @param options.highlightFocus
     * @param options.bigBlackCursor
     * @param options.bigWhiteCursor
     * @param options.textToSpeech
     * @param options.keyboardNavigation

     * @param options.startConfig
     * @param options.ignoreSavedConfig

     * @param options.showOpenButton
     * @param options.buttonPosition
     * @param options.buttonCaption
     * @param options.buttonIcon
     * @param options.buttonIconPosition
     * @param options.buttonSize

     * @param options.buttonMargin
     * @param options.buttonPadding
     * @param options.buttonBorderRadius
     * @param options.buttonColor
     * @param options.buttonColorHover
     * @param options.buttonBgcolor
     * @param options.buttonBgcolorHover

     * @param options.buttonEntranceTimeout
     * @param options.buttonEntranceAnimation
     * @param options.buttonHoverAnimation
     * @param options.popupOverlayColor
     * @param options.popupBackgroundColor
     * @param options.popupKeyColor
     * @param options.popupBorderRadius
     * @param options.popupAnimation
     * @param options.popupScroll
     * @param options.popupDraggable

     * @param options.highlightTitlesStyle
     * @param options.highlightTitlesColor
     * @param options.highlightTitlesWidth
     * @param options.highlightTitlesOffset

     * @param options.highlightLinksStyle
     * @param options.highlightLinksColor
     * @param options.highlightLinksWidth
     * @param options.highlightLinksOffset

     * @param options.textMagnifierBgColor
     * @param options.textMagnifierColor
     * @param options.textMagnifierFontSize

     * @param options.readingGuideWidth
     * @param options.readingGuideHeight
     * @param options.readingGuideBackgroundColor
     * @param options.readingGuideBorderColor
     * @param options.readingGuideBorderWidth
     * @param options.readingGuideBorderRadius
     * @param options.readingGuideArrow

     * @param options.readingMaskHeight
     * @param options.readingMaskColor

     * @param options.highlightHoverStyle
     * @param options.highlightHoverColor
     * @param options.highlightHoverWidth
     * @param options.highlightHoverOffset

     * @param options.highlightFocusStyle
     * @param options.highlightFocusColor
     * @param options.highlightFocusWidth
     * @param options.highlightFocusOffset

     * @param options.hotKeyOpenInterface
     * @param options.hotKeyMenu
     * @param options.hotKeyHeadings
     * @param options.hotKeyForms
     * @param options.hotKeyButtons
     * @param options.hotKeyGraphics
     *
     * @param options.cognitiveReading
     *
     * @param options.virtualKeyboardLayout
     *
     * @param options.textToSpeechAjaxUrl
     * @param options.textToSpeechNonce
     *
     * @param options.closeAnywhere
     *
     * @param options.LEARN_MORE_IN_WIKIPEDIA
     * @param options.DEFAULT
     * @param options.HOME
     * @param options.HIDE_ACCESSIBILITY_INTERFACE
     **/
    let options;

    /**
     * Start configuration initialization
     */
    let startConfiguration = {

        init: function () {

            let ignoreLocalStorage = options.ignoreSavedConfig === 'on'
            const spinnersControls = [
                'content_scaling',
                'font_sizing',
                'line_height',
                'letter_spacing',
            ];

            if ( haveSavedSettings() && ! ignoreLocalStorage ) { return; }
            if ( ! options.startConfig ) { return; }

            options.startConfig.forEach( opt => {

                const suffix = opt.includes( 'profile' ) ? `accessibility-${ opt }` : `action-${ opt }`;
                const id = `mdp-readabler-${ suffix.replaceAll( '_', '-' ) }`;
                const $target = document.getElementById( id );

                if ( $target ) {

                    if ( spinnersControls.includes( opt ) ) {

                        const spinnerValue = options[ toCamelCase( opt, '_', 'start' ) ] ?
                            options[ toCamelCase( opt, '_', 'start' ) ] : 0;

                        /** Proceed for spinners */
                        let valueElement = $target.querySelector( '.mdp-readabler-value' );
                        valueElement.dataset.value = spinnerValue.toString();

                        /** Set label by value. */
                        _includes_utilities_inputSpinner__WEBPACK_IMPORTED_MODULE_11__.inputSpinner.setLabel( valueElement, spinnerValue );

                        /** Fire change event. */
                        const event = new CustomEvent(
                            'ReadablerInputSpinnerChanged',
                            {
                                detail: {
                                    load: true
                                }
                            }
                        );

                        /** Fire custom event ReadablerInputSpinnerChanged. */
                        valueElement.dispatchEvent( event );

                        (0,_includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__.setLocal)( id, valueElement.dataset.value )

                    } else {

                        /** Proceed toggles and switchers */
                        const saved = (0,_includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__.getLocal)( `mdp-readabler-${ suffix.replaceAll( '_', '-' ) }` );

                        if ( ! JSON.parse( saved ) ) {

                            $target.click(); // Emulate click on related UI element

                        }

                    }

                }

            } );

        },

    };

    /**
     * Online Dictionary.
     **/
    let onlineDictionary = {

        /** Clear search results button. */
        clearResultsBtn: document.querySelector( '#mdp-readabler-online-dictionary-search-close' ),

        /** Search input. */
        searchInput: document.getElementById( 'mdp-readabler-online-dictionary-search' ),

        /** Search results UL. */
        searchResultsUL: document.getElementById( 'mdp-readabler-online-dictionary-search-results' ),

        /** Initialise Online Dictionary. */
        init: function () {

            /** Add change listener to search input. */
            this.searchInput.addEventListener( 'input', ( e ) => { delay( this.searchQuery( e ), 800 ) } );

            /** Clear search results button click. */
            this.clearResultsBtn.addEventListener( 'click', this.clearSearchResults );

        },

        /** Get language code from page html */
        getLang: function () {

            if ( 'auto' === options.language ) {

                const html = document.querySelector( 'html' );

                // Return English in no lang code for the page
                if ( ! html.getAttribute( 'lang' ) ) { return 'en' }

                // Return lang code from <html>
                return html.getAttribute( 'lang' ).split( '-', 1 )[ 0 ];

            } else {

                // Returns language from the page settings
                return options.language;

            }

        },

        /**
         * Process search request to Wiki.
         **/
        searchQuery: function ( e ) {

            /** Search query. */
            let search = e.target.value;

            /** Exit if delete search string value */
            if ( search.trim().length === 0 ) {
                return;
            }

            /** Process only 3+ letter phrases long. */
            if ( search.trim().length < 3 ) {

                /** Clear old results. */
                this.searchResultsUL.innerHTML = '';

                return;

            }

            /** Encode search query. */
            let encodedSearchQuery = encodeURI( search );
            let apiUrl = `https://${ this.getLang() }.wikipedia.org/w/api.php?action=query&format=json&utf8=&explaintext=&exlimit=3&generator=prefixsearch&prop=pageprops|extracts|extracts|description&redirects=&gpssearch=${ encodedSearchQuery }&gpslimit=3&origin=*`;

            /** Make search request to wikipedia.org. */
            fetch( apiUrl )
            .then( response => response.json() )
            .then( data => {

                /** Clear old results. */
                this.searchResultsUL.innerHTML = '';

                /** Parse each founded page. */
                for ( let key in data.query.pages ) {

                    /** Skip loop if the property is from prototype. */
                    if ( ! data.query.pages.hasOwnProperty( key ) ) { continue; }

                    this.addResultToList( data.query.pages[key] );

                }

                /** Show clear results button. */
                this.clearResultsBtn.style.display = 'block';

            } )
            .catch( ( er ) => {
                console.warn( er );
            } );

            return true;

        },

        /**
         * Add search result to list.
         **/
        addResultToList: function ( page ) {

            const wikiText = typeof page.description !== "undefined" ? page.description : '';

            /** Create li item. */
            let li = document.createElement( 'li' );
            li.innerHTML = `
                    <h5 class="mdp-readabler-online-dictionary-title">${page.title}</h5>
                    <p class="mdp-readabler-online-dictionary-text">${wikiText}</p>
                    <a target="_blank" rel="nofollow" class="mdp-readabler-online-dictionary-link" href="https://${ this.getLang() }.wikipedia.org/wiki/${ page.title }">${ options.LEARN_MORE_IN_WIKIPEDIA }</a>
                    `;

            /** Add result to UL. */
            this.searchResultsUL.appendChild( li );

        },

        /**
         * Clear Search results.
         **/
        clearSearchResults: function () {

            /** Clear Input */
            onlineDictionary.searchInput.setAttribute( 'value','' );

            /** Clear results. */
            onlineDictionary.searchResultsUL.innerHTML = '';

            /** Hide clear results button. */
            onlineDictionary.clearResultsBtn.style.display = 'none';

        },

    }

    /**
     * Accessibility Profiles.
     **/
    let accessibilityProfiles = {

        /** Accessibility Profiles items. */
        profiles: document.querySelectorAll( '#mdp-readabler-accessibility-profiles-box .mdp-readabler-accessibility-profile-item' ),

        /** Initialise Accessibility Profiles. */
        init: function () {

            /** Process only if we have at least one enabled profile. */
            if ( ! accessibilityProfiles.isProfiles ) { return; }

            /** Enable/Disable profile by click. */
            this.profiles.forEach( profileItem => profileItem.addEventListener( 'click', delay( this.toggleProfile, 100 ) ) );

            /** Enable/Disable profile by keydown. */
            this.profiles.forEach( profileItem => profileItem.addEventListener( 'keydown', delay( this.toggleProfile, 100 ) ) );

        },

        /**
         * Enable/Disable profile by click and keydown.
         **/
        toggleProfile: function ( e ) {

            if ( e.type === 'keydown' && e.keyCode !== 13 ) { return }

            let profileItem = this.closest( '.mdp-readabler-accessibility-profile-item' );
            let switcher = profileItem.querySelector( 'input[type="checkbox"]' );

            /** Select profile. */
            if ( ! profileItem.classList.contains( 'mdp-active' ) ) {

                /** Disable previously enabled profile. */
                let prevProfile = document.querySelector( '#mdp-readabler-accessibility-profiles-box .mdp-readabler-accessibility-profile-item.mdp-active' );
                if ( prevProfile ) { prevProfile.click(); }

                /** Enable current profile. */
                profileItem.classList.add( 'mdp-active' );
                switcher.checked = true;

                /** Save current profile to localStorage. */
                (0,_includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__.setLocal)( profileItem.id, '1' );

                /** Get current profile name. */
                let profileName = profileItem.id.replace( 'mdp-readabler-accessibility-profile-', '' );
                profileName = toTitleCase( profileName, '-' );
                profileName = profileName.replace( '-', '' );
                profileName = 'profile' + profileName;

                /** Enable profile. */
                accessibilityProfiles[profileName]( true );

            /** Deselect profile. */
            } else {

                profileItem.classList.remove( 'mdp-active' );
                switcher.checked = false;

                /** Disable profile to localStorage. */
                (0,_includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__.setLocal)( profileItem.id, '0' );

                /** Get current profile name. */
                let profileName = profileItem.id.replace( 'mdp-readabler-accessibility-profile-', '' );
                profileName = toTitleCase( profileName, '-' );
                profileName = profileName.replace( '-', '' );
                profileName = 'profile' + profileName;

                /** Disable profile. */
                accessibilityProfiles[profileName]( false );

            }

            /** Analytics event */
            const analyticsEvent = new CustomEvent(
                'ReadablerAnalyticsEvent',
                {
                    detail: {
                        category: 'profile',
                        id: profileItem.id.replace( 'mdp-readabler-accessibility-profile-', 'profile-' ),
                        value: switcher.checked ? 1 : 0,
                        timestamp: new Date().getTime()
                    }
                }
            );
            window.dispatchEvent( analyticsEvent );

        },

        /**
         * Enable profile from localstorage.
         **/
        loadSaved: function () {

            accessibilityProfiles.profiles.forEach( profileItem => {

                let value = (0,_includes_utilities_localStorage__WEBPACK_IMPORTED_MODULE_8__.getLocal)( profileItem.id );

                if ( '1' !== value ) { return; }

                let switcher = profileItem.querySelector( 'input[type="checkbox"]' );
                switcher.checked = true;
                profileItem.click();

            } );

        },

        /**
         * Enable selected profile.
         **/
        profileEpilepsy: function ( enable ) {

            let fClass = 'mdp-readabler-profile-epilepsy';

            /** Enable Epilepsy Profile. */
            if ( enable ) {

                /** Add class to body as flag. */
                document.body.classList.add( fClass );

                let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation:not(.mdp-active)' );
                if ( lowSaturation ) { lowSaturation.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
                if ( stopAnimations ) { stopAnimations.click(); }

            }

            /** Disable Epilepsy Profile. */
            else {

                document.body.classList.remove( fClass );

                let lowSaturation = document.querySelector( '#mdp-readabler-action-low-saturation.mdp-active' );
                if ( lowSaturation ) { lowSaturation.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
                if ( stopAnimations ) { stopAnimations.click(); }

            }

        },

        profileVisuallyImpaired: function ( enable ) {

            let fClass = 'mdp-readabler-profile-visually-impaired';

            /** Enable Visually Impaired Profile. */
            if ( enable ) {

                /** Add class to body as flag. */
                document.body.classList.add( fClass );

                let readableFont = document.querySelector( '#mdp-readabler-action-readable-font:not(.mdp-active)' );
                if ( readableFont ) { readableFont.click(); }

                let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation:not(.mdp-active)' );
                if ( highSaturation ) { highSaturation.click(); }

            }

            /** Disable Visually Impaired Profile. */
            else {

                document.body.classList.remove( fClass );

                let readableFont = document.querySelector( '#mdp-readabler-action-readable-font.mdp-active' );
                if ( readableFont ) { readableFont.click(); }

                let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation.mdp-active' );
                if ( highSaturation ) { highSaturation.click(); }

            }

        },

        profileCognitiveDisability: function ( enable ) {

            let fClass = 'mdp-readabler-profile-cognitive-disability';

            /** Enable Cognitive Disability Profile. */
            if ( enable ) {

                /** Add class to body as flag. */
                document.body.classList.add( fClass );

                let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles:not(.mdp-active)' );
                if ( highlightTitles ) { highlightTitles.click(); }

                let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links:not(.mdp-active)' );
                if ( highlightLinks ) { highlightLinks.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
                if ( stopAnimations ) { stopAnimations.click(); }

            }

            /** Disable Cognitive Disability Profile. */
            else {

                document.body.classList.remove( fClass );

                let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles.mdp-active' );
                if ( highlightTitles ) { highlightTitles.click(); }

                let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links.mdp-active' );
                if ( highlightLinks ) { highlightLinks.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
                if ( stopAnimations ) { stopAnimations.click(); }

            }

        },

        profileAdhdFriendly: function ( enable ) {

            let fClass = 'mdp-readabler-profile-adhd-friendly';

            /** Enable ADHD Friendly Profile. */
            if ( enable ) {

                /** Add class to body as flag. */
                document.body.classList.add( fClass );

                let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation:not(.mdp-active)' );
                if ( highSaturation ) { highSaturation.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations:not(.mdp-active)' );
                if ( stopAnimations ) { stopAnimations.click(); }

                let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask:not(.mdp-active)' );
                if ( readingMask ) { readingMask.click(); }

            }

            /** Disable ADHD Friendly Profile. */
            else {

                document.body.classList.remove( fClass );

                let highSaturation = document.querySelector( '#mdp-readabler-action-high-saturation.mdp-active' );
                if ( highSaturation ) { highSaturation.click(); }

                let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations.mdp-active' );
                if ( stopAnimations ) { stopAnimations.click(); }

                let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask.mdp-active' );
                if ( readingMask ) { readingMask.click(); }

            }

        },

        profileBlindUsers: function ( enable ) {

            let fClass = 'mdp-readabler-profile-blind-users';

            /** Enable Blind Users Profile. */
            if ( enable ) {

                /** Add class to body as flag. */
                document.body.classList.add( fClass );

                let readableFont = document.querySelector( '#mdp-readabler-action-readable-font:not(.mdp-active)' );
                if ( readableFont ) { readableFont.click(); }

                let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard:not(.mdp-active)' );
                if ( virtualKeyboard ) { virtualKeyboard.click(); }

                let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech:not(.mdp-active)' );
                if ( textToSpeech ) { textToSpeech.click(); }

                let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation:not(.mdp-active)' );
                if ( keyboardNavigation ) { keyboardNavigation.click(); }

            }

            /** Disable Blind Users Profile. */
            else {

                document.body.classList.remove( fClass );

                let readableFont = document.querySelector( '#mdp-readabler-action-readable-font.mdp-active' );
                if ( readableFont ) { readableFont.click(); }

                let virtualKeyboard = document.querySelector( '#mdp-readabler-action-virtual-keyboard.mdp-active' );
                if ( virtualKeyboard ) { virtualKeyboard.click(); }

                let textToSpeech = document.querySelector( '#mdp-readabler-action-text-to-speech.mdp-active' );
                if ( textToSpeech ) { textToSpeech.click(); }

                let keyboardNavigation = document.querySelector( '#mdp-readabler-action-keyboard-navigation.mdp-active' );
                if ( keyboardNavigation ) { keyboardNavigation.click(); }

            }

        },

        /**
         * Check do we have enabled any profile.
         **/
        isProfiles: function () {

            return !! (
                options.profileEpilepsy ||
                options.profileVisuallyImpaired ||
                options.profileCognitiveDisability ||
                options.profileAdhdFriendly ||
                options.profileBlindUsers
            );

        }

    }

    // noinspection JSUnusedLocalSymbols
    /**
     * Content Scaling.
     **/
    let actionContentScaling = {

        /**
         * Initialise Content Scaling action.
         **/
        init: function () {

            /** Listen for Content Scaling change. */
            let contentScaling = document.querySelector( '#mdp-readabler-action-content-scaling .mdp-readabler-value' );
            contentScaling.addEventListener( 'ReadablerInputSpinnerChanged', this.scaleContent );

        },

        /**
         * Scale site content.
         **/
        scaleContent: function ( e ) {

            /** Scale factor. */
            let scale = parseInt( e.target.dataset.value );
            actionContentScaling.setElementProperty( scale, 'body > *', 'zoom', '' );

        },

        /**
         * Set css property to all elements by selector.
         **/
        setFirefoxProperty: function ( scale, selector, CSSProperty, unit ) {

            /** Prepare dataset key based on css property name. */
            let camelProperty = toTitleCase( CSSProperty, '-' ).replace( '-', '' );
            camelProperty = 'readabler' + camelProperty;

            /** Set a new css property value for all elements in selector. */
            let el = document.querySelector( selector );

            /** Get property value from attribute. */
            let propertyValue = parseFloat( el.dataset[camelProperty] );

            if ( ! propertyValue || isNaN( propertyValue ) ) {

                /** Get element property. */
                let style = window.getComputedStyle( el, null ).getPropertyValue( CSSProperty );

                style === 'none' ?
                    propertyValue = 1 :
                    propertyValue = parseFloat( style.split( '(' )[ 1 ].split( ')' )[ 0 ] );

                /** Remember for future uses. */
                el.dataset[camelProperty] = propertyValue.toString();

            }

            /** Calculate new property value. */
            if ( 0 === propertyValue ) { propertyValue = 1; }
            let newPropertyVal = ( propertyValue + Math.abs( propertyValue / 100 ) * scale ).toFixed( 2 );

            /** Set value or none. */
            if ( parseFloat( newPropertyVal ) === 1 ) {

                el.style.setProperty( CSSProperty, `none`, 'important');

            } else {

                el.style.setProperty( CSSProperty, `scale(${ newPropertyVal.toString() })`, 'important');

            }

        },

        /**
         * Set css property to all elements by selector.
         **/
        setElementProperty: function ( scale, selector, CSSProperty, unit ) {

            /** Prepare dataset key based on css property name. */
            let camelProperty = toTitleCase( CSSProperty, '-' ).replace( '-', '' );
            camelProperty = 'readabler' + camelProperty;

            /** Set a new css property value for all elements in selector. */
            let elements = document.querySelectorAll( selector );
            elements.forEach( el  => {

                /** Get property value from attribute. */
                let propertyValue = parseFloat( el.dataset[camelProperty] );
                if ( ! propertyValue ) {

                    /** Get element property. */
                    let style = window.getComputedStyle( el, null ).getPropertyValue( CSSProperty );

                    propertyValue = parseFloat( style );

                    /** Special case: letter-spacing: normal. */
                    if ( 'normal' === style ) { propertyValue = 0; }

                    /** Remember for future uses. */
                    el.dataset[camelProperty] = propertyValue.toString();

                }

                /** Calculate new property value. */
                if ( 0 === propertyValue ) { propertyValue = 1; }
                let newPropertyVal = ( propertyValue + Math.abs( propertyValue / 100 ) * scale ).toFixed( 2 );

                /** Set value. */
                el.style.setProperty( CSSProperty, newPropertyVal.toString() + unit, 'important');

            } );

        }

    }

    /**
     * Readable Font.
     **/
    let actionReadableFont = {

        readableFontStyle: document.createElement('style'),

        /**
         * Initialise Readable Font action.
         **/
        init: function () {

            /** Listen for Readable Font change. */
            let readableFont = document.querySelector( '#mdp-readabler-action-readable-font' );
            readableFont.addEventListener( 'ReadablerToggleBoxChanged', actionReadableFont.readableFont );

        },

        /**
         * Toggle readable font.
         **/
        readableFont: function ( e ) {

            /** Remove class from body to reset font family to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-readable-font' );
                return;

            }

            /** Disable other buttons in button group. */
            actionReadableFont.disableOthers();

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-readable-font' );

            /** Add CSS to header. */
            //language=CSS
            actionReadableFont.readableFontStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-readable-font *:not(i){
                    font-family: Arial, Helvetica, sans-serif !important;
                }
            `;

            document.head.appendChild( actionReadableFont.readableFontStyle );

        },

        /**
         * Disable other buttons in button group.
         **/
        disableOthers: function () {

            /** Disable Dyslexia Font if enabled. */
            let dyslexia = document.getElementById( 'mdp-readabler-action-dyslexia-font' );

            if ( ! dyslexia ) { return; }

            if ( dyslexia.classList.contains( 'mdp-active') ) {
                dyslexia.click();
            }

        }

    }

    /**
     * Dyslexia Friendly.
     **/
    let actionDyslexiaFriendly = {

        dyslexiaFriendlyStyle: document.createElement( 'style' ),

        /**
         * Initialise Dyslexia Friendly action.
         **/
        init: function () {

            /** Listen for Dyslexia Friendly change. */
            let dyslexiaFriendly = document.querySelector( '#mdp-readabler-action-dyslexia-font' );
            dyslexiaFriendly.addEventListener( 'ReadablerToggleBoxChanged', actionDyslexiaFriendly.dyslexiaFriendly );

        },

        /**
         * Toggle Dyslexia Friendly font.
         **/
        dyslexiaFriendly: function ( e ) {

            /** Remove class from body to reset font family to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-dyslexia-font' );
                return;

            }

            /** Disable other buttons in button group. */
            actionDyslexiaFriendly.disableOthers();

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-dyslexia-font' );

            /** Add CSS to header. */
            //language=CSS
            actionDyslexiaFriendly.dyslexiaFriendlyStyle.innerHTML = `
                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${options.pluginURL}fonts/OpenDyslexic-Italic.eot");
                    src: local("OpenDyslexic Italic"), local("OpenDyslexic-Italic"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Italic.eot?#iefix") format("embedded-opentype"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Italic.woff2") format("woff2"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Italic.woff") format("woff");
                    font-weight: normal;
                    font-style: italic;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${options.pluginURL}fonts/OpenDyslexic-Bold-Italic.eot");
                    src: local("OpenDyslexic Bold Italic"), local("OpenDyslexic-Bold-Italic"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold-Italic.eot?#iefix") format("embedded-opentype"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold-Italic.woff2") format("woff2"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold-Italic.woff") format("woff");
                    font-weight: bold;
                    font-style: italic;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${options.pluginURL}fonts/OpenDyslexic-Bold.eot");
                    src: local("OpenDyslexic Bold"), local("OpenDyslexic-Bold"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold.eot?#iefix") format("embedded-opentype"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold.woff2") format("woff2"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Bold.woff") format("woff");
                    font-weight: bold;
                    font-style: normal;
                    font-display: swap; 
                }

                /*noinspection CssUnknownTarget*/
                @font-face {
                    font-family: 'OpenDyslexic';
                    src: url("${options.pluginURL}fonts/OpenDyslexic-Regular.eot");
                    src: local("OpenDyslexic Regular"), local("OpenDyslexic-Regular"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Regular.eot?#iefix") format("embedded-opentype"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Regular.woff2") format("woff2"), 
                         url("${options.pluginURL}fonts/OpenDyslexic-Regular.woff") format("woff");
                    font-weight: normal;
                    font-style: normal;
                    font-display: swap; 
                }
                    
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-dyslexia-font,
                body.mdp-readabler-dyslexia-font h1,
                body.mdp-readabler-dyslexia-font h1 span,
                body.mdp-readabler-dyslexia-font h2,
                body.mdp-readabler-dyslexia-font h2 span,
                body.mdp-readabler-dyslexia-font h3,
                body.mdp-readabler-dyslexia-font h3 span,
                body.mdp-readabler-dyslexia-font h4,
                body.mdp-readabler-dyslexia-font h4 span,
                body.mdp-readabler-dyslexia-font h5,
                body.mdp-readabler-dyslexia-font h5 span,
                body.mdp-readabler-dyslexia-font h6,
                body.mdp-readabler-dyslexia-font h6 span,

                body.mdp-readabler-dyslexia-font a,
                body.mdp-readabler-dyslexia-font p,
                body.mdp-readabler-dyslexia-font li a,
                body.mdp-readabler-dyslexia-font label,
                body.mdp-readabler-dyslexia-font input,
                body.mdp-readabler-dyslexia-font select,
                body.mdp-readabler-dyslexia-font textarea,
                body.mdp-readabler-dyslexia-font legend,
                body.mdp-readabler-dyslexia-font code,
                body.mdp-readabler-dyslexia-font pre,
                body.mdp-readabler-dyslexia-font dd,
                body.mdp-readabler-dyslexia-font dt,
                body.mdp-readabler-dyslexia-font span,
                body.mdp-readabler-dyslexia-font blockquote {
                    font-family: 'OpenDyslexic', serif !important;
                }
            `;

            document.head.appendChild( actionDyslexiaFriendly.dyslexiaFriendlyStyle );

        },

        /**
         * Disable other buttons in button group.
         **/
        disableOthers: function () {

            /** Disable Readable Font if enabled. */
            let readable = document.getElementById( 'mdp-readabler-action-readable-font' );
            if ( readable.classList.contains( 'mdp-active') ) {
                readable.click();
            }

        }

    }

    /**
     * Highlight Titles.
     **/
    let actionHighlightTitles = {

        highlightTitlesStyle: document.createElement( 'style' ),

        /**
         * Initialise Highlight Titles action.
         **/
        init: function () {

            /** Listen for Highlight Titles change. */
            let highlightTitles = document.querySelector( '#mdp-readabler-action-highlight-titles' );
            highlightTitles.addEventListener( 'ReadablerToggleBoxChanged', actionHighlightTitles.highlightTitles );

        },

        /**
         * Toggle Highlight Titles styles.
         **/
        highlightTitles: function ( e ) {

            /** Remove class from body to reset titles to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-highlight-titles' );
                return;

            }

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-highlight-titles' );

            /** Add CSS to header. */
            //language=CSS
            actionHighlightTitles.highlightTitlesStyle.innerHTML = `                    
                body.mdp-readabler-highlight-titles h1, 
                body.mdp-readabler-highlight-titles h2, 
                body.mdp-readabler-highlight-titles h3, 
                body.mdp-readabler-highlight-titles h4, 
                body.mdp-readabler-highlight-titles h5, 
                body.mdp-readabler-highlight-titles h6, 
                body.mdp-readabler-highlight-titles [role="heading"] {
                    outline-style: ${options.highlightTitlesStyle} !important;
                    outline-color: ${options.highlightTitlesColor} !important;
                    outline-width: ${options.highlightTitlesWidth}px !important;
                    outline-offset: ${options.highlightTitlesOffset}px !important;
                }
            `;

            document.head.appendChild( actionHighlightTitles.highlightTitlesStyle );

        }

    }

    /**
     * Highlight Links.
     **/
    let actionHighlightLinks = {

        highlightLinksStyle: document.createElement( 'style' ),

        /**
         * Initialise Highlight Links action.
         **/
        init: function () {

            /** Listen for Highlight Links change. */
            let highlightLinks = document.querySelector( '#mdp-readabler-action-highlight-links' );
            highlightLinks.addEventListener( 'ReadablerToggleBoxChanged', actionHighlightLinks.highlightLinks );

        },

        /**
         * Toggle Highlight Links styles.
         **/
        highlightLinks: function ( e ) {

            /** Remove class from body to reset links to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-highlight-links' );
                return;

            }

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-highlight-links' );

            /** Add CSS to header. */
            //language=CSS
            actionHighlightLinks.highlightLinksStyle.innerHTML = `                    
                body.mdp-readabler-highlight-links a {
                    outline-style: ${options.highlightLinksStyle} !important;
                    outline-color: ${options.highlightLinksColor} !important;
                    outline-width: ${options.highlightLinksWidth}px !important;
                    outline-offset: ${options.highlightLinksOffset}px !important;
                }
            `;

            document.head.appendChild( actionHighlightLinks.highlightLinksStyle );

        }

    }

    /**
     * Text Magnifier.
     **/
    let actionTextMagnifier = {

        /** Create tooltip element. */
        tooltip: document.createElement( 'div' ),

        textMagnifierStyle: document.createElement( 'style' ),

        /**
         * Initialise Text Magnifier action.
         **/
        init: function () {

            /** Listen for Text Magnifier change. */
            let textMagnifier = document.querySelector( '#mdp-readabler-action-text-magnifier' );
            textMagnifier.addEventListener( 'ReadablerToggleBoxChanged', actionTextMagnifier.textMagnifier );

            /** Set id for tooltip. */
            actionTextMagnifier.tooltip.id = 'mdp-readabler-text-magnifier-tooltip';

        },

        /**
         * Toggle Text Magnifier.
         **/
        textMagnifier: function ( e ) {

            /** Disable. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                /** Remove class from body. */
                document.body.classList.remove( 'mdp-readabler-text-magnifier' );

                /** Remove mousemove listener. */
                document.removeEventListener( 'mousemove', actionTextMagnifier.updateTooltip, false );

                /** Remove tooltip from DOM. */
                document.body.removeChild( actionTextMagnifier.tooltip );

                /** Remove events for Show/hide tooltip on mouse leave page. */
                document.removeEventListener( 'mouseleave', actionTextMagnifier.hideTooltip, false );
                document.removeEventListener( 'mouseenter', actionTextMagnifier.showTooltip, false );

                return;

            }

            /** Enable. */

            /** Add class to body. */
            document.body.classList.add( 'mdp-readabler-text-magnifier' );

            /** Add tooltip into DOM. */
            document.body.appendChild( actionTextMagnifier.tooltip );

            /** Update tooltip on mouse move. */
            document.addEventListener( 'mousemove', actionTextMagnifier.updateTooltip , false );

            /** Show/hide tooltip on mouse leave page. */
            document.addEventListener( 'mouseleave', actionTextMagnifier.hideTooltip, false );
            document.addEventListener( 'mouseenter', actionTextMagnifier.showTooltip, false );

            /** Add CSS to header. */
            //language=CSS
            actionTextMagnifier.textMagnifierStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/                    
                body.mdp-readabler-text-magnifier #mdp-readabler-text-magnifier-tooltip {
                    background-color: ${options.textMagnifierBgColor} !important;
                    color: ${options.textMagnifierColor} !important;
                    font-size: ${options.textMagnifierFontSize}px !important;
                }
            `;

            document.head.appendChild( actionTextMagnifier.textMagnifierStyle );

        },

        /** Add tooltip with zoomed content on mouse move. */
        updateTooltip: function ( e ) {

            /** Show zoomed tooltip only for content tags. */
            let contentElements = [
                'H1',
                'H2',
                'H3',
                'H4',
                'H5',
                'H6',
                'SPAN',
                'P',
                'LI',
                'LABEL',
                'INPUT',
                'SELECT',
                'TEXTAREA',
                'LEGEND',
                'CODE',
                'PRE',
                'DD',
                'DT',
                'A',
                'STRONG',
                'B',
                'BLOCKQUOTE'
            ];

            /** Hide tooltip for non-content tags. */
            if ( ! contentElements.includes( e.target.nodeName ) ) {

                actionTextMagnifier.hideTooltip();
                return;

            }

            /** Hide tooltip without text. */
            if ( '' === e.target.innerText.trim() ) {

                actionTextMagnifier.hideTooltip();
                return;

            }

            /** Show tooltip. */
            actionTextMagnifier.showTooltip();

            /** Set text from under mouse to tooltip. */
            actionTextMagnifier.tooltip.innerHTML = e.target.innerText;

            /** Move tooltip to cursor. */
            const shift = 15;
            let maxWidth = window.innerWidth;
            actionTextMagnifier.tooltip.style.top = `${ e.clientY + shift }px`;

            /** Stick popup to right if cursor on the right 50% */
            if ( e.clientX > window.innerWidth * 0.5 ) {

                maxWidth = e.clientX - shift <= 680 ? e.clientX - shift : 680;

                actionTextMagnifier.tooltip.style.left = `unset`;
                actionTextMagnifier.tooltip.style.right = `${ window.innerWidth - e.clientX - shift }px`;
                actionTextMagnifier.tooltip.style.maxWidth = `${ maxWidth }px`;

            } else {

                maxWidth = window.innerWidth - e.clientX - 3 * shift < 680 ? window.innerWidth - e.clientX - 3 * shift : 680;

                actionTextMagnifier.tooltip.style.right = `unset`;
                actionTextMagnifier.tooltip.style.left = `${ e.clientX + shift }px`;
                actionTextMagnifier.tooltip.style.maxWidth = `${ maxWidth }px`;

            }

        },

        /** Hide tooltip. */
        hideTooltip: function () {
            actionTextMagnifier.tooltip.style.visibility = 'hidden';
        },

        /** Show tooltip. */
        showTooltip: function () {
            actionTextMagnifier.tooltip.style.visibility = 'visible';
        }

    }

    /**
     * Align Center.
     **/
    let actionAlignCenter = {

        alignCenterStyle: document.createElement( 'style' ),

        /**
         * Initialise Align Center action.
         **/
        init: function () {

            /** Listen for Align Center change. */
            let alignCenter = document.querySelector( '#mdp-readabler-action-align-center' );
            alignCenter.addEventListener( 'ReadablerToggleBoxChanged', actionAlignCenter.alignCenter );

        },

        /**
         * Toggle Align Center styles.
         **/
        alignCenter: function ( e ) {

            /** Remove class from body to reset align to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-align-center' );
                return;

            }

            /** Disable other buttons in button group. */
            actionAlignCenter.disableOthers();

            /** Add class to body, to apply to align styles. */
            document.body.classList.add( 'mdp-readabler-align-center' );

            /** Add CSS to header. */
            //language=CSS
            actionAlignCenter.alignCenterStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-center,
                body.mdp-readabler-align-center h1,
                body.mdp-readabler-align-center h1 span,
                body.mdp-readabler-align-center h2,
                body.mdp-readabler-align-center h2 span,
                body.mdp-readabler-align-center h3,
                body.mdp-readabler-align-center h3 span,
                body.mdp-readabler-align-center h4,
                body.mdp-readabler-align-center h4 span,
                body.mdp-readabler-align-center h5,
                body.mdp-readabler-align-center h5 span,
                body.mdp-readabler-align-center h6,
                body.mdp-readabler-align-center h6 span,

                body.mdp-readabler-align-center p,
                body.mdp-readabler-align-center li,
                body.mdp-readabler-align-center label,
                body.mdp-readabler-align-center input,
                body.mdp-readabler-align-center select,
                body.mdp-readabler-align-center textarea,
                body.mdp-readabler-align-center legend,
                body.mdp-readabler-align-center code,
                body.mdp-readabler-align-center pre,
                body.mdp-readabler-align-center dd,
                body.mdp-readabler-align-center dt,
                body.mdp-readabler-align-center span,
                body.mdp-readabler-align-center blockquote {
                    text-align: center !important;
                }
            `;

            document.head.appendChild( actionAlignCenter.alignCenterStyle );

        },

        /**
         * Disable other buttons in button group.
         **/
        disableOthers: function () {

            /** Disable Align Left if enabled. */
            let left = document.getElementById( 'mdp-readabler-action-align-left' );

            if ( null !== left ) {

                if ( left.classList.contains( 'mdp-active') ) {
                    left.click();
                }

            }

            /** Disable Align Right if enabled. */
            let right = document.getElementById( 'mdp-readabler-action-align-right' );

            if ( null !== right ) {

                if ( right.classList.contains( 'mdp-active') ) {
                    right.click();
                }

            }

        }

    }

    /**
     * Align Left.
     **/
    let actionAlignLeft = {

        alignLeftStyle: document.createElement( 'style' ),

        /**
         * Initialise Align Left action.
         **/
        init: function () {

            /** Listen for Align Left change. */
            let alignLeft = document.querySelector( '#mdp-readabler-action-align-left' );
            alignLeft.addEventListener( 'ReadablerToggleBoxChanged', actionAlignLeft.alignLeft );

        },

        /**
         * Toggle Align Left styles.
         **/
        alignLeft: function ( e ) {

            /** Remove class from body to reset align to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-align-left' );
                return;

            }

            /** Disable other buttons in button group. */
            actionAlignLeft.disableOthers();

            /** Add class to body, to apply to align styles. */
            document.body.classList.add( 'mdp-readabler-align-left' );

            /** Add CSS to header. */
            //language=CSS
            actionAlignLeft.alignLeftStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-left,
                body.mdp-readabler-align-left h1,
                body.mdp-readabler-align-left h1 span,
                body.mdp-readabler-align-left h2,
                body.mdp-readabler-align-left h2 span,
                body.mdp-readabler-align-left h3,
                body.mdp-readabler-align-left h3 span,
                body.mdp-readabler-align-left h4,
                body.mdp-readabler-align-left h4 span,
                body.mdp-readabler-align-left h5,
                body.mdp-readabler-align-left h5 span,
                body.mdp-readabler-align-left h6,
                body.mdp-readabler-align-left h6 span,

                body.mdp-readabler-align-left p,
                body.mdp-readabler-align-left li,
                body.mdp-readabler-align-left label,
                body.mdp-readabler-align-left input,
                body.mdp-readabler-align-left select,
                body.mdp-readabler-align-left textarea,
                body.mdp-readabler-align-left legend,
                body.mdp-readabler-align-left code,
                body.mdp-readabler-align-left pre,
                body.mdp-readabler-align-left dd,
                body.mdp-readabler-align-left dt,
                body.mdp-readabler-align-left span,
                body.mdp-readabler-align-left blockquote {
                    text-align: left !important;
                }
            `;

            document.head.appendChild( actionAlignLeft.alignLeftStyle );

        },

        /**
         * Disable other buttons in button group.
         **/
        disableOthers: function () {

            /** Disable Align Center if enabled. */
            let center = document.getElementById( 'mdp-readabler-action-align-center' );

            if ( null !== center ) {

                if ( center.classList.contains( 'mdp-active') ) {
                    center.click();
                }

            }

            /** Disable Align Right if enabled. */
            let right = document.getElementById( 'mdp-readabler-action-align-right' );

            if ( null !== right ) {

                if ( right.classList.contains( 'mdp-active') ) {
                    right.click();
                }

            }

        }

    }

    /**
     * Align Right.
     **/
    let actionAlignRight = {

        alignRightStyle: document.createElement( 'style' ),

        /**
         * Initialise Align Right action.
         **/
        init: function () {

            /** Listen for Align Right change. */
            let alignRight = document.querySelector( '#mdp-readabler-action-align-right' );
            alignRight.addEventListener( 'ReadablerToggleBoxChanged', actionAlignRight.alignRight );

        },

        /**
         * Toggle Align Right styles.
         **/
        alignRight: function ( e ) {

            /** Remove class from body to reset align to default values. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-align-right' );
                return;

            }

            /** Disable other buttons in button group. */
            actionAlignRight.disableOthers();

            /** Add class to body, to apply to align styles. */
            document.body.classList.add( 'mdp-readabler-align-right' );

            /** Add CSS to header. */
            //language=CSS
            actionAlignRight.alignRightStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-align-right,
                body.mdp-readabler-align-right h1,
                body.mdp-readabler-align-right h1 span,
                body.mdp-readabler-align-right h2,
                body.mdp-readabler-align-right h2 span,
                body.mdp-readabler-align-right h3,
                body.mdp-readabler-align-right h3 span,
                body.mdp-readabler-align-right h4,
                body.mdp-readabler-align-right h4 span,
                body.mdp-readabler-align-right h5,
                body.mdp-readabler-align-right h5 span,
                body.mdp-readabler-align-right h6,
                body.mdp-readabler-align-right h6 span,

                body.mdp-readabler-align-right p,
                body.mdp-readabler-align-right li,
                body.mdp-readabler-align-right label,
                body.mdp-readabler-align-right input,
                body.mdp-readabler-align-right select,
                body.mdp-readabler-align-right textarea,
                body.mdp-readabler-align-right legend,
                body.mdp-readabler-align-right code,
                body.mdp-readabler-align-right pre,
                body.mdp-readabler-align-right dd,
                body.mdp-readabler-align-right dt,
                body.mdp-readabler-align-right span,
                body.mdp-readabler-align-right blockquote {
                    text-align: right !important;
                }
            `;

            document.head.appendChild( actionAlignRight.alignRightStyle );

        },

        /**
         * Disable other buttons in button group.
         **/
        disableOthers: function () {

            /** Disable Align Center if enabled. */
            let center = document.getElementById( 'mdp-readabler-action-align-center' );

            if ( null !== center ) {

                if ( center.classList.contains( 'mdp-active') ) {
                    center.click();
                }

            }

            /** Disable Align Left if enabled. */
            let left = document.getElementById( 'mdp-readabler-action-align-left' );

            if ( null !== left ) {

                if ( left.classList.contains( 'mdp-active') ) {
                    left.click();
                }

            }

        }

    }

    /**
     * Text Colors.
     **/
    let actionTextColors = {

        textColorsStyle: document.createElement( 'style' ),

        /**
         * Initialise Text Colors action.
         **/
        init: function () {

            /** Listen for Text Colors change. */
            let textColors = document.querySelector( '#mdp-readabler-action-text-colors' );
            textColors.addEventListener( 'ReadablerPaletteChanged', actionTextColors.textColors );

        },

        /**
         * Change Text Color action.
         **/
        textColors: function ( e ) {

            let color = e.detail.color;

            /** Remove class from body to reset text colors to default state. */
            if ( null === color ) {

                /** Add class to body, to apply styles. */
                document.body.classList.remove( 'mdp-readabler-text-colors' );
                return;

            }

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-text-colors' );

            /** Add CSS to header. */
            //language=CSS
            actionTextColors.textColorsStyle.innerHTML = `
                body.mdp-readabler-text-colors a,
                body.mdp-readabler-text-colors p,
                body.mdp-readabler-text-colors li,
                body.mdp-readabler-text-colors label,
                body.mdp-readabler-text-colors input,
                body.mdp-readabler-text-colors select,
                body.mdp-readabler-text-colors textarea,
                body.mdp-readabler-text-colors legend,
                body.mdp-readabler-text-colors code,
                body.mdp-readabler-text-colors pre,
                body.mdp-readabler-text-colors dd,
                body.mdp-readabler-text-colors dt,
                body.mdp-readabler-text-colors span,
                body.mdp-readabler-text-colors blockquote {
                    color: ${color} !important;
                }
            `;

            document.head.appendChild( actionTextColors.textColorsStyle );

        }

    }

    /**
     * Title Colors.
     **/
    let actionTitleColors = {

        titleColorsStyle: document.createElement( 'style' ),

        /**
         * Initialise Title Colors action.
         **/
        init: function () {

            /** Listen for Title Colors change. */
            let titleColors = document.querySelector( '#mdp-readabler-action-title-colors' );
            titleColors.addEventListener( 'ReadablerPaletteChanged', actionTitleColors.titleColors );

        },

        /**
         * Change Title Color action.
         **/
        titleColors: function ( e ) {

            let color = e.detail.color;

            /** Remove class from body to reset Title colors to default state. */
            if ( null === color ) {

                /** Add class to body, to apply styles. */
                document.body.classList.remove( 'mdp-readabler-title-colors' );
                return;

            }

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-title-colors' );

            /** Add CSS to header. */
            //language=CSS
            actionTitleColors.titleColorsStyle.innerHTML = `
                body.mdp-readabler-title-colors h1,
                body.mdp-readabler-title-colors h1 *,
                body.mdp-readabler-title-colors h2,
                body.mdp-readabler-title-colors h2 *,
                body.mdp-readabler-title-colors h3,
                body.mdp-readabler-title-colors h3 *,
                body.mdp-readabler-title-colors h4,
                body.mdp-readabler-title-colors h4 *,
                body.mdp-readabler-title-colors h5,
                body.mdp-readabler-title-colors h5 *,
                body.mdp-readabler-title-colors h6,
                body.mdp-readabler-title-colors h6 * {
                    color: ${color} !important;
                }
            `;

            document.head.appendChild( actionTitleColors.titleColorsStyle );

        }

    }

    /**
     * Background Colors.
     **/
    let actionBackgroundColors = {

        backgroundColorsStyle: document.createElement( 'style' ),

        /**
         * Initialise Background Colors action.
         **/
        init: function () {

            /** Listen for Background Colors change. */
            let backgroundColors = document.querySelector( '#mdp-readabler-action-background-colors' );
            backgroundColors.addEventListener( 'ReadablerPaletteChanged', actionBackgroundColors.backgroundColors );

        },

        /**
         * Change Background Color action.
         **/
        backgroundColors: function ( e ) {

            let color = e.detail.color;

            /** Remove class from body to reset Background colors to default state. */
            if ( null === color ) {

                /** Add class to body, to apply styles. */
                document.body.classList.remove( 'mdp-readabler-background-colors' );
                return;

            }

            /** Add class to body, to apply styles. */
            document.body.classList.add( 'mdp-readabler-background-colors' );

            /** Add CSS to header. */
            //language=CSS
            actionBackgroundColors.backgroundColorsStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-background-colors,
                body.mdp-readabler-background-colors h1,
                body.mdp-readabler-background-colors h1 span,
                body.mdp-readabler-background-colors h2,
                body.mdp-readabler-background-colors h2 span,
                body.mdp-readabler-background-colors h3,
                body.mdp-readabler-background-colors h3 span,
                body.mdp-readabler-background-colors h4,
                body.mdp-readabler-background-colors h4 span,
                body.mdp-readabler-background-colors h5,
                body.mdp-readabler-background-colors h5 span,
                body.mdp-readabler-background-colors h6,
                body.mdp-readabler-background-colors h6 span,

                body.mdp-readabler-background-colors p,
                body.mdp-readabler-background-colors a,
                body.mdp-readabler-background-colors li,
                body.mdp-readabler-background-colors label,
                body.mdp-readabler-background-colors input,
                body.mdp-readabler-background-colors select,
                body.mdp-readabler-background-colors textarea,
                body.mdp-readabler-background-colors legend,
                body.mdp-readabler-background-colors code,
                body.mdp-readabler-background-colors pre,
                body.mdp-readabler-background-colors dd,
                body.mdp-readabler-background-colors dt,
                body.mdp-readabler-background-colors span,
                body.mdp-readabler-background-colors blockquote {
                    background-color: ${color} !important;
                }
            `;

            document.head.appendChild( actionBackgroundColors.backgroundColorsStyle );

        }

    }

    /**
     * Mute Sounds.
     **/
    let actionMuteSounds = {

        /**
         * Initialise Mute Sounds action.
         **/
        init: function () {

            /** Listen for Mute Sounds change. */
            let muteSounds = document.querySelector( '#mdp-readabler-action-mute-sounds' );
            muteSounds.addEventListener( 'ReadablerToggleBoxChanged', actionMuteSounds.muteSounds );

        },

        /**
         * Toggle Mute Sounds.
         **/
        muteSounds: function ( e ) {

            /** Remove class from body to reset Low Saturation to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                /** UnMute all elements. */
                actionMuteSounds.mute( false );

                document.documentElement.classList.remove( 'mdp-readabler-mute-sounds' );

                return;

            }

            /** Mute all elements. */
            actionMuteSounds.mute( true );

            /** Add class to body as flag. */
            document.documentElement.classList.add( 'mdp-readabler-mute-sounds' );

        },

        /**
         * Mute/UnMute all elements.
         **/
        mute: function ( mute ) {

            /** Mute/UnMute all video and audio elements on the page. */
            document.querySelectorAll( 'video, audio' ).forEach( elem => {
                elem.muted = mute;
            } );

            /** Mute/UnMute YouTube and Vimeo. */
            document.querySelectorAll( 'iframe' ).forEach( elem => {

                if (
                    elem.src.toLowerCase().includes( 'youtube.com' ) ||
                    elem.src.toLowerCase().includes( 'vimeo.com' )
                ) {

                    let newSrc = new URL( elem.src );

                    /** Mute. */
                    if ( mute ) {

                        newSrc.searchParams.append( 'mute', '1' );
                        newSrc.searchParams.append( 'muted', '1' );

                    /** Unmute. */
                    } else {

                        newSrc.searchParams.delete( 'mute' );
                        newSrc.searchParams.delete( 'muted' );

                    }

                    elem.src = newSrc.href;

                }

            } );

        }

    }

    /**
     * Hide Images.
     **/
    let actionHideImages = {

        hideImagesStyle: document.createElement( 'style' ),

        /**
         * Initialise Hide Images action.
         **/
        init: function () {

            /** Listen for Hide Images change. */
            let hideImages = document.querySelector( '#mdp-readabler-action-hide-images' );
            hideImages.addEventListener( 'ReadablerToggleBoxChanged', actionHideImages.hideImages );

        },

        /**
         * Toggle Hide Images.
         **/
        hideImages: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-hide-images' );
                return;

            }

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-hide-images' );

            /** Add CSS to header. */
            //language=CSS
            actionHideImages.hideImagesStyle.innerHTML = `
                body.mdp-readabler-hide-images img,
                body.mdp-readabler-hide-images video {
                    opacity: 0 !important;
                    visibility: hidden !important
                }

                body.mdp-readabler-hide-images * {
                    background-image: none !important
                }

            `;

            document.head.appendChild( actionHideImages.hideImagesStyle );

        }

    }

    /**
     * Reading Guide.
     **/
    let actionReadingGuide = {

        readingGuideStyle: document.createElement( 'style' ),

        /** Reading Guide element. */
        readingGuideEl: null,

        /**
         * Initialise Reading Guide action.
         **/
        init: function () {

            /** Listen for Reading Guide change. */
            let readingGuide = document.querySelector( '#mdp-readabler-action-reading-guide' );
            readingGuide.addEventListener( 'ReadablerToggleBoxChanged', actionReadingGuide.readingGuide );

        },

        /**
         * Initialise Reading Guide action.
         **/
        readingGuide: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                /** Remove Reading Guide. */
                actionReadingGuide.removeReadingGuide();
                return;

            }

            /** Create Reading Guide element. */
            actionReadingGuide.createReadingGuide();

        },

        /**
         * Create Reading Guide on page.
         **/
        createReadingGuide: function () {

            /** Exit if reading guide already exist. */
            if ( document.querySelectorAll( '.mdp-readabler-reading-guide-element' ).length ) { return; }

            /** Add CSS for Reading Guide. */
            actionReadingGuide.addCSS();

            /** Create reading guide element. */
            actionReadingGuide.readingGuideEl = document.createElement( 'div' );
            actionReadingGuide.readingGuideEl.classList.add( 'mdp-readabler-reading-guide-element' );
            document.body.appendChild( actionReadingGuide.readingGuideEl );

            /** Listen mouse events. */
            document.addEventListener( 'mousemove', actionReadingGuide.moveReadingGuide );
            document.addEventListener( 'click', actionReadingGuide.moveReadingGuide );

        },

        /**
         * Move Reading Guide with mouse.
         **/
        moveReadingGuide: function ( e ) {

            let newPosX = e.clientX - ( Math.round( actionReadingGuide.readingGuideEl.clientWidth / 2 ) );
            let newPosY = e.clientY;

            actionReadingGuide.readingGuideEl.style.transform = "translate3d(" + newPosX + "px," + newPosY + "px,0px)";

        },

        /**
         * Remove Reading Guide on page.
         **/
        removeReadingGuide: function () {

            document.body.classList.remove( 'mdp-readabler-reading-guide' );

            /** Remove element from page. */
            actionReadingGuide.readingGuideEl.remove();

            /** Remove listeners for mouse events. */
            document.removeEventListener( 'mousemove', actionReadingGuide.moveReadingGuide );
            document.removeEventListener( 'click', actionReadingGuide.moveReadingGuide );

        },

        /**
         * Add CSS for Reading Guide.
         **/
        addCSS: function () {

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-reading-guide' );

            /** Add CSS to header. */
            //language=CSS
            actionReadingGuide.readingGuideStyle.innerHTML = `
                /*noinspection CssUnusedSymbol*/
                .mdp-readabler-reading-guide {
                    --readabler-reading-guide-width: ${options.readingGuideWidth}px;
                    --readabler-reading-guide-height: ${options.readingGuideHeight}px;
                    --readabler-reading-guide-radius: ${options.readingGuideBorderRadius}px;
                    --readabler-reading-guide-bg: ${options.readingGuideBackgroundColor};
                    --readabler-reading-guide-border-color: ${options.readingGuideBorderColor};
                    --readabler-reading-guide-border-width: ${options.readingGuideBorderWidth}px;
                    --readabler-reading-guide-arrow: ${options.readingGuideArrow}px;
                    --readabler-reading-guide-arrow-margin: ${0-options.readingGuideArrow}px;
                }
            `;
            document.head.appendChild( actionReadingGuide.readingGuideStyle );

        }

    }

    /**
     * Useful Links.
     **/
    let actionUsefulLinks = {

        /**
         * Useful Links select.
         **/
        select: document.getElementById( 'mdp-readabler-useful-links' ),

        /**
         * Initialise Useful Links action.
         **/
        init: function () {

            /** Build select. */
            actionUsefulLinks.buildSelect();

            /** Go to link on select change. */
            actionUsefulLinks.select.addEventListener('change', ( e ) => {

                // noinspection JSUnresolvedVariable
                window.location.href = e.target.value;

            } );

        },

        /**
         * Collect and filter all links on page
         **/
        grabLinks: function () {

            /** Grab links on page. */
            let x = document.querySelectorAll( 'a' );
            let links = []

            /** Add home link first. */
            links.push( [options.HOME, window.location.origin] );
            for ( let i = 0; i < x.length; i++ ) {

                /** Get text from link. */
                let text = x[i].innerText;
                text = text.replace( /\s+/g, ' ' ).trim();
                if ( '' === text ) { continue; }
                text = text.substring( 0, 42 ); // Trim long text.

                /** Get link. */
                let link = x[i].href;
                link = link.trim(); // remove spaces
                link = link.replace(/#$/, ""); // remove trailing hash
                link = link.replace(/\/$/, ""); // remove trailing slash
                if ( '' === link ) { continue; } // Skip empty links.
                if ( '#' === link ) { continue; } // Skip # links.
                if ( link.toLowerCase().startsWith( 'javascript:' ) ) { continue; } // Skip javascript processed links.

                /** Check for duplicates. */
                if ( links.some( function( item ) {
                    return item[1] === link;
                } ) ) {
                    continue;
                }

                links.push( [text, link] );

            }

            return  links;

        },

        /**
         * Build Useful links select.
         * Add options to select.
         **/
        buildSelect: function () {

            /** Collect all links. */
            let links = actionUsefulLinks.grabLinks();

            /** Add links to select. */
            for ( let i = 0; i < links.length; i++ ) {

                let optionEl = document.createElement( 'option' );
                optionEl.textContent = links[i][0];
                optionEl.value = links[i][1];

                actionUsefulLinks.select.appendChild( optionEl );

            }

        }

    }

    /**
     * Stop Animations.
     **/
    let actionStopAnimations = {

        stopAnimationsStyle: document.createElement( 'style' ),

        /**
         * Initialise Stop Animations action.
         **/
        init: function () {

            /** Listen for Stop Animations change. */
            let stopAnimations = document.querySelector( '#mdp-readabler-action-stop-animations' );
            stopAnimations.addEventListener( 'ReadablerToggleBoxChanged', actionStopAnimations.stopAnimations );

        },

        /**
         * Toggle Animations.
         **/
        stopAnimations: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-stop-animations' );

                /** Play all videos. */
                document.querySelectorAll('video').forEach(vid => {

                    if ( vid.paused === true ) {

                        if ( vid.dataset.pausedByReadabler === 'true' ) {

                            vid.play();
                            vid.dataset.pausedByReadabler = 'false';

                        }

                    }

                } );

                return;

            }

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-stop-animations' );

            /** Add CSS to header. */
            //language=CSS
            actionStopAnimations.stopAnimationsStyle.innerHTML = `

                /*noinspection CssUnusedSymbol,CssUnknownProperty*/
                body.mdp-readabler-stop-animations *{
                    -webkit-transition: none !important;
                    -moz-transition: none !important;
                    -ms-transition: none !important;
                    -o-transition: none !important;
                    transition: none !important;
                    -webkit-animation-fill-mode: forwards !important;
                    -moz-animation-fill-mode: forwards !important;
                    -ms-animation-fill-mode: forwards !important;
                    -o-animation-fill-mode: forwards !important;
                    animation-fill-mode: forwards !important;
                    -webkit-animation-iteration-count: 1 !important;
                    -moz-animation-iteration-count: 1 !important;
                    -ms-animation-iteration-count: 1 !important;
                    -o-animation-iteration-count: 1 !important;
                    animation-iteration-count: 1 !important;
                    -webkit-animation-duration: .01s !important;
                    -moz-animation-duration: .01s !important;
                    -ms-animation-duration: .01s !important;
                    -o-animation-duration: .01s !important;
                    animation-duration: .01s !important;
                }

            `;

            document.head.appendChild( actionStopAnimations.stopAnimationsStyle );

            /** Pause all videos from video tag. */
            document.querySelectorAll( 'video' ).forEach( vid => {

                // Pause video if it played now
                if ( vid.paused === false ) {

                    vid.pause();
                    vid.dataset.pausedByReadabler = 'true';

                }

            } );

            /** Stop all youtube videos */
            document.querySelectorAll( 'iframe' ).forEach( iframe => {

                if ( iframe.dataset.pausedByReadabler === 'undefined' ) {

                    iframe.dataset.pausedByReadabler = 'true';

                } else {

                    setTimeout( function () {

                        let iframeSrc = iframe.src;

                        if ( iframeSrc.includes( 'www.youtube.com/embed' ) ){

                            iframe.src = iframeSrc;
                            iframe.dataset.pausedByReadabler = 'true';

                        }

                    }, 300 );

                }

            } );

        }

    }

    /**
     * Reading Mask.
     **/
    let actionReadingMask = {

        readingMaskStyle: document.createElement( 'style' ),

        /** Reading Mask top element. */
        readingMaskTop: null,

        /** Reading Mask bottom element. */
        readingMaskBottom: null,

        /**
         * Initialise Reading Mask action.
         **/
        init: function () {

            /** Listen for Reading Mask change. */
            let readingMask = document.querySelector( '#mdp-readabler-action-reading-mask' );
            readingMask.addEventListener( 'ReadablerToggleBoxChanged', actionReadingMask.readingMask );

        },

        /**
         * Toggle Reading Mask.
         **/
        readingMask: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                /** Remove Reading Mask. */
                actionReadingMask.removeReadingMask();
                return;

            }

            /** Create Reading Mask elements. */
            actionReadingMask.createReadingMask();

        },

        /**
         * Create Reading Mask on page.
         **/
        createReadingMask: function () {

            /** Exit if reading mask already exist. */
            if ( document.querySelectorAll( '.mdp-readabler-reading-mask-top' ).length ) { return; }

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-reading-mask' );

            /** Create reading mask top element. */
            actionReadingMask.readingMaskTop = document.createElement( 'div' );
            actionReadingMask.readingMaskTop.classList.add( 'mdp-readabler-reading-mask-top' );
            document.body.appendChild( actionReadingMask.readingMaskTop );

            /** Create reading mask bottom element. */
            actionReadingMask.readingMaskBottom = document.createElement( 'div' );
            actionReadingMask.readingMaskBottom.classList.add( 'mdp-readabler-reading-mask-bottom' );
            document.body.appendChild( actionReadingMask.readingMaskBottom );

            /** Listen mouse events. */
            document.addEventListener( 'mousemove', actionReadingMask.moveReadingMask );

        },

        /**
         * Move Reading Mask with mouse.
         **/
        moveReadingMask: function ( e ) {

            let newPosY = e.clientY;
            let delta = Math.round( options.readingMaskHeight / 2 );

            actionReadingMask.readingMaskTop.style.height = `${ newPosY - delta }px`;
            actionReadingMask.readingMaskBottom.style.top = `${ newPosY + delta }px`;

        },

        /**
         * Remove Reading Mask on page.
         **/
        removeReadingMask: function () {

            /** Remove flag-class */
            document.body.classList.remove( 'mdp-readabler-reading-mask' );

            /** Remove elements from page. */
            actionReadingMask.readingMaskTop.remove();
            actionReadingMask.readingMaskBottom.remove();

            /** Remove listeners for mouse events. */
            document.removeEventListener( 'mousemove', actionReadingMask.moveReadingMask );

        },

    }

    /**
     * Highlight Hover.
     **/
    let actionHighlightHover = {

        highlightHoverStyle: document.createElement( 'style' ),

        /**
         * Initialise Highlight Hover action.
         **/
        init: function () {

            /** Listen for Highlight Hover change. */
            let highlightHover = document.querySelector( '#mdp-readabler-action-highlight-hover' );
            highlightHover.addEventListener( 'ReadablerToggleBoxChanged', actionHighlightHover.highlightHover );

        },

        highlightHover: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-highlight-hover' );
                return;

            }

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-highlight-hover' );

            /** Add CSS to header. */
            //language=CSS
            actionHighlightHover.highlightHoverStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-highlight-hover *:hover {
                    outline-style: ${options.highlightHoverStyle} !important;
                    outline-color: ${options.highlightHoverColor} !important;
                    outline-width: ${options.highlightHoverWidth}px !important;
                    outline-offset: ${options.highlightHoverOffset}px !important;
                }
                
            `;

            document.head.appendChild( actionHighlightHover.highlightHoverStyle );

        }

    }

    /**
     * Highlight Focus.
     **/
    let actionHighlightFocus = {

        highlightFocusStyle: document.createElement( 'style' ),

        /**
         * Initialise Highlight Focus action.
         **/
        init: function () {

            /** Listen for Highlight Focus change. */
            let highlightFocus = document.querySelector( '#mdp-readabler-action-highlight-focus' );
            highlightFocus.addEventListener( 'ReadablerToggleBoxChanged', actionHighlightFocus.highlightFocus );

        },

        highlightFocus: function ( e ) {

            /** Remove class from body to reset to default state. */
            if ( ! e.target.classList.contains( 'mdp-active' ) ) {

                document.body.classList.remove( 'mdp-readabler-highlight-focus' );
                return;

            }

            /** Add class to body as flag. */
            document.body.classList.add( 'mdp-readabler-highlight-focus' );

            /** Add CSS to header. */
            //language=CSS
            actionHighlightFocus.highlightFocusStyle.innerHTML = `

                /*noinspection CssUnusedSymbol*/
                body.mdp-readabler-highlight-focus *:focus {
                    outline-style: ${options.highlightFocusStyle} !important;
                    outline-color: ${options.highlightFocusColor} !important;
                    outline-width: ${options.highlightFocusWidth}px !important;
                    outline-offset: ${options.highlightFocusOffset}px !important;
                }
                
            `;

            document.head.appendChild( actionHighlightFocus.highlightFocusStyle );

        }

    }



    /**
     * Accessibility Statement.
     **/
    let actionAccessibilityStatement = {

        /**
         * Initialise Accessibility Statement action.
         **/
        init: function () {

            // Exit if link is disabled
            if ( null === document.getElementById( 'mdp-readabler-statement-btn' ) ) { return; }

            /** Listen for show statement button click. */
            let btn = document.getElementById( 'mdp-readabler-statement-btn' );
            btn.addEventListener( 'click', actionAccessibilityStatement.show );

            let closeBtn = document.getElementById( 'mdp-readabler-close-statement-btn' );
            closeBtn.addEventListener( 'click', actionAccessibilityStatement.close );

        },

        show: function ( e ) {

            e.preventDefault();

            let box = document.getElementById( 'mdp-readabler-accessibility-statement-box' );
            box.classList.add( 'mdp-open' );

        },

        close: function ( e ) {

            e.preventDefault();

            let box = document.getElementById( 'mdp-readabler-accessibility-statement-box' );
            box.classList.remove( 'mdp-open' );

        }

    }

    /**
     * Reset Settings.
     **/
    let actionResetSettings = {

        /**
         * Initialise Reset Settings action.
         **/
        init: function () {

            /** Listen for Reset Settings button click. */
            let btn = document.getElementById( 'mdp-readabler-reset-btn' );

            if ( btn ) {
                btn.addEventListener( 'click', actionResetSettings.reset );
            }

        },

        reset: function ( e ) {

            e.preventDefault();

            /** Get all keys in localStorage. */
            let keys = Object.keys( localStorage );

            /** Remove all items which starts with 'mdpReadabler' */
            for ( const key in keys ) {

                if ( keys[key].toString().startsWith( 'mdpReadabler' ) ) {
                    localStorage.removeItem( keys[key] );
                }

            }

            /** Reload page to reset all. */
            location.reload();

        }

    }

    /**
     * Hide Accessibility.
     **/
    let actionHideAccessibility = {

        /**
         * Initialise Hide Accessibility action.
         **/
        init: function () {

            /** Listen for Hide button click. */
            let btn = document.getElementById( 'mdp-readabler-hide-btn' );

            if ( btn ) {

                btn.addEventListener( 'click', actionHideAccessibility.hide );

            }

        },

        hide: function ( e ) {

            e.preventDefault();

            if ( window.confirm( options.HIDE_ACCESSIBILITY_INTERFACE ) ) {

                actionHideAccessibility.writeCookie( 'mdp-readabler-hide', '1', 365 );

                /** Reload page to hide interface. */
                window.location.reload();

            }

        },

        writeCookie: function ( key, value, days ) {

            let date = new Date();

            /** Default at 365 days. */
            days = days || 365;

            /** Get unix milliseconds at current time plus number of days. */
            date.setTime( +date + (days * 86400000) ); // 24 * 60 * 60 * 1000

            // noinspection JSUnresolvedFunction
            window.document.cookie = key + "=" + value + "; expires=" + date.toGMTString() + "; path=/";

            return value;

        },

    }

    /**
     * Add Readabler events.
     **/
    function __construct( wpOptions ) {

        /** Stop and remove markup if mdp-readabler-hide cookie is found */
        if ( window.document.cookie.indexOf( 'mdp-readabler-hide=1' ) > -1 ) {

            const toHidePopup = document.querySelector( '#mdp-readabler-popup-box' );
            const toHideButton = document.querySelector( '#mdp-readabler-trigger-button' );

            if ( toHidePopup ) { toHidePopup.remove(); }
            if ( toHideButton ) { toHideButton.remove(); }

            return;
        }

        /** Readabler plugin settings. */
        options = wpOptions;

        /**
         * Fires when the initial HTML document has been completely loaded and parsed.
         **/
        document.readyState === 'loading' ?
            document.addEventListener( 'DOMContentLoaded', startReadabler ) : startReadabler();

    }

    /**
     * Bind all action and start Readabler
     */
    function startReadabler() {

        // Remove display:none after page load.
        const popupBox = document.querySelector( '#mdp-readabler-popup-box' );
        if ( popupBox ) {
            popupBox.removeAttribute( 'style' );
        }

        /** Initialise popup on page load. */
        (0,_includes_popup_popup_helper__WEBPACK_IMPORTED_MODULE_18__.popupHelper)( options );

        /** Enable hotkey functionality. */
        (0,_includes_hotkeys_hotKeys__WEBPACK_IMPORTED_MODULE_19__.hotKeys)( options );

        /** Initialise Input Spinner controls. */
        _includes_utilities_inputSpinner__WEBPACK_IMPORTED_MODULE_11__.inputSpinner.init();

        /** Initialise Toggle controls. */
        _includes_interface_toggleBox__WEBPACK_IMPORTED_MODULE_9__.toggleBox.init();

        /** Initialise Palette controls. */
        _includes_utilities_paletteBox__WEBPACK_IMPORTED_MODULE_12__.paletteBox.init();

        /** Initialise Accessibility Statement. */
        actionAccessibilityStatement.init();

        /** Initialise Reset Button. */
        actionResetSettings.init();

        /** Initialise Hide Accessibility Button. */
        actionHideAccessibility.init();

        /** Online Dictionary. */
        if ( options.onlineDictionary ) {
            onlineDictionary.init();
        }

        /** Accessibility Profiles. */
        accessibilityProfiles.init();

        /** Initialise Content Scaling action. */
        if ( options.contentScaling ) {
            actionContentScaling.init();
        }

        /** Initialise Font Sizing action. */
        if ( options.fontSizing ) {
            _includes_text_actionFontSizing__WEBPACK_IMPORTED_MODULE_13__.actionFontSizing.init();
        }

        /** Initialise Line Height action. */
        if ( options.lineHeight ) {
            _includes_text_actionLineHeight__WEBPACK_IMPORTED_MODULE_14__.actionLineHeight.init();
        }

        /** Initialise Letter Spacing action. */
        if ( options.letterSpacing ) {
            _includes_text_actionLetterSpacing__WEBPACK_IMPORTED_MODULE_15__.actionLetterSpacing.init();
        }

        /** Initialise Readable Font action. */
        if (
            options.readableFont ||
            options.profileVisuallyImpaired ||
            options.profileBlindUsers
        ) {
            actionReadableFont.init();
        }

        /** Initialise Dyslexia Friendly action. */
        if ( options.dyslexiaFont ) {
            actionDyslexiaFriendly.init();
        }

        /** Initialise Highlight Titles action. */
        if (
            options.highlightTitles ||
            options.profileCognitiveDisability
        ) {
            actionHighlightTitles.init();
        }

        /** Initialise Highlight Links action. */
        if (
            options.highlightLinks ||
            options.profileCognitiveDisability
        ) {
            actionHighlightLinks.init();
        }

        /** Initialise Text Magnifier action. */
        if ( options.textMagnifier ) {
            actionTextMagnifier.init();
        }

        /** Initialise Text Align Center action. */
        if ( options.alignCenter ) {
            actionAlignCenter.init();
        }

        /** Initialise Text Align Left action. */
        if ( options.alignLeft ) {
            actionAlignLeft.init();
        }

        /** Initialise Text Align Right action. */
        if ( options.alignRight ) {
            actionAlignRight.init();
        }

        /** Initialise Dark Contrast action. */
        if ( options.darkContrast ) {
            _includes_contrast_actionDarkContrast__WEBPACK_IMPORTED_MODULE_3__.actionDarkContrast.init();
        }

        /** Initialise Light Contrast action. */
        if ( options.lightContrast ) {
            _includes_contrast_actionLightContrast__WEBPACK_IMPORTED_MODULE_4__.actionLightContrast.init();
        }

        /** Initialise Monochrome action. */
        if ( options.monochrome ) {
            _includes_contrast_actionMonochrome__WEBPACK_IMPORTED_MODULE_7__.actionMonochrome.init();
        }

        /** Initialise High Saturation action. */
        if (
            options.highSaturation ||
            options.profileVisuallyImpaired ||
            options.profileAdhdFriendly
        ) {
            _includes_saturation_actionHighSaturation__WEBPACK_IMPORTED_MODULE_5__.actionHighSaturation.init();
        }

        /** Initialise High Contrast action. */
        if ( options.highContrast ) {
            _includes_contrast_actionHighContrast__WEBPACK_IMPORTED_MODULE_10__.actionHighContrast.init();
        }

        /** Initialise Low Saturation action. */
        if (
            options.lowSaturation ||
            options.profileEpilepsy
        ) {
            _includes_saturation_actionLowSaturation__WEBPACK_IMPORTED_MODULE_6__.actionLowSaturation.init();
        }

        /** Initialise Text Colors action. */
        if ( options.textColors ) {
            actionTextColors.init();
        }

        /** Initialise Title Colors action. */
        if ( options.titleColors ) {
            actionTitleColors.init();
        }

        /** Initialise Background Colors action. */
        if ( options.backgroundColors ) {
            actionBackgroundColors.init();
        }

        /** Initialise Mute Sounds action. */
        if ( options.muteSounds ) {
            actionMuteSounds.init();
        }

        /** Initialise Hide Images action. */
        if ( options.hideImages ) {
            actionHideImages.init();
        }

        /** Initialise Virtual Keyboard action. */
        if (
            options.virtualKeyboard ||
            options.profileBlindUsers
        ) {
            _actions_actionVirtualKeyboard__WEBPACK_IMPORTED_MODULE_21__.actionVirtualKeyboard.init();
        }

        /** Initialise Reading Guide action. */
        if ( options.readingGuide ) {
            actionReadingGuide.init();
        }

        /** Initialise Useful Links action. */
        if ( options.usefulLinks ) {
            actionUsefulLinks.init();
        }

        /** Initialise Stop Animations action. */
        if (
            options.stopAnimations ||
            options.profileEpilepsy ||
            options.profileCognitiveDisability ||
            options.profileAdhdFriendly
        ) {
            actionStopAnimations.init();
        }

        /** Initialise Reading Mask action. */
        if (
            options.readingMask ||
            options.profileAdhdFriendly
        ) {
            actionReadingMask.init();
        }

        /** Initialise Highlight Hover action. */
        if ( options.highlightHover ) {
            actionHighlightHover.init();
        }

        /** Initialise Highlight Focus action. */
        if ( options.highlightFocus ) {
            actionHighlightFocus.init();
        }

        /** Initialise Big Black Cursor action. */
        if ( options.bigBlackCursor ) {
            _includes_big_cursor_actionBigBlackCursor__WEBPACK_IMPORTED_MODULE_1__.actionBigBlackCursor.init();
        }

        /** Initialise Big White Cursor action. */
        if ( options.bigWhiteCursor ) {
            _includes_big_cursor_actionBigWhiteCursor__WEBPACK_IMPORTED_MODULE_2__.actionBigWhiteCursor.init();
        }

        /** Initialise Cognitive Reading action. */
        if ( options.cognitiveReading ) {
            _includes_text_actionCognitiveReading__WEBPACK_IMPORTED_MODULE_16__.actionCognitiveReading.init();
        }

        /** Initialise Text To Speech action. */
        if (
            options.textToSpeech ||
            options.profileBlindUsers
        ) {
            _includes_text_to_speech_action__WEBPACK_IMPORTED_MODULE_0__.actionTextToSpeech.init();
        }

        /** Initialise Keyboard Navigation action. */
        if (
            options.keyboardNavigation ||
            options.profileBlindUsers
        ) {
            _actions_actionKeyboardNavigation__WEBPACK_IMPORTED_MODULE_20__.actionKeyboardNavigation.init();
        }

        /** Initialise Voice Navigation action. */
        if ( options.voiceNavigation ) {
            _includes_voice_navigation_actionVoiceNavigation__WEBPACK_IMPORTED_MODULE_17__.actionVoiceNavigation.init();
        }

        /** Load saved settings if at least one setting sis available */
        if ( haveSavedSettings() ) {

            /** Load values from local storage for Toggle boxes. */
            _includes_interface_toggleBox__WEBPACK_IMPORTED_MODULE_9__.toggleBox.loadSaved();

            /** Load values from local storage for Spinner boxes. */
            _includes_utilities_inputSpinner__WEBPACK_IMPORTED_MODULE_11__.inputSpinner.loadSaved();

            /** Load values from local storage for Palette boxes. */
            _includes_utilities_paletteBox__WEBPACK_IMPORTED_MODULE_12__.paletteBox.loadSaved();

            /** Load profile from local storage. */
            accessibilityProfiles.loadSaved();

            /** Add load-saved event */
            (0,_analytics_cache__WEBPACK_IMPORTED_MODULE_23__.setCache)( {
                id: 'load_saved',
                value: 1
            } );

        }

        /** Initialize start configuration */
        startConfiguration.init();

        /** Run Analytics */
        if ( options.analytics === 'on' ) {
            new _analytics_analytics__WEBPACK_IMPORTED_MODULE_22__.Analytics();
        }

    }

    /**
     * Convert phrase to TitleCase.
     *
     * @param phrase
     * @param separator
     *
     * @return {string}
     **/
    function toTitleCase ( phrase, separator = ' ' ) {

        return phrase
            .toLowerCase()
            .split( separator )
            .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
            .join( separator );

    }

    /**
     *
     * @param phrase
     * @param separator
     * @param prefix
     * @param suffix
     * @returns {*}
     */
    function toCamelCase( phrase, separator = '_', prefix = '', suffix = '' ) {

        let camelCaseString = '';

        phrase = prefix + separator + phrase + separator + suffix;
        phrase.toLowerCase().split( separator ).forEach( ( word, index ) => {

            camelCaseString += index === 0 ? word.toLowerCase() : ( word.charAt( 0 ).toUpperCase() + word.slice( 1 ) );

        } );

        return camelCaseString;

    }

    /**
     * Find readabler saved settings in the localStorage
     * @returns {boolean}
     */
    function haveSavedSettings() {

        const localStorageKeys = Object.keys( localStorage );
        if ( typeof localStorageKeys !== 'object' ) { return false; }

        return localStorageKeys.some( key => {

            if ( key.includes( 'mdpReadabler' ) ) { return true; }

        } );

    }

    /**
     * Executing a function after delay for a specified amount of time.
     * Example: the user has stopped typing.
     **/
    function delay( fn, ms ) {

        let timer = 0

        return function ( ...args ) {

            clearTimeout( timer )

            timer = setTimeout( fn.bind( this, ...args ), ms || 0 )

        }

    }

    return {

        /**
         * Run Readabler.
         **/
        run: function( options ) {

            __construct( options );

        }

    };

} ) ();

/**
 * Run Readabler on current page.
 *
 * @param window
 * @param window.mdpReadablerOptions
 **/
mdpReadabler.run( window.mdpReadablerOptions );

})();

/******/ })()
;