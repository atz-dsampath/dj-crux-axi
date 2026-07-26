import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("check script runs all verification commands", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const checkCommands = packageJson.scripts.check.split(" && ");

  assert.deepEqual(checkCommands, [
    "npm run build",
    "npm run lint",
    "npm run format:check",
    "npm run typecheck",
    "npm test",
    "node scripts/build-skill.js --check",
  ]);
});

test("installable skill stays in sync with the no-args home output", async () => {
  const { createSkillMarkdown } = await import("../src/skill.js");
  const committed = await readFile(new URL("../skills/crux-axi/SKILL.md", import.meta.url), "utf8");

  assert.equal(committed, createSkillMarkdown(), "run `npm run build:skill` and commit the result");
});

test("published package includes the installable skill", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.ok(packageJson.files.includes("skills/crux-axi"));
});

test("the crux design skill ships the component kit it points at", async () => {
  // crux-design used to be a second skill beside this one, shipping a byte-identical
  // colors_and_type.css and an overlapping description, so an agent had no basis to
  // choose between them. It was merged in. This asserts the merge stayed whole rather
  // than leaving SKILL.md pointing at directories that no longer exist.
  const skillDir = new URL("../.agents/skills/crux/", import.meta.url);
  const skillMd = await readFile(new URL("SKILL.md", skillDir), "utf8");
  const frontmatter = skillMd.slice(4, skillMd.indexOf("\n---\n", 4));

  assert.match(frontmatter, /^name: crux$/m);
  assert.doesNotMatch(skillMd, /crux-design/);

  for (const entry of ["colors_and_type.css", "preview", "ui_kits/editor", "assets", "references"]) {
    assert.ok(existsSync(new URL(entry, skillDir)), `crux skill is missing ${entry}`);
  }
});

test("public crux skill is not marked internal", async () => {
  const skillMd = await readFile(new URL("../skills/crux-axi/SKILL.md", import.meta.url), "utf8");
  const frontmatter = skillMd.slice(4, skillMd.indexOf("\n---\n", 4));

  assert.doesNotMatch(frontmatter, /^metadata:\n {2}internal: true$/m);
});

test("build copies local design assets for published artifact injection", async () => {
  const buildScript = await readFile(new URL("../scripts/build.js", import.meta.url), "utf8");

  assert.match(buildScript, /daisyui\.css/);
  assert.match(buildScript, /daisyui-themes\.css/);
  assert.match(buildScript, /tailwindcss-browser\.js/);
});

test("package metadata matches the GitHub repository used for npm provenance", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.equal(packageJson.repository.url, "git+https://github.com/atz-dsampath/dj-crux-axi.git");
  assert.equal(packageJson.bugs.url, "https://github.com/atz-dsampath/dj-crux-axi/issues");
  assert.equal(packageJson.homepage, "https://github.com/atz-dsampath/dj-crux-axi#readme");
});

test("pnpm lock root importer matches the publish manifest", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const pnpmLock = await readFile(new URL("../pnpm-lock.yaml", import.meta.url), "utf8");

  for (const [name, specifier] of Object.entries(packageJson.dependencies)) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedSpecifier = specifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    assert.match(pnpmLock, new RegExp(`["']?${escapedName}["']?:[\\s\\S]*?specifier: ${escapedSpecifier}`));
  }
});

test("release workflow publishes from the release tag checkout", async () => {
  const workflow = await readFile(new URL("../.github/workflows/release-please.yml", import.meta.url), "utf8");

  assert.match(
    workflow,
    /uses: actions\/checkout@v6\n\s+if: \$\{\{ steps\.release\.outputs\.release_created \}\}\n\s+with:\n\s+ref: \$\{\{ steps\.release\.outputs\.tag_name \}\}/,
  );
});

test("release workflow can authenticate to npm and keeps telemetry env", async () => {
  const workflow = await readFile(new URL("../.github/workflows/release-please.yml", import.meta.url), "utf8");

  // Every automated release used to die at this step: the workflow ran npm publish
  // with no credentials at all, so release-please would tag a version that never
  // reached the registry. Assert the auth explicitly - its absence was silent.
  assert.match(
    workflow,
    /run: npm publish --access public --provenance\n\s+if: \$\{\{ steps\.release\.outputs\.release_created \}\}\n\s+env:\n(?:\s*#[^\n]*\n)*\s+NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/,
  );
  assert.match(workflow, /CRUX_AXI_UMAMI_HOST: \$\{\{ vars\.CRUX_AXI_UMAMI_HOST \}\}/);
  assert.match(workflow, /CRUX_AXI_UMAMI_WEBSITE_ID: \$\{\{ vars\.CRUX_AXI_UMAMI_WEBSITE_ID \}\}/);
  // --provenance and id-token: write are what make trusted publishing possible, so a
  // token is an option rather than a requirement.
  assert.match(workflow, /id-token: write/);
});
