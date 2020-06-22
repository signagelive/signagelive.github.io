---
layout: doc
title: Web Triggers
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
## Web Triggers API - Getting Started

Before continuing with this guide, please make sure you have reviewed the Signagelive Platform Services Getting Started guide, to make sure the Web Triggers API is the correct API for your purpose.

To interact with the Network API you will be provided with credentials for your Application. To request these credentials, please sign up for access.

<button name="button" onclick="https://build.signagelive.com/sign-up">Sign Up for Access</button>

## Overview

The Web Triggers API is designed to allow you to be able to trigger an interrupt which has been published to a single or group of players through Signagelive remotely.

There are a number of different use cases for this, such as integration with building management solutions for emergency messaging, or being able to produce a video on demand interface.

## Signagelive Setup

To be able to trigger content changes, you must have published interrupts to your players, when publishing you must set a duration on the interrupt.

You will be publishing a Key Press interrupt, although you won’t be triggering the interrupt with a keyboard, the key press is used as an identifier to tell the player which content to play for an interrupt triggered using this API.

<button name="button" onclick="https://support.signagelive.com/hc/en-us/articles/115003459152">Publishing an Interrupt</button>

## Postman

At Signagelive we use a tool named Postman, to be able to interact with our API’s. This tool, if you are not familiar with it, allows you to be able to make calls to the API and see the responses without having to do any development work. This is specifically designed as a testing/development tool.

We provide a getting started collections, which can be imported into Postman to get you started. You can then set up an environment which contains the credentials we provide to use with this collection .

<button name="button" onclick="https://drive.google.com/open?id=1i3zapTXPtQ17XJqVNP0RfoC05X0t0Gsb">Get Postman Collection</button>

## Documentation

The full Web Triggers API documentation is available for you to review. The below section will give an example of the methods used to trigger an interrupt on a single player.

<button name="button" onclick="https://build.signagelive.com/api/web-triggers-api/">View the Documentation</button>

## API Usage

The following details the API methods which are required for you to be able to trigger an interrupt on a single player.

1. You will need to retrieve a list of the available players, only those activated will be returned. This is done with the Get All Players method.

<button name="button" onclick="http://build.signagelive.com/api/web-triggers-api/#players-3">Get All Players</button>

2. Find the player you wish to trigger, and make a note of its ID.

3. Retrieve a list of the different interrupts which are available. This is done with the Get All Triggers method.

<button name="button" onclick="http://build.signagelive.com/api/web-triggers-api/#triggers-3">Get All Triggers</button>

4. Find the trigger you wish to send, and make a note of its ID, please be aware these ID’s are network specific, so the same trigger on a different network, will have a different ID.

5. You can then call this trigger, using the Send Message method, adding the player ID and trigger ID to the message object sent.

<button name="button" onclick="http://build.signagelive.com/api/web-triggers-api/#messages-3/">Send Message</button>