# Plan: the web-services focus for the devs base

**Status: plan, not shipped.** Nothing in this document is live on the
site. It exists to make one call (new guide vs. extension vs. example
repo), lay out the chapter arc behind that call, and name the evidence
each chapter still needs before it can be published under the house's
honest-measurements rule.

Origin: the 2026-08-05 vision session (`vault/lemon/vision.md`). Owner
direction, verbatim:

> Devs: forms the basis around all of it, but we can focus on building
> web services, frontend/backend.

The devs vertical is the launched base — the course, the field guides,
the two failure lists. This is the build-focus extension of that base:
worked material for building web services with agents, using the same
method the existing guides teach.

---

## 1. The decision

**Ship it as a new guide: `web-services`, a sibling of `git` and
`vault` under `guides/`. The worked-example repo is a named follow-up
that supplies the guide's evidence, not an alternative to it.**

Three options were on the table.

### Option A — extend `coding-agents` (rejected)

`coding-agents` is the *method*, and every chapter in it is
domain-neutral by construction: one pattern, one traditional-engineering
ancestor, one adaptable prompt, applicable whether you are writing a
CLI, a render pipeline, or a web app. Web-service chapters are the same
method *applied to one domain*. Filing them inside `coding-agents`
would:

- break that guide's contract with its reader (a pattern per chapter,
  not a walkthrough), because the web arc is sequential — the scaffold
  chapter is meaningless without the contract chapter before it;
- collide with a step sequence that is already full at `00`–`09` and
  referenced by number in `README.md`, `public/llms.txt`,
  `public/catalog.json`, and cross-links inside the chapters themselves;
- make the guide's index page read as two guides wearing one title.

### Option B — a worked-example repo only (rejected as the primary home)

A repo full of good code is not adoptable in this house's terms. The
user-use check asks *"how would a user actually make use of this,
today?"*, and the house's answer format is a copyable prompt or an
install command. A reader who clones an example repo has someone else's
finished app, not a habit they can apply to their own. Every other guide
here hands over a prompt per step; a repo hands over an artifact.

It is, however, exactly the right *support* for the arc — see §5.

### Option C — a new guide (chosen)

The house already has the precedent, twice. `git` and `vault` are both
the general method applied to a domain, each shipped as its own guide
with its own step 0 one-paste baseline and its own citrus accent. Web
services is the same shape:

- it is the **base** vertical, not a craft wing, so it belongs at
  `guides/`, not `craft/` (see `DESIGN.md`: root is the developer
  craft);
- it has a natural arc with an endpoint (contract → slice → proof →
  deploy), which is what a guide is for and what a pattern list is not;
- it inherits `coding-agents` rather than duplicating it: each chapter
  links back to the general pattern it specializes, so the two guides
  stay in a parent/child relation instead of competing.

Proposed registry entry (`src/lib/guides.mjs`):

| Field | Value |
|-------|-------|
| `slug` | `web-services` |
| `title` | Building Web Services with Coding Agents |
| `short` | Web services |
| `citrus` | `sudachi` — see §6 for why a new variety is needed and the measured inks |

Blurb and intro copy are drafted in §6.

---

## 2. Scope

**In:** the arc from "we agreed what this service does" to "it is
running on a URL and we know it works" — frontend and backend as one
system with a contract between them, verified at the request level.
Stack-agnostic: the reader brings their own runtime, framework, and
host, and every prompt says so.

**Out (state this on the guide index):**

- framework tutorials — no "how to use Next/Fastify/Rails";
- architecture advocacy — no microservices/monolith position;
- production operations at scale — capacity, on-call, multi-region;
- anything requiring a hosted Lemon service (`DESIGN.md`: the free
  guide-and-skill path requires no hosted state).

---

## 3. The chapter arc

