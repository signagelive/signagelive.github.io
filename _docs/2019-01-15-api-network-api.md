---
layout: doc
title: Network API
date: 2019-09-08 8:14:30 +0600
permalink: api/network-api
post_image: assets/images/service-icon3.png
tags: [Network, API, Developers]
toc: true
---

<style>
   figure.highlight {
      margin-bottom: 0;
   }

   .table-wrapper table {
      width: 100%;
   }

   .table-wrapper table tr td:nth-child(1) {
      width: 20%;
   }
</style>

# Overview

The Network API is the main API used by the Signagelive User Interface, and is designed to be a RESTful API.

Using the Network API it is possible to have access to all of the functionality available within the Signagelive User Interface, alongside being able to send and retrieve data from Signagelive.

This means that you can not only retrieve monitoring data about your Signagelive players, but also upload content, create/edit playlists and publish content to your Players without the need for interaction with the Signagelive User Interface.

## API Status

The Network API is only available to Signagelive partners. If you would like to start using the Network API then please fill out our Signup Form.

## API Updates

In the Signagelive Cloud release on the 26th September 2022, we made some improvements to the way in which Media Assets are created using the Network API.

These improvements include the creation of a single Network API endpoint for all Media Asset creation.

Currently the Network API also contains the previous methods, so that it is backward compatible, and as such you should not notice any issues in your current code base, if you use the Network API to create Media Assets.

This notice is to let you know that in a future release the existing methods will be retired and will no longer be usable. 

The expected timescales for the retirement of these endpoints is 6 months 3rd April 2023 you will be notified again before this occurs and if this date changes, but if you do not update the methods being used, after this point Media Asset Uploads will no longer work.

If you have any questions regarding these changes please contact the Signagelive Team.

The new endpoint is available on the test environment so you can test the code changes there prior to migrating them to production.

The endpoints which are affected are:

|End Point                                      |Type|Body                      |
|-----------------------------------------------|----|--------------------------|
|networks/{networkid}/mediaassets/            |Post|MediaAssetDTO             |
|networks/{networkid}/mediaassets/upload      |Post|Multipart form data       |
|networks/{networkid}/mediaassets/remoteupload|Post|List<RemoteSyncRequestDTO>|


The new endpoint is as follows:

|End Point                                      |Type|Body                      |
|-----------------------------------------------|----|--------------------------|
|/networks/{networkid}/mediaassets/add        |Post|List<NewMediaAssetRequestDTO>|

This takes an array of NewMediaAssetRequest DTOs in the body of the request, this is defined as follows:

{% highlight javascript %}
[
   {
     “type”: {
       “type”: “fileupload”, “nonfileasset” (web site, RSS, MRSS, IPTV), “remotefileupload”
     },
     “mediaAsset”: {
       Media Asset DTO as defined here
     },
     remoteRequest: {
       Remote Sync Request DTO as defined here
     }
   }
]
{% endhighlight %}

The way in which this is created and used, depends on the type of request.

Sending a request to this endpoint, will return an array of NewMediaAssetResponse DTOs, which are defined as follows:

{% highlight javascript %}
[
   {
     “type”: {
       “type”: “fileupload” / “nonfileasset” / “remotefileupload”
     },
     “success”: true/false,
     “errorCode”: “”,
     “errorMessage”: “”,
     “mediaAsset”: MediaAssetDTO,
     “uploadUrl”: “”,
     “uploadContentType”: “”,
     “remoteUrl”: “”,
     “remoteSyncRequestId”: 0,
     “meta_data”: [
       “key”: “”,
       “value”: “”
     ]
   }
]
{% endhighlight %}


### File Uploads
If performing direct file uploads, then this is a 2 step process. The request is sent to the Network API, which will return a pre-signed URL for the file to be uploaded to. An example of the request DTO in this scenario is:

{% highlight javascript %}
[
  {
     “type”: {
       “type”: “fileupload”
     },
     “mediaAsset”: {
       “name”: “filename and extension”
     }
  }
]
{% endhighlight %}

Sending this request will return a NewMediaAssetResponse DTO, and this will include an upload URL, if the success field is set to true.

The file should then be attached to the body of a PUT request, which is sent to the upload URL, and the content/type of the PUT request must be set as the same as the “uploadContentType” returned in the NewMediaAssetResponse DTO.

Once the file is uploaded, it will be processed in the background, a thumbnail created and this will then be marked as supported in Signagelive and will be usable.

The NewMediaAssetResponseDTO will include the MediaAssetDTO of the created Media Asset.

{% highlight javascript %}
[
   {
      “type”: {
        “type”: “fileupload”
      },
      “success”: true/false,
      “errorCode”: “”,
      “errorMessage”: “”,
      “uploadUrl”: “”,
      “uploadContentType”: “”,
      “mediaAsset”: MediaAssetDTO of the created asset
   }
]
{% endhighlight %}


### Non File Uploads
When adding assets which are of the following types, a media asset DTO needs to be created in exactly the same way as you would have with the previous API method, but this needs to be sent as the media asset property of a NewMediaAssetRequestDTO.

Affected types:
Web Page
RSS Feed
MRSS Feed
IPTV Stream

Example request DTO:

{% highlight javascript %}
[
  {
     “type”: {
       “type”: “nonfileasset”
     },
     “mediaAsset”: {
       “name”: “”,
       “url”: “”,
       “type”: “rss” / “web” / “stream”
     }
  }
]
{% endhighlight %}

This will return an array of NewMediaAssetResponse DTOs, if the asset creation was successful, then the success field of each object will be true. If it is false, then the reason will be set in the errorMessage field and the reason code will be in the errorCode field. The errorCode field matches HTTP response codes.

The most likely error you will receive is 409 (Conflict) and this will be because there is already an asset with the same URL or name on the Network.

{% highlight javascript %}
[
   {
      “type”: {
        “type”: “nonfileasset”
      },
      “success”: true/false,
      “errorCode”: “”,
      “errorMessage”: “”,
      “mediaAsset”: MediaAssetDTO of the created asset
   }
]
{% endhighlight %}


### Remote File Uploads
Remote File Uploads will continue to work as defined here. But using the new method, you must include the Remote Sync request DTO as a property of a NewMediaAssetRequest DTO object in the body of the request to the Add API method.

{% highlight javascript %}
[
  {
    “type”: {
       “type”: “remotefileupload”
     },
     “remoteRequest”: RemoteSyncRequestDTO
  }
]
{% endhighlight %}

This will return an array of NewMediaAssetRespone DTOs which will contain the same data as the original RemoteSyncRequestResponseDTO with the fields mapping as follows.

remoteSyncRequestId = remoteSyncRequestId
url = remoteUrl
meta_data = meta_data

An example response DTO is: 

{% highlight javascript %}
[
   {
      “type”: {
        “type”: “remotefileupload”
      },
      “success”: true/false,
      “errorCode”: “”,
      “errorMessage”: “”,
      “remoteUrl”: “”,
      “remoteSyncRequestId”: 0,
      “meta_data”: [
        “key”: “”,
        “value”: “”
      ]
   }
]
{% endhighlight %}

## API URL

We will provide the API url once you have signed up.

## API Setup & Onboarding

On receipt of a request for access to the Network API Signagelive will perform the initial on-boarding and setup to provide access to the Network API on a per network basis.

Note that a single application can be made available to multiple networks.

## Response Codes

The Signagelive Player API will return standard HTTP response codes, clients are expected to respect the response from the API, particularly relating to bad requests, rate limits etc and not attempt to make the call again until either the issue has been resolved or timeout period has passed.

The following table shows a brief summary of the expected API response codes:

| RESPONSE CODE             | DESCRIPTION                                                                                                     |
|---------------------------|-----------------------------------------------------------------------------------------------------------------|
| 200 OK                    | Request was fulfilled                                                                                           |
| 201 Created               | Request was successful and a new document was created                                                           |
| 204 No Content            | The request was successfully processed, but is not returning any content                                        |
| 400 Bad Request           | The request cannot be fulfilled due to bad syntax                                                               |
| 401 Unauthorized          | The supplied credentials do not have access to the requested resource                                           |
| 403 Forbidden             | The supplied credentials have been disabled                                                                     |
| 404 Not Found             | The resource could not be found                                                                                 |
| 405 Method Not Allowed    | A request was made to a resource using a request method not supported by that resource                          |
| 408 Request Timeout       | The server timed out waiting for the request                                                                    |
| 409 Conflict              | The request could not be completed because the request would conflict with data already available on the server |
| 500 Internal Server Error | An internal server error occurred when processing the request                                                   |
| 501 Not Implemented       | The server does not recognise the request                                                                       |
| 503 Service Unavailable   | The servers are up but currently overloaded with requests                                                       |

## Date Formats

Date Time values will be expressed using the ISO 8601 format e.g. 2012-12-31T23:59:59Z. Note that some date time values will be in UTC (using the ‘Z’ time zone designator) and some will be in local time.

Time only values will be expressed as a timespan in the form of "HH:MM:SS" e.g. "15:25:00" for 3:25 PM.

## Security

The API currently implements an OAuth authentication and authorization model whereby a Signagelive UI Token generated by the application framework is exchanged for a OAuth token. OAuth services are provided by OWIN middleware.

Authorization is provided by a custom Authorization Attribute that allows user levels to be passed for each Controller or Methods.

In order to ensure the API is as secure as possible the API and callers do not need to change their code the API will continue to only accept an OAuth token when calling API Methods. Embedded into the OAuth Token is the original SLUI Token which will be passed to the Web Service via the existing Web Service Wrapper.

This methodology will mean that we (or third parties) will not need to change authentication models as we update the Network API, as we can change the data embedded as this is obfuscated by encryption to the caller, and also not change the web service security interface used by the existing Flash modules.

# API Authentication & Authorization

As part of the on-boarding process Signagelive will provide the user with the following credentials, which are required to authenticate with the API:

1. Network ID
2. Client ID
3. Client Secret
4. Authorization Code
5. Grant Type

Upon successful authentication, these credentials will be exchanged for an access token, which should be included with each subsequent request in the Authorization header.

## API Grant Type

The grant type will always be authorization_code.

## API Authentication Operation

To authenticate with the Network API a POST request must be made to {API URL}/token. The body of this request should be populated with the credentials supplied by Signagelive in the form of key/value pairs.

If the authentication request is successful the operation will return a 200 response and a JSON object containing the access token and token type to include in the Authorization header for all subsequent API requests.

The authentication operation is defined below:

| URL                  | /token                                                                                                       |                                                                                                           |
|----------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| Method               | POST                                                                                                         |                                                                                                           |
| Headers              | None                                                                                                         |                                                                                                           |
| Sample Request Data  | grant_type=authorization_code&client_id={client_id}&client_secret ={client_secret}&code={authorization_code} |                                                                                                           |
| Sample Response Data | {     "access_token":"abTyk2XQ5Xdzfp78gOV_4xLD_5eCsYD­",    "token_type":"bearer",    "expires_in":86399 }   | {    "access_token":"abTyk2XQ5Xdzfp78gOV_4xLD_5eCsYD­",    "token_type":"bearer",    "expires_in":86399 } |
|                      | {    "access_token":"abTyk2XQ5Xdzfp78gOV_4xLD_5eCsYD­",    "token_type":"bearer",    "expires_in":86399 }    |                                                                                                           |
| Response Status      | 200                                                                                                          |                                                                                                           |
| Notes                | N/A                                                                                                          |                                                                                                           |

Once a token has expired clients will need to re­authenticate with the API using the
authentication operation in order to get a new access token.

# Models

There are a number of models that can be returned by the Network API

## Network

A network is a Signagelive network.

### Field Definitions

| NAME          | DESCRIPTION                                               |
|---------------|-----------------------------------------------------------|
| name          | The name of the network                                   |
| networkStatus | The Id of the network’s related network status object     |
| kpiSetting    | The Id of the networks related network KPI setting object |

### Example

{% highlight javascript %}
{
   "id":1111,
   "name":"Sample Network",
   "kpiSetting":7332,
   "networkStatus":7715
}
{% endhighlight %}

## Create Network Request

The object used when creating a new network

### Field Definitions

| NAME                      | DESCRIPTION                                                 |
|---------------------------|-------------------------------------------------------------|
| network                   | A network object                                            |
| licenceCode               | A single licence code to be added to the Network            |
| organisationalUnitName    | The name of the Organisational Unit which owns this Network |

### Example

{% highlight javascript %}
{
   "network": {
     "name" :  "New Network", - Required
     "contactName" :  "",
     "contactEmail" : "",
     "contactPhone" : "",
     "addressLine1" : "",
     "addressLine2" : "",
     "city" : "",
     "county" : "",
     "postcode" : "",
     "country" : "United Kingdom" - Required
    },
   "licenceCode":"AAAA-BBBB-CCCC-DDDD", - This is a single licence code
   "organisationalUnitName": "Signagelive OU" - Required for White Labelling
}
{% endhighlight %}

## Network Status

A network’s status is made of a number of network­wide KPIs. The network Status also includes a complete list of players on the network and each player’s individual player KPIs.

### Field Definitions

| NAME                               | DESCRIPTION                                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| connectedPlayers                   | The total number of connected players                                                                                             |
| connectedPlayersAlert              | A boolean indicating whether there is currently an active alert for the number of players not connecting to Signagelive           |
| connectedPlayersPercentage         | The percentage of all players that have connected                                                                                 |
| connectedPlayersWarning            | A boolean indicating whether there is currently an active warning for the number of players not connecting to Signagelive         |
| contentAlert                       | A boolean indicating whether there is currently an active alert for the number of players that do not have their latest content   |
| contentWarning                     | A boolean indicating whether there is currently an active warning for the number of players that do not have their latest content |
| disconnectedPlayers                | The total number of disconnected players                                                                                          |
| playersThatHaveNotGotContent       | The total number of players that have not got their latest content                                                                |
| playersUnableToReportContentStatus | The total number of players unable to report their content status back to Signagelive                                             |
| playersWithContent                 | The total number of players with their latest content                                                                             |
| playersWithContentPercentage       | The percentage of players that have their latest content                                                                          |
| totalActiveAndLicencedPlayers      | The total number of active and licenced players                                                                                   |
| totalDeactivatedPlayers            | The total number of deactivated players                                                                                           |
| totalExpiredPlayers                | The total number of players with licences that have expired                                                                       |
| totalLicencedPlayers               | The total number of licenced players                                                                                              |
| totalOutOfServicePlayers           | The total number of players that are out of service                                                                               |
| uniqueConnectionsThisMonth         | The total number of unique connections this month                                                                                 |
| uniqueConnectionsThisWeek          | The total number of unique connections this week                                                                                  |
| uniqueConnectionsThisYear          | The total number of unique connections this Year                                                                                  |
| uniqueConnectionsToday             | The total number of unique connections today                                                                                      |
| playerStatuses                     | An array of player statuses (Player KPI)                                                                                          |
| lastModifiedDate                   | The datetime that the network status was last updated                                                                             |

### Example

{% highlight javascript %}
{
   "id":1111,
   "lastModifiedDate":"2016­05­27T11:07:20",
   "uniqueConnectionsToday":1,
   "uniqueConnectionsThisWeek":2,
   "uniqueConnectionsThisMonth":5,
   "uniqueConnectionsThisYear":36,
   "totalLicencedPlayers":32,
   "totalActiveAndLicencedPlayers":6,
   "totalDeactivatedPlayers":26,
   "totalExpiredPlayers":120,
   "totalOutOfServicePlayers":0,
   "connectedPlayers":0,
   "disconnectedPlayers":6,
   "connectedPlayersPercentage":0,
   "connectedPlayersWarning":true,
   "connectedPlayersAlert":true,
   "playersWithContent":1,
   "playersUnableToReportContentStatus":0,
   "playersThatHaveNotGotContent":5,
   "playersWithContentPercentage":17,
   "contentWarning":true,
   "contentAlert":true,
   "playerStatuses":[

   ]
}
{% endhighlight %}

## Network KPI

Each network has a collection of KPI settings packaged up within the Network KPI Setting object.

These settings are used to define when the various network and player KPIs will switch between "ok", "warning" and alert states.

### Field Definitions

| NAME                               | DESCRIPTION                                                                                                                                                                                                                                                             |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| network                            | The network Id the Network KPI Settings are for                                                                                                                                                                                                                         |
| percentPlayersNotConnectedWarning  | When the percentage of players connecting to Signagelive is at or below this value a warning will become active for the number of network connections                                                                                                                   |
| percentPlayersNotConnectedAlert    | When the percentage of players connecting to Signagelive is at or below this value an alert will become active for the number of network connections                                                                                                                    |
| percentPlayersNotGotContentWarning | When the percentage of players without their latest content is at or below this value a warning will become active for the network content status                                                                                                                       |
| percentPlayersNotGotContentAlert   | When the percentage of players without their latest content is at or below this value an alert will become active for the network content status                                                                                                                        |
| missedHealthCheckWarning           | The number of health checks a player must miss consecutively in order to trigger a warning status for missed health checks. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                        |
| missedHealthCheckAlert             | The number of health checks a player must miss consecutively in order to an alert status for missed health checks. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                 |
| cPUUsageWarning                    | When a player’s CPU usage reaches or exceeds this percentage a warning status will be triggered for high CPU usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                |
| cPUUsageAlert                      | When a player’s CPU usage reaches or exceeds this percentage an alert status will be triggered for high CPU usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                 |
| memoryUsageWarning                 | When a player’s memory usage reaches or exceeds this percentage a warning status will be triggered for high memory usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                          |
| memoryUsageAlert                   | When a player’s memory usage reaches or exceeds this percentage an alert status will be triggered for high memory usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                           |
| diskUsageWarning                   | When a player’s disk usage reaches or exceeds this percentage a warning status will be triggered for high disk usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                              |
| diskUsageAlert                     | When a player’s disk usage reaches or exceeds this percentage an alert status will be triggered for high disk usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                               |
| temperatureWarning                 | When a player’s temperature reaches or exceeds this percentage a warning status will be triggered for operating at a high temperature. This is the default global setting for all player types that do not have a specific player type KPI setting defined.             |
| temperatureAlert                   | When a player’s temperature reaches or exceeds this percentage an alert status will be triggered for operating at a high temperature. This is the default global setting for all player types that do not have a specific player type KPI setting defined.              |
| rebootNumberWarning                | When a player reboots this many times or more within the reboot warning period a warning status will be triggered for an unusual number of reboots.This is the default global setting for all player types that do not have a specific player type KPI setting defined. |
| rebootWarningPeriod                | The reboot warning period. This is a number in minutes.                                                                                                                                                                                                                 |
| rebootNumberAlert                  | When a player reboots this many times or more within the reboot warning period an alert status will be triggered for an unusual number of reboots.This is the default global setting for all player types that do not have a specific player type KPI setting defined.  |
| rebootAlertPeriod                  | The reboot alert period. This is a number in minutes.                                                                                                                                                                                                                   |

### Example

{% highlight javascript %}
{
   "id":5787,
   "network":1111,
   "percentPlayersNotConnectedWarning":25,
   "percentPlayersNotConnectedAlert":50,
   "percentPlayersNotGotContentWarning":25,
   "percentPlayersNotGotContentAlert":50,
   "missedHealthCheckWarning":2,
   "missedHealthCheckAlert":3,
   "cPUUsageWarning":60,
   "cPUUsageAlert":70,
   "memoryUsageWarning":60,
   "memoryUsageAlert":70,
   "diskUsageWarning":75,
   "diskUsageAlert":90,
   "temperatureWarning":50,
   "temperatureAlert":60,
   "rebootNumberWarning":3,
   "rebootWarningPeriod":10,
   "rebootNumberAlert":5,
   "rebootAlertPeriod":10
}
{% endhighlight %}

## Player KPI

A player KPI contains a combination of player data and player KPIs for a given player.

### Field Definitions

| NAME                        | DESCRIPTION                                                                                 |
|-----------------------------|---------------------------------------------------------------------------------------------|
| player                      | The id of player                                                                            |
| playerType                  | The id of the player type                                                                   |
| label                       | A short label or description for the player                                                 |
| lastModifiedDate            | The datetime that the player configuration was last modified                                |
| lastReboot                  | The datetime of the last reboot                                                             |
| lastHealthCheck             | The datetime of the last health check                                                       |
| lastContentCheck            | The datetime of the last content check                                                      |
| cpuUsage                    | The current CPU usage                                                                       |
| temperatureCelsius          | The current operating temperature                                                           |
| totalMemoryBytes            | The total available memory in bytes                                                         |
| usedMemoryBytes             | The amount of used memory in bytes                                                          |
| memoryUsage                 | The memory usage as a percentage                                                            |
| totalStorageBytes           | The total disk storage in bytes                                                             |
| availableStorageBytes       | The available disk storage in bytes                                                         |
| storageUsage                | The storage usage as a percentage                                                           |
| renewalDate                 | The datetime of the licence renewal date                                                    |
| inService                   | A boolean showing if the player is currently set as in service or out of service</td        |
| isArchived                  | A boolean indicating if the player has been trashed                                         |
| contentUpdateNotification   | A boolean indicating if the player can report back whether or not it has its latest content |
| isActiveAndLicenced         | A boolean indicating if the player is active and licenced                                   |
| isConnected                 | A boolean indicating if the player is connecting to Signagelive                             |
| hasContent                  | A boolean indicating if the player has its latest content                                   |
| clientVersion               | The currently installed client version                                                      |
| hasConnectedToday           | A boolean indicating if the player has connected today                                      |
| hasConnectedThisWeek        | A boolean indicating if the player has connected this week                                  |
| hasConnectedThisMonth       | A boolean indicating if the player has connected this month                                 |
| hasConnectedThisYear        | A boolean indicating if the player has connected this year                                  |
| numberOfMissedHealthChecks  | The number of missed health checks since the last successful health check                   |
| numberOfMissedContentChecks | The number of missed content checks since the last successful content Check                 |
| cpuStatus                   | The player’s CPU status. Possible values are: ok, warning, alert                            |
| memoryStatus                | The player’s memory status. Possible values are: ok, warning, alert                         |
| storageStatus               | The player’s storage status. Possible values are: ok, warning, alert                        |
| temperatureStatus           | The player’s temperature status. Possible values are: ok, warning, alert                    |
| healthCheckStatus           | The player’s health check status. Possible values are: ok, warning, alert                   |
| contentCheckStatus          | The player’s content check status. Possible values are: ok, warning, alert                  |
| status                      | The player’s overall status. Possible values are: ok, warning, alert                        |

