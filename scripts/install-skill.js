#!/usr/bin/env node
// Installs the repo-local `crux` design skill so agents can find it, and wires the
// /crux slash command.
//
// This exists because the wiring is not uniform across agents and cannot live in the
// skill itself. OpenCode reads ~/.agents/skills but does NOT turn skills into slash
// commands - its recognised frontmatter is name/description/license/compatibility/
// metadata, and `user-invocable` is ignored - so /crux needs a separate command file.
// Claude Code reads ~/.claude/skills. Codex and Copilot read their own directories.
// Without this script the whole arrangement has to be rebuilt by hand on a new machine,
// which is exactly how it was built the first time.
//
//   node scripts/install-skill.js            link the skill (no drift, tracks the repo)
//   node scripts/install-skill.js --copy     detached snapshot instead of a symlink
//   node scripts/install-skill.js --dry-run  print the plan, change nothing

import { existsSync, lstatSync, mkdirSync, rmSync, cpSync, symlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = "crux";
const repoSkill = fileURLToPath(new URL(`../.agents/skills/${SKILL}/`, import.meta.url));
const home = os.homedir();
const args = new Set(process.argv.slice(2));
const useCopy = args.has("--copy");
const dryRun = args.has("--dry-run");

// Canonical location, plus the per-agent directories that do not read it.
const canonical = path.join(home, ".agents", "skills", SKILL);
const agentLinks = [
  path.join(home, ".claude", "skills", SKILL),
  path.join(home, ".codex", "skills", SKILL),
  path.join(home, ".copilot", "skills", SKILL),
];

// OpenCode commands live in commands/ (plural); Codex uses prompts/.
const commandBody = `---
description: Design or build with the Crux Editor design system
---

Load the \`${SKILL}\` skill using the skill tool, then apply it to this request:

$ARGUMENTS

The skill carries a locked design philosophy (clean, simple and friendly), light and dark
tokens, the wordmark, a component kit, and a cited evidence base in references/evidence.md.

If no request was given above, ask what the user wants to build or design, ask a couple of
clarifying questions, then act as an expert designer who outputs either an HTML artifact or
production code depending on what they need.
`;
const commandFiles = [
  path.join(home, ".config", "opencode", "commands", `${SKILL}.md`),
  path.join(home, ".codex", "prompts", `${SKILL}.md`),
];

const actions = [];
const note = (verb, target, detail = "") => actions.push({ verb, target: target.replace(home, "~"), detail });

function place(target, { link }) {
  if (existsSync(target) || isBrokenLink(target)) {
    // Only ever replace something this script could have created. A real directory of
    // someone else's making is left alone rather than silently destroyed.
    if (!isBrokenLink(target) && !isManaged(target)) {
      note("skip", target, "exists and was not created by this script");
      return;
    }
    if (!dryRun) rmSync(target, { recursive: true, force: true });
  }
  if (!dryRun) {
    mkdirSync(path.dirname(target), { recursive: true });
    if (link) symlinkSync(repoSkill.replace(/\/$/, ""), target);
    else cpSync(repoSkill, target, { recursive: true });
  }
  note(link ? "link" : "copy", target, link ? `-> ${repoSkill.replace(home, "~")}` : "");
}

function isBrokenLink(p) {
  try {
    return lstatSync(p).isSymbolicLink() && !existsSync(p);
  } catch {
    return false;
  }
}

function isManaged(p) {
  try {
    if (lstatSync(p).isSymbolicLink()) return true;
    return existsSync(path.join(p, "SKILL.md"));
  } catch {
    return false;
  }
}

if (!existsSync(path.join(repoSkill, "SKILL.md"))) {
  console.error(`error: ${repoSkill}SKILL.md not found - run this from the repo`);
  process.exit(1);
}

place(canonical, { link: !useCopy });
for (const target of agentLinks) {
  // These always point at the canonical copy, never at the repo, so there is exactly
  // one place to update and the duplicates cannot drift apart.
  if (existsSync(target) || isBrokenLink(target)) {
    if (!isBrokenLink(target) && !isManaged(target)) {
      note("skip", target, "exists and was not created by this script");
      continue;
    }
    if (!dryRun) rmSync(target, { recursive: true, force: true });
  }
  if (!dryRun) {
    mkdirSync(path.dirname(target), { recursive: true });
    symlinkSync(canonical, target);
  }
  note("link", target, `-> ${canonical.replace(home, "~")}`);
}

for (const file of commandFiles) {
  if (!dryRun) {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, commandBody);
  }
  note("write", file, "/crux");
}

const width = Math.max(...actions.map((a) => a.target.length));
console.log(dryRun ? "plan (nothing changed):" : "installed:");
for (const a of actions) {
  console.log(`  ${a.verb.padEnd(5)} ${a.target.padEnd(width)}  ${a.detail}`);
}
console.log(`\n${SKILL} skill is ${useCopy ? "copied" : "linked"}. Restart your agent session, then use /${SKILL}.`);
if (!useCopy && !dryRun) {
  console.log(
    "Linked, so it tracks this checkout - moving or deleting the repo breaks it. Use --copy for a detached snapshot.",
  );
}
