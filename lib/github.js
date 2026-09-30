const GITHUB_RE = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:\/(?:tree|blob)\/[^/]+)?\/?$/i;
const SSH_RE = /^git@github\.com:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?$/i;

export function parseGitHubUrl(input) {
  if (typeof input !== "string") {
    throw new Error("Repository URL is required");
  }
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Repository URL is required");
  }
  if (/[;&|`$<>\\]/.test(trimmed)) {
    throw new Error("Repository URL contains invalid characters");
  }

  let owner;
  let repo;
  const httpsMatch = trimmed.match(GITHUB_RE);
  const sshMatch = trimmed.match(SSH_RE);
  if (httpsMatch) {
    owner = httpsMatch[1];
    repo = httpsMatch[2];
  } else if (sshMatch) {
    owner = sshMatch[1];
    repo = sshMatch[2];
  } else {
    throw new Error("Only github.com repository URLs are supported");
  }

  if (owner === "." || owner === ".." || repo === "." || repo === "..") {
    throw new Error("Invalid GitHub repository path");
  }

  const name = repo.replace(/\.git$/i, "");
  return {
    owner,
    repo: name,
    cloneUrl: `https://github.com/${owner}/${name}.git`,
    htmlUrl: `https://github.com/${owner}/${name}`,
    slug: `${owner}/${name}`,
  };
}

export function safeDirName(owner, repo) {
  return `${owner}__${repo}`.replace(/[^A-Za-z0-9._-]/g, "_");
}
