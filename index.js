const df = require('download-file');
const xpath = require('xpath');
const { DOMParser } = require('xmldom');
const fs = require('fs');
const isUrl = require('is-url');
const download = require('util').promisify(df);


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
		await downloadBatch(`./downloaded/${title}`, images);

		// Add a README to the destination folder
		fs.writeFileSync(`./downloaded/${title}/README.txt`, `Doujinshi downloaded from ${url} by the MyReadingManga Downloader.`, { encoding: 'utf8' });

		console.log(`\nDownload complete!`);
		console.log(`Manga saved in "./downloaded/${title}".`);
	}

	console.log("\nAll downloads complete! Good reading :)");
	process.exit(0);
})();

async function getTitleAndImages (firstURL) {
	let title;
	let next = firstURL;
	let images = [];
	do {
		await download(next, {directory: '.', filename: 'tmp.html'})
		let dom = parse(`./tmp.html`);
		if (!title) title = xpath.select("string(//head/title)", dom).split('/').join(' ');
		let result = searchDOM(dom);
		node = result.iterateNext();
		while (node) {
			images.push(node.value);
			node = result.iterateNext();
		}
		next = xpath.select('string(//head/link[contains(@rel, "next")]/@href)', dom);
	} while (next);

	fs.unlinkSync('./tmp.html');
	return { title, images };
}

function parse (file) {
	let html = fs.readFileSync(file, { encoding: 'utf8' });
	return new DOMParser().parseFromString(html);
}

function searchDOM (dom) {
	let images;
	// first attempt
	images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-lazy-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // second attempt
		images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // all failed
		throw new Error('Can\'t find manga pages in the specified URL :(');
	return images;
}

async function downloadBatch (directory, urls) {
	let total = urls.length;
	let downloaded = 0;
	let promises = [];
	console.log(`${downloaded}/${total}`);
	for (let i in urls) {
		promises.push(download(urls[i], {directory, filename: `${i}.${urls[i].split('.').pop()}`}).then(_ => console.log(`${++downloaded}/${total}`)));
	}
	return Promise.all(promises).then(_ => Promise.resolve(downloaded));
}
