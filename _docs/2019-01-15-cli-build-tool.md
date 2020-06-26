---
layout: doc
title: CLI Build Tool
date: 2019-09-08 8:14:30 +0600
post_image: assets/images/service-icon3.png
tags: [Profile]
toc: true
---
# Signagelive Widget Builder

A complete solution to package and build a ready for distribution widget for Signagelive.

## Installation

{% highlight javascript %}
npm install signagelive-widget-builder --save-dev
{% endhighlight %}

## Overview

The Signagelive Widget Builder will simplify your development workflow, making it easier to build and package widgets for use with Signagelive. It handles the creation of the config.xml file and creation of the widget file.

## Quick Setup Guide

The Signagelive Widget Builder builds your widget based upon the information stored in package.json

1. Starting with a basic package.json (yours maybe a little different to the example), set the name, description, version, author and licence keys to values appropriate for your widget.

{% highlight json %}
{
    "name": "your-widget",
    "version": "1.0.0",
    "description": "Long description of your widget",
    "main": "index.js",
    "author": "Your company name",
    "license": "ISC",
    "devDependencies": {
        "signagelive-widget-builder": "0.0.20"
    }
}
{% endhighlight %}

2. Set the main key to the entry point for your widget (usually index.html):

{% highlight json %}
{
    "name": "your-widget",
    "version": "1.0.0",
    "description": "Long description of your widget",
    "main": "index.html",
    "author": "Your company name",
    "license": "ISC",
    "devDependencies": {
        "signagelive-widget-builder": "0.0.20"
    }
}
{% endhighlight %}

3. Add the scripts key to package.json per the example below, (this will allow you to easily build it using the CLI)

{% highlight json %}
{
    "name": "your-widget",
    "version": "1.0.0",
    "description": "Long description of your widget",
    "main": "index.html",
    "author": "Your company name",
    "license": "ISC",
    "scripts": {
        "dist": "signagelive-widget-builder"
    }
    "devDependencies": {
        "signagelive-widget-builder": "0.0.20"
    }
}
{% endhighlight %}

4. Add the widgetConfig key to package.json. This is where we start to extend package.json to include information specifically for the Signagelive Widget:

{% highlight json %}
{
    "name": "your-widget",
    "version": "1.0.0",
    "description": "Long description of your widget",
    "main": "index.html",
    "author": "Your company name",
    "license": "ISC",
    "scripts": {
        "dist": "signagelive-widget-builder"
    },
    "widgetConfig": {
    },
    "devDependencies": {
        "signagelive-widget-builder": "0.0.20"
    }
}
{% endhighlight %}

5. Set the display name of your widget, you can use either the name key in package.json or displayName key on widgetConfig.

{% highlight json %}
{
    "name": "your-widget",
    "version": "1.0.0",
    "description": "Long description of your widget",
    "main": "index.html",
    "author": "Your company name",
    "license": "ISC",
    "scripts": {
        "dist": "signagelive-widget-builder"
    },
    "widgetConfig": {
        "displayName": "You widget name here"
    },
    "devDependencies": {
        "signagelive-widget-builder": "0.0.20"
    }
}
{% endhighlight %}

6. It’s best practice to include a thumbnail of your widget that will display in the Signagelive media asset library, this can be added to the widgetConfig object:

## Usage

Running npm run dist, this will create a new folder in the root directory of your widget called dist and a versioned .wgt file.

## Widget Preferences

It is possible to include an array of preferences in your widget, please see the <a href="http://build.signagelive.com/widget-development-framework/">developer documentation</a> for more information on preference usage.

Preferences are easy to add to your widget.

1. Add a preferences key set to any empty array to the widgetConfig key

{% highlight json %}
"preferences": {
            "name": "Channel Id",
            "type": "string",
            "value": "",
            "validation": {
                "required": true
            }
        }]
{% endhighlight %}

2. Add the individual preferences (in the order you wish them to display in Signagelive) e.g.:

{% highlight json %}
"preferences": {
            "name": "Channel Id",
            "type": "string",
            "value": "",
            "validation": {
                "required": true
            }
        },
        {
            "name": "Refresh Interval",
            "type": "int",
            "value": "5",
            "validation": {
                "required": true
            }
        }]
{% endhighlight %}

You can use the following data types:

- string
- int
- float
- datetime
- colour
- boolean
- list

3. Optionally add validation to your preferences:

{% highlight json %}
"preferences": {
            "name": "Channel Id",
            "type": "string",
            "value": "",
            "validation": {
                "required": true
            }
        }]
{% endhighlight %}

You can use the following validators, please see the full <a href="http://build.signagelive.com/widget-development-framework/">developer documentation</a> for further details.

| VALIDATOR | VALUES                                                                                          | NOTES                                               |
|-----------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| readonly  | true or false                                                                                   | Can be used on any preference type                  |
| required  | true or false                                                                                   | Can be used on any preference type                  |
| pattern   | This specifies a regular expression that can be used to validate the string                     | Applies to string preference types only             |
| minlength | An integer value representing the minimum length of the string                                  | Applies to string preference types only             |
| maxlength | An integer value representing the maximum length of the string                                  | Applies to string preference types only             |
| stingtype | email, url or alphanum                                                                          | Validates that the string is the predetermined type |
| min       | An integer value representing the minimum value of the preference                               | Applies to int and float preference types only      |
| max       | An integer value representing the maximum value of the preference                               | Applies to int and float preference types only      |
| range     | A range of integer values. The format is be: [6,10], where 6 is the min value and 10 is the max | Applies to int and float preference types only      |
| set       | A pipe separated list of allowed values                                                         | Applies to list preference types only               |

## Advanced Usage

### Distinct Config Files

It is possible to specify the widget config in a seperate file, and pass this to the widget builder using the command line.

The JSON file format is the same as the widgetConfig object that can be included in the package.json file however it is possible to specify the name of the output widget file by setting a name key.

This feature is useful for using the same base widget to build multiple widgets by chaining the commands:

{% highlight json %}
"scripts": {
"dist": "signagelive-widget-builder --config=<path to config 1> && signagelive-widget-builder --config=<path to config 2>"
},
{% endhighlight %}

To pass the config file to the widget builder the format is {% highlight json %} signagelive-widget-builder --config=<path to config> {% endhighlight %}

### Themes

If you are using the same basic widget you can create theme folders to use in conjunction with the Distinct Config File feature to copy resources such as images, css, scripts etc to your widget.

All you need to do is specify a theme name on the route of the configuration object, create a themes folder with a sub folder for the theme and all resources will be copied to the root of the widget that is built.