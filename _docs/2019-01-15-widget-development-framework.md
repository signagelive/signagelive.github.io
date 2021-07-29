---
layout: doc
title: Widget Development Framework
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Widget SDK, WDF, Developer]
toc: true
---

# Introduction

## What is a widget?

A Signagelive Widget is a packaged web application format that extends the W3C Widget specification.

The widget file is simply a zip archive that has been renamed to have a .wgt extension. The archive contains all of the files required to display the widget content on screen, e.g. the javascript, CSS, static media (images/video/audio), fonts and HTML, as well as a configuration file, detailing how the widget should load and behave when used within Signagelive.

The advantage of a widget over simply hosting the content on a remote web server is that the content will be served from the internal storage of the media player. This will reduce load times and ensures that content still displays in the event of a network interruption.

## Structure

A widget is simply a zip archive with a .wgt extension.

Within the widget, at the root of the file structure there must be the widget configuration file (config.xml) and it’s best practice to also include the start page of the widget in the root (usually index.html). From there it’s up to you where you place javascript, css, fonts etc however we recommend the following file and folder structure:

- /scripts
- /css
- /media
- /fonts
- /data
- /index.html
- /config.xml

We recommend that all static content, that is critical to the widget, is included within the widget archive (i.e. libraries such as jquery etc or images/videos that do not change). Rather than remotely loaded, so that you can ensure your content plays, even if a network connection is not available, or remote servers are down.

The configuration file allows you to specify a number of things about the widget, detailed in the "Configuration" section.

## Configuration

The widget configuration file is simply an XML file. The configuration file contains the name of the widget, the version, a description and the html page to first load and optionally preferences that can be loaded by the widget.

Preferences can be edited within the Signagelive UI and can be used to set text to display, colours of elements, postal codes for dynamically retrieving location aware data, API keys, or any data that is dynamic and should not be hard coded. It is not essential that you use preferences however they will make your widget more flexible.

The preference element from the W3C specification has been extended, to allow developers to set data types and validation rules, that are used when the widget transitions through Signagelive.

It is also possible to set the widget to not download to clients and always run online. This is useful if you are attempting to display content within an iframe in the widget, as that is disabled by many browsers when running the code locally due to security restrictions. Typically widgets that utilise this feature require the internet to operate so hosting the entire widget online will not cause any stability problems, for example our YouTube and IBM Cloud Video (Ustream) widgets make use of this feature.

## Configuration File Elements

| Element (XPath)     | Description | Required |
|------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| /widget             | This is the root element of the document and contains several optional attributes: id – an IRI which acts as an identifier for the widget version – The version of the widget. Note that in the specification this attribute is an arbitrary string – "2.0" is not ‘greater’ than "1.0", it is just different. width – The width that the widget should be displayed at. height – The height that the widget should be displayed at.                                                                                                                                                                                                                                                                                                                                                   | Yes                                                                               |
| /widget/name        | The name of the widget that will be displayed in the Signagelive CMS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Yes                                                                               |
| /widget/description | The description of the widget that will be displayed in future versions of the Signagelive CMS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | No                                                                                |
| /widget/author      | The author of the widget that will be display in future versions of the Signagelive CMS. You can optionally add the author webpage and email address with the attributes: href – This should be an IRI associated with the author e.g. a website. email – The author’s email address.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | No                                                                                |
| /widget/license     | The license of the widget that will be displayed in future versions of the Signagelive CMS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | No                                                                                |
| /widget/content     | This element is used by the author to specify a custom start file for the widget src – (required) The path to the start file within the widget archive relative to the root of the widget If this element is not specified then the following values will be used to try to start the widget, note that IAdea players only support index.html: index.html index.htm index.svg index.xhtml index.xht                                                                                                                                                                                                                                                                                                                                                                                    | Yes                                                                               |
| /widget/icon        | This represents an icon for the widget. src – (required) This is a path the points to the icon file within the widget package. It is possible to have different thumbnails for the asset library and asset preview by using the sl:thumbnail attribute and setting it to small or large respectively. You can therefore have up to 2 icons included in your widget                                                                                                                                                                                                                                                                                                                                                                                                                     | No but it is recommended otherwise Signagelive will attempt to generate a preview |
| /widget/preference  | It is possible to include an unlimited number of preferences within a widget. These are displayed in the Signagelive User Interface and can be editted by the end user. By default, all preferences are treated as strings. In order to give users a better experience when configuring widgets, we have extended the specification so that developers may specify the data type of each preference using the ‘type’ attribute. To use the type attributes, the namespace definition xmlns:sl="http://www.signagelive.com/widgets"  must be added to the config.xml file (See below for possible data types). We have also made it possible to add custom validation to preferences, using a set of custom attributes also within the sl namespace. (See below for validation options) | No                                                                                |
| /widget/sl:offline  | If you wish the widget to download and execute from the player then you can omit this element, however if you are displaying content within an iframe in the widget, then you may run into security restrictions within the browser, as you are loading remote content from the local disk. If this is the case then you can set the widget to be hosted (Signagelive will automatically handle this) by setting the supported attribute of this element to false.                                                                                                                                                                                                                                                                                                                     | No                                                                                |

