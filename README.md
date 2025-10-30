# FontJit

A little helper for just-in-time font loading! Loads fonts when they _enter_ the viewport, or when they're _about to enter_ the viewport. You're the boss!

Simple example:

1. Set up lazy loading for all elements with the class `boing`:

```html
<script type="module">
	import { lazyLoadFont } from './fontjit.js'
	lazyLoadFont('.boing') // Or a DOM element, or nodelist
</script>
```

2. Add data attributes with the URL and name:

```html
<div class="boing" data-fontjit-url="boing.woff2" data-fontjit-name="Boing">
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

While loading, the `data-fontjit-status` attribute will be added and updated. This lets you keep track of the four loading states:

```
idle = not yet started
loading = font is loading
loaded = font successfully loaded
error = loading failed
```

You can use these in CSS, for example to hide the text until the font has been loaded:

```css
.boing {
	font-family: Boing;
	opacity: 0;
}

/* Font has loaded, show the element */
.boing[data-fontjit-status='loaded'] {
	opacity: 1;
}
```

You can use the `LoadingState` constants in JavaScript:

```javascript
import { lazyLoadFont, LoadingState } from './fontjit.js'

const element = document.querySelector('.boing')
if (element.getAttribute('data-fontjit-status') === LoadingState.LOADED) {
	// Do something with the loaded font!
}
```

You can pass IntersectionObserver options to `lazyLoadFont` in the second argument:

```javascript
// Load font when element almost enters viewport
lazyLoadFont('.boing', {
	rootMargin: '400px 0px',
})
```

Or call `loadFont` directly to immediately download the font, regardless of whether the element is intersecting:

```javascript
// Load font for this element immediately
loadFont('.boing')
```

You can pass either a string, a DOM element, or a Nodelist to `loadFont` and `lazyLoadFont`.

## Font Descriptors

You can pass optional [FontFace descriptors](https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace#descriptors) using the `data-fontjit-descriptors` attribute with a JSON string:

```html
<div
	class="boing"
	data-fontjit-url="boing.woff2"
	data-fontjit-name="Boing"
	data-fontjit-descriptors='{"weight":"100 900","stretch":"75% 125%"}'
>
	Hello World
</div>
```
