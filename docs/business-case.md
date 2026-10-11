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
