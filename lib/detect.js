import fs from "node:fs";
import path from "node:path";

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function packageManager(dir) {
  if (exists(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (exists(path.join(dir, "yarn.lock"))) return "yarn";
  if (exists(path.join(dir, "bun.lockb")) || exists(path.join(dir, "bun.lock"))) {
    return "bun";
  }
  return "npm";
}

function nodeStartCommand(pkg, dir) {
  const scripts = pkg.scripts || {};
  if (scripts.dev) return { command: scripts.dev, npmScript: "dev" };
  if (scripts.start) return { command: scripts.start, npmScript: "start" };
  if (scripts.preview) return { command: scripts.preview, npmScript: "preview" };
  if (scripts.serve) return { command: scripts.serve, npmScript: "serve" };

  const hello = path.join(dir, "examples", "hello-world", "index.js");
  if (exists(hello)) {
    return { command: "node examples/hello-world/index.js", file: hello };
  }
  if (exists(path.join(dir, "index.js"))) {
    return { command: "node index.js", file: path.join(dir, "index.js") };
  }
  if (exists(path.join(dir, "server.js"))) {
    return { command: "node server.js", file: path.join(dir, "server.js") };
  }
  return null;
}

function pythonStart(dir) {
  const candidates = [
    ["app.py", "python3 app.py"],
    ["main.py", "python3 main.py"],
    ["manage.py", "python3 manage.py runserver 0.0.0.0:$PORT"],
  ];
  for (const [file, command] of candidates) {
    if (exists(path.join(dir, file))) {
      return { command, file: path.join(dir, file), longRunning: true };
    }
  }
  return {
    command: "python3 -c \"import importlib.metadata as m, pathlib, tomllib, sys; p=pathlib.Path('pyproject.toml'); name=tomllib.loads(p.read_text()).get('project',{}).get('name') if p.exists() else None; print((name or 'package') + ' ' + (m.version(name) if name else 'installed'))\"",
    longRunning: false,
  };
}

export function detectProject(dir) {
  const pkgPath = path.join(dir, "package.json");
  if (exists(pkgPath)) {
    const pkg = readJson(pkgPath);
    const start = nodeStartCommand(pkg, dir);
    return {
      kind: "node",
      name: pkg.name || path.basename(dir),
      manager: packageManager(dir),
      hasLockfile: ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock"].some(
        (file) => exists(path.join(dir, file)),
      ),
      start,
      longRunning: Boolean(start),
      summary: `Node.js (${packageManager(dir)})`,
    };
  }

  if (
    exists(path.join(dir, "pyproject.toml")) ||
    exists(path.join(dir, "requirements.txt")) ||
    exists(path.join(dir, "setup.py")) ||
    exists(path.join(dir, "setup.cfg"))
  ) {
    const start = pythonStart(dir);
    return {
      kind: "python",
      name: path.basename(dir),
      start,
      longRunning: start.longRunning,
      summary: "Python",
    };
  }

  if (exists(path.join(dir, "go.mod"))) {
    return {
      kind: "go",
      name: path.basename(dir),
      start: { command: "go run ." },
      longRunning: true,
      summary: "Go",
    };
  }

  if (exists(path.join(dir, "Cargo.toml"))) {
    return {
      kind: "rust",
      name: path.basename(dir),
      start: { command: "cargo run" },
      longRunning: true,
      summary: "Rust",
    };
  }

  if (exists(path.join(dir, "index.html"))) {
    return {
      kind: "static",
      name: path.basename(dir),
      start: { command: "npx --yes serve -l $PORT --no-clipboard" },
      longRunning: true,
      summary: "Static site",
    };
  }

  return {
    kind: "unknown",
    name: path.basename(dir),
    start: null,
    longRunning: false,
    summary: "Unknown project type",
  };
}
