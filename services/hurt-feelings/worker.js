import {OPTIONS} from '../../site/hurt-feelings/options.js';
export {OPTIONS};
export function validate(input) {
 if (!input || typeof input!=='object' || Array.isArray(input)) throw Error('Invalid report.');
 if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id||'')) throw Error('Invalid submission ID.');
 if (input.publicConsent!==true) throw Error('Confirm that this report may be published.');
 if (input.website) throw Error('Unable to accept this report.');
 const text=(key,max)=>{const value=input[key]??'';if(typeof value!=='string'||value.length>max)throw Error(`${key}: maximum ${max} characters.`);return value.trim();};
 const report={name:text('name',60),date:text('date',10),message:text('message',500),songConsent:input.songConsent===true,offence:input.offence};
 if(!Number.isInteger(report.offence)||report.offence<0||report.offence>10)throw Error('Choose an offence level from 0 to 10.');
 if(report.date && (!/^\d{4}-\d{2}-\d{2}$/.test(report.date)||!Number.isFinite(Date.parse(report.date))||new Date(report.date).toISOString().slice(0,10)!==report.date))throw Error('Choose a valid date.');
 for(const key of ['causes','effects','locations','preferences']){
  const selected=input[key]??[];if(!Array.isArray(selected)||selected.length>OPTIONS[key].length||selected.some(x=>!OPTIONS[key].includes(x)))throw Error(`Invalid ${key}.`);
  report[key]=[...new Set(selected)];report[key+'Other']=text(key+'Other',80);
 }
 report.verdict=text('verdict',80);report.verdictOther=text('verdictOther',80);
 if(!OPTIONS.verdicts.includes(report.verdict))throw Error('Choose a final verdict.');
 if(report.verdict==='Other'&&!report.verdictOther)throw Error('Tell us your final verdict.');
 if(!report.message&&!report.causes.length&&!report.causesOther&&!report.effects.length&&!report.effectsOther)throw Error('Choose a cause or effect, or write a message.');
 return {id:input.id,report};
}
const origins=new Set(['https://tomislavrupic.github.io','https://tomislav-rupic.com','https://www.tomislav-rupic.com','http://localhost:4173','http://127.0.0.1:4173']);
function response(data,status,origin){const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};if(origins.has(origin)){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type, Authorization';}return new Response(status===204?null:JSON.stringify(data),{status,headers});}
async function readBody(request){const reader=request.body?.getReader();if(!reader)throw Error('Missing report.');let size=0;const chunks=[];while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>12000){await reader.cancel();throw Error('Report is too large.');}chunks.push(value);}const all=new Uint8Array(size);let i=0;for(const chunk of chunks){all.set(chunk,i);i+=chunk.length;}return JSON.parse(new TextDecoder().decode(all));}
export default {async fetch(request,env){const origin=request.headers.get('Origin')||'',url=new URL(request.url),send=(data,status=200)=>response(data,status,origin);
 if(request.method==='OPTIONS')return send({},origins.has(origin)?204:403);
 try{
  if(url.pathname==='/reports'&&request.method==='GET'){
   const cursor=url.searchParams.get('before');if(cursor&&!/^\d{1,16}$/.test(cursor))return send({error:'Invalid page.'},400);
   const {results}=await env.DB.prepare('SELECT sequence,id,created_at,payload FROM reports WHERE hidden=0 AND sequence<? ORDER BY sequence DESC LIMIT 25').bind(cursor?Number(cursor):Number.MAX_SAFE_INTEGER).all();
   const visible=results.slice(0,24);return send({reports:visible.map(x=>({id:x.id,createdAt:x.created_at,...JSON.parse(x.payload)})),nextCursor:results.length>24?String(visible.at(-1).sequence):null});
  }
  if(url.pathname==='/reports'&&request.method==='POST'){
   if(!origins.has(origin))return send({error:'This form must be submitted from KitiKat Studios.'},403);
   if(!request.headers.get('Content-Type')?.includes('application/json'))return send({error:'Expected a report.'},415);
   if(env.RATE_LIMIT){const ip=request.headers.get('CF-Connecting-IP')||'local';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));const key=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');const {success}=await env.RATE_LIMIT.limit({key});if(!success)return send({error:'The void is overwhelmed. Please wait a minute before posting again.'},429);}
   let input;try{input=validate(await readBody(request));}catch(error){return send({error:error.message},400);}
   const createdAt=new Date().toISOString();const result=await env.DB.prepare('INSERT OR IGNORE INTO reports(id,created_at,payload) VALUES(?,?,?)').bind(input.id,createdAt,JSON.stringify(input.report)).run();
   return send({id:input.id,receipt:'D13-'+input.id.slice(0,8).toUpperCase(),published:true},result.meta.changes?201:200);
  }
  const remove=url.pathname.match(/^\/reports\/([0-9a-f-]{36})\/remove$/i);
  if(remove&&request.method==='POST'){
   if(!env.ADMIN_TOKEN||request.headers.get('Authorization')!==`Bearer ${env.ADMIN_TOKEN}`)return send({error:'Owner access required.'},401);
   await env.DB.prepare('UPDATE reports SET hidden=1 WHERE id=?').bind(remove[1]).run();return send({removed:true});
  }
  return send({error:'The void has no such department.'},404);
 }catch(error){console.error('Report service error',error.name);return send({error:'The void could not save this report. Please try again.'},503);}
}};
