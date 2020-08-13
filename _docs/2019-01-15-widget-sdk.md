---
layout: doc
title: Widget SDK
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---

<style>
    table thead tr th {
    /* transform: rotate(90deg); */
    font-size: 14px;
    padding: 0px 1vh;
    }
</style>

# Overview

This document describes the Signagelive Widget SDK methods available and their purpose. Currently the SDK has not been rolled out on all devices so some features are limited to Chrome OS and Brightsign players only.

The SDK is available <a href="https://drive.google.com/file/d/1RyA_Z7Zvr6Zl31EwL1YxQL06IxWgdnsy/view">here</a>.

# Methods

## Signagelive.sendReadyToDisplay()

|              |                                                                                                                                                                                                                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | To be used to signal when the player has downloaded the data and assets within the widget and is ready for the content to be shown on screen. By default the media player will automatically show the widget after 2 seconds as this method will not allow it to be delayed further. |
| Parameters   | n/a                                                                                                                                                                                                                                                                                  |
| Availability | ChromeOS and Brightsign devices                                                                                                                                                                                                                                                      |
| Example      |
{% highlight javascript %}
Signagelive.sendReadyToDisplay().then(function() {         console.log('Widget is displayed...'); });
{% endhighlight %}

## Signagelive.setData(key, value, shared)

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | A localStorage alternative; where data can be stored on the player and can persist between reloading the widget.                                                                                                      |
| Parameters   | key (string): The name/reference for the data being stored. value (string): The data that is going to be stored. shared (boolean): If set to true then data will be accessible to all widgets published to the player |
| Availability | Currently only used in ChromeOS devices due to native localStorage support being available elsewhere                                                                                                                  |
| Example      |
{% highlight javascript %}
Signagelive.setData('status', data, true).then(function () {       console.log(“Data stored as ‘status’”); });
{% endhighlight %}

## Signagelive.getData(key, shared)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | A localStorage alternative; where data stored with Signagelive.setData(key, value, shared) can be retrieved.                                                        |
| Parameters   | key (string): The name/reference for the previously stored data. shared (boolean): If set to true, it will search for this key in the global storage of the player. |
| Availability | Currently only used in ChromeOS devices due to native localStorage support being available elsewhere                                                                |
| Example      | Signagelive.getData('status', true).then(function (data) {         self.dataResponse = JSON.parse(data); });                                                        |
{% highlight javascript %}
Signagelive.getData('status', true).then(function (data) {         self.dataResponse = JSON.parse(data); });
{% endhighlight %}

## Signagelive.log(msg)

|              |                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | When using this it allows the message to be printed both to the developer console and to the DOM.  This means even without a debugger you can still log statements, you can preview these by adding a div called trace-log to the DOM. You will need to make sure this is layered on-top of the other content in your widget - possibly using CSS like z-index and absolute positioning.                                            |
| Parameters   | msg (string): The string or response that you want to be returned, for example a string to denote if something has succeeded or failed.                                                                                                                                                                                                                                                                                             |
| Availability | All devices                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Example      |
{% highlight javascript %}
$.ajax({
    url: ‘https://exampleurl.com/feed.xml’,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': 'XMLHttpRequest',
        },
        type: 'GET',
        dataType: 'xml',
        success: function (response) {
            Signagelive.log('success ' + response)
            },
        error: function (error) {
            Signagelive.log(error);
            }
        });
{% endhighlight %}


# Supported Devices

|                                       | LG          | Brightsign HD Series | Brightsign LS Series | Brightsign XD Series | Brightsign XT Series | IADEA / ViewSonic / Planar | Chrome OS |
|---------------------------------------|-------------|----------------------|----------------------|----------------------|----------------------|----------------------------|-----------------------------------|
| Signagelive.setData(key, val, shared) | *Coming soon* | ✔                    | ✔                    | ✔                    | ✔                    | ✘                          | ✔                                 |
| Signagelive.getData(key, shared)      | *Coming soon* | ✔                    | ✔                    | ✔                    | ✔                    | ✘                          | ✔                                 |
| Signagelive.log(msg)                  | ✔           | ✔                    | ✔                    | ✔                    | ✔                    | ✔                          | ✔                                 |
| Signagelive.sendReadyToDisplay()      | *Coming soon* | ✔                    | ✔                    | ✔                    | ✔                    | ✘                          | ✔                                 |

<br>

|                                       | Philips | Samsung SSSP D/E | Samsung Tizen | Amazon Fire TV Stick (HD/4k) | Browser / Broadcast Player | Legacy PC | Electron Client (Windows/Mac) |
|---------------------------------------|---------|------------------|---------------|------------------------------|---------------------------------------|------------|-------------------------------|
| Signagelive.setData(key, val, shared) | ✘       | ✘                | ✘             | ✘                            | ✘                                     | ✘          | ✘                             |
| Signagelive.getData(key, shared)      | ✘       | ✘                | ✘             | ✘                            | ✘                                     | ✘          | ✘                             |
| Signagelive.log(msg)                  | ✔       | ✔                | ✔             | ✔                            | ✔                                     | ✔          | ✔                             |
| Signagelive.sendReadyToDisplay()      | ✘       | ✘                | ✘             | ✘                            | ✘                                     | ✘          | ✘                             |