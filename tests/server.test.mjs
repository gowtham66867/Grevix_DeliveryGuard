import test from 'node:test';import assert from 'node:assert/strict';import {once} from 'node:events';
import {createServer} from '../server.mjs';import {SAMPLE_PLAN} from '../dist/core/fixtures.js';
test('HTTP boundary: static assets, validation, size limits, origin policy and rate limits',async()=>{
  const server=createServer();server.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;
  const post=body=>fetch(base+'/api/interpret',{method:'POST',headers:{'Content-Type':'application/json'},body});
  try{
    const page=await fetch(base);assert.equal(page.status,200);assert((await page.text()).includes('Keep the promise.'));assert(page.headers.get('content-security-policy').includes("script-src 'self'"));
    assert.equal((await fetch(base+'/package.json')).status,404);
    assert.equal((await fetch(base+'/%2e%2e%2fpackage.json')).status,403);
    assert.equal((await post('not-json')).status,400);
    assert.equal((await post(JSON.stringify({input:'Budget is now 58000',plan:{}}))).status,400);
    assert.equal((await post('x'.repeat(64001))).status,413);
    const cross=await fetch(base+'/api/interpret',{method:'POST',headers:{Origin:'https://untrusted.example'},body:'{}'});assert.equal(cross.status,403);
    const good=await post(JSON.stringify({input:'Budget is now 58000',plan:SAMPLE_PLAN}));assert.equal(good.status,200);assert.equal((await good.json()).status,'ready');
    assert.equal((await post(JSON.stringify({input:'x'.repeat(2001),plan:SAMPLE_PLAN}))).status,400);
    let status;for(let i=0;i<6;i++)status=(await post('{}')).status;assert.equal(status,429);
    assert.equal((await fetch(base+'/api/interpret',{method:'PUT'})).status,405);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
