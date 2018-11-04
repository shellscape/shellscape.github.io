---
layout: post
title:  How Webpack and JSF Stole Code, Returned It, and Assigned Bad Copyright
date:   2018-11-03
subject:
image: /assets/images/posts/webpack-jsf-cla.jpg
image-opacity: 0.7
background-position: 50% 0
tag:
- webpack
- node.js
- open source
- npm
- module
- extend
---

Or, _Why You Should be Dubious About Contributor License Agreements_.

In a corner of the webpack ecosystem lives a small, mostly unnoticed module: [webpack-log](https://github.com/webpack-contrib/webpack-log). webpack is a JavaScript Foundation project and contributions to webpack are subject to the JSF Contributor License Agreement (CLA). In August 2018, a webpack-contrib admin copied code from one of my modules into that project wholesale, verbatim, and without retaining the license. This is a short cautionary story of my efforts trying to get that corrected.

<!-- more -->

_It is likely that this post will be attacked by those passionate about webpack and by those in the organization who dislike me personally. There are many good people whose livelihoods depend upon webpack, the organization, and the donations it receives. If you or your company are donating to the project, **please** continue to do so. However, if you feel the information in this post demands improvement of the organization, please ask them to do better._

I do not like the spotlight in tech, and I do not seek it. However, I do feel that the information in this post needs to be shared. This post will not name names and will not call out individuals for action, or a lack thereof. Rather, already public information will speak for those involved.

_Update (Nov 3rd 2018 23:12 UTC): Since posting and sharing this article, the webpack project has [taken steps to remedy the situation](https://github.com/webpack-contrib/webpack-log/pull/14). It's regrettable that it took this article to gain action, but it is appreciated. I don't have knowledge as to whether or not JSF had a part in the remedy. This article should still serve as a cautionary tale on licensing, copyright, and Contributor License Agreements._

## Backstory

I want to quickly share some backstory that I have not shared publicly prior, so that the issue, situation, and links contained in this post have some context for the reader.

In mid June of 2017 I was contacted by webpack leadership to assist on an [emergency fix](https://github.com/webpack/webpack-dev-server/pull/942) for a somewhat serious [SSL security flaw in webpack-dev-server](https://medium.com/@mikenorth/webpack-preact-cli-vulnerability-961572624c54), because I had made some prior contributions to that project. Shortly thereafter I was invited to be a maintainer and, following that a webpack-contrib admin and webpack core team member. I was also introduced to the contributor payment program at the time and actively participated. As a new husband with our first child on the way, that program was massively helpful in starting our new family and I benefited from it.

I created a bunch of new modules for the webpack community in webpack-contrib, and made a concerted effort to challenge the status quo in the project and in the User Experience. One of those modules happened to be `webpack-log`. To quote a favorite movie, _["I fight for the users"](https://www.youtube.com/watch?v=8kcgosLwPDE&t=10s)_. But I was naive. I pushed too hard, too fast and vastly underestimated the deep nepotism and significant hero-worship that exists in the webpack organization. The culmination of which occurred at the same time the organization started to run out of funding, forcing in a change in how donations were allocated and distributed that I vehemently disagreed with. As a core team member, it was my responsibility to make my dissent known. A later, ill-fated effort I undertook to replace the default CLI for webpack resulted in poor communication within the core team, poor decisions by leadership, and was ultimately the straw that convinced me to walk away from the team.

Communication from my end was not perfect. I can be brash, passionate, and have a deep sense of pride and ownership in code that I write. I acknowledge my flaws. Despite 18 months of dedication and work, several new projects for the benefit of users, and huge gains for the webpack user experience, I was subsequently accused of violating a non-existent Code of Conduct, cheating users and the project, labeled a thief, a poor developer, and [toxic](https://github.com/webpack-contrib/webpack-log/issues/11#issuecomment-423636767) by most of the organization's members. Those members who disagreed did not speak publicly in my defense.

I was shunned, an outcast - **open dissent is not welcome in webpack.**

## Enter webpack-log

I got involved in webpack because it was starting to be used by the company I was working for at the time. I was aghast as just _how bad_ the user experience for webpack was. In December 2017 I put together webpack-log to try and give some consistency to the log output webpack and ecosystem tools were generating, and to make my eyes bleed a little less while using it.

Just prior, I had created [loglevelnext](https://github.com/shellscape/loglevelnext), which was at the time a fork of the still much-loved and wildly-popular [loglevel](https://github.com/pimterry/loglevel). I forked because at the time I had proposed changes to `loglevel` that the maintainer couldn't agree with. (I love open source for that!). loglevelnext was a project created for work and used primarily by colleagues internally on development environments. I leveraged loglevelnext in webpack-log as a dependency. The feature set was apt and it suited the goals I had for webpack-log both in the console and in the browser.

And so, webpack-log went on to be used in the new webpack-contrib projects I created, webpack modules I maintained, and in several third-party modules, and it sat quietly in the corner.

## Curiously Copied Code

 Now, I'm not a whore for download counts, but I do check in on them from time to time out of curiosity and for various other reasons. In September, a month after the copy commit to webpack-log, I noticed a steep drop in loglevelnext downloads, and that webpack-log was no longer a dependent of the module. Naturally; I investigated.

Following my falling-out with the webpack organization, nearly all of the projects I contributed were marked _[DEPCRECATED]_, users were notified they were now unmaintained, and code I had contributed was summarily [erased from git history](https://github.com/webpack-contrib/schema-utils/pull/25) altogether. In that same month, loglevelnext was [copied wholesale into webpack-log](https://github.com/webpack-contrib/webpack-log/commit/b5c2017e45b013a1b4c9e09694fc120afc3a307a), and removed as a dependency. Weird, but OK.

But not OK. My license for loglevelnext wasn't retained. My code was effectively stolen. A curious event given the previously mentioned deprecation and git history rewrites.

I immediately thought about filing a DCMA. I would have been well within my right to do so, but that would ultimately hurt the users. Instead, I cringed and decided to open an issue.

## The Issue

The [Github issue](https://github.com/webpack-contrib/webpack-log/issues/11) started out plainly enough. Surprising, the organization's own members weren't even on the same page as to how the license should be attributed, or whether a standard MIT license could be used with the JavaScript Foundation's Contributor License Agreement. The maintainer behind the copy commit _tried_ to make it right by [adding my name](https://github.com/webpack-contrib/webpack-log/pull/12) to the project's LICENSE file, but bungled the attempt. By adding my name to that license file in the way done, they had granted me (and another individual) copyright over the _entire project_. One might think that's no big deal, and in the grand scheme of things it's probably not - but it isn't correct licensing. What should have been done instead, would have been to include the LICENSE file from loglevelnext in the directory of the copied code. That would have limited my copyright to only my code. Alternatively, they could have pasted the copyright as a header in the file in question.

The crux of the situation now is that by copying loglevelnext into the webpack-log project, effectively hard-forking and adopting the project under JSF-owned webpack-contrib, the user asserted that they could **circumvent the JSF adoption process** by copying MIT-licensed code into a project and submitting the code under a CLA.

To [quote](https://github.com/webpack-contrib/webpack-log/issues/11#issuecomment-423500502) a [JSF board member](https://github.com/webpack-contrib/webpack-log/issues/11#issuecomment-423573438) in the issue:

> The JS Foundation has [a process](https://github.com/JSFoundation/TAC/blob/master/Project-Lifecycle.md#applying-to-join) for adopting projects. Copying the code into a JSF-supported organization while removing the old license (or inserting the JSF license) is definitely not the process. To ensure that we have the legal rights to the software, we need the author(s) to transfer ownership.

> What seems to have happened here is that a large amount of someone else's code was copied from an outside project to this one without attribution, and without the license specified in their code. So now it de-facto appears to have the JSF license (since it's in this repo) but is not code licensed to the JSF. You can't avoid having the JSF adopt someone else's project by copying the whole project source code into yours.

And that's where the MIT license and the JSF CLA get really, really murky. After that the issue gets testy.

I admit; I was snarky in my final reply before the issue was closed. I should have done better there. I have real trouble abiding false statements about myself, and having someone so completely naive about the situation misrepresenting my intentions. Unfortunately, after that exchange, naming-calling by an organization member ensued and the issue was closed and locked (notably without rebuke). The result of that issue was a ban from webpack and webpack-contrib organization repositories.

The copyright issue however persists, and the webpack/webpack-contrib organization's members have not addressed it further.

## Legal Eagles

After being summarily banned by both webpack and webpack-contrib organizations, I took my grievances to the next logical recourse: JavaScript Foundation's legal department. Since webpack is a JSF project, I thought their legal department should surely be able to remedy this, given that one of their members are in support of a resolution.

Everyone I conversed with in JSF's legal department was extremely polite and communication was excellent. That's pretty much where the positive experience ended. After a month of inaction, I contacted them to let them know of my intention to write this article. Purely as a courtesy and stated as much. A few days later, a new representative for their outside counsel contacted me and stated that some responsibilities had changed hands. They asked for more time and I enthusiastically granted it; I had thought an additional week would be plenty. But after nearly  two weeks passed with no visible action, nor resolution, nor statement of position from JSF, I have to consider the interaction with JSF a failure. Unfortunately, [concerns shared](https://twitter.com/scott_gonzalez/status/1048220377934155778) about inaction from JSF legal seem to prove true.

Given that JSF ultimately holds authority over code contributed under the CLA, this should be a cause for some concern about copyright and the enforcement of the CLA and how it, and your contributions under it, will be handled by JSF and projects belonging to it, moving forward.

## In Closing

Be dubious about signing a Contributor License Agreement. Be especially dubious about signing one in which the organization members don't fully understand their own CLA, and about which the organization who owns the CLA won't act upon it.

I've since moved most of my personal projects to the copy-left [Mozilla Public License](https://www.mozilla.org/en-US/MPL/2.0/), which should (hopefully) help to prevent this kind of scenario in the future within any project underneath the JavaScript Foundation.

And finally, if any of my own code or repositories are in violation of copyright or have failed to cite or include license correctly, please [let me know](https://github.com/shellscape/meta/issues/new) and it shall be remedied quickly.

### Cheers!

_Printing Press Image By African American Photographs Assembled for 1900 Paris Exposition [Public domain], via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Printing_with_printing_presses_at_Claflin_University,_Orangeburg,_S.C._LCCN93506648.jpg)_