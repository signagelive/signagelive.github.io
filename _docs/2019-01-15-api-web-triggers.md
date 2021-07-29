---
layout: doc
title: Web Triggers
permalink: api/web-triggers
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Web Triggers, API, Developer]
toc: true
---
# Overview

The Signagelive Player API is a RESTful web service which will allow you to develop your own players to connect to Signagelive. All requests to authenticate and operate against the Signagelive API will be performed using SSL over HTTP (HTTPS) on TCP port 443.

The API will support data in both JSON and XML formats to enable maximum client support. The default format is JSON. All request and response examples are in JSON format. To request a response using XML clients must use the Accept header in requests with a value of application/xml

Requests and Responses
Information on all possible API requests can be found under ‘API Reference’.

See response codes for a list and description of the possible HTTP response codes that can be returned by the API.

## Current Status

The Web Triggers API is currently in alpha testing and is only available to select Signagelive partners.

## Release Notes

| DATE       | CHANGES                                                                                                                                 |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| TBC        | Added support for player tags Updated the WT API so that all requests will now expect and return Signagelive Network Ids and Player Ids |
| 12/10/2016 | Fixed an issue that would cause synchronisation of player and network data from Signagelive to fail                                     |
| 06/05/2016 | Initial alpha release                                                                                                                   |

## Setup Onboarding - Web Triggers

On receipt of a request for access to the Web Triggers API Signagelive will perform the initial onboarding and setup to make the Web Triggers available on a per network basis. Note that a single application can be made available to multiple networks.

Once setup is complete users will be provided with a network Id, application Id and application key, which should be used to authenticate requests made against the Web Triggers API. More details on this are provided in the next section on API Authorization.

A newly configured Web Triggers environment will by default contain:

- All active players on the network
- An all group, which contains all players on the network (see here for more information)
- Triggers for all available triggers keys in Signagelive

## End points - Media Player

Several endpoints are used by the Signagelive platform. We have supplied a list below for reference when connecting to the API, and for help configuring firewalls.

| URL                    | URL                    | PROTOCOL (PORT) | IP ADDRESS                                           | DESCRIPTION |
|------------------------|------------------------|-----------------|------------------------------------------------------|-------------|
| api.signagelive.com    | HTTPS (443)            | 162.13.104.148  | The primary endpoint for the Signagelive Player API. |             |
| static.signagelive.com | HTTP (80), HTTPS (443) | 46.38.179.225   | Use for content delivery.                            |             |


## Postman - Web Triggers

Signagelive have made available a Postman configuration with a sample collection of all available requests to help partners get started using the API.

The postman configuration file can be downloaded here: <a target="_blank" href="https://drive.google.com/a/signagelive.com/file/d/0B9p6rRnPnFlDMXJKaERxWjMxS00/view?usp=sharing">https://drive.google.com/a/signagelive.com/file/d/0B9p6rRnPnFlDMXJKaERxWjMxS00/view?usp=sharing</a>

For more information about Postman and to download Postman for Chrome see: <a target="_blank" href="https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en">https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en</a>

## Authorization

As part of the onboarding process API users will be provided with an Application ID and Application Key by Signagelive.

This Application ID and Application Key must be sent with each request using the following headers:

- X-SIGNAGELIVE-WBI-APP-ID: {application_id}
- X-SIGNAGELIVE-WBI-APP-KEY:{application_key}

The provided application Id and application key will only authorize requests made against the user’s specified network.

Requests made against the API that do not include these headers will return a 400 Bad Request response status.

Requests made against the API that include invalid credentials will return a 401 Unauthorized response status.

Requests made against the API that include valid credentials that have been disabled by Signagelive will return a 403 Forbidden response status.

Note that Signagelive intends to replace this authentication mechanism with OAuth authentication in the future.

## Response Codes

The Signagelive Player API will return standard HTTP response codes, clients are expected to respect the response from the API, particularly relating to bad requests, rate limits etc and not attempt to make the call again until either the issue has been resolved or timeout period has passed.