### Example

{% highlight javascript %}
{
   "id":12345,
   "player":6123,
   "playerType":33,
   "label":"6237 ­ Sample player",
   "lastModifiedDate":"2016­05­29T09:42:36",
   "lastReboot":"2016­05­29T00:31:00",
   "lastHealthCheck":"2016­05­29T00:45:00",
   "lastContentCheck":"2016­05­29T00:45:00",
   "cpuUsage":35,
   "temperatureCelsius":45,
   "totalMemoryBytes":6787656,
   "usedMemoryBytes":3787656,
   "memoryUsage":70,
   "totalStorageBytes":6787656,
   "availableStorageBytes":3787656,
   "storageUsage":50,
   "renewalDate":"2018­08­29T09:38:10",
   "inService":true,
   "enabled":true,
   "isArchived":false,
   "contentUpdateNotification":true,
   "isActiveAndLicenced":true,
   "isConnected":true,
   "hasContent":false,
   "clientVersion":"2.95",
   "hasConnectedToday":true,
   "hasConnectedThisWeek":true,
   "hasConnectedThisMonth":true,
   "hasConnectedThisYear":false,
   "numberOfMissedHealthChecks":0,
   "numberOfMissedContentChecks":0,
   "cpuStatus":"ok",
   "memoryStatus":"ok",
   "storageStatus":"ok",
   "temperatureStatus":"ok",
   "healthCheckStatus":"ok",
   "contentCheckStatus":"alert",
   "status":"alert"
}
{% endhighlight %}

## Player Type

Signagelive supports a large number of player types from Samsung Smart Signage players to PC’s. Each player has a player type that distinguishes it from other player types.

### Field Definitions

| NAME | DESCRIPTION                 |
|------|-----------------------------|
| name | The name of the player type |

### Example

{% highlight javascript %}
{  
   "id":33,
   "name":"Samsung Smart Signage Solution"
}
{% endhighlight %}

## Player Type KPI Setting

The Player Type KPI Settings are used to override the default network­wide KPI settings on a player type specific basis.

This is useful for networks that use a variety of different players with different operating conditions. For example, certain player types may be more prone to higher memory usage or run at a higher operating temperature when compared against other player types.

### Field Definitions

| NAME                     | DESCRIPTION                                                                                                                                                                                                                                                             |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| playerType               | The ID of the player type the KPI settings relate to                                                                                                                                                                                                                    |
| network                  | The ID of the network the KPI settings relate to                                                                                                                                                                                                                        |
| missedhealthCheckWarning | The number of health checks a player must miss consecutively in order to trigger a warning status for missed health checks. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                        |
| missedHealthCheckAlert   | The number of health checks a player must miss consecutively in order to an alert status for missed health checks. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                 |
| cPUUsageWarning          | When a player’s CPU usage reaches or exceeds this percentage a warning status will be triggered for high CPU usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                |
| cPUUsageAlert            | When a player’s CPU usage reaches or exceeds this percentage an alert status will be triggered for high CPU usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                                 |
| memoryUsageWarning       | When a player’s memory usage reaches or exceeds this percentage a warning status will be triggered for high memory usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                          |
| memoryUsageAlert         | When a player’s memory usage reaches or exceeds this percentage an alert status will be triggered for high memory usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                           |
| diskUsageWarning         | When a player’s disk usage reaches or exceeds this percentage a warning status will be triggered for high disk usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                              |
| diskUsageAlert           | When a player’s disk usage reaches or exceeds this percentage an alert status will be triggered for high disk usage. This is the default global setting for all player types that do not have a specific player type KPI setting defined.                               |
| temperatureWarning       | When a player’s temperature reaches or exceeds this percentage a warning status will be triggered for operating at a high temperature. This is the default global setting for all player types that do not have a specific player type KPI setting defined.             |
| temperatureAlert         | When a player’s temperature reaches or exceeds this percentage an alert status will be triggered for operating at a high temperature. This is the default global setting for all player types that do not have a specific player type KPI setting defined.              |
| rebootNumberWarning      | When a player reboots this many times or more within the reboot warning period a warning status will be triggered for an unusual number of reboots.This is the default global setting for all player types that do not have a specific player type KPI setting defined. |
| rebootWarningPeriod      | The reboot warning period. This is a number in minutes.                                                                                                                                                                                                                 |
| rebootNumberAlert        | When a player reboots this many times or more within the reboot warning period an alert status will be triggered for an unusual number of reboots.This is the default global setting for all player types that do not have a specific player type KPI setting defined.  |
| rebootAlertPeriod        | The reboot alert period. This is a number in minutes.                                                                                                                                                                                                                   |

### Example

{% highlight javascript %}
{
   "playerType":17,
   "network":1111,
   "missedHealthCheckWarning":3,
   "missedHealthCheckAlert":5,
   "cPUUsageWarning":70,
   "cPUUsageAlert":90,
   "memoryUsageWarning":70,
   "memoryUsageAlert":90,
   "diskUsageWarning":70,
   "diskUsageAlert":90,
   "temperatureWarning":40,
   "temperatureAlert":50,
   "rebootNumberWarning":3,
   "rebootWarningPeriod":8,
   "rebootNumberAlert":5,
   "rebootAlertPeriod":7
}
{% endhighlight %}

## Media Asset

A Media Asset is a media object that plays within Signagelive. Media Assets can be audio, video, images, flash, web pages, external executable, IPTV stream, Capture cards or RSS feeds.

### Field Definitions

| NAME                 | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                 | Original names of the file/ name given to the web page / IPTV Stream                                                                                                                                                                                                                                                                                                                                                                            |
| duration             | Duration of the media asset in seconds, if this is a video                                                                                                                                                                                                                                                                                                                                                                                      |
| dateCreated          | The date the media asset was uploaded to the Signagelive Cloud                                                                                                                                                                                                                                                                                                                                                                                  |
| lastUsed             | The date this asset was last added to a playlist.                                                                                                                                                                                                                                                                                                                                                                                               |
| size                 | The size of the asset in bytes if it is a downloadable asset                                                                                                                                                                                                                                                                                                                                                                                    |
| url                  | If this is a downloadable asset the url to download the file from the Signagelive CloudIf this is a remote asset (e.g. web page, IPTV, MRSS) then this is where the resource can be found e.g. the stream url in the case of IPTV                                                                                                                                                                                                               |
| supported            | Boolean indicating if this media asset is supported by any of the Sigangelive players.                                                                                                                                                                                                                                                                                                                                                          |
| includeInProofOfPlay | Boolean indicating if this asset should be logged by the Proof of Play solution each time it is played                                                                                                                                                                                                                                                                                                                                          |
| thumbnails           | The thumbnails object contains properties relating to different thumbnails that Signagelive generates when an asset is uploaded. All assets once processed will have an imageSmall and an imageLarge property referencing jpgs. Video assets will have a videoH264 thumbnail. If a thumbnail/preview is not available in a particular format (could be it’s not processed yet or is not applicable) then the relevant property will be omitted. |
| type                 | High level media type, possible values are: audio image video flash stream web rss tvin widget                                                                                                                                                                                                                                                                                                                                                  |
| hash                 | The hash value used to verify the integrity of the media asset if it is a downloadable asset                                                                                                                                                                                                                                                                                                                                                    |
| hashType             | The type of hash. Values are "CRC32" or "MD5".                                                                                                                                                                                                                                                                                                                                                                                                  |

### Example

{% highlight javascript %}
{
   "id":2675486,
   "name":"interactive_attract_beacon.mp4",
   "dateCreated":"2016-01-26T00:00:00",
   "lastUsed":"2016-02-23T00:00:00",
   "duration":55,
   "size":59750194,
   "url":"https://static.signagelive.com/dc4e5171-45f2-4e81-9c72-bf1493a5a9b0.mp4",
   "supported":true,
   "includeInProofOfPlay":false,
   "thumbnails":{
      "videoH264":"https://static.signagelive.com/2675486.mp4",
      "imageSmall":"https://static.signagelive.com/2675486_s.jpg",
      "imageLarge":"https://static.signagelive.com/2675486_l.jpg"
   },
   "type":"video",
   "hash":"3625388451",
   "hashType":"CRC32"
}
{% endhighlight %}

## Playlist

A playlist is a list of media assets (either physical or virtual such as streams, web pages) that play in the order specified. It is possible to add validity periods and recurrence to media assets in a playlist.

### Field Definitions

| Name                 | Description                                                                                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                 | The name given to the playlist                                                                                                                                                                       |
| dateCreated          | The date the playlist was created                                                                                                                                                                    |
| lastModified         | The date the playlist was last updated                                                                                                                                                               |
| thumbnailUrl         | Url to the thumbnail for the playlist, usually this is the first asset in the playlist.                                                                                                              |
| size                 | Total size of the playlist in bytes. Note this only includes the assets uploaded to the Signagelive Cloud, not any assets referenced by MRSS, as aside anything else they change on a regular basis. |
| includeInProofOfPlay | Boolean indicating if this asset should be logged by the Proof of Play solution each time it is played                                                                                               |
| mediaAssets          | Array of PlaylistMediaAsset objects                                                                                                                                                                  |

### Example

As you will see in the Playlist API Method descriptions it is possible to load a lightweight playlist with no Playlist Media Assets or deepload the Playlist which will include the Playlist Media Assets and associated objects such as conditional playback and validity instructions.

Playlist Media Assets represent an instance of a Media Asset in a Playlist, however contain additional data such as overridden duration and conditions, see Playlist Media Asset section for a full description of all Playlist Media Asset fields. The lightweight playlist is intended to instances where only playlist names and summary items are required e.g. selection lists

The deep loaded playlist is intended where operations are required to access playlist media assets e.g. displaying the contents of a playlist.

Light weight playlist

{% highlight javascript %}
{
   "name":"Stills",
   "dateCreated":"2016-01-26T11:06:03",
   "lastModified":"2016-03-22T14:31:46",
   "size":2698663,
   "mediaAssets":[

   ],
   "includeInProofOfPlay":false,
   "thumbnailUrl":"2675433",
   "id":172204
}
{% endhighlight %}

Deep loaded playlist

{% highlight javascript %}
{
   "name":"Stills",
   "dateCreated":"2016-01-26T11:06:03",
   "lastModified":"2016-03-22T14:31:46",
   "size":2698663,
   "mediaAssets":[
      {
         "duration":10,
         "position":0,
         "includeInProofOfPlay":false,
         "mediaAsset":{
            "name":"5 mins.jpg",
            "dateCreated":"2016-01-26T00:00:00",
            "lastUsed":"2016-02-19T00:00:00",
            "duration":10,
            "size":246788,
            "supported":true,
            "includeInProofOfPlay":false,
            "thumbnails":{
               "imageSmall":"https://static.signagelive.com/2675433_s.jpg",
               "imageLarge":"https://static.signagelive.com/2675433_l.jpg"
            },
            "type":"image",
            "hash":"1168843633",
            "hashType":"CRC32",
            "id":2675433,
            "url":"https://static.signagelive.com/f08215a9-5d89-4d38-9fb2-9445829116f7.jpg"
         },
         "validity":{
            "start":"2016-03-22T00:00:00",
            "end":"2016-03-22T23:59:59",
            "startTime":"00:00:00",
            "endTime":"23:59:59",
            "days":127,
            "id":187149
         },
         "condition":{
            "tags":"testtag",
            "include":true,
            "id":14661
         },
         "id":1526047
      },
      {
         "duration":10,
         "position":1,
         "includeInProofOfPlay":false,
         "mediaAsset":{
            "name":"any device.jpg",
            "dateCreated":"2016-01-26T00:00:00",
            "lastUsed":"2016-01-26T00:00:00",
            "duration":10,
            "size":288531,
            "supported":true,
            "includeInProofOfPlay":false,
            "thumbnails":{
               "imageSmall":"https://static.signagelive.com/2675434_s.jpg",
               "imageLarge":"https://static.signagelive.com/2675434_l.jpg"
            },
            "type":"image",
            "hash":"1245097056",
            "hashType":"CRC32",
            "id":2675434,
            "url":"https://static.signagelive.com/14c6d1b7-3036-430c-ae04-7b98a89041e2.jpg"
         },
         "validity":null,
         "condition":{
            "tags":"excludedtag",
            "include":false,
            "id":14662
         },
         "id":1526048
      },
      {
         "duration":10,
         "position":2,
         "includeInProofOfPlay":false,
         "mediaAsset":{
            "name":"cloud based.jpg",
            "dateCreated":"2016-01-26T00:00:00",
            "lastUsed":"2016-02-19T00:00:00",
            "duration":10,
            "size":236891,
            "supported":true,
            "includeInProofOfPlay":false,
            "thumbnails":{
               "imageSmall":"https://static.signagelive.com/2675435_s.jpg",
               "imageLarge":"https://static.signagelive.com/2675435_l.jpg"
            },
            "type":"image",
            "hash":"4088072532",
            "hashType":"CRC32",
            "id":2675435,
            "url":"https://static.signagelive.com/c46a2e56-c7cc-49fc-83ad-98c16e0a0ec0.jpg"
         },
         "validity":null,
         "condition":null,
         "id":1526049
      }
   ],
   "includeInProofOfPlay":false,
   "thumbnailUrl":"2675433",
   "id":172204
}
{% endhighlight %}

## Playlist Media Asset

A playlist media asset represents an instance of a media asset in a playlist

### Field Definitions

| NAME                 | DESCRIPTION                                                                                                                                                                                                                                                                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| mediaAsset           | The media asset object                                                                                                                                                                                                                                                                                                                        |
| duration             | The duration this media asset should play in the playlist, this may override the actual duration of the media asset. If this is 0 then the duration then this implies play to length i.e. the duration of the actual media asset. If this is 0 then the duration then this implies play to length i.e. the duration of the actual media asset |
| position             | The position of the asset in the playlist, this is zero based                                                                                                                                                                                                                                                                                 |
| includeInProofOfPlay | Boolean indicating if this asset should be logged by the Proof of Play solution each time it is played                                                                                                                                                                                                                                        |
| validity             | Optional validity object. If this is null then the media asset is available to play at all times                                                                                                                                                                                                                                              |
| conditions           | Optional conditions, if this is not then there are no conditions associated with the playback of this media asset.                                                                                                                                                                                                                            |

### Example

{% highlight javascript %}
{
   "duration":10,
   "position":0,
   "includeInProofOfPlay":false,
   "mediaAsset":{
      "name":"5 mins.jpg",
      "dateCreated":"2016-01-26T00:00:00",
      "lastUsed":"2016-02-19T00:00:00",
      "duration":10,
      "size":246788,
      "supported":true,
      "includeInProofOfPlay":false,
      "thumbnails":{
         "imageSmall":"https://static.signagelive.com/2675433_s.jpg",
         "imageLarge":"https://static.signagelive.com/2675433_l.jpg"
      },
      "type":"image",
      "hash":"1168843633",
      "hashType":"CRC32",
      "id":2675433,
      "url":"https://static.signagelive.com/f08215a9-5d89-4d38-9fb2-9445829116f7.jpg"
   },
   "validity":{
      "start":"2016-03-22T00:00:00",
      "end":"2016-03-22T23:59:59",
      "startTime":"00:00:00",
      "endTime":"23:59:59",
      "Days":127
   },
   "condition":{
      "tags":"testtag",
      "include":true
   },
   "id":1526047
}
{% endhighlight %}

## Playlist Media Asset Conditions

### Field Definitions

| NAME    | DESCRIPTION                                                                                           |
|---------|-------------------------------------------------------------------------------------------------------|
| tags    | Tags used for matching                                                                                |
| include | Boolean indicating if a match of tags includes (plays) the media asset or excludes it (does not play) |

### Example

{% highlight javascript %}
{
   "tags":"testtag",
   "include":true,
   "id":14661
}
{% endhighlight %}

## Validity

### Field Definitions

| NAME      | DESCRIPTION                                                                                                                                                                                                                                                        |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| start     | The day and time that the asset is valid from. Values will either be a date/time (ISO 8601) or null.                                                                                                                                                               |
| end       | The day and time that the asset is valid to. Values will either be a date/time or null.                                                                                                                                                                            |
| startTime | The time of day that the item can be displayed from.                                                                                                                                                                                                               |
| endTime   | The time of day that the item can be displayed to.                                                                                                                                                                                                                 |
| days      | The days on which the item is valid. It is an integer representation of binary flags. 64 = Monday 32 = Tuesday 16 = Wednesday 8 = Thursday 4 = Friday 2 = Saturday 1 = Sunday i.e a value of 6 indicates that the screen control plan is valid Monday and Tuesday. |

Where a start and end date are specified, the media asset is to be played between those dates only.

Where a startTime, endTime and days are specified, the asset is only to be played between the times of day and days of the week given. If the endTime is before the startTime the item has been configured to be active overnight.

An asset could have a start and end specified, or a startTime, endTime and days specified, or both.

### Example

{% highlight javascript %}
{
   "start":"2016-03-22T00:00:00",
   "end":"2016-03-22T23:59:59",
   "startTime":"00:00:00",
   "endTime":"23:59:59",
   "days":127
}
{% endhighlight %}

## Playlist Media Asset Actions

### Field Definitions

| NAME     | DESCRIPTION                                                                                                                                                                                                                                                        |
|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type     | HTTPGET HTTPPOST [Reserved for future use] HTTPPUT [Reserved for future use] HTTPDELETE [Reserved for future use] WRITETOFILE                                                                                                                                      |
| url      | The url to call if any any of the HTTPx action types are used, can be omitted if using WRITETOFILE                                                                                                                                                                 |
| filename | The filename to write data to. Can be omitted if any of the HTTPx methods are used                                                                                                                                                                                 |
| data     | The data to write data to the file specified in the filename property. Can be omitted if any of the HTTPx methods are used. Note that in the future this will be used to store data to be POSTed/PUT on the server by the appropriate HTTPx method.                |
| days     | The days on which the item is valid. It is an integer representation of binary flags. 64 = Monday 32 = Tuesday 16 = Wednesday 8 = Thursday 4 = Friday 2 = Saturday 1 = Sunday i.e a value of 6 indicates that the screen control plan is valid Monday and Tuesday. |

### Example

The following example shows how to specify that a url can be called when a media asset is played:

{% highlight javascript %}
{
   "type":"",
   "url":"http://www.signagelive.com"
}
{% endhighlight %}

The following example shows how to specify a file and the data this is written to it when the media asset is played

{% highlight javascript %}
{
   "type":"",
   "filename":"test.txt",
   "data":"12345"
}
{% endhighlight %}

## Thumbnail Request

### Field Definitions

| NAME      | DESCRIPTION                                            |
|-----------|--------------------------------------------------------|
| assetId   | Id of the media asset to create a thumbnail at all     |
| timeIndex | Position in the media asset to take the screen capture |

### Example

{% highlight javascript %}
{

   "assetId":12345,
   "timeIndex":12
}
{% endhighlight %}

## Media Asset Metadata

The media asset metadata object contains meta-data

### Field Definitions

| NAME                  | DESCRIPTION                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| NAME                  | DESCRIPTION                                                                                                        |
| fileSize              | The size of the file in bytes. This is omitted if this is not a downloadable file type e.g. a web page             |
| duration              | The duration of the content if this is a video of flash file, otherwise it is omitted                              |
| fileType              | File Extension                                                                                                     |
| width                 | If detected the pixel width of the file, will be omitted if this is not available                                  |
| height                | If detected the pixel height of the file, will be omitted if this is not available                                 |
| bitrate               | The high level bit rate of the file if it is a video, will be omitted if this is not available                     |
| videoCodec            | The video codec used, will be omitted if this is not available                                                     |
| videoCodecFriendly    | Friendly name for the video coded, will be omitted if this is not available                                        |
| videoBitrate          | Bitrate used to encode the video stream, will be omitted if this is not availabl                                   |
| audioCodec            | Audio Codec used, will be omitted if this is not available                                                         |
| audioCodecFriendly    | Friendly name for the audio codec used, will be omitted if this is not available                                   |
| audioBitRate          | Bit rate used to encode the audio stream, will be omitted if this is not available                                 |
| audioSampleRate       |                                                                                                                    |
| flashVersion          | Version of Flash this file was created in, will be omitted if this is not available i.e. not a flash file flashFPS |
| flashFPS              | Frame Per Second the Flash Video was created with, will be omitted if this is not available i.e. not a flash file  |
| videoPreviewAvailable | Boolean indicating if a video preview is available, will be omitted if this is not available i.e. not a flash file |
| playToLength          |                                                                                                                    |

### Example