Five chapters for v0 (`00`–`04`), plus one candidate held back for
evidence. Every chapter follows the house skeleton already used in
`guides/coding-agents/`: opening frame → *You've met this before* →
**What good looks like** → **Try it** (interactive example) → **Do it by
hand** → **Try it with your agent** (the adaptable prompt) → **Watch
out** (citing AF ids).

### 00 · `full-setup.md` — The one-paste web-service baseline

- **Contract:** one paste that interviews the reader, agrees a route
  contract, builds a single vertical slice, installs runnable
  verification gates, writes web-specific working agreements into the
  project instruction file, and stops short of deploying.
- **Prompt:** the whole chapter is the paste. Drafted in full in
  Appendix A — ready to lift to `guides/web-services/full-setup.md`.
- **Example:** none (step 0 chapters in this house carry no example).
- **Evidence needed:** none beyond a dry run — it is procedural. See §4.

### 01 · `contract-first.md` — Agree the shape before the handler

- **Contract:** specialize the design interview to a service: routes,
  request/response shapes, error cases, where state lives, and the auth
  boundary. One file holds the contract; it is what changes first when
  the shape changes.
- **Ancestor:** interface-first design, API design review, the RFC.
- **Specializes:** `coding-agents/design-before-code`.
- **Prompt (ending the chapter):** *interview me one open question at a
  time until you can state the service in one sentence, the one route
  that proves it, where state lives, and what must never leak; then
  write the route contract as a table of method, path, request shape,
  response shape, and error cases — and wait before writing a handler.*
- **Example:** `examples/contract-drift.json` — the agent infers a
  response shape from an existing component instead of asking; the
  reader picks whether to let it proceed. Cites AF-14, AF-15.
- **Watch out:** a contract that only restates the request; shapes
  inferred from the frontend's current guesswork; auth deferred to
  "later" and thereby designed by accident.

### 02 · `vertical-slice.md` — One route, all the way through

- **Contract:** the first build is a walking skeleton — browser to
  handler to store and back, one route, no second feature, no styling
  pass. Breadth comes after the first thing works end to end.
- **Ancestor:** the walking skeleton / tracer bullet.
- **Specializes:** `coding-agents/verification-loop` (small proof before
  long cycle), applied to project shape rather than to a single change.
- **Prompt:** *build only the route we agreed, wired end to end, and
  nothing else; list every file you want to add before adding it, and
  tell me what you deliberately left out.*
- **Example:** `examples/scaffold-sprawl.json` — the agent proposes
  fourteen files and six routes on turn one; options are accept, accept
  with a trim, or send it back for one route. Cites AF-07, AF-15.
- **Watch out:** a generated scaffold nobody has read; six routes and
  none of them proven; "we'll wire the store next" (the slice's whole
  point is that it is wired).

### 03 · `prove-at-the-request.md` — A green build is not a working endpoint

- **Contract:** the verification loop, specialized for a service. The
  proof is a request against a running instance, not a build exit code.
  Break it first so the check is known to be able to fail; fixture data
  and stubbed metered clients; the checked target is the shipped target.
- **Ancestor:** smoke tests, TDD's red-before-green.
- **Specializes:** `coding-agents/verification-loop`.
- **Prompt:** *before you show me it working, break the handler, run the
  smoke command, and show me the non-zero exit; then fix it and show the
  same command passing — and tell me which of the two runs used the
  artifact that would actually ship.*
- **Example:** `examples/green-build-dead-endpoint.json` — build passes,
  typecheck passes, and the route 500s on first request; options are
  report success, run the smoke, or add a test. Cites AF-01, AF-04,
  AF-05, AF-06.
- **Watch out:** a probe that has never failed (AF-01); a summary in
  place of the response body (AF-04); tests hitting a live metered
  service (AF-06); dev server proven, built artifact shipped (AF-05).

### 04 · `preview-before-production.md` — Deploy to a URL nobody depends on

- **Contract:** the first deploy goes to an ephemeral URL; it is smoked
  as a user over the network, not on localhost; the rollback path is
  known and tested *before* the first production deploy; the production
  step stays with the human.