## Preference Configuration

The following attributes can be used to provide an improved user experience when configuring widgets within Signagelive.

Note that each preference must have a unique name.

| Attribute     | Possible Values                                                                                 | Notes                                                                                                                                                                                                                                                    |
|---------------|-------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| sl:type       | string Int float datetime colour boolean list                                                   | Datetimes must be ISO 8601 date strings e.g. 2015-01-13T23:01:22Z Colours must be hex colour codes e.g. #0099CC or ‘transparent’ Boolean values will be "true" or "false"                                                                                |
| sl:required   | true false                                                                                      | Can be used on any preference type                                                                                                                                                                                                                       |
| sl:readonly   | true false                                                                                      | Can be used on any preference type                                                                                                                                                                                                                       |
| sl:pattern    | This specifies a regular expression that can be used to validate the string                     | Applies to string preference types only                                                                                                                                                                                                                  |
| sl:minlength  | An integer value representing the minimum length of the string                                  | Applies to string preference types only                                                                                                                                                                                                                  |
| sl:maxlength  | An integer value representing the maximum length of the string                                  | Applies to string preference types only                                                                                                                                                                                                                  |
| sl:stringtype | email url alphanum                                                                              | Validates that the string is a predetermined type: email – Validates that the string is an email address url – Validates that the string is a url alphanum – Validates that the string is an alphanumeric string Applies to string preference types only |
| sl:min        | An integer value representing the minimum value of the preference                               | Applies to int and float preference types only                                                                                                                                                                                                           |
| sl:max        | An integer value representing the maximum value of the preference                               | Applies to int and float preference types only                                                                                                                                                                                                           |
| sl:range      | A range of integer values. The format is be: [6,10], where 6 is the min value and 10 is the max | Applies to int and float preference types only                                                                                                                                                                                                           |
| sl:set        | A pipe separated list of allowed values e.g. "Item 1\|Item 2\|Item 3"                           | Applies to list preference types only                                                                                                                                                                                                                    |

## Player specific preference data

It is possible to have the Signagelive CMS automatically inject player data into your widget preferences that can be used in your widget, for example the postal code can be used to retrieve location specific weather.

Note that these placeholders are only valid values for preferences of type string.

To use them the name of the preference must match an item in the table below, and Signagelive will automatically inject the relevant data.

See code examples for an example.

| Preference Name | Player Information   |
|-----------------|----------------------|
| {!serialno}     | Player serial number |
| {tradename}     | Description          |
| {address1}      | Address Line 1       |
| {address2}      | Address Line 2       |
| {town}          | City                 |
| {county}        | County               |
| {postcode}      | Postcode             |
| {country}       | Country              |
| {refcode1}      | Reference Code 1     |
| {refcode2}      | Reference Code 2     |
| {refcode3}      | Reference Code 3     |

## Configuration Examples

### Basic Configuration

