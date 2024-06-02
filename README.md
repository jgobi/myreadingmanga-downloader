# !!! This project is not supported anymore !!!

I'm no longer supporting this project. If anyone wants to continue doing it, please feel free to do so by forking this repository. I unfortunately don't have enough spare time or motivation to keep this thing working.

## Alternative solution for horny people

For all of you who just want to download your favorite doujin from myreadingmanga, here's a tutorial on how to do it in a simpler way using a browser extension:

> This tutorial assumes you're using a Chromium-based browser, but you can follow pretty much the same instructions if you're using Firefox.

1. Install the DownThemAll extension from its website (or Chrome Web Store / Firefox Addons): https://www.downthemall.net/
1. Go to the myreadingmanga doujin page you want to download.
1. Right-click on any part of the page and then go to "DownThemAll!" > "DownThemAll!".
1. In the window just opened, go to the "Media" tab and make sure all the doujin pages are selected. You may want to deselect the unrelated stuff. A simple way to do this is use the filter option, available at the bottom of the window.
1. Set the subfolder input value to the name of the Doujin you're downloading.
1. Click download and wait for everything to finish.
1. Now repeat steps 2 to 6 for every page of the doujin.

For the filter options, I suggest setting "Quick filter" to "/images" (without quotes) and enabling the "Disable others" checkbox.

If you’re on mobile, there may be similar alternatives, especially if you use the Firefox browser, as it can install extensions (at least on Android), but I cannot help you with that.

And that’s about it. You are now allowed to be horny anytime you want :)


# MyReadingManga downloader

Utility to download doujinshis from the website MyReadingManga.info.

# How to use (method 1):

## Installation

1. Install NodeJS (tested in version 8) and Yarn
1. Clone this repository
2. Run `yarn` on the root folder

## Usage

From the root folder, run `node . <urls>`, where `<urls>` should be replaced by the space-separated list of the URL of the desired doujinshis from MyReadingManga.info.

The doujinshis will be downloaded to a folder with it's title. This folder will be inside of the folder `mrm-downloads` (that will be created in the root of the repository).

### Example

`node . https://myreadingmanga.info/soratobe-enaka-yumeutsutsu-hero-academia-dj-eng/`

# How to use (method 2)

## Installation

`$ npm i -g https://github.com/jgobi/myreadingmanga-downloader.git`

## Usage

Run `myreadingmanga-downloader <urls>`, where `<urls>` should be replaced by the space-separated list of the URL of the desired doujinshis from MyReadingManga.info.

A `mrm-downloads` folder will be created in the current directory and the doujinshis will be downloaded to a subfolder with it's title.

### Example

`$ myreadingmanga-downloader https://myreadingmanga.info/soratobe-enaka-yumeutsutsu-hero-academia-dj-eng/`
