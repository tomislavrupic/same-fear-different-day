import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const read=file=>readFileSync(path.join('_deploy',file),'utf8');
const release=JSON.parse(read('release.json'));const html=read('index.html');
for(const file of Object.values(release))assert.ok(existsSync(path.join('_deploy',file)),`Missing release file: ${file}`);
assert.ok(html.includes(`src="${release['app.js']}"`));assert.ok(html.includes(`href="${release['styles.css']}"`));
const app=read(release['app.js']);
for(const name of ['scanner.js','tracks.json','stickers/index.json'])assert.ok(app.includes(release[name]),`Unversioned dependency: ${name}`);
assert.ok(read(release['scanner.js']).includes(release['scanner-diagnosis.js']));
const products=JSON.parse(read(release['tracks.json']));assert.equal(products.filter(t=>t.kind==='scanner').length,1);assert.equal(products.filter(t=>t.trackNumber).length,11);
assert.ok(html.includes('id="scanner-dialog"'));assert.ok(read(release['styles.css']).includes('.scan-trigger'));
console.log('Passed: cache-safe release references matching scanner modules, styling, dialog, and premium catalog data.');

for(const product of products.filter(t=>t.adFile)) {
 for(const asset of [product.adFile,product.adPoster,product.coverImage]) {
  assert.ok(asset.startsWith('assets/'));
  assert.ok(existsSync(path.join('_deploy',asset)),`Missing product ad asset: ${asset}`);
 }
 assert.equal(product.kind,'product');
}

const reportHTML=read('hurt-feelings/index.html');
assert.ok(html.includes('href="hurt-feelings/"'));
for(const name of ['hurt-feelings/style.css','hurt-feelings/report.js'])assert.ok(reportHTML.includes(path.basename(release[name])));
const reportJS=read(release['hurt-feelings/report.js']);
for(const name of ['hurt-feelings/options.js','hurt-feelings/config.json'])assert.ok(reportJS.includes(path.basename(release[name])));
console.log('Passed: report page, links and fingerprinted dependencies.');

const tweeter=products.find(t=>t.id==='titty-tweeter');
assert.ok(tweeter,'Missing Titty Tweeter store item');
assert.equal(tweeter.destinationUrl,'https://tomislavrupic.github.io/Titty-Tweeter/');
assert.equal(tweeter.badgeLabel,'FREE · MACOS AUDIO UNIT');
for(const asset of [tweeter.coverImage,tweeter.introFile,tweeter.introPoster]){
 assert.ok(asset.startsWith('assets/'));
 assert.ok(existsSync(path.join('_deploy',asset)),`Missing Titty Tweeter asset: ${asset}`);
}
assert.ok(!app.includes('${introPlayer(t,true)}'),'Catalog cards must stay free of video players');
assert.ok(app.includes('${introPlayer(t)}'),'Product detail must embed the intro');
assert.ok(app.includes('controls playsinline preload="none"'),'Intro needs user-controlled playback');
console.log('Passed: Titty Tweeter packaging, product-detail intro and info/download link.');
