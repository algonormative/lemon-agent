# Design notes

Two systems live here: the citrus visual language (the house and its
guides) and the craft architecture (how domain pages mount, incubate,
and earn navigation). The craft architecture is the settled owner
decision of 2026-08-07 and wins wherever the two touch.

## The citrus system (house + guides)

The house is lemon. The **guides and lists** wear citrus varieties over
the shared base, so sections are recognizable at a glance while
everything stays one brand:

| Surface | Citrus | Accent | Where it shows |
|---------|--------|--------|----------------|
| House + course (`/`, `/start/`) | **lemon** | chartreuse `#c7d86f` | the default everything layers on |
| Working with Coding Agents | **lime** | `#a4ce54` | `/guides/coding-agents/*` |
| Git + Coding Agents | **tangerine** | `#f2ab52` | `/guides/git/*` |
| Keeping a Vault | **grapefruit** | `#f293a2` | `/guides/vault/*` |
| What Does AI Say About You? | **yuzu** | `#e8c94e` | `/guides/legibility/*` |
| Paying for Things with Agents | **lemon** | chartreuse `#c7d86f` | `/guides/payments/*` |
| Failure lists | **blood orange** | `#ef7c50` | `/prose-failure-list/`, `/agent-workflow-failure-list/` |

The payments guide wears the house lemon on purpose (assigned
2026-09-02): the five varieties above are all spoken for, blood orange
carries the lists' taxonomy, and minting a sixth variety is an owner
call rather than a publishing one. `.citrus-lemon` is defined
explicitly in `Base.astro` so the guide *opts into* the house accent
instead of falling through to it silently — swapping in a new variety
later is one field in `GUIDES` plus two CSS lines.

Mechanics: `Base.astro` defines an accent trio with lemon defaults
(`--accent`, `--accent-ink` at ≥4.5:1 on the paper background,
`--accent-soft`, `--accent-hover`; dark-mode variants alongside). A
page opts in via `citrus="lime"` on `Base` (sets `class="citrus-lime"`
on `<body>`); the same classes work on any container, which is how
index cards carry per-guide accents. House chrome never tints: the
brand header/footer, `.chip`, selection, and terminal blocks stay
chartreuse everywhere.

**Craft pages do not get citrus palettes.** Owner decision,
2026-08-07: every craft page uses the Lemon visual identity; citrus
may appear in craft prose as editorial wordplay, never as a palette or
taxonomy. (This supersedes the earlier note reserving yuzu for audio.)

## Craft: the architecture (settled 2026-08-07, renamed from "wings")

- **Root is the developer craft.** `/` with the course and field
  manual is the foundation the other domains build on.
- **Canonical craft routes**: `/writing`, `/audio`, `/work`,
  `/science`. Craft content is canonical in `craft/*.md`, served raw
  at `/craft/*.md`; instrument pages nest under the craft route
  (`/writing/interview-conductor`). Existing public URLs are
  preserved; renames ship a redirect (`public/_redirects` carries both
  the `/writers`→`/writing` and the `/wings/*`→`/craft/*` moves).
- **Craft lifecycle.** A craft page may exist **unlisted** while
  incubating: published, linked from `/craft/` and the machine
  surfaces, absent from primary navigation and the home page.
  Publication alone never implies a craft earned navigation.
- **The navigation gate**: one complete user journey containing an
  installable instrument, an applicable judgment artifact, a worked
  use path, and external validation (someone outside the house used
  it). Statuses on the pages stay honest meanwhile: `v0` = something
  usable today; `scoping` = the published plan.
- **Craft page anatomy**: orientation (who it's for, what stance),
  instruments (installable skills and/or paste-ready workflows),
  worked examples, the judgment/check artifact, and honest
  availability for everything not yet real.
- **Shared resources keep one canonical URL.** A resource that serves
  several crafts (the PF list serves writing; the verify-info pass
  serves work and writing) lives at its canonical URL and is linked,
  never duplicated.
- **Tool documentation lives with the tool.** A craft page documents
  the *practice* — folder discipline, gates, receipts, the loop — and
  links to the tool's own site or repo for install, flags, and
  reference. A flag documented twice goes stale in one place. This is
  what keeps `/audio` distinct from both
  [smpl](https://github.com/algonormative/smpl) (the toolchain, which owns
  its CLI reference and feature-key registry) and lemon.audio (toys,
  drops, and the command-line studio, in a weirder register): practice
  here, tool there, play at lemon.audio.
- **Skills**: authored in this repo under `skills/`, installed via
  `npx skills`; runtime copies are the installer's problem. Naming is
  domain-specific first (`writing-interview`, `work-verify-info`); a
  general name is earned only after a second domain demonstrates the
  same reusable behavior. A craft-level bundle is advertised only once
  the craft has at least two distinct installable skills.
- **User state stays in the user environment.** No hosted state or
  Lemon service is required by the free guide-and-skill path; any
  future paid service is optional and separate.

## Constraints

- Accent inks hold ≥4.5:1 contrast on `--bg` in both themes; bright
  accents are backgrounds for `--chip-ink` text only, never text.
- The palette stays "softened for long-form reading": accents flavor
  the page, they don't flood it. If a change makes a chapter read like
  a poster, it's wrong.
