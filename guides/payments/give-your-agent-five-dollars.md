---
title: "Step 1: Give your agent $5 and let it buy something"
step: 1
status: published
updated: 2026-09-02
description: "Fund an agent wallet with $5 of USDC on Base, cap what it can spend per call and per day, and make one real quarter-penny purchase you can read back on-chain."
---

Every price, cap, and version below was checked against a live endpoint,
a shipped package, or a first-party doc on **2026-09-02**. Where a vendor
documents nothing, the table says so.

## Look before you pay

Start with a free call. A well-built x402 service tells you what it sells
before it asks for money:

```sh
curl -sS https://penny402.fun/penny | jq '.attractions[] | {id, path, price}'
```

Then read the price without paying it. An unpaid request to a paid route
returns `402` with the terms in the body:

```sh
curl -sS -X POST https://penny402.fun/oracle \
  -H 'content-type: application/json' -d '{}' | jq '.accepts[0]'
```

```json
{
  "scheme": "exact",
  "network": "base",
  "maxAmountRequired": "2500",
  "resource": "https://penny402.fun/oracle",
  "payTo": "0x9d0bb5dA24cADe855DeE8d1231A1c416e0bB2FFe",
  "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "maxTimeoutSeconds": 60,
  "extra": { "name": "USD Coin", "version": "2" }
}
```

`maxAmountRequired` is in atomic units. USDC has 6 decimals, so `2500` is
$0.0025 — a quarter of a penny. Read that number yourself before you let
anything sign for it.

**Disclosure: penny402 is our own service.** It is used here because we
control it, know what it charges, and can point you at the settlement.
Every technique on this page works against any x402 endpoint.

## Who this is for

You run an agent — Claude Code, Cursor, Codex, a script you wrote — and
you want it paying for things on its own. Not many things. Five dollars
of things, on Base, in USDC, under a cap you chose. You don't need to
understand blockchains; you need about five details right, and this page
is those five.

## Four routes, compared

