# LoadFont

Boring name, exciting functionality! Because it loads a font when it enters the viewport.

Simple example:


1. Set up lazy loading for all `div` elements:

```html
<script type="module">
    import { lazyLoadFont } from './loadfont.js';
    lazyLoadFont('.boing'); // Or a DOM element, or nodelist
</script>
```

2. Add data attributes with the URL and, optionally, the name:

```html
<div class="boing" data-lf-url="boing.woff2" data-lf-name="Boing">
    Hello World
</div>
```

3. `lazyLoadFont` (and `loadFont`) only take care of _loading_ the font, so you have to actually _apply_ it yourself, for example:

```html
<style>
    .boing {
        font-family: Boing;
    }
</style>
```

While loading, the `data-lf-status` attribute will be added and updated. This lets you keep track of the four loading states:

```
0 = idle
1 = loading
2 = loaded
3 = error
```

You can use these in CSS, for example to hide the text font until the font has been loaded:

```css
.boing {
    opacity: 0;
    font-family: Boing;
}

/* Font has loaded, show the element */
.boing[data-lf-status='2'] {
    opacity: 1;
}
```

You can pass IntersectionObserver options to `lazyLoadFont` in the second argument:

```javascript
// Load font when element almost enters viewport
lazyLoadFont('.boing', {
    rootMargin: '400px 0px',
});

```

Or call `loadFont` directly to immediately download the font, regardless of whether the element is intersecting:

```javascript
// Load font for this element immediately
loadFont('.boing');

```

You can pass either a selector, a DOM element, or a Nodelist to `loadFont` and `lazyLoadFont`.