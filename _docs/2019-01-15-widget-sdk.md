---
layout: doc
title: Widget SDK
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---

<style>
    table thead tr th, .table-wrapper td {
        /* transform: rotate(90deg); */
        font-size: 14px;
        padding: 0.3vw 1vh;
        min-width: 6vw;
        text-align: center;
    }

    table {
        width: 100%;
    }

    .table-wrapper td:nth-child(1) {
        text-align: left;
        min-width: 16vw;
    }

    thead tr:nth-child(1) th {
        transform: rotate(-60deg);
        padding-top: 1vh;
    }

    .table-wrapper {
        overflow-x: scroll;
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

## Signagelive.playVideo()

|              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | Used to play video natively on Samsung SSP Tizen displays. Native playback can offer a better visual experience over standard HTML5 video when used in a playlist with other videos and when wanted to render 2 videos with video concurrently.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Parameters   | fileURI(s) - a relative URI or array of relative URIs pointing to video files to play (relative to index.html). x - the x coordinate of the video relative to the zone. If you want the video to cover the entire widget zone then this should be 0. y - the y coordinate of the video relative to the zone. If you want the video to cover the entire widget zone then this should be 0. width - the width of the video. If this is larger than the width of the widget zone, this will be scaled down to fit the zone height - the height of the video. If this is larger than the height of the widget zone this will be scaled down to fit the zone. loop - whether or not to loop the video(s) - This will be true by default (makes sense to me) play4K - if playing a 4k video this must be true callbacks - pass in functions to be called when specific events fire. The exact events you can add listeners for are:- onTimeUpdate - use this to receive the current play time of the video- onComplete - fired when a video completes- onError - fired when there is a playback error |
| Availability | Tizen SSP Only (Tizen 2.4+)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Limitations  | Your widget must have a transparent background in order for video to be visible. Only 1 video can be played per widget at any one time You can play up to 2 widget zones each with 1 video concurrently @ FHD resolution If playing 4K only 1 video can be played at a time (across all widgets) Videos should not be larger than the widget zone they are scheduled to. Videos that are larger than the widget zone will be scaled down to fit the zone  |
| Example      |
{% highlight javascript %}

style.css
 
html {
    background-color: transparent !important;
}
 
main.js
 
    // Use the new playVideo() SDK API to play a single video
    Signagelive.playVideo(
        'content/1.mp4',        // File to play (relative to index.html)
        0,                      // x pos
        0,                      // y pos
        1920,                   // width
        1080,                   // height
        true,                   // loop video
        false,                  // 4k video (supported screens only)
        // Video events
        { 
            onTimeUpdate: onVideoTimeUpdate,
            onComplete: onVideoComplete,
            onError: onVideoError
        }
    ).then(function(success) {
        // Was playback successful?
        success
            ? console.log('Video playback started successfully.')
            : console.error('Video playback failed.');
    });
 
    function onVideoTimeUpdate(video, currentTime) {
        var message = 'Video Time Update: ' + currentTime;
    }
 
    function onVideoComplete(video) {
        var message = 'Video Complete';
        console.log(message);
    }
 
    function onVideoError(video, errorMessage) {
        var message = 'Video Error: ' + errorMessage;
        console.error(message);
    }
 
var videoPlaylist = [
        'content/1.mp4',
        'content/2.mp4',
        'content/3.mp4',
    ];
    // Use the new playVideo() SDK API to play a playlist of videos
    Signagelive.playVideo(
        videoPlaylist,          // Array of video files to play (relative to index.html)
        0,                      // x pos
        0,                      // y pos
        1920,                   // width
        1080,                   // height
        true,                   // loop video
        false,                  // 4k video (supported screens only)
        // Video events
        { 
            onTimeUpdate: onVideoTimeUpdate,
            onComplete: onVideoComplete,
            onError: onVideoError
        }
    ).then(function(success) {
        // Was playback successful?
        success
            ? console.log('Video playback started successfully.')
            : console.error('Video playback failed.');
    });
 
    function onVideoTimeUpdate(video, currentTime) {
        var message = 'Video Time Update: ' + currentTime;
        document.getElementById('eventText').textContent = message;
    }
 
    function onVideoComplete(video) {
        var message = 'Video Complete';
        console.log(message);
        document.getElementById('eventText').textContent = message;
    }
 
    function onVideoError(video, errorMessage) {
        var message = 'Video Error: ' + errorMessage;
        console.error(message);
        document.getElementById('eventText').textContent = message;
    }
{% endhighlight %}
 |

## Signagelive.stopVideo()

|              |                                                                                                 |
|--------------|-------------------------------------------------------------------------------------------------|
| Description  | Used to stop a video that is currently playing as a result of a call to Signagelive.playVideo() |
| Parameters   | None                                                                                            |
| Availability | Tizen SSP Only (Tizen 2.4+)                                                                     |
| Limitations  | None                                                                                            |
| Example      |
{% highlight javascript %}
Signagelive.stopVideo().then(function(success) {
    success
        ? console.log('Video stopped.')
        : console.error('An error occurred stopping the video.');
}); 
{% endhighlight %}
 |


# Supported Devices

<div class="table-wrapper" markdown="block">

|                                       | Amazon Fire TV | Brightsign | Chrome OS | IAdea |   LG webOS  | macOS | Philips Android SoC | Samsung SSP (Tizen) | Samsung SSSP (E) | Samsung SSSP (D) | Browser/ Broadcast Player | Legacy PC Client | Windows |
|:-------------------------------------:|:--------------:|:----------:|:---------:|:-----:|:-----------:|:-----:|:-------------------:|:-------------------:|:----------------:|:----------------:|:-------------------------:|:----------------:|:-------:|
| Signagelive.setData(key, val, shared) |        ✘       |      ✔     |     ✔     |   ✘   | ✔ |   ✘   |          ✘          |          ✔          |         ✘        |         ✘        |             ✘             |         ✘        |    ✘    |
| Signagelive.getData(key, shared)      |        ✘       |      ✔     |     ✔     |   ✘   | ✔ |   ✘   |          ✘          |          ✔          |         ✘        |         ✘        |             ✘             |         ✘        |    ✘    |
| Signagelive.log(msg)                  |        ✔       |      ✔     |     ✔     |   ✔   |      ✔      |   ✔   |          ✔          |          ✔          |         ✔        |         ✔        |             ✔             |         ✔        |    ✔    |
| Signagelive.sendReadyToDisplay()      |        ✘       |      ✔     |     ✔     |   ✘   | ✔ |   ✘   |          ✘          |          ✔          |         ✘        |         ✘        |             ✘             |         ✘        |    ✘    |
| Signagelive.playVideo()               |        ✘       |      ✘     |     ✘     |   ✘   | *Coming soon* |   ✘   |          ✘          |     *Coming soon*     |         ✘        |         ✘        |             ✘             |         ✘        |    ✘    |
| Signagelive.stopVideo()               |        ✘       |      ✘     |     ✘     |   ✘   | *Coming soon* |   ✘   |          ✘          |     *Coming soon*     |         ✘        |         ✘        |             ✘             |         ✘        |    ✘    |

</div>