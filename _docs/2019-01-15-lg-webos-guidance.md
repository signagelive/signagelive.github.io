---
layout: doc
title: LG webOS - Guidance
date: 2020-10-27 8:14:30 +0000
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# LG webOS - Guidance

## Video Support and Limitations

### Maximum supported number of concurrent videos playing using the HTML5 video tag

There is a limit to the number of concurrent videos that can be loaded and played using the HTML5 video tag concurrently - this limit is different depending on the generation of webOS panel you are using, and this has increased in more recent generations as shown below:

|                                                        | Number of supported video tags |
|--------------------------------------------------------|--------------------------------|
| webOS 1.0 and 2.0                                      | Only 1 video tag available     |
| webOS 3.0, 3.2 and 4.0 (1)                               | Upto 2 video tags              |
| webOS 4.0 and later (2)                                 | Upto 4 video tags              |

1) - webOS 4.0 with firmware version 3.xx.xx or earlier    
2) - webOS 4.0 with firmware version 4.xx.xx or later  

This limit applies to all of the content on the screen and is not restricted to just a single widget. Therefore, if you have 2 widgets scheduled in different scheduleable zones that are both set to play 1 video - if these widgets were to play at the same time then this would count as 2 video tags playing concurrently.

Equally, if you have 1 widget playing full screen but it uses 2 video tags to play 2 videos at the same time within the widget then this would count as 2 video tags being in use concurrently.

### Widget transitions and how they impact concurrent video playback

Signagelive has made every effort to ensure that transitions between widgets and other playlist media assets are as seamless as possible (see: <a href="/widget-sdk">Widget SDK</a>). In order to achieve this the Signagelive media player will attempt to pre-load the next widget asset in a playlist and then display it on screen only once it has loaded and is ready to be displayed. This significantly reduces the potential for noticeable black gaps between widget assets.

This optimization leads to a scenario that widget and content developers should be aware of where more video tags may be in use than might be expected. Consider the following cases:
A playlist is scheduled to a zone that contains 2 consecutive widgets that play video
A playlist is scheduled to a zone that contains only 1 widget that plays video and has a short asset duration

In scenario (1) when the 1st widget in the playlist is about to finish, the media player starts to pre-load the next widget. Whilst this is happening there will be a short period of time where there are actually 2 video tags in use in the content zone rather than 1:
The video tag in the first widget displaying the current video that you can see on screen
The video tag in the 2nd widget which is currently loading the next video to play, ready for when the 2nd widget is displayed on screen

Scenario (2) is identical to scenario (1) only the 1st and 2nd widgets to play just happen to be the same widget.

Similar scenarios can also arise when we have video-to-widget and widget-to-video asset transitions.

This leads to the following table that describes the number of widgets that play video that can be scheduled concurrently on LG webOS displays taking to account widget-to-widget/widget-to-video transitions.

| webOS Generation  | Number of supported video tags | Number of concurrent widget zones that can play video that do not include wgt-to-wgt/wgt-to-video transitions | Number of concurrent widget zones that can play video that do include wgt-to-wgt/wgt-to-video transitions |
|-------------------|--------------------------------|---------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| webOS 1.0 and 2.0 | 1                              | 1 (1)                                                                                                           | 1 (1)                                                                                                       |
| webOS 3.0 and 3.2 | 2                              | 1                                                                                                             | 2                                                                                                         |
| webOS 4.0 and 4.1 | 4                              | 2 (2)                                                                                                          | 4                                                                                                         |

1) - Widgets that include video playback are not recommended for use on webOS 1.0 panels. Due to extremely poor video load times playback results are poor and inconsistent. On webOS 2.0 displays this is much improved but do note that widget-to-widget transitions will not be seamless due to the 1 video tag limitation.

2) - In testing we have noticed that occasionally transitions are not ideal on webOS 4.0 when playing 2 concurrent zones that include widgets-to-widget/widget-to-video transitions. This is much better on webOS 4.1.

### What happens when you exceed the maximum number of supported video tags?

If the maximum number of supported video tags in use is exceeded at any time you may notice:
* Videos fail to play
* Flashing during transitions
* Other unexpected video playback issues

### General recommendations for best results

For the best results when working with widgets that include video playback it is recommended to ensure that you do not exceed the maximum number of supported concurrent video tags for your webOS generation.

Furthermore, it is recommended that you limit asset transitions to only those that are necessary and implement things like video looping and regular data updates within the widget as opposed to simply relying on Signagelive to regularly reload the widget.

You can reduce unnecessary asset transitions by:
* Making use of widget zones in the layout editor
* Increasing the duration of widget assets in a playlist
* Use longer videos within widgets that exceed that expected asset duration in the playlist. This can help prevent cases where the background video loops and begins to re-play the intro animation just before moving to the next asset in the playlist.

<a href="https://support.signagelive.com/hc/en-us/articles/360017833397-Limitations-for-developers-and-content-creators-when-using-videos-in-widgets-on-LG-webOS-players">Relevant Help Centre Article</a>

### Supported table regarding LG webOS and video background rendering

| webOS Series | Video Assets (Portrait)    | Apps with MP4 Background (Portrait) |
|--------------|----------------------------|-------------------------------------|
| LG 1.0       | Pre Rotated Video required | Pre Rotated Video required          |
| LG 2.0 (1)      | Pre Rotated Video required | Pre Rotated Video required          |
| LG 3.0       | Pre Rotated Video required | Portrait Video required             |
| LG 3.2       | Pre Rotated Video required | Portrait Video required             |
| LG 4.0       | Pre Rotated Video required | Portrait Video required             |
| LG 4.1       | Pre Rotated Video required | Portrait Video required             |

1) - LG 2.0 has video tearing / issues with apps when in Portrait orientation.

<a href="https://support.signagelive.com/hc/en-us/articles/360014386558-Understanding-Portrait-support-across-our-media-players">Relevant Help Centre Article</a>

## Remote Screenshots Support

<a href="https://support.signagelive.com/hc/en-us/articles/360018583678-Remote-Screenshots-Support-on-the-LG-platform-will-Remote-Screenshots-include-videos-">Relevant Help Centre Article</a>