{% highlight xml %}
<?xml version="1.0"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:sl="http://www.signagelive.com/widgets" id="http://www.signagelive.com/samplewidget" version="0.0.1" width="1920" height="1080" >
    <!-- Name of the widget displayed in Signagelive as the name of the Media Asset -->
    <name>Simple Example</name>    
    <description>A simple widget </description>
    <!-- Widget author -->
    <author>Signagelive Limited</author>
    <!-- Start page for widget -->
    <content src="index.html" />
    <!-- Icons to display in Signagelive, not essential as Signagelive will attempt to generate a preview if these are omitted -->
    <icon src="images/thumb.jpg" sl:thumbnail="large" />
    <icon src="images/thumb.jpg" sl:thumbnail="small" />
    <!--Preferences (Optional)-->
    <preference name="Text" value="Hello World" sl:type="string" sl:required="true" />
    <preference name="Text Colour" value="#ffffff" sl:type="colour" sl:required="true" />     
</widget>
{% endhighlight %}

### Prevent Widget from Running Locally

{% highlight xml %}
<?xml version="1.0"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:sl="http://www.signagelive.com/widgets" id="http://www.signagelive.com/samplewidget" version="0.0.1" width="1920" height="1080" >
    <!-- Name of the widget displayed in Signagelive as the name of the Media Asset -->
    <name>Simple Example</name>    
    <description>A simple widget </description>
    <!-- Widget author -->
    <author>Signagelive Limited</author>
    <!-- Start page for widget -->
    <content src="index.html" />
    <!-- Icons to display in Signagelive, not essential as Signagelive will attempt to generate a preview if these are omitted -->
    <icon src="images/thumb.jpg" sl:thumbnail="large" />
    <icon src="images/thumb.jpg" sl:thumbnail="small" />
    <!--Preferences (Optional)-->
    <preference name="Text" value="Hello World" sl:type="string" sl:required="true" />
    <preference name="Text Colour" value="#ffffff" sl:type="colour" sl:required="true" />
    <!--Ensure Widget is served not downloaded -->
    <sl:offline supported="false" />     
</widget>
{% endhighlight %}

### Preference Usage

{% highlight xml %}
<?xml version="1.0"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:sl="http://www.signagelive.com/widgets" id="http://www.signagelive.com/preferenceexample" version="0.0.1" width="1920" height="1080">
  <!-- Name of the widget -->
  <name>Preferences Example</name>
  <!-- Description is shown when installing widget -->
  <description>Example of all preference types and validation values</description>
 <!-- Widget author -->
  <author>Signagelive </author>
  <preference name="Boolean" value="True" sl:type="boolean" />
  <preference name="Boolean Required" value="True" sl:type="boolean" sl:required="true" />
  <preference name="Boolean Read Only" value="True" sl:type="boolean" sl:readonly="true" />
  <preference name="Colour" value="#0000ff" sl:type="colour" />
  <preference name="Colour Required" value="#0000ff" sl:type="colour" sl:required="true" />
  <preference name="Colour Read Only" value="#0000ff" sl:type="colour" sl:readonly="true" />
  <preference name="DateTime" value="2015-03-13T12:47:29Z" sl:type="datetime" />
  <preference name="DateTime Required" value="2015-03-13T12:47:29Z" sl:type="datetime" sl:required="true" />
  <preference name="DateTime Read Only" value="2015-03-13T12:47:29Z" sl:type="datetime" sl:readonly="true" />
  <preference name="Float" value="0.214" sl:type="float" />
  <preference name="Float Required" value="0.214" sl:type="float" sl:required="true" />
  <preference name="Float Read Only" value="0.214" sl:type="float" sl:readonly="true" />
  <preference name="Float Min Only (5)" value="0.214" sl:type="float" sl:min="5" />
  <preference name="Float Max Only (17)" value="0.214" sl:type="float" sl:max="17" />
  <preference name="Float Min/Max (5,17)" value="0.214" sl:type="float" sl:min="5" sl:max="17" />
  <preference name="Float Range [5,17]" value="0.214" sl:type="float" sl:range="[5,17]" />
  <preference name="Int" value="13" sl:type="int" />
  <preference name="Int Required" value="13" sl:type="int" sl:required="true" />
  <preference name="Int ReadOnly" value="13" sl:type="int" sl:readonly="true" />
  <preference name="Int Min Only (5)" value="13" sl:type="int" sl:min="5" />
  <preference name="Int Max Only (17)" value="13" sl:type="int" sl:max="17" />
  <preference name="Int Min/Max (5,17)" value="13" sl:type="int" sl:min="5" sl:max="17" />
  <preference name="Int Range [5,17]" value="13" sl:type="int" sl:range="[5,17]" />
  <preference name="List" value="Orange" sl:type="list" sl:set="Apple|Orange|Pear" />
  <preference name="List Required" value="Orange" sl:type="list" sl:set="Apple|Orange|Pear" sl:required="true" />
  <preference name="List ReadOnly" value="Orange" sl:type="list" sl:set="Apple|Orange|Pear" sl:readonly="true" />
  <preference name="String" value="Hello World" sl:type="string" />
  <preference name="String Required" value="Hello World" sl:type="string" sl:required="true" />
  <preference name="String Read Only" value="Hello World" sl:type="string" sl:readonly="true" />
  <preference name="String Min Length (5)" value="Hello World" sl:type="string" sl:minlength="5" />
  <preference name="String Max Length (17)" value="Hello World" sl:type="string" sl:maxlength="17" />
  <preference name="String Min/Max Length (5,17)" value="Hello World" sl:type="string" sl:minlength="5" sl:maxlength="17" />
  <preference name="String RegEx (Case insensitve match only a-z)" value="HelloWorld" sl:type="string" sl:pattern="^[A-z]+$" />
  <preference name="Email" value="test@test.com" sl:type="string" sl:stringtype="email" />
  <preference name="URL" value="http://www.signagelive.com" sl:type="string" sl:stringtype="url" />
  <preference name="Alnum" value="135f5" sl:type="string" sl:stringtype="alphanum" />
  <!-- Start page for widget -->
  <content src="index.html" />
  <!-- Default icon for widget -->
  <icon src="thumb-large.jpg" sl:thumbnail="large" />
  <icon src="thumb-small.jpg" sl:thumbnail="small" />
