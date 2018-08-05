const df = require('download-file');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const isUrl = require('is-url');


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

const download = require('util').promisify(df);

function parse(file) {
	let html = fs.readFileSync(file, { encoding: 'utf8' });
	return new dom().parseFromString(html);
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

async function downloadManga(title, images) {
	let total = images.length;
	let downloaded = 0;
	let directory = './downloaded/' + title;
	let promises = [];
	console.log(`${downloaded}/${total}`);
	for (let i in images) {
		promises.push(download(images[i], {directory , filename: `${i}.jpg`}).then(_ => console.log(`${++downloaded}/${total}`)));
	}
	return Promise.all(promises).then(_ => Promise.resolve(directory));
}


(async function () {
	await download(url, { directory: "./tmp", filename: "0.html" });
	console.log('Gathering information...');
	let dom = parse('./tmp/0.html');
	let result = searchDom(dom);
	let title = xpath.select("string(//head/title)", dom).split('/').join(' ');
	let images = [];
	node = result.iterateNext();
	while (node) {
		images.push(node.value);
		node = result.iterateNext();
	}
	console.log(`Downloading "${title}"...`);
	let path = await downloadManga(title, images);
	fs.unlinkSync('./tmp/0.html');
	console.log(`Download complete!`);
	console.log(`Manga saved in "${path}".`);
})();