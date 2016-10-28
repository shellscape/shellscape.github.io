---
layout: post
title:  From AWS Kinesis to Universal Analytics
date:   2016-09-27
subject: AWS, Lambda, Node.js, All the Goodies.
image: /assets/images/posts/kinesis-to-universal-analytics.jpg
image-opacity: 0.7
background-position: 50% 0
tag:
- aws
- kinesis
- lambda
- measurement protocol
- node.js
- open source
- tracking
- universal analytics
---

Google's [Universal Analytics](https://support.google.com/analytics/answer/2790010?hl=en)
 is the next step in their vision for analytics and tracking on the web, and across
 connected devices. With a new product comes a host of new features and means to
 communicate with the service. We're leveraging [AWS'](https://aws.amazon.com/)
 data-streaming cloud service [Kinesis](https://aws.amazon.com/kinesis/),
 [Lambda](https://aws.amazon.com/lambda/) and
 Google's [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/)
 to pump data from [Gumshoe](http://shellscape.org/2016/09/02/ui-tracking-alternative-gumshoe)
 straight into our Google Analytics account.

We're leveraging our superior analytics data against Google's already-outstanding
 dashboard, data visualizations, and reporting, and I'm going to show you how.

<!-- more -->

## The Basic Idea

I won't be getting into [how to get started with Kinesis](http://docs.aws.amazon.com/streams/latest/dev/kinesis-tutorial-cli.html),
or how you should go about [setting up a Lambda Function] for the stream. There are
oodles of tutorials and walk-throughs available for those. We will walk through
what the Gumshoe-To-Google Lambda function looks like and how it works.

So you have a data source. And you're feeding data to a defined Kinesis stream.
And you want that data to populate your Google Analytics account. [Peaches](https://www.youtube.com/watch?v=wvAnQqVJ3XQ).
Let's walk through a Lambda function to handle the incoming stream, map the
incoming data to produce a Google Analytics compatible object, and fire that bad
boy at the Measurement Protocol.

## Lambda Lambda Lambda

Let's get dirty!

### Setting Up the Function

Lambda Functions are essentially Node.js modules. You export a function (or set
of functions if you're getting fancy). For our needs, we only need to concern
ourselves with the `handler` function.

```js
exports.handler = (event, context) => {
};
```

![lambda meme](//i.imgflip.com/1beq7l.jpg)

You'll notice the use of Arrow Functions throughout the code, as AWS Lambda
supports Node.js 4.3. **However, it's important to note** that whatever version
of the 4.3.x branch it supports, does not like `let` or `const` keywords for
declaring variables, and will throw SyntaxErrors for days. I've found a few misc
features that [are supposed to be supported](http://node.green), but aren't. So
use ES6 with caution. Amazon is apparently on the case, but we've heard little
beyond "we're looking into it."

### Handling the stream

Next, we need to start examining records. You can configure the Lambda function
to accept different numbers of batched records. For Gumshoe, we handle 100 records
for each function execution.

```js
exports.handler = (event, context) => {

  event.Records.forEach((record) => {
    var buffer = new Buffer(record.kinesis.data, 'base64'),
      data = buffer.toString('utf-8');
  });
};
```

Something that seems to trip up most first-time Lambda developers is that
incoming data is actually in `record.kinesis.data`, and is Base-64 encoded. Gumshoe
data is within the stream as a JSON string, so we obtain the string from the `Buffer`
before attempting to do anything else with it.

### Mapping the Data

Next on our plate is mapping the data into a Google Analytics acceptable object.
This is obviously specially tailored for how we're using Gumshoe data, but you
should be able to plug this into your own source data format.

```js
function map (data) {

  var gd = data.giltData,
    pd = data.pageData,
    appName = gd.applicationName || 'web-unknown',
    result = {
      aid: appName,
      // the docs say that this is optional, but the hit builder tool says it's required. ¯\_(ツ)_/¯
      an: appName,
      // the client in this case is the user of which the event originated.
      // gumshoe stores a uuid in localStorage, but if that is empty, or the client
      // has an outdated version of gumshoe cached, we'll use sessionUuid.
      cid: data.clientUuid || data.sessionUuid || '00000000-0000-0000-0000-000000000000',
      dh: pd.hostName,
      dl: pd.url,
      dp: pd.path,
      dr: pd.referer,
      dt: pd.title,
      je: pd.javaEnabled,
      sr: pd.screenResolution,
      t: 'event',
      tid: 'UA-XXXXXXX-XX',
      ua: pd.userAgent,
      uid: gd.vendorUserId,
      uip: pd.ipAddress,
      ul: pd.language,
      v: 1,
      vp: pd.viewportHeight + 'x' + pd.viewportWidth
    };

  if (data.eventName === 'page.view') {
    result.t = 'pageview';
  }
  else {
    result.ec = 'Gumshoe Event';
    result.ea = data.eventName;
    // we have to use 'event label' and not 'event value' (ev) here because
    // ev can only be numerical.
    result.el = data.eventData;
  }

  return result;
}
```
Of note is the `cid` property; If you don't duplicate what Google does with this
property, you'll get wildly high visitor numbers. Google stores a ClientID in a
cookie with an expiration of 5 years. Gumshoe is replicating this by storing a
UUID in localStorage.

I highly recommend using the [Hit Builder Tool](https://ga-dev-tools.appspot.com/hit-builder/)
to validate how your data is mapped before attempting to send. (That's how I
found the little gotcha with the `an` property.)

You can find info on the rest of the properties in the
[Measurement Protocol Parameter Reference](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters).


### Virtual Page Views

It's worth noting that we had a number of [Virtual Page Views](http://blog.analytics-toolkit.com/2014/virtual-pageviews-google-analytics-why-how-when/)
being fired in our old Google Analytics code. And those needed to be replicated
to mesh nicely with older data in our dashboard. Without going into too much detail,
this is what you need to do with the request to re-create a virtual page view.

```js
// dp (document path) needs to be set to the / root original value of dl.
// dl needs to be prefixed by the protocol and host for GA to recognize it correctly.
ga.dp = ga.dl;
ga.dl = protocol + '//' + host + ga.dl;
ga.t = 'pageview';
ga.ea = undefined;
ga.ec = undefined;
ga.el = undefined;
```

### Custom Dimensions

So say that you have a slew of data that you want to use for reporting, but
Google/Universal Analytics doesn't have any pre-defined fields. In the old days,
you would have used Custom Variables. Not anymore. The new hotness is
[Custom Dimensions](https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets).
In the case of Gumshoe data, we have a slew of info we'd like to make available
for reporting.

```js
function customDimensions (data) {
  var GD = 'giltData',
    PD = 'pageData',
    dimensions = {
      'abTests': GD,
      'channel': GD,
      'hash': PD,
      ...
      'store': GD,
      'subsite': GD,
      'timezone': GD
    },
    keys = Object.keys(dimensions),
    result = {};

  keys.forEach(function (key, index) {
    var dataSet = data[dimensions[key]];
    result['cd' + (index + 1)] = dataSet[key];
  });

  return result;
}
```

What's paramount here is that each property position of `dimensions` corresponds
to an index of a Custom Dimension that we've defined in the Google Analytics
configuration. From there the code uses the property names, and values to know
which data property to access within `data`, which is a Gumshoe event, in order
to set the correct Custom Dimension value.

When creating the object for the Measurement Protocol Request, you must use `cd`
followed by the index of the Custom Dimension. That index starts at 1, just like
a Visual Basic Array (for those old-schoolers).

## Get it to Google

This snippet assumes your function is only handling one record per Lambda function
execution. If you're handling batches, you'll want to use the async management
technique of your choice. We use [Promises](https://github.com/shellscape/gumshoe-lambda-ga/blob/master/index.js#L221).

```js
var request = require('request');

function send (data) {

  var headers = {
      'User-Agent': 'Your Lambda Function/0.1.0',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    options = {
      url: 'http://www.google-analytics.com/collect',
      method: 'POST',
      headers: headers,
      form: data
    };

  request(options, (error, response, body) => {
    context.done(error, response); // or body
  });
}
```

This is all pretty straightforward. You must use a `POST` and we add a `User-Agent`
for giggles and if the need ever arises to debug who's making requests to the
Measurement Protocol for our account.

## The Entire Solution

To date our solution is working quite well, and as expected, numbers between our
test dashboard and production dashboard are within acceptable margins to declare
parity. With Gumshoe pulling down more data than GA, it's no surprise to us that
we have more events per-visitor than our production GA dashboard shows.

I've spared you the entity of the code for our solution within the post, but the
full source for our function is here: [gumshoe-lambda-ga](https://github.com/shellscape/gumshoe-lambda-ga).
Examining the code, you'll see how we're leveraging promises to work with the async
nature of making 100 requests per Lambda function execution, and documentation
for each helper in the file.

We also chose to upload a package to AWS Lambda, rather
than using their inline code editor primarily because of the capability of using
external modules like [request](https://github.com/request/request). If you'd like
to go this route as well, please examine [lambda.json](https://github.com/shellscape/gumshoe-lambda-ga/blob/master/lambda.json).

### _Cheers!_
