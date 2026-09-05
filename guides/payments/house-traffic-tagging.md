---
title: "Step 2: Tag your own traffic before you report revenue"
step: 2
status: published
updated: 2026-09-05
description: "Your own listing drills settle in the same ledger as your customers. Keep a HOUSE_PAYERS list of public payer addresses, tag every payment at verify time, and exclude the house rows from any number you publish."
---

The moment you sell something over x402, you start paying for it
yourself. Listing drills to get a row in the Bazaar, a launch check
after a deploy, a monitoring probe that actually settles so you know
settlement still works — all of them are real payments, on a real
chain, into your own receiving address. They land in the same ledger
your customers land in, and a gross revenue readout counts them.

This is not hypothetical, and the size of it is uncomfortable. Across
our five sellers, **third-party settlements totalled $0.211 from four
catalog-walker wallets between 2026-08-25 and 2026-08-30**. On
**2026-09-02**, a single owner-approved seeding pass settled **$0.269 of
our own drills** — toolshed 19 of 19 and 10x402 8 of 8 Bazaar rows, plus
kino402's TTS and generate routes on both rails. One afternoon of our
own listing work outweighed the previous week of actual customers.

*Numbers from the house build log, 2026-09-02; no new measurement for
this page.*

An x402 revenue dashboard that does not separate those two things is
reporting its own spending back to itself. Most of the ones competing in
this space report gross settlements. Here is the convention we use
instead.

## The convention

Keep a list called `HOUSE_PAYERS`: the **public payer addresses** your
own drills spend from.

- **Public addresses only.** These are receive-and-spend addresses that
  already exist on a public chain. Nothing secret goes in this list, so
  it lives in config next to the code — `wrangler.toml` for a Worker —
  and not in a secret store. A key never goes anywhere near it.
- **Comma-separated, compared lowercased.** An EVM address arrives in
  any mix of cases; a base58 Solana address is case-*sensitive* as an
  address but you are only ever comparing it to itself, so lowercasing
  both sides makes the same list match on both rails.
- **Both rails in one list.** Base and Solana house buyers sit together.
  A payer is a payer; the rail is a separate field.
- **One derivation point.** Compute `house` once, where the payment is
  verified, and pass the boolean down. Re-deriving it at each call site
  is how one of them ends up wrong and a drill shows up in the revenue
  graph.

## Tag it at verify time

Verification is the only place that has the payer address and knows the
payment was real. Compute the flag there and carry it everywhere else:

- **Persist it on the ledger row.** A `house` column, written with the
  settlement. Do not filter the row out at write time — you want the row
  as proof the pipeline works.
- **Attach it to every analytics event.** Quote, refuse, serve, settle:
  all of them carry `house`. A funnel that only tags the settlement
  can't tell you whether your own probes are inflating the top of it.
- **Alert quietly for house, loudly for third party.** A house
  settlement is a test result. Ours reads `🧪 test settlement — …` with
  the same facts; a genuine one reads `🍋💰 THIRD PARTY PAID — …`. If
  both look the same, the first real customer arrives and nobody
  notices.

## The reference snippet

Dependency-free, Cloudflare Workers flavoured. Adapt the field names to
your ledger; the shape is the point.

```js
// One parse, one lowercase Set, at module scope.
let housePayers = null;

function isHousePayer(env, payer) {
  if (!housePayers) {
    housePayers = new Set(
      (env.HOUSE_PAYERS ?? '')
        .split(',')
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean),
    );
  }
  return typeof payer === 'string' && housePayers.has(payer.toLowerCase());
}

// At verify time — the one place that derives the flag.
const { payer, rail, amountAtomic } = await verifyPayment(env, request);
const house = isHousePayer(env, payer);

await ledger.insert({ payer, rail, amount_atomic: amountAtomic, house });
analytics.capture('x402 payment settled', { payer, rail, house });
await alert(house ? `🧪 test settlement — ${payer}`
                  : `🍋💰 THIRD PARTY PAID — ${payer}`);
```

If your list can change without a redeploy, drop the module-scope cache
and build the `Set` per request — it is a handful of string splits.

## Label it in analytics, don't delete it

Every revenue tile, chart, and public number filters `house = true`
out. Every *pipeline* view keeps it in. The house rows are the evidence
that verify, settle, ledger, and alerting all work end to end; they are
just not sales. Deleting them buys you nothing and costs you your only
proof.

The same split applies to counts. "Settlements this week" is a pipeline
number. "Customers this week" is a revenue number. Say which one you
mean.

## State it in public copy

When the only settlements on record are yours, write that down where
someone reading your README will see it. Ours says exactly that: *both
settlements on record are **our own test calls**; no third party has
paid yet.* It costs nothing to say and it is the difference between a
proof-of-life and a claim of traction.

Two rules that follow from it:

- **Never let a drill masquerade as a sale.** Not in a tile, not in a
  screenshot, not in a launch post.
- **Disclose your own services when you cite them.** If your worked
  example buys from an endpoint you own — as
  [Step 1](/guides/payments/give-your-agent-five-dollars/) does — say so
  on the page, next to the number.

## Checklist

1. `HOUSE_PAYERS` exists in config, holds every address your drills
   spend from, on every rail, and contains no keys.
2. The comparison lowercases both sides.
3. The flag is derived in exactly one place — at verify time — and
   passed down.
4. The ledger has a `house` column, written with the settlement.
5. Every x402 analytics event carries `house`, not just the settlement
   event.
6. Alerts frame house settlements quietly and third-party ones loudly.
7. Revenue tiles filter `house = true` out; pipeline views keep it.
8. Public copy states plainly when the settlements on record are your
   own.
