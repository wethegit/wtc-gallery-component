/**
 * Gallery
 * Very simplistic gallery with a navigation and autoplay option.
 *
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 0.1.0
 * @requirements wtc-utility-helpers, wtc-utility-preloader, wtc-controller-element
 * @created Nov 30, 2016
 */
import _u from 'wtc-utility-helpers';
import Preloader from 'wtc-utility-preloader';
import {default as ElementController, ExecuteControllers}  from 'wtc-controller-element';

class Gallery extends ElementController {
  constructor (element, options = {}) {
    super(element);

    this.options = {
      nav: (this.element.getAttribute('data-nav') == 'true') ? true : false,
      autoplay: (this.element.getAttribute('data-autoplay') == 'true') ? true : false,
      delay: (parseInt(this.element.getAttribute('data-delay')) > 0) ? parseInt(this.element.getAttribute('data-delay')) : 5000,
      onLoad: null,
      onWillChange: null,
      onHasChanged: null
    }

    if (options) {
      this.options = _u.extend(this.options, options);
    }

    this.wrapper = this.element.querySelector('ul');
    this.items = this.wrapper.querySelectorAll('li');
    this.overlay = document.createElement('div');
    this.currentItem = this.items[0];

    // If nav is set to true, create buttons
    if (this.options.nav) {
      this.nextBtn = document.createElement('button');
      this.nextBtn.innerHTML = 'Next';
      this.prevBtn = document.createElement('button');
      this.prevBtn.innerHTML = 'Previous';

      _u.addClass('gallery__nav gallery__nav-next', this.nextBtn);
      _u.addClass('gallery__nav gallery__nav-prev', this.prevBtn);

      this.nextBtn.addEventListener('click', this.next.bind(this));
      this.prevBtn.addEventListener('click', this.prev.bind(this));

      this.element.append(this.nextBtn);
      this.element.append(this.prevBtn);
    }

    // add base classes
    _u.addClass('gallery', this.element);
    _u.addClass('gallery__overlay', this.overlay);
    _u.addClass('gallery__wrapper', this.wrapper);
    _u.forEachNode(this.items, (index, item)=> {
      _u.addClass('gallery__item', item);

      item.addEventListener('transitionend', this.itemTransitioned.bind(this, item));
    });

    // add state classes
    _u.addClass('is-active', this.currentItem);
    _u.addClass('is-loading', this.element);

    // append main element
    this.element.append(this.overlay);

    // preload images if any
    let images = this.wrapper.querySelectorAll('img');
    if (images.length > 0) {
      let preloader = new Preloader({debug: true});

      _u.forEachNode(images, (index, item)=> {
        preloader.add(item.getAttribute('src'), 'image');
      });

      preloader.load(this.loaded.bind(this));
    } else {
      this.loaded();
    }
  }

  /**
   * Adjust main wrapper height.
   *
   * @return {class} This.
   */
  resize() {
    let newH = 0;

    _u.forEachNode(this.items, (index, item)=> {
      let h = item.offsetHeight;
      if (h > newH) {
        newH = h;
      }
    });

    this.wrapper.style.height = `${newH}px`;

    return this;
  }

  /**
   * Removes loading classes and start autoplay.
   *
   * @return {class} This.
   */
  loaded() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    _u.removeClass('is-loading', this.element);
    _u.addClass('is-loaded', this.element);

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
  itemTransitioned(item) {
    _u.removeClass('is-transitioning is-transitioning--center is-transitioning--backward is-transitioning--forward', item);

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
  move(direction = true) {
    if (this.options.autoplay) {
      clearTimeout(this.player);
    }

    let next = (direction) ? this.currentItem.nextElementSibling : this.currentItem.previousElementSibling;

    if (!next) {
      next = (direction) ? this.items[0] : this.items[this.items.length-1];
    }

    _u.addClass('is-active is-transitioning is-transitioning--center', next);
    _u.removeClass('is-active', this.currentItem);

    this.currentItem = next;

    if (this.options.autoplay) {
      this.player = setTimeout(this.next.bind(this), this.options.delay);
    }
  }

  /**
   * Move forward
   * @return {class} This.
   */
  next() {
    if (typeof this.onWillChange == "function") {
      this.onWillChange(this, true);
    }

    _u.removeClass('is-transitioning--center', this.currentItem);
    _u.addClass('is-transitioning is-transitioning--backward', this.currentItem);
    this.move();

    return this;
  }

  /**
   * Move backwards
   * @return {class} This.
   */
  prev() {
    if (typeof this.onWillChange == "function") {
      this.onWillChange(this, false);
    }

    _u.removeClass('is-transitioning--center', this.currentItem);
    _u.addClass('is-transitioning is-transitioning--forward', this.currentItem);
    this.move(false);

    return this;
  }
}

ExecuteControllers.registerController(Gallery);

export default Gallery;