- **Ancestor:** staging environments, blue/green, the change-advisory
  gate — minus the ceremony.
- **Specializes:** `coding-agents/verification-loop` +
  `git/cheap-recovery`.
- **Prompt:** *deploy to a preview URL only, then hit the deployed URL —
  not localhost — with the smoke command and paste the response; tell me
  the exact command that rolls this back, and stop before anything that
  touches production, migrates data, or is hard to reverse.*
- **Example:** `examples/deploy-on-a-summary.json` — the agent reports a
  successful deploy without a fetched response; options are accept,
  ask for the response body, or ask for the rollback command. Cites
  AF-04, AF-05, AF-09.
- **Watch out:** "deployed successfully" with no fetched body; a smoke
  run against localhost after a remote deploy; a migration bundled into
  the deploy step; rollback discovered during the incident.

### Held back · `after-the-first-user.md` — What to watch once it is real

Logs, error surfaces, and the smallest honest monitoring a one-person
service deserves. **Not in v0**: writing it well needs real operating
experience with a deployed service, and the house does not claim
experience it does not have. Ship `00`–`04`, run a service through them,
then write this from what actually happened.

---

## 4. Evidence ledger

House rule: the site never claims experience, incidents, or measurements
that did not happen. Chapters `01`–`04` are pattern chapters, and in this
house pattern chapters carry a *"Where this comes from"* provenance note
grounded in real use. None of them can be published until the owner
supplies that grounding.

| Chapter | Publishable on procedure alone? | Evidence needed before `status: published` |
|---------|-------------------------------|--------------------------------------------|
| `00` full-setup | **Yes** — it is a paste plus an explanation, like the three existing step 0s | One dry run of the paste against a real empty repo, to confirm the steps land in the order written and the gates are runnable |
| `01` contract-first | No | One real session where an inferred response shape (or auth boundary) cost a rewrite — the note that makes the pattern land. Otherwise the chapter is an assertion |
| `02` vertical-slice | No | A real scaffold-sprawl instance: what the agent proposed unprompted vs. what the slice needed. File counts from an actual transcript |
| `03` prove-at-the-request | No | One incident where build/typecheck were green and the endpoint was not, with the two commands and their exit codes. This is the chapter's whole argument |
| `04` preview-before-production | No | One real preview-then-production sequence: the smoke against the deployed URL, and the rollback command actually executed once |
| held-back chapter | No | Operating a deployed service long enough to have opinions worth publishing |

Until each note exists, the honest interim is `status: draft` — with the
caveat in §6 that draft does **not** hide a chapter on this site.

---

## 5. The worked-example repo (named follow-up, not created)

A companion repo — working title `lemon-web-service-example` — built by
running the arc above on a real, small service, and kept as the source
of the evidence in §4. Not created in this session; it is a separate
piece of work with its own decisions (which stack the reference uses,
whether it is deployable by a reader in one command).

Its role is support, in three specific places:

1. **`00`'s dry run.** The paste is run against this repo from empty;
   the transcript proves the steps are ordered correctly.
2. **The `03` and `04` evidence.** The failing-then-passing smoke and
   the preview/rollback sequence come from here, with real commands and
   real exit codes.
3. **A link at the end of the guide index** — "the reference service
   this guide was written against" — which is a legitimate use of a
   repo, unlike making it the deliverable.

It does not become a house member (`README.md` table) unless it passes
the user-use check on its own terms.

---

## 6. What publishing this actually costs

A finding worth stating plainly, because it changes the shipping order:

> **`status: draft` is not a gate.** Nothing in `src/` filters chapters
> by status. `src/pages/guides/[guide]/[chapter].astro` builds a page for
> every entry in the collection, and `guides/index.astro` lists every
> chapter whose id starts with the guide slug. A "draft" chapter in
> `guides/` is a live public page.

