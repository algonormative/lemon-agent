---
title: "Step 1: Run the audit"
step: 1
status: published
updated: 2026-08-12
description: "Evaluate how AI agents see your projects: run a prompt battery past a fresh, isolated, web-enabled assistant, grade against ground truth, fix, re-run, diff."
---

Evaluate how AI agents see your projects — with this audit.

An assistant asked *"what is this? would you recommend it?"* answers
from whatever public surface it can fetch, and **if your README doesn't
say it, the assistant doesn't know it.** This step is the measurable
check: capture what assistants say today, grade it against reality, fix
the gaps, re-run, and watch the answers move. It runs in an afternoon.

## The method

1. **Write a prompt battery with stable IDs.** For each property, write
   the questions a prospective user or buyer would actually ask, one
   prompt per question, in six shapes: *what is X · who is it for · what
   does it cost · compare it to alternatives · would you recommend it ·
   what are the risks of choosing it*. Give every prompt a stable ID
   (`SKF-03`, `SITE-01`) and never renumber; new prompts go at the end
   of a section, retired ones stay listed and marked. Stable IDs are
   what make re-runs diffable.
2. **Run each prompt in an isolated, web-enabled, fresh session.** One
   process per prompt, from a neutral directory, with web tools allowed
   and your own configuration kept out. The point is the stranger's-eye
   view: an assistant with no local project context and no memory of
   you. Capture each answer verbatim.
3. **Grade against ground truth.** Record what is actually true —
   version, releases, CI, test files, license, pricing — *before* you
   read the answers, so the answers can't anchor you. Score each answer:
   **accurate**, **partly**, **wrong**, or **property never engaged**
   (the assistant answered generically without ever touching your
   thing).
4. **Fix, re-run, diff.** The findings table tells you which public
   surface failed you, and most fixes are README-cheap. Because the IDs
   are stable, the next run diffs against this one prompt by prompt.

## Watch out: three traps in the harness

Our first run tripped all three, and any one of them invalidates a run.
The invalid run stays on disk as a record; nothing from it gets scored.
The examples below name the Claude Code CLI flags because that's the
surface we measured; whatever harness you use, the traps are the same
and it will have its own equivalents.