{% highlight javascript %}
{
   "id":12345,
   "fileSize":1234,
   "duration":10,
   "fileType":"",
   "width":1920,
   "height":1080,
   "bitrate":12345,
   "videoCodec":"",
   "videoCodecFriendly":"",
   "videoBitrate":1234,
   "audioCodec":"",
   "audioCodecFriendly":"",
   "audioBitrate":1234,
   "audioSampleRate":1234,
   "flashVersion":"",
   "flashTotalFrames":1234,
   "flashFPS":1234,
   "videoPreviewAvailable":true,
   "playToLength":false
}
{% endhighlight %}

## Tags

### Field Definitions

| NAME | DESCRIPTION                 |
|------|-----------------------------|
| tag  | The string value of the tag |

### Example

{% highlight javascript %}
{
    "id": 2671425,
    "tag": "screenfeed"
}
{% endhighlight %}

## Proof of Play Reference

### Field Definitions

| NAME  | DESCRIPTION                                    |
|-------|------------------------------------------------|
| value | The reference text                             |
| item  | The ID of the object that the reference is for |

### Example

{% highlight javascript %}
{
   "id":4653,
   "value":"Cheese",
   "item":1253
}
{% endhighlight %}

## Folder

### Field Definitions

| NAME      | DESCRIPTION                                                                                                             |
|-----------|-------------------------------------------------------------------------------------------------------------------------|
| name      | The name of the folder                                                                                                  |
| itemCount | The number of items in the folder, this cannot be written too, it is updated by the adding/removing items from a folder |
| type      | The Object type this folder will contain. This is a required field                                                      |


### Example

{% highlight javascript %}
{
   "id":84653,
   "name":"Default Content",
   "itemCount":12,
   "type":"mediaasset"
}
{% endhighlight %}

## FolderItem

### Field Definitions

| NAME   | DESCRIPTION                       |
|--------|-----------------------------------|
| folder | The ID of the folder              |
| itemId | The ID of the item in the folder. |

### Example

{% highlight javascript %}
{
   "id":84653,
   "folder":213,
   "itemId":1225
}
{% endhighlight %}

## Layout

A layout is the design that is going to be displayed on the screen. Each layout has one or more media zones that define where scheduled content will play.

### Field Definitions

| NAME                  | DESCRIPTION                                                                                                                       |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| name                  | The layout name                                                                                                                   |
| dateCreated           | The date the layout was created                                                                                                   |
| createdBy             | The username of the user who created the layout                                                                                   |
| width                 | Layout width in pixels                                                                                                            |
| height                | Layout height in pixels                                                                                                           |
| orientation           | Layout orientation                                                                                                                |
| backgroundImage       | The ID of the background image media asset, or null if there is none                                                              |
| backgroundColour      | The background colour of the layout. Colours will be a HTML colour code e.g. "#FFAA11" or "transparent"                           |
| customBackgroundImage | If a custom background image has been created in the layout designer, this will be the ID of the the CustomBackgroundImage object |
| mediaWindows          | A list of media windows in the layout                                                                                             |
| isInTrash             | A boolean value indicating whether or not the layout is in the trash                                                              |
| isTemplate            | A boolean value indicating whether or not the layout is a template layout                                                         |
| isDeployed            | Is the layout deployed? Note: only returned for a single layout                                                                   |
| font                  | The default font in use on the layout                                                                                             |
| fontSize              | The default font size                                                                                                             |
| fontColour            | The default font colour. The colour will be a HTML colour code                                                                    |
| fontIsBold            | A boolean value to indicate whether or not the font is bold                                                                       |
| fontIsItalic          | A boolean value to indicate whether or not the font is italic                                                                     |
| fontIsUnderlined      | A boolean value to indicate whether or not the font is underlined                                                                 |
| textAlign             | The default text alignment. Possible values are: left right center justify                                                        |
| includeInProofOfPlay  | A boolean value to indicate whether or not the layout is included in proof of play logging                                        |
| dateModified          | The last modified date of the layout                                                                                              |

### Example

{% highlight javascript %}
{
   "id":1234,
   "name":"My Layout",
   "dateCreated":"2016-07-21T15:38:07.455Z",
   "createdBy":"user@signagelive.com",
   "width":1920,
   "height":1080,
   "orientation":"landscape",
   "backgroundImage":12345,
   "backgroundColour":"#FFFFFF",
   "customBackgroundImage":null,
   "mediaWindows":[
      {
         "id":4567,
         "x":0,
         "y":0,
         "width":1920,
         "height":1080,
         "zIndex":0,
         "type":"standard",
         "propertiesCSV":"",
         "layerName":"",
         "includeInProofOfPlay":false,
         "configuredWidgetPreferences":null
      }
   ],
   "isInTrash":false,
   "isTemplate":false,
   "isDeployed":true,
   "font":{
      "name":"Arial",
      "size":12,
      "colour":"#000000",
      "isBold":false,
      "isItalic":false,
      "isUnderlined":false,
      "alignment":"left"
   },
   "includeInProofOfPlay":false,
   "dateModified":"2016-07-21T15:38:07.458Z",
   "thumbnailUrl":"   http://url.to.thumbnail/thumb.jpg"
}
{% endhighlight %}

## Media Window

A media window is an area on the screen that plays content (images, video etc or text). A media zone will contain a single media asset and or one or more playlists.

A default playlist plays in a media zone when there is nothing else to play.

### Field Definitions

| NAME                        | DESCRIPTION                                                                                                                           |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| x                           | The x coordinate of the window within the layout                                                                                      |
| y                           | The y coordinate of the window within the layout                                                                                      |
| width                       | Window Width                                                                                                                          |
| height                      | Window Height                                                                                                                         |
| zIndex                      | Window Z-Index                                                                                                                        |
| type                        | Window type. Possible values are: standard ticker staticText staticImage legacyWidget pictureInPicture webBrowserWidget qrCode widget |
| propertiesCSV               | A CSV list of properties used to configure the window                                                                                 |
| layerName                   | The name of the window                                                                                                                |
| includeInProofOfPlay        | A boolean value indicating whether or not the window is enabled for proof of play                                                     |
| configuredWidgetPreferences | A list of widget preferences                                                                                                          |

### Example

{% highlight javascript %}
{
  "x": 0,
  "y": 0,
  "width": 1920,
  "height": 1080,
  "zIndex": 0,
  "type": "standard",
  "propertiesCSV": "",
  "layerName": "",
  "includeInProofOfPlay": false,
  "configuredWidgetPreferences": null
}
{% endhighlight %}

## Player

A player refers to a Signagelive player connecting to the Signagelive network.

A client/player is the device that connects to the Signagelive Player API and plays content that has been scheduled in the form of layouts downloaded from the server.

### Field Definitions

| NAME                       | DESCRIPTION                                                                                                                                                                                               | UPDATEABLE |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| serialNumber               | The player serial number                                                                                                                                                                                  | No         |
| type                       | The ID of the player type record for the player                                                                                                                                                           | No         |
| pcClientEdition            | The edition of the player. This only applies to the PC player and can be: 0 (Display Edition) 1 (Corporate Communications) 2 (Screensaver)                                                                | No         |
| clientVersion              | Version of the client installed on the player                                                                                                                                                             | No         |
| clientId                   | Unique ID provided by the hardware                                                                                                                                                                        | No         |
| enabled                    | Boolean value indicating whether or not the player is enabled                                                                                                                                             | No         |
| scheduledRebootEnabled     | Boolean value indicating whether or not the player is set to reboot automatically                                                                                                                         | Yes        |
| isUploadingLogFiles        | Boolean value indicating whether or not the player should upload its log files to Signagelive.                                                                                                            |            |
| separateRssSync            | Boolean value indicating whether or not the player should sync RSS feeds separately to content checks                                                                                                     | Yes        |
| lastHealthCheck            | Date/time of the last health check                                                                                                                                                                        | No         |
| lastContentCheck           | Date/time of the last content check                                                                                                                                                                       | No         |
| lastReboot                 | Date/time of the last reboot                                                                                                                                                                              | No         |
| contentCheckType           | The type of content check done by the player. This will be one of the following: 0 – Set interval e.g. every 30 minutes 1 – Daily – Player will perform a content check at a set time every day           | Yes        |
| contentCheckFrequency      | If contentCheckType is set to 0, this will be how frequently the player will perform content checks. Value is in minutes.                                                                                 | Yes        |
| contentCheckTime           | If contentCheckType is set to 1, this will be the time of day that the player will perform a content check. The value will be a string representation of the time e.g "11:44:00".                         | Yes        |
| healthCheckFrequency       | The frequency, in minutes, that the player will perform health checks.                                                                                                                                    | Yes        |
| diagnosticsUpdateType      | The type of diagnostics update done by the player. This will be one of the following: 0 – Set interval e.g. every 30 minutes 1 – Daily – Player will perform a diagnostics update at a set time every day | Yes        |
| diagnosticsUpdateFrequency | If diagnosticsUpdateType is set to 0, this will be how frequently the player will perform diagnostics update. Value is in minutes.                                                                        | Yes        |
| diagnosticsUpdateTime      | If diagnosticsUpdateType is set to 1, this will be the time of day that the player will perform a content check. The value will be a string representation of the time e.g "11:44:00".                    | Yes        |
| dateActivated              | The date the licence was activated on the player.                                                                                                                                                         | No         |
| inService                  | Boolean value indicating whether or not the player is marked as in service.                                                                                                                               | Yes        |
| followUpRequired           | Boolean value indicating whether or not the player is marked as requiring a follow up.                                                                                                                    | Yes        |
| maintenanceRequired        | Boolean value indicating whether or not the player is marked as requiring maintenance.                                                                                                                    | Yes        |
| monthlyBandwidthLimit      | The monthly bandwidth limit for the player, in gigabytes.                                                                                                                                                 | No         |
| defaultPlaylist            | The Id of the default playlist published to the player                                                                                                                                                    | Yes*       |
| defaultPlaylistDeployed    | Boolean value indicating whether or not the player has successfully downloaded the default playlist                                                                                                       | No         |
| licence                    | The Id of the player’s licence                                                                                                                                                                            | No         |
| scheduledRebootTime        | The time of day that the player will reboot.                                                                                                                                                              | Yes        |
| rebootAtNextContentCheck   | A boolean value indicating whether or not the player should reboot when it next performs a content check.                                                                                                 | Yes        |
| proofOfPlayEnabled         | A boolean value indicating whether or not proof of play has been enabled on the player.                                                                                                                   | Yes        |
| site                       | The location and contact information for the playe                                                                                                                                                        | Yes        |
| isInTrash                  | A boolean value indicating whether or not the player is in the trash                                                                                                                                      | Yes        |
      * This field can only be updated to ‘null’ to remove the default playlist |

### Example

{% highlight javascript %}
{
  "id": 12345,
  "serialNumber": "123321",
  "type": 33,
  "pcClientEdition": null,
  "clientVersion": "2.97",
  "clientId": "71-65-7F-AA-E3-8E",
  "enabled": true,
  "scheduledRebootEnabled": true,
  "isUploadingLogFiles": false,
  "separateRssSync": false,
  "lastHealthCheck": "2016-07-15T13:44:56.879Z",
  "lastContentCheck": "2016-07-15T13:44:56.879Z",
  "lastReboot": "2016-07-15T13:44:56.879Z",
  "contentCheckType": 0,
  "contentCheckFrequency": 30,
  "contentCheckTime": null,
  "healthCheckFrequency": 15,
  "diagnosticsUpdateType": 0, 
  "diagnosticsUpdateFrequency": 30,
  "diagnosticsUpdateTime": null,
  "dateActivated": "2016-07-15T13:44:56.879Z",
  "inService": true,
  "followUpRequired": false,
  "maintenanceRequired": false,
  "monthlyBandwidthLimit": 5,
  "defaultPlaylist": 45678,
  "defaultPlaylistDeployed": true,
  "licence": 98765,
  "scheduledRebootTime": "20:00:00",
  "rebootAtNextContentCheck": false,
  "proofOfPlayEnabled": false,
  "site": {
	"name": "My Player",
	"addressLine1": "123 Fake Street",
	"addressLine2": "",
	"city": "London",
	"county": "",
	"postcode": "SW1A 1AA",
            "country": "UK",
	"contact": "Mr S Baldrick",
	"phone": "01245 123123",
	"email": "sbaldrick@example.com",
	"referenceCode1": "Main",
	"referenceCode2": "Front",
	"referenceCode3": "Left",
	"latitude": 51.5014,
	"longitude": -0.1419,
	"timezone": "Europe/London",
"ipAddress": "5.159.121.68"
  },
  "isInTrash": false,
  "lastScreenshotUrl": "http://"
}
{% endhighlight %}

## Site

### Field Definitions

| NAME           | DESCRIPTION                                                 |
|----------------|-------------------------------------------------------------|
| name           | The name assigned to the player or location                 |
| addressLine1   | The first line of the address                               |
| addressLine2   | The second line of the address                              |
| city           | Town/City                                                   |
| county         | County/State                                                |
| postcode       | Postcode/Zipcode                                            |
| country        | Country                                                     |
| phone          | Contact phone number                                        |
| email          | Email Address                                               |
| referenceCode1 | Reference Code 1                                            |
| referenceCode2 | Reference Code 2                                            |
| referenceCode3 | Reference Code 3                                            |
| latitude       | Latitude portion of the location, represented as a decimal  |
| longitude      | Longitude portion of the location, represented as a decimal |
| timezone       | IANA timezone database timezone name                        |
| ipAddress      | The external IP address detected by Signagelive             |

### Example

{% highlight javascript %}
{
   "name":"My Player",
   "addressLine1":"123 Fake Street",
   "addressLine2":"",
   "city":"London",
   "county":"",
   "postcode":"SW1A 1AA",
   "country":"UK",
   "contact":"Mr S Baldrick",
   "phone":"01245 123123",
   "email":"sbaldrick@example.com",
   "referenceCode1":"Main",
   "referenceCode2":"Front",
   "referenceCode3":"Left",
   "latitude":51.5014,
   "longitude":-0.1419,
   "timezone":"Europe/London",
   "ipAddress":"5.159.121.68"
}
{% endhighlight %}

## Bandwidth Usage

### Field Definitions

| NAME          | DESCRIPTION                                  |
|---------------|----------------------------------------------|
| month         | The month that the bandwidth log applies for |
| bandwidthUsed | Bandwidth used in bytes                      |

### Example

{% highlight javascript %}
{
  "id": "1243",
  "month": "2016-07-01T00:00:00.000Z",
  "bandwidthUsed": 534624624
}
{% endhighlight %}

## Player Type

### Field Definitions

| NAME                               | DESCRIPTION                                                                                                                                             |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                               | A friendly name given to the player type                                                                                                                |
| commonName                         | A name that is used to identify a player when it connects to Signagelive                                                                                |
| supportsFullscreen                 | A boolean value that indicates whether or not the player supports fullscreen content                                                                    |
| supportsLayouts                    | A boolean value that indicates whether or not the player supports layouts                                                                               |
| supportsWeb                        | A boolean value that indicates whether or not the player supports web content                                                                           |
| supportsStream                     | A boolean value that indicates whether or not the player supports stream content                                                                        |
| supportsTvIn                       | A boolean value that indicates whether or not the player supports TV-in e.g. HDMI or display port input                                                 |
| supportsPictureInPicture           | A boolean value that indicates whether or not the player supports picture in picture                                                                    |
| supportsFlash                      | A boolean value that indicates whether or not the player supports flash content                                                                         |
| supportsExecutable                 | A boolean value that indicates whether or not the player supports executable files                                                                      |
| supportsSync                       | A boolean value that indicates whether or not the player supports player synchronisation                                                                |
| supportsInterrupts                 | A boolean value that indicates whether or not the player supports interrupts                                                                            |
| supportsMediaRss                   | A boolean value that indicates whether or not the player supports media rss feeds                                                                       |
| supportsMediaRssValidity           | A boolean value that indicates whether or not the player supports validity in media rss feeds                                                           |
| supportsWidgets                    | A boolean value that indicates whether or not the player supports widgets                                                                               |
| supportsControlInterrupts          | A boolean value that indicates whether or not the player supports interrupts in playlists                                                               |
| supportsContentUpdateNotifications | A boolean value that indicates whether or not the player is able to provide notifications when content has been successfully downloaded                 |
| supportsStoreForwardScheduling     | A boolean value that indicates whether or not the player supports store and forward scheduling.                                                         |
| supportsScheduledRecurrence        | A boolean value that indicates whether or not the player supports schedule recurrence                                                                   |
| supportsAssetLevelRecurrence       | A boolean value that indicates whether or not the player supports asset level recurrence                                                                |
| supportsSystemInformationReporting | A boolean value that indicates whether or not the player supports the reporting of system diagnostics information                                       |
| supportsSeparateRssContentUpdate   | A boolean value that indicates whether or not the player can download RSS feed content separately to content checks                                     |
| supportsSettingDefaultVideoInput   | A boolean value that indicates whether or not the player can set the default video input.                                                               |
| supportsScreenControl              | A boolean value that indicates whether or not the player supports switching the screen on and off                                                       |
| supportsBootupNotifications        | A boolean value that indicates whether or not the player supports sending bootup notifications to Signagelive                                           |
| supportsHealthCheckNotifications   | A boolean value that indicates whether or not the player supports sending health checks to Signagelive                                                  |
| supportsAutomaticPlayerReboots     | A boolean value that indicates whether or not the player supports automatic reboots                                                                     |
| supportsInstantPlayerReboots       | A boolean value that indicates whether or not the player supports rebooting after a content check                                                       |
| supportsNetworkingConfiguration    | A boolean value that indicates whether or not the player supports the setting of networking configuration settings                                      |
| supportsWirelessConfiguration      | A boolean value that indicates whether or not the player supports the setting of wireless network configuration settings                                |
| thumbnailUrl                       | A string value which is a URL to an image which represents the player type.                                                                             |
| supportsSSL                        | A boolean value that indicates whether or not the player supports SSL/TLS.                                                                              |
| supportsProofOfPlay                | A boolean value that indicates whether or not the player supports proof of play                                                                         |
| endPointType                       | The type of endpoint that the player will connect to. Possible values are: LegacyPlayer VirtualPlayerBridge InstoreScreen PlayerAPI SimpleSMIL FullSMIL |
| supportedFileTypes                 | A string which contains a CSV list of supported file types                                                                                              |
| supportedCodecs                    | A string which contains a CSV list of supported codecs                                                                                                  |

### Example

{% highlight javascript %}
{
  "id": 123,
  "name": "Signagelive PC Client",
  "commonName": "sl-pc",
  "features": {
      "fullscreen": true,
      "layouts": true,
      "web": true,
      "streams": true,
      "tvIn": true,
      "pictureInPicture": false,
      "flash": true,
      "executable": true,
      "sync": true,
      "interrupts": true,
      "mediaRss": true,
      "mediaRssValidity": true,
      "widgets": false,
      "controlInterrupts": true,
      "contentUpdateNotifications": true,
      "storeForwardScheduling": true,
      "scheduleRecurrence": true,
      "assetLevelRecurrence": true,
      "systemInformationReporting": true,
      "separateRssContentUpdate": true,
      "settingDefaultVideoInput": true,
      "screenControl": true,
      "bootupNotifications": true,
      "healthCheckNotifications": true,
      "automaticPlayerReboots": true,
      "instantPlayerReboots": true,
      "networkingConfiguration": true,
      "wirelessConfiguration": true,
      "ssl": true,
      "proofOfPlay": true,
      "fileTypes": "mp3,ogg,f4a,m4a,wma,wmv,mpg,mpeg,mkv,mov,divx,mp4,m4v,webm,jpg,jpeg,png,gif,swf,html",
      "codecs": "mp3,h264,h265,vc1"
    },
  "thumbnailUrl": "http://c1173866.r66.cf3.rackcdn.com/player_display_edition.png",
  "endPointType": "LegacyPlayer"
}
{% endhighlight %}

## Player Content Status

### Field Definitions

| NAME   | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                              |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Id     | An integer representing the Id of the player                                                                                                                                                                                                                                                                                                                                                             |
| status | A string value representing the status of published content for the player: ContentDeployed – All content has been successfully downloaded by the player FutureContentNotDeployed – The player has its current content but it has yet to download some content that will become active in the future ContentNotDeployed – The player has yet to download the content that it should currently be playing |

### Example

{% highlight javascript %}
{
   "id":2671425,
   "status":"ContentDeployed"
}
{% endhighlight %}

## Player Screen Status

### Field Definitions

| NAME   | DESCRIPTION                                                                                                                                                      |
|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Id     | An integer representing the Id of the player                                                                                                                     |
| status | A string value representing the status of the screen for this player: ScreenOn – The screen is scheduled to be on. ScreenOff – The screen is scheduled to be off |

### Example

{% highlight javascript %}
{
    "id": 2671425,
    "status": "ScreenOn"
}
{% endhighlight %}

## System Information

### Field Definitions

