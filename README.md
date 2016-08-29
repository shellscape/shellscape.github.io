shellscape.github.io
===

This repository houses the codebase for [shellscape.org](http://shellscape.org), which leverages [Jekyll](https://jekyllrb.com) and [Github Pages](https://pages.github.com/).

The site is _very loosely_ based on the Jekyll theme [Halve](https://github.com/TaylanTatli/Halve) by Taylan Tatlı, and shares similarity in appearance, open source components, and configuration structure only. The entire codebase was written from scratch to accomodate significant improvements to performance, code quality, readability, and maintainability.

### Nifty Stuff used on this site
- Custom [Liquid](https://shopify.github.io/liquid/) templating
- Canvas animation
- SVG
- [SCSS](http://sass-lang.com/)
- [YAML](http://yaml.org/)
- The [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API (for supporting browsers)
- CSS3 Transitions and Transformations
- Semantic Markup (HTML5)

It's also worth noting that not one bit of jQuery or other Javascript library was used to put this together. Raw, native Javascript for the win here.

### Browser Support

I wrote this with the intention that it'd be bleeding edge, and with that it means that there will be some things that don't work on older browsers. However, the site should be comletely functional otherwise. Fun stuff like the Github Graph on the [projects page](http://shellscape.org/projects) won't load outside of latest Chrome, Firefox, and preview builds of Safari. Everything not supported is designed to fallback gracefully.

### Todo
- [ ] Add Linting of SCSS and Javascript  
- [ ] Get to blogging
