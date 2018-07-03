---
layout: post
title:  Webpack, Now With Extended Flavor!
date:   2018-07-02
subject:
image: /assets/images/posts/flava-flav.jpg
image-opacity: 0.5
background-position: 50% 0
tag:
- webpack
- node.js
- open source
- npm
- module
- extend
---

_Warning: GIFs and pop-culture references incoming_

I'm just crazy psych'd to announce a new feature available to users of
[`webpack-command`](https://www.npmjs.com/package/webpack-command) and
[`webpack-serve`](https://www.npmjs.com/package/webpack-serve). Like,
[Ken Wheeler in a crisp new pair of America short-shorts](https://twitter.com/ken_wheeler/status/1013206931207524357)
excited.

<!-- more -->

![zooom](http://www.bioexamples.com/wp-content/uploads/2018/04/van-wilder-quotes-je3t81qpbjqbywdduxt1zm9nj2q_.gif)

A webpack configuration file can now extend the properties and collections from
other sharable or common configurations, and can be done right in the config
_without_ installing any additional plugins, modules, or utilities.

The premise here is the same as you'll find in
[ESLint](https://eslint.org/docs/user-guide/configuring#extending-configuration-files)
and we make no bones about stating that this feature was modeled after ESLint and
how that project manages extending configs. The concept of a sharable config
directly supported in this manner by a tool goes at least as far back as
[ESLint 0.21.0](https://eslint.org/blog/2015/05/eslint-0.21.0-released) in May
of 2015. That's a while back, and there are certainly early examples. It's about
time that landed for webpack users.

## The Chimi-Effing-Changas

So here's how this works - Take a super bare-bones base config:

```js
module.exports = {
  name: 'base',
  mode: 'development',
  ... <all kinds of fun webpack props>
}
```

And a config that we want to inherit (or extend from) our base config:

```js
module.exports = {
  extends: <path to base config>
  name: 'batman',
  plugins: [ new BatmanWebpackPlugin() ]
}
```

And you ✨magically✨ end up with:

```js
module.exports = {
  name: 'batman',
  mode: 'development',
  plugins: [
    new BatmanWebpackPlugin(),
    ... <base plugins>
  ],
  ... <base fun webpack props>
}
```

OMG that's so incredible and underwhelming!

![but why](http://www.reactiongifs.com/r/but-why.gif)

Let's say that you work for a company that maintains a Software As A Service
application that's customized per-client and requires slightly different builds,
which are deployed to their own instance. ("Sales Engineers" encounter this
often). You might find yourself in the less-than-ideal situation of a base
webpack configuration that ends up being copied and pasted, and then tweaked
just a tad in each copy, for each client. Now you've got the same build logic
spread all over digital-hell and back. Messy.

Introduce a sharable config, complexity is instantly reduced, and the client
configs now only appear to contain only what needs to be customized.

## Alternatives and Existing Solutions

As mentioned before, the concept at its core is not new. A number of NPM modules
exist which perform similar functions. The most popular of which is
[webpack-merge](https://www.npmjs.com/package/webpack-merge). Many others are
obscure and haven't yet found the same kind of user base that `webpack-merge`
has developed. If you'd rather go with a module and some code around your config,
`webpack-merge` is a great option and we wanted to make sure that project got a
shout out.

We didn't use an existing module to implement this, however. The reasons were
many, but the big ones were:

- `@webpack-contrib/config-loader` already handled the task of resolving configs
(`Functions`, `Promises`, etc)
- We found the reduce-right approach functionally superior and performant
- Filtering approaches from other modules were more mature, but not as flexible,
and so we desired a different architecture to build on
- Introducing config property examination for determining `extents` (base,
sharable configs) would have disrupted existing modules significantly

## Lobster and Cracked Crab for Everyone

Shared or base configs can also extend other configs, and those can extend yet
other configs, and so on, and so on. Recursive extending config happy fun time!

![billy valentine](https://i.giphy.com/media/5xtDarqlsEW6F7F14Fq/giphy.webp)

So along with infinitely recursive extendable configs, this feature also has the
ability to filter different portions of an extended config by different rules.
And of course you can control which filter rules to use. To use filters you'll
have to specify your `'extends'` slightly different:

```js
module.exports = {
  extends: {
    configs: <some path>,
    filters: { plugins: 'constructor', rules: 'none' },
  },
  ...
}
```

You get the idea. Use an `Object` for `'extends'` instead of an `Array` or
`String`, and specify which filters to affect and what their filtering rule
should be. Boom. Done.

The existing filters can perform a rudimentary de-dupe on
`module.rules` and `plugins`. The default `rules` filter compares `module.rule`
tests and the `plugins` filter has the ability to filter on plugin `constructor`
name. You can read more about filtering
[here](https://github.com/webpack-contrib/config-loader/blob/master/docs/EXTENDS.md#filtering-properties-and-collections).

Presently there are only two filters _but we really want to add more based on
what you all need_. We can't emphasize that enough.

## Have Fun Storming the Castle

There's no limit to what sharable configurations can look like, or how deeply
nested they can be. All-in-all this gives webpack users a lot more flexibility
and freedom when authoring many configs. So that's fun.

There's also room for improvement, and the use-cases we had to work with to start
were limited, and we know that. That said, if this feature can be improved to
help you work with webpack a little bit easier or you have filter suggestions,
[please let us know](https://github.com/webpack-contrib/config-loader/issues/new/choose)

![ok I'm done](https://i.giphy.com/media/OzTUhZE7LXTig/giphy.webp)

### Cheers!