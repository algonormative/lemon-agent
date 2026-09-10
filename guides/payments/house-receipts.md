---
title: "Step 5: House receipts"
step: 5
status: published
updated: 2026-09-10
description: "The house's own self-funded-vs-stranger-funded split, published as dated rows: third-party settlements, house-funded listing drills, distinct external wallets, repeat buyers, break-even, and the ecosystem-wide second-buyer base rate. Each figure names its instrument."
---

People keep asking sellers on x402 the same question: has anyone actually
published a self-funded-versus-stranger-funded split. This page is ours.
It exists so the numbers do not have to be re-typed into a comment every
time the question comes round, and so anybody quoting them is quoting the
same wording twice.

Every figure below names the **instrument** that produced it: the
settlement ledger, the house buyer wallets, on-chain receipts, or the
parallax census. All but the census measure us; the census supplies one
house row (the wallet breadth) and one ecosystem-wide row, which is
labelled as such. Nothing here is a projection.

## The split

Rows are dated by when they were added to this page, not by when the
measurement was taken. The measurement's own window is its own column.

| Row added | Figure | Window | Instrument | Facts row |
|---|---|---|---|---|
| 2026-09-10 | Third-party revenue **$0.211**, **23 settlements**, **4 distinct wallets**, across the five properties | 2026-08-25 → 2026-08-30 | settlement ledger | F1 |
| 2026-09-10 | Each of those 4 wallets swept **seventy-plus payTos** (72–79) in one pass, bought a handful of calls from us, and **none returned after 08-30** | 2026-08-25 → 2026-08-30 | parallax census (breadth); ledger (no return) | F2 |
| 2026-09-10 | Listing drills **$0.269** settled from house wallets: toolshed 19/19 Bazaar rows, 10x402 8/8, kino402 dual-rail | 2026-09-02 | house buyer wallets | F3 |
| 2026-09-10 | penny402 launch: **10 listing drills ≈ $0.06** → **9 Bazaar rows** live within minutes, first at 04:05:16Z | 2026-09-02 | house buyer wallet | F4 |
| 2026-09-10 | Break-even recomputed off on-chain receipts: no settlement fee observed → **≈34 paid calls/day** (was 55) | 2026-09-02 | chain receipts | F5 |
| 2026-09-10 | House repeat-buyer rate: **0** distinct wallets paid twice, time-separated | to 2026-09-05 | settlement ledger | F16 |
| 2026-09-10 | Ecosystem base rate, **n=317** newly listed sellers: **13%** get a 2nd buyer by 9h, median **32h**, **51%** never | 2026-09-02 recompute | parallax census (ecosystem-wide, not a house number) | F13 |

The revenue figure is USDC. The rail per settlement is not pinned in the
record, so this page does not name one.

## Reading it

The two money figures are not comparable as a ratio, and pairing them as
one number would be the easiest mistake to make here. The third-party
revenue was settled between **2026-08-25 and 2026-08-30**. The listing
drills were settled on **2026-09-02**, a few days later, and they are our
own spending on our own listings. Give both dates whenever you cite them
together.

The four wallets that paid us were catalog walkers. Each one swept
seventy-plus payTos in a single pass and bought a handful of calls from
us on the way through. That is breadth, not interest, and none of them
came back after 08-30. The repeat-buyer count for the house is zero
through 2026-09-05.

The ecosystem row is there for scale, not for comfort. It is a parallax
census number across 317 newly listed sellers, not a house measurement,
and it says that a majority of new sellers never see a second buyer at
all. Our own zero sits inside a distribution, which makes it ordinary
rather than excusable.

Break-even is the useful one for anybody deciding whether to build here:
recomputed off on-chain receipts with no settlement fee observed, it is
about **34 paid calls a day**. That is the bar, and we are a long way
under it.

## How the house tags its own traffic

None of this split is possible without a convention for separating your
own payments from your customers'. Ours is a `HOUSE_PAYERS` list of
public payer addresses, with the flag derived once at verify time and
carried onto the ledger row and every analytics event. The full
convention, including the reference snippet, is
[Step 2: Tag your own traffic before you report revenue](/guides/payments/house-traffic-tagging/).

If you are reporting gross settlements without that flag, your revenue
number includes your own listing drills.

## Refresh procedure

The figures on this page come from an internal house facts table (the
vault's `lemon/facts.md`), which has no public URL. Rows are therefore
named by id and date rather than linked.

- A new row in the house facts table gets a **new dated row on this
  page**, added at the bottom of the table with the date it was added.
- **An existing row on this page is never edited or removed.** A figure
  that is superseded stays where it is; the newer figure sits below it
  with a later date, so the sequence of what the house believed and when
  stays readable.
- A figure that turns out to be **wrong** gets an entry at
  [/corrections/](/corrections/) and a new row here. It does not get a
  silent edit.
- A figure not in the facts table does not go on this page, however well
  sourced. It is a proposal for a new row in the table first.

The same rule governs the corrections log, and for the same reason: a
page that quietly improves its own past is not a receipt.

---

*Rows cited on this page: F1, F2, F3, F4, F5, F13, F16 (house facts
table, 2026-09-05 revision). F13 is ecosystem-wide; every other row is a
house measurement.*
