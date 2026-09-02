---
title: "The Verify-Info Pass"
craft: work
kind: instrument
status: v0
updated: 2026-08-15
description: "An installable skill that turns one document into a dated claim ledger: every claim graded verified, contradicted, uncertain, or not verified, with sources, confidence, and the follow-up each gap still needs."
---

A memo becomes a recommendation, a recommendation becomes a decision,
and nobody between them re-reads the source. The verify-info pass puts
one bounded job in front of the agent: **inventory what a document
asserts, trace what actually supports each assertion, and say plainly
where a check did not happen.**

The contract that makes it safe: **it never invents a source.** A claim
with nothing behind it comes back marked *not verified*, not smoothed
over with plausible context. "Not verified" is a report of the pass's
own limits, never a polite way to say a claim looks weak. You read the
ledger and decide what the document is allowed to say.

## Install it

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill work-verify-info --yes
```

Give it the document, and the source packet if you have one. Without
skill installs, the [paste-ready prompt](/work/#start-with-one-document)
on the craft page runs the same workflow.

## How a pass runs

1. **Read everything first.** The whole document and the whole packet
   before anything is graded — a later section routinely qualifies an
   earlier claim.
2. **Inventory the claims.** Numbers, dates, names, quotations,
   comparisons, status claims, and hedged appeals like "studies show."
   Compound sentences get split when the halves can fail
   independently.
3. **Classify the support** as primary in hand, secondary, or
   unsourced — what exists, not what you wish existed. A number three
   people repeat from one deck has one source.
4. **Hunt for the primary,** then stop at either a primary source or
   the edge of what the environment allows, and say which happened.
   Retrieval dates on anything fetched.
5. **Grade into four states:** verified, contradicted, uncertain, not
   verified. A partly-right claim is not verified; it is contradicted
   or uncertain, and the row says which part failed.
6. **Set confidence from support *and* independence.** High needs a
   primary stating the claim, or two genuinely independent sources.
   Your own arithmetic over a source is not a second source.
7. **Write the ledger** — claim, state, support level, source and date,
   confidence, uncertainty, follow-up — then what the pass could not
   do, the counts, and the single claim most likely to embarrass the
   sender if it is wrong.

Platform details — what to do with no web access, where the ledger
file lands, how to keep ledgers across many documents — live in a
Platform notes section at the end of the skill, deliberately fenced off
from the contract above. The pass does not change with the surface.

## A worked example

Everything below is fictional but self-contained. Paste the memo and
the packet into an agent with the skill installed and you should get a
ledger close to this one — no web access needed, which is what makes it
reproducible.

### The document

```text
To: Operations Steering Group
From: D. Whitfield, Support Operations
Date: 2026-08-11
Subject: Recommendation — consolidate ticketing onto Northwind

I recommend we retire Kestrel and move all support ticketing onto
Northwind Support Cloud before the end of the calendar year.

Cost. We have spent $151,400 on ticketing licences this fiscal year
to date — $96,200 with Northwind and $55,200 with Kestrel. Retiring
Kestrel removes $55,200 of annual spend from the support budget.
Northwind's Growth tier lists at $41 per agent per month, and every
agent on the support roster already holds a Northwind licence, so
consolidation adds no new seat cost. Net FY27 savings should be at
least $50,000.

Load. Kestrel currently handles 62% of our inbound tickets, so the
migration moves the majority of the queue onto a platform we already
run. Volume is growing at roughly 19% a quarter and will exceed 25,000
tickets in Q1 FY27, which is more than Kestrel's current routing rules
can absorb without another round of configuration work.

Fit. The Growth tier includes unlimited API calls, so the reporting
integrations we built against Kestrel port over without a metering
review. Studies show that consolidating onto a single helpdesk vendor
reduces average handle time by about 15%.

Timing. Kestrel's contract renews on 2026-11-30 with a 60-day notice
window, so a decision is needed by the end of September. Migration
would take about six weeks. Legal cleared Northwind's data-processing
addendum in March, so there is no outstanding contractual blocker.