| Route | Steps | Custody | Minimum | Fees | Spend control | Best when |
|---|---|---|---|---|---|---|
| **AgentCash credit** | `npx agentcash@latest onboard` | **Yours.** Keys at `~/.agentcash/`, mode `600`; their docs say it plainly — *"Private keys are stored in plaintext on disk"* | "There is no minimum balance requirement." Onboarding pays a socially-scored bonus of **up to** $25 in USDC on Base — a claim code, not a flat grant | No take rate or markup published anywhere in their docs; no pricing page exists (checked 2026-09-02) | One documented cap: `--max-amount <usd>` on `agentcash fetch`, per call | You want to be paying for something in five minutes, and a plaintext key file on your laptop is an acceptable risk for $5 |
| **Own CDP server wallet + `@x402/fetch`** | API key → `new CdpX402Client()` → fund the address → wrap `fetch` | Coinbase holds the signing key; the account and the money are yours | Whatever you send | Coinbase charges "a fee based on our estimate of the prevailing network fees" on on-chain sends, "disclosed at the time of the transaction" ([fee disclosures](https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees)) — read it off Preview Send. No per-call fee after that | `spendControls` in the SDK: per-payment cap, cumulative cap, time window, network allowlist | **Recommended.** You want the wallet, the caps, and the receipts to be yours, and no key file on disk |
| **Poncho** | Sign up, then opt into Advanced | Free/Pro hold nothing for you — those wallets are "an implementation detail". The paid **Advanced** wallet is "user-controlled wallet infrastructure" via Privy or another provider; Merit "does not take custody" ([Terms §4](https://tryponcho.com/tos), 2026-06-09) | Not documented publicly (checked 2026-09-02) — the word *minimum* appears nowhere in their terms | Free tier; Pro $20/mo; Team $20/seat/mo. Premium tools are usage-billed through AgentCash, and "every premium tool quotes its price before it runs" | Optional per-member spend limits, Team tier only. No per-call or per-day cap documented; the pre-run quote and your confirmation are the actual guard | You want a marketplace of pre-integrated tools rather than raw endpoints |
| **Coinbase account → your own key** | Buy $5 USDC, withdraw on Base to a key you generated | Entirely you, including the failure modes | Not documented publicly for the retail app (checked 2026-09-02). Coinbase *Exchange* — a different product — publishes `0.01` USDC on Base through its [currencies API](https://api.exchange.coinbase.com/currencies/USDC) | Same estimated network fee, disclosed on the same preview screen | Only what you code | You already run a wallet and want no third party in the middle |

**Spend controls are the least documented part of this market** —
AgentCash's marketing page advertises per-call, per-task, and total
ceilings its own reference docs never define. Treat any cap you haven't
found in an API reference as absent. Rows 2 and 4 share the same funding
step: the table is about *who holds the money*, and the mechanics below
are the same either way.

## The recommended path, end to end

**1. Get CDP credentials.** Create an API key at
<https://portal.cdp.coinbase.com/access/api>, and create a Wallet Secret
in the same portal. Three values go in your environment:

```sh
export CDP_API_KEY_ID="..."
export CDP_API_KEY_SECRET="..."
export CDP_WALLET_SECRET="..."
```

**2. Install and provision the wallet.** The x402 packages are optional
peer dependencies of the CDP SDK — install them explicitly:

```sh
npm install @coinbase/cdp-sdk @x402/core @x402/evm @x402/fetch
```

```js
import { CdpX402Client } from '@coinbase/cdp-sdk/x402';

// Pass { environment: "development" } to use Base testnet instead.
const client = new CdpX402Client();
const { evmAddress } = await client.getAddresses();
console.log('Fund this address:', evmAddress);
```

`getAddresses()` provisions the wallet eagerly — a CDP Server Wallet
named `x402-client-wallet-1` — rather than waiting for the first payment,
which is what you want when the next step is sending it money. The
default is Base mainnet: real money.

**3. Send it $5 of USDC on Base.** In the Coinbase app: buy $5 of
**USDC**, choose Send, paste the `evmAddress` above, and — the step that
matters — set the **network dropdown to `Base`**, not Ethereum, not
Solana. Confirm the asset reads `USDC`, not `USDbC`.

Use **Preview Send** and read the fee there. Coinbase charges an
estimated network fee on on-chain sends, disclosed at transaction time;
no first-party page documents a Base-specific fee, a retail minimum, or a
settlement time. The "free USDC sends on Base" quoted around the web
belong to Coinbase Wallet or Coinbase International Exchange, not the
retail app. Believe the confirmation screen, not a figure quoted
elsewhere — this page included.

**4. Confirm it arrived.** Do not trust the app; read the chain at
`https://base.blockscout.com/address/<your address>`. You want a `USDC`
token balance on that page. If it is empty, the money is somewhere else —
read the next section before sending more.

**5. Wrap fetch and pay.**

```js
import { wrapFetchWithPayment } from '@x402/fetch';

const fetchWithPayment = wrapFetchWithPayment(fetch, client);
```

## Five ways to lose the $5

| Mistake | What happens | The one-line check |
|---|---|---|
| **Wrong chain** | You pick Ethereum or Solana in the withdraw dropdown. The USDC exists, at your address, on a chain your x402 client is not registered for | Before confirming, the network dropdown must read **Base** |
| **USDbC instead of native USDC** | Bridged USDC on Base (`USDbC`, `0xd9aAEc86…`) is a different contract from native USDC (`0x833589fC…`). `@x402/evm@2.24.0` ships exactly one default asset for `eip155:8453`, and spend controls reject anything else unless you opt in via `allowedAssets`. [Circle's own warning](https://www.circle.com/blog/usdc-now-available-natively-on-base) is blunter: do not send bridged USDbC to a Circle Mint account, "as it may not be recoverable and could result in a loss of funds" | The token on your Blockscout page must read `USDC` at `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` — the same address the 402 names |
| **Buying ETH "for gas"** | Probably wasted. On the exact/EIP-3009 path the [x402 spec](https://github.com/x402-foundation/x402/blob/main/specs/schemes/exact/scheme_exact_evm.md) says the facilitator pays the gas and "cannot modify the amount or destination"; your wallet only signs. penny402's payTo address holds a `0` ETH balance and has been paid many times. (x402's FAQ has one line advising ETH for gas on mainnet; in context it is ambiguous whose wallet it means. A few cents of ETH costs nothing if you want the hedge) | Fund with USDC first, pay once, and only add ETH if that call actually fails |
| **Key in the wrong place** | A wallet secret in a repo, a chat message, a CI log, or a `.env` you later commit | `CDP_WALLET_SECRET` lives in your shell or an ignored `.env`, never in an argument, never pasted to a service |
| **Paying a spoofed resource URL** | A 402 envelope names its own `resource` and `payTo`. A hostile or proxied response can name a URL you never called | Assert `accepts[i].resource` equals the URL you requested before signing — and log the `payTo` you paid |

## Spend control

Two caps, both from the shipped SDK, both worth setting before the first
call. Verified against `@coinbase/cdp-sdk@1.55.0`:

```js
import { CdpX402Client, SpendControlError } from '@coinbase/cdp-sdk/x402';

const USDC_BASE = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

const client = new CdpX402Client({
  spendControls: {
    maxAmountPerPayment: { atomic: 10_000n, asset: USDC_BASE },   // $0.01
    maxCumulativeSpend:  { atomic: 50_000n, asset: USDC_BASE },   // $0.05
    maxCumulativeSpendWindow: '24h',
    allowedNetworks: ['eip155:8453'],
  },
});
```

A blocked payment throws `SpendControlError` with a machine-readable
`code`. Two honest caveats: the cumulative ledger's default store is
**in-memory**, so a per-day cap does not survive a process restart unless
you pass a persistent `store`; and these are client-side caps, so they
bound what *this client* signs, not what the key could sign elsewhere.

Without the CDP client, the equivalent lives in `@x402/core`'s
`x402ClientConfig.spendControls`, where `maxAmountPerPayment` is a
**dollar string** rather than atomic units:

```js
const client = x402Client.fromConfig({
  schemes: [{ network: 'eip155:*', client: new ExactEvmScheme(signer) }],
  spendControls: { maxAmountPerPayment: '$0.01' },
});
```

It defaults to `"$1"` per payment, and only assets the library recognizes
as USD-pegged defaults are allowed — which is why USDbC pays for nothing.

Watch the version. The older `x402-fetch@1.2.0` had a different shape:
`maxValue` as a positional `bigint`, defaulting to `100000n` ($0.10).
**If a tutorial hands you `maxValue`, it is a v1 tutorial** — and v1 is
["deprecated and will only receive security patches"](https://github.com/x402-foundation/x402/blob/main/typescript/packages/legacy/x402-fetch/README.md).

**The cap that actually holds is the balance.** Keep the agent's wallet
at $5. A cap you wrote in code is a bug away from wrong; a wallet with $5
in it cannot spend $50.

## The worked example

One real purchase, $0.0025, USDC on Base:

```js
const res = await fetchWithPayment('https://penny402.fun/oracle', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ question: 'should I ship it?' }),
});
console.log(await res.json());
```

The response body's shape, as the endpoint's own 402 advertises it:

```json
{
  "fortune": "A short oblique line, drawn for your address and this date.",
  "question": "should I ship it?",
  "date": "2026-09-02",
  "payer": "0x0000000000000000000000000000000000000000",
  "mechanic": "the oracle answers the day, not the question — yet"
}
```

`payer` is your wallet. The reading is keyed to it and stable until
midnight UTC, so the same wallet asking twice today gets the same line —
itself a check that you paid as who you think you are.

Now read your own settlement at
`https://base.blockscout.com/address/<your address>`, newest ERC-20
transfer out: a `USDC` transfer of `2500` to
`0x9d0bb5dA24cADe855DeE8d1231A1c416e0bB2FFe`. Click through to
`https://base.blockscout.com/tx/<hash>`. That link is the thing worth
keeping — a receipt nobody has to take your word for.

## What to buy next

Honest prices, all ours, all disclosed as ours:

- **[lemon-toolshed](https://toolshed.lemon-agent.dev)** — file and
  format conversions, $0.002–$0.006 a call; `/convert/md-html` quotes
  `4000` atomic ($0.004). No free tier.
- **[10x402](https://10x402.com)** — x402 conformance lint. `GET /check`
  is free and lists every check and price; `POST /lint/envelope/one` is
  $0.004, `POST /lint` is $0.10.
- **[kino402](https://kino402.com)** — video generation and TTS.
  `GET /v1/models` is free and carries the price formulas; the prompt
  compiler is a flat $0.008; renders are priced per model.
- **[parallax](https://parallax402.com)** — x402 market data from the
  settlement graph. `GET /v1/stats` is free; per-fact endpoints like
  `/v1/seller` quote `30000` atomic ($0.03).

Don't let the list end with us. The public catalogs hold the rest of the
market: the **CDP Bazaar** index
(<https://docs.cdp.coinbase.com/x402/bazaar>), **x402scan**
(<https://www.x402scan.com>), and **x402-list**
(<https://x402-list.com>). Point your agent at those, read a few 402
envelopes for free, and spend the rest of the $5 on someone else's work.
