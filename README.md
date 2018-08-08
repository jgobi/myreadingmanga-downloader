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