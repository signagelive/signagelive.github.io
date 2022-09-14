---
layout: doc
title: Widget SDK
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Widget SDK, WDF, Developer]
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

    .container {
        width: 95%;
        max-width: 95%;
    }
</style>

# Overview

This document describes the Signagelive Widget SDK methods available and their purpose. Currently the SDK has not been rolled out on all devices so some features are limited to: Samsung, LG, Chrome OS or Brightsign players only.

The SDK is available <a href="https://drive.google.com/file/d/1RyA_Z7Zvr6Zl31EwL1YxQL06IxWgdnsy/view">here</a>.

<h4 class="no_toc"> Include the Javascript File </h4>

Copy the javascript file into your project and include it in your HTML page as shown in the example below:

{% highlight javascript %}
<script src="js/signagelive.js"></script>
{% endhighlight %}

# Methods

## Signagelive.sendReadyToDisplay()

|              |                                                                                                                                                                                                                                                                                      |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | To be used to signal when the player has downloaded the data and assets within the widget and is ready for the content to be shown on screen. By default the media player will automatically show the widget after 2 seconds as this method will not allow it to be delayed further. |
| Parameters   | n/a                                                                                                                                                                                                                                                                                  |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-sendReadyToDisplay){:target="_blank"} |
| Example      |
{% highlight javascript %}
Signagelive.sendReadyToDisplay().then(function() {
    console.log('Widget is displayed...');
});
{% endhighlight %}

## Signagelive.setData(key, value, shared)

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | A localStorage alternative; where data can be stored on the player and can persist between reloading the widget.                                                                                                      |
| Parameters   | key (string): The name/reference for the data being stored. value (string): The data that is going to be stored. shared (boolean): If set to true then data will be accessible to all widgets published to the player |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-setData-getData){:target="_blank"} |
| Example      |
{% highlight javascript %}
Signagelive.setData('status', data, true).then(function () {
    console.log("Data stored as 'status'");
});
{% endhighlight %}

## Signagelive.listStoredDataKeys(shared)

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description | Get a list of all keys that have been stored using Signagelive.setData() |
|---|---|
| Parameters | shared (boolean): Whether or not to include keys stored in the shared storage space |
| Returns | A promise that resolves an array of stored keys. Example response: ["items", "names", "places"] |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-listStoredDataKeys){:target="_blank"} |
| Example |  |
{% highlight javascript %}
Signagelive.listStoredDataKeys(false).then(function(data) {
    console.log(data);
}).catch(function(error) {
    console.error(error.message);
});
{% endhighlight %}

## Signagelive.getData(key, shared)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | A localStorage alternative; where data stored with Signagelive.setData(key, value, shared) can be retrieved.                                                        |
| Parameters   | key (string): The name/reference for the previously stored data. shared (boolean): If set to true, it will search for this key in the global storage of the player. |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-setData-getData){:target="_blank"} |
| Example      |                                                     |
{% highlight javascript %}
Signagelive.getData('status', true).then(function (data) {
    self.dataResponse = JSON.parse(data);
});
{% endhighlight %}

## Signagelive.removeData(key, shared)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Remove a key-value pair stored using Signagelive.setData()                                                              |
| Parameters       | Key - [string] The key of the key-value pair to remove Shared - [boolean] Whether or not the key is a shared key or not |
| Returns          | A promise that resolves when the requested key has been removed.                                                        |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-removeData){:target="_blank"} |
| Example    |                                                                                                                         |

{% highlight javascript %}
Signagelive.removeData('items', false)
    .then(function() {
        console.log('items key-value pair removed');
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.clearStorage()

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description | Remove all key-value pairs stored using Signagelive.setData() |
|---|---|
| Parameters | n/a |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-clearStorage){:target="_blank"} |
| Example |  |
{% highlight javascript %}
Signagelive.clearStorage()
{% endhighlight %}

## Signagelive.log(logLevel, message)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Ability to log universally across all media players                                                                                         |
| Parameters       | logLevel - (Optional - default is INFO) [string] The options are [DEBUG, INFO, WARNING, ERROR, FATAL] message - [string] The message to log |
| Returns          | Returns a promise that resolves once the message has been logged.                                                                           |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-log){:target="_blank"} |
| Example    |                                                                                                                                             |

{% highlight javascript %}
Signagelive.log('ERROR', 'Unable to load items from data storage.')
    .then(function() {
        // Logged
    });
{% endhighlight %}

## Signagelive.playVideo()

