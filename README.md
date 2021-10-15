# wtc-gallery-component

A minimal, touch-enabled content switcher, with options for autoplay, pagination, and more.

## Install

```sh
$ npm install wtc-gallery-component
```

## Usage

Import it into your project.

```javascript
import Gallery from "wtc-gallery-component";
```

Include the stylesheet if desired. This can be found in the `dist/` folder, or you can import it directly into your stylesheet:

```scss
@import "~wtc-gallery-component";
```

Add your markup.

```html
<div data-nav="true">
  <ul>
    <li>
      <img src="./assets/img/image.jpg" alt="" />
    </li>
    <li>
      <img src="./assets/img/image2.jpg" alt="" />
    </li>
    <li>
      <img src="./assets/img/image3.jpg" alt="" />
    </li>
  </ul>
</div>
```

You now have 2 options to initalize the component.

### 1. Using ExecuteControllers

If you are using [wtc-controller-element] just add **data-controller="Gallery"** to your markup, and ensure that `ExecuteControllers.instanciateAll()` is being called somewhere globally.

```html
<div data-nav="true" data-controller="Gallery">
  <ul>
    <li>
      <img src="./assets/img/image.jpg" alt="" />
    </li>
    ...
  </ul>
</div>
```

You can also instantiate the component explicitly:

```javascript
ExecuteControllers.instanciate(document.getElementById("gallery"), Gallery);
```

### 2. Default JS

With the default JS version, you have the option to pass the options as an object, or use data-attributes—they both work.  
If you choose to pass the options to the instance, you get a few extra hooks: `onLoad`, `onWillChange`, and `onHasChanged`.

```javascript
let gallery = new Gallery(document.getElementById("gallery"), {
  nav: true,
  autoplay: true,
  delay: 5000,
  onLoad: null,
  onWillChange: function(instance, direction) {
    // run some code before a slide change
  },
  onHasChanged: function(currentItem, previousItem, instance) {
    // run some code after a slide change
  },
});
```

## Options

There are many more options you can pass in to the component:

- `nav`: Boolean. Toggles next/previous buttons. Defaults to `false`.
- `autoplay`: Boolean. Auto-starts the gallery transitions. Defaults to `false`.
- `delay`: Number. The delay (in milliseconds) between gallery item transitions. Defaults to `5000`.
- `pauseOnHover`: Boolean. Pauses autoplay when a pointing device is within the gallery area. Defaults to `false`.
- `loop`: Boolean. Enables left or right navigation, when the user reaches the first or last gallery item, respectively. Defaults to `false`.
- `draggable`: Boolean. Allows for a basic swipe/drag to advance gallery items. Defaults to `false`.
- `dragThreshold`: Number. Minimum pixel amount for a drag action to advance the slideshow. Defaults to `40` pixels.
- `pagination`: Boolean. Sets up a navigation list of the gallery items. If `paginationTarget` (below) is specified, you can pass in your own list of elements to use; otherwise a bare bones list will be set up for you. Defaults to `false`.
- `paginationTarget`: String. CSS selector to integrates as navigation for the gallery items. Pagination items will be created from the immediate children of the given element. Defaults to `null`.
- `nextBtnMarkup`: String. Markup to override the default "next button" content.
- `prevBtnMarkup`: String. Markup to override the default "previous button" content.
- `liveRegionText`: String. Markup to override the default aria-live region content.
- **THE FOLLOWING OPTIONS ARE ONLY AVAILABLE WHEN USING THE `new` KEYWORD TO INSTANTIATE:**
- `onLoad`: Function. Fires after all images were preloaded, and the gallery is initiated.
- `onWillChange`: Function. Fires before a gallery transition event happens. Accepts two parameters: `instance` and `direction` (direction will be `true` or `false`, based on whether it's next or previous).
- `onHasChanged`: Function. Fires immediately after the transition event happens (does not wait for animations). Accepts three parameters: `currentItem`, `previousItem`, and `instance`.

If setting options via data-attributes in the markup, change camelCase to kebab-case. For example, `pauseOnHover` would become `data-pause-on-hover`.
For custom pagination, a valid CSS selector is needed—i.e. `data-pagination-target=".my-custom-pagination"`. It does not matter where in the markup this element is; if you're using multiple Galleries, give your pagination items unique classes or IDs.

## Customize!

The following example uses custom pagination, as well as some other nifty options:

```html
<div
  data-controller="Gallery"
  data-nav="true"
  data-autoplay="true"
  data-delay="6000"
  data-loop="true"
  data-pause-on-hover="true"
  data-draggable="true"
  data-pagination="true"
  data-pagination-target=".my-custom-pagination"
>
  <ul>
    <li>
      <img src="./assets/img/image1.jpg" alt="" />
    </li>
    <li>
      <img src="./assets/img/image2.jpg" alt="" />
    </li>
    <li>
      <img src="./assets/img/image3.jpg" alt="" />
    </li>
  </ul>

  <!-- A custom pagination element should have the same amount of sub-items as the number of gallery items. -->
  <ul class="my-custom-pagination">
    <li>
      Item 1 🐼 (could be an image, more markup… could be anything!)
    </li>
    <li>
      Item 2 🦊
    </li>
    <li>
      Item 3 🐍
    </li>
  </ul>
</div>
```

## Caveats

Please note that this controller should never be stored in an immutable data structure, as doing so can lead to memory leaks due to method bindings within event listeners.

### To-do:

Add a destroy method to un-bind any listeners, per the above caveat.

[wtc-controller-element]: https://github.com/wethegit/wtc-controller-element

## Documentation

Documentation can be found [here](https://wethegit.github.io/wtc-gallery-component/Gallery.html)

## Development

When developing or debugging features in this library, you can use the `index.html` file found in the `dist/` directory to test your changes. Please run the following to get a working build though, as the index.html file depends on the dist files:

```sh
$ npm run build
```
