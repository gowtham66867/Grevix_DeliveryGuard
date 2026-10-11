# DeliveryGuard — judge guide

**Decision:** recover a fixed-fee client engagement after a staffing disruption without silently sacrificing scope or contribution.

[Open the public demo](https://deliveryguard-412542191970.asia-south1.run.app/) · [Source](https://github.com/gowtham66867/deliveryguard-grevix) · [CI runs](https://github.com/gowtham66867/deliveryguard-grevix/actions) · [Evidence packet](submission-verification.json)

## Reproduce the value in three minutes

1. Select **Engineer unavailable**, then **Analyze disruption**. Northstar is a fictional ₹1,20,000 engagement with a day-16 deadline. Waiting finishes on day 22: ₹63,000 delivery cost plus ₹18,000 declared lateness exposure leaves ₹39,000 contribution.
2. Inspect **Balanced**. A declared backup preserves all scope, finishes on day 14 and costs ₹69,000. Contribution is ₹51,000: ₹12,000 more than waiting, after the extra ₹6,000 spend. The ₹20,000 backup quote is an input, not an automatically sourced or verified offer.
3. Open **Review & approve**. Confirmations are required before application. Approve only as a synthetic demo, then undo. No contractor is booked and no client is contacted.
4. Inspect the stress checks. The nominal recovery has only ₹1,000 budget headroom. Cost +10% exceeds budget by ₹5,900; every task +1 day misses the deadline. This exposes fragility instead of presenting a feasible plan as certain.
5. Select **No feasible recovery**, analyze, and inspect the failed constraints. Open **Evaluation harness** and run the live proof suite. Download the decision brief or JSON packet.

## What is implemented and where to inspect it

| Claim | Evidence | Scope of the conclusion |
| --- | --- | --- |
| Financial counterfactual and required scope | [Business case](business-case.md), [business boundaries tests](../tests/business-boundaries.test.mjs) | Synthetic, declared economics; no measured customer savings |
| Bounded branching and Pareto ranking | [Engine](../dist/core/engine.js), [engine tests](../tests/engine.test.mjs) | Up to 512 assignments under a heuristic schedule; no global optimum guarantee |
| Grounded interpretation and tool stages | [Agent](../dist/core/agent.js), [agent tests](../tests/agent.test.mjs) | Local rules on public demo; no live-model accuracy claim |
| Optional structured model output | [Provider](../provider.mjs), [provider tests](../tests/provider.test.mjs) | Mocked timeout, refusal and grounding checks; no public key configured |
| Verification, approval and stale revision | [Test cases](test-cases.md), [live browser proof](live-browser-proof.json) | Checks declared inputs and current revision; not a secure multi-user approval ledger |
| Stress scenarios and readable evidence | [Assurance tests](../tests/assurance.test.mjs), [sample brief](sample-business-brief.txt) | Fixed what-if shocks, not probabilities |
| Public runtime and request controls | [Cloud Run record](cloud-run.md), [runtime tests](../tests/cloud-run.test.mjs) | Synthetic demo deployment; not a production client-data system |

## One command to verify the packet

With Node.js 22 or newer, run `npm run submission:verify`. It executes the current tests, regenerates the recorded offline evaluation, checks build assets, recalculates the staffing economics, checks the previous browser proof, and writes `docs/submission-verification.json` with file hashes. Browser evidence retains its original timestamp; this command does not claim to rerun Chrome. Hashes support file comparison and are not a signed attestation.

## Why this is agentic

Interpretation, allowed actions, counterfactual planning, bounded branching, ranking, independent verification and human application form an observable workflow. The model cannot determine financial arithmetic or acquire new powers through a prompt. A no-solution result, clarification or stale approval is a legitimate outcome. Functional role names describe stages in one coordinator, not a swarm of independent language models.

## Business validation still needed

The initial buyer hypothesis is a small agency owner or operations lead. An interview and a consented pilot must establish how often this decision occurs and whether the workflow improves decision quality or speed. Contribution excludes overhead and taxes. Pricing and customer demand are unvalidated. See the [pilot plan](business-case.md#pilot-acceptance-plan).

## Event compliance status

Phase 3 Pressure Test has a confirmed receipt. Final Forge is pending its 12 October 00:00–02:00 IST window. Assigned Card 1 is for PulseGuard Edge and is not implemented in this separate DeliveryGuard prototype; organizer acceptance of the switch is unverified. Genuine human feedback and the corresponding Card 2 improvement evidence remain pending. Engineering verification cannot resolve these eligibility gaps. No claim of top-three placement or full challenge completion is made.
