/**
 * FontJit v1.0.2
 * by Roel Nieskens - pixelambacht.nl
 */

/**
 * Loading states
 */
export const LoadingState = {
	UNLOADED: 'unloaded',
	LOADING: 'loading',
	LOADED: 'loaded',
	ERROR: 'error',
}

/**
 * Promise cache
 */
const fontCache = new Map()

/**
 * Creates a unique cache key
 *
 * @param {string} name - Font name
 * @param {string} url - Font URL
 * @param {Object} descriptors - FontFace descriptors
 * @returns {string} Normalized cache key
 */
const createCacheKey = (name, url, descriptors) => {
	// Sort the descriptors so they're always tha same order
	const sortedEntries = Object.entries(descriptors).sort(([a], [b]) =>
		a.localeCompare(b)
	)
	return `${name}::${url}::${JSON.stringify(sortedEntries)}`
}

/**
 * Converts selector input to an array of elements
 *
 * @param {string|Element|NodeList} selector - CSS selector string, DOM element, or NodeList
 * @returns {Array|NodeList} Array of elements
 */
const getElements = (selector) => {
	return typeof selector === 'string'
		? document.querySelectorAll(selector)
		: selector instanceof Element
		? [selector]
		: selector
}

/**
 * Loads fonts for the specified elements using data attributes
 *
 * @param {string|Element|NodeList} selector - CSS selector string, DOM element, or NodeList
 * @returns {void}
 */
const loadFont = (selector) => {
	const elements = getElements(selector)
	elements.forEach((element) => {
		const status = element.getAttribute('data-fontjit-status')
		if (status === LoadingState.LOADING || status === LoadingState.LOADED) {
			return
		}

		const url = element.getAttribute('data-fontjit-url')
		const name = element.getAttribute('data-fontjit-name')

		if (!url || !name) {
			element.setAttribute('data-fontjit-status', LoadingState.ERROR)
			return
		}

		let descriptors = {}
		const descriptorsData = element.getAttribute('data-fontjit-descriptors')
		if (descriptorsData) {
			try {
				descriptors = JSON.parse(descriptorsData)
			} catch (error) {
				console.error(error)
			}
		}

		// Use cached promise if this font was already loaded
		const cacheKey = createCacheKey(name, url, descriptors)
		let promise = fontCache.get(cacheKey)
		if (!promise) {
			const fontFace = new FontFace(name, `url("${url}")`, descriptors)
			promise = fontFace
				.load()
				.then((loadedFont) => {
					document.fonts.add(loadedFont)
					return loadedFont
				})
				.catch((error) => {
					fontCache.delete(cacheKey)
					// Throw so the promise fails
					throw error
				})
			fontCache.set(cacheKey, promise)
		}

		element.setAttribute('data-fontjit-status', LoadingState.LOADING)
		promise
			.then(() => {
				element.setAttribute('data-fontjit-status', LoadingState.LOADED)
			})
			.catch(() => {
				element.setAttribute('data-fontjit-status', LoadingState.ERROR)
			})
	})
}

/**
 * Just-in-time font loading
 * Loads fonts lazily when they enter the viewport (default), when they almost
 * enter the viewport, or immediately
 *
 * @param {string|Element|NodeList} selector - CSS selector string, DOM element, or NodeList
 * @param {Object} [options] - Options for font loading
 * @param {boolean} [options.immediate=false] - Load fonts immediately instead of lazily
 * @param {string} [options.rootMargin] - IntersectionObserver rootMargin (lazy mode only)
 * @param {number} [options.threshold] - IntersectionObserver threshold (lazy mode only)
 * @returns {void}
 */
export const fontJit = (selector = '[data-fontjit-url]', options = {}) => {
	const { immediate = false, ...observerOptions } = options

	// Immediate loading
	if (immediate) {
		loadFont(selector)
		return
	}

	// Lazy loading (default)
	const elements = getElements(selector)

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadFont(entry.target)
				observer.unobserve(entry.target)
			}
		})
	}, observerOptions)

	elements.forEach((fontElement) => {
		fontElement.setAttribute('data-fontjit-status', LoadingState.UNLOADED)
		observer.observe(fontElement)
	})
}
