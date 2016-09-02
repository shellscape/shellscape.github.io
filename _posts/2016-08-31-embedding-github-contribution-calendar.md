---
layout: post
title:  Embedding the Github Contributions Calendar
date:   2016-08-31
subject: Because who doesn't love fancy graphs?
image: /assets/images/posts/embedding-github-contribution-calendar.png
image-opacity: 0.7
tag:
  - cors
  - esnext
  - fetch
  - github
  - javascript
  - site
---

While working on the [site rewrite](http://shellscape.org/2016/08/29/shellscape-refresh-rewrite)
and [projects page](/projects) I was looking for a way to display more data on my
open source work, on the site's left-side panel. I went with that base layout to
show interesting data, after all. The [Github Contribution Calendar](https://help.github.com/articles/viewing-contributions-on-your-profile-page/)
seemed like a natural choice.

<!-- more -->

In searching for something already written, I found [github-calendar](https://github.com/IonicaBizau/github-calendar).
That wasn't a good fit for my needs, however.

## Getting Dirty

Since Github provides no API or embedding functionality for us we're left with
two options:

  1. Use the developer API, perform calculations, render the graph. aka.
     Reinventing the Wheel.
  2. Good ol' fashion screen scraping.

Stuff that has been traditionally the realm of server-side processes can now be
done with the wonderful ESNext API `fetch`. Support for fetch [is pretty weak](http://caniuse.com/#feat=fetch)
right now, but thankfully there's a [polyfill from Github](https://github.com/github/fetch)
that takes care of those browsers not yet with the hotness. Scraping Github for
the graph is as simple as hitting our profile url `https://github.com/{username}`.

## But, But, But Cross Origin

That's where a harmless proxy comes into play. Github doesn't have CORS setup for
the profile pages, and that's no surprise. Enter the [Url Req Service](http://ivanzuzak.info/urlreq/);
an open source proxy service which simply echoes HTTP responses and allows for CORS.
Magic.

## Let's Fetch

Fetching and handling the response is straight-forward enough. Everything uses
promises so it's rather painless.

```js
var proxy = 'https://urlreq.appspot.com/req?method=GET&url=',
  url = proxy + 'https://github.com/shellscape';

fetch(url)
  .then(function fetchThen (response) {
    // response contains several streams, of which we need to fully read.
    // response.text() reads the entire stream and returns a Promise.
    return response.text();
  })
  .then(function responseThen (body) {
    var wrapper = document.createElement('div'),
      container = document.querySelector('#github-graph'),
      graph;

    // place the entire body of the page into a wrapper element.
    // it's not elegant, but it works.
    wrapper.innerHTML = body;

    // find the calendar/graph element in the response.
    graph = wrapper.querySelector('svg.js-calendar-graph-svg');

    // and finally add it to our page, within a pre-defined container element.
    container.innerHTML = graph.outerHTML;
  });
```

### Season to Taste

Since it's an SVG, I could have resized this thing by applying CSS, but that'd be
ugly. Unfortunately, Github left out some key attributes that make SVGs play nice
with CSS selectors and XPath in all browsers. So let's add those:

```js
graph.setAttribute('version', '1.1');
graph.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
graph.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
graph.setAttribute('xml:space', 'preserve');

```

And it was too wide for my left panel, so I trimmed some of the starting columns,
and then shifted the remaining to the left. (This also meant hiding shifting the
'month' headers left using CSS - Tip: `:nth-child` doesn't work with `text` SVG
elements outside of a `g` parent.)

```js
var gs = [].slice.call(graph.querySelectorAll('g g'));

for (var g of gs) {
  index = gs.indexOf(g);

  if (index < 26) {
    g.parentElement.removeChild(g);
  }
  else {
    g.attributes.transform.value = 'translate(' + (13 * (index - 26)) + ', 0)';
  }
}
```

And finally, the colors were way too bright for the left panel. Because there's
no other way to identify the original colors of the `rect` elements in the SVG,
I had to use the `fill` attribute to map to the correct CSS classes.

```js
for(var rect of graph.querySelectorAll('rect')) {
  fill = rect.getAttribute('fill').substring(1);

  if (colors[fill]) {
    rect.classList.add(colors[fill]);
  }
}
```

## Tying it All Together

The end result can be seen on my [Projects page](/projects).<br/><br/>

{% gist a2ec2f0432a6383b94d18cb4417a1d10 %}

## Improvements, Maybe?

If and when I have the will to tinker with this again, I'll likely implement some
caching within [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
, or more likely [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
so that I'm not pinging the bajeezus out of my own profile page.