I would like approval to begin migration planning this month.
```

### The source packet

```text
SOURCE A — Finance vendor-spend extract (internal), generated 2026-08-01

  Vendor      Category    FY26 Q1-Q3 spend    Billed seats
  Northwind   Ticketing   $96,200             34
  Kestrel     Ticketing   $55,200             22

  Note: figures cover FY26 Q1-Q3 (Sep 2025 - May 2026). Q4 invoices
  are not yet posted. Seat counts are as billed on the most recent
  invoice.

SOURCE B — Northwind Support Cloud pricing page, retrieved 2026-08-04

  Growth — $41 per agent / month, billed annually.
  Included: unlimited email and chat channels, SLA rules, API access.

  Plan comparison
  Plan      API calls / month
  Starter   1,000
  Growth    10,000
  Scale     Unlimited

  Footnote: API overage billed at $0.50 per 1,000 calls.

SOURCE C — Support Operations quarterly report, FY26 Q3 (Mar-May 2026),
issued 2026-07-08

  Inbound tickets, FY26 Q3: 18,430
    Routed to Northwind: 11,427 (62%)
    Routed to Kestrel:    7,003 (38%)

  FY26 Q2 comparison: 15,490 inbound (+19% quarter over quarter).
  Support roster at quarter close: 41 agents.
