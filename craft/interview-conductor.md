---
title: "The Interview Conductor"
craft: writing
kind: instrument
status: v0
updated: 2026-08-07
description: "An installable skill that pulls a draft out of you one question at a time: structured interview notes and a writing brief, your words kept verbatim, no prose written for you."
---

The hardest part of a draft is getting the material out of your head.
Answering a sharp question is easier than composing an opening
paragraph, and a good interviewer gets things out of people that a
blank page never would. The Interview Conductor is that interviewer:
it runs a focused interview about the thing you want to write, then
hands you organized material to write *from*.

The contract that makes it safe: **it never writes your prose.** Your
sentences stay verbatim and marked as yours; agent summaries are
marked as synthesis; it stops before drafting. Drafting, and the
[subtraction pass](/writing/) that follows it, are downstream stages
you drive.

## Install it

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill writing-interview --yes
```

## How a session runs

1. **Start anywhere**: a topic, a fragment, a question, a rough claim.
   The conductor asks what you're trying to write and who it's for.
2. **One question at a time.** It follows productive threads, pushes
   back once when an answer is vague, and keeps a parking lot for
   tangents worth returning to instead of chasing them.
3. **Periodic reflection.** Every few exchanges it plays the emerging
   argument back in sharper form so you can correct it while
   correcting is cheap.
4. **You stay in charge.** Skip a question, redirect the thread, or
   say "wrap" at any point.
5. **The output** lands in your environment, nowhere else: structured
   interview notes (your usable sentences quoted word for word, marked
   as quotes; synthesis marked as synthesis; the parking lot; thesis
   candidates; tensions; evidence gaps; unresolved questions) and a
   **writing brief** (audience, working thesis, the outline built from
   your own material, and what to check before drafting).

What it will not do, by contract: invent personal experience,
evidence, conviction, or quotations for you. A gap in the material is
reported as a gap.

## The paste-ready fallback

Using an agent surface without skill installs? The same workflow as a
single prompt:

```text
Act as an interview conductor helping me develop a piece of writing.
Start from whatever I give you (a topic, fragment, question, or rough
claim) by asking what I'm trying to write and who it's for. Then ask
ONE focused question at a time and wait for my answer. Follow
productive threads; keep a parking lot for tangents instead of
chasing them; push back once when an answer is vague. Every few
exchanges, reflect my emerging argument back in sharper form and ask
if that's what I mean. Keep my words distinguishable from yours at
all times. Never invent personal experience, evidence, conviction, or
quotations for me; report gaps as gaps. I can skip, redirect, or say
"wrap" at any point. On wrap, produce (1) structured interview notes:
my usable sentences quoted verbatim and marked as quotes, your
summaries marked as synthesis, the parking lot, thesis candidates,
tensions, evidence gaps, unresolved questions; and (2) a writing
brief: audience, working thesis, an outline built from my own
material, and what to check before drafting. Do not draft prose for
me. Drafting is a later stage that I drive.
```

## Watch out

- **The interview drifting into ghostwriting.** If answers start
  coming back as polished paragraphs "you could just use," the
  contract is broken; restate it.
- **Material mistaken for a draft.** Notes and brief are the start of
  writing, not the end. The next stage is yours, and the
  [Prose Failure List](/prose-failure-list/) is waiting for what you
  produce.