</widget>
{% endhighlight %}

# Developing Widgets

To build a widget you can use any HTML5 authoring tool you wish ranging from notepad through to Adobe Animate, as long as you end up with a working web application that can run from the file system it does not matter how you build it. Internally at Signagelive we use Adobe Animate to generate animations that utilise the HTML5 canvas and Visual Studio Code, or Sublime Text to build write custom code.

Within your widget you can include any javascript libraries you wish, however we recommend that they are embedded into the widget and not remotely loaded, so the widget plays correctly in all circumstances.

We recommend that you test your development either using a web server or Firefox if running locally. (Note that Chrome does not support loading the config file from the file system unless you start Chrome with the –allow-file-access-from-file flag).

## Third Party Tools

There is no right or wrong way to create your widgets and we recommend you utilise the workflows and tools that you are familiar with for creation of web content, however we have used the following tools internally which may give you some guidance and / or ideas of things to try.

### Adobe Animate

Adobe Animate will not create a completed widget for you, but will generate high quality animations that you can incorporate into Widgets.

Adobe Animate targets the HTML5 Canvas and exports code that utilised the <a target="_blank" href="https://createjs.com/">CreateJS</a> library.

Whilst there are many experiences that can be achieved with Adobe Animate, we have found that traditional timeline (looping) based animations, and dynamic animations that can be controlled by external data source/events are particularly easy to develop.

For clarity;

Traditional timeline (looping) animations are those that are not controlled by a process external to the animation and just run e.g. a menu board may have text elements that highlight when it’s product image is in view, or there maybe background animations, to add that little bit of visual interest to your widget
Dynamic animations are those that can be controlled by a third party process, for example in a Queue Management System, the animation effect of the ticket being added to the queue and subsequently called forwards needs to be created in Animate but then triggered based on data.
We recommend following the following best practice within Adobe Animate:

