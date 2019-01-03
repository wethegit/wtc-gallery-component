# wtc-gallery-component
Very simplistic gallery with image preloader and a navigation and autoplay option.

## Install
```sh
$ npm install wtc-gallery-component
```

## Usage
Import it in your project.
```javascript
import Gallery from 'wtc-gallery-component';
```

Add the markup.
```html
<div data-nav="true" data-autoplay="true" data-delay="5000">
  <ul>
    <li>
      <img src="./assets/img/image.jpg" alt="Image">
    </li>
  </ul>
</div>
```

You now have 2 options to initalize the component.

### 1. Using ExecuteControllers
If you are using [wtc-controller-element] just add **data-controller="Gallery"** to your markup.
```html
<div data-controller="Gallery" data-nav="true" data-autoplay="true" data-delay="5000">
  <ul>
    <li>
      <img src="./assets/img/image.jpg" alt="Image">
    </li>
  </ul>
</div>
```
You can also instanciate explicitly:
```javascript
ExecuteControllers.instanciate(document.getElementById('gallery'), Gallery);
```

### 2. Default JS
With the default js version, you have the option to pass the options as an object, or use data-attributes, they both work.  
If you choose to pass the options to the instance, you get a few extra hooks:
```javascript
let gallery = new Gallery(document.getElementById('gallery'), {
  nav: true,
  autoplay: true,
  delay: 4000,
  onLoad: null,
  onWillChange: null,
  onHasChanged: null
});
```

## Options
  - nav: boolean, toggles next/prev buttons
  - autoplay: boolean, auto-starts the gallery transitions
  - delay: number, the delay (in milliseconds) between gallery item transitions
  - pauseOnHover: boolean, pauses autoplay when a pointing device is within the gallery area
  - draggable: boolean, allows for a basic swipe/drag to advance gallery items
  - dragThreshold: number, minimum pixel amount for a drag to advance the slideshow
  - pagination: boolean, sets up a minimal navigation list of the gallery items
  - paginationTarget: HTMLElement, sets up a pre-existing list to use as navigation for the gallery items. For accessibility/semantic reasons, this element is assumed to be an unordered list.
  - **THE FOLLOWING OPTIONS ARE ONLY AVAILABLE WHEN NOT USING ExecuteControllers:**
  - onLoad: fire after all images were preloaded and gallery will is initiated
  - onWillChange: fire when changing slide
  - onHasChanged: fire after changed slide

If setting options via data-attributes in the markup, change camelCase to kebab-case. For example, `pauseOnHover` would become `data-pause-on-hover`.
For custom pagination, a valid CSS selector is needed—i.e. `data-pagination-target=".my-custom-pagination"`

## Caveats
Please note that this controller should never be stored in an immutable data structure, as doing so can lead to memory leaks due to method bindings within event listeners.

[wtc-controller-element]:https://github.com/wethegit/wtc-controller-element