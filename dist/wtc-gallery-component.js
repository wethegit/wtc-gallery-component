'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wtcUtilityHelpers = require('wtc-utility-helpers');

var _wtcUtilityHelpers2 = _interopRequireDefault(_wtcUtilityHelpers);

var _wtcUtilityPreloader = require('wtc-utility-preloader');

var _wtcUtilityPreloader2 = _interopRequireDefault(_wtcUtilityPreloader);

var _wtcControllerElement = require('wtc-controller-element');

var _wtcControllerElement2 = _interopRequireDefault(_wtcControllerElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Gallery
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Minimal content switcher class, with options for autoplay, navigation, pagination, and more.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Marlon Marcello <marlon@wethecollective.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 0.1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @requirements wtc-utility-helpers, wtc-utility-preloader, wtc-controller-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @created Nov 30, 2016
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Gallery = function (_ElementController) {
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
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, element));

    _this.options = {
      nav: _this.element.getAttribute('data-nav') == 'true' ? true : false,
      debug: _this.element.getAttribute('data-debug') == 'true' ? true : false,
      autoplay: _this.element.getAttribute('data-autoplay') == 'true' ? true : false,
      delay: parseInt(_this.element.getAttribute('data-delay')) > 0 ? parseInt(_this.element.getAttribute('data-delay')) : 5000,
      pauseOnHover: _this.element.getAttribute('data-pause-on-hover') == 'true' ? true : false,
      draggable: _this.element.getAttribute('data-draggable') == 'true' ? true : false,
      dragThreshold: parseInt(_this.element.getAttribute('data-drag-threshold')) > 0 ? parseInt(_this.element.getAttribute('data-drag-threshold')) : 40,
      pagination: _this.element.getAttribute('data-pagination') == 'true' ? true : false,
      paginationTarget: _this.element.getAttribute('data-pagination-target') && _this.element.getAttribute('data-pagination-target').length > 1 ? document.querySelector(_this.element.getAttribute('data-pagination-target')) : null,
      onLoad: null,
      onWillChange: null,
      onHasChanged: null
    };

    if (options) {
      _this.options = _wtcUtilityHelpers2.default.extend(_this.options, options);
    }

    _this.wrapper = _this.element.querySelector('ul');
    _this.items = _this.wrapper.querySelectorAll('li');
    _this.overlay = document.createElement('div');
    _this.currentItem = _this.items[0];

    // If nav is set to true, create buttons
    if (_this.options.nav) {
      _this.nextBtn = document.createElement('button');
      _this.nextBtn.innerHTML = 'Next';
      _this.prevBtn = document.createElement('button');
      _this.prevBtn.innerHTML = 'Previous';

      _wtcUtilityHelpers2.default.addClass('gallery__nav gallery__nav-next', _this.nextBtn);
      _wtcUtilityHelpers2.default.addClass('gallery__nav gallery__nav-prev', _this.prevBtn);

      _this.nextBtn.addEventListener('click', _this.next.bind(_this));
      _this.prevBtn.addEventListener('click', _this.prev.bind(_this));

      _this.element.appendChild(_this.nextBtn);
      _this.element.appendChild(_this.prevBtn);
    }

    // If pagination is set to true, set up the item list
    if (_this.options.pagination) {

      // if a nodeList was provided, use it.
      // otherwise, build a generic list of buttons
      if (_this.options.paginationTarget) {

        var itemList = _this.options.paginationTarget,
            items = itemList.children;

        itemList.classList.add('gallery__pagination');

        _wtcUtilityHelpers2.default.forEachNode(items, function (index, el) {
          el.classList.add('gallery__pagination-item');
          el.addEventListener('click', _this.moveByIndex.bind(_this, index));
        });
      } else {

        var _itemList = document.createElement('ul');

        _wtcUtilityHelpers2.default.forEachNode(_this.items, function (index) {
          var item = document.createElement('li'),
              itemBtn = document.createElement('button'),
              itemBtnContent = document.createTextNode(index);

          item.classList.add('gallery__pagination-item');
          item.addEventListener('click', _this.moveByIndex.bind(_this, index));

          itemBtn.appendChild(itemBtnContent);
          item.appendChild(itemBtn);
          _itemList.appendChild(item);
        });

        _itemList.classList.add('gallery__pagination');
        _this.element.appendChild(_itemList);
        _this.paginationList = _itemList;
      }
    }

    // Add pause-on-hover pointer events. Including a fallback to mouse events.
    if (_this.options.pauseOnHover) {
      if (window.PointerEvent) {
        element.addEventListener('pointerover', _this.pause.bind(_this), false);
        element.addEventListener('pointerout', _this.resume.bind(_this), false);
      } else {
        element.addEventListener('mouseenter', _this.pause.bind(_this), false);
        element.addEventListener('mouseleave', _this.resume.bind(_this), false);
      }
    }

    // Add "draggable" events
    if (_this.options.draggable) {
      _this.dragStartX = null;

      element.addEventListener('mousedown', _this.draggablePointerDown.bind(_this), false);
      element.addEventListener('touchstart', _this.draggablePointerDown.bind(_this), false);
      element.addEventListener('mouseup', _this.draggablePointerUp.bind(_this), false);
      element.addEventListener('touchend', _this.draggablePointerUp.bind(_this), false);
    }

    // add base classes
    _wtcUtilityHelpers2.default.addClass('gallery', _this.element);
    _wtcUtilityHelpers2.default.addClass('gallery__overlay', _this.overlay);
    _wtcUtilityHelpers2.default.addClass('gallery__wrapper', _this.wrapper);
    _wtcUtilityHelpers2.default.forEachNode(_this.items, function (index, item) {
      _wtcUtilityHelpers2.default.addClass('gallery__item', item);

      item.addEventListener('transitionend', _this.itemTransitioned.bind(_this, item));
    });

    // add state classes
    _wtcUtilityHelpers2.default.addClass('is-active', _this.currentItem);
    _wtcUtilityHelpers2.default.addClass('is-loading', _this.element);

    // append main element
    _this.element.appendChild(_this.overlay);

    // preload images if any
    var images = _this.wrapper.querySelectorAll('img');
    if (images.length > 0) {
      var preloader = new _wtcUtilityPreloader2.default({ debug: _this.options.debug });

      _wtcUtilityHelpers2.default.forEachNode(images, function (index, item) {
        preloader.add(item.getAttribute('src'), 'image');
      });

      preloader.load(_this.loaded.bind(_this));
    } else {
      _this.loaded();
    }
    return _this;
  }

  /**
   * Stores the x-position of mouse/touch input
   * @param {Object} e - the event object
   */


  _createClass(Gallery, [{
    key: 'draggablePointerDown',
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
    key: 'draggablePointerUp',
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
    key: 'resize',
    value: function resize() {
      var newH = 0;

      _wtcUtilityHelpers2.default.forEachNode(this.items, function (index, item) {
        var h = item.offsetHeight;
        if (h > newH) {
          newH = h;
        }
      });

      this.wrapper.style.height = newH + 'px';

      return this;
    }

    /**
     * Removes loading classes and starts autoplay.
     * @return {class} This
     */

  }, {
    key: 'loaded',
    value: function loaded() {
      window.addEventListener('resize', this.resize.bind(this));
      this.resize();

      _wtcUtilityHelpers2.default.removeClass('is-loading', this.element);
      _wtcUtilityHelpers2.default.addClass('is-loaded', this.element);

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
    key: 'itemTransitioned',
    value: function itemTransitioned(item) {
      _wtcUtilityHelpers2.default.removeClass('is-transitioning is-transitioning--center is-transitioning--backward is-transitioning--forward', item);

      return this;
    }

    /**
     * Changes active item based on its index, starts at 0
     * @param {number} index
     * @return {class} This
     */

  }, {
    key: 'moveByIndex',
    value: function moveByIndex(index) {
      if (this.options.autoplay) {
        clearTimeout(this.player);
      }

      var next = this.items[index];

      if (!next) {
        console.warn('No item with index: ' + index);
        return;
      }

      if (this.currentItem != next) {
        _wtcUtilityHelpers2.default.addClass('is-active is-transitioning is-transitioning--center', next);
        _wtcUtilityHelpers2.default.removeClass('is-active', this.currentItem);
      }

      if (typeof this.options.onHasChanged == "function") {
        this.options.onHasChanged(next, this.currentItem);
      }

      this.currentItem = next;

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
    key: 'move',
    value: function move() {
      var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.options.autoplay) {
        clearTimeout(this.player);
      }

      var next = direction ? this.currentItem.nextElementSibling : this.currentItem.previousElementSibling;

      if (!next) {
        next = direction ? this.items[0] : this.items[this.items.length - 1];
      }

      _wtcUtilityHelpers2.default.addClass('is-active is-transitioning is-transitioning--center', next);
      _wtcUtilityHelpers2.default.removeClass('is-active', this.currentItem);

      if (typeof this.options.onHasChanged == "function") {
        this.options.onHasChanged(next, this.currentItem);
      }

      this.currentItem = next;

      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      }
    }

    /**
     * Move forward
     * @return {class} This.
     */

  }, {
    key: 'next',
    value: function next() {
      if (typeof this.options.onWillChange == "function") {
        this.options.onWillChange(this, true);
      }

      _wtcUtilityHelpers2.default.removeClass('is-transitioning--center', this.currentItem);
      _wtcUtilityHelpers2.default.addClass('is-transitioning is-transitioning--backward', this.currentItem);
      this.move();

      return this;
    }

    /**
     * Move backwards
     * @return {class} This.
     */

  }, {
    key: 'prev',
    value: function prev() {
      if (typeof this.options.onWillChange == "function") {
        this.options.onWillChange(this, false);
      }

      _wtcUtilityHelpers2.default.removeClass('is-transitioning--center', this.currentItem);
      _wtcUtilityHelpers2.default.addClass('is-transitioning is-transitioning--forward', this.currentItem);
      this.move(false);

      return this;
    }

    /**
     * Get currently-active gallery item
     * @return {DOMNode} Element.
     */

  }, {
    key: 'pause',


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
    key: 'resume',
    value: function resume() {
      if (this.options.autoplay) {
        this.player = setTimeout(this.next.bind(this), this.options.delay);
      }

      return this;
    }
  }, {
    key: 'active',
    get: function get() {
      return this.currentItem;
    }
  }]);

  return Gallery;
}(_wtcControllerElement2.default);

_wtcControllerElement.ExecuteControllers.registerController(Gallery, 'Gallery');

exports.default = Gallery;