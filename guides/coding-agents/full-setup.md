---
title: "Step 0: The one-paste baseline"
step: 0
status: published
updated: 2026-08-05
description: "Optional baseline: durable project instructions, verification gates, and reusable review skills, set up one confirmed change at a time."
---

Every later step in this guide is independently adoptable, and the whole
guide assumes you'd rather understand a pattern than install it blind.
This step is for the opposite mood: one paste that sets up the baseline
kit, confirming each file with you before it's written.

What it sets up (each explained properly in its own step):

- A **working agreements** section in the project instruction file your agent
  supports, such as `AGENTS.md` or `CLAUDE.md`: one-line gates
  distilled from failures that actually happen ([step 1](/guides/coding-agents/working-agreements/)).
- The two core **verification gates**: baseline before fix, small proof
  before long cycle ([step 2](/guides/coding-agents/verification-loop/)).
- The two **failure lists** installed as review passes you can invoke by
  name ([the prose list](/prose-failure-list/), [the workflow
  list](/agent-workflow-failure-list/)).

## The paste

```text
Set up my coding-agent baseline. Work one step at a time, show me every
file before writing it, and wait for my ok between steps.

1. Find the project instruction file this agent actually supports (AGENTS.md
   for Codex, CLAUDE.md for Claude Code, or its documented equivalent).
   Create or extend it with a section
   "## Working agreements" holding five one-line gates:
   - Baseline before fix: reproduce the bug and show the failing number
     before changing code. A probe that comes back clean on its first
     run is broken until proven otherwise.
   - Small proof before long cycle: before any full build, render, or
     deploy, run the smallest dry run that could falsify the change.
   - Serve, don't describe: if the deliverable can be a running page,
     render, or URL, deliver that, not prose saying it works.
   - No billed calls in tests: stub every metered client; grep for live
     client construction before the first test run.
   - Name forks: when you hit a genuine design fork, stop and present
     the options instead of picking silently.

2. Interview me, one question at a time, about failures that have
   actually bitten me beyond these, and add at most three more gates in
   the same one-line style. Skip anything that hasn't happened to me.

3. Offer to install the two failure-list skills through npx skills as one
   managed global install for the agents I use. Show me the exact command and
   wait for approval before running it. For Codex and Claude Code, use:
   npx skills add algonormative/lemon-agent --global --agent codex claude-code --yes

4. Look for one repeated mechanical workflow that should become a small CLI.
   Propose its name, inputs, output, and verification, but do not build it yet.
```

## If you'd rather go manual

Read [step 1](/guides/coding-agents/working-agreements/) and [step
2](/guides/coding-agents/verification-loop/) and make the two edits
yourself: about ten minutes, and you'll know exactly what your agent is
now promising.
