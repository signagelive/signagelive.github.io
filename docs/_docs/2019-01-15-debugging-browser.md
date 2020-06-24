---
layout: doc
title: Debugging Browser
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Chrome/Firefox Browser

This user guide demonstrates the steps outlined to enable debugging locally on a user’s Windows PC with either the Chrome or Firefox browser.

These additional steps are required to circumvent some security restrictions regarding running files locally within a web browser. This also may be an easier process regarding debugging if there are issues with the widget that affect all devices. This can also be used when developing your own widgets as part of the testing process.

To start off this process, first you will need to download the widget you intend to debug from Signagelive.

You can do this by:

1. Logging into Signagelive
2. Going to the Playlist Manager and clicking on the triple dots to the right-hand side of the entry, this will show the context menu – then click ‘Download’; this will download the widget file to the default download location for the browser you are using.
3. Extract the .wgt file to a location you will use for the debugging process.

For debugging on the Chrome browser follow the steps below, after this is a section detailing the steps in Firefox.

## Debugging Chrome Step-by-Step - How To Guide

1. Create a Chrome shortcut on your desktop. Right-click and append to the end of the target: -–allow-file-access-from-files –autoplay-policy=no-user-gesture-required

<img src="/assets/images/debugging-browser/debugging-browser-1.png">
<br>
Example of the Chrome target details

2. Close all running instances of Chrome (you can check this by confirming whether Chrome.exe is not running in your Task Manager).
3. Open a Chrome browser instance through the new shortcut you have created, then open the index.html in Chrome by dragging it to the open Chrome window.
4. This should then allow you to see the widget running locally. From here you can go to the triple dot context menu for Chrome > More Tools > Developer Tools or use the shortcut CTRL+SHIFT+I.

Widgets may have different visual displays depending on the size of the window you are publishing too, for example 1920×1080 or in a zone in a layout. If you want to test responsive scaling or how it displays natively in HD then with the developer tools open you can click ‘Toggle device toolbar’ or use the shortcut CTRL+SHIFT+M

<img src="/assets/images/debugging-browser/debugging-browser-2.png">
<br>
Example of the Responsive mode for Chrome (highlighted in blue)

## Debugging Firefox Step-by-Step - How To Guide

1. Go to about:config
2. In the search bar type in “privacy.file_unique_origin”
3. Change this from true (default value) to false
4. Open up the index.html of the widget you are attempting to debug. You can do this by dragging the index.html file to an open instance of Firefox.
5. This should then allow you to see the widget running locally. From here you can go to the burger context menu for Firefox > Web Developer > Toggle Tools or use the shortcut CTRL+SHIFT+I.

Widgets may have different visual displays depending on the size of the window you are publishing too, for example 1920×1080 or in a zone in a layout. If you want to test responsive scaling or how it displays natively in HD then with the developer tools open you can click ‘Responsive Design Mode’ or use the shortcut CTRL+SHIFT+M

<img src="/assets/images/debugging-browser/debugging-browser-3.png">
<br>
Example of the Responsive mode for Firefox (highlighted on the right-hand size in blue)