Develop the full experience in Adobe Animate first, for example if you have elements you wish to animate in some way, perform the complete animation in Animate. This will generate all of the code that you can deconstruct and control in your own widget, such as size, position, rotation and timings etc. Note you will need to edit the output from Animate, so an understanding of CreateJS is essential to remove animations from the timeline, if you are controlling them based upon events.
Ensure that you utilise layers and keep background, and elements in their own layers – again there is no right or wrong but it will help to keep your animation easy to maintain
Use consistent naming conventions for elements, especially if you wish to data bind those e.g. Product1Name, Product1Price, Product2Name, Product2Price etc.
Use consistent naming conventions for static elements that are present across multiple widgets e.g. we call all of our background images "background.jpg"
Use Web Fonts if possible
A walk through for converting an Adobe Animate will be published soon

## Signagelive Widget SDK

The Signagelive Widget SDK is intended to provide Signagelive widget developers with additional capabilities beyond the standard APIs available to all web applications.

Documentation regarding the supported features and players is available <a href="/widget-sdk">here</a>.

## Code Examples

We have created some samples to help you get started, that demonstrate the basic structure of a widget and how to load and use configuration preferences.

| Example                                                                       | Link                                                         |
|-------------------------------------------------------------------------------|--------------------------------------------------------------|
| Simple widget template using plain javascript to load and the config file     | https://github.com/signagelive/widget-simple-template        |
| Simple widget template using RequireJS and JQuery to load and the config file | https://github.com/signagelive/widget-simple-with-libraries  |
| Example of how to use all preferences                                         | https://github.com/signagelive/widget-preferences-example    |
| Widget that uses properties from the media player                             | https://github.com/signagelive/widget-with-player-properties |
| Adobe Animate base widget                                                     | https://github.com/signagelive/widget-with-adobe-animate     |

## Packaging

Packaging a widget for use in Signagelive is really simple:

1. Zip up all content that is required for the widget to run, ensuring the config.xml file is at the root of the widget and the start file is correctly specified
2. Change the extension of the zip file to wgt
3. Done – upload to Signagelive and use!

We are working on a command line module, that will be available via NPM, that will handle packaging and creation of the config.xml file for you.

## Things to Consider

<h3 class="no_toc"> Performance </h3>

Performance particularly animation varies across platforms, so it is again imperative you test on the target platform as part of your development process. Don’t rely on simply tested in a desktop browser as results can vary quite widely those experienced on media players.

It will be essential to include a polyfile to request AnimateFrame in your code if you require this function as it is not available on all platforms.

<h3 class="no_toc"> Fonts </h3>

It is best practice to embed fonts in your widget so that they always load and your widget displays correctly even when network connectivity is lost.

<a target="_blank" href="https://www.fontsquirrel.com/tools/webfont-generator">FontSquirrel</a> have a really useful web font generator that will generate all the fonts and CSS you require. We recommend using the following settings:

- Select all font formats (TrueType, WOFF, WOFF2, SVG, EOT Lite and EOT Compressed)
- In the CSS section Base64 Encode your font

FontSquirrel will generate a zip file that contains all the converted fonts and the CSS to include in your project. Add those to your widget and use them as any other web font – ensure you include them in your widget package.

<h3 class="no_toc"> Content Security Policy </h3>

In order to help keep Widgets you develop secure Widgets should adhere to the general concept <a target="_blank" href="https://w3c.github.io/webappsec-csp/">Content Security Policy (CSP)</a>. One key item of note is that inline code is not permitted as this will not run on many of our players.
See this <a target="_blank" href="https://developer.chrome.com/extensions/contentSecurityPolicy#JSExecution">documentation</a> from Google detailing inline script restrictions within ChromeOS for further details.

<h3 class="no_toc"> ES6 </h3>

Due to the wide variety of vendor platforms supported by Signagelive it is not possible to have consistent support for the latest standards across them, so we recommend you test your widgets on as many platforms as possible and include polyfills for any ES6 features you are using.

For an overview of ES6 features please see <a target="_blank" href="http://es6-features.org/">this</a> great resource. Don’t rely on simply testing in a desktop browser as results can vary quite widely to those obtained when running on a  media player.

We have found <a target="_blank" href="https://github.com/paulmillr/es6-shim">ES6 Shim</a> to be a useful shim if you need to use ES6 features in your code. However there may be situations we have not come across that don’t work so please test it for your specific use case before deploying your widget.