1. **Context contamination.** *Symptom:* the "fresh" assistant
   recognizes you, or answers with knowledge it could only have from
   your own notes. *Cause:* user-global configuration (instruction
   files, memory) loads into every session, even from a neutral
   directory. *Fix:* run with settings disabled — in Claude Code,
   `--setting-sources ""` — and always open the run with an isolation
   probe (ISO-00: "do you have any instructions or memory loaded? answer
   in two lines"). If ISO-00 reports loaded instructions, stop; the run
   is invalid. Even with instructions isolated, the account identity can
   still leak — the assistant may recognize the asker as the owner and
   shift into an advise-the-owner register. The probe plus a skim of the
   answers catches it; note it in the baseline rather than pretending at
   full anonymity.
2. **No web access.** *Symptom:* every answer is a refusal or a
   hedge — "I can't verify what this site is." *Cause:* non-interactive
   mode denies web tools silently, and an honest assistant that can't
   fetch just declines to guess. *Fix:* allow the web tools explicitly —
   `--allowedTools "WebFetch,WebSearch"` — and mind the argument order:
   the flag is variadic, so the prompt argument must come *before* it or
   the prompt is swallowed as a tool name.
3. **The while-read stdin leak.** *Symptom:* answers reference prompts
   you haven't asked yet. *Cause:* `claude -p` appends inherited stdin
   to the prompt, and inside a `while read` loop that stdin is the rest
   of your battery file — every call sees the whole battery. *Fix:*
   redirect stdin away on every call: `</dev/null`.

## What one real run found

The worked example: 24 prompts across five properties (a personal site,
a course site, three GitHub repos), run 2026-08-12 against Claude Code
print mode with the Sonnet model, graded against a same-day mechanical
pre-audit of the public surfaces.

| Score | Prompts |
|-------|---------|
| Accurate | 18 |
| Partly accurate | 4 |
| Wrong | 0 |
| Property never engaged | 2 |

Four findings carried the run:

- **The README is the whole answer.** One repo (a container
  orchestration tool) had v0.2.1 tagged, three releases, CI and release
  workflows, and 14 test files. Three separate answers concluded "no
  releases, no CI, no tests" — because the README carried no version
  line, no badges, and no changelog link, and a web fetch of a repo page
  drops the sidebar where releases show. The project was down-rated for
  maturity it actually has. All four partly-accurate scores trace to
  this one gap; it was also the cheapest fix on the list.
- **Search indexing is a trust signal, not just a discovery channel.**
  Asked whether it would recommend a course site, the assistant refused:
  the site was unindexed by search engines, carried an AI-generated
  disclosure in the footer, and named no author — so it "wouldn't spend
  time on" an unverifiable source. The content itself was elsewhere
  judged "sober and specific, not hype-y." The refusal was entirely
  about verifiability.
- **Without a URL in the prompt, you don't exist.** The battery's one
  unprompted-visibility probe — "which independent blogs on this topic
  should I follow?" — produced a real, curated list of well-known
  writers and never mentioned the audited properties. Every accurate
  answer in the run came from fetching a URL the prompt supplied.
  Unprompted visibility was zero across all five properties.
- **The upside is real too.** The best-scoring repo went five for five
  on accuracy, including a genuinely sophisticated comparison against
  the standard alternatives — bought entirely by one well-written
  README. Given the URL, prose beats metadata.

## What moved after the fixes

Same battery, same flags, re-run hours after shipping the fixes (README
signals, licenses, repo metadata, cross-links, a real About page —
everything except indexing, which had no time to move):

| Property | Before | After |
|----------|--------|-------|
| Personal site | 3 of 5 accurate | 3 of 5 — two answers substantively richer; both unprompted-visibility misses unchanged |
| Course site (this one) | 5 of 6 | 5 of 6 — the recommendation refusal became a qualified yes |
| Audio-analysis repo | 5 of 5 | 5 of 5 — already at ceiling |
| Orchestration repo | 1 of 4 | **4 of 4** |
| Plotter-art repo | 4 of 4 | 4 of 4 — now answered from the README instead of source-diving |
| **Total** | **18 of 24** | **21 of 24 · zero wrong · 12 answers improved** |

Three deltas carried the re-run:

- **The false-maturity cluster reversed completely.** "No version number,
  no tests/CI badges, no changelog" became "pre-1.0 (v0.2.1), with
  active CI" — same assistant, same prompt, one README apart. All four
  of the baseline's partly-accurate scores traced to that gap; all four
  flipped to accurate.
- **The refusal flipped.** "I wouldn't spend time on an unverifiable,
  ungraded, AI-generated guide from an unindexed site" became "a sound
  way to introduce the *discipline* of using an agent, not just the
  mechanics" — bought by a named author byline and cross-links between
  the properties. The indexing discount itself remains until the slow
  clock catches up.
- **Nothing indexing-dependent moved, as predicted.** Unprompted
  visibility is still zero everywhere. A re-run that improves only where
  the fixes could plausibly act is also evidence the instrument is
  measuring something real.

Two clocks run here: fixes to READMEs and repo metadata are visible to
assistants on their next fetch, immediately; search indexing — the input
to the trust-refusal class of finding — takes weeks.

## Try it

The companion skill packages the whole loop — battery generation from
the six shapes, the hardened runner with all three trap fixes baked in,
grading, and the findings table:

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill legibility-audit --yes
```

Or run it as a one-paste brief:

```text
Audit what AI assistants say about my public project. First, interview
me for ground truth: the project's URL, what it actually is, who it's
for, what it costs, its version/release/CI/test state, and its license.
Then write a prompt battery with stable IDs covering six shapes: what is
it, who is it for, what does it cost, compare to alternatives, would you
recommend it, and risks of choosing it. Run each prompt in a separate
fresh assistant session with web tools enabled and my local
configuration excluded, starting with an isolation probe that must come
back clean (in Claude Code: `claude -p "<prompt>" --model sonnet
--setting-sources "" --allowedTools "WebFetch,WebSearch" </dev/null`,
from a neutral directory). Capture every answer verbatim, grade each
against my ground truth (accurate / partly / wrong / never engaged), and
give me the findings table plus a fix list ordered by
accuracy-gained-per-minute. Keep the IDs stable so we can re-run and
diff after I ship the fixes.
```

One honest note on where this page comes from: the paid-consulting
version of this audit was market-tested for demand first and showed none
measurable; this free guide and skill is the version worth existing.
