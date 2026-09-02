---
title: "Step 1: Make each correction stick"
step: 1
status: published
updated: 2026-08-05
description: "Turn corrections from one conversation into short project instructions and reusable skills that future agent sessions can follow."
---

An agent can learn during a conversation and still repeat the same mistake in
the next one. The correction lived in the chat, not in the project.

The remedy is simple: **make each useful correction outlive the session.** Put
project-specific guidance in the file your coding agent reads when it starts:
`AGENTS.md` for Codex, `CLAUDE.md` for Claude Code, or the equivalent file for
your tool. Keep the filename your agent actually supports; the principle is
the same.

You've met this file before: it's the team style guide, agreed once and
referenced forever. The teammate reading it is now an agent.

## Write down behavior, not wishes

A useful instruction tells the agent what to do at a recognizable moment:

| Too vague | Useful next session |
|---|---|
| Be careful with verification. | Reproduce the bug and show the failure before changing code. |
| Keep changes focused. | Record unrelated findings; do not add them to the current diff. |
| Use the right vault folder. | Recurring topics go in `topics/`; `active/` is only for work with an endpoint. |

The right rule is usually small. It records a real convention, command, stop
condition, or check. It does not try to describe an ideal project that does
not exist.

> The [Agent Workflow Failure List](/agent-workflow-failure-list/) came from
> measured failures in real sessions. Use it as a menu: keep the entries you
> have actually encountered and ignore the rest.

## Put each lesson at the right level

Not every lesson belongs in the project instruction file.

- **A project instruction** records a fact or rule for this repository: how to
  run tests, where files belong, what must not change, or when the agent must
  stop.
- **A skill** packages a repeatable workflow that should work across projects:
  reviewing prose, preparing a release, or checking a pull request against a
  failure list.
- **A small tool or hook** handles the parts a program can check reliably:
  validating JSON, finding broken links, or running a linter after an edit.

This creates a useful path: a correction starts as a sentence, becomes a
skill when the whole workflow repeats, and becomes code where judgment is no
longer needed.

Skills do not need to be copied separately into every agent. The open-source
`skills` CLI can install one managed skill for the agents you use:

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill agent-workflow-failure-list --yes
```

Use `npx skills` to discover, add, list, and update skills. Keep authored skill
files in their source repository; let the installer manage the copies your
agents load.

## Try it

<div data-example="borrowed-rules"><a href="/examples/borrowed-rules/">Interactive example: Borrowed rules →</a></div>

## Do it yourself

1. Think of the last correction you gave your agent twice.
2. Find the instruction file the agent actually reads for this project.
3. Add one plain sentence that would have prevented the second correction.
4. Ask the agent to show the diff. Remove anything aspirational or unrelated.

Five useful lines beat a page of generic advice. Add instructions when real
work earns them, and prune rules that no longer describe the project.

## Try it with your agent

```text
Review this session for corrections, project conventions, and repeated
workflows that should survive the conversation. For each one, recommend one
home: this project's instruction file (AGENTS.md, CLAUDE.md, or the supported
equivalent), a reusable skill, or a deterministic tool or hook. Explain the
choice in one sentence. Draft only the smallest useful change, show me the
diff, and do not document conventions that the project does not yet follow.
```

## Watch out

- **A policy dump:** long generic instructions become wallpaper. Prefer a few
  rules tied to decisions this project actually makes.
- **Documentation ahead of reality:** if the files and the instructions
  disagree, either change the project first or document the project as it is.
- **Chat-only learning:** “I will remember” is not persistence. Put the lesson
  somewhere the next session will read or run it
  ([AF-19](/agent-workflow-failure-list/#af-19)).
