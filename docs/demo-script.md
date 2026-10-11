# DeliveryGuard judge demo

The demo leads with the business decision, then shows the agent workflow and evidence. Use the default synthetic fixture. Keep live AI disabled unless a configured provider has been independently tested.

## First thirty seconds

“A small agency has promised a client a fixed-fee portal by day 16. Their frontend engineer becomes unavailable until day 12. DeliveryGuard helps the delivery lead decide whether to wait, use a declared backup, or change optional scope, with cost and delivery consequences visible before approval.”

Point to contract revenue, budget, contribution margin, and the deadline. These are fictional scenario inputs.

## Recovery decision

Select Engineer unavailable and Analyze disruption. Show the grounded resource and return day. Doing nothing finishes on day 22, with ₹18,000 of modeled lateness cost. The balanced recovery finishes on day 14 at ₹69,000, retaining required and optional scope. It improves modeled contribution by ₹12,000 against waiting.

Show the backup quote and capacity check as unresolved. Explain that the app never invents a contractor or assumes capacity was verified. Compare Protect cash with Balanced to show the cost-versus-scope trade-off.

## Approval boundary

Open Review & approve. The button stays disabled until both explicit approval and the relevant external-fact checkbox are checked. For a demo only, explain that the fixture assumptions are being confirmed synthetically; do not claim a real booking.

Approve, inspect the changed cost and finish, and undo. Show the exported decision packet with inputs, metrics, the seven-step tool trace, patch, and receipt.

## Stress test and evidence

Reset the fixture, select No feasible recovery, and run. Explain why the system refuses to invent a solution below the required-scope cost. Show rejected options and their failing constraints.

Open Evaluation harness. Show 27 recorded fixture cases and 150 generated DAG scenarios; mention 78 automated tests in the repository. Provider responses are mocked, and live-model accuracy has not been benchmarked.

Close with the product boundary: this is a narrow delivery-recovery copilot for fixed-fee projects. Production work includes team permissions, real calendars, integrations, and a validated customer pilot.