| NAME                | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name                | The system name as supplied by the client or determined by the player type                                                                                                                                                                                                                                                                                                                                                                                                                        |
| manufacturer        | The system manufacturer                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| upTime              | System uptime in seconds                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| systemTime          | The system time at the last diagnostics update                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| timezone            | The timezone as reported by the client, specified using the IANA timezone name                                                                                                                                                                                                                                                                                                                                                                                                                    |
| operatingSystem     | The player operating system – name – the operating system name version – the current OS version                                                                                                                                                                                                                                                                                                                                                                                                   |
| memory              | The current status of the client’s memory totalBytes – Total amount of memory in bytes usedBytes – Amount of used memory in bytes                                                                                                                                                                                                                                                                                                                                                                 |
| processor           | Information about the player’s processor name – The processor name speed – Processor speed in MHz usage – Processor usage in percent                                                                                                                                                                                                                                                                                                                                                              |
| temperatures        | A list of temperature sensors name – The sensor name temperatureCelsius – Current temperature in celsius                                                                                                                                                                                                                                                                                                                                                                                          |
| networkAdapters     | A list of network adapters present on the player type – Network adapter type. Values can be "Ethernet", "Wifi" or "Mobile" dhcp – A boolean value indicating whether or not the adapter us using DHCP ipv4Address – The IPv4 address for the network adapter subnetMask – the subnet mask for the network adapter defaultGateway – The default gateway for the network adapter dns1 – The primary DNS server dns2 – The secondary DNS server macAddress – The MAC address for the network adapter |
| applicationSettings | A list of name/value pairs of settings set in the application                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| systemSettings      | A list of name/value pairs of settings set on the player’s system                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| installedSoftware   | A list of installed software on the client name – The name of the software version – The installed version publisher – The publisher of the software                                                                                                                                                                                                                                                                                                                                              |
| runningProcesses    | A list of processes currently running on the client name – The name of the process description – A short description provided by the client averageCpuUsage – The average CPU usage in percent averageMemoryUsage – The average memory usage in bytes currentCpuUsage – Current CPU usage in percent currentMemoryUsage – Current memory usage in bytes                                                                                                                                           |
| monitors            | A list of monitors attached to the player name – A name given to the monitor positionX – X-Coordinate for the monitor, to identify its position in a multi-monitor setup. positionY – Y-Coordinate for the monitor, to identify its position in a multi-monitor setup. resolutionX – Monitor width in pixels resolutionY – Monitor height in pixels                                                                                                                                               |
| drives              | A list of storage devices available on the player name – The name given to the storage device e.g. "C:\", "Internal Storage" totalBytes – Total size of the storage device in bytes availableBytes – Available space in bytes format – The file format if available e.g. NTFS, FAT32                                                                                                                                                                                                              |
| graphicsControllers | A list of graphics controllers available on the player name – The name given to the graphics controller e.g. "Internal Graphics" or "AMD Radeon R9 380" resolutionX – Output resolution of the device in pixels (width) resolutionY – Output resolution of the device in pixels (height)                                                                                                                                                                                                          |

### Example

{% highlight javascript %}
{
   "id":1234,
   "name":"Signagelive Samsung SSP",
   "manufacturer":"Samsung",
   "model":"",
   "upTime":124152155,
   "systemTime":"2016-07-19T15:20:58.563Z",
   "timezone":"Europe/London",
   "operatingSystem":{
      "name":"Samsung SoC",
      "version":""
   },
   "memory":{
      "totalBytes":1073741824,
      "usedBytes":719323136
   },
   "processor":{
      "name":"Samsung SoC",
      "speed":1000,
      "usage":55
   },
   "temperatures":[
      {
         "name":"CPU",
         "temperatureCelsius":59
      }
   ],
   "networkAdapters":[
      {
         "type":"Ethernet",
         "dhcp":true,
         "ipv4Address":"192.168.0.20",
         "subnetMask":"255.255.255.0",
         "defaultGateway":"192.168.0.1",
         "dns1":"8.8.8.8",
         "dns2":"8.8.4.4",
         "macAddress":"AA:BB:CC:DD:EE:FF"
      }
   ]   "applicationSettings":[
      {
         "name":"storage_location",
         "value":"local"
      }
   ],
   "systemSettings":[
      {
         "name":"mute_status",
         "value":"Mute On"
      }
   ],
   "installedSoftware":[
      {
         "name":"A package",
         "version":"2014.11.11",
         "publisher":"Signagelive"
      }
   ],
   "runningProcesses":[
      {
         "name":"A running process",
         "description":"A sample process",
         "averageCpuUsage":10,
         "averageMemoryUsage":512,
         "currentCpuUsage":11,
         "currentMemoryUsage":512
      }
   ],
   "monitors":[
      {
         "name":"Internal Graphics",
         "positionX":0,
         "positionY":0,
         "resolutionX":1920,
         "resolutionY":1080
      }
   ],
   "drives":[
      {
         "name":"Internal Storage",
         "totalBytes":4273995776,
         "availableBytes":4190109696,
         "format":"",
         "type":"Fixed Internal"
      }
   ],
   "graphicsControllers":[
      {
         "name":"Internal Graphics",
         "resolutionX":1920,
         "resolutionY":1080
      }
   ]
}
{% endhighlight %}

## Player Networking

### Field Definitions

| NAME             | DESCRIPTION                                                                                |
|------------------|--------------------------------------------------------------------------------------------|
| dhcp             | A boolean value indicating whether or not a player should use DHCP to obtain an IP address |
| ipv4Address      | The static IP address to use if DHCP is disabled                                           |
| subnetMask       | The subnet mask to use if DHCP is disabled                                                 |
| defaultGateway   | The default gateway to use if DHCP is disabled                                             |
| dns1             | The primary DNS address to use if DHCP is disabled                                         |
| dns2             | The secondary DNS address to use if DHCP is disabled                                       |
| broadcastAddress | The player’s broadcast address                                                             |
| proxyServer      | The IP address of the proxy to use                                                         |
| type             | The type of network, "Ethernet" or "Wifi".                                                 |
| wifiNetworkName  | The wifi network name if wifi is enabled                                                   |
| wifiPassPhrase   | The wifi network pass phrase if wifi is enabled                                            |
| wifiSecurityType | The wifi security type if wifi is enabled. Possible values are: open wep wpa_psk wpa2_psk  |

### Example

{% highlight javascript %}
{
   "id":12345,
   "dhcp":false,
   "ipv4Address":"192.168.0.20",
   "subnetMask":"255.255.255.0",
   "defaultGateway":"192.168.0.1",
   "dns1":"8.8.8.8",
   "dns2":"8.8.4.4",
   "broadcastAddress":"",
   "proxyServer":"",
   "type":"Wifi",
   "wifiNetworkName":"officenetwork",
   "wifiPassPhrase":"password",
   "wifiSecurityType":"wpa2_psk"
}
{% endhighlight %}

## Note

### Field Definitions

| NAME        | DESCRIPTION                                                                                                           |
|-------------|-----------------------------------------------------------------------------------------------------------------------|
| text        | The note text                                                                                                         |
| dateCreated | The date/time the note was created                                                                                    |
| user        | The email address of the user who created the note. If the note is created automatically, the author will be "System" |

### Example

{% highlight javascript %}
{
   "id":12345,
   "text":"This is a note",
   "dateCreated":"2016-07-20T12:29:02.339Z",
   "user":"user@signagelive.com"
}
{% endhighlight %}

## Schedule Item

### Field Definitions

| NAME       | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id         | The ID of the scheduled layout                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| name       | The name of the scheduled layout or playlist                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| name       | The name of the scheduled layout or playlist                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| type       | The type of schedule. Possible values are: layout playlist playlist                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| layout     | The ID of the layout (null if ‘type’ is playlist)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| playlist   | The ID of the playlist (null if ‘type’ is layout)                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| start      | The start date/time for the schedule                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| end        | The end date/time for the schedule                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| deployed   | A boolean value to show whether or not the schedule item has been fully downloaded by the player                                                                                                                                                                                                                                                                                                                                                                                                                |
| recurrence | An object defining the recurrence options of this schedule: startTime – The time of day that the schedule item will start playing endTime – The time of day that the schedule will stop playing. If this is before the start time, the schedule will run overnight. days – Recurrence days selections as an integer representation of binary flags where 1 = Sunday and 64 = Saturday validityStart – The date/time that the content will become valid validityEnd – The date/time that the content will expire |

### Example

{% highlight javascript %}
{
   "id":12345,
   "name":"Corporate Layout",
   "type":"Layout",
   "layout":6789,
   "playlist":null,
   "start":"2016-07-01T00:00:00.000Z",
   "end":"2016-07-31T00:00:00.000Z",
   "deployed":true,
   "recurrence":{
      "start":"2016-07-01T00:00:00.000Z",
      "end":"2016-07-25T23:59:59.000Z",
      "startTime":"09:00:00",
      "endTime":"21:00:00",
      "days":62
   }
}
{% endhighlight %}

## Scheduled Layout

### Field Definitions

| NAME                  | DESCRIPTION                                                                                                 |
|-----------------------|-------------------------------------------------------------------------------------------------------------|
| layout                | The ID of the parent layout                                                                                 |
| deployed              | A boolean value indicating whether or not the scheduled layout has been successfully deployed to the player |
| isActive              | A boolean value indicating whether or not the scheduled layout is active on the player                      |
| isOverridden          | A boolean value indicating whether or not the scheduled layout has been overridden by another schedule      |
| isFullscreen          | A boolean value indicating whether or not the scheduled layout is a fullscreen playlist                     |
| start                 | The start date/time of the schedule layout                                                                  |
| end                   | The end date/time of the schedule layout                                                                    |
| dateConfigured        | The date/time that the schedule layout was configured                                                       |
| dateDeployed          | The date/time that the schedule layout was deployed to the player                                           |
| recurrence            | The ID of the recurrence object, or null if there is none                                                   |
| scheduledMediaWindows | A list of scheduled media windows for this scheduled layout                                                 |

### Example

{% highlight javascript %}
{
   "id":12345,
   "name":"Corporate Layout",
   "type":"Layout",
   "layout":6789,
   "playlist":null,
   "start":"2016-07-01T00:00:00.000Z",
   "end":"2016-07-31T00:00:00.000Z",
   "deployed":true,
   "recurrence":{
      "start":"2016-07-01T00:00:00.000Z",
      "end":"2016-07-25T23:59:59.000Z",
      "startTime":"09:00:00",
      "endTime":"21:00:00",
      "days":62
   }
}
{% endhighlight %}

## Scheduled Media Window

### Field Definitions

| NAME               | DESCRIPTION                                                                  |
|--------------------|------------------------------------------------------------------------------|
| mediaWindow        | The ID of the parent media window within the parent layout                   |
| defaultPlaylist    | The ID of the default playlist, or null if none configured                   |
| properties         | A string value containing any properties to be used within the media window. |
| scheduledPlaylists | A list of any scheduled playlists within this scheduled media window         |

### Example

{% highlight javascript %}
{
  "id": 1468,
  "mediaWindow": 4567,
  "defaultPlaylist": 9876,
  "properties": "",
  "scheduledPlaylists": [
	{
  	"id": 1579,
  	"playlist": 7890,
  	"start": "2016-05-01T00:00:00.000Z",
  	"end": "2016-09-01T00:00:00.000Z"
	}
  ]
}
{% endhighlight %}

## Scheduled Playlist

### Field Definitions

| NAME     | DESCRIPTION                                        |
|----------|----------------------------------------------------|
| playlist | The ID of the parent playlist that is to be played |
| start    | The date/time to start playing                     |
| end      | The date/time to stop playing                      |

### Example

{% highlight javascript %}
{
   "id": 1579,
   "playlist": 7890,
   "start": "2016-05-01T00:00:00.000Z",
   "end": "2016-09-01T00:00:00.000Z"
}
{% endhighlight %}

## Interrupt

### Field Definitions

| NAME    | DESCRIPTION                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| name    | The name of the interrupt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| trigger | The trigger that will start the interrupt. type – The type of interrupt. Possible values are: KeyboardEvent MouseEvent configurationParameters – An array of name/value pairs defining configuration parameters for the trigger. A KeyboardEvent will have an ActionKey and a CancelKey. A MouseEvent will have a ClickRegion, which will be a pipe separated list of regions for a mouse click. An example of an ActionKey or CancelKey value is "A","B", "D0", or "NumPad0" An example of a ClickRegion for a mouse click is "0,0,1920,1080" or "0,0,200,200\|1080,0,200,200". Each set of 4 numbers corresponds to "X,Y, Width, Height"   |
| action  | instruction – A string containing either the scheduledLayout ID to play, or the location of an external executable on the client player. instructionType – The type of interrupt. Possible values are: ScheduledLayout ExternalExecutable duration – The duration that the interrupt will play for. If set to 0, it will play until the content finishes, or until it is cancelled by the endAction mediaAsset – If the interrupt is a single media asset, this will be the ID of that media asset playlist – If the interrupt is a playlist, this will be the playlist ID layout – If the interrupt is a layout, this will be the layout ID |

### Example

{% highlight javascript %}
{
   "id":1234,
   "name":"Sample Interrupt",
   "triggers":{
      "type":"Keyboard Event",
      "start":{
         "name":"StartKey",
         "value":"A"
      },
      "cancel":{
         "name":"CancelKey",
         "value":"B"
      }
   },
   "action":{
      "instruction":"14215",
      "instructionType":"ScheduledLayout",
      "duration":10,
      "mediaAsset":null,
      "playlist":null,
      "layout":2414,

   }
}
{% endhighlight %}

## Licence Summary

### Field Definitions

| NAME               | DESCRIPTION                                                                                                                                                                                                                     |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| number             | The licence number of the primary licence. This will be the trial licence if it is a trial or the standard licence for other registered licences. For un-registered licences, the this is the only licence.                     |
| serialNumber       | The serial number of the player that this licence is registered to, or null for an unregistered licence.                                                                                                                        |
| siteName           | The site name of the player that this licence is registered to, or null for an unregistered licence.                                                                                                                            |
| player             | The ID of the player that this licence is registered to, or null for an unregistered licence.                                                                                                                                   |
| code               | The licence code of the primary licence                                                                                                                                                                                         |
| type               | The licence type of the primary licence. This will be one of: Trial Standard Renewal                                                                                                                                            |
| edition            | The edition of the licence. This will be one of: Display                                                                                                                                                                        |
| duration           | The duration of the licence. For a licence that is a converted trial and/or extended with renewal licences, this will be the total duration of all licences. The value is in months                                             |
| dateAllocated      | The date the licence was added to the network                                                                                                                                                                                   |
| dateRegistered     | The date the licence was first                                                                                                                                                                                                  |
| dateExpires        | The date the licence expires                                                                                                                                                                                                    |
| isActive           | A boolean value that indicates if the licence is active or not. If false, the licence can be reused on new hardware.                                                                                                            |
| trialLicence       | If the licence is a converted trial, this will be the ID of the trial licence                                                                                                                                                   |
| maxNumberOfOutputs | The maximum number of outputs (monitors) that the player can display output to                                                                                                                                                  |
| canRenew           | A boolean value that indicates whether or not the licence can be renewed e.g. there are appropriate renewals on the network. If the licence is a trial, this will indicate that the licence can be converted to a full licence. |

### Example

{% highlight javascript %}
{
   "id":12345,
   "number":5432,
   "serialNumber":"11122",
   "siteName":"A site description",
   "player":45678,
   "code":"AAA1-BBB2-CCC3-DDD4",
   "type":"Standard",
   "edition":"Display",
   "duration":12,
   "dateAllocated":"2016-07-02T14:17:00.000Z",
   "dateRegistered":"2016-07-02T14:20:00.000Z",
   "dateExpires":"2017-07-02T14:17:00.000Z",
   "isActive":true,
   "trialLicence":null,
   "maxNumberOfOutputs":2,
   "canRenew":false
}
{% endhighlight %}

## Licence

### Field Definitions

| NAME               | DESCRIPTION                                                                                                                                                                         |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| number             | The auto generated licence number. This is used for easy identification of the licence                                                                                              |
| code               | The licence code of the primary licence                                                                                                                                             |
| type               | The licence type of the primary licence. This will be one of: Trial Standard Renewal                                                                                                |
| edition            | The edition of the licence. This will be one of: Display Undecided                                                                                                                  |
| duration           | The duration of the licence. For a licence that is a converted trial and/or extended with renewal licences, this will be the total duration of all licences. The value is in months |
| dateAllocated      | The date the licence was added to the network                                                                                                                                       |
| dateRegistered     | The date the licence was first                                                                                                                                                      |
| dateExpires        | The date the licence expires                                                                                                                                                        |
| trialLicence       | If the licence is a converted trial, this will be the ID of the trial licence                                                                                                       |
| maxNumberOfOutputs | The maximum number of outputs (monitors) that the player can display output to                                                                                                      |
| isInTrash          | A boolean value that indicates whether or not the licence has been trashed                                                                                                          |

### Example

{% highlight javascript %}
{
   "id":12345,
   "number":5432,
   "code":"AAAA-BBBB-CCCC-DDDD",
   "type":"Standard",
   "edition":"Display",
   "duration":"12",
   "dateAllocated":"2016-07-02T14:17:00.000Z",
   "dateRegistered":"2016-07-02T14:20:00.000Z",
   "dateExpires":"2017-07-02T14:17:00.000Z",
   "isUsedRenewal":false,
   "trialLicence":null,
   "maxNumberOfOutputs":2,
   "isInTrash":false
}
{% endhighlight %}

## Licence Renewal Option

### Field Definitions

| NAME        | DESCRIPTION                                                                                       |
|-------------|---------------------------------------------------------------------------------------------------|
| id          | The Id of the record. This id is dynamically generated at the point that the options are returned |
| description | Description of the renewal type                                                                   |
| value       | The length of the renewal in months                                                               |

### Example

{% highlight javascript %}
{
   "id":12,
   "description":"1 Year Renewal",
   "value":12
}
{% endhighlight %}

## Licence Conversion Option

### Field Definitions

| NAME        | DESCRIPTION                                                                                       |
|-------------|---------------------------------------------------------------------------------------------------|
| id          | The Id of the record. This id is dynamically generated at the point that the options are returned |
| description | Description of the conversion option                                                              |
| value       | The length of the conversion in months                                                            |

### Example

{% highlight javascript %}
{
   "id":1,
   "description":"1 Year Licence",
   "value":12
}
{% endhighlight %}

## Screen Control Settings

### Field Definitions

| NAME               | DESCRIPTION                                                                                |
|--------------------|--------------------------------------------------------------------------------------------|
| portName           | The name for the serial port                                                               |
| baudRate           | Port Baud rate. Any standard serial port baud rate is supported                            |
| dataBits           | The amount of data bits as an integer                                                      |
| parity             | Serial port parity setting. Possible values are: even mark none odd space                  |
| stopBits           | The number of stop bits. This can be 1, 1.5 or 2.                                          |
| onCommand          | The string representation of the on command.                                               |
| offCommand         | The string representation of the off command.                                              |
| syncCommand        | The string representation of the sync command.                                             |
| sendCarriageReturn | A boolean value indicating whether or not a carriage return will be sent with the command. |
| type               | The type of screen control to use. The value can be one of: RS232 MinicomDSVision3000      |

### Example

{% highlight javascript %}
{
   "id":123,
   "portName":"COM3",   
   "rs232Settings":{
      "baudRate":9600,
      "dataBits":8,
      "parity":"none",
      "stopBits":1,
      "onCommand":"on",
      "offCommand":"off",
      "syncCommand":"",
      "sendCarriageReturn":false,

   },
   "type":"RS232"
}
{% endhighlight %}

## Screen Control Schedule

### Field Definitions

| NAME         | DESCRIPTION                                                                                                                                                                 |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| screenOnTime | A string representation of the time of day that the screen will turn on                                                                                                     |
| duration     | The time, in minutes, that the screen will be on                                                                                                                            |
| days         | days selections as an integer representation of binary flags where 1 = Sunday and 64 = Saturday. In this example, 62 means that the schedule will be active Monday – Friday |

### Example

{% highlight javascript %}
{
   "id":1234,
   "screenOnTime":"09:00:00",
   "duration":540,
   "days":62
}
{% endhighlight %}

## Global Screen Control

An object for setting screen control on all players on the network

### Field Definitions

| screenControlSettings  | A ScreenControlSettings object to apply to all players. Null to use the system default screen control (most players will use this)                                          |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| screenControlSchedules | An array of ScreenControlSchedule objects to apply to all players                                                                                                           |
| days                   | days selections as an integer representation of binary flags where 1 = Sunday and 64 = Saturday. In this example, 62 means that the schedule will be active Monday – Friday |

### Example

{% highlight javascript %}
{
   "screenControlSettings":null,
   "screenControlSchedules":[
      {
         "id":null,
         "screenOnTime":"09:00:00",
         "duration":540,
         "days":62
      }
   ]
}
{% endhighlight %}

## Network User

A Network User is a represents a user account in Signagelive.

### Field Definitions

| NAME         | DESCRIPTION                                                                                                           |
|--------------|-----------------------------------------------------------------------------------------------------------------------|
| emailAddress | The user’s email address. This is also their username.                                                                |
| firstName    | First Name                                                                                                            |
| lastName     | Last Name                                                                                                             |
| canAddMedia  | For Local Users, can the add new media to Signagelive?                                                                |
| password     | For new users, the initial password                                                                                   |
| role         | The access level of the user. Values are: superadministrator administrator user messagemanageruser readonly localuser |
| enabled      | Boolean indicating if the user account is enabled or not                                                              |

### Example

{% highlight javascript %}
{
   "id":2675486,
   "emailAddress":"user@example.com",
   "firstName":"Joe",
   "lastName":"Bloggs",
   "canAddMedia":true,
   "password":"",
   "role":"administrator",
   "enabled":true
}
{% endhighlight %}

## Player Connection

### Field Definitions

| NAME | DESCRIPTION                                                                                 |
|------|---------------------------------------------------------------------------------------------|
| type | The type of connection. Allowed values are: Bootup ContentCheck HealthCheck ContentDeployed |
| time | The date/time of the connection                                                             |

### Example

{% highlight javascript %}
{
   "id":456,
   "type":"healthCheck",
   "time":"2016-07-22T15:54:54.649Z"
}
{% endhighlight %}

## Player List

A fixed list of players

### Field Definitions

| NAME    | DESCRIPTION                        |
|---------|------------------------------------|
| name    | The name of the player list        |
| players | The ids of the players in the list |

### Example

