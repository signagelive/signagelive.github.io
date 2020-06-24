---
layout: doc
title: Debugging Electron
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Electron Client (Windows/Mac)

This user guide demonstrates the steps outlined to enable debugging on an Electron panel using a Windows PC.  A pre-existing Signagelive network and licence is required for this process.

## Debugging Step-by-Step - How To Guide

To set up a device for testing you will first need to configure a file to run with your Electron app. This process is as follows:

1. Download and install the Signagelive client from <a href="https://clients.signagelive.com/windows/Signagelive.exe">here</a> (minimum version 1.0.43).
2. Browse to %AppData%\Signagelive
3. Create a new file called debug.json.
4. Open debug.json with a text editor and copy the following into the contents of the file:

{% highlight json %}
{ “devToolsEnabled”: true, “disableGlobalKeypress”: true}
{% endhighlight %}

5. Run the Signagelive client

After you have completed these steps you can then execute your Electron client – this will now run with the addition of the developer tools window upon startup.

The devToolsEnabled flag will force the client to load the chrome developer tools alongside the media player to enable debugging.
The disableGlobalKeypress flag is an option that prevents the media player from listening and consuming key presses when it does not have focus.

<img src="/assets/images/debugging-electron/debugging-electron-1.png">
<br>
Example of the developer tools window on Electron (Windows PC)

This tool will allow you to debug code in widgets/apps the same way you would locally as an HTML5 application. You will be able to view network requests, any errors thrown in the console, and whether elements have been added to the DOM.