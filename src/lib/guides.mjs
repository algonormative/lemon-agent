// Guide registry: order, titles, and per-guide intro copy.
// A chapter's collection id is "<guide-slug>/<chapter-slug>".

// Each domain wears a citrus variety over the shared lemon base: the
// house stays lemon; each guide gets its own accent (see DESIGN.md).
export const GUIDES = [
  {
    slug: 'coding-agents',
    title: 'Working with Coding Agents',
    short: 'Coding agents',
    citrus: 'lime',
    blurb:
      'The core field guide: verification loops, design interviews, ' +
      'adversarial reviews, tool surfaces, small tools, and generated UIs. ' +
      'One pattern at a time, each with a prompt you can adapt.',
    intro:
      'Concrete patterns that survive real use: what to watch out for, ' +
      'and the habits worth building. Written for humans to adopt one ' +
      'step at a time; every step ends with an optional prompt that helps ' +
      'you apply it in your own environment.',
  },
  {
    slug: 'git',
    title: 'Shipping Software with Git + Coding Agents',
    short: 'Git + agents',
    citrus: 'tangerine',
    blurb:
      'How git and an agent compose: checkpoint commits, branches as ' +
      'blast radius, history the next session can read, diff-not-summary ' +
      'review, and recovery cheap enough to lean on.',
    intro:
      'Git was already the safety net under fast-moving software; an ' +
      'agent makes it essential. These steps are the git habits that ' +
      'turn agent speed from a risk into an asset, adoptable one at a ' +
      'time, each with a prompt you can adapt to your agent.',
  },
  {
    slug: 'vault',
    title: 'Keeping a Vault',
    short: 'The vault',
    citrus: 'grapefruit',
    blurb:
      'A personal knowledge base an agent can actually work: plain files ' +
      'in a repo, directories as state, an inbox habit, a daily log, and ' +
      'a doctor script keeping it honest.',
    intro:
      'A vault is a personal knowledge base built from plain markdown in ' +
      'a git repo, structured so an agent can file, find, triage, and ' +
      'maintain it with you. These steps build one from scratch, one ' +
      'habit at a time.',
  },
  {
    slug: 'legibility',
    title: 'What Does AI Say About You?',
    short: 'Legibility',
    citrus: 'yuzu',
    blurb:
      'Assistants answering buyer-intent questions are a front door to ' +
      'your work. A stable-ID prompt battery, an isolated web-enabled ' +
      'harness, and a graded findings table measure what they say today — ' +
      'and whether your fixes moved it.',
    intro:
      'When someone asks an assistant about your project, the answer is ' +
      'assembled from whatever your public surfaces say — and nothing ' +
      'else. This guide is an audit you can run in an afternoon: measure ' +
      'the answers, grade them against reality, fix the gaps, re-run, ' +
      'and diff.',
  },
  // Wears the house lemon by explicit assignment (DESIGN.md, 2026-09-02):
  // the other varieties are spoken for, and minting a sixth is an owner
  // call. `.citrus-lemon` is a real rule in Base.astro, not a fallthrough.
  {
    slug: 'payments',
    title: 'Paying for Things with Agents',
    short: 'Agent payments',
    citrus: 'lemon',
    blurb:
      'Fund an agent so it can pay for what it uses: four funding routes ' +
      'compared, the five ways to lose the money, per-call and per-day ' +
      'spend caps, and one real sub-cent purchase you can read back ' +
      'on-chain.',
    intro:
      'An agent that can pay for a call is a different tool from one that ' +
      'has to stop and ask you. The mechanics are small but unforgiving, ' +
      'and the official docs stop at testnet. These steps take a wallet ' +
      'from empty to one verified purchase, under a cap you chose.',
  },
];

export const guideBySlug = (slug) => GUIDES.find((g) => g.slug === slug);
export const shortTitle = (t) => t.replace(/^Step \d+: /, '');
