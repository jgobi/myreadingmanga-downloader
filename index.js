const cloudscraper = require('cloudscraper');
const xpath = require('xpath');
const { DOMParser } = require('xmldom');
const fs = require('fs');
const isUrl = require('is-url');
const mkdirp = require('mkdirp');
const path = require('path');
const basePath = './mrm-downloads';


function download (url, {directory = '.', filename = 'download'} = {}) {
	return new Promise((resolve, reject) => {
		mkdirp.sync(directory);
		return cloudscraper.get({uri: url, encoding: null}).then(bufferAsBody => {
			fs.writeFile(path.join(directory, filename), bufferAsBody, error => {
				if (error) reject(error);
				else resolve();
			})
		}).catch(error => {
			reject(error);
		});
	});
}

let argv = require('minimist')(process.argv.slice(2));

if (argv._.length < 1) {
	console.log('You need to pass at least one MyReadingManga.info URL as argument. If the manga contains more than one page, this script will automatically handle this and download these pages in order.');
	console.log('You can pass how much mangas as you want, they will be downloades sequentially.');
	process.exit(1);
}

for (let arg of argv._) {
	if (!isUrl(arg) || arg.indexOf('myreadingmanga.info') === -1) {
		console.log('All arguments must be a valid MyReadingManga.info URL.');
		process.exit(2);
	}
}


(async function main () {
	console.log(`Downloading ${argv._.length} manga${argv._.length > 1 ? 's' : ''}, please wait...\n`);

	for (let url of argv._) {
		// Download html pages and extract images
		console.log('Gathering information...');
		let { title, images } = await getTitleAndImages(url);

		// Download manga pages
		console.log(`\nDownloading "${title}"...`);
		await downloadBatch(`${basePath}/${title}`, images);

		// Add a README to the destination folder
		let dir = `${basePath}/${title}`;
		mkdirp.sync(dir);
		fs.writeFileSync(`${dir}/README.txt`, `Doujinshi downloaded from ${url} by the MyReadingManga Downloader.\n`, { encoding: 'utf8' });

		console.log(`\nDownload complete!`);
		console.log(`Manga saved in "${basePath}/${title}".`);
	}

	console.log("\nAll downloads complete! Good reading :)");
	process.exit(0);
})();

async function getTitleAndImages (firstURL) {
	let title;
	let next = firstURL;
	let images = [];
	do {
		await tryUntilResolve(this, download, next, {directory: basePath, filename: 'tmp.html'});
		let dom = parse(`${basePath}/tmp.html`);
		if (!title) title = xpath.select("string(//head/title)", dom).split('/').join(' ');
		let result = searchDOM(dom);
		node = result.iterateNext();
		while (node) {
			images.push(node.value);
			node = result.iterateNext();
		}
		next = xpath.select('string(//head/link[contains(@rel, "next")]/@href)', dom);
	} while (next);

	fs.unlinkSync(`${basePath}/tmp.html`);
	return { title, images };
}

function parse (file) {
	let html = fs.readFileSync(file, { encoding: 'utf8' });
	return new DOMParser().parseFromString(html);
}

function searchDOM (dom) {
	let images;
	// first attempt
	images = xpath.evaluate("//div[contains(@class, 'entry-content')]/div/img/@data-lazy-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // second attempt
		images = xpath.evaluate("//div[contains(@class, 'entry-content')]/div/img/@data-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // third attempt
		images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-lazy-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // forth attempt
		images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // all failed
		console.error('\nCan\'t find manga pages in the specified URL :(\n');

	return images;
}

function downloadBatch (directory, urls) {
	let total = urls.length;
	let downloaded = 0;
	let promises = [];
	console.log(`${downloaded}/${total}`);
	for (let i in urls) {
		promises.push(tryUntilResolve(this, download, urls[i], {directory, filename: `${i}.${urls[i].split('.').pop()}`}).then(_ => console.log(`${++downloaded}/${total}`)));
	}
	return Promise.all(promises).then(_ => Promise.resolve(downloaded));
}

function tryUntilResolve (thisArg, fn, ...args) {
	return new Promise(resolve => {
		(function trying () {
			fn.apply(thisArg, args).then(resolve, _ => {
				console.log('Network error, retrying...');
				setTimeout(trying, 500);
			});
		})();
	});
}

