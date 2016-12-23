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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Very simplistic gallery with a navigation and autoplay option.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Marlon Marcello <marlon@wethecollective.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 0.1.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @requirements wtc-utility-helpers, wtc-utility-preloader, wtc-controller-element
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @created Nov 30, 2016
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var Gallery = function (_ElementController) {
  _inherits(Gallery, _ElementController);

  function Gallery(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Gallery);

    var _this = _possibleConstructorReturn(this, (Gallery.__proto__ || Object.getPrototypeOf(Gallery)).call(this, element));

    _this.options = {
      nav: _this.element.getAttribute('data-nav') == 'true' ? true : false,
      autoplay: _this.element.getAttribute('data-autoplay') == 'true' ? true : false,
      delay: parseInt(_this.element.getAttribute('data-delay')) > 0 ? parseInt(_this.element.getAttribute('data-delay')) : 5000,
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
      (function () {
        var preloader = new _wtcUtilityPreloader2.default({ debug: true });

        _wtcUtilityHelpers2.default.forEachNode(images, function (index, item) {
          preloader.add(item.getAttribute('src'), 'image');
        });

        preloader.load(_this.loaded.bind(_this));
      })();
    } else {
      _this.loaded();
    }
    return _this;
  }

  /**
   * Adjust main wrapper height.
   *
   * @return {class} This.
   */


  _createClass(Gallery, [{
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
     * Removes loading classes and start autoplay.
     *
     * @return {class} This.
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
     * Helper class to remove transitioning classes
     * @param  {DOMNode} item Gallery item.
     * @return {class}      This.
     */

  }, {
    key: 'itemTransitioned',
    value: function itemTransitioned(item) {
      _wtcUtilityHelpers2.default.removeClass('is-transitioning is-transitioning--center is-transitioning--backward is-transitioning--forward', item);

      if (typeof this.onHasChanged == "function") {
        this.onHasChanged(this, true);
      }

      return this;
    }

    /**
     * Changes active items
     * @param {bool} direction - True = forwards. Flase = backwards
     *
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
      if (typeof this.onWillChange == "function") {
        this.onWillChange(this, true);
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
      if (typeof this.onWillChange == "function") {
        this.onWillChange(this, false);
      }

      _wtcUtilityHelpers2.default.removeClass('is-transitioning--center', this.currentItem);
      _wtcUtilityHelpers2.default.addClass('is-transitioning is-transitioning--forward', this.currentItem);
      this.move(false);

      return this;
    }
  }]);

  return Gallery;
}(_wtcControllerElement2.default);

_wtcControllerElement.ExecuteControllers.registerController(Gallery, 'Gallery');

exports.default = Gallery;