---
layout: post
title:  Floaties for Gulp Users
date:   2017-01-08
subject: Provide some passive assistance to your Gulp users
image: /assets/images/posts/floaties-for-gulp-users.jpg
image-opacity: 0.8
tag:
- assist
- gulp
- help
- npm
- plugin
---

In large or distributed teams, sharing knowledge about tooling can be a
 challenge. When a toolchain or pipeline gets to be big and contains a lot of
 code, that challenge grows with the size of the codebase. Providing a solution
 is as easy as describing your tasks.

<!-- more -->

## gulp-assist

I recently put together [gulp-assist](https://www.npmjs.com/package/gulp-assist)
as a tool to address that issue. An extension of sorts for
[Gulp](https://www.gulpjs.com), gulp-assist displays meaningful information on
a tooling setup in a stylish format. How meaningful is completely up to the
developer providing it.

What about the `--tasks` and `--tasks-simple` flags that Gulp already has? Those
are great if one wants a basic idea of the structure of the tooling, but gives us
nothing if we want to know about the individual tasks.

## Floaties and Lifejackets

That all sounds lovely, but what's this thing look like?
[GIMME'DA CASSHHH!](https://www.youtube.com/watch?v=K0nGwZfPLB0). As run in the terminal:

![](https://github.com/shellscape/gulp-assist/blob/master/gulp-assist.png?raw=true)

And for each individual task including flags, and their descriptions:

![](https://github.com/shellscape/gulp-assist/blob/master/gulp-assist-task.png?raw=true)

Is purty no?

## To Inflate, Pull Down On The Tab

This thing really is [easy to use](https://www.youtube.com/watch?v=HWrjBBXjjhM&t=1m3s),
and the few extra keystrokes it costs will undoubtedly save time down the road.

```js
const gulp = require('gulp');

// initialize the module
require('gulp-assist')();

gulp.task('lint', () =>
	// ...
);

gulp.assist('lint', {
  desc: 'Analyzes code for errors and convention violations.',
  flags: {
    src: 'Specifies a directory / module to inspect, within the `src` directory.'
  }
});
```

Define your tasks as per usual, then register the task with gulp-assist. It's
**important to note** that gulp-assist needs the task defined with Gulp before it
can be registered with gulp-assist. That's an intentional design decision, but
I'm always [open to suggestions](https://github.com/shellscape/gulp-assist/issues).

## Alternatives

The great thing about Gulp is that there's a slew of alternatives for any one
thing you might want to get done. With that, you might enjoy
[gulp-help](https://www.npmjs.com/package/gulp-help) more so than my extension.
It hooks the `gulp.task` method to allow for additional parameters that
describe a task.

I didn't care for this approach as I prefer separation of
concerns and dislike modifying established API. I also prefer the output of
gulp-assist (but I'm obviously biased).

### Cheers!