{% highlight javascript %}
{
   "id":456,
   "name":"Stadium Players",
   "players":[
      2414,
      1424
   ]
}
{% endhighlight %}

## Saved Search

A saved search for players

### Field Definitions

| NAME         | DESCRIPTION                                       |
|--------------|---------------------------------------------------|
| name         | The name of the saved search                      |
| searchString | A string which will be used to search for players |

### Example

{% highlight javascript %}
{
   "id":456,
   "name":"Stadium Players",
   "searchString":"stadium"
}
{% endhighlight %}

## Publication

Content to be published.

### Field Definitions

| NAME           | DESCRIPTION |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content        | An object containing the content to publish: defaultPlaylist – The id of the default playlist to publish to the players, or null if not publishing a default playlist. layouts – An array of scheduledLayout objects to publish interrupts – An array of interrupt objects to publish |
| players        | An array of integers containing the player ids to publish to. |
| ignoreWarnings | A boolean value indicating whether or not warnings should be ignored when publishing. |

### Example

{% highlight javascript %}
{
   "content":{
      "defaultPlaylist":null,
      "layouts":[

      ],
      "interrupts":[

      ]
   },
   "players":[
      1443,
      1444,
      1445
   ],
   "ignoreWarnings":true
}
{% endhighlight %}

## Publish Issue

Represents a problem that the user should know about when publishing content.

### Field Definitions

| NAME       | DESCRIPTION                                                                                                     |
|------------|-----------------------------------------------------------------------------------------------------------------|
| issueLevel | The level of the ‘issue’ Possible values are: Warning Error Info An Error means the content cannot be published |
| issueType  | The type of issue. Possible values are: Codec FileType MediaType Size PublishType General None                  |
| text       | A message to describe the issue to the user.                                                                    |

### Example

{% highlight javascript %}
{
  "issueLevel": "Warning",
  "issueType": "Codec",
  "text": "The video codec for myVideo.mp4 is not supported by this player"
}
{% endhighlight %}

## Publish Result

The result of checking the publication against a player

### Field Definitions

| NAME          | DESCRIPTION                                                                                                                                                                          |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| player        | The id of the player                                                                                                                                                                 |
| type          | The type of result. This can have one of two values: Check – The publication has been checked against the player but not published Publish – The content was published to the player |
| result        | The result of the check or publication. This can have one of two values: Success Failure                                                                                             |
| publishIssues | An array of issues found when checking the publication against this player. An error means that the content cannot be published.                                                     |

### Example

{% highlight javascript %}
{
   "player":1234,
   "type":"Publish",
   "result":"Success",
   "publishIssues":[
      "...Array of PublishIssues..."
   ]
}
{% endhighlight %}

## Player Screenshot

An object containing the URL to a player screenshot and details about the screenshot such as the time it was taken.

### Field Definitions

| NAME               | DESCRIPTION                                                 |
|--------------------|-------------------------------------------------------------|
| id                 | ID of the screenshot                                        |
| player             | ID of player the screenshot is for                          |
| url                | URL pointing to the original, high-quality screenshot image |
| smallThumbnailUrl  | URL pointing to a small thumbnail image of the screenshot   |
| mediumThumbnailUrl | URL pointing to a medium thumbnail image of the screenshot  |
| dateTaken          | The date and time that the screenshot was taken             |

### Example

{% highlight javascript %}
{
   "Id":11182727,
   "Player":12345,
   "url":"https://signagelive.com/playerscreenshots/11182727",
   "smallThumbnailUrl":"https://signagelive.com/playerscreenshots/11182727/small",
   "mediumThumbnailUrl":"https://signagelive.com/playerscreenshots/11182727/medium",
   "dateTaken":"2016-07-22 T 15:54:54.649 Z"
}
{% endhighlight %}

## Player Screenshot Settings

An object containing the URL to a player screenshot and details about the screenshot such as the time it was taken.

### Field Definitions

| NAME                             | DESCRIPTION                                                                     |
|----------------------------------|---------------------------------------------------------------------------------|
| id                               | ID of the screenshot settings record                                            |
| player                           | ID of the player the screenshot settings record is associated to                |
| enabled                          | True if remote screenshots are enabled for the player and false if they are not |
| frequency                        | The frequency that the player should upload screenshots in minutes              |
| takeScreenshotAtNextContentCheck | If true the player will take a screenshot when it next performs a content check |

### Example

{% highlight javascript %}
{
   "id":13456,
   "enabled":true,
   "frequency":5,
   "takeScreenshotAtNextContentCheck":false
}
{% endhighlight %}

## Player Screenshot Request

### Field Definitions

| NAME   | DESCRIPTION                        |
|--------|------------------------------------|
| id     | ID of the request                  |
| player | The player that the request is for |

### Example

{% highlight javascript %}
{
   "id":13456,
   "player":19876
}
{% endhighlight %}

## Real Time Event

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| id                     | ID of the request                               |
| name                   | The name of the RTE                             |
| assetStartConfig       | A stringified JSON object for the configuration |
| assetCompleteConfig    | A stringified JSON object for the configuration |
| assetDownloadConfig    | A stringified JSON object for the configuration |
| assetRemoveConfig      | A stringified JSON object for the configuration                                                  |
| userPreferencesConfig  | A stringified JSON object with the defined values for user preferences used in the above configs |

### Example

{% highlight javascript %}
{
   "id":13456,
   "player":19876
}
{% endhighlight %}

### Example JSON Config

{% highlight javascript %}
{
   "type":"http",
   "config":{
      "url":"",
      "type":"POST",
      "data":{
         "player_id":"$player_serial_number$",
         "data":[
            {
               "id":0,
               "start_time":"$pma_start$",
               "end_time":"$pma_end$",
               "message_id":
               "$pma_media_asset_id$"
            }
         ]
      },
      "headers":[
         {
            "name":"content-type",
            "value":"application/json"
         },
         {
            "name":"tenant_id",
            "value":"$tenantid$"
         }
      ],
      "commands":""
   },
   "slplaceholderConfig":[
      {
         "name":"$host$",
         "value":"",
         "dataType":"string"
      },
      {
         "name":"$tenantid$",
         "value":"",
         "dataType":"string"
      },
      {
         "name":"$player_serial_number$",
         "field":"clientDetails.signageliveSerialNumber",
         "dataType":"string"
      },
      {
         "name":"$pma_start$",
         "field":"start",
         "dataType":"datetime",
         "format":"epochSeconds"
      },
      {
         "name":"$pma_end$",
         "field":"end",
         "dataType":"datetime",
         "format":"epochSeconds"
      },
      {
         "name":"$pma_media_asset_id$",
         "field":"pma.mediaAsset.externalId",
         "dataType":"id",
         "format":"int"
      }
   ]
}
{% endhighlight %}

### Example User Preferences Config

{% highlight javascript %}
[
   {
      "key":"$host$",
      "name":"Host",
      "value":"",
      "dataType":"string"
   },
   {
      "key":"$tenantid$",
      "name":"Tenant ID",
      "value":"1244",
      "dataType":"string"
   }
]
{% endhighlight %}

## New Media Asset Request

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| type                   | The type of new media asset request (fileupload, nonfileasset, remotefileupload)|
| mediaAsset             | A Media Asset DTO, for file uploads the name of the file is the only required field, for non file assets, the whole DTO should be complete |
| remoteRequest          | A Remote Sync Media Asset Request |

### Example

{% highlight javascript %}
{
   “type”: {
     “type”: “fileupload”, “nonfileasset” (web site, RSS, MRSS, IPTV), “remotefileupload”
   },
   “mediaAsset”: {
     Media Asset DTO as defined here
   },
   remoteRequest: {
     Remote Sync Request DTO as defined here
   }
}
{% endhighlight %}

#### File Upload

{% highlight javascript %}
{
   “type”: {
     “type”: “fileupload”
   },
   “mediaAsset”: {
     “name”: “filename and extension”
   }
}
{% endhighlight %}

#### Non File Upload

{% highlight javascript %}
{
   “type”: {
     “type”: “nonfileasset”
   },
   “mediaAsset”: {
     “name”: “”,
     “url”: “”,
     “type”: “rss” / “web” / “stream”
   }
}
{% endhighlight %}

#### Remote File Upload

{% highlight javascript %}
{
   “type”: {
     “type”: “remotefileupload”
   },
   “remoteRequest”: RemoteSyncRequestDTO
}
{% endhighlight %}

## New Media Asset Upload Response

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| type                   | The type of new media asset request (fileupload, nonfileasset, remotefileupload)|
| success                | True/False     |
| errorCode              | Any error codes which are resulting from the request |
| errorMessage           | If any errors occurred, a message detailing them |
| uploadUrl              | For file uploads, this is the URL to send the actual file to |
| uploadContentType      | The content type which should be set on the upload request |
| mediaAsset             | The created media asset DTO  |

### Example

{% highlight javascript %}
[
   {
      “type”: {
        “type”: “fileupload”
      },
      “success”: true/false,
      “errorCode”: “”,
      “errorMessage”: “”,
      “uploadUrl”: “”,
      “uploadContentType”: “”,
      “mediaAsset”: MediaAssetDTO of the created asset
   }
]
{% endhighlight %}

## Remote Sync Media Asset Request

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| request                   | The url of the media asset and any required headers for authentication                             |
| realTimeEvents       | Any real time events, that should be added to the Media Asset when it is created |
| webHook    | The webHook which status updates should be sent to and any headers which should be included |

### Example

{% highlight javascript %}
[
   {
      "request":{   
         "url":"{{assetUrl}}",
         "headers":[
            {
               "key":"",
               "value""
            }
         ]
      },
      "realTimeEvents":{
         "global":[
            {{realtimeeventId}}
         ],
         "custom":[ ]
      },
      "webhook": {
         "url":"{{assetUrl}}",
         "headers":[
            {
               "key":"",
               "value""
            }
         ]
      }
   }
]
{% endhighlight %}

## Remote Sync Media Asset Request

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| url                   | The url of the media asset                             |
| remoteSyncRequestId       | The ID of the Remote Sync Request so this can be linked to the web hook status messages |
| metadata    | A list of any key value pair data |

### Example

{% highlight javascript %}
[
   {
      "url":"",
      "remoteSyncRequestId":1,
      "meta_data": [
         {
            "key":"",
            "value":""
         }
      ]
   }
]
{% endhighlight %}

## Remote Sync Request Status

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| remoteSyncRequestId       | The ID of the Remote Sync Request  |
| mediaAssetId    | If successful, the ID of the created Media Asset |
| success    | A boolean showing the success of the request |
| errors    | An array of any errors in the case that success = false |
| meta_data    | An array of any additional meta_data which was included in the request |

### Example

{% highlight javascript %}
[
   {
      "remoteSyncRequestId":1,
      "mediaAssetId": 1,
      "success":true,
      "errors": [
         {
            "code":"SLR0001",
            "description":""
         }
      ],
      "meta_data": [
         {
            "key":"",
            "value":""
         }
      ]
   }
]
{% endhighlight %}

## Playlist Media Asset Add Request

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| networkId       | The ID of the Network the Playlist is on  |
| pma    | The Playlist Media Asset object to be added |
| playlistId    | The ID of the Playlist to add the asset to |
| webHook    | The webHook which status updates should be sent to and any headers which should be included |

### Example

{% highlight javascript %}
[
   {
      "networkId":1,
      "pma": {},
      "playlistId":1,
      "webhook": {
         "url":"{{assetUrl}}",
         "headers":[
            {
               "key":"",
               "value""
            }
         ]
      }
   }
]
{% endhighlight %}

## Playlist Media Asset Add Request Status

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| playlistId       | The ID of the Remote Sync Request  |
| playlistMediaAssetId    | If successful, the ID of the created Media Asset |
| success    | A boolean showing the success of the request |
| errors    | An array of any errors in the case that success = false |

### Example

{% highlight javascript %}
[
   {
      "playlistId":1,
      "playlistMediaAssetId": 1,
      "success":true,
      "errors": [
         {
            "code":"SLR0001",
            "description":""
         }
      ]
   }
]
{% endhighlight %}

## Publish Configuration

### Field Definitions

| NAME                   | DESCRIPTION                                     |
|------------------------|-------------------------------------------------|
| start       | The start date and time the schedule will start  |
| end       |  The end date and time the schedule will finish, set to 9999-12-31T00:00 for it to run until further notice |
| publishType       |  Default or Schedule or Interrupt |
| contentType       |  mediaAsset or Playlist or Layout |
| playlist       |  The Playlist object being published |
| layout       |  The Layout object being published |
| scheduledLayout       |  The configured scheduled layout for the layout being published, including the scheduled playlists in zones |
| mediaAsset       | The Media Asset being published  |
| publishResults       | A list of publish result objects which is the list of players being published to  |
| validity       | The validity object if any is to be used  |
| hasValidity       |  A boolean to say whether validity is being used |
| startTrigger       |  The Interrupt Signal object to trigger the interrupt, if serial is not being used |
| endTrigger       | The interrupt Signal object to end the interrupt, if serial is not being used  |
| interruptDuration       | The duration the interrupt will play for if set, in seconds  |
| interruptPlayToLength       |  Whether to play the interrupt to length of the content or the defined duration |
| interruptResumeOnNext       |  When next interrupting start at the next asset based on the previous interrupt playback |
| serialDevice       |  The serial device to use to trigger the interrupt |
| serialStartCommand       | The serial command to trigger the interrupt  |
| serialEndComand       | The serial command to end the interrupt  |

### Example

{% highlight javascript %}
{
   "start":"2019-02-18T14:22:00",
   "end":"9999-12-31T00:00:00",
   "publishType":"interrupt",
   "contentType":"playlist",
   "validity":null,
   "hasValidity":false,
   "interruptPlayToLength":true,
   "interruptDuration":10,
   "interruptResumeOnNext":false,
   "interruptPlayType":"playToLength",
   "playlist":{
      "id":"",
      "name":"Triggered Playlist",
      "dateCreated":"2018-03-29T13:55:16.000Z",
      "lastModified":"2019-02-14T15:42:40.000Z",
      "size":0,
      "includeInProofOfPlay":false,
      "playlistTypeString":"Main",
      "proofOfPlay":null,
      "thumbnailUrl":"",
      "autoGenerated":false,
      "isInTrash":false,
      "startOnHour":false,
      "mediaAssets":[
         
      ]
   },
   "layout":null,
   "scheduledLayout":null,
   "mediaAsset":null,
   "publishResults":[
      {
         "id":"29643",
         "type":null,
         "result":null,
         "publishConfig":null,
         "player":"29643",
         "publishIssues":[

         ]
      }
   ],
   "startTrigger":{
      "id":"67",
      "displayName":"",
      "signalValue":"",
      "type":"3"
   },
   "endTrigger":null
}
{% endhighlight %}


# Operations

## Network

### GET

| DESCRIPTION          | Get a Network by ID    |
|----------------------|------------------------|
| HTTP METHOD          | GET                    |
| URL                  | /networks/{network_id} |
| REQUEST BODY         | None                   |
| NORMAL RESPONSE CODE | 200                    |
| RESPONSE BODY        | A Network object       |

### CREATE

| DESCRIPTION          | Create a Network (only a single licence can be added using this method)                               |
|----------------------|-------------------------------------------------|
| HTTP METHOD          | POST                                            |
| URL                  | /networks/                                      |
| REQUEST BODY         | Create Network Request Object                   |
| NORMAL RESPONSE CODE | 200                                             |
| RESPONSE BODY        | A Network object with an API Authorization Code |

## Status

### GET

| DESCRIPTION          | Get the Network Status for a Network |
|----------------------|--------------------------------------|
| HTTP METHOD          | GET                                  |
| URL                  | /networks/{network_id}/NetworkStatus |
| REQUEST BODY         | None                                 |
| NORMAL RESPONSE CODE | 200                                  |
| RESPONSE BODY        | A Network Status Object              |

## Network KPI Setting

### GET

| DESCRIPTION          | Get Network KPI Settings for a Network    |
|----------------------|-------------------------------------------|
| HTTP METHOD          | GET                                       |
| URL                  | /networks/{network_id}/NetworkKPISettings |
| REQUEST BODY         | None                                      |
| NORMAL RESPONSE CODE | 200                                       |
| RESPONSE BODY        | A Network KPI Settings Object             |

### Update

| DESCRIPTION          | Update Network KPI Settings for a Network      |
|----------------------|------------------------------------------------|
| HTTP METHOD          | PUT                                            |
| URL                  | /networks/{network_id}/NetworkKPISettings/{id} |
| REQUEST BODY         | Network KPI Settings object with updates       |
| NORMAL RESPONSE CODE | 200                                            |
| RESPONSE BODY        | Updated Network KPI Settings Object            |

## Player

### Get a Player

| DESCRIPTION          | Gets a player object                |
|----------------------|-------------------------------------|
| HTTP METHOD          | GET                                 |
| URL                  | /players/{id}                       |
| REQUEST BODY         | None                                |
| NORMAL RESPONSE CODE | 200                                 |
| RESPONSE BODY        | Player object                       |
| RESPONSE BODY        | Updated Network KPI Settings Object |

### Get List

| DESCRIPTION          | Returns a collection of player objects, that can be optionally filtered                                                                                    |           |                     |                                                                                                    |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------------------|----------------------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                                                        |           |                     |                                                                                                    |
| URL                  | /players                                                                                                                                                   |           |                     |                                                                                                    |
| OPTIONAL PARAMETERS  |                                                                                                                                                            |           |                     |                                                                                                    |
| NAME                 | DESCRIPTION                                                                                                                                                | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                                                                                   |
| search               | Term to be used to compare against the player serial number, site fields and tags, if omitted then all assets that are not trashed or deleted are returned | string    | Empty String        |                                                                                                    |
| addedFrom            | Returns only players commissioned after this date                                                                                                          | Date time |                     |                                                                                                    |
| addedTo              | Returns only players commissioned before this date                                                                                                         | Date time |                     |                                                                                                    |
| folderid             | Folder ID to return the players for. This implies that it is possible to search within a folder                                                            | int       |                     | If a folder ID is specified that is not on the user’s network then a Bad Response should be thrown |
| syncGroupId          | Sync Group Id to return the players for.                                                                                                                   | int       |                     |                                                                                                    |
| intrash              | Boolean indicating if to return players in the trash. If this is true ONLY players in the trash will be returned                                           | Boolean   | false               | true false                                                                                         |
| start                | Starting position in the array of players, if omitted the default is 0                                                                                     | int       | 0                   |                                                                                                    |
| limit                | Number of players to return                                                                                                                                | int       | 50                  |                                                                                                    |
| order                | Specifies the order to return players                                                                                                                      | string    | serialno            | serialno dateadded                                                                                 |
| REQUEST BODY         | None                                                                                                                                                       |           |                     |                                                                                                    |
| NORMAL RESPONSE CODE | 200                                                                                                                                                        |           |                     |                                                                                                    |
| RESPONSE BODY        | Array of player objects                                                                                                                                    |           |                     |                                                                                                    |

### Update a Player

| DESCRIPTION     | Allows the editable fields of a player to be updated |
|-----------------|------------------------------------------------------|
| HTTP METHOD     | PUT                                                  |
| URL             | /players/{id}                                        |
| REQUEST BODY    | Player object with updates                           |
| NORMAL RESPONSE | 200                                                  |
| RESPONSE BODY   | Player object                                        |

### Delete a Player

| DESCRIPTION          | Puts a player in the trash |
|----------------------|----------------------------|
| HTTP METHOD          | DELETE                     |
| URL                  | /players/{id}              |
| REQUEST BODY         | None                       |
| NORMAL RESPONSE CODE | 200                        |
| RESPONSE BODY        | None                       |

### System Information

#### Get

| DESCRIPTION          | Gets the systeminformation for a player |
|----------------------|-----------------------------------------|
| HTTP METHOD          | GET                                     |
| URL                  | /players/{id}/systeminformation         |
| REQUEST BODY         | None                                    |
| NORMAL RESPONSE CODE | 200                                     |
| RESPONSE BODY        | PlayerSystemInformation object          |

### Networking

#### Get

| DESCRIPTION          | Gets a player networking object for the player |
|----------------------|------------------------------------------------|
| HTTP METHOD          | GET                                            |
| URL                  | /players/{id}/networking                       |
| REQUEST BODY         | None                                           |
| NORMAL RESPONSE CODE | 200                                            |
| RESPONSE BODY        | The PlayerNetworking object                    |

#### Create

| DESCRIPTION          | Creates a player networking object |
|----------------------|------------------------------------|
| HTTP METHOD          | POST                               |
| URL                  | /players/{id}/networking           |
| REQUEST BODY         | A new PlayerNetworking object      |
| NORMAL RESPONSE CODE | 201                                |
| RESPONSE BODY        | The new PlayerNetworking object    |

#### Update

| DESCRIPTION          | Edits a player networking object     |
|----------------------|--------------------------------------|
| HTTP METHOD          | PUT                                  |
| URL                  | /players/{id}/networking             |
| REQUEST BODY         | A modified PlayerNetworking object   |
| NORMAL RESPONSE CODE | 200                                  |
| RESPONSE BODY        | The modified PlayerNetworking object |

#### Delete

| DESCRIPTION          | Removes the player networking object from a player |
|----------------------|----------------------------------------------------|
| HTTP METHOD          | DELETE                                             |
| URL                  | /players/{id}/networking                           |
| REQUEST BODY         | None                                               |
| NORMAL RESPONSE CODE | 200                                                |
| RESPONSE BODY        | None                                               |

### Notes

#### Get

