import {validatePlan,evaluate,fingerprint} from './engine.js';

// Declared what-if shocks, never probabilities or a global robustness proof.
export const STRESS_CASES=Object.freeze([
  {id:'cost',name:'Delivery costs +10%',cost:1.1,days:0,release:0},
  {id:'duration',name:'Every task takes 1 extra day',cost:1,days:1,release:0},
  {id:'capacity',name:'Every resource starts 2 days later',cost:1,days:0,release:2},
  {id:'combined',name:'All three shocks together',cost:1.1,days:1,release:2},
]);
export function stressTest(candidate){
  validatePlan(candidate.plan);
  return STRESS_CASES.map(shock=>{
    const plan=structuredClone(candidate.plan);
    for(const task of plan.tasks){task.cost=Math.ceil(task.cost*(shock.cost===1?100:110)/100);task.days+=shock.days;}
    for(const resource of plan.resources)resource.availableFrom+=shock.release;
    const result=evaluate(plan,candidate.plan);
    return {id:shock.id,name:shock.name,passed:result.feasible,metrics:result.metrics,violations:result.violations};
  });
}
export function decisionBrief(candidate,result,baseline){
  validatePlan(baseline);validatePlan(candidate.plan);
  const m=candidate.metrics;
  return {revision:fingerprint(baseline),candidateId:candidate.id,project:baseline.name,
    economics:{waitingCost:result.impacted.cost,waitingPenalty:result.impacted.penalty,waitingContribution:result.impacted.margin,recoveryCost:m.cost,recoveryContribution:m.margin,contributionGain:m.margin-result.impacted.margin,budgetBuffer:m.headroom,deadlineBuffer:m.slack},
    scope:{requiredPreserved:baseline.tasks.filter(t=>t.required).every(t=>candidate.plan.tasks.some(n=>n.id===t.id)),deferred:baseline.tasks.filter(t=>!candidate.plan.tasks.some(n=>n.id===t.id)).map(t=>t.name)},
    confirmations:[...candidate.verification,...(candidate.patch.some(p=>p.action==='defer')?['Confirm client agreement to deferred deliverables.']:[])],
    stress:stressTest(candidate),
    caveat:'Synthetic what-if checks, not probabilities. No booking or client communication has occurred.'};
}
export function briefText(b){
  const cash=n=>'₹'+n.toLocaleString('en-IN');
  return [`DELIVERYGUARD — DECISION BRIEF`,b.project,`Revision ${b.revision} / ${b.candidateId}`,'',
    `Waiting: ${cash(b.economics.waitingCost)} delivery cost + ${cash(b.economics.waitingPenalty)} lateness exposure; ${cash(b.economics.waitingContribution)} contribution.`,
    `Recovery: ${cash(b.economics.recoveryCost)} delivery cost; ${cash(b.economics.recoveryContribution)} contribution.`,
    `Contribution difference versus waiting: ${cash(b.economics.contributionGain)}.`,
    `Buffers: ${cash(b.economics.budgetBuffer)} budget / ${b.economics.deadlineBuffer} working days.`,
    `Required scope preserved: ${b.scope.requiredPreserved?'yes':'NO'}.`,
    `Deferred deliverables: ${b.scope.deferred.join('; ')||'none'}.`,'','CONFIRM BEFORE APPLYING',
    ...(b.confirmations.length?b.confirmations:['No external confirmations declared; validate estimates and contract terms.']),
    '','STRESS CHECKS',...b.stress.map(s=>`${s.name}: ${s.passed?'declared constraints pass':s.violations.map(v=>v.message).join(' ')}`),'',b.caveat].join('\n');
}
