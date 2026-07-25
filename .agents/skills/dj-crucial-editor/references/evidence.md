# Evidence base: Crucial Editor interaction principles

Why this file exists: Crucial Editor's design decisions should be traceable to something
other than taste.
Everything below is tied to a real, citable source with a DOI.
Where a claim is not evidenced, this file says so rather than dressing up an opinion as a finding.

Read this when deciding how the editor behaves - annotation flow, feedback timing, error and
success states, how much to show at once.
For colors, type, and component styling, read `../README.md` instead.

## Contents

- [How to read the confidence labels](#how-to-read-the-confidence-labels)
- [Part 1 - What a trustworthy artifact looks like](#part-1---what-a-trustworthy-artifact-looks-like)
- [Part 2 - What good editing feels like](#part-2---what-good-editing-feels-like)
- [Part 3 - Where the evidence contradicts our locked decisions](#part-3---where-the-evidence-contradicts-our-locked-decisions)
- [Part 4 - What is not evidenced here](#part-4---what-is-not-evidenced-here)
- [Citations](#citations)

## How to read the confidence labels

Each principle carries one of these, because the strength of a recommendation should be visible:

- **[full text]** - the source was read end to end.
- **[abstract]** - only the abstract was available; the specific claim is stated conservatively.
- **[metadata]** - the citation is verified real, but the supporting content is the widely
  reproduced summary of that work rather than the text itself. Treat as a pointer to read later,
  not as settled.

## Part 1 - What a trustworthy artifact looks like

Crucial renders artifacts an agent generated. Nobody verified them. That framing drives this section.

### 1.1 Polish inflates perceived credibility. Counteract it deliberately. **[full text]**

Allen, Erhardt & Calhoun report that identical information rendered on aesthetically pleasing
brain images is judged **more persuasive and more credible** than the same information shown
plainly (citing Keehner et al. 2011; McCabe & Castel 2008).

This is the central hazard of the product. Crucial exists to make agent output beautiful, which
means it is structurally a credibility amplifier for claims nobody checked. A confidently wrong
agent becomes *more* convincing after Crucial renders it.

Implication: visual polish must never be the only quality signal on screen. Provenance -
where a number came from, how confident the agent is, what was assumed - needs standing equal
to styling. An artifact that looks finished should not thereby look verified.

### 1.2 Show uncertainty, and name which kind. **[full text]**

Their survey of 1,451 figures across 288 articles in 6 journals found:

| Measure | Result |
| --- | --- |
| 3D graphics labeling the dependent variable | 43% |
| 3D graphics portraying uncertainty | 20% |
| 2D graphics showing uncertainty but never defining its type | ~30% |

Quoting Wainer, they argue a display must "remind us that the data being displayed do contain
some uncertainty" and "characterize the size of that uncertainty as it pertains to the inferences
we have in mind."

Implication: when an agent puts an estimate, projection, or metric in an artifact, the artifact
carries the uncertainty *and* says what kind it is. An unlabeled error bar is worse than none -
they note that poor labeling of error bars has been shown to encourage misinterpretation.

### 1.3 Annotate in place, not in a legend. **[full text]**

Direct finding: "Integrating descriptions into the figure (rather than the legend) discourages
misinterpretation and permits readers to understand the display more quickly."

This is independent empirical support for Crucial's core interaction. Anchored, in-artifact
annotation is not merely a nicer affordance than a detached comment sidebar - it measurably
reduces misreading and speeds comprehension. Build around it on purpose.

### 1.4 Annotation must stay judicious. **[full text]**

Same paper: annotation "must be used judiciously and should not overwhelm or detract from the
data visualization itself."

This is the evidence-backed half of our locked *simple*. Annotation density has a ceiling.

### 1.5 Prefer position over color for encoding meaning. **[full text]**

Via Cleveland & McGill 1985: readers decode position along an axis more accurately than color
mapping. Reach for layout before palette when something must be compared.

### 1.6 Dual-code instead of thresholding. **[full text]**

Their strongest technique: map the value to hue *and* the uncertainty to transparency. Compared
to a thresholded view, "no information is lost," while a threshold collapses rich data into a
dichotomous significant/not that inherits every limitation of all-or-none testing.

Implication for Crucial: avoid UI that silently drops content below some confidence cutoff.
Fade it, don't delete it.

### 1.7 Take human perceptual limits as a design constraint. **[abstract]**

Goldstone, Pestilli & Börner argue that visualizations "must take into account human abilities
and limitations to be effective tools for exploration and communication."

Only the abstract was accessible (Elsevier paywall), so nothing more specific is claimed here.
Worth obtaining in full - it is a feature review by the Indiana University cognitive science
group and likely the richest single source on this list.

## Part 2 - What good editing feels like

None of Part 1 addresses interaction. This part does.

### 2.1 Three response-time thresholds govern how the editor should feel. **[metadata]**

Miller (1968) established response-time categories for interactive systems; Card, Robertson &
Mackinlay (1991) grounded the short end in perceptual and cognitive processing rates. The
widely reproduced thresholds:

| Budget | What it buys |
| --- | --- |
| ~0.1s | Feels instantaneous. Required for anything that should feel like direct manipulation - hover highlight, selection, mode toggle. |
| ~1s | Preserves uninterrupted flow of thought. Acceptable for opening a panel or committing an annotation. |
| ~10s | Outer limit of held attention. Beyond this the user needs a progress signal or they leave. |

Implication: hover, selection, and mode switching in Crucial are 0.1s obligations, not
optimizations. Anything crossing 10s - agent round trips - must show progress rather than
silence.

Labeled `[metadata]` because the citations are verified but the thresholds here are the standard
summary, not text I read. Worth confirming before quoting numbers externally.

### 2.2 Direct manipulation: continuous representation, reversible actions, visible results. **[metadata]**

Shneiderman (1983) characterized direct manipulation as continuous representation of the object
of interest, physical action instead of typed syntax, and rapid incremental reversible operations
whose effect on the object is immediately visible.

Implication: clicking the thing you mean is the correct primitive for annotation. Every
annotation action should be incrementally reversible with the result visible without a refresh.
Crucial should never require the user to describe in prose which element they meant.

### 2.3 Target size and distance set interaction cost. **[metadata]**

Fitts (1954) established that movement time to acquire a target is a function of the distance to
it and its size.

Implication: annotation targets, close buttons, and send controls have a floor on size that is
not negotiable for visual reasons. This one aligns with the chunky Duolingo geometry - large,
generous hit targets are both friendlier *and* faster.

### 2.4 Extraneous complexity has a measurable cost. **[metadata]**

Sweller (1988) established that load imposed by poorly designed material consumes working memory
that would otherwise go to the actual task.

Implication: this is the evidence behind our locked *clean* and *simple*. Chrome that competes
with the artifact is not merely inelegant - it spends a finite resource the user needs for
reviewing content.

### 2.5 Interruption costs stress, not time. **[metadata]**

Mark, Gudith & Klocke (2008) found interrupted work is completed in *less* time, but at the cost
of higher frustration, time pressure, effort, and stress.

Implication, and it is a sharp one for this product: Crucial's whole loop is an interruption
engine - the agent works, then interrupts a human to review. Speed of the review loop is not
the metric to optimize. The user finishing faster is compatible with the user feeling worse.
Design for calm resumption: preserve context, never lose queued feedback, make it obvious where
the user left off.

### 2.6 Established usability heuristics still apply. **[metadata]**

Nielsen & Molich (1990). The ones that bind hardest here: visibility of system status, user
control and freedom (undo), recognition over recall, and error prevention over error messages.

Implication: agent presence state must always be visible; every annotation must be undoable;
the user should never have to remember what they queued.

## Part 3 - Where the evidence contradicts our locked decisions

Recording these rather than quietly resolving them, because both are live tensions.

### 3.1 Red/green signaling is explicitly prohibited by the checklist we adopted

Table 1 of Allen et al. asks directly: *"Has red/green contrast been avoided to accommodate
common forms of colorblindness?"* and *"Can features be discriminated when printed in
grayscale?"*

Duolingo's signal system is green for correct and red for incorrect. That is exactly the
prohibited pairing, and it fails for roughly 8% of men with protanopia or deuteranopia.

**Resolution: color may carry correctness, but never alone.** Every correct/error state in
Crucial must also carry a non-color channel - an icon, a position, or a word. Any state that is
distinguishable only by hue is a defect. This preserves the Duolingo look while satisfying the
checklist; the two are compatible as long as color is redundant rather than load-bearing.

### 3.2 "Show more, hide less" pulls against "clean and simple"

Allen et al. argue for maximal data density - violin plots over bar plots, un-thresholded maps,
individual points overlaid. Our locked philosophy pulls the other way.

**Resolution: the lock wins, expressed as progressive disclosure.** Simple by default, full
distribution on demand. What the lock does *not* license is hiding uncertainty - per 1.2 and 1.6,
uncertainty is content, not clutter. "Clean" means fewer competing elements, never fewer caveats.

## Part 4 - What is not evidenced here

Stated plainly so nobody mistakes silence for endorsement:

- **The Duolingo aesthetic itself.** Chosen deliberately by DJ. No source here supports or
  opposes it beyond the Fitts alignment in 2.3 and the red/green conflict in 3.1.
- **"Friendly" as a measurable property.** The locked philosophy is a product decision. Nothing
  here establishes that friendlier interfaces produce better review outcomes.
- **Progressive disclosure as a formal finding.** Searched, and no single canonical academic
  source resolved. It is a practitioner convention. Treated above as a resolution strategy, not
  as evidence.
- **Anything about text editing mechanics** - cursor behavior, selection models, undo stack
  design, collaborative editing. Not covered by any source on this list.
- **The three TED/YouTube talks** originally proposed for this file. The supplied links pointed
  at platform homepages, not resources, so nothing from them is represented here.

## Citations

All DOIs verified against the Crossref and NCBI E-utilities APIs.

**Artifact honesty**

1. Allen EA, Erhardt EB, Calhoun VD. Data visualization in the neurosciences: overcoming the
   curse of dimensionality. *Neuron*. 2012;74(4):603-8. doi:10.1016/j.neuron.2012.05.001
   (PMID 22632718, PMC4427844 - open access, read in full)
2. Goldstone RL, Pestilli F, Börner K. Self-portraits of the brain: cognitive science, data
   visualization, and communicating brain structure and function. *Trends Cogn Sci*.
   2015;19(8):462-74. doi:10.1016/j.tics.2015.05.012 (PMID 26187032 - abstract only)

**Cited within Allen et al., not independently retrieved**

3. Cleveland WS, McGill R. Graphical perception and graphical methods for analyzing scientific
   data. 1985. - position vs color decoding accuracy
4. Keehner M, et al. 2011; McCabe DP, Castel AD. 2008. - aesthetic rendering and perceived
   credibility
5. Wainer H. 1996. - uncertainty portrayal requirements

**Editing interaction**

6. Shneiderman B. Direct manipulation: a step beyond programming languages. *Computer*.
   1983;16(8):57-69. doi:10.1109/mc.1983.1654471
7. Miller RB. Response time in man-computer conversational transactions. *AFIPS Fall Joint
   Computer Conference*. 1968. doi:10.1145/1476589.1476628
8. Card SK, Robertson GG, Mackinlay JD. The information visualizer, an information workspace.
   *CHI '91*. doi:10.1145/108844.108874
9. Card SK, Moran TP, Newell A. The keystroke-level model for user performance time with
   interactive systems. *Commun ACM*. 1980;23(7):396-410. doi:10.1145/358886.358895
10. Fitts PM. The information capacity of the human motor system in controlling the amplitude of
    movement. *J Exp Psychol*. 1954;47(6):381-91. doi:10.1037/h0055392
11. Sweller J. Cognitive load during problem solving: effects on learning. *Cogn Sci*.
    1988;12(2):257-85. doi:10.1207/s15516709cog1202_4
12. Mark G, Gudith D, Klocke U. The cost of interrupted work: more speed and stress. *CHI '08*.
    doi:10.1145/1357054.1357072
13. Nielsen J, Molich R. Heuristic evaluation of user interfaces. *CHI '90*.
    doi:10.1145/97243.97281