| DESCRIPTION          | Gets all support notes for a player                                  |           |                     |                  |
|----------------------|----------------------------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | GET                                                                  |           |                     |                  |
| URL                  | /players/{id}/notes                                                  |           |                     |                  |
| OPTIONAL PARAMETERS  |                                                                      |           |                     |                  |
| NAME                 | DESCRIPTION                                                          | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| addedFrom            | Returns only notes added after this date                             | Date time |                     |                  |
| addedTo              | Returns only notes added before this date                            | Date time |                     |                  |
| start                | Starting position in the array of notes, if omitted the default is 0 | int       | 0                   |                  |
| limit                | Number of notes to return                                            | int       | 50                  |                  |
| NORMAL RESPONSE CODE | A list of note objects                                               |           |                     |                  |
| RESPONSE BODY        | 200                                                                  |           |                     |                  |

#### Create

| DESCRIPTION          | Creates a new note  |
|----------------------|---------------------|
| HTTP METHOD          | POST                |
| URL                  | /players/{id}/notes |
| REQUEST BODY         | A new note object   |
| NORMAL RESPONSE CODE | 201                 |
| RESPONSE BODY        | The created Note    |

#### Update

| DESCRIPTION          | Edits the specified note     |
|----------------------|------------------------------|
| HTTP METHOD          | PUT                          |
| URL                  | /players/{id}/notes/{noteid} |
| REQUEST BODY         | A modified note object       |
| NORMAL RESPONSE CODE | 200                          |
| RESPONSE BODY        | The updated note object      |

#### Delete

| DESCRIPTION          | Deletes the specified note   |
|----------------------|------------------------------|
| HTTP METHOD          | DELETE                       |
| URL                  | /players/{id}/notes/{noteid} |
| REQUEST BODY         | None                         |
| NORMAL RESPONSE CODE | 200                          |
| RESPONSE BODY        | None                         |

### Content

#### Schedules

##### Get

| DESCRIPTION          | Gets all scheduled content items for player                                   |           |                              |                                                                                     |
|----------------------|-------------------------------------------------------------------------------|-----------|------------------------------|-------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                           |           |                              |                                                                                     |
| URL                  | /players/{id}/content/schedules                                               |           |                              |                                                                                     |
| OPTIONAL PARAMETERS  |                                                                               |           |                              |                                                                                     |
| NAME                 | DESCRIPTION                                                                   | DATA TYPE | RESPONSE IF OMITTED          | PERMITTED VALUES                                                                    |
| rangeStart           | The start date of the range to search for schedule items.                     | Date time | 00:00:00 on the current date | This will return schedules active at any point after this date.                     |
| rangeEnd             | The end date of the range to search for schedule items.                       | Date time |                              | This will return schedules active at any point between the rangeStart and this date |
| start                | Starting position in the array of schedule items, if omitted the default is 0 | int       | 0                            |                                                                                     |
| limit                | Number of schedule items to return                                            | int       | 50                           |                                                                                     |
| REQUEST BODY         | None                                                                          |           |                              |                                                                                     |
| NORMAL RESPONSE CODE | 200                                                                           |           |                              |                                                                                     |
| RESPONSE BODY        | A list of ScheduledItem objects                                               |           |                              |                                                                                     |

##### Delete

| DESCRIPTION          | Deletes the specified scheduled item             |
|----------------------|--------------------------------------------------|
| HTTP METHOD          | DELETE                                           |
| URL                  | /players/{id}/content/schedules/{scheduleitemid} |
| REQUEST BODY         | None                                             |
| NORMAL RESPONSE CODE | 200                                              |
| RESPONSE BODY        | None                                             |

##### Delete All

| DESCRIPTION          | Deletes all scheduled items from the player |
|----------------------|---------------------------------------------|
| HTTP METHOD          | DELETE                                      |
| URL                  | /players/{id}/content/schedules             |
| REQUEST BODY         | None                                        |
| NORMAL RESPONSE CODE | 200                                         |
| RESPONSE BODY        | None                                        |

#### Interrupts

##### Get

| DESCRIPTION          | Gets all interrupts for player    |
|----------------------|-----------------------------------|
| HTTP METHOD          | GET                               |
| URL                  | /players/{id}/content/interrupts/ |
| REQUEST BODY         | None                              |
| NORMAL RESPONSE CODE | 200                               |
| RESPONSE BODY        | A list of interrupt objects       |

##### Update

| DESCRIPTION          | Edits an interrupt on the player                                                     |
|----------------------|--------------------------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                                                  |
| URL                  | /players/{id}/content/interrupts/{interruptid}                                       |
| REQUEST BODY         | The interrupt object with either the mediaAsset, playlist, or layout fields modified |
| NORMAL RESPONSE CODE | 200                                                                                  |
| RESPONSE BODY        | Interrupt object with updates                                                        |

##### Delete

| DESCRIPTION          | Removes the specified interrupt from the player |
|----------------------|-------------------------------------------------|
| HTTP METHOD          | DELETE                                          |
| URL                  | /players/{id}/content/interrupts/{interruptid}  |
| REQUEST BODY         | None                                            |
| NORMAL RESPONSE CODE | 200                                             |
| RESPONSE BODY        | None                                            |

#### Status

##### Get

| DESCRIPTION          | Gets the content status for a player |
|----------------------|--------------------------------------|
| HTTP METHOD          | GET                                  |
| URL                  | /players/{id}/content/status         |
| REQUEST BODY         | None                                 |
| NORMAL RESPONSE CODE | 200                                  |
| RESPONSE BODY        | Content status object                |

### Layouts

#### Get

| DESCRIPTION          | Gets a scheduled layout for a player by id        |
|----------------------|---------------------------------------------------|
| HTTP METHOD          | GET                                               |
| URL                  | /players/{id}/content/layouts/{scheduledlayoutid} |
| REQUEST BODY         | None                                              |
| NORMAL RESPONSE CODE | 200                                               |
| RESPONSE BODY        | A ScheduledLayout object                          |

### Media Assets

#### Get

| DESCRIPTION          | Gets a list of all media assets that have been downloaded to the player |
|----------------------|-------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                     |
| URL                  | /players/{id}/mediaassets                                               |
| REQUEST BODY         | None                                                                    |
| NORMAL RESPONSE CODE | 200                                                                     |
| RESPONSE BODY        | A list of media asset objects                                           |

### Licence

#### Summary

##### Get

| DESCRIPTION          | Gets a licence summary object for the specified player |
|----------------------|--------------------------------------------------------|
| HTTP METHOD          | GET                                                    |
| URL                  | /players/{id}/licence/summary                          |
| REQUEST BODY         | None                                                   |
| NORMAL RESPONSE CODE | 200                                                    |
| RESPONSE BODY        | Licence collection object                              |

### Connections

#### Get

| DESCRIPTION          | Gets the list of recorded player connections for the player |           |                     |                                |
|----------------------|-------------------------------------------------------------|-----------|---------------------|--------------------------------|
| HTTP METHOD          | GET                                                         |           |                     |                                |
| URL                  | /players/{id}/connections                                   |           |                     |                                |
| OPTIONAL PARAMETERS  |                                                             |           |                     |                                |
| NAME                 | DESCRIPTION                                                 | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES               |
| start                | The start position for paging                               |           | 0                   |                                |
| limit                | The amount of player connections to return                  |           | 100                 | 100 is the maximum value       |
| dateFrom             | The earliest date to return connections from                |           |                     | Amount is still limited to 100 |
| dateTo               | The latest date to return connections from                  |           |                     |                                |
| REQUEST BODY         | None                                                        |           |                     |                                |
| NORMAL RESPONSE CODE | 200                                                         |           |                     |                                |
| RESPONSE BODY        | Array of Player Connections                                 |           |                     |                                |

### Tags

#### Get

| DESCRIPTION          | Gets the tags for the specified player |
|----------------------|----------------------------------------|
| HTTP METHOD          | GET                                    |
| URL                  | /players/{id}/tags                     |
| REQUEST BODY         | None                                   |
| NORMAL RESPONSE CODE | 200                                    |
| RESPONSE BODY        | Array of Tags                          |

#### Get All

| DESCRIPTION          | Gets a list of all player tags in use on the network |
|----------------------|------------------------------------------------------|
| HTTP METHOD          | GET                                                  |
| URL                  | /players/tags                                        |
| REQUEST BODY         | None                                                 |
| NORMAL RESPONSE CODE | 200                                                  |
| RESPONSE BODY        | A list of strings                                    |

#### Create

| DESCRIPTION          | Adds the tag to the tag collection for the specified player |
|----------------------|-------------------------------------------------------------|
| HTTP METHOD          | POST                                                        |
| URL                  | /players/{id}/tags                                          |
| REQUEST BODY         | Tag object with no id                                       |
| NORMAL RESPONSE CODE | 201                                                         |
| RESPONSE BODY        | Tag object with id                                          |

#### Update

| DESCRIPTION          | Allows the user to edit the value of the tag |
|----------------------|----------------------------------------------|
| HTTP METHOD          | PUT                                          |
| URL                  | /players/{id}/tags/{id}                      |
| REQUEST BODY         | Tag object with modification to the value    |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | Tag with update                              |

#### Delete

| DESCRIPTION          | Allows the user to edit the value of the tag |
|----------------------|----------------------------------------------|
| HTTP METHOD          | DELETE                                       |
| URL                  | /players/{id}/tags/{id}                      |
| REQUEST BODY         | None                                         |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | None                                         |

### Screen Control

#### Settings

##### Get

| DESCRIPTION          | Gets the screen control settings for a player. Note that if nothing is returned, the player will use its own default screen control method. For PC players this means Windows power saving. |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                                                                                         |
| URL                  | /players/{id}/screencontrol/settings                                                                                                                                                        |
| REQUEST BODY         | None                                                                                                                                                                                        |
| NORMAL RESPONSE CODE | 201                                                                                                                                                                                         |
| RESPONSE BODY        | A screen control settings object                                                                                                                                                            |

##### Create

| DESCRIPTION          | Creates a new screen control settings object for the player |
|----------------------|-------------------------------------------------------------|
| HTTP METHOD          | POST                                                        |
| URL                  | /players/{id}/screencontrol/settings                        |
| REQUEST BODY         | A new ScreenControlSettings object with no ID               |
| NORMAL RESPONSE CODE | 201                                                         |
| RESPONSE BODY        | The ScreenControlSettings object now with an ID             |

##### Update

| DESCRIPTION          | Saves changes to the screen control settings object |
|----------------------|-----------------------------------------------------|
| HTTP METHOD          | PUT                                                 |
| URL                  | /players/{id}/screencontrol/settings                |
| REQUEST BODY         | The edited ScreenControlSettings object             |
| NORMAL RESPONSE CODE | 200                                                 |
| RESPONSE BODY        | The ScreenControlSettings object with the updates   |

##### Delete

| DESCRIPTION          | Removes screen control settings from a player |
|----------------------|-----------------------------------------------|
| HTTP METHOD          | DELETE                                        |
| URL                  | /players/{id}/screencontrol/settings          |
| REQUEST BODY         | None                                          |
| NORMAL RESPONSE CODE | None                                          |
| RESPONSE BODY        | None                                          |

#### Schedule

##### Get

| DESCRIPTION          | Gets the ScreenControlSchedules for this player |
|----------------------|-------------------------------------------------|
| HTTP METHOD          | GET                                             |
| URL                  | /players/{id}/screencontrol/schedules           |
| REQUEST BODY         | None                                            |
| NORMAL RESPONSE CODE | 200                                             |
| RESPONSE BODY        | An array of ScreenControlSchedule objects       |

##### Create

| DESCRIPTION          | Creates a new screen control schedule object for the player |
|----------------------|-------------------------------------------------------------|
| HTTP METHOD          | POST                                                        |
| URL                  | /players/{id}/screencontrol/schedules                       |
| REQUEST BODY         | new ScreenControlSchedule object with no ID                 |
| NORMAL RESPONSE CODE | 201                                                         |
| RESPONSE BODY        | All ScreenControlSchedules for the player                   |

##### Update

| DESCRIPTION          | Updates a screen control schedule object for the player |
|----------------------|---------------------------------------------------------|
| HTTP METHOD          | PUT                                                     |
| URL                  | /players/{id}/screencontrol/schedules/{id}              |
| REQUEST BODY         | The updated ScreenControlSchedule object                |
| NORMAL RESPONSE CODE | 200                                                     |
| RESPONSE BODY        | The updated ScreenControlSchedules object               |

##### Delete

| DESCRIPTION          | Removes a screen control schedule object from the player |
|----------------------|----------------------------------------------------------|
| HTTP METHOD          | DELETE                                                   |
| URL                  | /players/{id}/screencontrol/schedules/{scheduleid}       |
| REQUEST BODY         | None                                                     |
| NORMAL RESPONSE CODE | 200                                                      |
| RESPONSE BODY        | None                                                     |

##### Get the screen on/off status

| DESCRIPTION          | Gets the status of the screen for a player |
|----------------------|--------------------------------------------|
| HTTP METHOD          | GET                                        |
| URL                  | /player/{id}/screencontrol/status          |
| REQUEST BODY         | None                                       |
| NORMAL RESPONSE CODE | 200                                        |
| RESPONSE BODY        | PlayerScreenStatus object                  |

### Screenshots

####  Get

| DESCRIPTION          | Gets all available screenshots for a player                          |           |                     |                  |
|----------------------|----------------------------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | GET                                                                  |           |                     |                  |
| URL                  | /player/{id}/screenshots                                             |           |                     |                  |
| OPTIONAL PARAMETERS  |                                                                      |           |                     |                  |
| NAME                 | DESCRIPTION                                                          | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| takenFrom            | Returns only screenshots taken after this date                       | Date time |                     |                  |
| takenTo              | Returns only screenshots taken before this date                      | Date time |                     |                  |
| start                | Starting position in the array of notes, if omitted the default is 0 | int       | 0                   |                  |
| limit                | Number of notes to return                                            | int       | 50                  |                  |
| REQUEST BODY         | None                                                                 |           |                     |                  |
| NORMAL RESPONSE CODE | 200                                                                  |           |                     |                  |
| RESPONSE BODY        | An array of available screenshots                                    |           |                     |                  |

#### Request

##### Post

| DESCRIPTION          | Request that the player takes a screenshot at the next content check |
|----------------------|----------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                 |
| URL                  | /player/{id}/screenshots/request                                     |
| REQUEST BODY         | A PlayerScreenshotRequest containing the id of the player            |
| NORMAL RESPONSE CODE | 204                                                                  |
| RESPONSE BODY        | None                                                                 |

#### Settings

##### Get

| DESCRIPTION          | Get screenshot settings for a player  |
|----------------------|---------------------------------------|
| HTTP METHOD          | GET                                   |
| URL                  | /player/{id}/screenshots/settings     |
| REQUEST BODY         | None                                  |
| NORMAL RESPONSE CODE | 200                                   |
| RESPONSE BODY        | The player’s screenshot configuration |

##### Create

| DESCRIPTION          | Creates screenshot settings for a player         |
|----------------------|--------------------------------------------------|
| HTTP METHOD          | POST                                             |
| URL                  | /player/{id}/screenshots/settings                |
| REQUEST BODY         | The new screenshot settings with no ID           |
| NORMAL RESPONSE CODE | 200                                              |
| RESPONSE BODY        | The created screenshot settings with generatedID |

##### Update

| DESCRIPTION          | Updates the screenshot settings for a player |
|----------------------|----------------------------------------------|
| HTTP METHOD          | PUT                                          |
| URL                  | /player/{id}/screenshots/settings            |
| REQUEST BODY         | The edited screenshot settings               |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | The updated screenshot settings              |

### Upload Log Files

| DESCRIPTION          | Sets the player to upload log files                               |           |                     |                  |
|----------------------|-------------------------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | PUT                                                               |           |                     |                  |
| URL                  | /players/{id}/uploadlogfiles                                      |           |                     |                  |
| OPTIONAL PARAMETERS  |                                                                   |           |                     |                  |
| NAME                 | DESCRIPTION                                                       | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| cancelUpload         | If we want to cancel the upload of log files, we set this to true | boolean   | false               |                  |
| REQUEST BODY         | None                                                              |           |                     |                  |
| NORMAL RESPONSE CODE | 200                                                               |           |                     |                  |
| RESPONSE BODY        | None                                                              |           |                     |                  |

### Bandwidth

#### Get

| DESCRIPTION          | Gets bandwidth used this month by the player |
|----------------------|----------------------------------------------|
| HTTP METHOD          | GET                                          |
| URL                  | /players/{id}/bandwidth                      |
| REQUEST BODY         | None                                         |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | A BandwidthUsage object                      |

### Proof of Play

Note that calls to Proof of Play will return ‘Unauthorized’ if Proof of Play is not enabled on your network.

#### Get

| DESCRIPTION          | Gets the PoP reference or the specified player   |
|----------------------|--------------------------------------------------|
| HTTP METHOD          | GET                                              |
| URL                  | /players/{id}/proofofplay/references             |
| REQUEST BODY         | None                                             |
| NORMAL RESPONSE CODE | 200                                              |
| RESPONSE BODY        | Array of Proof of Play References for the player |

#### Create

| DESCRIPTION          | Adds the reference to the PoP reference collection for the specified player |
|----------------------|-----------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                        |
| URL                  | /players/{id}/proofofplay/references                                        |
| REQUEST BODY         | Proof of Play reference with no ID                                          |
| NORMAL RESPONSE CODE | 201                                                                         |
| RESPONSE BODY        | Proof of Play reference with the new ID                                     |

#### Update

| DESCRIPTION          | Allows the user to edit the value of the proof of play reference |
|----------------------|------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                              |
| URL                  | /players/{id}/proofofplay/references/{id}                        |
| REQUEST BODY         | Proof of Play reference with modification to the value           |
| NORMAL RESPONSE CODE | 200                                                              |
| RESPONSE BODY        | Proof of Play reference with update                              |

#### Delete

| DESCRIPTION          | Allows the user to delete the Proof of Play reference |
|----------------------|-------------------------------------------------------|
| HTTP METHOD          | DELETE                                                |
| URL                  | /players/{id}/proofofplay/references/{id}             |
| REQUEST BODY         | None                                                  |
| NORMAL RESPONSE CODE | 200                                                   |
| RESPONSE BODY        | None                                                  |

## Licences

### Get

| DESCRIPTION          | Gets a licence object |
|----------------------|-----------------------|
| HTTP METHOD          | GET                   |
| URL                  | /licences/{id}        |
| REQUEST BODY         | None                  |
| NORMAL RESPONSE CODE | 200                   |
| RESPONSE BODY        | Licence object        |

### Summary

#### Get All

| DESCRIPTION          | Gets a collection of licence summary objects for the specified network.                                                                                                 |           |                                                        |                                                                                                |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|--------------------------------------------------------|------------------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                                                                     |           |                                                        |                                                                                                |
| URL                  | /licences/summary                                                                                                                                                       |           |                                                        |                                                                                                |
| OPTIONAL PARAMETERS  |                                                                                                                                                                         |           |                                                        |                                                                                                |
| NAME                 | DESCRIPTION                                                                                                                                                             | DATA TYPE | RESPONSE IF OMITTED                                    | PERMITTED VALUES                                                                               |
| search               | Term to be used to compare against the player name, site name, licence code or serial number. If omitted then all licences that are not trashed or deleted are returned | string    |                                                        |                                                                                                |
| type                 | The type of licence.                                                                                                                                                    | Date time | Any type                                               | Standard Trial                                                                                 |
| inUse                | Whether or not a licence has been registered or used as a renewal.                                                                                                      | boolean   | Both registered and unregistered licences are returned | true false                                                                                     |
| maxOutputs           | Maximum number of outputs for a player using this licence.                                                                                                              | integer   |                                                        | Any integer equal to or greater than 0                                                         |
| inTrash              | Whether or not a licence is in the trash.                                                                                                                               | boolean   | Only licences not in the trash are returned            | true false                                                                                     |
| start                | Starting position in the array of licence summaries, if omitted the default is 0                                                                                        | int       | 0                                                      |                                                                                                |
| limit                | Number of licence summaries to return                                                                                                                                   | int       | 50                                                     |                                                                                                |
| status               | The licence status.                                                                                                                                                     | string    | All                                                    | All Active Activateable Unregistered Deactivated Expired ExpireToday Expire7 Expire30 Expire60 |
| sort                 | The sort order for the licences                                                                                                                                         | string    |                                                        | expiryDate                                                                                     |
| sortDirection        | The sort direction, Ascending (asc) or Descending (desc)                                                                                                                | string    |                                                        | asc desc                                                                                       |
| REQUEST BODY         | None                                                                                                                                                                    |           |                                                        |                                                                                                |
| NORMAL RESPONSE CODE | 200                                                                                                                                                                     |           |                                                        |                                                                                                |
| RESPONSE BODY        | A collection of Licence summary objects                                                                                                                                 |           |                                                        |                                                                                                |

#### Get

| DESCRIPTION          | Gets a licence summary object for the specified licence |
|----------------------|---------------------------------------------------------|
| HTTP METHOD          | GET                                                     |
| URL                  | /licences/{id}/summary                                  |
| REQUEST BODY         | None                                                    |
| NORMAL RESPONSE CODE | 200                                                     |
| RESPONSE BODY        | Licence summary object                                  |

### Activate

