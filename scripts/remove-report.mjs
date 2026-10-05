import {readFile} from 'node:fs/promises';
const id=process.argv[2];if(!/^[0-9a-f-]{36}$/i.test(id||''))throw Error('Usage: node scripts/remove-report.mjs REPORT_UUID');
const {apiUrl}=JSON.parse(await readFile(new URL('../site/hurt-feelings/config.json',import.meta.url),'utf8'));
const token=(await readFile(new URL('../.hurt-feelings-admin-token',import.meta.url),'utf8')).trim();
const response=await fetch(apiUrl+'/reports/'+id+'/remove',{method:'POST',headers:{Authorization:'Bearer '+token}});if(!response.ok)throw Error('Removal failed: '+response.status);console.log('Report removed from the public wall.');
