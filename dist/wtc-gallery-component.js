"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wtcUtilityHelpers = _interopRequireDefault(require("wtc-utility-helpers"));

var _wtcUtilityPreloader = _interopRequireDefault(require("wtc-utility-preloader"));

var _wtcControllerElement = _interopRequireWildcard(require("wtc-controller-element"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Gallery =
/*#__PURE__*/
function (_ElementController) {
  _inherits(Gallery, _ElementController);

  /**
   * The Gallery Class constructor
   * @param {HTMLElement} element - the container element which the gallery will live in
   * @param {Object} options - optional gallery behavior
   * @param {(boolean|string)} options.nav - adds next and previous navigation buttons
   * @param {(boolean|string)} options.autoplay - auto-advances the gallery
   * @param {number} options.delay - duration (in miliseconds) between gallery transitions
   * @param {(boolean|string)} options.pauseOnHover - pauses autoplay behvior when mouse/touch enters the gallery area
   * @param {(boolean|string)} options.draggable - adds basic click-and-drag/swipe functionality to transition between gallery items
   * @param {number} options.dragThreshold - minimum distance (in pixels) for a "drag" action to occur
   * @param {(boolean|string)} options.pagination - creates a barebones navigation list of gallery items
   * @param {?HTMLElement} options.paginationTarget - creates a navigation list of gallery items based on the element specified.
   * @param {function} options.onLoad - function to run once the gallery is loaded
   * @param {function} options.onWillChange - function to run before a gallery transition occurs
   * @param {function} options.onHasChanged - function to run after a gallery transition occurs
   */
  function Gallery(element) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Gallery);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Gallery).call(this, element));
    _this.options = {
      nav: _this.element.getAttribute('data-nav') == 'true' ? true : false,
      debug: _this.element.getAttribute('data-debug') == 'true' ? true : false,
      autoplay: _this.element.getAttribute('data-autoplay') == 'true' ? true : false,
      delay: parseInt(_this.element.getAttribute('data-delay')) > 0 ? parseInt(_this.element.getAttribute('data-delay')) : 5000,
      pauseOnHover: _this.element.getAttribute('data-pause-on-hover') == 'true' ? true : false,
      draggable: _this.element.getAttribute('data-draggable') == 'true' ? true : false,
      dragThreshold: parseInt(_this.element.getAttribute('data-drag-threshold')) > 0 ? parseInt(_this.element.getAttribute('data-drag-threshold')) : 40,
      pagination: _this.element.getAttribute('data-pagination') == 'true' ? true : false,
      paginationTarget: _this.element.getAttribute('data-pagination-target') && _this.element.getAttribute('data-pagination-target').length > 1 ? _this.element.getAttribute('data-pagination-target') : null,
      onLoad: null,
      onWillChange: null,
      onHasChanged: null
    };

    if (options) {
      _this.options = _wtcUtilityHelpers["default"].extend(_this.options, options);
    }

    _this.wrapper = _this.element.querySelector('ul');
    _this.items = _this.wrapper.children;
    _this.overlay = document.createElement('div');
    _this.currentItem = _this.items[0];
    _this.currentIndex = 0; // If nav is set to true, create buttons

    if (_this.options.nav) {
      _this.nextBtn = document.createElement('button');
      _this.nextBtn.innerHTML = 'Next <span class="visually-hidden">carousel item.</span>';
      _this.prevBtn = document.createElement('button');
      _this.prevBtn.innerHTML = 'Previous <span class="visually-hidden">carousel item.</span>';

      _wtcUtilityHelpers["default"].addClass('gallery__nav gallery__nav-next', _this.nextBtn);

      _wtcUtilityHelpers["default"].addClass('gallery__nav gallery__nav-prev', _this.prevBtn);

      _this.nextBtn.addEventListener('click', _this.next.bind(_assertThisInitialized(_this)));

      _this.prevBtn.addEventListener('click', _this.prev.bind(_assertThisInitialized(_this)));

      _this.element.appendChild(_this.nextBtn);

      _this.element.appendChild(_this.prevBtn);
    } // If pagination is set to true, set up the item list


    if (_this.options.pagination) {
      var itemList; // if a nodeList was provided, use it.
      // otherwise, build a generic list of buttons

      if (_this.options.paginationTarget) {
        itemList = document.querySelector(_this.options.paginationTarget);
        var items = itemList.children;

        _wtcUtilityHelpers["default"].forEachNode(items, function (index, el) {
          el.classList.add('gallery__pagination-item');
          if (!el.dataset.index) el.dataset.index = index;
          if (index === 0) el.classList.add('is-active');
          el.addEventListener('click', _this.handlePagination.bind(_assertThisInitialized(_this)));
        });
      } else {
        itemList = document.createElement('ul');

        _wtcUtilityHelpers["default"].forEachNode(_this.items, function (index) {
          var item = document.createElement('li'),
              itemBtn = document.createElement('button'),
              itemBtnContent = document.createTextNode(index);

          _wtcUtilityHelpers["default"].addClass('gallery__pagination-item', item);

          item.dataset.index = index;
          if (index === 0) item.classList.add('is-active');
          item.addEventListener('click', _this.handlePagination.bind(_assertThisInitialized(_this)));
          itemBtn.appendChild(itemBtnContent);
          item.appendChild(itemBtn);
          itemList.appendChild(item);
        });

        _this.element.appendChild(itemList);
      }

      _this.paginationList = itemList;
      _this.paginationItems = itemList.children;
      itemList.classList.add('gallery__pagination');
    } // create live region for screen-reader to announce slide changes


    _this.liveRegion = document.createElement('div');

    _this.liveRegion.setAttribute('aria-live', 'polite');

    _wtcUtilityHelpers["default"].addClass('visually-hidden', _this.liveRegion);

    _this.element.appendChild(_this.liveRegion); // Add pause-on-hover pointer events. Including a fallback to mouse events.


    if (_this.options.pauseOnHover) {
      if (window.PointerEvent) {
        element.addEventListener('pointerover', _this.pause.bind(_assertThisInitialized(_this)), false);
        element.addEventListener('pointerout', _this.resume.bind(_assertThisInitialized(_this)), false);
      } else {
        element.addEventListener('mouseenter', _this.pause.bind(_assertThisInitialized(_this)), false);
        element.addEventListener('mouseleave', _this.resume.bind(_assertThisInitialized(_this)), false);
      }
    } // Add "draggable" events


    if (_this.options.draggable) {
      _this.dragStartX = null;
      element.addEventListener('mousedown', _this.draggablePointerDown.bind(_assertThisInitialized(_this)), false);
      element.addEventListener('touchstart', _this.draggablePointerDown.bind(_assertThisInitialized(_this)), false);
      element.addEventListener('mouseup', _this.draggablePointerUp.bind(_assertThisInitialized(_this)), false);
      element.addEventListener('touchend', _this.draggablePointerUp.bind(_assertThisInitialized(_this)), false);
    } // add base classes


    _wtcUtilityHelpers["default"].addClass('gallery', _this.element);

    _wtcUtilityHelpers["default"].addClass('gallery__overlay', _this.overlay);

    _wtcUtilityHelpers["default"].addClass('gallery__wrapper', _this.wrapper);

    _wtcUtilityHelpers["default"].forEachNode(_this.items, function (index, item) {
      if (_this.currentIndex !== index) item.setAttribute('aria-hidden', 'true');

      _wtcUtilityHelpers["default"].addClass('gallery__item', item);

      item.dataset.index = index;
      item.setAttribute('tabindex', -1);
      item.addEventListener('transitionend', _this.itemTransitioned.bind(_assertThisInitialized(_this), item));
    }); // add state classes


    _wtcUtilityHelpers["default"].addClass('is-active', _this.currentItem);

    _wtcUtilityHelpers["default"].addClass('is-loading', _this.element); // append main element


    _this.element.appendChild(_this.overlay); // preload images if any


    var images = _this.wrapper.querySelectorAll('img');

    if (images.length > 0) {
      var preloader = new _wtcUtilityPreloader["default"]({
        debug: _this.options.debug
      });

      _wtcUtilityHelpers["default"].forEachNode(images, function (index, item) {
        preloader.add(item.getAttribute('src'), 'image');
      });

      preloader.load(_this.loaded.bind(_assertThisInitialized(_this)));
    } else {
      _this.loaded();
    }

    return _this;
  }
  /**
   * Advances gallery to the index of the selected pagination item.
   * @param {Object} e - the event object
   */


  _createClass(Gallery, [{
    key: "handlePagination",
    value: function handlePagination(e) {
      var target = e.target.closest('.gallery__pagination-item');

      if (target) {
        var i = +target.dataset.index;

        _wtcUtilityHelpers["default"].forEachNode(this.paginationList.children, function (index, item) {
          if (i === index) _wtcUtilityHelpers["default"].addClass('is-active', item);else _wtcUtilityHelpers["default"].removeClass('is-active', item);
        });

        this.moveByIndex(i); // shift focus to active item. note this should only happen on pagination click,
        // not on next/prev click https://www.w3.org/WAI/tutorials/carousels/functionality/#announce-the-current-item

        this.currentItem.focus();
      }
    }
    /**
     * Stores the x-position of mouse/touch input
     * @param {Object} e - the event object
     */

  }, {
    key: "draggablePointerDown",
    value: function draggablePointerDown(e) {
      if (e.target.closest('button')) {
        return;
      } else {
        e.preventDefault();
        var xPos = e.clientX || e.touches['0'].clientX;
        this.dragStartX = xPos;
      }
    }
    /**
     * Advance gallery if drag distance meets or exceeds the established threshold.
     * @param {Object} e - the event object
     */

  }, {
    key: "draggablePointerUp",
    value: function draggablePointerUp(e) {
      if (e.target.closest('button')) {
        return;
      } else {
        e.preventDefault();
        var xPos = e.clientX || e.changedTouches['0'].clientX;

        if (Math.abs(xPos - this.dragStartX) > this.options.dragThreshold) {
          if (xPos > this.dragStartX) {
            this.prev();
          } else {
            this.next();
          }
        }
      }
    }
    /**
     * Adjust main wrapper height.
     * @return {class} This
     */

  }, {
    key: "resize",
    value: function resize() {
      var newH = 0;

      _wtcUtilityHelpers["default"].forEachNode(this.items, function (index, item) {
        var h = item.offsetHeight;

        if (h > newH) {
          newH = h;
        }
      });

      this.wrapper.style.height = "".concat(newH, "px");
      return this;
    }
    /**
     * Removes loading classes and starts autoplay.
     * @return {class} This
     */

  }, {
    key: "loaded",
    value: function loaded() {
      window.addEventListener('resize', this.resize.bind(this));
      this.resize();

      _wtcUtilityHelpers["default"].removeClass('is-loading', this.element);

      _wtcUtilityHelpers["default"].addClass('is-loaded', this.element);

      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      }

      if (typeof this.onLoad == "function") {
        return this.onLoad(this);
      }

      return this;
    }
    /**
     * Helper method to remove CSS transition classes
     * @param {DOMNode} item - Gallery item.
     * @return {class} This.
     */

  }, {
    key: "itemTransitioned",
    value: function itemTransitioned(item) {
      _wtcUtilityHelpers["default"].removeClass('is-transitioning is-transitioning--center is-transitioning--backward is-transitioning--forward', item);

      return this;
    }
    /**
     * Changes active item based on its index, starts at 0
     * @param {number} index
     * @return {class} This
     */

  }, {
    key: "moveByIndex",
    value: function moveByIndex(index) {
      var next = this.items[index];

      if (this.options.autoplay) {
        clearTimeout(this.player);
      }

      if (!next) {
        console.warn('No item with index: ' + index);
        return;
      }

      if (this.currentItem != next) {
        _wtcUtilityHelpers["default"].addClass('is-active is-transitioning is-transitioning--center', next);

        _wtcUtilityHelpers["default"].removeClass('is-active', this.currentItem);

        this.currentItem.setAttribute('aria-hidden', 'true');
        next.removeAttribute('aria-hidden');
      }

      if (this.options.pagination) {
        _wtcUtilityHelpers["default"].forEachNode(this.paginationItems, function (counter, item) {
          if (item.dataset.index == index) {
            _wtcUtilityHelpers["default"].addClass('is-active', item);
          } else {
            _wtcUtilityHelpers["default"].removeClass('is-active', item);
          }
        });
      }

      if (typeof this.options.onHasChanged == "function") {
        this.options.onHasChanged(next, this.currentItem);
      }

      this.liveRegion.innerHTML = "Active carousel item: ".concat(index + 1, " of ").concat(this.items.length, ".");
      this.currentItem = next;
      this.currentIndex = index;

      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      }

      return this;
    }
    /**
     * Changes active item
     * @param {boolean} direction - True = forwards. False = backwards
     * @return {class} This
     */

  }, {
    key: "move",
    value: function move() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.options.autoplay) {
        clearTimeout(this.player);
      }

      var next = direction ? this.currentItem.nextElementSibling : this.currentItem.previousElementSibling;

      if (!next) {
        next = direction ? this.items[0] : this.items[this.items.length - 1];
      }

      _wtcUtilityHelpers["default"].addClass('is-active is-transitioning is-transitioning--center', next);

      _wtcUtilityHelpers["default"].removeClass('is-active', this.currentItem);

      this.currentItem.setAttribute('aria-hidden', 'true');
      next.removeAttribute('aria-hidden');

      if (this.options.pagination) {
        _wtcUtilityHelpers["default"].forEachNode(this.paginationItems, function (index, item) {
          if (index == next.dataset.index) _wtcUtilityHelpers["default"].addClass('is-active', item);else _wtcUtilityHelpers["default"].removeClass('is-active', item);
        });
      }

      if (typeof this.options.onHasChanged == "function") {
        this.options.onHasChanged(next, this.currentItem);
      }

      this.currentItem = next;
      this.currentIndex = +next.dataset.index;

      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      } else {
        this.liveRegion.innerHTML = "Active carousel item: ".concat(this.currentIndex + 1, " of ").concat(this.items.length, ".");
      }
    }
    /**
     * Move forward
     * @return {class} This.
     */

  }, {
    key: "next",
    value: function next() {
      this.currentIndex = parseInt(this.currentItem.dataset.index);

      if (typeof this.options.onWillChange == "function") {
        this.options.onWillChange(this, true);
      }

      _wtcUtilityHelpers["default"].removeClass('is-transitioning--center', this.currentItem);

      _wtcUtilityHelpers["default"].addClass('is-transitioning is-transitioning--backward', this.currentItem);

      this.move();
      return this;
    }
    /**
     * Move backwards
     * @return {class} This.
     */

  }, {
    key: "prev",
    value: function prev() {
      this.currentIndex = this.currentItem.dataset.index;

      if (typeof this.options.onWillChange == "function") {
        this.options.onWillChange(this, false);
      }

      _wtcUtilityHelpers["default"].removeClass('is-transitioning--center', this.currentItem);

      _wtcUtilityHelpers["default"].addClass('is-transitioning is-transitioning--forward', this.currentItem);

      this.move(false);
      return this;
    }
    /**
     * Get currently-active gallery item
     * @return {DOMNode} Element.
     */

  }, {
    key: "pause",

    /**
     * Pause autoplaying gallery
     * @return {class} This.
     */
    value: function pause() {
      if (this.options.autoplay) {
        clearTimeout(this.player);
      }

      return this;
    }
    /**
     * Resume autoplaying gallery
     * @return {class} This.
     */

  }, {
    key: "resume",
    value: function resume() {
      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      }

      return this;
    }
  }, {
    key: "active",
    get: function get() {
      return this.currentItem;
    }
    /**
     * Get the index of the currently-active gallery item
     * @return {DOMNode} Element.
     */

  }, {
    key: "activeIndex",
    get: function get() {
      return this.currentIndex;
    }
  }]);

  return Gallery;
}(_wtcControllerElement["default"]);

_wtcControllerElement.ExecuteControllers.registerController(Gallery, 'Gallery');

var _default = Gallery;
exports["default"] = _default;