# Lemon Agent

**Free tools · honest measurements · agentic services.**

A small house for working with agents, the counterpart to
[LEMON AUDIO](https://lemon.audio). Run by
[Nick Donohue](https://nickdonohue.net).
The front door is a **seven-lesson course** for moving from chat to a safe,
bounded, and verifiable coding-agent workflow. Deeper
field guides collect concrete patterns from measured use; two numbered
failure lists are their watch-out reference, and services that agents
can call ride alongside.

> **Status: live, early days.** Curated and launched 2026-08-05; expect
> sharp edges and honest "not yet" cards. Live at
> <https://lemon-agent.dev> (mirrored at lemon-agent.pages.dev).

## House rules

1. **The user-use check.** Nothing ships without a working answer to
   *"how would a user actually make use of this, today?"*: a copyable
   prompt, an install command, or a key. If the honest answer is "they
   can't yet," the member's page says so plainly instead of pretending.
2. **No shared infrastructure before two members exist.** The house is a
   name and a catalog over things that ship anyway; the moment it demands
   its own infrastructure first, it has inverted.

## Members

| Member | What it is | Use it today |
|--------|-----------|--------------|
| [Your First Coding-Agent Session](start/) | 7 short lessons: what changes, safe tasks, the four-part brief, planning, stop conditions, verification, and diff review | Read in order; every lesson has a decision exercise and a paste-ready action |
| [Working with Coding Agents](guides/coding-agents/) | Step 0 + 9 patterns: durable instructions, verification loops, design interviews, reviews, orchestration, tool surfaces, small tools, generated views, hooks | One pattern at a time; every chapter ends with a prompt you can adapt. Step 0 = full baseline in one paste |
| [Shipping Software with Git + Coding Agents](guides/git/) | Step 0 + 5 patterns: checkpoint commits, branches as blast radius, history for the next reader, diff-not-summary review, cheap recovery | Same shape; step 0 = repo baseline in one paste |
| [Keeping a Vault](guides/vault/) | Step 0 + 6 patterns: plain files in a repo, location-is-state, inbox capture, daily log, teach-the-agent instructions, doctor script | Same shape; step 0 = the whole vault in one paste |
| [What Does AI Say About You?](guides/legibility/) | The legibility audit: a stable-ID buyer-intent prompt battery run in isolated web-enabled sessions, graded against ground truth, with a worked example from a real baseline | Paste-ready brief on the page, or install the `legibility-audit` skill with `npx skills` |
| [Paying for Things with Agents](guides/payments/) | Funding an agent wallet so it can pay x402 endpoints on Base: four funding routes compared, five ways to lose the money, per-call and per-day spend caps from the shipped SDKs, and one real $0.0025 purchase with an on-chain receipt | Follow the recommended path end to end; every price and cap on the page is checkable against a live endpoint or a shipped package |
| [The Prose Failure List](lists/prose-failure-list.md) | 24 numbered failures of AI-assisted prose (PF-01…24), run as a subtraction pass | Paste-ready prompt on the page, or install with `npx skills` |
| [The Agent Workflow Failure List](lists/agent-workflow-failure-list.md) | 21 numbered failures of agent-assisted engineering (AF-01…21), each grounded in measured work | Paste-ready prompt on the page, or install with `npx skills` |
| [pathgrip](https://pathgrip.net) | Bookmark + provenance store: content-addressed snapshots, drift detection, per-agent tokens, MCP surface | Not yet: operator instance; public docs + self-serve keys are the next ship |

## The guides, in one breath

Human-first: read a step, adopt it by hand, or adapt the step's setup
prompt to your agent and confirm each file it writes. Steps are ordered by
leverage-per-effort but stand alone, and each pattern chapter names its
traditional-engineering ancestor ("you've met this before": TDD, RFCs,
code review, map-reduce, the Unix philosophy, GTD, the lab notebook,
pre-commit hooks).

- **coding-agents**: `00` one-paste baseline · `01` working agreements ·
  `02` verification loop · `03` design interviews · `04` adversarial
  review · `05` fan-out & orchestration · `06` CLI/API/MCP tool surfaces ·
  `07` small tools · `08` JIT HTML views · `09` rules → checks
- **git**: `00` repo baseline · `01` checkpoint commits · `02` branch
  blast radius · `03` history for the next reader · `04` review the
  diff · `05` cheap recovery
- **vault**: `00` one-paste vault · `01` plain files · `02` location is
  state · `03` capture now · `04` daily log · `05` teach the shape ·
  `06` run a doctor
- **legibility**: `01` run the audit (battery + harness traps + worked
  example; the `legibility-audit` skill is its installable half)
- **payments**: `01` give your agent $5 (funding routes, spend caps, the
  five ways to lose it, one settled sub-cent purchase) · `02` tag your
  own traffic (`HOUSE_PAYERS`, verify-time tagging, honest revenue
  readouts)

## Install the review skills

Use the open-source `skills` CLI so Codex and Claude Code can share one
managed install:

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --yes
```

The authored skills remain in this repository under `skills/`; `npx skills`
manages the copies each agent loads. Use `npx skills list` to inspect installed
skills and `npx skills update` to refresh them.

## Layout

```
guides/       Canonical guide chapters, one dir per guide (guides/<slug>/<chapter>.md)
start/        Canonical course lessons
craft/        Canonical craft pages (writing, work, audio, science)
lists/        Canonical failure lists; site + skills render from here
corrections/  Correction log entries, one file per correction (corrections/<date>-<slug>.md)
examples/     Interactive-example data (JSON): pre-generated branching conversations
skills/       Installable agent skills (list.md copies generated by `npm run sync`)
src/          Astro site (static), LEMON AUDIO visual language in light rendition
public/       catalog.json · llms.txt · favicon: the agent-facing surfaces
```

The craft pages (indexed at `/craft/`, pages at
`/{writing,work,audio,science}/`) apply the same method per domain and
**incubate unlisted**: they stay out of primary navigation until they
earn it with an installable instrument, a judgment artifact, a worked
path, and external use (DESIGN.md has the architecture). Statuses are
honest: `v0` means something on the page is usable today; `scoping`
means the page is the published plan. First instrument shipped: the
`writing-interview` skill (the Interview Conductor).

The site is fully static: markdown in git, HTML at build time. No
server, no database. Raw markdown is served at `/guides/<guide>/*.md`,
`/lists/*.md`, and `/start/*.md`; example data at `/examples/<id>.json`;
the machine catalog at `/catalog.json`.

## Corrections

`/corrections/` is the correction log: dated, reverse-chronological,
one markdown file per entry under `corrections/`, loaded by the
`corrections` content collection in `src/content.config.ts`.

**What earns an entry:** any public statement by Lemon Agent — a page, a
list entry, a comment, a post — later found to be wrong. Statements
caught in the house's own review pass before publication get an entry
too; the `where` field says so, so a pre-publication fix is never
presented as a retraction.

**Nothing is silently edited.** A correction is added; the original stays
as posted, or is marked as edited where the surface allows it. Entries
are never removed or rewritten to look better later.

To add one, drop `corrections/<YYYY-MM-DD>-<slug>.md` with front-matter:
`title`, `date`, and the five record fields the page renders with visible
labels — `claimed` (what was claimed), `where` (the URL or the surface
plus id), `wrong` (what was wrong), `now` (what is true now), and
`source` (which record says so). The body is optional and renders as a
short note under the fields. Sources are often internal records, in which
case the entry names the record and its date rather than a public URL.

## Add an interactive example

Examples are king: every pattern chapter carries one, and every course
lesson's "Make the call" exercise is the same thing in the same format.
An example is a pre-generated branching mini-conversation. The reader
picks the agent's next move and sees where it leads. Interaction is
CSS-only (radios) today, so examples need no runtime; static-first is a
preference, not a vow, and if an example needs a script, add the script.
One renderer serves both surfaces with two chip vocabularies: the manual
labels options by role ("the baseline" / "correct" / "plausible but
wrong"), the course speaks to the reader ("not yet" / "good call" /
"close, but").

1. Create `examples/<id>.json`:

```jsonc
{
  "id": "clean-probe",            // kebab-case, matches filename
  "title": "The clean probe",
  "guide": "coding-agents/verification-loop",   // guide/chapter, or "start/<lesson>" for a course exercise
  "prompt": "Pick the agent's next move, then see where it leads:",
  "setup": [ { "role": "user|agent", "text": "…" } ],
  "options": [
    {
      "key": "A",
      "label": "…the candidate agent response…",
      "kind": "baseline|correct|plausible",   // mark ONE baseline, ONE correct
      "outcome": [ { "role": "…", "text": "…what happens next…" } ],
      "verdict": "Why this choice lands where it does.",
      "cites": ["AF-01"]          // AF-* / PF-* ids, linked automatically
    }
  ]
}
```

2. Drop a placeholder in the chapter (single line, with the standalone
   page as the raw-markdown fallback):

```html
<div data-example="clean-probe"><a href="/examples/clean-probe/">Interactive example: the clean probe →</a></div>
```

That's it. The build embeds the widget in the chapter, generates a
standalone page at `/examples/<id>/`, and serves the raw data at
`/examples/<id>.json`. Renderer: `src/lib/example-widget.mjs` (used by
the rehype plugin in `astro.config.mjs` and the standalone page).
Dev-server note: after editing an example's JSON, touch the chapter
file or restart `npm run dev`; content collections cache aggressively.

## Develop

```sh
npm install
npm run dev      # local site at http://localhost:4321
npm run build    # static build to dist/
npm run deploy   # build + wrangler pages deploy (Cloudflare Pages)
```

`npm run sync` (automatic before dev/build) copies `lists/*.md`,
`guides/**/*.md`, `start/*.md`, and `examples/*.json` to `public/` and
refreshes the skills. Edit only the canonical `guides/`, `start/`,
`lists/`, and `examples/` files.


## Analytics

PostHog, and it is entirely optional — with no key the site builds, boots and
serves exactly as it did before, every capture is a no-op, and `npm run dev`
says so in the console rather than leaving an empty graph to be found in a
month.

```sh
cp .env.example .env                                     # local
gh secret set PUBLIC_POSTHOG_KEY --repo algonormative/lemon-agent   # CI
```

The token is baked in at build time — this is a static site, so there is no
later moment to read it.

Two files, and the split is deliberate. `src/components/PostHog.astro` is init
only: the official snippet, `is:inline`, gated on the key. `src/components/
Analytics.astro` is every named event, in one delegated listener on `document`,
which is why `CourseClient`, `PromptBuilder`, `ToolChooser` and the copy-button
script contain no analytics code at all. Autocapture already records that a
button was clicked; these five record what the site is trying to *cause*:

| Event | Fires on | The question it answers |
| --- | --- | --- |
| `example_answered` | picking an option in a `TRY IT` widget | the house bet, measured — which option a learner reaches for **first** (`option_kind`: `correct`, `baseline`, `plausible`). A page where most readers pick the baseline is a page doing its job |
| `code_copied` | the copy button on any code block | the guides exist to be run, not read; copying is the moment a reader becomes someone about to try it |
| `brief_copied` | copying from the brief builder | the `/start` course's actual payoff, whether or not they then tick the lesson box |
| `lesson_completed` | ticking a lesson | course progress, per lesson |
| `tool_selected` | the agent picker | which branch of the instructions is worth the most editing effort |

No PII, by construction: nobody logs in, and nothing reads a form field's value
— `brief_copied` carries the brief's *length*, never its text. What someone is
briefing their agent about is their business.

**Known gap: the agent half is dark.** `/catalog.json`, `/llms.txt` and the raw
markdown under `/start/`, `/guides/` and `/lists/` are published for programs,
and a program runs no JavaScript — so none of those fetches appear anywhere in
this project. `agent_artifact_opened` catches only the human who follows the
link from a rendered page. Closing it properly needs a Cloudflare Pages Function
sending `$http_log` events the way `10x402`'s Worker already does; until then,
treat agent-side usage of the artefacts as unmeasured rather than as zero.