And a guide slug cannot be half-registered: the chapter page reads
`guideBySlug(guide).citrus`, so a chapter under a slug missing from
`GUIDES` fails the build outright. Publishing the first chapter is
therefore a guide *launch*, touching:

| File | Change |
|------|--------|
| `guides/web-services/full-setup.md` | the chapter (Appendix A) |
| `src/lib/guides.mjs` | registry entry: slug, title, short, citrus, blurb, intro |
| `src/layouts/Base.astro` | `.citrus-sudachi` accent trio, light + dark |
| `DESIGN.md` | one row in the citrus table |
| `README.md` | one row in the members table, one bullet in "the guides, in one breath" |
| `public/catalog.json` | guide entry + chapter list (hand-maintained) |
| `public/llms.txt` | guide section + chapter links (hand-maintained) |

The home page (`src/pages/index.astro`) and `/guides/` index both render
from `GUIDES`, so they update themselves once the registry entry exists —
which is also why the registry entry *is* the publish decision.

**Proposed accent — `sudachi`.** Every existing variety sits in the
yellow→orange→pink arc (lemon, lime, tangerine, grapefruit, blood
orange, yuzu); a deep green reads as distinct at a glance while staying
inside the citrus family. Contrast against the house backgrounds,
computed against `--bg: #f5f3e9` (light) and `#12140f` (dark), house
floor 4.5:1:

| Token | Light | Dark |
|-------|-------|------|
| `--accent` | `#5faa72` | `#63b177` |
| `--accent-ink` | `#31734a` — **5.13:1** on `#f5f3e9` | `#86c9a0` — **9.60:1** on `#12140f` |
| `--accent-soft` | `rgba(95, 170, 114, 0.16)` | `rgba(99, 177, 119, 0.11)` |
| `--accent-hover` | `#48885a` | `#4f9160` |

`--accent` itself stays a chip background only, never text — same rule
as the other varieties. The hover values are unmeasured suggestions;
match them to the pattern of the existing rows before shipping.

Draft registry copy:

- **blurb:** "The arc from an agreed contract to a URL you have actually
  hit: route shapes before handlers, one vertical slice before breadth,
  proof at the request instead of at the build, and a preview deploy
  nobody depends on."
- **intro:** "A web service is where an agent's speed is most tempting
  and least verified: the build goes green long before the endpoint
  works. These steps put the contract before the code, keep the first
  build to one route wired end to end, move the proof from the build to
  the request, and keep the first deploy somewhere harmless — one step
  at a time, each with a prompt you can adapt."

---

## 7. Shipping order

1. **Owner call on §1.** If the new-guide decision stands, everything
   below follows; if not, the arc in §3 is re-homed and the rest of this
   document is still the content plan.
2. **Dry-run the step 0 paste** (Appendix A) against an empty repo. Fix
   the paste against what actually happens. This is the only step that
   gates `00`'s publication.
3. **Launch the guide with `00` only** — the seven-file cascade in §6.
   A guide that is one honest step 0 is a fair shipping state; the index
   already says "start where it hurts."
4. **Run a real service through `01`–`04`** and collect the §4 evidence
   as it happens (write it down during, not after).
5. **Write `01`–`04`**, one chapter per evidence note, each with its
   interactive example (`examples/*.json`, schema in `README.md`).
6. **Reassess the held-back chapter** once the service has been running
   long enough to have taught something.

Follow-up tasks to file (not created here):

- `lemon-agent: dry-run the web-services step 0 paste, fix, publish guide`
- `lemon-agent: build lemon-web-service-example as the reference service`
- `lemon-agent: write web-services 01–04 from collected evidence`
- `lemon-agent: 4 interactive examples for the web-services chapters`

---

## Appendix A — `guides/web-services/full-setup.md`, ready to lift

