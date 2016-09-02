---
layout: post
title:  UI Tracking Alternative&#58; Gumshoe
date:   2016-09-02
subject: An open source tracking library and alternative to Google Analytics.
image: /assets/images/posts/ui-tracking-alternative-gumshoe.png
tag:
  - analytics
  - javascript
  - open source
  - tracking
---

For the better part of year, Gilt has been using an open source tracking library
we put together as an alternative to Google Analytics. I'll show you how to get
started using Gumshoe and walk through some of the concepts of the library.

<!-- more -->

## What is This Thing?

You can read the Gumshoe introduction [here](http://tech.gilt.com/analytics/2015/06/16/introducing-gumshoe).
That post outlines our reasons for the library and provides some background on how
[Gilt](http://gilt.com) is using it.

Simply put; Gumshoe is a library that collects data from the browser (the same as
Google Analytics) and provides a means to queue and send that data to an endpoint.
Baked into the distribution file are convenience methods, and access to the
reqwest library, available should you choose to use it.

## Getting Started

Head over to [the Gumshoe repo](https://github.com/gilt/Gumshoe) and grab the latest
file in the `dist` directory. Download that, place it in a logical spot in your
web app's assets directory, and add a `<script>` tag pointing to the file in the
html file of choice.

Time for code!

Here's is the basic setup for using Gumshoe (explanation to follow):

```js
(function (window) {

  var gumshoe = window.gumshoe;

  // register the transport with Gumshoe
  gumshoe.transport({

    name: 'shellscape-transport',

    /**
     * @param  {Object}  data  The object containing the data to be sent.
     * @param  {Object}  fn    A callback to the gumshoe lib indicating success or failure.
     */
    send: function (data, fn) {
      ...
    },

    /**
     * @param  {Object} data The object containing the data to be modified.
     *
     * @return {Object}      The modified data object Gumshoe should send.
     */
    map: function (data) {
      ...
    }
  });

  // tell Gumshoe which transport(s) to use.
  // alternatively, you can pass an array of strings to instruct
  // Gumshoe to send to multiple transports for each event.
  gumshoe({ transport: 'shellscape-transport' });

  // send an event with the name "page.view"
  gumshoe.send('page.view', {});

})(this);
```

The `gumshoe.transport` function registers a transport with the library. It accepts
an object with three properties: `name` - a `String`, and two functions: `send`,
and `map`.

The `send` function should always have a `data` parameter. After all, that's the
bit that will end up going somewhere. The `fn` parameter is equally as important,
as it let's Gumshoe know when the transport is done sending.

The `map` function should also have a `data` parameter. The function exists to
allow you to change or massage the object that will eventually end up passed to
the `send` function. This allows for total flexibility in the data you collect.
At Gilt we're adding a ton of extra metadata to each event by default, using the
`map` method.

## Using reqwest

The [reqwest library](https://github.com/ded/reqwest) is included in each full
distribution version of Gumshoe - mostly because Gilt still uses that in-house
as the defacto XHR wrapper [for better or worse](https://github.com/ded/reqwest/issues/162#issuecomment-235095900).
Using reqwest with a Gumshoe transport is super easy:

```js
send: function (data, fn) {
  var contentType = 'your-preferred-content-type';

  gumshoe.reqwest({
    url: url,
    contentType: contentType,
    type: 'json',
    headers: { 'Accept': contentType },
    method: 'PUT', // GET, POST, your choice.
    data: JSON.stringify(data),

    error: function (e) {
      fn.call(this, err, e.status);
    },

    success: function (response) {
      fn(null, response);
    }
  });
}
```

## Promise the World

Say you want to know exactly when Gumshoe is loaded and ready to send events.
[You totally can](https://github.com/gilt/Gumshoe/blob/master/src/gumshoe.js#L518)
by defining `window.gumshoe` and assigning `window.gumshoe.ready` before the
Gumshoe script loads.

```js
window.gumshoe = { ready: Promise.defer() };

Promise
  .all(window.gumshoe.ready)
  .then(...); // do fun stuff that you've been waiting for.
```

## Where Does the Data Go?

At Gilt, we're using a combo of a run-of-the-mill service, which ties intro
[Apache Avro](https://avro.apache.org/) for JSON validation, which feeds into
[AWS Kinesis](https://aws.amazon.com/kinesis/). If you've not used Kinesis for data collection, I highly
recommend checking it out. Kinesis streams combined with
[Lambda Functions](https://aws.amazon.com/lambda/) can be very powerful.

### _Cheers!_
