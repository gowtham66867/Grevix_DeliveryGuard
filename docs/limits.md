# DeliveryGuard limits

DeliveryGuard is a decision-support prototype. Its strongest guarantee is that recommendations pass the declared checks within the explored candidates and scheduling heuristic. It cannot guarantee the real world will follow a plan. Four fixed stress scenarios test selected patches against declared shocks; they are not probability estimates, distributional forecasts, or guarantees under arbitrary disruptions. The live browser proof uses synthetic local-rule inputs, not a live-model benchmark.

## Algorithmic limits

The serial schedule heuristic uses a stable ready-task priority and resource release times. It does not optimize all possible task orderings or insert tasks into previously created idle gaps. A feasible option may be missed because of ordering. A Pareto frontier is computed only over evaluated candidates.

Each task supports at most three predeclared alternatives. Candidate branching stops at 512 assignments. The app explicitly reports truncation; it may miss a recovery outside the explored prefix. There is no exhaustive search over arbitrary task edits, new vendors, overtime, or renegotiated dates.

Required tasks cannot be deferred. Deferring optional prerequisites also defers dependent optional tasks and is rejected if a required descendant would be removed. All engagement work, including optional work that remains in scope, must finish by the deadline.

## Data and commercial assumptions

Durations, costs, value weights, available-from days, contract revenue, and lateness costs are declared inputs. The app does not validate them against contracts, timesheets, or supplier systems. “Declared constraints pass” is distinct from verification of external facts.

The fixture uses whole INR rupees and continuous working-day offsets. Holidays, weekends, calendar dates, time zones, partial progress, sunk costs, task preemption, multiple simultaneous disruptions, skills matching, and cross-project resource contention are unsupported.

Contribution is revenue minus delivery cost minus declared lateness cost. It is not audited profit. No real pilot outcome, validated pricing, or customer-savings claim is made.

## AI limits

The hosted static demo uses local rules. The optional OpenAI interpreter requires the local Node server and a server-side API key. It is contract-tested with mocks, not evaluated against a live model. Model access, latency, and quality depend on the configured account and model.

Strict structured output limits shape, not truth. Evidence validation requires an actual excerpt and explicit number; disagreement with recognized local extraction is rejected. Other semantically wrong interpretations may remain, so the UI displays the change for review before approval.

Known instruction-injection phrases are blocked, but evasive wording can pass the phrase filter. The constrained tool surface prevents model output from executing shell commands, sending messages, revealing server keys, or making vendor bookings. This is a narrower, testable boundary than a blanket “injection-proof” claim.

## Operational limits

| Boundary | Current limit |
| --- | --- |
| Tasks | 24 |
| Resources | 12 |
| Alternatives per task | 3 |
| Candidate assignments | 512 |
| Workflow events | 8 |
| Input characters | 2,000 |
| Optional model calls | 1 per run |
| Model timeout | 15 seconds |
| Output-token bound | 700 |
| API body size | 64 KB |
| API rate limit | 10 interpretation calls per minute per IP |
| Time horizon | 365 working days |
| Retained local receipts | Latest 20 |

The IP rate limiter is in-memory and resets with the server. It is not tenant-aware or a production spending control. Browser storage can fail due to quotas or policy; the UI warns and offers export. Undo retains only the most recent approval in the current tab session. Resetting the demo clears local receipts.

## Production gaps

Before a real deployment with client data: add authentication, tenant isolation, encrypted durable storage, a cryptographic append-only audit mechanism, consented retention policies, calendar support, live-resource integrations, per-user budgets, model evaluations, and incident monitoring. Conduct a pilot and security review before connecting vendor or communication actions.

The local server binds to `127.0.0.1`. It should remain local until those controls are implemented. The static public demo contains synthetic fixtures and does not expose a provider key.