```

### The ledger the pass produced

*Produced by running the verify-info pass on the memo and packet above,
2026-08-15. No web access was used: everything is graded from the
three sources in hand, and every* not verified *row traces to something
the packet does not contain. Formatting only has been tidied; no grade,
caveat, or follow-up was rewritten after the fact.*

| # | Claim | State | Support | Source (+ date) | Conf. | Uncertainty / caveats | Follow-up |
| - | ----- | ----- | ------- | --------------- | ----- | --------------------- | -------- |
| 1 | $151,400 spent on ticketing FY to date; $96,200 Northwind + $55,200 Kestrel | Verified | Primary in hand | A, both rows (2026-08-01) | High | The extract prints no total; $151,400 is the sum of its two rows. Period matches: Q1–Q3 is "to date" | None |
| 2 | Retiring Kestrel removes $55,200 of **annual** spend | Contradicted | Primary in hand | A, Kestrel row + period note (2026-08-01) | High | $55,200 covers three quarters, not a year. Even-billing run-rate is ~$73,600/yr, but the extract does not confirm even billing, so that replacement figure is weaker than the contradiction | Pull the Kestrel order form for the contracted annual value; do not annualise from the extract |
| 3 | Northwind Growth lists at $41 per agent / month | Verified | Primary in hand | B, price line (retrieved 2026-08-04) | High | List price, billed annually. Packet holds no negotiated rate. Price pages are time-sensitive; as-of 2026-08-04 | Confirm the contracted rate with procurement before the number goes in a budget |
| 4 | Every agent already holds a Northwind licence, so no new seat cost | Contradicted | Primary in hand | A, 34 billed seats (2026-08-01); C, 41 agents (2026-05-31) | Medium | Two independent internal sources, but they measure different things at different dates — billed seats vs roster headcount. Face-value gap is 7 seats ≈ $3,444/yr at list | Pull the current Northwind seat-assignment list and reconcile against the roster |
| 5 | Net FY27 savings of at least $50,000 | Uncertain | Primary in hand, incomplete | Derived from A + B | Low | Rests on claims 2 and 4, both of which failed. On the memo's own figures $55,200 − $3,444 = $51,756; on run-rate, ~$70,156. Both clear $50,000, but neither accounts for migration cost, Kestrel exit terms, or renewal pricing — none of which are in the packet | Get Kestrel's Q4 invoice and exit terms plus a migration cost estimate, then restate the range |
| 6 | Kestrel currently handles 62% of inbound tickets | Contradicted | Primary in hand | C, routing split (FY26 Q3) | High | The figures are transposed: Kestrel 7,003 = 38%, Northwind 11,427 = 62%. Also "currently" cites a quarter that closed 2026-05-31; the memo carries no as-of date | Correct to 38% and date the figure; the paragraph's "majority of the queue" argument reverses with it |
| 7 | Volume growing ~19% a quarter; will exceed 25,000 tickets in Q1 FY27 | Uncertain | Primary in hand, incomplete | C, Q2/Q3 volumes (2026-07-08) | Low | The 19% is exact for one interval (15,490 → 18,430 = +18.98%). "A quarter" generalises a rate from a single step, and the projection extrapolates two more (naive: 18,430 × 1.19² ≈ 26,100). Consistent, not evidenced | Pull four to eight quarters of the inbound series before treating 19% as a growth rate |
| 8 | Volume exceeds what Kestrel's routing rules can absorb without reconfiguration | Not verified | Unsourced | — | Low | Nothing in the packet describes routing-rule capacity or current utilisation | Ask the Kestrel administrator for the rule limit and current usage |
| 9 | Growth tier includes unlimited API calls | Contradicted | Primary in hand | B, plan comparison + footnote (retrieved 2026-08-04) | High | Growth is 10,000 calls/month; only Scale is unlimited. The inclusion line says "API access," which is what the memo appears to have read; the comparison table in the same page is the specific figure | Measure the Kestrel integrations' monthly call volume against 10,000 and price the $0.50/1,000 overage |
| 10 | Studies show single-vendor consolidation cuts average handle time ~15% | Not verified | Unsourced | — | Low | No study is named and nothing in the packet speaks to handle time. No source was supplied and none was invented | Name the study, or cut the sentence |
| 11 | Kestrel renews 2026-11-30 with a 60-day notice window, so a decision is needed by end of September | Not verified | Unsourced | — | Low | The packet contains no contract. Internally consistent — 60 days before 2026-11-30 is 2026-10-01 — but the deadline inherits an unverified premise, and it is the premise the whole timeline rests on | Pull the Kestrel MSA / order form and confirm renewal date and notice period with procurement |
| 12 | Migration would take about six weeks | Not verified | Unsourced | — | Low | Nothing in the packet estimates migration effort | Ask the implementation owner for a scoped estimate, or mark it as an assumption in the memo |
| 13 | Legal cleared Northwind's data-processing addendum in March | Not verified | Unsourced | — | Low | Nothing in the packet from Legal. "March" also carries no year | Get the sign-off reference and date from Legal |

**What this pass could not do.** It ran without web or fetch access, by
design, so nothing outside the three-source packet was checked. Rows 8
and 10–13 are *not verified* because the packet contains no
corresponding record — no contract, no Legal sign-off, no migration
plan, no study — not because a check was skipped for convenience.
Sources A and C are internal extracts, not the underlying billing and
ticketing systems; row 4's reconciliation needs those systems, not
another read of the packet.

**Counts.** 13 claims: 2 verified, 4 contradicted, 2 uncertain, 5 not
verified.

**Most likely to embarrass the sender if it is wrong: claim 6.** The
62% figure is the memo's entire load argument, it is backwards, and the
report it inverts is one the steering group already receives quarterly.

## Observed failures (toward the judgment artifact)

These are failure modes observed while running the pass above — not a
taxonomy assembled in advance. A numbered judgment list ships once
there are enough of them to be worth numbering.

- **Arithmetic mistaken for corroboration.** Adding two rows of one
  spending extract and reading the agreement as confirmation. *Two
  figures from one document are one source; treating the sum as a
  second one turns a single unchecked extract into "high confidence."*
- **Collapsing a scope mismatch into a clean verdict.** Wanting to call
  claim 4 flatly contradicted because 34 is less than 41, when billed
  seats and roster headcount are different measures taken on different
  dates. *A caveat-free contradiction sends the author to fix a claim
  that may be true and hides the real follow-up, which is reconciling
  two systems.*
- **Computation laundering an assumption into support.** Projecting
  ticket volume forward and finding ≈26,100 — the memo's own
  extrapolation, restated — then feeling the claim had been checked.
  *Recomputing an assumption produces a number that reads like
  evidence, which is how a projection acquires a confidence it never
  earned.*
- **Filling a bare row to make it look diligent.** The pull, on rows 10
  and 12, to add plausible background — typical migration windows,
  what the consolidation literature generally finds — instead of
  leaving the source column empty. *That is inventing a source in
  everything but the citation, and it quietly converts "not verified"
  into "probably fine."*
