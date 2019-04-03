/**
 * Gallery
 * Minimal content switcher class, with options for autoplay, navigation, pagination, and more.
 * 
 * @author Marlon Marcello <marlon@wethecollective.com>
 * @version 0.2.0
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
   * @param {(boolean|string)} options.pagination - creates a barebones navigation list of gallery items
   * @param {?HTMLElement} options.paginationTarget - creates a navigation list of gallery items based on the element specified.
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
      pagination: (this.element.getAttribute('data-pagination') == 'true') ? true : false,
      paginationTarget: (this.element.getAttribute('data-pagination-target') && this.element.getAttribute('data-pagination-target').length > 1) ? this.element.getAttribute('data-pagination-target') : null,
      onLoad: null,
      onWillChange: null,
      onHasChanged: null
    }

    if (options) {
      this.options = _u.extend(this.options, options);
    }

    this.wrapper = this.element.querySelector('ul');
    this.items = this.wrapper.children;
    this.overlay = document.createElement('div');
    this.currentItem = this.items[0];
    this.currentIndex = 0;

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

    // If pagination is set to true, set up the item list
    if (this.options.pagination) {

      let itemList;

      // if a nodeList was provided, use it.
      // otherwise, build a generic list of buttons
      if (this.options.paginationTarget) {

        itemList = document.querySelector(this.options.paginationTarget);
        let items = itemList.children;

        _u.forEachNode(items, (index, el) => {
          el.classList.add('gallery__pagination-item');
          if (!el.dataset.index) el.dataset.index = index;
          if (index === 0) el.classList.add('is-active');
          el.addEventListener('click', this.handlePagination.bind(this));
        });

      } else {

        itemList = document.createElement('ul');

        _u.forEachNode(this.items, index => {
          let item = document.createElement('li'),
            itemBtn = document.createElement('button'),
            itemBtnContent = document.createTextNode(index);

          item.classList.add('gallery__pagination-item');
          item.dataset.index = index;
          item.addEventListener('click', this.handlePagination.bind(this));
          
          itemBtn.appendChild(itemBtnContent);
          item.appendChild(itemBtn);
          itemList.appendChild(item);
        });
        
        this.element.appendChild(itemList);
      }

      this.paginationList = itemList;
      this.paginationItems = itemList.children;
      itemList.classList.add('gallery__pagination');

      console.log(this.paginationItems)

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
      item.dataset.index = index;
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
   * Advances gallery to the index of the selected pagination item.
   * @param {Object} e - the event object
   */
  handlePagination(e) {
    let target = e.target.closest('.gallery__pagination-item');
    if (target) {
      let i = target.dataset.index;
      _u.forEachNode(this.paginationList.children, (index, item)=> {
        if (i == index) _u.addClass('is-active', item);
        else _u.removeClass('is-active', item);
      });
      this.moveByIndex(i);
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
    let next = this.items[index];

    if (this.options.autoplay) {
      clearTimeout(this.player);
    }

    if (!next) {
      console.warn('No item with index: ' + index);
      return;
    }

    if (this.currentItem != next) {
      _u.addClass('is-active is-transitioning is-transitioning--center', next);
      _u.removeClass('is-active', this.currentItem);
    }

    if (this.options.pagination) {
      _u.forEachNode(this.paginationItems, (counter, item) => {
        if (item.dataset.index == index) {
          _u.addClass('is-active', item);
        } else {
          _u.removeClass('is-active', item);
        }
      })
    }

    if (typeof this.options.onHasChanged == "function") {
      this.options.onHasChanged(next, this.currentItem);
    }

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

    if (this.options.pagination) {
      _u.forEachNode(this.paginationItems, (index, item) => {
        if (index == next.dataset.index) _u.addClass('is-active', item);
        else _u.removeClass('is-active', item);
      });
    }

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
    this.currentIndex = parseInt(this.currentItem.dataset.index);

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
    this.currentIndex = this.currentItem.dataset.index;

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
   * Get the index of the currently-active gallery item
   * @return {DOMNode} Element.
   */
  get activeIndex() {
    return this.currentIndex;
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
