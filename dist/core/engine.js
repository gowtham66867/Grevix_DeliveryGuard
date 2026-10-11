export class PlanError extends Error { constructor(code,message){super(message);this.name='PlanError';this.code=code;} }
const fail=(code,message)=>{throw new PlanError(code,message);};
const finite=(v,min,max=1e9)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const safeId=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(v)&&!['__proto__','prototype','constructor'].includes(v);
const text=v=>typeof v==='string'&&v.length>0&&v.length<=200;
const round=v=>Math.round(v*100)/100;
export const LIMITS = Object.freeze({tasks:24,resources:12,candidates:512,maxDays:365,inputChars:2000,agentSteps:8});

export function validatePlan(p){
  if(!p||typeof p!=='object'||!safeId(p.id)||!text(p.name)||p.currency!=='INR') fail('PLAN','Plan needs an ID, name and INR currency.');
  for(const k of ['budget','revenue','latePenalty']) if(!Number.isSafeInteger(p[k])||!finite(p[k],k==='revenue'?1:0)) fail('NUMBER',`${k} must be a whole rupee amount; revenue must be positive.`);
  if(!finite(p.deadline,0,LIMITS.maxDays)||!finite(p.minMargin,0,1)) fail('NUMBER','Invalid deadline or minimum margin.');
  if(!Array.isArray(p.resources)||p.resources.length<1||p.resources.length>LIMITS.resources) fail('LIMIT','Use 1–12 resources.');
  const resources=new Set();
  for(const r of p.resources){if(!safeId(r.id)||resources.has(r.id)||!text(r.name)||!finite(r.availableFrom,0,LIMITS.maxDays))fail('RESOURCE','Invalid or duplicate resource.');resources.add(r.id);}
  if(!Array.isArray(p.tasks)||!p.tasks.length||p.tasks.length>LIMITS.tasks) fail('LIMIT','Use 1–24 tasks.');
  const ids=new Set();
  for(const t of p.tasks){
    if(!safeId(t.id)||ids.has(t.id)||!text(t.name))fail('TASK','Invalid or duplicate task.');ids.add(t.id);
    if(!resources.has(t.owner)||!finite(t.days,0.25,LIMITS.maxDays)||!Number.isSafeInteger(t.cost)||!finite(t.cost,0)||!finite(t.value,0,100)||typeof t.required!=='boolean')fail('TASK',`Invalid fields in ${t.id}.`);
    if(!Array.isArray(t.deps)||new Set(t.deps).size!==t.deps.length||t.deps.includes(t.id))fail('DEPENDENCY',`Invalid dependencies in ${t.id}.`);
    if(!Array.isArray(t.alternatives)||t.alternatives.length>3)fail('LIMIT','At most three alternatives per task.');
    const alts=new Set();
    for(const a of t.alternatives){if(!safeId(a.id)||alts.has(a.id)||!text(a.name)||!resources.has(a.owner)||!finite(a.days,0.25,LIMITS.maxDays)||!Number.isSafeInteger(a.cost)||!finite(a.cost,0)||!(a.verification===null||text(a.verification)))fail('ALTERNATIVE',`Invalid alternative in ${t.id}.`);alts.add(a.id);}
  }
  for(const t of p.tasks)for(const dep of t.deps)if(!ids.has(dep))fail('DEPENDENCY',`Unknown dependency ${dep} in ${t.id}.`);
  if(!p.tasks.some(t=>t.required))fail('TASK','At least one client deliverable must be required.');
  topological(p.tasks);
  return p;
}
export function topological(tasks){
  const out=[],done=new Set();
  while(out.length<tasks.length){
    const ready=tasks.filter(t=>!done.has(t.id)&&t.deps.every(id=>done.has(id))).sort((a,b)=>Number(b.required)-Number(a.required)||a.id.localeCompare(b.id));
    if(!ready.length)fail('CYCLE','Dependency cycle detected.');
    const t=ready[0];out.push(t);done.add(t.id);
  }
  return out;
}
// Deterministic serial schedule generation. A resource handles one task at a time.
// This is a feasible heuristic, not a globally optimal RCPSP solver.
export function schedule(p){
  const free=Object.fromEntries(p.resources.map(r=>[r.id,r.availableFrom]));
  const byId={},rows=[];
  for(const t of topological(p.tasks)){
    const start=Math.max(free[t.owner],0,...t.deps.map(id=>byId[id].finish));
    const finish=round(start+t.days);free[t.owner]=finish;
    const row={id:t.id,name:t.name,owner:t.owner,start:round(start),finish,days:t.days,required:t.required};byId[t.id]=row;rows.push(row);
  }
  const finish=Math.max(0,...rows.map(t=>t.finish)),cost=p.tasks.reduce((s,t)=>s+t.cost,0);
  const lateDays=Math.max(0,finish-p.deadline),penalty=round(lateDays*p.latePenalty),margin=p.revenue-cost-penalty;
  return {rows,finish,cost,lateDays,penalty,margin,marginRate:p.revenue?margin/p.revenue:0,headroom:p.budget-cost,slack:round(p.deadline-finish)};
}
export function validateDisruption(d,p){
  if(!d||Object.keys(d).sort().join(',')!=='target,type,value')fail('DISRUPTION','Change must contain only type, target and value.');
  if(!['budget','deadline','resource'].includes(d.type)||!finite(d.value,0,d.type==='budget'?1e9:LIMITS.maxDays))fail('DISRUPTION','Unsupported change type or value.');
  if(d.type==='budget'&&(!Number.isSafeInteger(d.value)||d.target!=='budget'))fail('DISRUPTION','Budget needs a whole rupee amount and budget target.');
  if(d.type==='deadline'&&d.target!=='deadline')fail('DISRUPTION','Deadline target must be deadline.');
  if(d.type==='resource'&&!p.resources.some(r=>r.id===d.target))fail('DISRUPTION','Resource is not in this plan.');
  return d;
}
export function applyDisruption(p,d){
  validatePlan(p);validateDisruption(d,p);const next=structuredClone(p);
  if(d.type==='resource')next.resources.find(r=>r.id===d.target).availableFrom=d.value;
  else next[d.type]=d.value;
  return next;
}
function canonical(v){if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])]));return v;}
// Revision checksum catches accidental stale edits; it is not a security signature.
export function fingerprint(p){let h=2166136261;for(const ch of JSON.stringify(canonical(p))){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');}
function removalClosure(p,initial){
  const removed=new Set(initial);let change=true;
  while(change){change=false;for(const t of p.tasks)if(!removed.has(t.id)&&t.deps.some(id=>removed.has(id))){removed.add(t.id);change=true;}}
  if(p.tasks.some(t=>t.required&&removed.has(t.id)))return null;
  return removed;
}
export function evaluate(p,baseline,patch=[],verification=[]){
  const metrics=schedule(p),violations=[];
  if(metrics.cost>p.budget)violations.push({code:'BUDGET',message:`Cost exceeds budget by ₹${metrics.cost-p.budget}.`});
  if(metrics.finish>p.deadline)violations.push({code:'DEADLINE',message:`Delivery exceeds deadline by ${round(metrics.finish-p.deadline)} working days.`});
  if(metrics.marginRate+1e-9<p.minMargin)violations.push({code:'MARGIN',message:`Projected margin is below the ${round(p.minMargin*100)}% floor.`});
  const baselineValue=baseline.tasks.reduce((s,t)=>s+t.value,0),value=p.tasks.reduce((s,t)=>s+t.value,0);
  const lostValue=baselineValue?Math.max(0,(baselineValue-value)/baselineValue):0;
  const baseMetrics=schedule(baseline);
  const movement=metrics.rows.reduce((s,t)=>s+Math.abs(t.start-(baseMetrics.rows.find(b=>b.id===t.id)?.start??t.start)),0)/Math.max(1,baseline.tasks.length*baseline.deadline);
  return {metrics,violations,feasible:violations.length===0,status:violations.length?'infeasible':verification.length?'provisional':'verified',objectives:{cost:metrics.cost,change:patch.length,lostValue:round(lostValue),movement:round(movement),uncertainty:verification.length},verification:[...new Set(verification)]};
}
export const PROFILES={balanced:{cost:0.2,change:0.2,lostValue:0.35,movement:0.15,uncertainty:0.1},cost:{cost:0.65,change:0.1,lostValue:0.1,movement:0.05,uncertainty:0.1},scope:{cost:0.1,change:0.1,lostValue:0.6,movement:0.1,uncertainty:0.1}};
export function pareto(candidates){
  const feasible=candidates.filter(c=>c.feasible),keys=['cost','change','lostValue','movement','uncertainty'];
  return feasible.filter(c=>!feasible.some(o=>o!==c&&keys.every(k=>o.objectives[k]<=c.objectives[k])&&keys.some(k=>o.objectives[k]<c.objectives[k]))).map(c=>c.id);
}
export function rank(candidates,p,profile='balanced'){
  if(!PROFILES[profile])fail('PROFILE','Unknown ranking profile.');
  const weights=PROFILES[profile],frontier=new Set(pareto(candidates));
  return candidates.map(c=>({...c,frontier:frontier.has(c.id),score:round(c.objectives.cost/Math.max(1,p.budget)*weights.cost+c.objectives.change/Math.max(1,p.tasks.length)*weights.change+c.objectives.lostValue*weights.lostValue+c.objectives.movement*weights.movement+c.objectives.uncertainty/Math.max(1,p.tasks.length)*weights.uncertainty)})).sort((a,b)=>Number(b.feasible)-Number(a.feasible)||Number(b.frontier)-Number(a.frontier)||a.score-b.score||a.id.localeCompare(b.id));
}
export function recover(baseline,disruption,{profile='balanced',confirmed=[],maxCandidates=LIMITS.candidates}={}){
  if(!Number.isInteger(maxCandidates)||maxCandidates<1||maxCandidates>LIMITS.candidates)fail('LIMIT','Candidate bound must be 1–512.');
  const effective=applyDisruption(baseline,disruption),revision=fingerprint(baseline),candidates=[],seen=new Set();
  const choices=baseline.tasks.map(t=>[{kind:'keep'},...t.alternatives.map(a=>({kind:'replace',alternative:a})),...(!t.required?[{kind:'defer'}]:[])]);
  let truncated=false,visited=0;
  function visit(index,selected){
    if(visited>=maxCandidates){truncated=true;return;}
    if(index<choices.length){for(const c of choices[index]){if(visited>=maxCandidates){truncated=true;break;}visit(index+1,[...selected,c]);}return;}
    visited++;
    const removal=removalClosure(effective,effective.tasks.filter((t,i)=>selected[i].kind==='defer').map(t=>t.id));
    if(!removal)return;
    const p=structuredClone(effective),patch=[],verification=[];
    p.tasks=p.tasks.filter(t=>!removal.has(t.id));
    for(const t of effective.tasks)if(removal.has(t.id))patch.push({taskId:t.id,action:'defer',before:{owner:t.owner,days:t.days,cost:t.cost},after:null});
    effective.tasks.forEach((t,i)=>{const c=selected[i];if(c.kind!=='replace'||removal.has(t.id))return;const a=c.alternative,target=p.tasks.find(x=>x.id===t.id);patch.push({taskId:t.id,action:'replace',alternativeId:a.id,before:{owner:t.owner,days:t.days,cost:t.cost},after:{owner:a.owner,days:a.days,cost:a.cost}});Object.assign(target,{owner:a.owner,days:a.days,cost:a.cost});if(a.verification&&!confirmed.includes(a.id))verification.push(a.verification);});
    const signature=fingerprint(p);if(seen.has(signature))return;seen.add(signature);
    const label=patch.length?patch.map(x=>x.action==='defer'?`Defer ${baseline.tasks.find(t=>t.id===x.taskId).name}`:baseline.tasks.find(t=>t.id===x.taskId).alternatives.find(a=>a.id===x.alternativeId).name).join(' + '):'Keep the current approach';
    candidates.push({id:'candidate-'+signature,label,plan:p,patch,...evaluate(p,baseline,patch,verification)});
  }
  visit(0,[]);
  const ranked=rank(candidates,baseline,profile),winner=ranked.find(c=>c.feasible)??null;
  return {revision,disruption:structuredClone(disruption),profile,candidates:ranked,winnerId:winner?.id??null,visited,truncated,baseline:schedule(baseline),impacted:schedule(effective)};
}
export function approveCandidate(current,result,candidateId,{confirmed=[],approval=false}={}){
  if(!approval)fail('APPROVAL','Explicit approval is required.');
  if(fingerprint(current)!==result.revision)fail('STALE','Plan changed after evaluation. Run recovery again.');
  const fresh=recover(current,result.disruption,{profile:result.profile,confirmed});
  const candidate=fresh.candidates.find(c=>c.id===candidateId);
  if(!candidate||!candidate.feasible)fail('INFEASIBLE','Candidate is not feasible in the current plan.');
  if(candidate.verification.length)fail('VERIFICATION','Confirm external capacity and quotes before applying.');
  return {plan:structuredClone(candidate.plan),receipt:{from:result.revision,to:fingerprint(candidate.plan),candidateId,disruption:result.disruption,patch:structuredClone(candidate.patch),confirmed:[...confirmed]}};
}
export function summary(candidate,result){
  if(!candidate)return 'No evaluated option meets all hard constraints. Review the budget, deadline, or approved alternatives.';
  const m=candidate.metrics,saved=result.impacted.cost-m.cost;
  return `${candidate.label}. Deliver by working day ${m.finish}; ${Math.max(0,m.slack)} ${m.slack===1?'day':'days'} of buffer. Cost ₹${m.cost.toLocaleString('en-IN')} with ₹${m.headroom.toLocaleString('en-IN')} budget remaining${saved>0?`; save ₹${saved.toLocaleString('en-IN')} versus the disrupted plan`:''}. ${candidate.patch.length} task ${candidate.patch.length===1?'change':'changes'}. ${candidate.verification.length?'External capacity or quotes need confirmation.':'All declared constraints pass.'}`;
}
