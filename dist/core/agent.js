import {validatePlan,validateDisruption,recover,summary,fingerprint,LIMITS,PlanError} from './engine.js';

export function interpretLocal(input,plan){
  const clarify=reason=>({status:'clarify',disruption:null,reason,evidence:null,mode:'local-rules'});
  if(typeof input!=='string'||!input.trim())return clarify('Describe what changed.');
  if(input.length>LIMITS.inputChars)return clarify('Keep the disruption under 2,000 characters.');
  if(/ignore.{0,30}(instructions|rules|previous)|system prompt|delete|exfiltrat|api.?key|approve automatically|bypass|<script/i.test(input))return {status:'blocked',disruption:null,reason:'This input requests actions outside delivery planning. Describe a budget, deadline, or resource change.',evidence:null,mode:'local-rules'};
  const s=input.toLowerCase(),types=[];
  if(/\b(usd|eur|gbp|dollars|euros)\b|\$|€/.test(s))return clarify('This prototype supports INR only. Provide the new budget in rupees.');
  if(/budget/.test(s))types.push('budget');
  if(/deadline/.test(s))types.push('deadline');
  if(/unavailable|absent|out of office/.test(s))types.push('resource');
  if(types.length!==1)return clarify('Specify one change at a time: a new budget, a deadline day, or a resource unavailable until a day.');
  let d,evidence;
  if(types[0]==='budget'){
    const m=input.match(/budget.{0,35}?(?:to|is|now|=|:|of)\s*(?:reduced to\s*)?(?:₹|rs\.?\s*|inr\s*)?(-?\d[\d,]*(?:\.\d+)?)(k)?\b/i);
    if(!m||/\bby\b/i.test(m[0])||/\b(by|percent|%)\b/i.test(s)||s.includes('%'))return clarify('Give the new absolute budget, for example “Budget is now ₹58,000”.');
    d={type:'budget',target:'budget',value:Number(m[1].replaceAll(',',''))*(m[2]?1000:1)};evidence=m[0];
  }else if(types[0]==='deadline'){
    const m=input.match(/deadline.{0,30}?day\s*(-?\d+(?:\.\d+)?)/i);
    if(!m)return clarify('Use a working-day deadline, for example “Deadline is now day 12”. Calendar dates need a project calendar.');
    d={type:'deadline',target:'deadline',value:Number(m[1])};evidence=m[0];
  }else{
    const matches=plan.resources.filter(r=>new RegExp(`\\b${r.id}\\b`,'i').test(input)||s.includes(r.name.toLowerCase()));
    const m=input.match(/(?:until|through)\s+(?:working\s+)?day\s*(-?\d+(?:\.\d+)?)/i);
    if(matches.length!==1||!m)return clarify('Name one resource in the plan and its return day, for example “Frontend engineer unavailable until day 12”.');
    d={type:'resource',target:matches[0].id,value:Number(m[1])};evidence=m[0];
  }
  try{validateDisruption(d,plan);}catch{return clarify('The change has an invalid amount, day, or resource. Please correct it.');}
  return {status:'ready',disruption:d,reason:'Extracted an explicit change grounded in the active plan.',evidence,mode:'local-rules'};
}
export function validateInterpretation(value,input,plan){
  if(!value||!['ready','clarify','blocked'].includes(value.status)||typeof value.reason!=='string'||value.reason.length>500)throw new PlanError('INTERPRETER','Invalid interpreter response.');
  if(value.status!=='ready'){if(value.disruption!==null)throw new PlanError('INTERPRETER','Unresolved input cannot carry an executable change.');return value;}
  validateDisruption(value.disruption,plan);
  if(typeof value.evidence!=='string'||!value.evidence.length||!input.includes(value.evidence))throw new PlanError('GROUNDING','Evidence must be an exact excerpt from the user input.');
  const numbers=[...value.evidence.matchAll(/-?\d[\d,]*(?:\.\d+)?\s*k?\b/gi)].map(m=>Number(m[0].replace(/[,\s k]/gi,''))*(/k/i.test(m[0])?1000:1));
  if(!numbers.includes(value.disruption.value))throw new PlanError('GROUNDING','The proposed value must appear explicitly in the evidence.');
  const local=interpretLocal(input,plan);
  if(local.status==='blocked'||(local.status==='ready'&&JSON.stringify(local.disruption)!==JSON.stringify(value.disruption)))throw new PlanError('GROUNDING','AI interpretation conflicts with the grounded change.');
  if(/%|\bpercent|\bby\b/i.test(value.evidence))throw new PlanError('GROUNDING','Relative changes require clarification.');
  return value;
}
// Independent verification of the proposed schedule and required scope.
export function critique(candidate,baseline){
  const issues=[],rows=candidate.metrics.rows,ids=new Set(candidate.plan.tasks.map(t=>t.id));
  for(const t of baseline.tasks)if(t.required&&!ids.has(t.id))issues.push(`Required task ${t.id} is missing.`);
  for(const t of candidate.plan.tasks){
    const row=rows.find(r=>r.id===t.id),resource=candidate.plan.resources.find(r=>r.id===t.owner);
    if(!row||Math.abs(row.finish-row.start-t.days)>1e-8||row.start<resource.availableFrom)issues.push(`Invalid schedule for ${t.id}.`);
    for(const dep of t.deps){const before=rows.find(r=>r.id===dep);if(!before||!row||before.finish>row.start)issues.push(`Dependency ${dep} → ${t.id} is violated.`);}
  }
  for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++)if(rows[i].owner===rows[j].owner&&rows[i].start<rows[j].finish&&rows[j].start<rows[i].finish)issues.push(`Resource overlap: ${rows[i].id} / ${rows[j].id}.`);
  const cost=candidate.plan.tasks.reduce((s,t)=>s+t.cost,0),finish=Math.max(0,...rows.map(r=>r.finish));
  const margin=candidate.plan.revenue-cost-Math.max(0,finish-candidate.plan.deadline)*candidate.plan.latePenalty;
  if(cost!==candidate.metrics.cost||finish!==candidate.metrics.finish)issues.push('Reported metrics disagree with the task schedule.');
  if(cost>candidate.plan.budget||finish>candidate.plan.deadline||margin/Math.max(1,candidate.plan.revenue)+1e-9<candidate.plan.minMargin)issues.push('Hard business constraint fails.');
  return {passed:issues.length===0,issues,checks:['required scope','dependency order','resource capacity','cost reconciliation','deadline','margin floor'],externalFacts:candidate.verification};
}
export async function runAgent(plan,input,{profile='balanced',interpreter=null,confirmed=[],maxCandidates=LIMITS.candidates}={}){
  const trace=[];const began=performance.now();
  const event=(role,tool,status,detail)=>{if(trace.length>=LIMITS.agentSteps)throw new PlanError('STEP_LIMIT','Agent step budget exceeded.');trace.push({step:trace.length+1,role,tool,status,detail});};
  validatePlan(plan);event('Coordinator','validate_plan','passed',`${plan.tasks.length} tasks and ${plan.resources.length} resources validated; revision ${fingerprint(plan)}.`);
  const local=interpretLocal(input,plan);
  let interpretation=local;
  // Never send blocked content to a provider. Provider failure remains explicit.
  if(interpreter&&local.status!=='blocked')interpretation=validateInterpretation(await interpreter(input,plan),input,plan);
  event('Interpreter','ground_disruption',interpretation.status,interpretation.reason);
  if(interpretation.status!=='ready')return {input,status:interpretation.status,interpretation,trace,result:null,critic:null,elapsedMs:Math.round(performance.now()-began)};
  validateDisruption(interpretation.disruption,plan);event('Policy guard','validate_change','passed','Only allowlisted parameters may change; required scope cannot be deleted.');
  const result=recover(plan,interpretation.disruption,{profile,confirmed,maxCandidates});
  event('Scenario planner','simulate_counterfactual','passed',`Doing nothing finishes on day ${result.impacted.finish} at ₹${result.impacted.cost}; lateness cost ₹${result.impacted.penalty}.`);
  event('Recovery planner','enumerate_and_rank','passed',`${result.candidates.length} unique candidates; ${result.candidates.filter(c=>c.feasible).length} feasible; ${result.truncated?'bounded search truncated':'enumeration complete'}.`);
  const winner=result.candidates.find(c=>c.id===result.winnerId),critic=winner?critique(winner,plan):null;
  event('Verifier','verify_recommendation',critic?.passed?'passed':winner?'failed':'no_solution',critic?`${critic.checks.length} checks; ${critic.externalFacts.length} unresolved external facts.`:'No evaluated candidate satisfies every hard constraint.');
  if(winner&&!critic.passed)result.winnerId=null;
  event('Coordinator','request_approval','waiting',summary(critic?.passed?winner:null,result));
  return {input,status:result.winnerId?'review':'no_solution',interpretation,trace,result,critic,elapsedMs:Math.round(performance.now()-began)};
}
