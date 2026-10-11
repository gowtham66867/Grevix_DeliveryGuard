# DeliveryGuard business case

DeliveryGuard addresses a specific operating decision: a small service team has promised a client a delivery date and a fixed price, then loses a resource or faces a budget change. The delivery lead needs to choose a feasible response before extra spend, missed commitments, and scope confusion accumulate.

## Buyer and user

The initial buyer hypothesis is the owner or operations lead of a small digital agency. The daily user is a project manager coordinating engineering, design, and QA. The client is affected by the outcome but does not need access to the planning tool.

This buyer and pain hypothesis has not yet been validated through customer interviews. The product currently demonstrates the decision workflow using synthetic data.

## The decision that matters

Typical task trackers show assignments and due dates. DeliveryGuard’s prototype instead asks: “Which allowed change gets us back inside the client promise, and what will it cost?” The manager provides task dependencies, delivery estimates, approved fallback options, and the contractual constraints. The app compares feasible recovery patches and explains their trade-offs.

The first useful workflow is narrow: take a frontend staffing gap, compare waiting with a predeclared backup quote, preserve required scope, and approve only after confirming the backup’s capacity. The tool does not create quotes or assume a replacement exists.

## Modeled economics

| Measure | Original plan | Staffing disruption with no action | Balanced recovery |
| --- | ---: | ---: | ---: |
| Fixed revenue | ₹1,20,000 | ₹1,20,000 | ₹1,20,000 |
| Delivery cost | ₹63,000 | ₹63,000 | ₹69,000 |
| Finish working day | 15 | 22 | 14 |
| Deadline working day | 16 | 16 | 16 |
| Modeled lateness cost | ₹0 | ₹18,000 | ₹0 |
| Contribution | ₹57,000 | ₹39,000 | ₹51,000 |

The recovery spends ₹6,000 more on delivery than waiting but avoids ₹18,000 of scenario lateness cost. Its modeled contribution improvement is ₹12,000. The recovery retains all client deliverables, with ₹1,000 of budget headroom and two working days of schedule buffer. Capacity and price remain provisional until confirmed.

Contribution equals revenue minus delivery cost minus the declared lateness cost. It excludes overhead, taxes, financing costs, and long-term relationship effects. The penalty is a user-defined scenario parameter, not a claim about typical contracts.

## Validation before commercial claims

Interview agency delivery leads about the last resource disruption they handled. Ask what alternatives they considered, whether they had approved fallback quotes, and how they decided between extra spend and changed scope. Observe a user running the demo without guidance. Measure whether they can identify the recommended change, financial impact, and remaining verification in under two minutes.

For a pilot, compare decision time and plan-error detection against the team’s existing process on the same anonymized projects. Track rejected infeasible options and human overrides. Report adoption and outcome evidence separately from synthetic harness results.

## Product boundaries

The prototype targets a single fixed-fee engagement, not staffing optimization across an entire agency. Multi-project contention, real calendars, integrations, uncertainty calibration, and role-based approval would be prerequisites for broader adoption.

A paid product is a future hypothesis. No validated pricing, customer demand, or revenue claim is included in this submission.

## When the recovery is economically worthwhile

The modeled backup adds ₹6,000 relative to waiting and avoids six days of lateness. Holding delivery estimates and scope constant, the cost-only break-even lateness charge is ₹1,000 per day (₹6,000 ÷ 6). At the fixture's ₹3,000 per day, the modeled contribution benefit is ₹12,000. At ₹0 per day, waiting would have ₹6,000 more contribution; the contractual delivery constraint can still rule it out. This illustrates why hard commitments and economics must be considered together.

The quote itself is not spare spending capacity: the selected plan has just ₹1,000 left in its ₹70,000 budget. A higher quote or worse estimate requires re-evaluation. The fixed stress cases expose this sensitivity without inventing a probability of success. These calculations assume all extra spend is incremental; the prototype does not model paid-to-date or sunk costs.

## Pilot acceptance plan

This is a proposed validation design, not completed research or a statistical efficacy claim.

| Question | Method | Proposed acceptance criterion |
| --- | --- | --- |
| Can a lead understand the decision? | Five consenting agency leads use the synthetic staffing case without coaching | At least four identify the recommended patch, incremental cost and unresolved external confirmation within two minutes |
| Does it help their own workflow? | Each lead brings one anonymized disruption and explains their usual decision process first | Record time, corrections and overrides for both methods; report each pair rather than extrapolating savings |
| Are constraints preserved? | Independently review each exported decision against its entered contract, dependency and resource assumptions | No approved decision silently removes required scope or ignores a declared hard limit |
| Does it communicate uncertainty? | Ask the lead which stress cases fail and what needs confirmation | At least four distinguish nominal feasibility from real-world certainty |
| Is there a business worth pursuing? | Ask about frequency, fallback quote availability and willingness to run a pilot | Continue only if recurring pain and usable input data are demonstrated; do not infer demand from demo approval |

Stop the pilot if a decision violates declared hard constraints or a reviewer interprets synthetic estimates as verified vendor availability. Preserve the failure and fix it before expanding access. Collect only consented, anonymized evidence. Human feedback received in a future pilot can support a product improvement; it is not retroactive proof that this event's feedback card was completed.
