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
If you are using [wtc-controller-element] just **data-controller="Gallery"** to your markup.
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
If you opt out to pass the options to the instance, you get a few extra hooks:
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
  - nav: True if you want to have next/prev buttons
  - autoplay: Auto start the gallery
  - delay: The delay between each slide  
  - **THE FOLLOWING OPTIONS ARE ONLY AVAILABLE WHEN NOT USING ExecuteControllers:**
  - onLoad: fire after all images were preloaded and gallery will is initiated
  - onWillChange: fire when changing slide
  - onHasChanged: fire after changed slide

[wtc-controller-element]:https://github.com/wethegit/wtc-controller-element
