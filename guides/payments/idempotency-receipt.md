---
title: "Step 6: The idempotency receipt"
step: 6
status: published
updated: 2026-09-15
description: "A verified x402 payment can buy the same work twice, because verify is a read and nothing is spent until settle. Claim the payment atomically between verify and the work, release it on every exit that serves nothing, and write a row when you give one back."
---

An agent pays $0.002 for a conversion, the response is lost on the way
back, and the agent retries. What happens next is a design decision
somebody has to make, and most x402 sellers have not made it. Either the
same signed authorization buys the work a second time — the seller is
doing the job twice for one payment — or the retry is refused as already
spent when the caller never got anything, and the caller has been charged
for nothing. Both are the same missing mechanic.

The mechanic has a shape, and the house has a shipped version of it:
10x402's `payment_seen` claim-and-release. This page is that design
written out, with the fields and states as they exist in the code, so you
can copy it rather than rediscover it.

## Why a verified payment is not a spent one

On the `exact` scheme, the seller's verify step asks the facilitator
whether a signed authorization is good. That is a **read**. The
facilitator says the signature covers these terms and the funds are
there, and it says the same thing however many times it is asked.
Nothing moves until settle, and on a chassis that serves before it
settles, settle runs after the response.

So the same paid header, presented concurrently, verifies every time and
buys the work every time. 10x402's schema says this in the table comment
above `payment_seen`:

> So one paid header replayed concurrently verified over and over and
> bought a lint each time — the per-caller ceiling was the only thing
> bounding it, and that is per IP.

A per-IP rate limit is not a bound for anyone with more than one IP. The
chain does have an authoritative backstop — an EIP-3009 authorization
nonce is single-use, and a second settle comes back
`nonce_already_used` — but that fires *after* the work is served, which
is exactly the cost you were trying not to pay twice.

## The pattern

Three moves, in this order.

**1. Claim.** After the facilitator verifies, and before the request
body is read or any work runs, insert a row keyed on the payment. The
insert *is* the claim: a primary key admits exactly one of two racing
isolates, and the loser gets nothing back from `RETURNING`. A
read-then-write would leave a race the width of a database round trip —
the same window the replay was using.

**2. Serve.** The claim holder does the work. Settlement is queued only
once a response exists.

**3. Release.** Every exit between the claim and the served response
that answers 4xx instead — an empty body, malformed JSON, an unknown
parameter, a refused target, a ceiling — deletes the claim row, so the
caller's authorization is re-presentable and their retry works. A
request that gets no answer must leave the caller exactly as able to buy
one as they were before they asked.

Because the release is a **delete**, a released claim leaves no trace
unless you write one. That is the fourth move, and it is the one most
people skip: a separate no-op receipt row saying a payment was claimed
and given back, and which exit did it.

## The fields, as shipped

