---
layout: doc
title: Network API
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Network, API, Developer]
toc: true
---
## Network API - Getting Started

Before continuing with this guide, please make sure you have reviewed the Signagelive Platform Services Getting Started guide, to make sure the Network API is the correct API for your purpose.

To interact with the Network API you will be provided with credentials for your Application. To request these credentials, please sign up for access.

[Sign Up for Access](https://docs.google.com/forms/d/e/1FAIpQLScbomALViAsRf3gT562utIXbcLWP17JcLYaJhhnvDQLvrQOCQ/viewform){:target="_blank" .btn-style2 .btn .small}

## Development Environment

Signagelive provides a separate environment to the production environment, for development against the Signagelive Network API. This environment does not connect in anyway to the production environment, so that there is no chance of potentially affecting your production environment while developing against the API’s.

You will be set up with a network on the development environment and a number of licences which can be used to allow you to connect Signagelive Players to this environment during development.

To move your application to the production environment, you will need to change the API details and credentials supplied.

## Clients

While using the development environment, you will need to use the correct clients which connect to the Signagelive development environment. The production clients do not connect to the development environment.

These clients should NOT be used in a production environment, as there is no guarantee that these clients will be updated at the same time as the production clients.

The installation process of these clients is the same as in the production environment, but with the alternative URL’s listed provided on sign up.

[Client Installation Instructions](https://support.signagelive.com/hc/en-us/articles/115000111391){:target="_blank" .btn-style2 .btn .small}

## Postman

At Signagelive we use a tool named Postman, to be able to interact with our API’s. This tool, if you are not familiar with it, allows you to be able to make calls to the API and see the responses without having to do any development work. This is specifically designed as a testing/development tool.

Once we have an understanding of your requirements and you are granted access we will provide a custom Postman collection to simplify the development of your application.

## Application Authorisation

Once you are provided with your credentials, your application will then have to be authorised against a Network, this process does not link to a specific User, the users of that Network will be giving your application permissions to access their network.

This is something that you will need to provide a mechanism for Signagelive users to do, within your application.

[Partner App Authorisation Process](/api/partner-app-authorization){: .btn-style2 .btn .small}

## Signagelive Media Ingress to Publication

It is worth understanding how media is handled within Signagelive, from the time it is uploaded/added to it being published to player(s).

[Overview](/api/media-ingress){: .btn-style2 .btn .small}

## Documentation

The full Network API documentation is available for you to review. As part of the sign up process we will generally point you to the specific sections of the documentation, which are relevant to your use case.

[View the Documentation](/api/network-api){: .btn-style2 .btn .small}