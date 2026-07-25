---
name: dj-crucial-editor
description: Design system and interaction principles for Crucial Editor, DJ's in-browser agentic editor that opens agent-generated HTML artifacts for a human to annotate and send feedback on. Use whenever building, styling, or reviewing any Crucial Editor surface - editor chrome, annotation UI, artifact templates, mocks, or marketing - and whenever deciding how Crucial should behave while a user is editing. Carries the locked design philosophy, the Duolingo-derived visual language, and a cited evidence base. This is not Lavish Editor; use lavish-design for that.
user-invocable: true
---

Read `references/evidence.md` for how the editor should behave. For visual foundations during
migration, read `../lavish-design/README.md` - see the migration status below before applying any
of it.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create
static HTML files for the user to view. If working on production code, copy assets and read the
rules here to become an expert in designing with this brand.
If the user invokes this skill without other guidance, ask what they want to build, ask some
questions, and act as an expert designer who outputs HTML artifacts _or_ production code.

## Locked design philosophy

**Clean, simple and friendly.**

This is locked. It does not change, and it is not up for renegotiation in any individual task.
When a decision is ambiguous, resolve it toward clean, simple, and friendly - in that order of
tie-breaking. When another rule conflicts with the philosophy, the philosophy wins and the rule
is wrong.

One thing "simple" explicitly does **not** license: hiding uncertainty. Fewer competing elements
on screen, never fewer caveats. See `references/evidence.md` §3.2.

## Status: visual language mid-migration

This repository is a fork of `kunchenguid/lavish-axi`, and Crucial Editor currently does what
Lavish Editor does. The visual language has **not** diverged yet.

Tokens, specimen cards, and assets still live in the sibling `../lavish-design/` skill: dark ink,
cream type, a single brass accent, EB Garamond serif. That palette contradicts the locked
philosophy and is pending replacement with Duolingo-derived light and dark themes.

Until that migration lands, do not treat the inherited colors, fonts, or rules of thumb as
Crucial's design decisions. They are Lavish's, kept only so the token architecture stays
importable. The philosophy above and `references/evidence.md` are authoritative today; the
palette is not.

## Where things live

- `references/evidence.md` - **cited** interaction principles: artifact trustworthiness, response
  time budgets, direct manipulation, interruption cost, and the two places evidence conflicts
  with our locked decisions. Read this before making behavioral decisions. Every claim carries a
  confidence label and a verified DOI.
- `../lavish-design/colors_and_type.css` - token system, inherited, pending replacement
- `../lavish-design/preview/` - specimen cards, inherited
- `../lavish-design/ui_kits/editor/` - clickable React recreation of the editor chrome.
  Structurally useful since Crucial has the same two-pane shape; visually inherited.

Crucial has no wordmark or brand mark yet. Do not reuse Lavish's - those are the upstream
project's trademarks, and the MIT license this fork inherits grants copyright permission, not
trademark rights.

## Non-negotiable accessibility rule

**Color may carry meaning, but never alone.** Every correct/error/success/danger state needs a
second channel - an icon, a position, or a word. Any state distinguishable only by hue is a
defect.

This survives the Duolingo migration. Duolingo's green-correct/red-incorrect pairing is exactly
the red/green contrast that fails for roughly 8% of men with protanopia or deuteranopia, and it
is explicitly prohibited by the figure checklist this project adopted. Redundant color is fine;
load-bearing color is not. See `references/evidence.md` §3.1.

## Inherited rules of thumb, and which already conflict

The seven rules in `../lavish-design/SKILL.md` are Lavish's. Two already contradict the locked
philosophy and are expected to go:

- "No emoji. No exclamation marks." conflicts with **friendly**.
- "Shadows only on floating surfaces. Never on buttons." conflicts with the Duolingo button
  treatment, where the press-down shadow is the defining affordance.

Check any inherited rule against the locked philosophy before applying it to new Crucial work.

## To produce a new HTML artifact

1. `@import "../lavish-design/colors_and_type.css";` in your stylesheet (or copy the tokens block
   inline if standalone).
2. Build with the semantic vars (`--bg`, `--fg`, `--accent`, etc.) - never hard-code hex. This is
   what makes the pending palette swap a one-file change instead of a rewrite.
3. Set `font-family: var(--font-sans)` on the body.
4. Every interactive target gets a generous hit area - large targets are both friendlier and
   measurably faster to acquire (`references/evidence.md` §2.3).
5. If you need a component (button, pill, bubble, annotation card, top bar), open the matching
   JSX file in `../lavish-design/ui_kits/editor/` and copy the styles object - they are already
   token-driven.