|              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description  | Used to play video natively on Samsung SSP Tizen displays. Native playback can offer a better visual experience over standard HTML5 video when used in a playlist with other videos and when wanted to render 2 videos with video concurrently.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Parameters   | fileURI(s) - a relative URI or array of relative URIs pointing to video files to play (relative to index.html). x - the x coordinate of the video relative to the zone. If you want the video to cover the entire widget zone then this should be 0. y - the y coordinate of the video relative to the zone. If you want the video to cover the entire widget zone then this should be 0. width - the width of the video. If this is larger than the width of the widget zone, this will be scaled down to fit the zone height - the height of the video. If this is larger than the height of the widget zone this will be scaled down to fit the zone. loop - whether or not to loop the video(s) - This will be true by default (makes sense to me) play4K - if playing a 4k video this must be true callbacks - pass in functions to be called when specific events fire. The exact events you can add listeners for are:- onTimeUpdate - use this to receive the current play time of the video- onComplete - fired when a video completes- onError - fired when there is a playback error |
| Limitations  | Your widget must have a transparent background in order for video to be visible. Only 1 video can be played per widget at any one time You can play up to 2 widget zones each with 1 video concurrently @ FHD resolution If playing 4K only 1 video can be played at a time (across all widgets) Videos should not be larger than the widget zone they are scheduled to. Videos that are larger than the widget zone will be scaled down to fit the zone  |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-playVideo-stopVideo){:target="_blank"} |
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
| Limitations  | None                                                                                            |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-playVideo-stopVideo){:target="_blank"} |
| Example      |
{% highlight javascript %}
Signagelive.stopVideo().then(function(success) {
    success
        ? console.log('Video stopped.')
        : console.error('An error occurred stopping the video.');
}); 
{% endhighlight %}
 |

## Signagelive.getPlayerDetails()

|                  |                                                                                                                                                              |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Get details about the player the widget is playing on including Signagelive serial number, site details, model details, and firmware and client information. |
| Parameters       | None                                                                                                                                                         |
| Returns          | A promise that resolves to a JSON object containing all of the player details. Example:                                                                      |

{% highlight javascript %}
{
    "serial_number": 12345,
    "client_id": "4A:38:95:01:23:54",
    "site_description": "Player 1",
    "address_1": "123 Bond Street",
    "address_2": "",
    "city": "London",
    "state": "London",
    "zip_code": "E17 8BB",
    "reference_code_1": "Ref 1",
    "reference_code_2": "Ref 2",
    "reference_code_3": "Ref 3",
    "time_zone": "Europe/London",
    "utc_offset": 0,
    "player_type": "Tizen",
    "manufacturer": "Samsung",
    "model": "PMF",
    "client_version": "1.15",
    "firmware_version": "T-HKMLAC-2100.2"
}
{% endhighlight %}
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-getPlayerDetails){:target="_blank"} |
| Example |  |

