---
title: "The Prose Failure List"
number: 1
surface: "prose"
arm: taste
entries: 24
prefix: "PF"
status: published
updated: 2026-08-05
description: "24 recurring problems in AI-assisted prose. Use the list to cut, clarify, and recover a human voice without flattening the ideas."
---

Use this list on anything written with an assistant, including this site. It
is a subtraction pass: remove empty language, repair unclear sentences, and
keep the ideas that still matter.

The goal is not to make every piece casual or elementary. A technical reader
also benefits from direct verbs, concrete evidence, and sentences that do not
hide the point. Keep specialist terms when they are the most precise words;
remove them when they merely signal expertise.

> The IDs are stable, so an editor can cite `PF-07` or `PF-16` without
> restating the whole rule. The list is deliberately opinionated. Override an
> entry when the effect is intentional, not because the assistant produced it
> by default.

## How to use it

**Review a draft in any chat or coding agent:**

```text
Apply the Prose Failure List to this draft. For every match, cite the PF id,
quote the text, and give the exact cut or rewrite. Preserve technical depth
and the author's stance. Do not add new claims. End with the three edits that
would most improve clarity.
```

**Install it as a reusable skill:**

```sh
npx skills add algonormative/lemon-agent --global \
  --agent codex claude-code --skill prose-failure-list --yes
```

Then ask your agent to “run the prose failure list on `drafts/post.md`.” A
managed `npx skills` install can serve more than one agent instead of creating
separate hand-copied versions.

**Use it from a program.** The raw list is available at
[/lists/prose-failure-list.md](/lists/prose-failure-list.md), with metadata in
[/catalog.json](/catalog.json). Automated use should report suggestions, not
block publication. Taste needs a person with a point of view.

## A. Word choice

1. **PF-01 — A vague verb stands in for the work.** “Delve into,” “unpack,”
   and “explore” do not say what happened. Prefer the real action: read,
   measured, listed, compared, tested.
2. **PF-02 — The point is delayed by “not just.”** “It is not just X; it is Y”
   often uses X as a runway. State Y directly unless the contrast matters.
3. **PF-03 — A list has three items only for rhythm.** Two real claims beat a
   polished trio with one invented or redundant member.
4. **PF-04 — Dashes are doing the work of sentences.** More than one pair of
   em dashes in a paragraph often means the relationships were never made
   clear. Split or connect the thoughts properly.
5. **PF-05 — Praise replaces evidence.** “Seamless,” “powerful,” and
   “effortless” claim a result the sentence did not show. Name the time saved,
   errors removed, or interface exposed.
6. **PF-06 — The opening clears its throat.** “In today's rapidly evolving
   landscape” delays the subject. Start with the specific situation.
7. **PF-07 — A conclusion word pretends the argument is complete.**
   “Ultimately” and “at the end of the day” cannot supply reasoning that the
   preceding sentences lack.
8. **PF-08 — An abstraction acts so nobody has to name the actor.** A
   technology “empowers” or a trend “drives,” but the sentence never says who
   changed what. Name the person, organization, or mechanism.

## B. Shape and pacing

9. **PF-09 — Connected reasoning was chopped into bullets.** If every item
   continues the same thought, a paragraph may make the relationship clearer.
10. **PF-10 — Every paragraph has the same rhythm.** Uniform blocks make every
    point feel equally important. Let a short sentence land when it should.
11. **PF-11 — The ending repeats the opening.** A conclusion that only
    summarizes a short piece makes the reader pay twice. End when the argument
    reaches its result.
12. **PF-12 — The prose narrates itself.** “Let's look at,” “as we have seen,”
    and “it is worth noting” are instructions around the sentence. Say the
    sentence.
13. **PF-13 — The title uses a subtitle it did not earn.** “X: Why Y Matters”
    is often two generic titles joined together. Prefer one specific promise.
14. **PF-14 — Symmetry matters more than substance.** Sections receive equal
    space even when one contains the actual insight. Give important material
    more room.
15. **PF-15 — The piece previews content it could already deliver.** In short
    writing, “we will cover” is slower than covering it.

## C. Judgment and stance

16. **PF-16 — Both sides are listed but never ranked.** “There are advantages
    and disadvantages” is a survey where the reader needed a judgment. Rank
    the tradeoffs or say what evidence is still missing.
17. **PF-17 — The closer returns the question unanswered.** “Only time will
    tell” is not a conclusion. State the present uncertainty and what would
    resolve it.
18. **PF-18 — “We” claims agreement that was never established.** Use “I,”
    name the actual group, or provide evidence of consensus.
19. **PF-19 — Enthusiasm has no stakes.** Calling everything “exciting” says
    less than showing what someone tried, spent, risked, or changed next.
20. **PF-20 — A second analogy competes with the first.** Keep the clearest
    analogy, or use the literal explanation when it already works.
21. **PF-21 — Authority has no source.** “Studies show,” “experts agree,” and
    “many argue” have the shape of evidence without a citation. Name the
    source or remove the claim.
22. **PF-22 — A lesson is attached after the point already landed.** A final
    “what this teaches us” paragraph can weaken an ending that was complete.

## D. Evidence and voice

23. **PF-23 — Advice sounds tested but contains no experience.** There is no
    attempt, failure, cost, or limit anywhere. If the advice was tested, show
    the relevant evidence. If it was not, say so.
24. **PF-24 — A quantity is vague when the number is available.** “Several,”
    “significantly,” and “a large number” hide scale. Use the count, date, and
    source when they matter; otherwise remove the quantitative pose.

---

*Part of [Lemon Agent](/). Companion: [The Agent Workflow Failure
List](/agent-workflow-failure-list/) reviews execution and verification.*
