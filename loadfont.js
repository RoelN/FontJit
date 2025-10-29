/**
 * Loads a font for the specified DOM element using data attributes
 *
 * @param {Element} item - DOM element with font data attributes:
 *        data-lf-url: URL to the font file
 *        data-lf-name: (optional) Font family name, defaults to URL if not provided
 *        data-lf-status: Status indicator (0=idle, 1=loading, 2=loaded, 3=error)
 * @returns {void}
 */
export const loadFont = (element) => {
	const status = element.getAttribute('data-lf-status')
	if (status === '2') return

	const url = element.getAttribute('data-lf-url')
	const name = element.getAttribute('data-lf-name') || url

	const fonts = [...document.fonts].map((font) => font.family)
	if (fonts.includes(name)) {
		element.setAttribute('data-lf-status', '2')
		return
	}

	if (!url) {
		return
	}

	const fontFace = new FontFace(`${name}`, `url("${url}")`)
	element.setAttribute('data-lf-status', '1')
	fontFace
		.load()
		.then((loadedFont) => {
			document.fonts.add(loadedFont)
			element.setAttribute('data-lf-status', '2')
		})
		.catch((e) => {
			element.setAttribute('data-lf-status', '3')
			throw e
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
	const elements =
		typeof selector === 'string'
			? document.querySelectorAll(selector)
			: selector instanceof Element
			? [selector]
			: selector

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				loadFont(entry.target)
				observer.unobserve(entry.target)
			}
		})
	}, options)

	elements.forEach((fontElement) => {
		observer.observe(fontElement)
	})
}
