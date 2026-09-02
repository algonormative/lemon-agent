---
title: "Lemon Agent for Writing"
craft: writing
status: v0
updated: 2026-08-07
description: "Use an agent as interviewer, organizer, fact-checker, and critic without asking it to write in your place."
---

An agent will happily write your essay. That is the problem. The result
often reads smoothly, says little, and sounds like everyone.

Use the agent more like a good editor: let it ask what you mean,
organize your material, find unsupported claims, and mark what is not
working. **You still write the sentences.**

## Start with the Interview Conductor

Begin here when you have a topic, a fragment, or a half-formed claim but
not yet a draft. The
[Interview Conductor](/writing/interview-conductor/) asks one question at
a time, follows the useful threads, and stops before ghostwriting.

You bring your experience and point of view. The agent returns two local
artifacts:

1. **Structured interview notes** that keep your words separate from the
   agent's synthesis.
2. **A writing brief** with an audience, working thesis, outline,
   tensions, evidence gaps, and unresolved questions.

Install the skill for both Codex and Claude Code:

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill writing-interview --yes
```

Or open the [instrument page](/writing/interview-conductor/) for the full
workflow and a paste-ready prompt.

## A writing loop that keeps your voice

1. **Talk before drafting.** Use the interview to get the real material
   out of your head.
2. **Write from the brief.** The outline is a starting point, not prose
   to approve. Draft in your own words.
3. **Subtract.** Ask the agent to flag weak patterns against the Prose
   Failure List. It reports; you decide what changes.
4. **Verify.** Run factual claims through the
   [verify-info pass](/work/#start-with-one-document) before publishing.

The useful division is simple: the agent creates questions, structure,
and findings. You create the argument, language, and final judgment.

## Tools you can use today

### Interview Conductor

Develop an essay, post, talk, or chapter through a focused conversation.
It ends with notes and a brief, never a draft.

- [Source on GitHub](https://github.com/algonormative/lemon-agent/tree/main/skills/writing-interview)
- [Read the workflow and fallback prompt](/writing/interview-conductor/)

### Prose Failure List

Review a finished draft against 24 common failures of AI-assisted prose.
Every finding cites a numbered pattern and the exact phrase that triggered
it, so you can disagree with the review.

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill prose-failure-list --yes
```

- [Source on GitHub](https://github.com/algonormative/lemon-agent/tree/main/skills/prose-failure-list)
- [Read the Prose Failure List](/prose-failure-list/)

## What comes later

Corpus tools could show repeated constructions, sentence-length patterns,
and themes across writing you choose to share. Worldbuilding tools could
track places, casts, and timelines without generating the story. Neither
is packaged yet; the interview-and-review loop is the useful path today.

## Watch out

- **The agent's draft wearing your byline.** Once its sentences replace
  yours, no editing pass can restore the thinking you skipped.
- **A review that silently rewrites.** Ask for findings, not a revised
  draft: flag, never fix.
- **Interview notes mistaken for finished thinking.** The notes are raw
  material. Writing begins after the interview.