{% highlight javascript %}
Signagelive.getPlayerDetails()
    .then(function(playerDetails) {
        console.log(JSON.stringify(playerDetails, undefined, 2));
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.getDisplayProperties()

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|             | Signagelive.getDisplayProperties()                                                                                       |
| Description | Get player display properties such as display width and height, rotation and whether or not video rotation is supported. |
| Parameters  | None                                                                                                                     |
| Returns     | A promise that resolves to a JSON object containing all of the display properties. Example:                              |

{% highlight javascript %}
{
    "width": 1920,
    "height": 1080,
    "rotation": 270,
    "is_native_portrait_app": false,
    "video_rotation_supported": true,
}
{% endhighlight %}

| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-getDisplayProperties){:target="_blank"} |
| Example |  |

{% highlight javascript %}
Signagelive.getDisplayProperties()
    .then(function(displayProperties) {
        console.log(JSON.stringify(displayProperties, undefined, 2));
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.getMaxSupportedTLSVersion()

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Get detailed information about the TLS (SSL) support of the player.                                                                                                                                                                                                                                                                            |
| Parameters       | None                                                                                                                                                                                                                                                                                                                                           |
| Returns          | A promise that resolves to a JSON object with TLS support details. The following example shows how the response should look if we are able to get detailed data from the howsmyssl.com API. Note that if the detailed data is available, the detailed_tls_settings_included property will be true and detailed_tls_settings will be populated. |

{% highlight javascript %}
{
    "tls_version_string": "TLS 1.3",
    "tls_version": 1.3,
    "detailed_tls_settings_included": true,
    "detailed_tls_settings": {
        "given_cipher_suites": [
            "TLS_AES_128_GCM_SHA256",
            "TLS_AES_256_GCM_SHA384",
            "TLS_CHACHA20_POLY1305_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
            "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA",
            "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
            "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA",
            "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
            "TLS_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_RSA_WITH_AES_256_GCM_SHA384",
            "TLS_RSA_WITH_AES_128_CBC_SHA",
            "TLS_RSA_WITH_AES_256_CBC_SHA",
            "TLS_RSA_WITH_3DES_EDE_CBC_SHA"
        ],
        "ephemeral_keys_supported": true,
        "session_ticket_supported": true,
        "tls_compression_supported": false,
        "unknown_cipher_suite_supported": false,
        "beast_vuln": false,
        "able_to_detect_n_minus_one_splitting": false,
        "insecure_cipher_suites": {}
    }
}

If howsmyssl is unavailable and the media player has to return the default tls settings only then the detailed_tls_settings_included property will be false and detailed_tls_settings object will be null.

{
    "tls_version_string": "TLS 1.2",
    "tls_version": 1.2,
    "detailed_tls_settings_included": false,
    "detailed_tls_settings": null
}
{% endhighlight %}

| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-getMaxSupportedTLSVersion){:target="_blank"} |
| Example |  |

{% highlight javascript %}
Signagelive.getMaxSupportedTLSVersion()
    .then(function(maxSupportedTLSVersion) {
        console.log(JSON.stringify(maxSupportedTLSVersion, undefined, 2));
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.getOnlineStatus()

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Find out if the player has a network connection and is connected to the internet.                                                                                                                                                                             |
| Parameters       | None                                                                                                                                                                                                                                                          |
| Returns          | A promise that resolves to a JSON object with network and internet connectivity status. The response object contains two boolean values that can be used to determine if the player is connected to a LAN and whether or not it has internet access. Example: |

{% highlight javascript %}
{
    "network_connected": true,
    "internet_access": true
}
{% endhighlight %}

| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-getOnlineStatus){:target="_blank"} |
| Example |  |

{% highlight javascript %}
Signagelive.getOnlineStatus()
    .then(function(status) {
        console.log(JSON.stringify(status, undefined, 2));
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.onWidgetClosing(callback, options)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Register a callback that will get called when the widget is to be closed because the media player is moving to the next asset.Note that if the widget does not register a callback using this function then the media player will forcibly close the widget and move next as normal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Parameters       | function callback(Promise resolve, timeInfo) - A reference to a function or anonymous function that will be executed when the Signagelive media player notifies the widget that the widget is about to close.The callback function will have 2 parameters The first is a reference to resolve the promise and notify the media player that the cleanup code has finished executing. The widget developer should always call resolve() after their cleanup code has executed. The second parameter timeInfo provides details about the timing until the widget will be closed, which is dependent on the configuration options provided to the initial call. The timeInfo parameter object has the following properties: millisecondsNotifiedInAdvance millisecondsUntilClosed millisecondsUntilForciblyClosed options - (optional) An optional options object. Configurable options include: millisecondsToNotifyInAdvance - This is the time in milliseconds that the callback is called in advance of the Widget being closed. Default: 500ms, Max: 2000ms millisecondsToWaitForCallbackResolution - This is the time in milliseconds that the media player will wait for the callback method to call resolve() before forcibly closing the widget and moving to the next asset. Default: 500ms, Max: 2000ms |
| Returns          | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-onWidgetClosing){:target="_blank"} |
| Example    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

{% highlight javascript %}
Signagelive.onWidgetClosing(function(resolve, timeInfo) {
    console.log('Widget closing in ' + timeInfo.millisecondsUntilForciblyClosed + 'ms. Getting current state...');
    getCurrentState()
        .then(function(state) {
            console.log('Storing state...');
            return storeCurrentState(state);
        })
        .then(function() {
            console.log('Stopping video player...');
            return stopVideoPlayer();   
        })
        .then(function() {
            console.log('Hiding background...');
            return hideBackground();
        })
        .then(function() {
            console.log('Clean up code completed. Notifying media player.');
            resolve(); // Always call resolve()
        })
        .catch(function(err) {
            console.error('An unexpected error occurred.');
            resolve(); // Always call resolve()
        })
}, {
    millisecondsToNotifyInAdvance: 500,
    millisecondsToWaitForCallbackResolution: 500
});
{% endhighlight %}

## Signagelive.checkSupportedHTML5Features(featuresToCheck)

|              |                                                                                                                                                                     |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description      | Check HTML5 feature support on the player using Modernizr.                                                                                                                                                                                                                                               |
| Parameters       | featuresToCheck - [Array of strings] representing the features to check. The full list of available features to check are defined in the Modernizr documentation.                                                                                                                                        |
| Returns          | A promise that resolves to a JSON object that contains results for the features that were requested to be tested. Each feature that was tested will be returned as a boolean property of the results object with the feature name and "_supported" appended to it (see example below). Example response: |

{% highlight javascript %}
{
    "cssanimations_supported": true,
    "flexbox_supported": false,
    "es6collections_supported": false,
    "arrow_supported": false
}
{% endhighlight %}

| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-checkSupportedHTML5Features){:target="_blank"} |
| Example |  |

{% highlight javascript %}
Signagelive.checkSupportedHTML5Features(['cssanimations', 'flexbox', 'es6collections', 'arrow'])
    .then(function(results) {
        console.log(JSON.stringify(results, undefined, 2));
    })
    .catch(function(error) {
        console.error(error.message);
    });
{% endhighlight %}

## Signagelive.requestMediaPlayerMoveToNextAsset()	

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description | Request the player to move to the next media asset available in the playlist. |
|---|---|
| Parameters | n/a |
| Github | [Repository](https://github.com/signagelive/signagelive-widget-sdk/tree/main/signagelive-requestMediaPlayerMoveToNextAsset){:target="_blank"} |
| Example |  |
{% highlight javascript %}
Signagelive.requestMediaPlayerMoveToNextAsset()
{% endhighlight %}

## Signagelive.getExternalData(dataSource, integrationId, objectId, callback)

|              |                                                                                                                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Description | Gets data (or files) from an external data source. |
|---|---|
| Parameters | dataSource - The source of the data. Currently “DSS” will be the only option here integrationId - The public Id of the integration, such as com.signagelive.datasyncservices.authenticatedwebsites objectId - the id of the integration object as defined in the Widget preferences onDataUpdate - a reference to a callback function that will be fired when new data for this data source is available |
| Returns | A promise that resolves to a JSON object containing the requested data. The actual fields and data returned will be very different for each integration. Developers will need to read the documentation specific to the integration they are using to understand what they can expect to be returned. The example below shows data that might be returned for a corporate dashboard web page made available by the authenticated websites integration. Example: {     "webpage": {         "id": {             "id": "85c91571-a47d-471c-a845-7f9748301dd9"         },         "name": "Corporate Dashboard 1",         "latestSuccessfulCaptureTimestamp": "2021-03-19T10:00:00",         "latestSuccessfulCapture": {             "name": "file1",             "src": "/com.signagelive.datasyncservices.authenticatedwebites/Corporate_Dashboard_1.jpg"         }     } }   |
| Example |  |
{% highlight javascript %}
function onDashboardUpdated(data) {
    console.log('Dashboard Updated: ' + JSON.stringify(data, undefined, 2));
    $("#dashboard-img").attr('src', data.webpage.latestSuccessfulCapture.url);
    $("#last-updated-time").html(data.webpage.latestSuccessfulCaptureTimestamp);
}

window.addEventListener('widget-init', function (e) {
    // Load dashboard values from Widget preferences
    var cytheDashboardId = Widget.preferences.getItem("Cythe");
    // Get Data and Render
    Signagelive.getExternalData("DSS", "com.signagelive.datasyncservices.authenticatedwebsites", cytheDashboardId, onDashboardUpdated).then(function(data) {
        onDashboardUpdated(data);
    }).catch(function(error) {
        console.error('Error getting data: ' + error);
    });
});
{% endhighlight %}



# Supported Devices

<div class="table-wrapper" markdown="block">

|  | Brightsign (All Series 3 and 4) | LG webOS 1.0 | LG webOS 2.0 | LG webOS 3.0 | LG webOS 3.2 | LG webOS 4.0 | LG webOS 4.1 | LG webOS 6.0 | Samsung SSSP (D) | Samsung SSSP (E) | Samsung Tizen 2.4 | Samsung Tizen 3.0 | Samsung Tizen 4.0 | Samsung Tizen 5.0 | Philips Android (All Models) | Amazon Fire TV | Windows | Chrome OS | IAdea SMIL (All) | Browser/ Broadcast Player | Legacy PC Client |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Main Widget SDK Support** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Signagelive.setData(key, val, shared) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.listStoredDataKeys(shared) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.getData(key, shared) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.removeData(key, shared) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.clearStorage() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.log(message) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Signagelive.sendReadyToDisplay() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.playVideo() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | *Coming soon* | *Coming soon* | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.stopVideo() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | *Coming soon* | *Coming soon* | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.getPlayerDetails() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.getDisplayProperties() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.getTLSSupportInfo() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.getOnlineStatus() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.onWidgetClosing(callback) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.checkSupportedHTML5Features(featuresToCheck) | ✔ | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✘ | ✘ | ✘ |
| Signagelive.requestMediaPlayerMoveToNextAsset() | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |
| **Data Sync Services Support** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Signagelive.getExternalData(dataSource, integrationId, objectId, callback) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✘ | ✘ | ✘ |

</div>