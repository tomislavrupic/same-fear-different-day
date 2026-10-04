import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dest=path.join(root,'_deploy');
await mkdir(dest,{recursive:true});
await cp(path.join(root,'site'),dest,{recursive:true});
const versions={};
async function fingerprint(file, transform=s=>s) {
 const text=transform(await readFile(path.join(root,'site',file),'utf8'));
 const hash=createHash('sha256').update(text).digest('hex').slice(0,12);
 const parsed=path.parse(file);const name=path.join(parsed.dir,`${parsed.name}.${hash}${parsed.ext}`);
 await writeFile(path.join(dest,name),text);versions[file]=name;return name;
}
await fingerprint('scanner-diagnosis.js');
await fingerprint('scanner.js',s=>s.replace("'./scanner-diagnosis.js'",`'./${versions['scanner-diagnosis.js']}'`));
await fingerprint('tracks.json');
await fingerprint('stickers/index.json');
await fingerprint('app.js',s=>s.replace("'./scanner.js'",`'./${versions['scanner.js']}'`).replace("fetch('tracks.json')",`fetch('${versions['tracks.json']}')`).replace("fetch('stickers/index.json')",`fetch('${versions['stickers/index.json']}')`));
await fingerprint('styles.css');
const html=(await readFile(path.join(root,'site/index.html'),'utf8')).replace('href="styles.css"',`href="${versions['styles.css']}"`).replace('src="app.js"',`src="${versions['app.js']}"`);
await writeFile(path.join(dest,'index.html'),html);
await writeFile(path.join(dest,'release.json'),JSON.stringify(versions,null,2));
console.log('Built cache-safe static release:',JSON.stringify(versions));
