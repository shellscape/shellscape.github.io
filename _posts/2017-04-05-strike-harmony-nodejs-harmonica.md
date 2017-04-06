---
layout: post
title:  Strike a Harmony with Node.js and Harmonica
date:   2017-04-05
subject: Effortlessly use harmony flags with Node.js
image: /assets/images/posts/harmonica-nodejs-v8.jpg
image-opacity: 0.4
tag:
- flags
- harmony
- node.js
- open source
- npm
- module
- v8
- experimental
---

With every new version of Node.js, the platform quietly provides
 access to experimental features that ship with v8 which may not be quite ready
 for production use. That doesn't mean we can't use those features today, though.
 And there's a nearly effortless way to access them.

<!-- more -->

For those that may be new to Node.js or those who haven't yet delved into the
inner workings of Node.js - the platform runs atop Google's JavaScript engine,
[V8](https://developers.google.com/v8/) by default. V8 is constantly improving
and typically ships with features which may not be stable or ready for production
environments, that require command-line flags to enable. Those flags are the `harmony`
flags.

Prior to Node.js v7.6, the [asyc/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
feature - the feature I'd been most looking forward to - was locked behind
the`--harmony-async-await` flag. There's a good likelihood that [ES6 Modules](https://www.chromestatus.com/feature/5365692190687232)
will arrive in much the same way.

## Harmony Flags

Determining what `harmony` flags are supported by a version of Node.js is easy:

```bash
node --v8-options | grep "in progress"
```

For example, I'm currently on Node.js version 7.8. Running that command, the list
of `harmony` flags shows as follows:

```bash
→ node --v8-options | grep "in progress"
  --harmony_array_prototype_values (enable "harmony Array.prototype.values" (in progress))
  --harmony_function_sent (enable "harmony function.sent" (in progress))
  --harmony_sharedarraybuffer (enable "harmony sharedarraybuffer" (in progress))
  --harmony_simd (enable "harmony simd" (in progress))
  --harmony_do_expressions (enable "harmony do-expressions" (in progress))
  --harmony_restrictive_generators (enable "harmony restrictions on generator declarations" (in progress))
  --harmony_regexp_named_captures (enable "harmony regexp named captures" (in progress))
  --harmony_regexp_property (enable "harmony unicode regexp property classes" (in progress))
  --harmony_for_in (enable "harmony for-in syntax" (in progress))
  --harmony_trailing_commas (enable "harmony trailing commas in function parameter lists" (in progress))
  --harmony_class_fields (enable "harmony public fields in class literals" (in progress))
```

To enable a harmony flag, Node.js typically has to be run from the command-line
with the flag and the target entry script as such:

```bash
node index.js --harmony_array_prototype_values
```

Or to enable all `harmony` flags:

```bash
node index.js --harmony
```

And that can just get tedious for tooling, cross-team development, etc.

## An Easy Instrument

[Harmonica](https://www.npmjs.com/package/harmonica) is an NPM Module that allows
developers to use `--harmony` flags programmatically, which means
an end to the need for specifying command-line options for experimental `harmony`
features. If you've ever wanted to use experimental features within
[Gulp](http://gulpjs.com/) tasks, or have a need to run an app through wrappers
like [forever](https://www.npmjs.com/package/forever), this module takes the
command-line headache out of the equation.

Setting up Harmonica is painless. Within your entry file (index.js, app.js, etc)
place a call to `harmonica`:

```js
require('harmonica')();
```

That's the equivalent to `node --harmony`. Should you need only specific flags,
pass an `Array` of strings representing the flags you want to enable, without
the leading hyphens, as the first parameter.

```js
require('harmonica')([
  'harmony_function_sent',
  'harmony_do_expressions'
]);
```

And from there, let the module handle initializing the `harmony` flags you wish
to use, with no need to specify them within the terminal or command prompt.

## Not All Roses and Rainbows

It's really important to note that `harmony` features are not production ready.
And as folks have [pointed out](https://github.com/koajs/koa-hbs/pull/65), some
of the experimental / unstable features that are hidden behind `harmony` flags
can come with issues that affect security, performance, etc. It's never advisable
to use `harmony` features in a production environment unless thoroughly vetted.

Now get to dabbling with the latest that Node.js has to offer!

### Cheers!