| DESCRIPTION          | Gets a licence summary object for the specified licence |           |                     |                                   |
|----------------------|---------------------------------------------------------|-----------|---------------------|-----------------------------------|
| DESCRIPTION          | Activates a licence using the provided activation code  |           |                     |                                   |
| HTTP METHOD          | PUT                                                     |           |                     |                                   |
| URL                  | /licences/{id}/activate                                 |           |                     |                                   |
| REQUIRED PARAMETERS  |                                                         |           |                     |                                   |
| NAME                 | DESCRIPTION                                             | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                  |
| activationCode       | The 6 digit activation code shown on the client         | string    | 400 – Bad Request   | A 6 character hexadecimal string. |
| REQUEST BODY         | None                                                    |           |                     |                                   |
| NORMAL RESPONSE CODE | 204                                                     |           |                     |                                   |
| RESPONSE BODY        |                                                         |           |                     |                                   |

### Deactivate

| DESCRIPTION          | Deactivates the licence   |
|----------------------|---------------------------|
| HTTP METHOD          | PUT                       |
| URL                  | /licences/{id}/deactivate |
| REQUEST BODY         | None                      |
| NORMAL RESPONSE CODE | 204                       |
| RESPONSE BODY        |                           |

### Renew

| DESCRIPTION          | Renews a licence                                   |           |                     |                  |
|----------------------|----------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | PUT                                                |           |                     |                  |
| URL                  | /licences/{id}/renew?renewalLength={renewalLength} |           |                     |                  |
| REQUIRED PARAMETERS  |                                                    |           |                     |                  |
| NAME                 | DESCRIPTION                                        | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| renewalLength        | The length to renew the licence by, in months      | int       | 400                 |                  |
| REQUEST BODY         | None                                               |           |                     |                  |
| NORMAL RESPONSE CODE | 200                                                |           |                     |                  |
| RESPONSE BODY        | The updated licence collection object              |           |                     |                  |

### Convert

| DESCRIPTION          | Converts a licence                                                    |           |                     |                  |
|----------------------|-----------------------------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | PUT                                                                   |           |                     |                  |
| URL                  | /licences/{id}/convert?conversionLength={conversionLength}            |           |                     |                  |
| REQUIRED PARAMETERS  |                                                                       |           |                     |                  |
| NAME                 | DESCRIPTION                                                           | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| conversionLength     | The length of licence, in months, to use to convert the trial licence | int       | 400                 |                  |
| REQUEST BODY         | None                                                                  |           |                     |                  |
| NORMAL RESPONSE CODE | 200                                                                   |           |                     |                  |
| RESPONSE BODY        | The updated licence collection object                                 |           |                     |                  |

### Renewals

#### Get

| DESCRIPTION          | Gets the renewal licences that have been applied to the licence |
|----------------------|-----------------------------------------------------------------|
| HTTP METHOD          | GET                                                             |
| URL                  | /licences/{id}/renewals                                         |
| REQUEST BODY         | None                                                            |
| NORMAL RESPONSE CODE | 200                                                             |
| RESPONSE BODY        | A list of licence objects                                       |

#### Options

| DESCRIPTION          | Gets the renewal options for the licence |
|----------------------|------------------------------------------|
| HTTP METHOD          | GET                                      |
| URL                  | /licences/{id}/renewals/options          |
| REQUEST BODY         | None                                     |
| NORMAL RESPONSE CODE | 200                                      |
| RESPONSE BODY        | A list of licence renewal option objects |

### Conversions

#### Options

| DESCRIPTION          | Gets the conversion options for the trial licence |
|----------------------|---------------------------------------------------|
| HTTP METHOD          | GET                                               |
| URL                  | /licences/{id}/conversion/options                 |
| REQUEST BODY         | None                                              |
| NORMAL RESPONSE CODE | 200                                               |
| RESPONSE BODY        | A list of licence conversion option objects       |

## Media Assets

### Get All

| DESCRIPTION          | Returns a collection of media asset objects, that can be optionally filtered                                                        |           |                                                            |                                                                                                    |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------|-----------|------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                                 |           |                                                            |                                                                                                    |
| URL                  | /mediaassets                                                                                                                        |           |                                                            |                                                                                                    |
| OPTIONAL PARAMETERS  |                                                                                                                                     |           |                                                            |                                                                                                    |
| NAME                 | DESCRIPTION                                                                                                                         | DATA TYPE | RESPONSE IF OMITTED                                        | PERMITTED VALUES                                                                                   |
| search               | Term to be used to compare against the asset name and tags, if omitted then all assets that are not trashed or deleted are returned | string    | Empty String                                               |                                                                                                    |
| addedFrom            | Returns only assets added after this date                                                                                           | Date time |                                                            |                                                                                                    |
| addedTo              | Returns only assets added before this date                                                                                          | Date time |                                                            |                                                                                                    |
| usedFrom             | Returns only assets used after this date                                                                                            | Date time |                                                            |                                                                                                    |
| usedTo               | Returns only assets used up to this date                                                                                            | Date time |                                                            |                                                                                                    |
| types                | CSV of media types e.g. image,video                                                                                                 | string    | audio, image, video, flash, stream, web, rss, tvin, widget | A csv containing any of the following values: audio image video flash stream web rss tvin widget   |
| folderid             | Folder ID to return the assets for. This implies that it is possible to search within a folder                                      | int       |                                                            | If a folder ID is specified that is not on the user’s network then a Bad Response should be thrown |
| intrash              | Boolean indicating if to return asset in the trash. If this is true ONLY assets in the trash will be returned                       | Boolean   | false                                                      | true false                                                                                         |
| start                | Starting position in the array of media assets, if omitted the default is 0                                                         | int       | 0                                                          |                                                                                                    |
| limit                | Number of media assets to return,                                                                                                   | int       | 50                                                         |                                                                                                    |
| providers            | CSV of third party providers and will limits the media assets returned to the specified providers                                   | string    | Empty String                                               | screenfeed                                                                                         |
| order                | Specifies the order to return media assets options are returned                                                                     | string    | alphanumeric                                               | alphanumeric datecreated lastused lastModified                                                     |
| REQUEST BODY         | None                                                                                                                                |           |                                                            |                                                                                                    |
| NORMAL RESPONSE CODE | 200                                                                                                                                 |           |                                                            |                                                                                                    |
| RESPONSE BODY        | Array of Media Asset objects                                                                                                        |           |                                                            |                                                                                                    |

### Get

| DESCRIPTION          | Gets a single media asset object |
|----------------------|----------------------------------|
| HTTP METHOD          | GET                              |
| URL                  | /mediaassets/{id}                |
| REQUEST BODY         | None                             |
| NORMAL RESPONSE CODE | 200                              |
| RESPONSE BODY        | Media Asset object               |

### Create

| DESCRIPTION          | Creates a new media asset the same request is used for file uploads, non files (i.e. adds a web page, IPTV Stream or RSS/MRSS Feed) and adding a media asset from a Digital Asset Management Tool |
|----------------------|------------------------------------------------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                                                             |
| URL                  | /mediaassets/add                                                                                                 |
| REQUEST BODY         | An array of New Media Asset Request Objects                                                                      |
| NORMAL RESPONSE CODE | 201                                                                                                              |
| RESPONSE BODY        | An array of New Media Asset Response Objects                                                                     |


### Add Media Asset from a Digital Asset Management Tool

Signagelive have added a mechanism to be able to add content using a URL pointing at their Digital Asset Management platform, Signagelive will take this, download the file, and validate it is usable, and then send the success or failure of this to a provided webhook. It is possible to send multiple Media Assets at once.

| DESCRIPTION          | Add Media Asset from a Digital Asset Management Tool               |
|----------------------|--------------------------------------------------------------------|
| HTTP METHOD          | POST                                                               |
| URL                  | /mediaassets/add                                                |
| REQUEST BODY         | An array of New Media Asset Request Objects |
| NORMAL RESPONSE CODE | 201                                                                |
| RESPONSE BODY        | An array of New Media Asset Response Objects                       |

Once Signagelive has processed the request, we will send the outcome to the configured webHook. The body included will be a Remote Sync Media Asset Status object. If success is true, the asset is ready to be used and the ID is included.

If success is false, then errors will be included as the reason why. The error codes are as follows:

| ERROR CODE | Description |
|------------|-------------|
|SLRSR0001 | Asset could not be downloaded from the remote URL  |
|SLRSR0002 | The file type is unknown to Signagelive based on the extension  |
|SLRSR0003 | The media asset could not be uploaded to Signagelive storage (cloud files)  |
|SLRSR0004 | There was an error saving the new media asset to the database  |
|SLRSR0005 | Thumbnail could not be generated  |
|SLRSR0006 | Uncaught exception thrown  |
|SLRSR0007 | Network Real Time Event not found  |
|SLRSR0008 | Unable to add Real Time event/s to media asset  |



### Update

| DESCRIPTION          | Allows the name of the media asset or if it is included in Proof of Play to be updated. |
|----------------------|-----------------------------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                                                     |
| URL                  | /mediaassets/{id}                                                                       |
| REQUEST BODY         | Media Asset object with updates – note that only the name and PoP is updatable          |
| NORMAL RESPONSE CODE | 200                                                                                     |
| RESPONSE BODY        | Media Asset object                                                                      |

### Delete

| DESCRIPTION          | Moves the specified media asset to the trash |
|----------------------|----------------------------------------------|
| HTTP METHOD          | DELETE                                       |
| URL                  | /mediaassets/{id}                            |
| REQUEST BODY         | None                                         |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | None                                         |

### Thumbnails

#### Request

| DESCRIPTION          | Requests a new thumbnail for the specified media asset |
|----------------------|--------------------------------------------------------|
| HTTP METHOD          | POST                                                   |
| URL                  | /mediaassets/{id}/thumbnailrequests                    |
| REQUEST BODY         | Thumbnail Request object with no id                    |
| NORMAL RESPONSE CODE | 201                                                    |
| RESPONSE BODY        | Thumbnail Request Object with the generated Id         |

### Metadata

#### Get

| DESCRIPTION          | Gets the metadata for the specified media asset |
|----------------------|-------------------------------------------------|
| HTTP METHOD          | GET                                             |
| URL                  | /mediaassets/{id}/metadata                      |
| REQUEST BODY         | None                                            |
| NORMAL RESPONSE CODE | 200                                             |
| RESPONSE BODY        | Media Asset Metadata object                     |

### Tags

#### Get

| DESCRIPTION          | Gets the tags for the specified media asset |
|----------------------|---------------------------------------------|
| HTTP METHOD          | GET                                         |
| URL                  | /mediaassets/{id}/tags                      |
| REQUEST BODY         | None                                        |
| NORMAL RESPONSE CODE | 200                                         |
| RESPONSE BODY        | Array of Tags                               |

#### Create

| DESCRIPTION          | Adds the tag to the tag collection for the specified media asset |
|----------------------|------------------------------------------------------------------|
| HTTP METHOD          | POST                                                             |
| URL                  | /mediaassets/{id}/tags                                           |
| REQUEST BODY         | Tag object with no id                                            |
| NORMAL RESPONSE CODE | 201                                                              |
| RESPONSE BODY        | Tag object with id                                               |

#### Update

| DESCRIPTION          | Allows the user to edit the value of the tag |
|----------------------|----------------------------------------------|
| HTTP METHOD          | PUT                                          |
| URL                  | /mediaassets/{id}/tags/{id}                  |
| REQUEST BODY         | Tag object with modification to the value    |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | Tag with update                              |

#### Delete

| DESCRIPTION          | Allows the user to edit the value of the tag |
|----------------------|----------------------------------------------|
| HTTP METHOD          | DELETE                                       |
| URL                  | /mediaassets/{id}/tags/{id}                  |
| REQUEST BODY         | None                                         |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | None                                         |

### Proof of Play

Note that calls to Proof of Play will return ‘Unauthorized’ if Proof of Play is not enabled on your network.

#### Get

| DESCRIPTION          | Gets the PoP reference or the specified media asset   |
|----------------------|-------------------------------------------------------|
| HTTP METHOD          | GET                                                   |
| URL                  | /mediaassets/{id}/proofofplay/references              |
| REQUEST BODY         | None                                                  |
| NORMAL RESPONSE CODE | 200                                                   |
| RESPONSE BODY        | Array of Proof of Play References for the media asset |

#### Add

| DESCRIPTION          | Adds the reference to the PoP reference collection for the specified media asset |
|----------------------|----------------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                             |
| URL                  | /mediaassets/{id}/proofofplay/references                                         |
| REQUEST BODY         | Proof of Play reference with no ID                                               |
| NORMAL RESPONSE CODE | 201                                                                              |
| RESPONSE BODY        | Proof of Play reference with the new ID                                          |

#### Edit

| DESCRIPTION          | Allows the user to edit the value of the proof of play reference |
|----------------------|------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                              |
| URL                  | /mediaassets/{id}/proofofplay/references/{id}                    |
| REQUEST BODY         | Proof of Play reference with modification to the value           |
| NORMAL RESPONSE CODE | 200                                                              |
| RESPONSE BODY        | Proof of Play reference with update                              |

#### Delete

| DESCRIPTION          | Allows the user to delete the Proof of Play reference |
|----------------------|-------------------------------------------------------|
| HTTP METHOD          | DELETE                                                |
| URL                  | /mediaassets/{id}/proofofplay/references/{id}         |
| REQUEST BODY         | None                                                  |
| NORMAL RESPONSE CODE | 200                                                   |
| RESPONSE BODY        | None                                                  |

## Playlists

### Get List

| DESCRIPTION          | Gets a list of playlists                                                                                                                     |           |                     |                                                                                                    |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------------------|----------------------------------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                                          |           |                     |                                                                                                    |
| URL                  | /playlists                                                                                                                                   |           |                     |                                                                                                    |
| OPTIONAL PARAMETERS  |                                                                                                                                              |           |                     |                                                                                                    |
| NAME                 | DESCRIPTION                                                                                                                                  | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                                                                                   |
| search               | Term to be used to compare against the name and tags, if omitted then all playlists that are not trashed or deleted are returned             | string    | Empty String        |                                                                                                    |
| addedFrom            | Returns only playlists added after this date                                                                                                 | Date time |                     |                                                                                                    |
| addedTo              | Returns only playlists added before this date                                                                                                | Date time |                     |                                                                                                    |
| usedFrom             | Returns only playlists used after this date                                                                                                  | Date time |                     |                                                                                                    |
| usedTo               | Returns only playlists used up to this date                                                                                                  | Date time |                     |                                                                                                    |
| modifiedFrom         | Return only playlists last modified after this date                                                                                          |           |                     |                                                                                                    |
| modifiedTo           | Return only playlists last modified before this date                                                                                         |           |                     |                                                                                                    |
| folderid             | Folder ID to return the playlists for.                                                                                                       | int       |                     | If a folder ID is specified that is not on the user’s network then a Bad Response should be thrown |
| intrash              | Boolean indicating if to return playlists in the trash. If this is true ONLY playlists in the trash will be returned                         | Boolean   | false               | true false                                                                                         |
| start                | Starting position in the array of playlists, if omitted the default is 0                                                                     | int       | 0                   |                                                                                                    |
| limit                | Number of playlists to return,                                                                                                               | int       | 50                  |                                                                                                    |
| order                | Specifies the order to return playlists options are returned                                                                                 | String    | alphanumeric        | alphanumeric datecreated Lastused modified                                                         |
| deepload             | Indicates if the Playlist Media Assets and child objects should be loaded. Only works when getting all assets i.e. not a folder or not trash | Boolean   | false               | true false                                                                                         |
| REQUEST BODY         | None                                                                                                                                         |           |                     |                                                                                                    |
| NORMAL RESPONSE CODE | 200                                                                                                                                          |           |                     |                                                                                                    |
| RESPONSE BODY        | List of playlist objects                                                                                                                     |           |                     |                                                                                                    |

### Get

| DESCRIPTION          | Gets a specific playlist |
|----------------------|--------------------------|
| HTTP METHOD          | GET                      |
| URL                  | /playlists/{id}          |
| REQUEST BODY         | None                     |
| NORMAL RESPONSE CODE | 200                      |
| RESPONSE BODY        | Playlist Model           |

### Create

| DESCRIPTION          | Creates a playlist                                                                 |
|----------------------|------------------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                               |
| URL                  | /playlists                                                                         |
| REQUEST BODY         | Playlist Object with no ID                                                         |
| NORMAL RESPONSE CODE | 201                                                                                |
| RESPONSE BODY        | Playlist Model with Id and ID’s for all PlaylistMediaAssets and associated objects |

### Update

| DESCRIPTION          | Updates the Playlist |
|----------------------|----------------------|
| HTTP METHOD          | PUT                  |
| URL                  | /playlists/{id}      |
| REQUEST BODY         | Playlist Model       |
| NORMAL RESPONSE CODE | 200                  |
| RESPONSE BODY        | Playlist Model       |

### Delete

| DESCRIPTION          | Deletes the Playlist (moves it to the trash) |
|----------------------|----------------------------------------------|
| HTTP METHOD          | DELETE                                       |
| URL                  | /playlists/{id}                              |
| REQUEST BODY         | None                                         |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | None                                         |

### Add Asset to Playlist

| DESCRIPTION          | Add an Asset to a Playlist                   |
|----------------------|----------------------------------------------|
| HTTP METHOD          | POST                                         |
| URL                  | /playlists/{id}/playlistmediaasset           |
| REQUEST BODY         | Add Asset to Playlist Request Model          |
| NORMAL RESPONSE CODE | 200                                          |
| RESPONSE BODY        | Add Asset to Playlist Request Response       |

The Network API has a method to allow for a Media Asset to be added to a Playlist, without the need for retrieving the entire playlist, adding the media to the media assets collection and then resaving the playlist.

The reason for this addition is to make it possible to add a number of media assets to a single playlist in parallel without having to maintain the entire collection of media assets for a playlist, as this is required for each save.

This method accepts requests, and adds them to a queue which will be processed in the background serially for a specific playlist.

Once the request is processed and the playlist is saved, if it is published to a player, then the player will be automatically updated with the new playlist content.

The body of the request requires the entire Playlist Media Asset object, as it would be when adding to a playlist, this can include Validity and Conditional Playback data if required. This object, must also include the entire Media Asset object.

It is also possible to include a web hook, which will be sent a notification when the media is successfully added to the playlist, or an error when it cannot be added to the playlist.

If you set the position to -1, then the asset will be added to the end of the playlist. If you set a position then the asset will be added in that position, and everything after and including the asset currently at that position, will be moved 1 higher in their position.

NOTE: Positions start from 0, so the first media asset in a playlist, will have a position of 0;


## Layouts

### Get a List

| DESCRIPTION          | Gets a list of layouts on the current network |
|----------------------|-----------------------------------------------|
| HTTP METHOD          | GET                                           |
| URL                  | /layouts/                                     |
| REQUEST BODY         | None                                          |
| NORMAL RESPONSE CODE | 200                                           |
| RESPONSE BODY        | A list of layouts                             |

### Get

| DESCRIPTION          | Gets a layout     |
|----------------------|-------------------|
| HTTP METHOD          | GET               |
| URL                  | /layouts/{id}     |
| REQUEST BODY         | None              |
| NORMAL RESPONSE CODE | 200               |
| RESPONSE BODY        | The Layout object |

### Create

| DESCRIPTION          | Create a layout                                                           |
|----------------------|---------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                      |
| URL                  | /layouts/{id}                                                             |
| REQUEST BODY         | A new layout object with no ID                                            |
| NORMAL RESPONSE CODE | 200                                                                       |
| RESPONSE BODY        | A layout object with and ID and IDs for all media windows and sub objects |

### Update

| DESCRIPTION          | Edits a layout                 |           |                     |                  |
|----------------------|--------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | PUT                            |           |                     |                  |
| URL                  | /layouts/{id}                  |           |                     |                  |
| OPTIONAL PARAMETERS  |                                |           |                     |                  |
| NAME                 | DESCRIPTION                    | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| autoUpdate           |                                | boolean   | false               | true             |
| REQUEST BODY         | The layout object with changes |           |                     |                  |
| NORMAL RESPONSE CODE | 200                            |           |                     |                  |
| RESPONSE BODY        | The updated layout object      |           |                     |                  |

## Folders

### Get All

| DESCRIPTION          | Gets a list of folders                                                                                                         |           |                     |                                   |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------|-----------|---------------------|-----------------------------------|
| HTTP METHOD          | GET                                                                                                                            |           |                     |                                   |
| URL                  | /folders                                                                                                                       |           |                     |                                   |
| REQUIRED PARAMETERS  |                                                                                                                                |           |                     |                                   |
| NAME                 | DESCRIPTION                                                                                                                    | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                  |
| type                 | Folders are generic objects in the Signagelive system, so the type of folder must be specified that is appropriate to the view | string    | 400 – Bad Request   | mediaasset playlist layout player |
| start                | Starting position in the array of folders, if omitted the default is 0                                                         | int       | 0                   |                                   |
| limit                | Number of folders to return,                                                                                                   | int       | 50                  |                                   |
| REQUEST BODY         | None                                                                                                                           |           |                     |                                   |
| NORMAL RESPONSE CODE | 200                                                                                                                            |           |                     |                                   |
| RESPONSE BODY        | List of folders objects                                                                                                        |           |                     |                                   |

### Get

| DESCRIPTION          | Gets the specified folder |
|----------------------|---------------------------|
| HTTP METHOD          | GET                       |
| URL                  | /folders/{id}             |
| REQUEST BODY         | None                      |
| NORMAL RESPONSE CODE | 200                       |
| RESPONSE BODY        | Folder model              |

### Create

| DESCRIPTION          | Creates a new folder    |
|----------------------|-------------------------|
| HTTP METHOD          | POST                    |
| URL                  | /folders                |
| REQUEST BODY         | Folder model with no id |
| NORMAL RESPONSE CODE | 201                     |
| RESPONSE BODY        | Folder model with Id    |

### Update