| CODE | TEXT                  | DESCRIPTION                                                                                                                                  |
|------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| 200  | OK                    | Success                                                                                                                                      |
| 201  | Created               | The request has been fulfilled and resulted in a new resource being created                                                                  |
| 204  | No Content            | The request was successfully processed, but is not returning any content                                                                     |
| 400  | Bad Request           | The request cannot be fulfilled due to bad syntax                                                                                            |
| 401  | Unauthorized          | Authentication has failed: X-SIGNAGELIVE-APP-ID header has an invalid Application ID Application ID, Client ID and Client Key are not linked |
| 403  | Forbidden             | The Signagelive client licence has expired                                                                                                   |
| 404  | Not Found             | The resource could not be found                                                                                                              |
| 405  | Method Not Allowed    | A request was made to a resource using a request method not supported by that resource                                                       |
| 408  | Request Timeout       | The server timed out waiting for the request                                                                                                 |
| 409  | Conflict              | The request could not be completed because the request would conflict with data already available on the server                              |
| 429  | Too Many Requests     | The client is over its rate limit, requests should be suspended until the time specified in header X-RateLimit-Reset has passed              |
| 500  | Internal Server Error | A generic error message as a result of a server error                                                                                        |
| 501  | Not Implemented       | The server does not recognise the request method                                                                                             |
| 503  | Service Unavailable   | The servers are up but currently overloaded with requests.                                                                                   |

# Concepts

To use the API effectively, you should understand several key concepts:

## Players

Players are active Signagelive media players available on your Signagelive network.

## Groups

Groups are used to organise players. Content can be triggered for groups as well as individual players. Organising your players into groups can simplify triggering content on predefined subsets of your Signagelive network.

## Player Groups

Each network has a default all group, which is created when the network is configured to be able to use the Web Triggers API. All players are added to the all group by default and users can not:

- Edit or delete the All group
- Add or remove players from the all group

## Triggers

Triggers map to interrupts published to your Signagelive players based on the payload property.

As an example, a player with a Fire Alarm interrupt published to it with the trigger key F would map to a trigger with the payload defined as F.

## Messages

Content is triggered on your players by sending a message containing the trigger (interrupt) to play and the list of players and/or player groups to trigger the content on.

# Models

Below you can find all the data relating to the above mentioned concepts.

## Players

### Field Definitions

| NAME         | DESCRIPTION                                                                         |
|--------------|-------------------------------------------------------------------------------------|
| serialNumber | The Signagelive Serial Number of the player                                         |
| description  | A description of the player taken from the Signagelive site tab data for the player |
| enabled      | A boolean indicating if the player is enabled or disabled                           |
| groups       | An array of groups the player is a member of                                        |
| lastModified | The datetime that the player was last modified                                      |

### Example

{% highlight javascript %}
{
"id": 1
"serialNumber": "30001",
"description": "Sample Player 1",
"enabled": true,
"lastModified": "2016-05-19T13:51:39",
"groups": [],
}
{% endhighlight %}

## Groups

### Field Definitions

| NAME        | DESCRIPTION                                                                                                                                  |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| name        | The group name                                                                                                                               |
| description | A description of the group                                                                                                                   |
| isAllGroup  | A boolean indicating if the group is the all group. Each network has one "All" group setup by default containing all players on the network. |
| players     | An array of players in the group                                                                                                             |

### Example

{% highlight javascript %}
{
"id": 1
"name": "All",
"description": "A default group for all of the players",
"isAllGroup": true,
"players": [],
}
{% endhighlight %}

## Player Groups

### Field Definitions

| NAME   | DESCRIPTION          |
|--------|----------------------|
| player | The id of the player |
| group  | The id of the group  |

### Example

{% highlight javascript %}
{
"id":5
"player":1,
"group":2,
}
{% endhighlight %}


## Triggers

### Field Definitions

| NAME        | DESCRIPTION                                                                                                        |
|-------------|--------------------------------------------------------------------------------------------------------------------|
| name        | The name of the trigger                                                                                            |
| description | A description of the trigger                                                                                       |
| payload     | The payload. This should map to the interrupt trigger key in Signagelive for the interrupt content to be triggered |
| previewurl  |                                                                                                                    |

### Example

{% highlight javascript %}
{
"id": 2
"name": "Goal Scored",
"description": "Goal Scored content matched to Interrupt Key G",
"payload": "G",
"previewurl": null,
}
{% endhighlight %}


## Messages

### Field Definitions

| NAME      | DESCRIPTION                                   |
|-----------|-----------------------------------------------|
| interrupt | The id of the trigger to send                 |
| players   | An array of player ids to send the trigger to |
| groups    | An array of group ids to send the trigger to  |

