---
layout: doc
title: Debugging Brightsign
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Brightsign

This user guide demonstrates the steps outlined to enable debugging on an Brightsign panel using a Windows PC.  A pre-existing Signagelive network and licence is required for this process.

## Debugging Step-by-Step - How To Guide

To set up a device for testing you will first need to configure a file to run with your Electron app. This process is as follows:

1. Install the Signagelive client. Specific install instructions are available <a href="https://support.signagelive.com/hc/en-us/articles/115000280512-Configuring-your-BrightSign-device-">here</a>.
2. Activate your panel on https://login.signagelive.com/ 
3. To access the debugging capability go to your Player details for the activated player on Signagelive.
4. Once on this page go to the System tab for the Player and note down IP Address under the Network details. If this information is unavailable you can also view the IP address of your Brightsign Player by inserting a keyboard (USB) and pressing CTRL + I with the Signagelive Client open.

When you have this information, open up a new browser window on your computer and navigate to the IP Address of your Player and add in “:2999”, for example: http://192.168.90.145:2999.

<img src="https://lh6.googleusercontent.com/1AXhVkuQFbLeP5giESkqkwCbvhg8AULPnq9LC0Mg-Y8txpYX3F0pOQ-C0ql2CtNL8VFfLVazoq2wN7qWQ1OLXsiv-OcWZ5rWB2W3G1ZnLPinPHCXcY50m3PfP2_jnIswTaDvu59r">
Example interface when loading a Brightsign (series 8 firmware) remotely by IP address

This should open up the  “Inspectable Pages” and one of these should be called “Signagelive Client”, if you click on this it will then open the remote developer tools for the Player.

<img src="https://lh4.googleusercontent.com/1r1eAK6Kr2J-6Bhi-M2viJ1QvJrtCAj6IbruO-fDEr91GOS7Wk0_jbNzxcs_vY-Hfczky6e0g8wMUaiGou8bTroviy2dfreI2qBohOLO115aQ6QMRVnOWcA9L-unmXyEQeYo3cUk">
Example of the “Inspectable Pages” view accessed from <ip address>:2999

You will be able to use this to view information like network traffic and also any errors reported in the Signagelive client.

<img src="https://lh6.googleusercontent.com/5lHl-QbImQexXl9T3zDlIOnsYyPTMGys3iZvD9sbtirL5BFz0ymF3d5E4aeIfdqSgJhAUs22DY3YY4ft7pZWNY4B-eseaTrXQG3XN9-lq7jC9O16hRVeql691jMTvDrcNuaXXUvn">
Example overview of the Signagelive Client webpage (from above)