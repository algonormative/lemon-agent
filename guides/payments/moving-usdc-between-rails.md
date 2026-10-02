---
title: "Step 3: Moving USDC between rails"
step: 3
status: published
updated: 2026-09-05
description: "Your agent holds USDC on one chain and the thing it wants to buy prices on another. Circle's CCTP burns on the source and mints on the destination — the routes for Base, Solana and Polygon, the wait, the fees, and the two ways it stalls."
---

Every route, fee, and wait time below was checked against Circle's own
documentation or a live Circle API endpoint on **2026-09-05**. Where
Circle documents nothing, this page says so.

[Step 1](/guides/payments/give-your-agent-five-dollars/) leaves an agent
with USDC on Base. Then it meets an endpoint that prices in USDC on
Solana, or on Polygon, and the money is on the wrong rail. That is a
different problem from funding, and it has one first-party answer.

## The documented path: CCTP

Circle's Cross-Chain Transfer Protocol moves native USDC by **burning it
on the source chain and minting it on the destination** — not by wrapping
it, and not through a third party's liquidity
([technical guide](https://developers.circle.com/cctp/references/technical-guide)).
Circle describes the flow in three steps
([Forwarding Service](https://developers.circle.com/cctp/concepts/forwarding-service)):

1. Burn USDC on the source chain and wait for Circle to sign an attestation.
2. Request the attestation from the Circle API.
3. Mint USDC on the destination chain.

Circle's attestation service is called Iris. Mainnet is
`https://iris-api.circle.com`; testnet is
`https://iris-api-sandbox.circle.com`
([technical guide](https://developers.circle.com/cctp/references/technical-guide)).
You poll it with the burn transaction hash and the **source domain** — a
Circle-issued chain identifier that is not the public chain ID
([supported blockchains and domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains)):

```sh
curl -sS "https://iris-api.circle.com/v2/messages/6?transactionHash=<burn tx hash>"
```

The pattern — `/v2/messages/{sourceDomain}?transactionHash=`, polled
until `status` reads `complete` — is Circle's own, from its
[Solana quickstart](https://developers.circle.com/cctp/quickstarts/transfer-usdc-solana-to-arc).

**What the agent needs, minimum:** USDC on the source chain; the
destination address in the destination chain's own form (see the Solana
section — it is not the wallet address there); the two domain IDs; and,
because steps 1 and 3 are separate transactions, *a wallet that can sign
on both chains and native gas on both*
([Forwarding Service](https://developers.circle.com/cctp/concepts/forwarding-service)).
Circle's Forwarding Service removes the second half — it broadcasts the
destination mint for you — for a service fee of **$0.05** on all
destinations outside the HyperCore routes, plus a dynamically quoted gas
component (same page).

## The three rails, as documented today

| Source chain | Domain | Standard Transfer | Fast Transfer | Fast fee, at source |
|---|---|---|---|---|
| **Base** | 6 | ~65 ETH blocks, **~15–19 min** | 1 block, **~8 s** | 1.3 bps (0.013%) |
| **Solana** | 5 | 32 blocks, **~25 s** | 2–3 blocks, **~8 s** | 1 bps (0.01%) |
| **Polygon PoS** | 7 | 2–3 blocks, **~8 s** | **Not available as a source** | — |

Times and confirmations from
[finality and block confirmations](https://developers.circle.com/cctp/concepts/finality-and-block-confirmations);
domains and Fast Transfer availability from
[supported blockchains and domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains);
fees from [CCTP fees](https://developers.circle.com/cctp/concepts/fees).
Every chain in Circle's table, these three included, "**are supported as
destinations**" — so all six directions between Base, Solana and Polygon
exist. Fast Transfer is offered from a source "only when it provides a
meaningful speed improvement", which is why Polygon has none: its
standard attestation is already ~8 seconds.

Base is the slow leg. Leaving Base on a Standard Transfer means waiting
out Ethereum L1 finality — Circle attributes the ~15–19 minutes to OP
Stack chains posting state to L1 roughly every 15 minutes and then
waiting ~65 blocks for that batch to finalize (same page). Arriving *at*
Base has no such wait; only the source chain's finality is in play.

## Fees, exactly

**"CCTP charges fees on Fast Transfers only. Standard Transfers are
free."** The Fast fee is 0–13 bps depending on source chain and is
deducted from the transferred amount when USDC is minted
([CCTP fees](https://developers.circle.com/cctp/concepts/fees)). That is
the protocol fee; chain gas is separate and Circle publishes no figure
for it.

Read the number yourself rather than trusting this page — Circle's own
warning is *"Do not hardcode fee values"*, and asks integrators to call
the fee API at least weekly (same page):

```sh
curl -sS https://iris-api.circle.com/v2/burn/USDC/fees/6/5   # Base → Solana
```

```json
[{"finalityThreshold":1000,"minimumFee":1.3},{"finalityThreshold":2000,"minimumFee":0}]
```

`1000` is Fast, `2000` is Standard; `minimumFee` is in basis points. On
2026-09-05 that endpoint returned 1.3 bps Fast from Base (to both Solana
and Polygon), 1 bps Fast from Solana, and 0 bps Standard on every route
tested. Polygon-sourced routes returned `0` for *both* thresholds even
though the docs mark Fast Transfer N/A from Polygon; why the API answers
at all for a route the docs call unavailable is not documented publicly.
Treat the docs as the contract and Standard as the Polygon path.

When burning, `maxFee` caps what you will pay. **"If the actual fee
exceeds your specified `maxFee`, the transaction will revert on the
source blockchain, and no USDC will be burned"** — Circle suggests
reading the current fee and adding a 10–20% buffer (same page).

## The Solana trap: an address is not an account

On Solana, USDC lives in a token account, not at the wallet address, and
CCTP inherits that. When the destination is Solana, `mintRecipient` must
be **the recipient's USDC Associated Token Account (ATA), not the
recipient's wallet address**
([Forwarding Service](https://developers.circle.com/cctp/concepts/forwarding-service)).
And the account has to be there first: *"The token account must exist at
the time `receiveMessage` is called on Solana or else this instruction
will revert"*
([Solana programs](https://developers.circle.com/cctp/references/solana-programs)).
Through the Forwarding Service the same gap reads *"If the recipient does
not already have a USDC ATA on Solana, the transfer will fail"* — with an
opt-in fix: pass `includeRecipientSetup=true` to the fee API and encode
the ATA-creation fields in the burn's hook data, and Circle creates the
account (rent included in the quoted fee).

The house met the identical failure from the other direction. From the
house build log, 2026-09-02 (an internal record; there is no public URL):
the penny402 Solana rail was proven at 04:57Z, and the **first buy was
refused because the fresh payTo address had no USDC ATA** — the
facilitator's simulation fails, and it does not create the account. A $1
USDC send to the payTo over Solana created the ATA; the retry settled.
The parallax property recorded the same thing the same day — its Solana
settlement went through only "after creating the payTo's USDC ATA — the
facilitator does not". The house rule that came out of it: **fund the
Solana payTo before advertising the rail.**

Two different systems, one lesson. Whether a given x402 facilitator will
create a destination ATA for you is not documented publicly by any
facilitator we have read; assume it will not, and make the account exist
first.

## Where a transfer stalls

| Failure | What happens | The check |
|---|---|---|
| **Route not supported** | Not every chain is a CCTP domain, and two — Noble (4) and Sui (8) — are CCTP V1 (legacy) only. USDC is "supported on all CCTP domains except BNB Smart Chain" ([domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains)) | Look up both ends in Circle's domain table before signing anything. Base 6, Solana 5, Polygon PoS 7 |
| **Missing destination token account** | Solana destination, no ATA: the mint instruction reverts, or the forwarded transfer fails ([Solana programs](https://developers.circle.com/cctp/references/solana-programs)) | Derive the ATA and confirm it exists — or use `includeRecipientSetup=true` and the ATA-creation hook |
| **`maxFee` set too low** | Reverts on the source chain; no USDC burned ([fees](https://developers.circle.com/cctp/concepts/fees)) | Read the fee API, add Circle's suggested 10–20% buffer |
| **Fast Transfer allowance exhausted** | The allowance is a single global pool across all chains; at zero, "Fast Transfers are temporarily unavailable until the allowance replenishes" ([allowance](https://developers.circle.com/cctp/concepts/fast-transfer-allowance)) | `GET /v2/fastBurn/USDC/allowance` — it answered `54902682.734939` USDC at 2026-09-05T04:15:46Z. Fall back to Standard |
| **The burn expires** | An `expirationBlock` 24 hours out is signed into the message; past it the burn must be re-signed ([technical guide](https://developers.circle.com/cctp/references/technical-guide)) | Not stuck: `POST /v2/reattest/{nonce}`, with "no deadline after which re-attestation becomes unavailable" |
| **Polling too hard** | "The CCTP API service rate limit is 40 requests per second" — exceed it and every request is blocked for five minutes with HTTP 429 (same page) | One poll every few seconds, per transfer |

The mainnet contracts are worth reading before you call them:
`TokenMessengerV2` is `0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d` on
both Base and Polygon PoS, and `TokenMessengerMinterV2` on Solana is
`CCTPV2vPZJS2u2BBsUoscuikbYjnpFmbFsvVuJdgUMQe`
([contract addresses](https://developers.circle.com/cctp/references/contract-addresses),
[Solana programs](https://developers.circle.com/cctp/references/solana-programs)).
Both chains have official testnets — "if a mainnet is listed, its
official testnet is also supported" — and a first crossing is cheap to
rehearse there.

## What Circle does not document

In the register of Step 1: where nothing is published, we say so rather
than round up.

- **A minimum transfer amount.** No page read for this chapter states one.
- **A guaranteed attestation time.** Every number in the finality tables
  is labelled *average time*; nothing commits to a ceiling.
- **The dollar cost of gas** on either leg. Circle says you need native
  tokens on both chains and quotes the Forwarding Service's gas
  dynamically; no figure is published.
- **The size or replenishment schedule of the Fast Transfer allowance
  pool.** The docs give "for example, 10 million USDC"; the live endpoint
  gives a current number, not a policy.
- **Whether an x402 facilitator creates a destination Solana ATA.** The
  house found one that does not (build log, 2026-09-02). No facilitator
  documentation we have read addresses it either way.
- **Why the fee API answers for Polygon-sourced Fast Transfers** when the
  support table marks them N/A.

Other bridges exist. None are covered here, because this page only
carries claims it can cite to first-party documentation, and CCTP is the
one path whose issuer publishes the routes, the fees, and the failure
modes.

**Verified against, 2026-09-05:**
[cctp](https://developers.circle.com/cctp),
[concepts/supported-chains-and-domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains),
[concepts/finality-and-block-confirmations](https://developers.circle.com/cctp/concepts/finality-and-block-confirmations),
[concepts/fees](https://developers.circle.com/cctp/concepts/fees),
[concepts/fast-transfer-allowance](https://developers.circle.com/cctp/concepts/fast-transfer-allowance),
[concepts/forwarding-service](https://developers.circle.com/cctp/concepts/forwarding-service),
[references/technical-guide](https://developers.circle.com/cctp/references/technical-guide),
[references/contract-addresses](https://developers.circle.com/cctp/references/contract-addresses),
[references/solana-programs](https://developers.circle.com/cctp/references/solana-programs),
[quickstarts/transfer-usdc-solana-to-arc](https://developers.circle.com/cctp/quickstarts/transfer-usdc-solana-to-arc),
and [developers.circle.com/llms.txt](https://developers.circle.com/llms.txt)
— each read in its plain-text `.md` form at the same path. Live calls to
`https://iris-api.circle.com/v2/burn/USDC/fees/{6,5,7}/{5,6,7}` and
`/v2/fastBurn/USDC/allowance`. House claims are from the house build log
of 2026-09-02, which is internal and has no public URL.