Complete and in house shape. Its two outbound links point at chapters
that exist today (`coding-agents/design-before-code`,
`coding-agents/verification-loop`), so publishing it alone creates no
dead links. Move it to `guides/web-services/full-setup.md` verbatim when
the registry entry lands; bump `updated` to the ship date.

````markdown
---
title: "Step 0: The one-paste web-service baseline"
step: 0
status: draft
updated: 2026-08-27
description: "Optional baseline for a frontend/backend service: an agreed route contract, one vertical slice, runnable verification gates, and web-specific working agreements — set up one confirmed step at a time."
---

A web service is where an agent's speed is most tempting and least
verified: the build goes green long before the endpoint works. Every
later step in this guide is independently adoptable. This step is the
one paste that sets up the baseline, confirming each file with you
before it is written.

What it sets up (each explained properly in its own step):

- An **agreed route contract** before any handler exists — the design
  interview, narrowed to a service.
- One **vertical slice**: a single route wired browser → handler →
  store → back, and nothing else.
- **Verification at the request**, as runnable commands that are shown
  failing before they are shown passing.
- **Working agreements** for web work in the project instruction file
  your agent supports, such as `AGENTS.md` or `CLAUDE.md`.

It stops before deploying. Deploying is step 4's business, and the first
deploy is a decision you should be awake for.

## The paste

```text
Set up my web-service baseline. Work one step at a time, show me every
file before writing it, and wait for my ok between steps.

1. Interview me first, one open question at a time, no multiple-choice.
   Do not write any code during this step. Continue until you can state
   in one sentence each: what this service does for its first user; the
   one route that would prove it works end to end; where state lives;
   and what must never leak (keys, other users' data). Show me those
   four sentences and wait.

2. Propose the smallest project that can serve that one route end to
   end. Name the runtime, the framework, and the store you would pick,
   with a one-line reason each, and wait for my choice. If this repo
   already has a stack, use it and say so instead of proposing.

3. Write the route contract before any handler: one file listing every
   route as method, path, request shape, response shape, and error
   cases, including the failure cases we discussed. State plainly that
   this file changes first whenever the shape changes.

4. Build only the vertical slice: that one route, wired from the
   browser through the handler to the store and back. No second route,
   no styling pass, no auth beyond an obvious placeholder. Before you
   write it, list every file you intend to add, and tell me what you
   are deliberately leaving out.

5. Add verification as runnable commands, not prose. At minimum:
   - a smoke command that starts or targets a running instance, issues
     a real request to the route, asserts on status and response body,
     and exits non-zero on failure;
   - a request-level test of the slice using fixture data with the
     store stubbed, and no live or metered service in the test path.
   Then prove each command can fail: break the handler, run it, show me
   the non-zero exit and the output. Fix it and show the same command
   passing. A check nobody has seen fail is not yet a check.

6. Write these working agreements into the project instruction file
   this agent supports (AGENTS.md for Codex, CLAUDE.md for Claude Code,
   or the documented equivalent), under "## Working agreements":
   - Contract first: change the route contract file before the handler,
     never after.
   - Prove at the request: a green build is not a working endpoint. The
     proof is the smoke command against a running instance, with the
     response body shown.
   - Same target: run the checks against the artifact that will ship,
     not only against the dev server.
   - No billed calls in tests: stub every metered client; grep for live
     client construction before the first test run.
   - Secrets by reference: no key, token, or connection string in the
     repo. Read from the environment and fail loudly when one is
     missing.
   - Deploys are mine: never deploy, migrate, or delete remote state
     without my explicit ok on that specific step.

7. Do not deploy. Print the exact commands to run the app, run the
   smoke, and run the tests, then stop.
```

## If you'd rather go manual

Two habits carry most of this. Hold the design conversation before the
first handler ([make the agent interview
you](/guides/coding-agents/design-before-code/)), and move your proof
from the build to the request ([prove it before and
after](/guides/coding-agents/verification-loop/)). A route contract in
one file and one smoke command that has been seen to fail is already the
baseline; the rest layers on.
````
