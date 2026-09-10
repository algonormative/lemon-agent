---
title: "Step 4: A settled round trip on both rails"
step: 4
status: published
updated: 2026-09-10
description: "Two x402 payments the house already made — one in USDC on Base, one in USDC on Solana — written out step by step with timestamps, amounts and full transaction hashes, and what each step does and does not prove."
---

Plenty of writing explains how x402 works. Very little of it shows a
settled payment end to end — the unpaid request, the 402 challenge, the
signed authorization, the facilitator's verify and settle, the receipt
on chain — with times you can check against a public ledger. This page
is two of ours, one per rail. Nothing was bought to write it: both round
trips settled days before the page existed, in the ordinary course of
putting two endpoints live, and every figure comes from a house record
or a keyless read of the public chain.

**Both are house-to-house payments.** In each case the buyer wallet and
the receiving address are ours, and both buyers are listed as house
payers in the sellers' own config —
[Step 2](/guides/payments/house-traffic-tagging/) is that convention.
They prove the rails settle. They prove nothing about demand.

## Prerequisite on Solana: the payTo's USDC account must exist first

A Solana token balance lives in an associated token account (ATA) owned
by the wallet, and the account for a mint must exist before anyone can
send that token to it. **The CDP facilitator does not create a missing
destination ATA**, so a Solana route whose payTo has never held USDC
cannot be paid at all. The house learned this by hitting it, before the
settlement in Round trip B:

1. A payment went to a payTo with no USDC ATA. CDP's verify answered
   **HTTP 400** with `preflight_validation_failed`, and **nothing
   moved** — on the `exact` scheme for Solana no funds change hands
   until the facilitator submits, so a failed preflight leaves no
   artefact on chain.
2. The ATA was created once, owner-funded, at about **0.00204 SOL** rent.
3. The identical call then settled.

The same refusal appeared on another house property on **2026-09-02 at
04:57Z** and cleared the same way. If you sell on Solana, create the
payTo's USDC account before you advertise the rail. *(House record on
the first Solana settlement, 2026-09-01; house build log, 2026-09-02.)*

## Round trip A — USDC on Base

**parallax402.com `GET /v1/window`, 10000 atomic USDC ($0.01), settled
2026-09-02.** An owner-approved drill against a route that had just gone
live.

**1. Unpaid request → 402.** A `GET` with no payment header returns the
terms: in the JSON body for x402 v1, and base64 in the
`PAYMENT-REQUIRED` response header for v2. The v1 entry for this route:

```json
{
  "scheme": "exact",
  "network": "base",
  "maxAmountRequired": "10000",
  "resource": "https://parallax402.com/v1/window?from=<day>&to=<day>",
  "payTo": "0x790fE337b89900028E16fE63Cc087112F7a2BA49",
  "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "maxTimeoutSeconds": 60,
  "extra": { "name": "USD Coin", "version": "2" }
}
```

*Proves:* price, asset and destination are stated before anything is
signed, and `resource` names what the money is for.
*Does not prove:* that the endpoint will answer. A query naming a window
and getting it wrong is a `400` with nothing settled — a malformed-query
probe returned exactly that on both rails.

**2. The buyer signs an authorization.** On the `exact` scheme for an
EVM chain the buyer signs an EIP-3009 authorization for exactly the
amount and destination in that envelope. It signs; it does not send, and
it pays no gas.
*Proves:* consent to one amount and one recipient.
*Does not prove:* that anything happened. An authorization nobody
submits simply goes unused.

**3. The seller asks the facilitator to verify.** The payload and the
same requirements object go to CDP's `verify`. A verdict can arrive on a
4xx as well as a 200 — read the body, not the status.
*Proves:* the signature covers these exact terms and the buyer can pay.
*Does not prove:* that money moved. Verify is a check, not a transfer.

**4. Settle, then serve.** parallax builds the fact from its own store
before settling — a window it holds no census for is a `404` with
nothing charged — and releases the answer only once the transfer lands.

| Field | Value |
|---|---|
| Transaction | `0x12f31243ae1b27077c8f350c379af10f69df7db16c0fd8f0957218f8d3479071` |
| Block | 50,766,699 |
| Block time | 2026-09-02T04:19:05Z |
| Amount | `10000` atomic USDC — $0.01 |
| From | `0x632ff2f904cc6ab6d741a42014c4c483f328e92f` (house buyer) |
| To | `0x790fE337b89900028E16fE63Cc087112F7a2BA49` (payTo) |
| Status | success |

Read for this page on 2026-09-10 with two keyless JSON-RPC calls against
`https://mainnet.base.org`, and readable by anyone at
<https://base.blockscout.com/tx/0x12f31243ae1b27077c8f350c379af10f69df7db16c0fd8f0957218f8d3479071>.
The receipt carries an authorization-used log and the ERC-20 `Transfer`
of `10000` to the payTo, and the account that submitted it and paid the
gas — `0x42dd53906b49c202e8e934b059dc019e04634b00` — is not the buyer.
*Proves:* the amount, both addresses, the block, the time, and that the
facilitator relays.
*Does not prove:* who controls either address, or that value came back
the other way.

**5. The ledger row.** The seller wrote the settlement to its own ledger
with `house=1`, because the payer is on its `HOUSE_PAYERS` list.
*Proves:* verify, settle, ledger and tagging all ran.
*Does not prove:* revenue — the flag exists so this row is excluded from
any revenue number.

The house task record for this route opened at **2026-09-02T03:52:46Z**
and closed at **04:23:46Z**; the block time falls inside that window.

