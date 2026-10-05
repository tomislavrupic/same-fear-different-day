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
const products=JSON.parse(read(release['tracks.json']));assert.equal(products.filter(t=>t.kind==='scanner').length,1);assert.equal(products.filter(t=>t.trackNumber).length,8);
assert.ok(html.includes('id="scanner-dialog"'));assert.ok(read(release['styles.css']).includes('.scan-trigger'));
console.log('Passed: cache-safe release references matching scanner modules, styling, dialog, and premium catalog data.');

for(const product of products.filter(t=>t.adFile)) {
 for(const asset of [product.adFile,product.adPoster,product.coverImage]) {
  assert.ok(asset.startsWith('assets/'));
  assert.ok(existsSync(path.join('_deploy',asset)),`Missing product ad asset: ${asset}`);
 }
 assert.equal(product.kind,'product');
}
