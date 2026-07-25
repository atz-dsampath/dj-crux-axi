---
name: crux
description: Design system and interaction principles for Crux Editor, DJ's in-browser agentic editor that opens agent-generated HTML artifacts for a human to annotate and send feedback on. Use whenever building, styling, or reviewing any Crux Editor surface - editor chrome, annotation UI, artifact templates, mocks, or marketing - and whenever deciding how Crux should behave while a user is editing. Carries the locked design philosophy, the Duolingo-derived visual language, and a cited evidence base. This is not Lavish Editor; use lavish-design for that.
user-invocable: true
---

Read `colors_and_type.css` for the visual language and `references/evidence.md` for how the
editor should behave. The sibling `../lavish-design/` skill holds inherited structure only - see
the migration status below before applying anything from it.

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

## Status: partially migrated

This repository is a fork of `kunchenguid/lavish-axi`, and Crux Editor currently does what
Lavish Editor does.

**Migrated.** `colors_and_type.css` is Crux's own, Duolingo-derived, with light and dark
themes. Color values marked `[v]` in that file were extracted from Duolingo's shipped production
bundle rather than reproduced from memory; `[i]` marks the few that are inferred. Use this file.

**Not migrated.** `../lavish-design/preview/` and `../lavish-design/ui_kits/editor/` still render
Lavish's dark-ink-and-brass palette and reference Lavish token names. They are structurally
useful - Crux has the same two-pane shape - but do not copy their color decisions.

**Deliberately absent.** Crux has no wordmark or brand mark. Do not reuse Lavish's; those are
the upstream project's trademarks, and the MIT license this fork inherits grants copyright
permission, not trademark rights.

## Where things live

- `colors_and_type.css` - Crux's token system. Light + dark. The source of truth for color,
  type, spacing, radii, and the press-down button.
- `references/evidence.md` - **cited** interaction principles: artifact trustworthiness, response
  time budgets, direct manipulation, interruption cost, and the two places evidence conflicts
  with our locked decisions. Read this before making behavioral decisions. Every claim carries a
  confidence label and a verified DOI.
- `../lavish-design/preview/` - specimen cards, inherited, still Lavish-colored
- `../lavish-design/ui_kits/editor/` - clickable React recreation of the editor chrome.
  Structurally useful; visually inherited.

## Typography is a substitution, and that is not optional

Duolingo's own faces are `feather` (display) and `duolingo-sans` (UI), both confirmed from their
shipped CSS. Both are proprietary: `feather` is a custom face that cannot be licensed at any
price, and their UI face descends from a commercial rounded DIN.

`colors_and_type.css` therefore substitutes **Nunito** (UI) and **Fredoka** (display), both under
the SIL Open Font License. Do not "correct" this by naming the real faces - they will not load,
will silently fall back, and will shift every layout on the machines that happen to have them.

Crux has no wordmark or brand mark yet. Do not reuse Lavish's - those are the upstream
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

## Inherited rules of thumb, and which are now dead

The seven rules in `../lavish-design/SKILL.md` are Lavish's. Two are now definitively superseded:

- "No emoji. No exclamation marks." conflicts with **friendly**. Dead.
- "Shadows only on floating surfaces. Never on buttons." is dead. The press-down button shadow
  (`--btn-depth`) is Crux's defining affordance, and `.crux-btn` depends on it.

Check any remaining inherited rule against the locked philosophy before applying it.

## To produce a new HTML artifact

1. `@import "colors_and_type.css";` in your stylesheet (or copy the tokens block inline if
   standalone).
2. Put `class="crux"` on the body, or `.crux-root` on your wrapper.
3. Build with the semantic vars (`--bg`, `--fg`, `--accent`, `--danger`, ...) - never hard-code
   hex. Every alias resolves in both themes; a hard-coded hex will not.
4. Dark mode follows the OS automatically. Pin it with `data-theme="dark"` or `data-theme="light"`
   on `<html>` only when the artifact genuinely needs one.
5. Use `.crux-btn` for actions and `.crux-status--*` for state. The status classes carry a
   `::before` glyph on purpose - see the accessibility rule above.
6. Every interactive target gets a generous hit area - large targets are both friendlier and
   measurably faster to acquire (`references/evidence.md` §2.3). `--btn-h-md` is 48px for a
   reason.
7. If you need a component shape (pill, bubble, annotation card, top bar), open the matching JSX
   file in `../lavish-design/ui_kits/editor/` for the structure, then re-color it with Crux
   tokens.
