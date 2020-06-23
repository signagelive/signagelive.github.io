---
layout: doc
title: Debugging Iadea
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Iadea

This user guide demonstrates the steps outlined to enable debugging on a IAdea device using a Windows PC.  A pre-existing Signagelive network and licence is required for this process.

## Debugging Step-by-Step - How To Guide

1. To get to the Android menu will differ slightly depending on the device you are using, you can either:
    - If Signagelive is already running:
        - On a touch-enabled device (XDS series), press down on one of the four corners until the Basic Settings menu appears.
        - On a non-touch-enabled device (MBR/XMP series), plug in a mouse and follow the same process as above
    - If Signagelive is not running you should see the Basic Settings page

2. On the Basic Settings page under ‘Content’ you should cancel it autorunning next to the ‘Set Content’ URL and then click on the Ethernet option to access the general Android menu.

3. Once on the Android menu you want to access the Developer options, these will be found under System on the left-hand menu. In here under Debugging you want to make sure that USB debugging ‘debug mode when USB is connected’ is ticked.

4. After these steps you will need to plug your device into your computer, if you get an Android ADB driver install prompt then install these as well (you may need to restart your computer afterwards).

5. If you have chosen to install Android Studio, if it is open when you plug in your device you should see the device information.

<img src="https://lh5.googleusercontent.com/jCmIMIAG_F-iNIkd3VS50mR62zZGDjZsBSuBr77GnxK1uRBlvbtdJh4loDyOSKd-r_nPJjNsDpncXcbeO67oOkUBLRlC-TptX63eCsCwZ5RJK60t6MhTgkZIygeGky9koe9cY4OO">
Example of the overview in Android Studio when an XDS-2288 is connected

6. For debugging itself – navigate to chrome://inspect/devices – you should be able to see the attached device and some of the active tabs on the player.

7. As you can see from the screenshot above there may be multiple instances running on the player. In this case I would click and open up the “Weather Widget” as that is the content I have published to the player, and also what I want to debug.

## [Optional] Setting up Android Studio (AS)

1. Download <a href="https://developer.android.com/studio">here</a> and install
2. Under the SDK Manager you may need to click ‘show package details for this step’ – you will need to install:
    1. SDK Platforms
        1. Android 9.0 (Pie) SDK Platform 28 only
        2. Android 7.1.1 (Nougat) SDK Platform 25 only
        3. Android 4.4 (KitKat)
            - Everything except the Glass Development Kit Preview
        4. Android 4.0 (ICS) SDK Platform 14 only
    2. SDK Tools
        1. Android SDK Build-Tools 30-rc1 version 28.0.3
        2. Android Emulator
        3. Android SDK Platform-Tools
        4. Android SDK Tools
        5. Intel x86 Emulator Accelerator (HAXM installer)
