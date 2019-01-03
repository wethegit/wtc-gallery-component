/**
 * Gallery
 * Minimal content switcher class, with options for autoplay, navigation, pagination, and more.
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
   * @param {function} options.onLoad - function to run once the gallery is loaded
   * @param {function} options.onWillChange - function to run before a gallery transition occurs
   * @param {function} options.onHasChanged - function to run after a gallery transition occurs
   */
  constructor (element, options = {}) {
    super(element);

    this.options = {
      nav: (this.element.getAttribute('data-nav') == 'true') ? true : false,
      debug: (this.element.getAttribute('data-debug') == 'true') ? true : false,
      autoplay: (this.element.getAttribute('data-autoplay') == 'true') ? true : false,
      delay: (parseInt(this.element.getAttribute('data-delay')) > 0) ? parseInt(this.element.getAttribute('data-delay')) : 5000,
      pauseOnHover: (this.element.getAttribute('data-pause-on-hover') == 'true') ? true : false,
      draggable: (this.element.getAttribute('data-draggable') == 'true') ? true : false,
      dragThreshold: (parseInt(this.element.getAttribute('data-drag-threshold')) > 0) ? parseInt(this.element.getAttribute('data-drag-threshold')) : 40,
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

      this.element.appendChild(this.nextBtn);
      this.element.appendChild(this.prevBtn);
    }

    // Add pause-on-hover pointer events. Including a fallback to mouse events.
    if (this.options.pauseOnHover) {
      if (window.PointerEvent) {
        element.addEventListener('pointerover', this.pause.bind(this), false);
        element.addEventListener('pointerout', this.resume.bind(this), false);
      } else {
        element.addEventListener('mouseenter', this.pause.bind(this), false);
        element.addEventListener('mouseleave', this.resume.bind(this), false);
      }
    }

    // Add "draggable" events
    if (this.options.draggable) {
      this.dragStartX = null;

      element.addEventListener('mousedown', this.draggablePointerDown.bind(this), false);
      element.addEventListener('touchstart', this.draggablePointerDown.bind(this), false);
      element.addEventListener('mouseup', this.draggablePointerUp.bind(this), false);
      element.addEventListener('touchend', this.draggablePointerUp.bind(this), false);
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
    this.element.appendChild(this.overlay);

    // preload images if any
    let images = this.wrapper.querySelectorAll('img');
    if (images.length > 0) {
      let preloader = new Preloader({debug: this.options.debug});

      _u.forEachNode(images, (index, item)=> {
        preloader.add(item.getAttribute('src'), 'image');
      });

      preloader.load(this.loaded.bind(this));
    } else {
      this.loaded();
    }
  }

  /**
   * Stores the x-position of mouse/touch input
   * @param {Object} e - the event object
   */
  draggablePointerDown(e) {
    if (e.target.closest('button')) {
      return;
    } else {
      e.preventDefault();
      let xPos = e.clientX || e.touches['0'].clientX;
      this.dragStartX = xPos;
    }
  }

  /**
   * Advance gallery if drag distance meets or exceeds the established threshold.
   * @param {Object} e - the event object
   */
  draggablePointerUp(e) {
    if (e.target.closest('button')) {
      return;
    } else {
      e.preventDefault();
      let xPos = e.clientX || e.changedTouches['0'].clientX;

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
   * Removes loading classes and starts autoplay.
   * @return {class} This
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
   * Helper method to remove CSS transition classes
   * @param {DOMNode} item - Gallery item.
   * @return {class} This.
   */
  itemTransitioned(item) {
    _u.removeClass('is-transitioning is-transitioning--center is-transitioning--backward is-transitioning--forward', item);

    return this;
  }

  /**
   * Changes active item based on its index, starts at 0
   * @param {number} index
   * @return {class} This
   */
  moveByIndex(index) {
    if (this.options.autoplay) {
      clearTimeout(this.player);
    }

    let next = this.items[index];

    if (!next) {
      console.warn('No item with index: ' + index);
      return;
    }

    _u.addClass('is-active is-transitioning is-transitioning--center', next);
    _u.removeClass('is-active', this.currentItem);

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
  next() {
    if (typeof this.options.onWillChange == "function") {
      this.options.onWillChange(this, true);
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
    if (typeof this.options.onWillChange == "function") {
      this.options.onWillChange(this, false);
    }

    _u.removeClass('is-transitioning--center', this.currentItem);
    _u.addClass('is-transitioning is-transitioning--forward', this.currentItem);
    this.move(false);

    return this;
  }

  /**
   * Get currently-active gallery item
   * @return {DOMNode} Element.
   */
  get active() {
    return this.currentItem;
  }

  /**
   * Pause autoplaying gallery
   * @return {class} This.
   */
  pause() {
    if (this.options.autoplay) {
      clearTimeout(this.player);
    }

    return this;
  }

  /**
   * Resume autoplaying gallery
   * @return {class} This.
   */
  resume() {
    if (this.options.autoplay) {
      this.player = setTimeout(this.next.bind(this), this.options.delay);
    }

    return this;
  }

}

ExecuteControllers.registerController(Gallery, 'Gallery');

export default Gallery;
