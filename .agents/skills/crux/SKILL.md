---
name: crux
description: Design system and interaction principles for Crux Editor, DJ's in-browser agentic editor that opens agent-generated HTML artifacts for a human to annotate and send feedback on. Use whenever building, styling, or reviewing any Crux Editor surface - editor chrome, annotation UI, artifact templates, mocks, or marketing - and whenever deciding how Crux should behave while a user is editing. Carries the locked design philosophy, the Duolingo-derived visual language, brand assets, and a cited evidence base.
user-invocable: true
---

Read `colors_and_type.css` for the visual language and `references/evidence.md` for how the
editor should behave. The sibling `` skill holds the component kit and specimen
cards, already themed with these tokens.

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

## Where things live

- `colors_and_type.css` - the token system. Light + dark. Source of truth for color, type,
  spacing, radii, and the press-down button. Color values marked `[v]` were extracted from
  Duolingo's shipped production bundle rather than reproduced from memory; `[i]` marks the few
  that are inferred.
- `assets/` - `crux-wordmark.svg` (outlined Fredoka, accent X) and `crux-mark.svg` (square icon)
- `references/evidence.md` - **cited** interaction principles: artifact trustworthiness, response
  time budgets, direct manipulation, interruption cost, and the two places evidence conflicts
  with our locked decisions. Read this before making behavioral decisions. Every claim carries a
  confidence label and a verified DOI.
- `preview/` - specimen cards, one concept per card
- `ui_kits/editor/` - clickable React recreation of the editor chrome

## The wordmark

`assets/crux-wordmark.svg` is lowercase "crux" with the `x` in accent green. The accent sits on
that letter because it carries the meaning: crux is the decisive point, and X is what you mark a
spot with - which is exactly what annotating an element does.

It is **real vector outlines** extracted from Fredoka SemiBold, not live `<text>`, so it keeps its
shape where the webfont is absent. Two rules for using it:

- `cru` is `currentColor`; only the `x` is a fixed `#58cc02`. **Inline the SVG** in dark contexts.
  Loaded through `<img>`, an external SVG cannot inherit `currentColor` and `cru` renders black.
- Do not re-typeset it by setting "crux" in Fredoka and calling that the logo. A wordmark that
  reflows with the available font is not a wordmark.

`assets/crux-mark.svg` is the square counterpart - a rounded 64x64 tile with a white X - for
favicon, avatar, and app icon, where a wordmark cannot fit. It stays legible at 16px and in
grayscale, which the accent-X wordmark also survives because the letterforms carry it without
colour.

## Typography is a substitution, and that is not optional

Duolingo's own faces are `feather` (display) and `duolingo-sans` (UI), both confirmed from their
shipped CSS. Both are proprietary: `feather` is a custom face that cannot be licensed at any
price, and their UI face descends from a commercial rounded DIN.

`colors_and_type.css` therefore substitutes **Nunito** (UI) and **Fredoka** (display), both under
the SIL Open Font License. Do not "correct" this by naming the real faces - they will not load,
will silently fall back, and will shift every layout on the machines that happen to have them.

There is no serif in this system. Fredoka carries the brand moments a serif would have.

## Non-negotiable accessibility rule

**Color may carry meaning, but never alone.** Every correct/error/success/danger state needs a
second channel - an icon, a position, or a word. Any state distinguishable only by hue is a
defect.

Duolingo's green-correct/red-incorrect pairing is exactly the red/green contrast that fails for
roughly 8% of men with protanopia or deuteranopia, and it is explicitly prohibited by the figure
checklist this project adopted. Redundant color is fine; load-bearing color is not. See
`references/evidence.md` §3.1.

## Two rules the philosophy killed

Both came from the design system this one grew out of, and both are dead:

- "No emoji. No exclamation marks." conflicts with **friendly**.
- "Shadows only on floating surfaces. Never on buttons." The press-down button shadow
  (`--btn-depth`) is Crux's defining affordance, and `.crux-btn` depends on it.

## To produce a new HTML artifact

1. `@import "colors_and_type.css";` in your stylesheet (or copy the tokens block inline if
   standalone).
2. Put `class="crux"` on the body, or `.crux-root` on your wrapper.
3. Build with the semantic vars (`--bg`, `--fg`, `--accent`, `--danger`, ...) - never hard-code
   hex. Every alias resolves in both themes; a hard-coded hex will not. This is not style advice:
   palette-independent aliases are what let this entire design system be re-themed mechanically.
4. Dark mode follows the OS automatically. Pin it with `data-theme="dark"` or `data-theme="light"`
   on `<html>` only when the artifact genuinely needs one.
5. Use `.crux-btn` for actions and `.crux-status--*` for state. The status classes carry a
   `::before` glyph on purpose - see the accessibility rule above.
6. Every interactive target gets a generous hit area - large targets are both friendlier and
   measurably faster to acquire (`references/evidence.md` §2.3). `--btn-h-md` is 48px for a
   reason.
7. If you need a component (pill, bubble, annotation card, top bar), open the matching JSX file in
   `ui_kits/editor/` and copy the styles object - they are already token-driven.
