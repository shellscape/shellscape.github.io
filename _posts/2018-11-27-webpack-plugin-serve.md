---
layout: post
title:  Plugin to a Fresh Webpack Development Server
date:   2018-11-27
subject:
image: /assets/images/posts/plugin-fresh-dev.jpg
image-opacity: 0.7
background-position: 30% 0
tag:
- webpack
- development
- server
- open source
- npm
- module
---

The developer experience is something that should be continuously improved upon. It is after all, just as important to the daily lives of developers as the user experience is to end-users of our efforts. For bundlers, a great development server and the experience that goes along with one is crucial.

<!-- more -->

Nearly a year ago, I sat down to try and remedy the development server experience for [Webpack](https://www.npmjs.com/package/webpack) by authoring webpack-serve. The _[webpack-serve](https://www.npmjs.com/package/webpack-serve)_ project was meant to be a complete replacement for _webpack-dev-server_; a project that suffers from oodles of quirks and edge cases, development stagnation, extreme legacy support requirements, and an aging architecture increasingly difficult to maintain. Unfortunately, what started as an effort to simplify with _webpack-serve_ was revealed to have its own shortcomings. It was too large a departure from what devs had come to expect, many concepts behind it were too abstract, and it just tried to be too fancy. Following a handoff to the Webpack organization, it was sadly, immediately deprecated. _(For users of webpack-serve, the project is now being maintained on [this fork](https://github.com/shellscape/webpack-serve).)_ For all of its faults, _webpack-serve_ was still a step above _webpack-dev-server_, and was a step in the right direction.

From all that has emerged [`webpack-plugin-serve`](https://github.com/shellscape/webpack-plugin-serve) - A Development Server fully-contained in a Webpack plugin.

## Code Cadre Confab

Unbeknownst to me there was a solid chunk of users who enjoyed what webpack-serve was trying to accomplish. In late September I was approached by a few talented Brazilian developers who were super bummed about Webpack's decision to shutter webpack-serve. Their idea was to, at the least, fork and maintain webpack-serve. For their taste, webpack-serve was a better choice than webpack-dev-server, despite its own set of quirks. And so we talked about how a fork might look. The idea quickly emerged that this could be a platform to launch a standard experience for many bundlers, not just restricted to Webpack, and it could be accomplished within a plugin.

Targeting Webpack was the most logical starting point. We had a lot of accumulated knowledge about how a server should and shouldn't interact with Webpack compilers and bundles, and of maintaining webpack-dev-server and authoring webpack-serve. Between that and the real-world, day-to-day user perspective that Matheus and Sibelius were able to provide, we were able to create something really great. Much of this plugin is just "plumbing," but it's how that plumbing is arranged that makes this project a stand-out in the space.

Our contributing team on this effort consists of:  
  [@bebraw](https://twitter.com/bebraw)  
  [@sseraphini](https://twitter.com/sseraphini)  
  [@matheus1lva](https://twitter.com/matheus1lva)  
  [@shellscape](https://twitter.com/shellscape)  
  
  _(And let me just say how great working with those folks it is! Please give them a follow.)_

## Scintillatingly Savory

If you're new to Webpack, it would be a great move to read up on [how to use Plugins](https://webpack.js.org/concepts/plugins/). `webpack-plugin-serve` is a Webpack Plugin, a self-contained development server triggered by a Webpack build, and part of the Webpack process. Users must add an instance of the plugin to their Webpack configuration. A configuration might look something like this:

```js
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const options = { ... };

module.exports = {
	entry: [
		'app.js',
		'webpack-plugin-serve/client' // ← important: this is required, where the magic happens in the browser
	],
  plugins: [
    new Serve(options)
  ],
  watch: true  // ← important: webpack and the server will continue to run in watch mode
};
```

When a Webpack build is initiated, the plugin sets itself up. That includes a [Koa](https://koajs.com) application, built-in and user-defined middleware is setup, and a few other static goodies that need to be ready to go down the line. Once a build starts, a web server is spun up and attached to the Koa application, a [WebSocket server](https://github.com/websockets/ws) instance is attached to the web server, and the plugin begins listening to the compiler instance for notification of a refreshed build. If Hot Module Replacement is enabled, it'll communicate changes via WebSocket to the client/browser and you'll see changes based on the options passed to the plugin.

There are a myriad of different [options](https://github.com/shellscape/webpack-plugin-serve/blob/master/README.md#options) available to configure and use the server. We've also [prepared a few recipes](https://github.com/shellscape/webpack-plugin-serve/tree/master/recipes) that users can reference to get started, and we're keen to add more.

## Decidedly Different

First and foremost, it's a plugin. Before starting development to we searched quite a bit to try and find a pre-existing, similar solution. We believe this is a novel approach for Webpack. As a plugin it doesn't have the learning curve of a separate Command Line Interface and there are no subsets of flags to learn or understand to use it. Plugins are one of the first things that new Webpack users learn about - a perfect entry-point for a bolt-on development server. And by leveraging the compiler directly the server can offload responsibilities, like file watching, to the compiler and can avoid reinventing the wheel, thus reducing complexity.

Just as with webpack-serve, we chose to use WebSockets for server-client communication (the magic that enables Hot Module Replacement instructions in the client/browser). Unlike webpack-serve, we were able to leverage a new "serverless" WebSocket server implementation. We learned from webpack-serve that while the intention behind a secondary WebSocket server was good, it increased complexity and issues with very little benefit.

We also took the approach of building in support for the most popular feature sets of the other two development server options. Only this time around, there's no getting fancy with it:

- User-defined and user-ordered middleware is available, though vastly simplified as compared to webpack-serve
- Useful overlays for errors and warnings, and progress are included out of the box, and were developed using a somewhat-standardized approach, and have a sexy, uniform look and feel for a consistent experience.

<div align="center">
	<img height="244" src="https://raw.githubusercontent.com/shellscape/webpack-plugin-serve/HEAD/assets/status-overlay.png" alt="status overlay" style="height: 244px !important">
</div>

- Features like HTML History API Fallback, Proxying, and Compression have support baked in, though we differ in that options are passed straight through to the underlying dependencies. That makes use and documentation much easier for the end user, as there's no intermediate layer to have to understand.
- Built-in Troubleshooting for common errors:

<div align="center">
	<img height="300" src="https://raw.githubusercontent.com/shellscape/webpack-plugin-serve/HEAD/assets/404.png" alt="status overlay" style="height: 300px !important">
</div>

I'd also argue that this approach is far cleaner than the others that preceded it. We've given a lot of consideration to how the feature set might be expanded and have put an architecture in place that should allow for new features to be supported without adding the kind of complexity that cripples maintainability. We learned quite a bit from the shortcomings of both webpack-dev-server and webpack-serve, and really made an effort to improve upon them.

Lastly, and what is sure to be a slightly controversial choice, we chose to support only the [Active LTS versions](https://github.com/nodejs/Release) of Node, which is presently v8 and v10, and the _Current_ version (Node v11 as of this post date). We've covered why in our [FAQ](https://github.com/shellscape/webpack-plugin-serve/blob/master/.github/FAQ.md).

## Forthright Finale

Moving forward we're open to adding more features, or developing the modules to provide pass-through features, as use-cases arise. The Node server space is so rich in functionality that we should be able to easily expand `webpack-plugin-serve`or, most importantly, provide excellent direction for how users can apply needed functionality, easily. Aside from that, the stack is pretty solid. I'm sure the Webpack user-base will surprise us with scenarios we haven't considered.

We're just a few developers hoping to provide a better experience for everyone, and would really appreciate folks spreading the word about it. Please don't hesitate to open an issue or hit us up on Twitter. And if you'd like to help us improve the project, please consider [contributing](https://github.com/shellscape/webpack-plugin-serve).

### Cheers!

_Ice Skating Waiter image, via [http://historydaily.org/ice-skating-cocktail-waiters](http://historydaily.org/ice-skating-cocktail-waiters)_