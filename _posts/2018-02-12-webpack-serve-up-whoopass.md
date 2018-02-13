---
layout: post
title:  webpack-serve Up a Side of Whoop-Ass
date:   2018-02-12
subject:
image: /assets/images/posts/webpack-serve.jpg
image-opacity: 0.7
background-position: 50% 0
tag:
- webpack
- node.js
- open source
- npm
- module
- beta
---

All aboard the S.S. Shipit. Come, break my things. I present 
[`webpack-serve`](https://github.com/webpack-contrib/webpack-serve): 
A lean, modern, and flexible _webpack-dev-server_ alternative. And it's 
gonna serve up a big 'ol side of whoop-ass on your development experience for 
[webpack](https://webpack.js.org).

<!-- more -->

**webpack-serve** is everything that `webpack-dev-server@next` was supposed to be,
in my mind anyhow. But `webpack-dev-server` (_WDS_) had one thing holding it up
that was always seen as a negative: over the years so many features were packed
into it, that it became a bit of a pill to maintain. Coupled with the inability
to embrace modern features, due in part to users with extreme legacy needs,
`webpack-dev-server` is essentially stuck where it is.

A new approach flips the script in a number of ways...

_Don't care about the backstory and just want the goods? Skip to
[The New Hotness](#the-new-hotness)._

### Koa

Gone is `express` and the unneeded complexity and heft of the module _in this
context_. It was convenient, but lighter-weight alternatives weren't available
when _WDS_ was conceived. `webpack-serve` makes use of [Koa](http://koajs.com/)
and all of it's bare-bones, greased lightning speed glory.

To make things easy while working with Koa, `webpack-serve` uses
[koa-webpack](https://github.com/webpack-contrib/webpack-hot-client) under the
hood, which handles wiring up `webpack-dev-middleware` and a new horse in the
race; [`webpack-hot-client`](#webpack-hot-client).

### API-First Design

One of the long-standing gripes about `WDS` was the fact that the API and the
CLI have never (maybe at one time?) been aligned. There are features that only
work on the CLI, options only supported by the CLI, and vise-versa. Not so with
`webpack-serve`. The CLI acts as a CLI should - as a gateway to the API.
Naturally there are some limitations as to what can be passed as an option via
the CLI, but there is alignment out of the gate none the less.

### webpack-hot-client

[`webpack-hot-client`](https://github.com/webpack-contrib/webpack-hot-client)
was explicitly written for `webpack-serve` with the intention of ditching the
old _Hot Module Replacement_ client scripts contained within `webpack` proper to
make use of modern features in modern browsers. Namely `WebSocket`. That does
mean that there are some user [limitations](#those-damn-gotchas), but more on that later.

Using this module also means we get some automatic sugar. `hot-client` injects
the necessary client scripts _and_ webpack plugins required to enable _HMR_. One
less thing the user has to handle.

### Add Ons

I mentioned earlier on that `WDS` was a kitchen sink approach.
Add-ons seeks to balance the force as the opposite. It's lean by nature and will
only ever contain the most common, most sought after features in a development
server. _But how you say?_ Teams of monkeys and hamsters painstakingly ran the
numbers. Educated guesses were made. In the future this may be backed up by
analytics and real numbers.

And so, add-ons. The idea of an add-on for this server allows the user complete
control over the middleware, and the order of that middleware, should they so need.
Things like _compression, bonjour broadcasting, history api fallback, and request
proxying_ have no business as a core feature. Instead, the user can easily add
features to their server. Have a look at
[some example add-ons](https://github.com/webpack-contrib/webpack-serve/tree/master/docs/addons)
which duplicate many of the features found in `WDS` that are omitted from
`webpack-serve`.

## The New Hotness

Using `webpack-serve` is easier than taking down that first huge Tolberone you
bought when you were a kid because hey a big-ass prism of chocolatey goodness
was too good to pass up and you can't like just eat half of it right?

#### We Better Install It First

```console
$ npm install webpack-serve@next --save-dev
```

We're still in pre-release beta, this-could-go-sideways mode, so you'll need
that `@next` part.

You can also install it globally, though it's not recommended, and will use a
local install if one exists.

#### CLI

```console
$ webpack-serve --config configs/webpack.config.js
```

#### API

```js
'use strict';

const serve = require('webpack-serve');
const config = require('./configs/webpack.config.js');

serve({ config });
```

## Those Damn Gotchas

The tagline for this project, _A lean, modern, and flexible webpack
development server_, is revealing. We've covered _lean_ and _flexible_ but
there's that _modern_ bit. The scripts injected into the client webpack bundle(s)
loaded by the server rely on browser-native `WebSocket`. That means the minimum
browser requirements are tied to that feature support. This is a hard requirement,
and naturally will limit the user-base - those with the need to support the afore
mentioned legacy browsers won't be able to leverage `webpack-serve`.

## Go On, Get You Some

So that's the gist, the long and the short of what this module is and why it
exists. Install it. Tinker. Break it. Open an
[Issue](https://github.com/webpack-contrib/webpack-serve/issues), or even better,
a Pull Request. Make it go bananas.

### Cheers!