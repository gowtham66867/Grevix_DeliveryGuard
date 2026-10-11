import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePlan,LIMITS} from './dist/core/engine.js';
import {interpretOpenAI} from './provider.mjs';
import {interpretLocal} from './dist/core/agent.js';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const buckets=new Map();
export function allowedOrigin(origin,host){return !origin||origin===`http://${host}`||origin===`https://${host}`;}
export function listenHost(env=process.env){return env.K_SERVICE?'0.0.0.0':'127.0.0.1';}
export function createServer(){return http.createServer(async(req,res)=>{
  const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"};
  const json=(code,data)=>{res.writeHead(code,{...headers,'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  try{
    const url=new URL(req.url,'http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/status')return json(200,{mode:process.env.OPENAI_API_KEY?'openai-structured':'local-rules',maxInputChars:LIMITS.inputChars});
    if(req.method==='POST'&&url.pathname==='/api/interpret'){
      if(!allowedOrigin(req.headers.origin,req.headers.host))return json(403,{error:'Cross-origin requests are rejected.'});
      const ip=req.socket.remoteAddress,now=Date.now();let b=buckets.get(ip);if(!b||now-b.start>60000){b={start:now,count:0};buckets.set(ip,b);}if(++b.count>10)return json(429,{error:'Limit: 10 interpretation requests per minute.'});
      if(buckets.size>1000)buckets.clear();
      let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>64000)return json(413,{error:'Request exceeds 64 KB.'});body+=chunk;}
      let data;try{data=JSON.parse(body);}catch{return json(400,{error:'Invalid JSON.'});}
      validatePlan(data.plan);if(typeof data.input!=='string'||data.input.length>LIMITS.inputChars)return json(400,{error:'Input must be at most 2,000 characters.'});
      const result=process.env.OPENAI_API_KEY?await interpretOpenAI(data.input,data.plan):interpretLocal(data.input,data.plan);
      return json(200,result);
    }
    if(req.method!=='GET')return json(405,{error:'Method not allowed.'});
    const decoded=decodeURIComponent(url.pathname),file=path.resolve(root,'.'+(decoded==='/'?'/index.html':decoded));
    if(!file.startsWith(root+path.sep))return json(403,{error:'Invalid path.'});
    const buffer=await readFile(file);res.writeHead(200,{...headers,'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(buffer);
  }catch(e){json(e.code==='ENOENT'?404:e.name==='PlanError'?400:502,{error:e.name==='PlanError'?e.message:e.code==='ENOENT'?'Not found.':'Request failed. No change was applied.'});}
});}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4310);createServer().listen(port,listenHost(),()=>console.log(`DeliveryGuard running at http://127.0.0.1:${port}`));
}
