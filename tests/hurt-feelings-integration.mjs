import assert from 'node:assert/strict';
const api=process.env.REPORTS_API||'http://127.0.0.1:8787', origin='http://localhost:4173',id=crypto.randomUUID();
const input={id,publicConsent:true,offence:7,verdict:'No hard feelings',causes:['Cat references'],message:'LOCAL TEST <script>window.pwned=true</script>',songConsent:false};
const post=()=>fetch(api+'/reports',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(input)});
const pre=await fetch(api+'/reports',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST'}});assert.equal(pre.status,204);assert.equal(pre.headers.get('access-control-allow-origin'),origin);
let r=await post();assert.equal(r.status,201);assert.equal((await r.json()).published,true);r=await post();assert.equal(r.status,200);
let wall=await (await fetch(api+'/reports')).json();assert.equal(wall.reports.filter(x=>x.id===id).length,1);assert.equal(wall.reports.find(x=>x.id===id).songConsent,false);
r=await fetch(api+'/reports/'+id+'/remove',{method:'POST'});assert.equal(r.status,401);
r=await fetch(api+'/reports/'+id+'/remove',{method:'POST',headers:{Authorization:'Bearer local-test-owner'}});assert.equal(r.status,200);wall=await(await fetch(api+'/reports')).json();assert.ok(!wall.reports.some(x=>x.id===id));console.log('Passed local D1 write/read, idempotency, CORS, consent and owner removal');
