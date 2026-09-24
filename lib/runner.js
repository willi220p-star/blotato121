import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { detectProject } from "./detect.js";
import { parseGitHubUrl, safeDirName } from "./github.js";
import { getFreePort, parsePortFromLogs, waitForPort } from "./ports.js";

const ROOT = process.cwd();
export const CLONE_ROOT = path.join(ROOT, "cloned");

const jobs = new Map();

function nowIso() {
  return new Date().toISOString();
}

function appendLog(job, chunk) {
  const text = chunk.toString();
  job.logs += text;
  if (job.logs.length > 200_000) {
    job.logs = job.logs.slice(-160_000);
  }
  job.updatedAt = nowIso();
}

function runCommand(job, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || job.dir,
      env: { ...process.env, ...(options.env || {}) },
      shell: false,
    });
    job.child = child;
    child.stdout?.on("data", (data) => appendLog(job, data));
    child.stderr?.on("data", (data) => appendLog(job, data));
    child.on("error", reject);
    child.on("close", (code) => {
      job.child = null;
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function cloneArgs(parsed, dir) {
  return ["clone", "--depth", "1", "--single-branch", parsed.cloneUrl, dir];
}

function installCommands(project) {
  if (project.kind === "node") {
    if (project.manager === "pnpm") return ["pnpm", ["install"]];
    if (project.manager === "yarn") return ["yarn", ["install", "--frozen-lockfile"]];
    if (project.manager === "bun") return ["bun", ["install"]];
    return ["npm", [project.hasLockfile ? "ci" : "install"]];
  }
  if (project.kind === "python") {
    const extras = fs.existsSync(path.join(project._dir || "", "pyproject.toml"))
      ? []
      : [];
    void extras;
    return ["python3", ["-m", "pip", "install", "--user", "-e", "."]];
  }
  if (project.kind === "go") return ["go", ["mod", "download"]];
  if (project.kind === "rust") return ["cargo", ["fetch"]];
  return null;
}

function startSpec(project, port) {
  const env = {
    HOST: "0.0.0.0",
    PORT: String(port),
    BROWSER: "none",
    CI: "true",
  };
  if (project.kind === "node") {
    if (project.start?.npmScript) {
      const extra = [];
      const script = project.start.command || "";
      if (/\bvite\b/.test(script)) extra.push("--", "--host", "0.0.0.0", "--port", String(port));
      else if (/\bnext\b/.test(script)) extra.push("--", "-H", "0.0.0.0", "-p", String(port));
      const manager = project.manager || "npm";
      if (manager === "npm") return { command: "npm", args: ["run", project.start.npmScript, ...extra], env };
      if (manager === "yarn") return { command: "yarn", args: [project.start.npmScript, ...extra], env };
      if (manager === "pnpm") return { command: "pnpm", args: [project.start.npmScript, ...extra], env };
      if (manager === "bun") return { command: "bun", args: ["run", project.start.npmScript, ...extra], env };
    }
    if (project.start?.file) {
      return { command: "node", args: [project.start.file], env };
    }
  }
  if (project.kind === "static") {
    return {
      command: "npx",
      args: ["--yes", "serve", "-l", String(port), "--no-clipboard"],
      env,
    };
  }
  if (project.kind === "python" && project.longRunning) {
    const parts = project.start.command.replace("$PORT", String(port)).split(" ");
    return { command: parts[0], args: parts.slice(1), env };
  }
  if (project.kind === "go") return { command: "go", args: ["run", "."], env };
  if (project.kind === "rust") return { command: "cargo", args: ["run"], env };
  return null;
}

function pythonSmoke(job) {
  const pyproject = path.join(job.dir, "pyproject.toml");
  const script = `
import pathlib, sys
root = pathlib.Path(${JSON.stringify(job.dir)})
sys.path.insert(0, str(root))
name = ${JSON.stringify(job.parsed.repo.replace(/-/g, "_").toLowerCase())}
try:
    import tomllib
    data = tomllib.loads((root / "pyproject.toml").read_text()) if (root / "pyproject.toml").exists() else {}
    name = data.get("project", {}).get("name") or name
except Exception:
    pass
mod = name.replace("-", "_")
imported = None
for candidate in (mod, "scrapling"):
    try:
        imported = __import__(candidate)
        print(f"imported {candidate} from {getattr(imported, '__file__', '?')}")
        break
    except Exception as exc:
        print(f"skip {candidate}: {exc}")
if imported is None:
    raise SystemExit("could not import package")
try:
    from scrapling.parser import Selector
    page = Selector("<html><h1>Hello from cloned Scrapling</h1></html>")
    print("parser:", page.css("h1::text").get())
except Exception as exc:
    print("parser demo skipped:", exc)
try:
    from scrapling.fetchers import Fetcher
    page = Fetcher.get("https://example.com", timeout=20)
    title = page.css("title::text").get() or page.css("h1::text").get()
    print("fetch example.com:", title)
except Exception as exc:
    print("fetcher demo skipped:", exc)
`;
  return ["python3", ["-c", script]];
}

export function listJobs() {
  return [...jobs.values()].map(publicJob);
}

export function getJob(id) {
  const job = jobs.get(id);
  if (!job) return null;
  return publicJob(job);
}

function publicJob(job) {
  return {
    id: job.id,
    url: job.parsed.htmlUrl,
    slug: job.parsed.slug,
    dir: job.dir,
    status: job.status,
    phase: job.phase,
    kind: job.project?.kind || null,
    summary: job.project?.summary || null,
    longRunning: job.project?.longRunning || false,
    port: job.port || null,
    previewUrl: job.port ? `http://127.0.0.1:${job.port}` : null,
    error: job.error || null,
    elapsedMs: Date.now() - job.startedAtMs,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    logs: job.logs,
  };
}

export async function cloneAndRun(url, options = {}) {
  const parsed = parseGitHubUrl(url);
  const id = safeDirName(parsed.owner, parsed.repo);
  const dir = path.join(CLONE_ROOT, id);
  fs.mkdirSync(CLONE_ROOT, { recursive: true });

  const existing = jobs.get(id);
  if (existing?.child && options.restart !== true) {
    return publicJob(existing);
  }

  const job = {
    id,
    parsed,
    dir,
    status: "running",
    phase: "clone",
    logs: "",
    error: null,
    port: null,
    project: null,
    child: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    startedAtMs: Date.now(),
  };
  jobs.set(id, job);
  appendLog(job, `Cloning ${parsed.htmlUrl}\n`);

  try {
    if (fs.existsSync(dir) && options.fresh) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    if (!fs.existsSync(dir)) {
      await runCommand(job, "git", cloneArgs(parsed, dir), { cwd: ROOT });
    } else {
      appendLog(job, `Reusing existing checkout at ${dir}\n`);
    }

    job.phase = "detect";
    const project = detectProject(dir);
    project._dir = dir;
    job.project = project;
    appendLog(job, `Detected ${project.summary}\n`);

    job.phase = "install";
    if (project.kind === "python") {
      await runCommand(job, "python3", ["-m", "pip", "install", "--user", "-e", "."], { cwd: dir });
    } else {
      const install = installCommands(project);
      if (install) {
        await runCommand(job, install[0], install[1], { cwd: dir });
      } else {
        appendLog(job, "No install step for this project type.\n");
      }
    }

    if (!project.longRunning) {
      job.phase = "run";
      if (project.kind === "python") {
        const [command, args] = pythonSmoke(job);
        await runCommand(job, command, args, { cwd: dir });
      }
      job.status = "succeeded";
      job.phase = "done";
      appendLog(job, `\nFinished one-shot run for ${parsed.slug} in ${Date.now() - job.startedAtMs}ms\n`);
      return publicJob(job);
    }

    job.phase = "start";
    const port = await getFreePort(0);
    const spec = startSpec(project, port);
    if (!spec) {
      throw new Error(`No start command for ${project.kind} project`);
    }
    appendLog(job, `Starting on port ${port}: ${spec.command} ${spec.args.join(" ")}\n`);
    const child = spawn(spec.command, spec.args, {
      cwd: dir,
      env: { ...process.env, ...spec.env },
      shell: false,
    });
    job.child = child;
    child.stdout?.on("data", (data) => {
      appendLog(job, data);
      const detected = parsePortFromLogs(job.logs);
      if (detected) job.port = detected;
    });
    child.stderr?.on("data", (data) => {
      appendLog(job, data);
      const detected = parsePortFromLogs(job.logs);
      if (detected) job.port = detected;
    });
    child.on("exit", (code) => {
      if (job.status === "running") {
        job.status = code === 0 ? "exited" : "failed";
        job.error = code === 0 ? null : `Process exited with code ${code}`;
        job.updatedAt = nowIso();
      }
      job.child = null;
    });

    try {
      await waitForPort(port, options.readyTimeoutMs || 12_000);
      job.port = port;
    } catch (error) {
      const detected = parsePortFromLogs(job.logs);
      const fallbackPorts = [detected, 3000, 5173, 4173, 8080, 8000].filter(
        (value, index, list) => Number.isInteger(value) && list.indexOf(value) === index,
      );
      let ready = null;
      for (const candidate of fallbackPorts) {
        try {
          await waitForPort(candidate, 4_000);
          ready = candidate;
          break;
        } catch {
          // keep looking
        }
      }
      if (ready) job.port = ready;
      else throw error;
    }
    job.status = "running";
    job.phase = "ready";
    appendLog(job, `\nReady: http://127.0.0.1:${job.port}\n`);
    return publicJob(job);
  } catch (error) {
    job.status = "failed";
    job.error = error.message;
    appendLog(job, `\nERROR: ${error.message}\n`);
    throw Object.assign(error, { job: publicJob(job) });
  }
}

export function stopJob(id) {
  const job = jobs.get(id);
  if (!job) throw new Error("Job not found");
  if (job.child) {
    job.child.kill("SIGTERM");
    job.child = null;
  }
  job.status = "stopped";
  job.phase = "stopped";
  job.updatedAt = nowIso();
  return publicJob(job);
}

export function hostname() {
  return os.hostname();
}
