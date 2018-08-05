const df = require('download-file');
const xpath = require('xpath');
const { DOMParser } = require('xmldom');
const fs = require('fs');
const isUrl = require('is-url');
const download = require('util').promisify(df);


let argv = require('minimist')(process.argv.slice(2));

if (argv._.length < 1) {
	console.log('You need to pass at least one MyReadingManga.info URL as argument.',
	'The order of the arguments will determine the order of the pages.');
	process.exit(1);
}

for (let arg of argv._) {
	if (!isUrl(arg) || arg.indexOf('myreadingmanga.info') === -1) {
		console.log('All arguments must be a valid MyReadingManga.info URL.');
		process.exit(2);
	}
}

let url = argv._[0]; //"https://myreadingmanga.info/soratobe-enaka-yumeutsutsu-hero-academia-dj-eng/";


(async function main () {
	// Download html pages to extract images
	console.log('Gathering information...');
	let pageQnt = await downloadBatch('./tmp', argv._, 'html');

	// Parse downloades HTML
	console.log('\nParsing...');
	let { title, images } = getTitleAndImagesFromPages('./tmp', pageQnt);

	// Download manga pages
	console.log(`\nDownloading "${title}"...`);
	await downloadBatch(`./downloaded/${title}`, images, 'jpg');

	console.log(`\nDownload complete!`);
	console.log(`Manga saved in "./downloaded/${title}".`);
})();

function getTitleAndImagesFromPages (dir, qnt) {
	let title;
	let images = [];
	for (let i = 0; i < qnt; i++) {
		let dom = parse(`${dir}/${i}.html`);

		// get title of first html
		if (i === 0) title = xpath.select("string(//head/title)", dom).split('/').join(' ');

		let result = searchDom(dom);
		node = result.iterateNext();
		while (node) {
			images.push(node.value);
			node = result.iterateNext();
		}
	}
	return { title, images };
}

function parse(file) {
	let html = fs.readFileSync(file, { encoding: 'utf8' });
	return new DOMParser().parseFromString(html);
}

function searchDom(dom) {
	let images;
	// first attempt
	images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-lazy-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // second attempt
		images = xpath.evaluate("//div[contains(@class, 'entry-content')]//img/@data-src", dom, null, xpath.XPathResult.ANY_TYPE, null);
	if (images.nodes.length === 0) // all failed
		throw new Error('Can\'t find manga pages in the specified URL :(');
	return images;
}

async function downloadBatch (directory, urls, extension) {
	let total = urls.length;
	let downloaded = 0;
	let promises = [];
	console.log(`${downloaded}/${total}`);
	for (let i in urls) {
		promises.push(download(urls[i], {directory, filename: `${i}.${extension}`}).then(_ => console.log(`${++downloaded}/${total}`)));
	}
	return Promise.all(promises).then(_ => Promise.resolve(downloaded));
}
