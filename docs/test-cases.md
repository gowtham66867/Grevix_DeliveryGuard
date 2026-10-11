# DeliveryGuard test cases

The harness checks observable business outcomes and execution boundaries. Reproduce the recorded results with Node 22 or newer using `npm run check`. Tests require no API key and make no calls to OpenAI.

## Business scenarios

| Case | Input | Expected result |
| --- | --- | --- |
| Baseline | Unchanged fixture | ₹63,000 cost, day-15 finish, ₹57,000 contribution, one day of buffer |
| Staffing gap | Frontend unavailable until day 12 | Counterfactual day 22, ₹18,000 lateness cost; balanced recovery ₹69,000, day 14, provisional backup quote |
| Budget cut | New budget ₹58,000 | Defer analytics and extra training; ₹56,000 cost, day 13; retain every required task |
| Earlier deadline | Deadline day 12 | Use backup and defer extra training; ₹66,000, day 12; external quote remains provisional |
| Impossible budget | New budget ₹30,000 | No winner; all evaluated options show constraint failures |
| Margin floor | Minimum margin 90% | No feasible recovery; scoring cannot override margin |
| Preserve scope | Balanced versus cash ranking | Distinct recommended trade-offs; feasibility remains mandatory |
| Required descendant | Handoff depends on optional analytics | Analytics cannot be removed even though its own optional flag is false for requirement status |

The last case sets analytics as optional (`required:false`) but makes it a prerequisite of required handoff. Its removal is therefore prohibited.

## Graph and schedule tests

Cycles, missing dependencies, duplicate tasks/resources, unavailable owners, malformed alternatives, prototype-sensitive IDs, negative/zero/infinite/NaN durations, fractional rupee amounts, zero contract revenue, missing required scope, and task limits are rejected before planning.

Two seeded batches of 150 generated DAGs independently check schedule invariants: dependencies finish before dependents start; resources do not overlap; release times are honored; task costs reconcile; identical inputs produce identical schedules. One batch lives in unit tests and the other in the evaluation harness. The recorded UI shows the evaluation batch’s count.

The output verifier is tested against altered cost metrics, missing required scope, and forged start times. Candidate search is tested with a one-assignment bound to verify explicit truncation and absence of an invented winner. Pareto tests include true trade-offs and strictly dominated points.

## Agent and adversarial cases

| Input or failure | Expected behavior |
| --- | --- |
| Explicit rupee amount or `58k` | Ground an absolute budget |
| Named frontend/designer with return day | Ground only a resource in the active plan |
| “Make this better” | Ask for clarification, no recovery execution |
| “Budget reduced by 20%” | Ask for absolute budget |
| Two simultaneous changes | Ask for one change at a time |
| “Deadline tomorrow” | Ask for working-day deadline |
| Unknown resource or missing return day | Ask for resource and day |
| Foreign currency | Reject interpretation as unsupported |
| Negative amount or overlong brief | Clarify; no execution |
| Ignore instructions / auto approve / delete / secret request / script content | Block known out-of-scope input before provider access |
| Provider timeout, HTTP 429, refusal, incomplete output, malformed JSON | End explicitly without applying a patch |
| Model names nonexistent resource | Reject before scheduling |
| Model evidence is not in source input | Reject grounding |
| Model changes 58,000 to a fabricated number | Reject numeric grounding |

Known phrase blocking is a regression defense, not a claim to solve all prompt injection. Tests do not establish live-model accuracy across arbitrary wording.

## Approval and HTTP controls

- No implicit approval, including for candidates with no unresolved external facts.
- Missing quote/capacity confirmation blocks provisional candidates.
- Changed plan revisions block stale approval.
- Approval recomputes engine results, ignoring modified candidate metrics.
- Unknown candidate identifiers cannot be applied.
- Server rejects invalid JSON, oversized bodies, invalid plans, cross-origin requests, path traversal, and unsupported methods.
- Per-IP interpretation limit produces HTTP 429 after the bounded request count.
- Static responses include a Content Security Policy and do not expose source files outside `dist/`.

## Browser verification

Verified against the local app: staffing recovery, external-fact approval gate, approved metrics, undo, budget recovery, and JSON export after approval. The exported packet retains the original brief, seven tool events, the approved plan, and approval receipt; the captured synthetic example is [sample-decision.json](sample-decision.json).

Remaining browser checks and observed outcomes are recorded in [browser-qa.md](browser-qa.md). Browser checks are manual agent-driven interactions, separate from the automated test count.

## Decision assurance and live proof

`tests/assurance.test.mjs` verifies four stress scenarios, nonmutation, reproducibility, contribution reconciliation, scope-deferral confirmation, and evidence-preserving text export. Staffing recovery has only ₹1,000 budget buffer: 10% higher costs cause a ₹5,900 overrun. An extra day per task causes day-20 completion; every resource two days later still finishes at the day-16 limit.

`tests/proof.test.mjs` verifies the browser's 12-check live proof and injects a broken agent to ensure failures are reported. The browser generates and exports the current run independently of the recorded evaluation JSON.