<h3 class="no_toc"> File System </h3>

The file systems our media players, like many web servers (all except those on Windows) are case sensitive, as many of them are based on Linux, so please make sure you use the right case when referencing files in your widget.

Please make sure that all references to local files are properly formed relative paths.

<h3 class="no_toc"> Tizen 2.4 </h3>

Tizen 2.4 does not support the usage of the ‘JSON’ response type in XMLHTTPRequests, there have been occasions where the panel instead of returning an object, returns a blank string instead. 

A workaround for this is to instead parse the response into JSON after it has returned.

## Windows Applications

In addition to packaging standalone web applications it is possible to package Windows Applications within Widgets.

This is only supported on the new range of Windows Media Players running the "Electron Client" - contact us if you are not sure.

The executable files will run for the duration specified in the playlist. Using them as a default asset in zones is not recommended as they will restart every 10 seconds. If the executable file is closed or crashes, the Signagelive client will restart it. Signagelive cannot control the size or position of the application window, this is the responsibility of the application developer.

The packaging process is very similar to packaging a web application the only difference being that the EXE needs to be specified in the src attribute of the content element e.g.

{% highlight xml %}
<?xml version="1.0"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:sl="http://www.signagelive.com/widgets" id="http://www.signagelive.com/samplewidget" version="0.0.1" width="1920" height="1080" >
    <!-- Name of the widget displayed in Signagelive as the name of the Media Asset -->
    <name>Simple Example</name>    
    <description>A simple widget </description>
    <!-- Widget author -->
    <author>Signagelive Limited</author>
    <!-- Start page for widget -->
    <content src="application.exe" />
    <!-- Icons to display in Signagelive, not essential as Signagelive will attempt to generate a preview if these are omitted -->
    <icon src="images/thumb.jpg" sl:thumbnail="large" />
    <icon src="images/thumb.jpg" sl:thumbnail="small" />
    <!--Preferences (Optional)-->
    <preference name="Text" value="Hello World" sl:type="string" sl:required="true" />
    <preference name="Text Colour" value="#ffffff" sl:type="colour" sl:required="true" />     
</widget>
{% endhighlight %}

Please note that any dependent resources either need to be packaged with the widget and referenced using relative paths or pre-installed on the target players (Signagelive does not manage this process).

## FAQs

| Question                                                                          | Answer                                                                                                                                                                                                                                                                                               |
|-----------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Where can I find code samples to help me get started?                             | Please see our GitHub page for code samples – https://github.com/orgs/signagelive                                                                                                                                                                                                                    |
| Do you have to use the code samples / templates to create widgets                 | No you are free to create your widget in anyway you wish, the examples are purely to help you along the way                                                                                                                                                                                          |
| Do I have to include a config.xml file                                            | Yes this is required to use within Signagelive as it tells Signagelive how to start the widget and includes any preferences you have added                                                                                                                                                           |
| Is there a prefered IDE to use?                                                   | No as long as you end up with a working web application that can run from the file system it does not matter how you build it. Internally at Signagelive we use Adobe Animate to generate animations that utilise the HTML5 canvas and Visual Studio Code or Sublime Text to build write custom code |
| Do you have to use Adobe Animate to create widgets?                               | No you are free to create your widget in anyway you wish, the examples are purely to help you along the way                                                                                                                                                                                          |
| Do you have to use Adobe Animate if you wish to include animations in the widget? | No, Adobe Animate is a great tool for creating animations. However it essentially generates code based on <a target="_blank" href="https://createjs.com/">CreateJS</a>, which is just a nice wrapper libraries around HTML5 APIs, you can roll your own or use alternative libraries.                                                                    |
| What can I build with widgets?                                                    | Anything you like as long as it can be developed as a web application and run locally from the file system on the media player.                                                                                                                                                                      |
| Can I build touch aware applications?                                             | Yes absolutely                                                                                                                                                                                                                                                                                       |
| Can I build 1 widget and have it dynamically get local data?                      | Yes, we have a set of reserved values for widget preferences, that will automatically inject player specific information in such as the postal code, or location/store id. You can then call an API with that data and return location specific information for display.                             |