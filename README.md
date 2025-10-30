# FontJit

A little helper for just-in-time font loading! Loads fonts can be loaded when they _enter_ the viewport, when they _almost enter_ the viewport, or immediately.

## Quick Start

1. Set up lazy loading for elements with the class `boing`. By default fonts will be loaded when they're in the viewport on pageload, or when they enter the viewport.

```html
<script type="module">
	import { fontJit } from './fontjit.js'
	fontJit('.boing')
</script>
```

You can pass either a CSS selector string, a DOM element, or a Nodelist to fontJit.

2. Add data attributes with the font URL and font name:

```html
<div class="boing" data-fontjit-url="boing.woff2" data-fontjit-name="Boing">
	Hello World
</div>
```

3. `fontJit` only takes care of _loading_ the font, so you have to actually _apply_ it yourself:

```html
<style>
	.boing {
		font-family: Boing;
	}
</style>
```

## Loading States

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

/* Font couldn't load, show error state */
.boing[data-fontjit-status='error'] {
	opacity: 1;
	outline: 10px solid red;
}
```

You can use the `LoadingState` constants in JavaScript:

```javascript
import { fontJit, LoadingState } from './fontjit.js'

const element = document.querySelector('.boing')
if (element.getAttribute('data-fontjit-status') === LoadingState.LOADED) {
	// Do something with the loaded font!
}
```

## Loading Options

By default, `fontJit` lazy-loads fonts when they enter the viewport. You can also have them load when they _almost enter_ the viewport by passing an [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) config, or load them immediately:

```javascript
// Load font when it's in the viewport
fontJit('.boing')

// Load font when it's almost in the viewport
fontJit('.boing', { rootMargin: '400px 0px' })

// Load font immediately, regardless of whether it's (almost) in the viewport
fontJit('.boing', { immediate: true })
```

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