| DESCRIPTION          | Updates the specified folder                    |
|----------------------|-------------------------------------------------|
| HTTP METHOD          | PUT                                             |
| URL                  | /folders/{id}                                   |
| REQUEST BODY         | Folder model – note only the name is updateable |
| NORMAL RESPONSE CODE | 200                                             |
| RESPONSE BODY        | Folder model with updates                       |

### Delete

| DESCRIPTION          | Deletes the specified folder |
|----------------------|------------------------------|
| HTTP METHOD          | DELETE                       |
| URL                  | /folders/{id}                |
| REQUEST BODY         | None                         |
| NORMAL RESPONSE CODE | 200                          |
| RESPONSE BODY        | None                         |

### Items

#### Get

| DESCRIPTION          | Get a list of items in a folder.                                                                                                  |           |                                                            |                                                |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------|-----------|------------------------------------------------------------|------------------------------------------------|
| HTTP METHOD          | GET                                                                                                                               |           |                                                            |                                                |
| URL                  | /folders/{id}/items                                                                                                               |           |                                                            |                                                |
| OPTIONAL PARAMETERS  |                                                                                                                                   |           |                                                            |                                                |
| NAME                 | DESCRIPTION                                                                                                                       | DATA TYPE | RESPONSE IF OMITTED                                        | PERMITTED VALUES                               |
| search               | Term to be used to compare against the item name and tags, if omitted then all items that are not trashed or deleted are returned | string    | Empty String                                               |                                                |
| addedFrom            | Returns only items added after this date                                                                                          | Date time |                                                            |                                                |
| addedTo              | Returns only items added before this date                                                                                         | Date time |                                                            |                                                |
| usedFrom             | Returns only items used after this date                                                                                           | Date time |                                                            |                                                |
| usedTo               | Returns only items used up to this date                                                                                           | Date time |                                                            |                                                |
| types                | CSV of types                                                                                                                      | string    | audio, image, video, flash, stream, web, rss, tvin, widget | A CSV containing any the required values       |
| start                | Starting position in the array of items, if omitted the default is 0                                                              | int       | 0                                                          |                                                |
| limit                | Number of items to return,                                                                                                        | int       | 50                                                         |                                                |
| providers            | CSV of third party providers and will limits the media assets returned to the specified providers                                 | string    | Empty String                                               | screenfeed                                     |
| order                | Specifies the order to return items options are returned                                                                          | string    | alphanumeric                                               | alphanumeric datecreated lastused lastModified |
| REQUEST BODY         |                                                                                                                                   |           |                                                            |                                                |
| NORMAL RESPONSE CODE | 200                                                                                                                               |           |                                                            |                                                |
| RESPONSE BODY        | A list of items within the folder                                                                                                 |           |                                                            |                                                |

#### Add

| DESCRIPTION          | Adds an item to a folder. The server will check the folder and the item are the same type. |
|----------------------|--------------------------------------------------------------------------------------------|
| HTTP METHOD          | POST                                                                                       |
| URL                  | /folders/{id}/items                                                                        |
| REQUEST BODY         | Item to add to folder                                                                      |
| NORMAL RESPONSE CODE | 200                                                                                        |
| RESPONSE BODY        | None                                                                                       |

#### Delete

| DESCRIPTION          | Removes an item from a folder. |
|----------------------|--------------------------------|
| HTTP METHOD          | DELETE                         |
| URL                  | /folders/{id}/items/{id}       |
| REQUEST BODY         | None                           |
| NORMAL RESPONSE CODE | 200                            |
| RESPONSE BODY        | None                           |

### Tags

#### Get

| DESCRIPTION          | Gets the tags for the specified folder |
|----------------------|----------------------------------------|
| HTTP METHOD          | GET                                    |
| URL                  | /folders/{id}/tags                     |
| REQUEST BODY         | None                                   |
| NORMAL RESPONSE CODE | 200                                    |
| RESPONSE BODY        | List of Tag models                     |

#### Add

| DESCRIPTION          | Adds a tag to a folder and subsequently the object in it |
|----------------------|----------------------------------------------------------|
| HTTP METHOD          | POST                                                     |
| URL                  | /folders/{id}/tags                                       |
| REQUEST BODY         | Tag model with no Id                                     |
| NORMAL RESPONSE CODE | 201                                                      |
| RESPONSE BODY        | New Tag model with new Id                                |

#### Update

| DESCRIPTION          | Edits a tag to a folder and subsequently the object in it |
|----------------------|-----------------------------------------------------------|
| HTTP METHOD          | PUT                                                       |
| URL                  | /folders/{id}/tags/{id}                                   |
| REQUEST BODY         | Tag model with updates                                    |
| NORMAL RESPONSE CODE | 200                                                       |
| RESPONSE BODY        | Tag model with edits                                      |

#### Delete

| DESCRIPTION          | Deletes a tag from a folder and subsequently the object in it |
|----------------------|---------------------------------------------------------------|
| HTTP METHOD          | DELETE                                                        |
| URL                  | /folders/{id}/tags/{id}                                       |
| REQUEST BODY         | None                                                          |
| NORMAL RESPONSE CODE | 200                                                           |
| RESPONSE BODY        | None                                                          |

## Trash

### Get

| DESCRIPTION          | Lists the objects specified in the trash                               |
|----------------------|------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                    |
| URL                  | /{objectname}/trash – Note options are mediaassets, playlists, players |
| REQUEST BODY         | None                                                                   |
| NORMAL RESPONSE CODE | 200                                                                    |
| RESPONSE BODY        | List of specified objects                                              |

### Add

| DESCRIPTION          | Adds the specified object to the trash                                 |
|----------------------|------------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                                    |
| URL                  | /{objectname}/trash – Note options are mediaassets, playlists, players |
| REQUEST BODY         | Object to put in trash                                                 |
| NORMAL RESPONSE CODE | 200                                                                    |
| RESPONSE BODY        | Object passed                                                          |

### Restore

| DESCRIPTION          | Restores the object specified to the library                                        |
|----------------------|-------------------------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                                                 |
| URL                  | /{objectname}/trash/{id}/restore – Note options are mediaassets, playlists, players |
| REQUEST BODY         | None                                                                                |
| NORMAL RESPONSE CODE | 200                                                                                 |
| RESPONSE BODY        | None                                                                                |

### Permanently Delete

| DESCRIPTION          | Permanently deletes the object so that it is not available for use in Signagelive |
|----------------------|-----------------------------------------------------------------------------------|
| HTTP METHOD          | DELETE                                                                            |
| URL                  | /{objectname}/trash/{id} – Note options are mediaassets, playlists, players       |
| REQUEST BODY         | None                                                                              |
| NORMAL RESPONSE CODE | 200                                                                               |
| RESPONSE BODY        | None                                                                              |

## Player Types

### Get All

| DESCRIPTION          | Gets a list of all available player types |
|----------------------|-------------------------------------------|
| HTTP METHOD          | GET                                       |
| URL                  | /playertypes                              |
| REQUEST BODY         | None                                      |
| NORMAL RESPONSE CODE | 200                                       |
| RESPONSE BODY        | List of playertype objects                |

### Get

| DESCRIPTION          | Gets the specified player type |
|----------------------|--------------------------------|
| HTTP METHOD          | GET                            |
| URL                  | /playertypes/{id}              |
| REQUEST BODY         | None                           |
| NORMAL RESPONSE CODE | 200                            |
| RESPONSE BODY        | A playertype object            |

## Player Type KPI Setting

### Get

Get All Player Type KPI Settings

| DESCRIPTION          | Get All Player Type KPI Settings for a Network |
|----------------------|------------------------------------------------|
| HTTP METHOD          | GET                                            |
| URL                  | /networks/{network_id}/PlayerTypeKPISettings   |
| REQUEST BODY         | None                                           |
| NORMAL RESPONSE CODE | 200                                            |
| RESPONSE BODY        | Array of player type kpi settings objects      |

### Create

Create Player Type KPI Setting

| DESCRIPTION          | Create a new Player Type KPI Setting         |
|----------------------|----------------------------------------------|
| HTTP METHOD          | POST                                         |
| URL                  | /networks/{network_id}/PlayerTypeKPISettings |
| REQUEST BODY         | A new Player Type KPI Setting object         |
| NORMAL RESPONSE CODE | 201                                          |
| RESPONSE BODY        | none                                         |

### Update

Update Player Type KPI Setting

| DESCRIPTION          | Update an existing Player Type KPI Setting by Id  |
|----------------------|---------------------------------------------------|
| HTTP METHOD          | PUT                                               |
| URL                  | /networks/{network_id}/PlayerTypeKPISettings/{id} |
| REQUEST BODY         | Updated Player Type KPI Settings Object           |
| NORMAL RESPONSE CODE | 200                                               |
| RESPONSE BODY        | A Player Type KPI Settings object                 |

### Delete

Delete Player Type KPI Setting

| DESCRIPTION          | Delete a Player Type KPI Setting by Id            |
|----------------------|---------------------------------------------------|
| HTTP METHOD          | DELETE                                            |
| URL                  | /networks/{network_id}/PlayerTypeKPISettings/{id} |
| REQUEST BODY         | None                                              |
| NORMAL RESPONSE CODE | 200                                               |
| RESPONSE BODY        | None                                              |

## Global Settings

### Players

#### Content Check

| DESCRIPTION          | Sets the content check settings for all players on the network |           |                     |                                                                                     |
|----------------------|----------------------------------------------------------------|-----------|---------------------|-------------------------------------------------------------------------------------|
| HTTP METHOD          | PUT                                                            |           |                     |                                                                                     |
| URL                  | /globalsettings/players/contentcheck                           |           |                     |                                                                                     |
| REQUIRED PARAMETERS  |                                                                |           |                     |                                                                                     |
| NAME                 | DESCRIPTION                                                    | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                                                                    |
| type                 | The type of content check, either at a set interval or daily   | string    | 400                 | setInterval: daily                                                                  |
| OPTIONAL PARAMETERS  |                                                                |           |                     |                                                                                     |
| NAME                 | DESCRIPTION                                                    | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                                                                    |
| interval             | The interval for content checks, in minutes                    | int       | None                | This can be any value from 1 to 1440. This is required when ‘type’ is ‘setInterval’ |
| time                 | The time of day for content checks                             | string    | None                | The format to be used is HH:MM:SS. This is required when ‘type’ is ‘daily’          |
| separateRssSync      | Should RSS feeds by synced separately to content checks?       | boolean   | None                | True if RSS feeds should be synced separately to content checks, otherwise false.   |
| REQUEST BODY         | None                                                           |           |                     |                                                                                     |
| NORMAL RESPONSE CODE | 200                                                            |           |                     |                                                                                     |
| RESPONSE BODY        | None                                                           |           |                     |                                                                                     |

#### Health Check

| DESCRIPTION          | Sets the content check settings for all players on the network |           |                     |                                       |
|----------------------|----------------------------------------------------------------|-----------|---------------------|---------------------------------------|
| HTTP METHOD          | PUT                                                            |           |                     |                                       |
| URL                  | /globalsettings/players/healthcheck                            |           |                     |                                       |
| REQUIRED PARAMETERS  |                                                                |           |                     |                                       |
| NAME                 | DESCRIPTION                                                    | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                      |
| interval             | The interval for health checks, in minutes                     | int       | 400                 | This can be any value from 1 to 1440. |
| REQUEST BODY         | None                                                           |           |                     |                                       |
| NORMAL RESPONSE CODE | 200                                                            |           |                     |                                       |
| RESPONSE BODY        | None                                                           |           |                     |                                       |

#### Reboots

| DESCRIPTION              | Sets the reboot settings for all players on the network |           |                     |                                    |
|--------------------------|---------------------------------------------------------|-----------|---------------------|------------------------------------|
| HTTP METHOD              | PUT                                                     |           |                     |                                    |
| URL                      | /globalsettings/players/reboots                         |           |                     |                                    |
| REQUIRED PARAMETERS      |                                                         |           |                     |                                    |
| NAME                     | DESCRIPTION                                             | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                   |
| enabled                  | Enables or disables scheduled reboots                   | boolean   | 400                 | True or false                      |
| OPTIONAL PARAMETERS      |                                                         |           |                     |                                    |
| NAME                     | DESCRIPTION                                             | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                   |
| time                     | The time of day for reboots                             | string    | 00:00:00            | The format to be used is HH:MM:SS. |
| rebootAtNextContentCheck | If true, players will reboot at the next content check. | boolean   | None                | True or false                      |
| REQUEST BODY             | None                                                    |           |                     |                                    |
| NORMAL RESPONSE CODE     | 200                                                     |           |                     |                                    |
| RESPONSE BODY            | None                                                    |           |                     |                                    |

#### Proof of Play

| DESCRIPTION          | Sets the content check settings for all players on the network. This will return forbidden if proof of play is not enabled on the network. |           |                     |                  |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------------------|------------------|
| HTTP METHOD          | PUT                                                                                                                                        |           |                     |                  |
| URL                  | /globalsettings/players/proofofplay                                                                                                        |           |                     |                  |
| REQUIRED PARAMETERS  |                                                                                                                                            |           |                     |                  |
| NAME                 | DESCRIPTION                                                                                                                                | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES |
| enabled              | A boolean value to enable or disable proof of play                                                                                         | boolean   | 400                 | True or false    |
| REQUEST BODY         | None                                                                                                                                       |           |                     |                  |
| NORMAL RESPONSE CODE | 200                                                                                                                                        |           |                     |                  |
| RESPONSE BODY        | None                                                                                                                                       |           |                     |                  |

#### Screen Control

| DESCRIPTION          | Sets the screen control settings for all players on the network |
|----------------------|-----------------------------------------------------------------|
| HTTP METHOD          | POST                                                            |
| URL                  | /globalsettings/players/screencontrol                           |
| REQUEST BODY         | A GlobalScreenControl object                                    |
| NORMAL RESPONSE CODE | 200                                                             |
| RESPONSE BODY        | None                                                            |

## Publish Content

### Publish

| DESCRIPTION          | Publish content to players      |
|----------------------|---------------------------------|
| HTTP METHOD          | POST                            |
| URL                  | /publish/publish                        |
| REQUEST BODY         | A publication configuration object            |
| NORMAL RESPONSE CODE | 200                             |
| RESPONSE BODY        | A list of PublishResult objects |

#### Check

| DESCRIPTION          | Checks the publication prior to publishing |
|----------------------|--------------------------------------------|
| HTTP METHOD          | POST                                       |
| URL                  | /publish/checkPublication                             |
| REQUEST BODY         | A publication configuration object                       |
| NORMAL RESPONSE CODE | 200                                        |
| RESPONSE BODY        | A list of PublishResult objects            |

#### Publish an Interrupt Example

<b>Get the Interrupt</b>

Signagelive provides a list of interrupt signals, which need to be included in the publication, to define which interrupt is being used, and will trigger the published content.

You will need to get all, and find the interrupt you are looking to use.

<b>Publish to Players</b>

So that all players have the Trigger published to them, meaning that when we add content it is automatically published, we need to publish the interrupt to all players we currently know about and want to publish the trigger to. Any new players added after this, will need to have the trigger published to them, using this process.

Make sure you set the Playlist object to be the full playlist object returned for the playlist.

### Player List

#### Get List

| DESCRIPTION          | Gets all playerlists on the network |
|----------------------|-------------------------------------|
| HTTP METHOD          | GET                                 |
| URL                  | /playerlists                        |
| REQUEST BODY         | None                                |
| NORMAL RESPONSE CODE | 200                                 |
| RESPONSE BODY        | A list of playerlist objects        |

#### Get

| DESCRIPTION          | Gets a playerlist on the network |
|----------------------|----------------------------------|
| HTTP METHOD          | GET                              |
| URL                  | /playerlists/{id}                |
| REQUEST BODY         | None                             |
| NORMAL RESPONSE CODE | 200                              |
| RESPONSE BODY        | A single playerlist object       |

#### Create

| DESCRIPTION          | Saves a playerlist                   |
|----------------------|--------------------------------------|
| HTTP METHOD          | POST                                 |
| URL                  | /playerlists                         |
| REQUEST BODY         | The new playerlist object            |
| NORMAL RESPONSE CODE | 201                                  |
| RESPONSE BODY        | The playerlist object now with an ID |

#### Update

| DESCRIPTION          | Saves a playerlist                 |
|----------------------|------------------------------------|
| HTTP METHOD          | PUT                                |
| URL                  | /playerlists/{ID}/                 |
| REQUEST BODY         | The playerlist object              |
| NORMAL RESPONSE CODE | 200                                |
| RESPONSE BODY        | The playerlist object with changes |

### Saved Search

#### Get All

| DESCRIPTION          | Gets all saved searches on the network |
|----------------------|----------------------------------------|
| HTTP METHOD          | GET                                    |
| URL                  | /savedsearches                         |
| REQUEST BODY         | None                                   |
| NORMAL RESPONSE CODE | 200                                    |
| RESPONSE BODY        | A list of savedsearch objects          |

#### Get

| DESCRIPTION          | Gets a single saved search on the network |
|----------------------|-------------------------------------------|
| HTTP METHOD          | GET                                       |
| URL                  | /savedsearches/{id}                       |
| REQUEST BODY         | None                                      |
| NORMAL RESPONSE CODE | 200                                       |
| RESPONSE BODY        | A single savedsearch object               |

#### Create

| DESCRIPTION          | Saves a saved search                   |
|----------------------|----------------------------------------|
| HTTP METHOD          | POST                                   |
| URL                  | /savedsearches                         |
| REQUEST BODY         | The new SavedSearch object             |
| NORMAL RESPONSE CODE | 201                                    |
| RESPONSE BODY        | The saved search object now with an ID |

#### Update

| DESCRIPTION          | Updates a saved search               |
|----------------------|--------------------------------------|
| HTTP METHOD          | PUT                                  |
| URL                  | /savedsearches/{ID}/                 |
| REQUEST BODY         | The SavedSearch object               |
| NORMAL RESPONSE CODE | 200                                  |
| RESPONSE BODY        | The saved search object with updates |

## Users

### Get All

| DESCRIPTION          | Returns a collection of network user objects, that can be optionally filtered                               |           |                     |                                                                             |
|----------------------|-------------------------------------------------------------------------------------------------------------|-----------|---------------------|-----------------------------------------------------------------------------|
| HTTP METHOD          | GET                                                                                                         |           |                     |                                                                             |
| URL                  | /users                                                                                                      |           |                     |                                                                             |
| OPTIONAL PARAMETERS  |                                                                                                             |           |                     |                                                                             |
| NAME                 | DESCRIPTION                                                                                                 | DATA TYPE | RESPONSE IF OMITTED | PERMITTED VALUES                                                            |
| search               | Term to be used to compare against the user’s name or email address. If omitted then all users are returned | string    | Empty String        |                                                                             |
| start                | Starting position in the array of users, if omitted the default is 0                                        | int       | 0                   |                                                                             |
| limit                | Number of users to return,                                                                                  | int       | 50                  |                                                                             |
| order                | Specifies the order to return                                                                               | string    | email               | email                                                                       |
| status               | Specifies whether to return all users or only enabled or disabled users                                     | string    | all                 | all enabled disabled                                                        |
| role                 | Specifies whether to return all user levels or a specific level                                             | string    | all                 | superadministrator administrator user messagemanageruser readonly localuser |
| REQUEST BODY         | None                                                                                                        |           |                     |                                                                             |
| NORMAL RESPONSE CODE | 200                                                                                                         |           |                     |                                                                             |
| RESPONSE BODY        | Array of network user objects                                                                               |           |                     |                                                                             |

### Create

| DESCRIPTION          | Saves a user                           |
|----------------------|----------------------------------------|
| HTTP METHOD          | POST                                   |
| URL                  | /users                                 |
| REQUEST BODY         | The new network user object            |
| NORMAL RESPONSE CODE | 201                                    |
| RESPONSE BODY        | The network user object now with an ID |

## Real Time Events

### GET

| DESCRIPTION          | Gets all System Real Time Events       |   |
|----------------------|----------------------------------------|   |
| HTTP METHOD          | GET                                    |   |
| URL                  | /system/realtimeevents/                |   |
| OPTIONAL PARAMETERS  | |           |                                                                             |
| NAME                 | DESCRIPTION                                                                                                 | DATA TYPE |  PERMITTED VALUES                                                            |
| search               | Term to be used to compare against the real time event name. If omitted then all real time events are returned | string    | Empty String    |    
| REQUEST BODY         | None                                   |   |
| NORMAL RESPONSE CODE | 200                                    |   |
| RESPONSE BODY        | A list of real time event objects      |   |

### Install System RTE

| DESCRIPTION          | Install a System RTE on to a Network   |
|----------------------|----------------------------------------|
| HTTP METHOD          | POST                                   |
| URL                  | /realtimeevents/install/{{id}}                         |
| REQUEST BODY         | None             |
| NORMAL RESPONSE CODE | 201                                    |
| RESPONSE BODY        | The real time event object with an ID |

### CREATE

| DESCRIPTION          | Create a Network RTE   |
|----------------------|----------------------------------------|
| HTTP METHOD          | PUT                                   |
| URL                  | /realtimeevents/                         |
| REQUEST BODY         | The new real time event object             |
| NORMAL RESPONSE CODE | 201                                    |
| RESPONSE BODY        | The real time event object with the ID  |

### UPDATE

| DESCRIPTION          | Update the configuration of a Network RTE   |
|----------------------|----------------------------------------|
| HTTP METHOD          | POST                                   |
| URL                  | /realtimeevents/{{id}}                         |
| REQUEST BODY         | The updated real time event object             |
| NORMAL RESPONSE CODE | 201                                    |
| RESPONSE BODY        | The real time event object  |