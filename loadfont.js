/**
 * Converts selector input to an array of elements (internal helper)
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
export const loadFont = (selector) => {
	const elements = getElements(selector)
	elements.forEach((element) => {
		const status = element.getAttribute('data-lf-status')
		if (status === '1' || status === '2') return

		const url = element.getAttribute('data-lf-url')
		const name = element.getAttribute('data-lf-name') || url

		if (!url) {
			element.setAttribute('data-lf-status', '3')
			return
		}

		const fonts = [...document.fonts].map((font) => font.family)
		if (fonts.includes(name)) {
			element.setAttribute('data-lf-status', '2')
			return
		}

		const fontFace = new FontFace(name, `url("${url}")`)
		element.setAttribute('data-lf-status', '1')
		fontFace
			.load()
			.then((loadedFont) => {
				document.fonts.add(loadedFont)
				element.setAttribute('data-lf-status', '2')
			})
			.catch(() => {
				element.setAttribute('data-lf-status', '3')
			})
	})
}

/**
 * Lazily loads fonts when elements enter the viewport
 *
 * @param {string|Element|NodeList} selector - CSS selector string, DOM element, or NodeList
 * @param {Object} [options] - IntersectionObserver options
 * @returns {void}
 */
export const lazyLoadFont = (selector, options = {}) => {
	const elements = getElements(selector)

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadFont(entry.target)
				observer.unobserve(entry.target)
			}
		})
	}, options)

	elements.forEach((fontElement) => {
		fontElement.setAttribute('data-lf-status', '0')
		observer.observe(fontElement)
	})
}