## Round trip B — USDC on Solana

**toolshed.lemon-agent.dev `/convert/json-yaml`, 2000 atomic USDC
($0.002), settled 2026-09-01T05:20:40Z.** The house's first settled
Solana payment, and where the prerequisite above was learned.

**1. Unpaid request → 402.** The offer carries a Solana entry beside the
Base one: scheme `exact`, network `solana` in v1 (CAIP-2
`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` in v2), amount `2000`, asset
the USDC mint `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`, payTo
`7zXRc8sYkhjezbwXQw43beBrKDmhTMA7mkNfqRjdZ6gw`, and — the field Base
does not have — `extra.feePayer`, the account that pays the network fee.
It is **drawn from a rotating facilitator pool, not a constant**: read
it per protocol version rather than pin it. The registry's copy of this
route's Solana entry, in a full catalogue walk on 2026-09-05, names
`D6ZhtNQ5nT9ZnTHUbqXZsTx5MH2rPFiBBggX4hY1WePM`; that walk found 20
distinct feePayer values across the catalogue.
*Proves:* price and destination are stated up front here too.
*Does not prove:* that the payTo can receive — which is what the first
attempt discovered.

**2. The buyer signs a transaction.** Not an EIP-3009 authorization: on
Solana the buyer signs a transaction the facilitator's feePayer will
co-sign and submit.
*Proves:* consent to one transfer.
*Does not prove:* that it is admissible. Simulation happens later, at
the facilitator.

**3. Verify.** CDP verified the payload against the same requirements
the 402 advertised. Ledger `verify_ok=1`.
*Proves:* the payload matched the advertised terms.
*Does not prove:* settlement — the failed first attempt stopped here.

**4. Serve, then settle.** The toolshed chassis is ordered the other way
round from parallax: the caller gets the conversion, and the settlement
runs after the response. A conversion is cheap and
re-derivable; a paid *fact* is not, which is why parallax withholds
until the transfer lands. Ledger `settle_ok=1`.
*Proves:* the ordering is a deliberate choice, not an accident.
*Does not prove:* that either order is right for your product.

**5. The receipt.**

| Field | Value |
|---|---|
| Signature | `4C4EMmWv7dFA679fhfGXV9rC4K3veqLYJVgJ2UqfYUojH1RN1y3xUhpLt5HeGX7aiP7CCGPjRxpW4NTyKAhUThLN` |
| Slot | 443,342,687 |
| Block time | 2026-09-01T05:20:40Z |
| Buyer USDC account | `CosTwK5g9kw5URsUtT725BYoYfC5nYKiT6ZceRDfWeKq`, 5.000000 → 4.998000 |
| Recipient account | 0.000000 → 0.002000, freshly created |
| Amount | `2000` atomic USDC — $0.002 |

Those figures come from the house record's own chain read of
**2026-09-04** against `https://api.mainnet-beta.solana.com`. The read
attempted for this page on 2026-09-10 was rate-limited by that public
endpoint and not retried, so the slot and block time here are the
record's rather than a fresh confirmation; the transaction is public at
<https://explorer.solana.com/tx/4C4EMmWv7dFA679fhfGXV9rC4K3veqLYJVgJ2UqfYUojH1RN1y3xUhpLt5HeGX7aiP7CCGPjRxpW4NTyKAhUThLN>.
That earlier read also corroborated the failed first attempt the only
way a chain can corroborate a non-event: the buyer account's whole
history contains no errored transaction.

## What these two receipts prove, and what they do not

They prove that both rails settle end to end on the same chassis against
the same facilitator; the amount, asset, payer and payee of each
transfer at a named block and time, checkable without an account or a
key; that the order of operations is observable, and that a seller
chooses where "serve" sits in it; and that on Solana the ATA
precondition is a hard gate whose failure mode is a verify-time refusal
rather than a lost payment. They do not prove:

- **Demand.** Both are house-to-house; no third party is involved.
- **That the buyer got value.** A receipt records a transfer, not
  whether the response was worth $0.01.
- **Anything about facilitator fees.** These receipts name none; the
  house build log for 2026-09-02 records no settlement fee observed on
  that day's on-chain receipts, a separate observation from these two
  transactions.
- **That the endpoints still behave this way.** Prices, routes and
  chassis change; the chain records those two days.

If you sell over x402, the cheapest honest thing you can publish is one
settlement in full, with the parts you cannot vouch for marked as such.

## Sources

Internal records have no public URL and are named rather than linked.

- **House record, first Solana settlement, 2026-09-01** — signature,
  slot, block time, balances, the `preflight_validation_failed` first
  attempt, ATA rent, the rotating feePayer pool, and the 2026-09-04
  chain read confirming them.
- **House campaign ledger, E18, 2026-09-02** — the Base drill: verify,
  settle, transaction hash, `house=1`, the malformed-query probe.
- **House task record for the route, 2026-09-02** — the drill's open and
  close times, 03:52:46Z and 04:23:46Z.
- **House build log, 2026-09-01 and 2026-09-02** — the estate-wide
  Solana proving run, the second ATA refusal at 04:57Z, the
  no-settlement-fee observation.
- **Registry catalogue walk, 2026-09-05** — the Solana offer entry for
  `/convert/json-yaml`, and 20 distinct feePayer values.
- **Public chain, read 2026-09-10** — Base block number, block time,
  transfer amount, both addresses, the submitting account, status.

Truncated hashes in the internal records are omitted here rather than
shown in part: a receipt you cannot look up is not a receipt.
