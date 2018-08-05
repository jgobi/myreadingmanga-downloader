# MyReadingManga downloader

Utility to download doujinshis from the website MyReadingManga.info.

## Installation:

1. Install NodeJS (tested in version 8) and Yarn
1. Clone this repository
2. Run `yarn` on the root folder

## Usage

From the root folder, run `node . <urls>`, where `<urls>` should be replaced by the space-separated list of the URL of the desired doujinshis from MyReadingManga.info.

The doujinshis will be downloaded to a folder with it's title. This folder will be inside of the folder `downloaded` (that will be created in the root of the repository).

### Example

`node . https://myreadingmanga.info/soratobe-enaka-yumeutsutsu-hero-academia-dj-eng/`
