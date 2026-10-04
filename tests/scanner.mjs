import assert from 'node:assert/strict';
import { createDiagnosis } from '../site/scanner-diagnosis.js';
const counts={d13:0,contamination:0,human:0};
for(let slot=0;slot<13;slot++) {const result=createDiagnosis(()=> (slot+.5)/13);counts[result.kind]++;assert.ok(result.brainRot>=0&&result.brainRot<=100);assert.ok(result.confusion>=0&&result.confusion<=100);}
assert.deepEqual(counts,{d13:1,contamination:4,human:8});
assert.equal(createDiagnosis(()=>0).brainRot,0);assert.equal(createDiagnosis(()=>.999999).brainRot,100);
// Exercise the actual scanner controller with a DOM/timer fixture, without controlling a browser.
class Element {
 constructor(){this.listeners={};this.children=[];this.hidden=false;this.innerHTML='';this.textContent='';this.open=false;this.value=0;}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
 fire(name){for(const fn of this.listeners[name]||[])fn();}
 setAttribute(name,value){this[name]=value;}
 append(child){this.children.push(child);}
 focus(){this.focused=true;}
 showModal(){this.open=true;}
 close(){if(!this.open)return;this.open=false;this.fire('close');}
}
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
let bodyLocked=false;globalThis.document={querySelector:el,createElement:()=>new Element(),body:{classList:{add(){bodyLocked=true;},remove(){bodyLocked=false;}}}};
let stored=0;globalThis.localStorage={getItem:()=>stored,setItem:(k,v)=>{stored=Number(v);}};
globalThis.location={hash:'',pathname:'/',search:''};globalThis.history={replaceState:(a,b,url)=>{location.hash=url.startsWith('#')?url:'';}};
globalThis.matchMedia=()=>({matches:false});
const realSetTimeout=globalThis.setTimeout,realClearTimeout=globalThis.clearTimeout;
let time=0,nextId=1;const jobs=new Map();globalThis.setTimeout=(fn,delay)=>{const id=nextId++;jobs.set(id,{fn,at:time+delay});return id;};globalThis.clearTimeout=id=>jobs.delete(id);
function advance(ms){const end=time+ms;for(;;){const due=[...jobs].filter(([,job])=>job.at<=end).sort((a,b)=>a[1].at-b[1].at);if(!due.length)break;const [id,job]=due[0];jobs.delete(id);time=job.at;job.fn();}time=end;}
const {openScanner}=await import('../site/scanner.js');
openScanner();assert.ok(el('#scanner-dialog').open);assert.ok(bodyLocked);assert.equal(stored,1);
advance(5100);assert.equal(el('#scan-progress').value,99);assert.ok(el('#scan-results').hidden);
advance(850);assert.match(el('#scan-status').textContent,/99%/);assert.ok(el('#scan-results').hidden);
const originalRandom=Math.random;
for(const [roll,expected] of [[.8,'PROBABLY HUMAN'],[.15,'SEVERE LLM CONTAMINATION'],[.01,'ERROR D13']]){
 if(stored>1)openScanner();Math.random=()=>roll;advance(8000);assert.equal(el('#scan-progress').value,100);assert.ok(!el('#scan-results').hidden);assert.ok(el('#scan-results').innerHTML.includes(expected));el('#scan-blame').fire('click');assert.ok(el('#scan-blame-message').textContent.length>0);el('#scan-again').fire('click');assert.ok(el('#scan-results').hidden);
}
el('#scanner-dialog').close();const stopped=el('#scan-progress').value;advance(10000);assert.equal(el('#scan-progress').value,stopped);assert.equal(jobs.size,0);assert.ok(!bodyLocked);assert.equal(location.hash,'');
Math.random=originalRandom;globalThis.setTimeout=realSetTimeout;globalThis.clearTimeout=realClearTimeout;
console.log('Passed: exact 1-in-13 D13 probability, metric bounds, 99% pause, all outcomes, repeat scans, close cancellation and scroll cleanup.');
