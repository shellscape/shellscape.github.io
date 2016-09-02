---
layout: post
title:  Shellscape Refresh and Rewrite
date:   2016-08-29
subject: Fortunately, something always remains to be harvested. So let us not be idle.
tag:
  - blog
  - jekyll
  - site
---

After a few years of neglect and a lack of direction for the site, Shellscape.org
is alive and kicking. Years of complacency and a switch to MacOS left the site in
the same state I'd left it in late-2013. I thought I'd share the details of
what went into the refresh and rewrite of the site for 2016.

<!-- more -->

## Let's Get Going

I've used [Jekyll](https://jekyllrb.com) + [Github Pages](https://pages.github.com/)
a bunch in the past ([1](https://github.com/gilt/tech-blog),
[2](https://github.com/shellscape/shellscape-blog.github.io)) and love it as
a platform for easy authoring with maximum control over content and presentation.
So it was the logical choice.

But see, I'm not a designer. I can hold my own on small amounts of original
graphical work, but I'm no Illustrator all-star. And so I started out at
[Jekyll Themes](http://jekyllthemes.org), and after a few pages ran across the
theme [Halve](https://github.com/TaylanTatli/Halve) by Taylan Tatlı.

## Working With the Theme

Halve is a theme based on the design that someone had put together for a
portfolio site. It seemed fitting but would need heavy modification since I'm
not running a design portfolio. Let's be honest, there's not many themes out there
that are drop-in ready if you're planning on running an entire site on it.

I _really_ appreciate the time and effort people take to share works freely. It's
for the same reason that I post all of the software and source I've written freely.
However, out of the box it was clear that Halve needed some serious work. The code
hadn't been optimized, oodles of duplication, and aside from the use of SASS there
really wasn't any modern methodology used within it. After working with it for some
time, I decided it would save time to simply rewrite it.

The rewrite roughly included:

  - Breaking up the main SASS files into smaller, component-focused files, and
  reorganizing the imports.
  - Applying [semantic HTML](https://en.wikipedia.org/wiki/Semantic_HTML) including
  proper HTML5 tags, and removing extraneous IDs and classnames.
  - Rewriting SASS for semantic markup.
  - [DRYing](http://alistapart.com/article/dry-ing-out-your-sass-mixins) out the SASS
  - Updating reset.scss.
  - Linting and optimizing SASS.
  - Rewriting the Javascript for the canvas snow animation.
  - Removing jQuery, a bunch of plugins, and their subsequent script.
  - Removed the overlay portfolio showcase.
  - Added and customized a sidebar navigation element from [Lanyon](https://github.com/poole/lanyon).
  - Assets reorganization.
  - Includes reorganization.
  - Original layouts for the individual pages.

All said and done the site still shares some visual aspects with the Halve
theme, but the code that makes it all happen has diverged significantly. Again,
for the record Halve was a great starting point and saved me a lot of effort by
providing a visual scaffold out of the gate.

## Goals and Such

Immediate goals for the site are to showcase the open source work that I'm doing
and have done over the last few years. I'm also going to start blogging again;
something I haven't really done in healthy amounts since I worked with
[appendTo](https://appendto.com) (when they were still a web development consultant shop).
And of course, all of my aging Windows software will remain up and available.

The refresh of the site also ties in with a forthcoming post - _Rebuilding a Personal Brand_ -
in which I'll be outlining additional meta.

### _Cheers!_