### Example

{% highlight javascript %}
{
"id":10
"interrupt":1,
"players":[1,2],
"groups":[2],
}
{% endhighlight %}

# Reference

Below you will find the API reference data for the above-mentioned models and concepts.

## Players

### Get All Players

| Operation            | Get All Players                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/players                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Method               | GET                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                                                                                                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Sample Request Data  | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Sample Response Data | [    {   "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   },   {   "serialNumber": "30001",   "description": "Sample Player 2",   "enabled": true,   "lastModified": "2016-05-23T09:03:15",   "groups": [   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 2   }   ] | [   {   "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   },   {   "serialNumber": "30001",   "description": "Sample Player 2",   "enabled": true,   "lastModified": "2016-05-23T09:03:15",   "groups": [   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 2   }   ] |
|                      | [   {   "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   },   {   "serialNumber": "30001",   "description": "Sample Player 2",   "enabled": true,   "lastModified": "2016-05-23T09:03:15",   "groups": [   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 2   }   ]  |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Response Status      | 200                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Notes                | N/A                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Get Player

| Operation            | Get Player by ID                                                                                                                                                                                              |                                                                                                                                                                                                              |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/players/{id}                                                                                                                                                                           |                                                                                                                                                                                                              |
| Method               | GET                                                                                                                                                                                                           |                                                                                                                                                                                                              |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                                                                          |                                                                                                                                                                                                              |
| Sample Request Data  | N/A                                                                                                                                                                                                           |                                                                                                                                                                                                              |
| Sample Response Data | {    "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   } | {   "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   } |
|                      | {   "serialNumber": "30001",   "description": "Sample Player 1",   "enabled": true,   "lastModified": "2016-05-19T13:51:39",   "groups": [   {   "group": 1,   "player": 1,   "id": 1   }   ],   "id": 1   }  |                                                                                                                                                                                                              |
| Response Status      | 200                                                                                                                                                                                                           |                                                                                                                                                                                                              |
| Notes                | N/A                                                                                                                                                                                                           |                                                                                                                                                                                                              |

## Groups

### Get All Groups

| Operation            | Get All Groups                                                                                                                                                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                                                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/groups                                                                                                                                                                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                                                                                                                                                               |
| Method               | GET                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                                                                                               |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                                                                                                                                                                                                                                                           |                                                                                                                                                                                                                                                                                                                                                                                               |
| Sample Request Data  | N/A                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                                                                                               |
| Sample Response Data | [    {   "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   },   {   "name": "My Sample Empty Group",   "description": "Description of My Sample Group",   "isAllGroup": false,   "players": [],   "id": 2   }   ] | [   {   "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   },   {   "name": "My Sample Empty Group",   "description": "Description of My Sample Group",   "isAllGroup": false,   "players": [],   "id": 2   }   ] |
|                      | [   {   "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   },   {   "name": "My Sample Empty Group",   "description": "Description of My Sample Group",   "isAllGroup": false,   "players": [],   "id": 2   }   ]  |                                                                                                                                                                                                                                                                                                                                                                                               |
| Response Status      | 200                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                                                                                               |
| Notes                | N/A                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                                                                                                                                                                                               |

### Get Group

| Operation            | Get Group By ID                                                                                                                                                                                                                       |                                                                                                                                                                                                                                      |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/groups/{id}                                                                                                                                                                                                    |                                                                                                                                                                                                                                      |
| Method               | GET                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                      |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                                                                                                  |                                                                                                                                                                                                                                      |
| Sample Request Data  | N/A                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                      |
| Sample Response Data | {    "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   } | {   "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   } |
|                      | {   "name": "All",   "description": "A default group for all of the players",   "isAllGroup": true,   "players": [   {   "group": 1,   "player": 1,   "id": 1   },   {   "group": 1,   "player": 2,   "id": 2   }   ],   "id": 1   }  |                                                                                                                                                                                                                                      |
| Response Status      | 200                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                      |
| Notes                | N/A                                                                                                                                                                                                                                   |                                                                                                                                                                                                                                      |

### Create Group

{% highlight javascript %}
{ 
"name": "New Group", 
"description": "Description of my new group",
"isAllGroup": false, 
"players": [], "id": 3 
}
{% endhighlight %}

| Operation            | Create Group                                                                                                         |                                                                                           |
|----------------------|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/groups                                                                                        |                                                                                           |
| Method               | POST                                                                                                                 |                                                                                           |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |                                                                                           |
| Sample Request Data  | {    "name":"New Group",   "description":"Description of my new group",   "players":[]   }                           | {   "name":"New Group",   "description":"Description of my new group",   "players":[]   } |
|                      | {   "name":"New Group",   "description":"Description of my new group",   "players":[]   }                            |                                                                                           |
| Sample Response Data | None                                                                                                                 |                                                                                           |
| Response Status      | 201                                                                                                                  |                                                                                           |
| Notes                | N/A                                                                                                                  |                                                                                           |

### Update Group

{% highlight javascript %}
{ 
"name":"My New Group", 
"description":"Description of My New Group", 
"players":[], 
"isAllGroup":false, 
"id": 3 
}
{% endhighlight %}

| Operation            | Update Group                                                                                                                   |                                                                                                                               |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/groups/{id}                                                                                             |                                                                                                                               |
| Method               | PUT                                                                                                                            |                                                                                                                               |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json           |                                                                                                                               |
| Sample Request Data  | {    "name":"My New Group",   "description":"Description of My New Group",   "players":[],   "isAllGroup":false,   "id": 3   } | {   "name":"My New Group",   "description":"Description of My New Group",   "players":[],   "isAllGroup":false,   "id": 3   } |
|                      | {   "name":"My New Group",   "description":"Description of My New Group",   "players":[],   "isAllGroup":false,   "id": 3   }  |                                                                                                                               |
| Sample Response Data | None                                                                                                                           |                                                                                                                               |
| Response Status      | 200                                                                                                                            |                                                                                                                               |
| Notes                | N/A                                                                                                                            |                                                                                                                               |

### Delete Group

| Operation            | Delete Group                                                                                                         |
|----------------------|----------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/groups/{id}                                                                                   |
| Method               | DELETE                                                                                                               |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |
| Sample Request Data  | None                                                                                                                 |
| Sample Response Data | None                                                                                                                 |
| Response Status      | 200                                                                                                                  |
| Notes                | N/A                                                                                                                  |

## Player Groups

### Add Player to Group

| Operation            | Add Player to Group                                                                                                  |                                           |
|----------------------|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------|
| URL                  | /networks/{network_id}/playergroups                                                                                  |                                           |
| Method               | POST                                                                                                                 |                                           |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |                                           |
| Sample Request Data  |  {    "player":1,   "group":2   }                                                                                    | {   "player":1,   "group":2   }           |
|                      | {   "player":1,   "group":2   }                                                                                      |                                           |
| Sample Response Data | {    "player":1,   "group":2,   "id":5   }                                                                           | {   "player":1,   "group":2,   "id":5   } |
|                      | {   "player":1,   "group":2,   "id":5   }                                                                            |                                           |
| Response Status      | 201                                                                                                                  |                                           |
| Notes                | N/A                                                                                                                  |                                           |

### Remove Player from Group

| Operation            | Remove Player from Group                                                                                             |
|----------------------|----------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/playergroups/{id}                                                                             |
| Method               | DELETE                                                                                                               |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |
| Sample Request Data  | None                                                                                                                 |
| Sample Response Data | None                                                                                                                 |
| Response Status      | 200                                                                                                                  |
| Notes                | N/A                                                                                                                  |

## Triggers

### Get All Triggers

| Operation            | Get All Triggers                                                                                                                                                                                                                                                                                                 |                                                                                                                                                                                                                                                                                                                 |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/triggers                                                                                                                                                                                                                                                                                  |                                                                                                                                                                                                                                                                                                                 |
| Method               | GET                                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                 |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                                                                                                                                                                             |                                                                                                                                                                                                                                                                                                                 |
| Sample Request Data  | N/A                                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                 |
| Sample Response Data |  [   {   "name": "Fire Alarm",   "description": "Fire AlarmcContent matched to Interrupt KeyF",   "payload": "F",   "previewurl": null,   "id": 1   },   {   "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   }   ] | [   {   "name": "Fire Alarm",   "description": "Fire AlarmcContent matched to Interrupt KeyF",   "payload": "F",   "previewurl": null,   "id": 1   },   {   "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   }   ] |
|                      | [   {   "name": "Fire Alarm",   "description": "Fire AlarmcContent matched to Interrupt KeyF",   "payload": "F",   "previewurl": null,   "id": 1   },   {   "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   }   ]  |                                                                                                                                                                                                                                                                                                                 |
| Response Status      | 200                                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                 |
| Notes                | N/A                                                                                                                                                                                                                                                                                                              |                                                                                                                                                                                                                                                                                                                 |

### Get Trigger

| Operation            | Get Triggers By ID                                                                                                                                   |                                                                                                                                                     |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/triggers/{id}                                                                                                                 |                                                                                                                                                     |
| Method               | GET                                                                                                                                                  |                                                                                                                                                     |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                 |                                                                                                                                                     |
| Sample Request Data  | N/A                                                                                                                                                  |                                                                                                                                                     |
| Sample Response Data | {    "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   } | {   "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   } |
|                      | {   "name": "Goal Scored",   "description": "Goal Scored content matched to Interrupt Key G",   "payload": "G",   "previewurl": null,   "id": 2   }  |                                                                                                                                                     |
| Response Status      | 200                                                                                                                                                  |                                                                                                                                                     |
| Notes                | N/A                                                                                                                                                  |                                                                                                                                                     |

### Create Trigger

| Operation            | Create Trigger                                                                                                                                                   |                                                                                                                                                                 |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/triggers                                                                                                                                  |                                                                                                                                                                 |
| Method               | POST                                                                                                                                                             |                                                                                                                                                                 |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                             |                                                                                                                                                                 |
| Sample Request Data  | {    "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   }           | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   }           |
|                      | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   }            |                                                                                                                                                                 |
| Sample Response Data | {    "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } |
|                      | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   }  |                                                                                                                                                                 |
| Response Status      | 201                                                                                                                                                              |                                                                                                                                                                 |
| Notes                | N/A                                                                                                                                                              |                                                                                                                                                                 |

### Update Trigger

| Operation            | Update Trigger                                                                                                                                                   |                                                                                                                                                                 |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/triggers/{id}                                                                                                                             |                                                                                                                                                                 |
| Method               | PUT                                                                                                                                                              |                                                                                                                                                                 |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json                                             |                                                                                                                                                                 |
| Sample Request Data  | {    "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } |
|                      | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   }  |                                                                                                                                                                 |
| Sample Response Data | {    "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   } |
|                      | {   "name": "Emergency Message",   "description": "Emergency message content matched to Interrupt Key E",   "payload": "E",   "previewurl": null,   "id": 3   }  |                                                                                                                                                                 |
| Response Status      | 200                                                                                                                                                              |                                                                                                                                                                 |
| Notes                | N/A                                                                                                                                                              |                                                                                                                                                                 |

### Delete Triggers

| Operation            | Delete Trigger                                                                                                       |
|----------------------|----------------------------------------------------------------------------------------------------------------------|
| URL                  | /networks/{network_id}/triggers/{id}                                                                                 |
| Method               | DELETE                                                                                                               |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |
| Sample Request Data  | None                                                                                                                 |
| Sample Response Data | None                                                                                                                 |
| Response Status      | 200                                                                                                                  |
| Notes                | N/A                                                                                                                  |

## Messages

### Send Message

| Operation            | Send Message                                                                                                         |                                                                  |
|----------------------|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| URL                  | /networks/{network_id}/messages                                                                                      |                                                                  |
| Method               | POST                                                                                                                 |                                                                  |
| Headers              | X-SIGNAGELIVE-WBI-APP-ID: {application_id} X-SIGNAGELIVE-WBI-APP-KEY:{application_key} Content-Type:application/json |                                                                  |
| Sample Request Data  | {    "interrupt":1,   "players":[],   "groups":[2]   }                                                               | {   "interrupt":1,   "players":[],   "groups":[2]   }            |
|                      | {   "interrupt":1,   "players":[],   "groups":[2]   }                                                                |                                                                  |
| Sample Response Data | {    "interrupt":1,   "players":[],   "groups":[2],   "id":10   }                                                    | {   "interrupt":1,   "players":[],   "groups":[2],   "id":10   } |
|                      | {   "interrupt":1,   "players":[],   "groups":[2],   "id":10   }                                                     |                                                                  |
| Response Status      | 201                                                                                                                  |                                                                  |
| Notes                | N/A                                                                                                                  |                                                                  |