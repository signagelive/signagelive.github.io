---
layout: doc
title: Debugging LG
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# LG WebOS

This user guide demonstrates the steps outlined to enable debugging on an LG WebOS panel using a Windows PC. A pre-existing Signagelive network and licence is required for this process.

## Debugging Step-by-Step - How To Guide

1. Go to the URL Launcher
    1. Set the URL to be https://clients.signagelive.com/lg/enabledebug
    2. Set the Launch Mode to be Remote
2. Confirm you want to make these changes
3. Turn the panel off then back on.
4. It will attempt to enable the debugging capabilities on the panel – if successful it will show a “Debugging enabled” message.
5. Go back to the URL Launcher
    1. Set the URL to be http://clients.signagelive.com/lgapp.zip
    2. Set the Launch Mode to be Local
6. Confirm these changes and the Signagelive client should be installed.
    1. If you are reinstalling the app then you may get a ‘This panel has been previously activated’ message – you will need to deactivate and reactivate the licence under your Network on Signagelive.
    2. If it is your first time installing Signagelive on the device then you should receive an activation code. Install instructions are available here for LG 3.0, 3.2 and 4.0 models and here for LG 2.0.
7. Activate your panel on https://login.signagelive.com/ 
8. To access the debugging capability go to your Player details for the activated player on Signagelive.
9. Once on this page go to the System tab for the Player and note down IP Address under the Network details.

When you have this information open up a new browser window on your computer and navigate to the IP Address of your Player and add in “:9998”, for example: http://192.168.90.145:9998. This should open up the “Inspectable Web View” for the panel. In the numbered list there should be an entry called “Signagelive Client” if you click on this it will then open the remote developer tools for the Player. You will be able to use this to view information like network traffic and also any errors reported in the Signagelive client.

<img src="/assets/images/debugging-lg/debugging-lg-2.png">
<br>
Example section of the initial webpage from a LG panel with debugging enabled – accessed from <ip address>:9998

<img src="/assets/images/debugging-lg/debugging-lg-3.png">
<br>
Example overview of the Signagelive Client webpage (from above)

## Compatibility

LG panels use older versions of ECMAScript compared to other devices, especially the WebOS 2 & 3 series. When developing apps it is possible that the functions used will not be supported. To combat this you will need to either implement polyfills or rewrite the sections of the code to allow for fallback support (ES5). Examples include: .includes(), .map(), .filter() and arrow function syntax. CSS styling will also need to be considered if developing for WebOS 2.0 series panels or older versions as they will require the use of webkit styling if you are trying to use modern properties like flexbox.

