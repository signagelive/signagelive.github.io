---
layout: doc
title: Proof of Play API
date: 2020-10-27 8:14:30 +0000
post_image: assets/images/service-icon3.png
tags: [Proof of Play, PoP, API, Developer]
toc: true
---
## Proof of Play API - Getting Started

Before continuing with this guide, please make sure you have reviewed the Signagelive Platform Services Getting Started guide, to make sure the Proof of Play API is the correct API for your purpose.

To interact with the Proof of Play API you will be provided with credentials for your Application. To request these credentials, please sign up for access.

[Sign Up for Access](https://docs.google.com/forms/d/e/1FAIpQLScbomALViAsRf3gT562utIXbcLWP17JcLYaJhhnvDQLvrQOCQ/viewform){:target="_blank" .btn-style2 .btn .small}

## Development Environment

Signagelive provides a separate environment to the production environment, for development against the Signagelive Proof of Play API. This environment does not connect in anyway to the production environment, so that there is no chance of potentially affecting your production environment while developing against the API’s.

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

## Proof of Play in Signagelive

For a full understanding of how Proof of Play works within Signagelive, please see our Help Centre articles.

Signagelive only provides the functionality within the User Interface to produce Ad Hoc Reports, but for integrations, daily verbose reports can be configured, and these are then downloaded as imported into the integrating system.

[Proof of Play Help Centre](https://support.signagelive.com/hc/en-us/sections/115000898331-Using-Signagelive-Analytics){:target="_blank" .btn-style2 .btn .small}

## API Endpoints
There are 2 endpoints available, to retrieve the produced Proof of Play reports. These are:

- Produced Reports
- Download

### Produced Reports
The Produced reports endpoint, will return a list of all produced reports for a network. Reports are produced in arrears, so a report for a day, will not be available until 2 days afterwards.

| DESCRIPTION          | Get a Produced Reports for a Network   |
|----------------------|------------------------|
| HTTP METHOD          | GET                    |
| URL                  | /networks/{networkid}/producedreports |
| REQUEST BODY         | None                   |
| NORMAL RESPONSE CODE | 200                    |
| RESPONSE BODY        | An array of all Produced Report objects for a Network       |
 

#### Produced Report Object

{% highlight javascript %}
{
    "id": {number},
    "producedReportID": {number},
    "networkID": {number},
    "playerID": null, - will always be null
    "mediaAssetID": null, - will always be null
    "layoutID": null, - will always be null
    "mediaWindowID": null, - will always be null
    "playlistID": null, - will always be null
    "playlistMediaAssetID": null, - will always be null
    "startDate": "2018-11-13T00:00:00", 
    "endDate": "2018-11-14T00:00:00",
    "reportFilename":{string},
    "name": {string},
    "description": {string}, Options are: Main Report, Additional Report, Adhoc Report
    "producedDate": "2018-11-14T09:19:49",
    "grouping": {string} - Options are Verbose, Group by Player then Media Asset, Group by Media Asset then Player, Group by Media Asset
}
{% endhighlight %}

This will include "Main Reports", "Additional Data" and "Adhoc Report" report types. Main reports are those which are produced initially, and then if any further data is uploaded for a day after that report is produced, an additional data report will be created. This is a continuous process, if more data is uploaded, another additional data report will be created.

Adhoc Reports are those which are produced when a user requests a report within the User Interface, these are a point in time report and will not be updated with any additional data and will not create additional data reports.

### Downloading Reports
To download a produced report, this must be specifically requested using the download end point.

| DESCRIPTION          | Download a specific Produced Report by ID    |
|----------------------|------------------------|
| HTTP METHOD          | GET                    |
| URL                  | /networks/{networkid}/producedreports/{producedreportid}/download |
| REQUEST BODY         | None                   |
| NORMAL RESPONSE CODE | 200                    |
| RESPONSE BODY        | The download CSV report       |

The downloaded reports are in a CSV format, and have a row for every impression which has been logged in the time frame of the report.

The columns of the report are

| COLUMN                   | DATATYPE                                     |
|------------------------|-------------------------------------------------|
|Network ID | Int |
|Network Name | String |
|Player ID | Int |
|Player Name | String |
|Media Asset ID | Int |
|Media Asset Name | String |
|Layout ID | Int (Nullable) |
|Layout Name | String |
|Media Window ID | Int (Nullable) |
|Media Window Name | String |
|Playlist ID | Int (Nullable) |
|Playlist Name | String |
|Playlist Media Asset ID | Int (Nullable) |
|Player References | String (Pipe delimited) |
|Media Asset References | String (Pipe delimited) |
|Layout References | String (Pipe delimited) |
|Media Window References | String (Pipe delimited) |
|Playlist References | String (Pipe delimited) |
|Playlist Media Asset References | String (Pipe delimited) |
|Start Time | Date Time |
|End Time | Date Time |
|Duration (s) | Int |
|Play Reason | String (Schedule/Interrupt) |
|End Reason | String (Schedule/Interrupt) |
|Display ID | Int |
|No Of Displays | Int |
|Logged Date | Date Time |
|Asset Url | String |