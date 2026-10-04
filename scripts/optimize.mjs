import fs from 'node:fs/promises';
import sharp from '/Volumes/Samsung T5/2026/HAOS/Website/node_modules/sharp/lib/index.js';
const tracks=JSON.parse(await fs.readFile('site/tracks.json','utf8'));
for(const t of tracks){if(!t.sourceImage)continue;await sharp(t.sourceImage).resize(900,900,{fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(`site/assets/${t.id}.webp`);await sharp(t.sourceImage).resize(1280,720,{fit:'contain',background:'#092e53'}).jpeg({quality:92}).toFile(`site/assets/${t.id}-thumbnail.jpg`);delete t.sourceImage;}
await fs.writeFile('site/tracks.json',JSON.stringify(tracks,null,2));
await sharp('/Users/thecore/.codex/generated_images/01a105ba-a1c8-7d80-86bd-72b2d44c6d4a/exec-857140a7-4659-437e-87a9-9fc89521256f.png').resize(1800).webp({quality:85}).toFile('site/assets/hero.webp');
console.log('Optimized covers, upload thumbnails, and generated hero.');
