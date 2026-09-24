import { parseGitHubUrl, safeDirName } from "../lib/github.js";
import { parsePortFromLogs } from "../lib/ports.js";
import { detectProject } from "../lib/detect.js";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("parses github https and ssh urls", () => {
  assert.equal(parseGitHubUrl("https://github.com/D4Vinci/Scrapling").slug, "D4Vinci/Scrapling");
  assert.equal(parseGitHubUrl("https://github.com/d4vinci/Scrapling.git").repo, "Scrapling");
  assert.equal(parseGitHubUrl("git@github.com:expressjs/express.git").owner, "expressjs");
  assert.equal(safeDirName("D4Vinci", "Scrapling"), "D4Vinci__Scrapling");
});

test("rejects non-github urls", () => {
  assert.throws(() => parseGitHubUrl("https://gitlab.com/foo/bar"), /github.com/);
  assert.throws(() => parseGitHubUrl("https://github.com/foo/bar; rm -rf /"), /invalid/);
});

test("parses listening ports from logs", () => {
  assert.equal(parsePortFromLogs("Example app listening on port 3000"), 3000);
  assert.equal(parsePortFromLogs("Local: http://localhost:5173/"), 5173);
});

test("detects python scrapling checkout", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "detect-"));
  fs.writeFileSync(path.join(dir, "pyproject.toml"), '[project]\nname = "scrapling"\n');
  const detected = detectProject(dir);
  assert.equal(detected.kind, "python");
});
