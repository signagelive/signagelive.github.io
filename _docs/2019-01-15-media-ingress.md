---
layout: doc
title: Media Ingress to Publication
permalink: api/media-ingress
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Introduction
The core concept of Signagelive, is being able to upload media assets and publish them to players.

For this to be achievable, there is a defined process which has to be completed.

This document details that complete process, from media Ingress all the way to publishing to a player/s and why each process is done.

## Media Ingress
When a media asset is added to Signagelive, it can be done in a number of ways:

- Upload an image, video or widget
- Add a web url
- Add an IPTV stream
- Add a MRSS Feed
- Add a text only RSS Feed

When any of these are added to Signagelive, we first need to process it, to make sure that it is supported and is suitable to be used for digital signage.

We also perform a virus check on any uploaded files, and if this fails, the media asset is marked as unsupported and the file is deleted from our servers.

A thumbnail is created, so that it can be shown within the user interface, for images and videos this is done by loading the asset and taking a thumbnail. Widgets use either an included thumbnail or load the widget and take a thumbnail, web pages are always live loaded and a thumbnail taken. IPTV streams, MRSS and text only RSS feeds don’t create a specific thumbnail and a generic thumbnail is used.

With videos and images, it is also necessary to build a set of metadata about the media asset, so that it is possible to define whether the asset will play on the players it is being published to.

Once the media asset has been through the thumbnail process, it is either marked as supported or unsupported. A media asset can only be added to a playlist, used as an asset in a layout and ultimately published to a player if it has been marked as supported.

The thumbnail process is a background service, this means it doesn’t happen as soon as the media asset is uploaded, it is added to a queue which is then processed, and as Signagelive is used by many customers, this queue can be long or short depending on who else is adding media at the same time.

## Playlist / Layout Creation
Once assets are marked as supported, they can then be added to a playlist, or used as a default asset on a zone within a layout.
When using a playlist, conditional playback, recurrence and validity can be added. This will define when and where a media asset will or will not play.

## Publication
The publication process can be split down into the following stages:.
1. Publication configuration
2. Publication check
3. Publication Request processing
4. Player configuration writing
5. Player deployment

### Publication Configuration
This is the process of configuring what content should play and when. You can schedule content play: 

- As default content - when nothing else is scheduled
- Between a start and end date, using recurrence (selecting days, day parting and weekly recurrence)
- As the result of a trigger (a key press, a web trigger, local trigger or serial trigger)

Selecting which content is to be published, a single media asset, a full screen playlist or a multi zone layout, including what will be played within any schedulable zones on the layout.

Once the configuration is complete, and the players are selected, Signagelive performs a check against each of the selected players.

### Publication Check
Once the players to be published have been selected, a check is performed against each player.

This is done to make sure that the players support what is being published. The following checks are carried out: :

- Is the player expired or deactivated
- Is the configuration supported by the player - for example, does the player support interrupts, or multi zone layouts
- Does the players licence support the content to be published
- If a layout is used, does the resolution of the layout match that of the player
- Are the individual media assets supported by the player:
  - File Type
  - Codec

The list of players is returned with any warnings or errors which affect the player, most of the time, the configuration is fine for the player, so the player does not have any warnings or alerts.

Once the configuration is checked, the publication can actually be published to the players. Any players with errors as a result of the check are automatically removed from the publication.

This puts the publication into a queue to be processed. This is a global queue used by all Signagelive customers, therefore it could be a long or short queue, depending on any other publications being done by other users.

### Publish Request Processing
Once a publication is created, it is processed by a background service. This background service processes the publication against each player, and based on the supported assets and any conditional playback configuration, any unsupported content is removed and any content which should not be played on the player based on tags is removed.

Once the publication has been processed we need to write the configuration for each player.

At this point, the player will show that it no longer has all of the content required to play the content published to it, due to the new content being published.

### Player Configuration Writing
Now that we know what each player should have published to it, based on supported assets as well as conditional playback, we can write each player’s configuration.

We write the configuration in a background service, so that it is available when the player asks for it. 

While writing the configuration, we track each of the assets within the configuration, so that we know the individual files which are published to the player, and where assets are published to.

Once the configuration is written, we update a change ID and last modified date for the player. This is what the player checks every time it checks in to see if there is a higher change ID than the one it currently knows about.

### Player Content Deployment
Once a player checks in, performing a HEAD request and finds that there is an updated change ID, the full configuration file is downloaded. Once the configuration file is downloaded and parsed, the player goes through the configuration file and downloads any new media that it needs to.

As it downloads the media, it sends notifications to Signagelive to say that it has downloaded each one and the entire playlist. This is used to update the content status within Signagelive.

Once all content is downloaded, Signagelive will show the player has all of its content, and the player will start to play the new content.
It will also delete any unneeded media assets it has from previous configurations.

## Content Updating
Once content is published to players, there are a number of scenarios which will cause the players configuration to be rewritten automatically, removing the need to republish content.

### Player Changes
If you change any configuration settings for a player then the configuration will be rewritten after a save.

If you add or remove tags from a player, then the player will be added to the publish refinement queue, this is again a global queue, which means it could be long or short dependent on other users.

If you were to add or remove tags from a player, then when refining the player, the current published content will be checked against the players updated tags, and any content, which uses conditional playback, will be added or removed from the players configuration based on the updated tags.

This is an automated process and only requires the adding of tags or editing of a player to start this process.

The config is then rewritten by the config writing queue and the player change ID and last modified date updated.

### Media Asset Deletion
If you choose to trash a media asset from Signagelive, and if this is used within a Playlist, all playlists automatically have the asset removed from them, and the playlists saved. Each playlist then goes through the Playlist Changes process detailed below.
Playlist Changes
If you have published a playlist to one or more players in Signagelive, and you then edit that playlist and save the playlist, that playlist is pushed to the Publish Refinement queue.

This is a global queue, and is processed on a first come first serve basis.

When a playlist is refined by the queue processor, any players which have it published to them, are retrieved and the playlist is refined for that player. Refining the playlist will remove any unsupported assets for an individual player, remove any media assets which are not to be played based on conditional playback and remove any expired media assets based on their validity set.

Each player as it is processed is then pushed to the Player Configuration Writing queue to have its configuration rewritten.

This process is all automated by saving the playlist.

### Layout Changes
Layout changes work in the same way as playlist changes, but only if you are affecting the already existent zones.

If you add any new zones to a layout then you will need to republish the whole layout and any schedules in each of the zones.

### External Content Changes
If you use MRSS feeds then these are handled slightly differently as the players themselves do not know that these are external MRSS feeds. Once published to a player, these are regularly synchronised, to make sure that Signagelive has the latest version.

If when synchronising the feed, changes are found, Signagelive finds the players that have this feed published to them, and pushes them to the configuration writing queue, so that the config can be updated and the players will be updated with the changed content.

Text only feeds are handled directly by players, the player checks the feed every minute and will automatically update the items in the feed if new ones are added or items are removed.