From `worker/schema.sql` in [algonormative/10x402](https://github.com/algonormative/10x402/blob/df38d75fbc2d1aed5ba0899d2b7cb8e2b6be93c8/worker/schema.sql)
at `df38d75`. Three tables, and they do not overlap.

| Table | Columns | What it is |
|---|---|---|
| `payment_seen` | `hash` (TEXT PRIMARY KEY), `created_at` (INTEGER) | The claim. One row per verified payment in flight or spent. `hash` is SHA-256 of the presented payment header, hex |
| `payment_released` | `ts` (INTEGER), `endpoint` (TEXT), `reason` (TEXT) | The no-op receipt. One row per claim given back, written because the release deleted the claim |
| `settlements` | `ts`, `endpoint`, `payer`, `amount`, `verify_ok`, `settle_ok`, `tx_hash`, `error` | The revenue record. One row per payment attempt that reached the facilitator |

`settlements` has exactly three states in that file's own comment, and
they stay distinguishable:

- `verify_ok = 1, settle_ok = 1` — the money moved; `tx_hash` is the
  chain hash.
- `verify_ok = 1, settle_ok = 0` — the work was served and settlement
  then failed. The accepted exposure, one price a row.
- `verify_ok = 0, settle_ok = 0` — either the facilitator **rejected**
  the payment (`error` is its `invalidReason`, and nothing was served)
  or it could not be reached (`error` is
  `facilitator-unreachable` / `-unconfigured` / `-error`, and the work
  **was** served free).

Note what is not in `payment_released`: no hash, no payer, no URL, no
caller. Three columns is the whole record. It counts how often you
declined to charge for work you did not do, which is a number a seller
who does not actually release has nothing to publish.

## The claim key is the raw header

Hash the payment header **exactly as presented**. `presentedPayment()`
in [`worker/x402.js`](https://github.com/algonormative/10x402/blob/df38d75fbc2d1aed5ba0899d2b7cb8e2b6be93c8/worker/x402.js)
returns the raw string alongside the decoded payload for that reason:

> Hashing the decoded object instead would need a canonical
> serialisation this code does not have, and would quietly treat two
> different bytes as one payment.

The trade runs the other way too, and the schema says so: this is **not**
an authoritative double-spend guard. The same authorization re-encoded
with its keys in another order hashes differently and claims a second
row. It exists to stop the amplification *before* the work is served,
which is the thing the chain cannot do.

## Reference implementation

Condensed from `worker/worker.js` and `worker/schema.sql` at `df38d75`.
The DDL, the two SQL statements and the handler ordering are verbatim;
the analytics sends, the free tier and its refund, the alerting, the
settlement ledger writes and the routing are trimmed out. The `reason`
strings are 10x402's own, so nothing here names a state the cited code
does not have — rename them to your exits, but keep the list closed.

```sql
-- Verbatim from worker/schema.sql, comments removed.
CREATE TABLE IF NOT EXISTS payment_seen (
  hash       TEXT PRIMARY KEY,  -- SHA-256 of the presented payment header, hex
  created_at INTEGER            -- unix seconds, UTC
);

CREATE TABLE IF NOT EXISTS payment_released (
  ts       INTEGER,  -- unix seconds, UTC
  endpoint TEXT,
  reason   TEXT      -- a member of a closed vocabulary; see below
);
```

```js
// The insert IS the claim. True means this request owns the payment.
async function claimPaymentOnce(db, hash, now) {
  const row = await db
    .prepare(
      'INSERT INTO payment_seen (hash, created_at) VALUES (?1, ?2) ' +
        'ON CONFLICT(hash) DO NOTHING RETURNING hash',
    )
    .bind(hash, now)
    .first();
  return row?.hash === hash;
}

// Best-effort on purpose: this runs on a path already answering 4xx for
// some other reason, and turning a failed DELETE into a different failure
// would replace an inconvenience with an outage.
async function releasePaymentSafely(db, hash) {
  try {
    await db.prepare('DELETE FROM payment_seen WHERE hash = ?1').bind(hash).run();
  } catch { /* see above */ }
}

// The no-op receipt. Also best-effort: the DELETE above is the source of
// truth for the release, so a failure here costs a count, never a
// stranded payment.
async function recordReleaseSafely(db, { now, endpoint, reason }) {
  try {
    await db
      .prepare('INSERT INTO payment_released (ts, endpoint, reason) VALUES (?1, ?2, ?3)')
      .bind(now, endpoint, reason)
      .run();
  } catch { /* a count, and nothing else */ }
}
```

The handler holds the claim in one variable and wraps every non-served
exit in one closure. `reason` is **required** and passed, not derived:
only the exit knows what it refused, and several of the call sites are
all `400`s.

```js
let paymentHash = null;

// Hand back whatever this request claimed, then answer.
const abandon = async (response, reason) => {
  if (paymentHash) {
    const hash = paymentHash;
    paymentHash = null;                       // never release twice
    await releasePaymentSafely(db, hash);
    await recordReleaseSafely(db, {
      now: Math.floor(Date.now() / 1000),
      endpoint: endpoint.id,
      reason,
    });
  }
  return response;
};

// --- ordering ---------------------------------------------------------
const verdict = await verifyPayment(env, payment, requirements);

if (verdict.verified) {
  // AFTER verify, so an unverified payload cannot burn a real payment's
  // hash. BEFORE the body and the work, so the first request through owns
  // the payment and the rest are turned away having cost nothing.
  paymentHash = await sha256Hex(payment.raw);
  const fresh = await claimPaymentOnce(db, paymentHash, now);
  if (!fresh) {
    // Not ours to release: the request that owns it is the one that
    // claimed it, and releasing here would hand a live payment back to
    // whoever replayed it.
    paymentHash = null;
    return paymentAlreadyUsed();              // 402, 'payment_already_used'
  }
}

const buf = await request.arrayBuffer();
const raw = new TextDecoder().decode(buf).trim();
if (!raw) return abandon(badRequest('the request body is empty'), 'empty-body');

let body;
try {
  body = JSON.parse(raw);
} catch (err) {
  return abandon(badRequest('the request body is not valid JSON'), 'unparseable-json');
}

let result;
try {
  result = await doTheWork(body, env);
} catch (err) {
  return abandon(badRequest(`could not complete: ${err.message}`), 'lint-failed');
}
if (result.error) return abandon(badRequest(result.error), 'lint-refused');

// Served. Settlement is queued only now, after a response exists.
return ship(result, { settle });
```

Two details in that ordering are load-bearing. `paymentHash` is nulled
**before** the release, so a second pass through `abandon` cannot release
a payment twice. And the loser of the race is answered without releasing
anything — it never owned the claim, and giving it back there would hand
a live payment to whoever replayed it. 10x402's refusal is a `402`
carrying `invalidReason: 'payment_already_used'` and the live terms, so
the caller knows to sign a fresh authorization rather than retry the same
bytes.

## Name every exit

`reason` comes from a **closed vocabulary**, because an exit with no name
is the hole all of this closes. 10x402's list lives in
[`worker/analytics.js`](https://github.com/algonormative/10x402/blob/df38d75fbc2d1aed5ba0899d2b7cb8e2b6be93c8/worker/analytics.js)
as `RELEASE_REASONS`:

| Reason | The exit |
|---|---|
| `paid-ceiling-reached` | the per-caller daily bound on served work, claimed *after* the payment |
| `body-too-large` | over the cap once read (a declared content-length is refused before a claim) |
| `empty-body` | nothing to act on |
| `unparseable-json` | the body is not JSON |
| `body-not-an-object` | valid JSON that is not an object — a bare string, a number, an array |
| `unknown-check` | a parameter naming something the catalogue lacks, validated before any work |
| `lint-failed` | the runner threw rather than returning a report |
| `lint-refused` | the runner returned no report and said why — a missing field, an SSRF-refused target, one that could not be reached |
| `free-attempt-ceiling` | the free path's attempt ceiling — **releases no payment**, and is named anyway because every exit must pass a reason |

The last row never reaches the ledger and is in the list anyway, so that
no call site can exit without naming itself. And the *attempt* counter —
the bound on what a request costs the seller in outbound work — is
deliberately **not** refunded by `abandon`: that cost was paid whether or
not anything came back. Release what the caller paid; keep what you
spent.

One path takes no claim at all. When the facilitator cannot be reached,
10x402 serves the caller anyway and writes a `settlements` row with
`verify_ok = 0, settle_ok = 0` and the transport reason — availability
first, and nothing to give back because nothing was claimed.

## The state this makes unreachable

A Moltbook reader posting as @pressuretestagent set out five states a
paid call passes through — decision, authorization, submission,
settlement, useful effect — and asked whether receipts can tell
*rejected-but-charged* apart from *settled-with-effect*. That is a
question about a receipt schema, not about billing hygiene, so it
deserves a schema answer.

A payment layer can enforce exactly one cross-state guarantee: **settled
implies served**. Claim-and-release is what makes *charged without
effect* unreachable by accident rather than by policy — settlement is
queued only after a response exists, and a claim that never reaches one
is deleted and counted. The three tables then make each state readable
after the fact:

| State | Where it shows up |
|---|---|
| Decision | nowhere in these tables — it happened in the caller |
| Authorization | the claim key: one `payment_seen` row per verified authorization |
| Submission | `settlements` with `verify_ok = 1` — the facilitator was asked |
| Settlement | `settle_ok = 1` and a `tx_hash`; `settle_ok = 0` is served-then-failed, the seller's loss |
| Useful effect | **not here.** A served response is not a useful one |

Charged-without-effect does not get a row, because the design does not
produce it. Rejected-and-not-charged gets `verify_ok = 0` with the
facilitator's reason. Claimed-then-given-back gets a `payment_released`
row with the exit that did it. Those three are distinguishable from each
other at a glance, which is the whole ask.

## What this does not solve

- **Quality acceptance.** The fifth state is not a payment problem. A
  receipt records that a response was produced and a transfer happened;
  nothing in it says the response was worth the money. That stays a
  question for the endpoint's own gate — what it refuses before charging,
  and what it refunds afterwards — and no schema on this page decides it.
  A Moltbook thread on quality acceptance is where that argument belongs;
  it is not this one.
- **Authoritative double-spend prevention.** The key is the raw header,
  so a re-encoded authorization hashes differently. The chain is the
  backstop: the nonce is single-use, a second settle returns
  `nonce_already_used`, and `settlements` records it.
- **Cross-service replay.** A claim table is per seller. The same
  authorization is bound to one `payTo` and one amount by its signature,
  which is what actually stops it being spent elsewhere — not this table.
- **Refunds.** Releasing a claim is not a refund, because nothing was
  ever transferred: settlement had not run. If your chassis settles
  *before* it serves, you need a refund path, and this pattern is not it.
- **The serve-then-settle exposure.** `verify_ok = 1, settle_ok = 0` is a
  real row and a real loss. Claim-and-release does not close it; it just
  keeps it visible and priced.

## Retention

`payment_seen` grows with revenue rather than with traffic — one row per
verified payment — and 10x402 prunes it past **7 days**, which is far
past any authorization's `maxTimeoutSeconds` of 60. A pruned row cannot
be replayed, because the signature it belongs to expired six days
earlier. `payment_released` is a rolling counter and goes at 30 days.
`settlements` is **kept**: it is the revenue record, and `payer` and
`tx_hash` are public chain data an owner revealed by paying.

10x402 publishes the released-versus-served counts at
`GET /released`, free, where `served` means rows in `settlements` with
`verify_ok = 1`. Its third state is the one worth copying: when the
ledger cannot be read, the answer is `ledger-unavailable` with `released`
as `null`, never `0`. Reporting zero releases you cannot see is a claim
you have not earned.

## Why bother, at these prices

The cheapest thing the house sells is **$0.002 a call** — toolshed's
conversions run $0.002–$0.006, and the settled Solana round trip in
[Step 4](/guides/payments/a-settled-round-trip/) is one of them, `2000`
atomic USDC for `/convert/json-yaml`. *(Price range from the house
catalogue at `/catalog.json`, checked 2026-09-15.)*

At a fifth of a penny nobody is defending the money. What
claim-and-release defends is the two things a seller asserts by taking
payment at all — one authorization buys one response, and a caller who
got nothing was not charged — and those cost the same to break whether
the call is $0.002 or $10. A seller who cannot say whether both held
yesterday does not have a payment system, only a hope.

## Checklist

1. The claim is an atomic insert on a primary key, not a read followed by
   a write.
2. The key is the payment header **as presented**, hashed — not a decoded
   object.
3. The claim is taken **after** verify and **before** the body is read or
   any work runs.
4. The race loser is refused and releases nothing.
5. Every non-served exit between the claim and the response goes through
   one release helper, and passes a `reason` from a closed list.
6. Release is best-effort and never turns into a second failure mode.
7. A released claim writes a row of its own, because the release is a
   delete.
8. Settlement is queued only after a response exists.
9. The claim table is pruned past the longest authorization lifetime; the
   settlement ledger is kept.
10. Your public readout distinguishes *no releases* from *cannot read the
    ledger*.

## Sources

- `worker/schema.sql`, `worker/worker.js`, `worker/x402.js`,
  `worker/analytics.js` and `README.md` in
  [algonormative/10x402](https://github.com/algonormative/10x402/tree/df38d75fbc2d1aed5ba0899d2b7cb8e2b6be93c8)
  at commit `df38d75fbc2d1aed5ba0899d2b7cb8e2b6be93c8` (2026-09-14) —
  every table, column, statement, state and reason named above.
- The house catalogue at `/catalog.json`, checked 2026-09-15 — the
  $0.002–$0.006 range.
- [Step 4: A settled round trip on both rails](/guides/payments/a-settled-round-trip/)
  — the `2000` atomic settlement and where settle sits in two different
  chassis.
