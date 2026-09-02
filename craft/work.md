---
title: "Lemon Agent for Knowledge Work"
craft: work
status: v0
updated: 2026-08-15
description: "Turn a memo, report, or draft into a claim ledger with sources, dates, uncertainty, and explicit follow-up."
---

Most work that crosses a desk is a relay of other people's claims. A
summary becomes a recommendation; a recommendation becomes a decision.
An agent can move that material faster, but speed is useful only when the
sources and uncertainty travel with it.

Start with verification, not a general “research assistant.” The bounded
job is easier to inspect: **give the agent one document; get back a claim
ledger you can review.**

## Start with one document

Use a memo, report, draft, thread, or collection of notes. The agent's job
is to inventory the factual claims, trace their support, and say plainly
what it could not verify.

Paste the material after this prompt:

```text
Run a verify-info pass on the material I paste next.

1. Inventory every factual claim: numbers, dates, names, quotations,
   comparisons, and phrases such as "studies show."
2. Classify the support for each claim as primary source in hand,
   secondary report, or unsourced.
3. For secondary or unsourced claims, find the primary source if you can.
   Never invent a source. Record the retrieval date for anything fetched.
4. Flag time-sensitive claims without an as-of date.
5. Produce a claim ledger with columns for claim, status, support level,
   source, confidence, uncertainty or caveats, and required follow-up.

If you cannot search or fetch sources, say so and grade only from the
material in hand. Use "not verified" when a check did not happen. End
with the single claim most likely to embarrass the sender if it is wrong.
```

The output stays in your environment. Save it beside the source as
`claim-ledger.md`; for recurring or larger work, use a local SQLite file.

## What a useful result looks like

Each row should be actionable, not merely cautious:

```text
claim | status | source | as-of date | uncertainty | next action
```

A good ledger distinguishes at least four states:

- **Verified:** a primary source supports the claim.
- **Contradicted:** the source says something materially different.
- **Uncertain:** credible sources disagree or the evidence is incomplete.
- **Not verified:** no adequate check happened.

You review the ledger, resolve the important gaps, and decide whether the
document is ready to send. Sending and sharing remain human actions.

## A five-step work loop

1. **Scope** the decision this document is meant to support.
2. **Convert** the source into readable local text when needed.
3. **Verify** its claims and save the ledger.
4. **Revise** only the claims whose evidence or wording failed review.
5. **Read the final document**, not the agent's summary of its changes.

## Starter tools

### MarkItDown

[MarkItDown](https://github.com/microsoft/markitdown) converts PDFs,
Office documents, web pages, and other inputs into Markdown an agent can
inspect consistently.

```sh
python -m pip install 'markitdown[all]'
```

### sqlite-utils

[sqlite-utils](https://github.com/simonw/sqlite-utils) turns a growing
claim ledger into a small local database you can query and export.

```sh
brew install sqlite-utils
```

Neither tool sends a message or hosts your work. They prepare and retain
artifacts in your own files.

### The Verify-Info Pass

The workflow above is also an installable skill, for both Codex and
Claude Code:

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill work-verify-info --yes
```

- [Read the workflow and the worked example](/work/verify-info/) — a
  memo and its source packet, and the ledger a real pass produced from
  them, with all four claim states.
- [Source on GitHub](https://github.com/algonormative/lemon-agent/tree/main/skills/work-verify-info)

The prompt above stays the no-install path; the skill is the same pass
with the contract, the confidence rules, and the platform notes carried
along with it.

## Watch out

- **A summary stronger than its source.** Preserve qualifications and
  disagreements instead of averaging them into confidence.
- **Authority inherited from the inbox.** A forwarded number is still
  unsourced when it reaches you.
- **Reviewing the agent's account of its work.** Read the document and the
  ledger themselves before either goes out under your name.
- **Sending by automation.** Keep send, share, and schedule behind your
  own click.
