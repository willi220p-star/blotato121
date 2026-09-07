#!/usr/bin/env node
import { cloneAndRun, listJobs, stopJob } from "./lib/runner.js";

const [command, ...rest] = process.argv.slice(2);

function printJob(job) {
  console.log(`${job.slug}  ${job.status}/${job.phase}  ${job.elapsedMs}ms`);
  if (job.previewUrl) console.log(`preview  ${job.previewUrl}`);
  if (job.error) console.log(`error    ${job.error}`);
  if (job.logs) console.log(job.logs.trim());
}

async function main() {
  if (!command || command === "help" || command === "--help") {
    console.log(`Usage:
  node cli.js run <github-url> [--fresh]
  node cli.js list
  node cli.js stop <owner__repo>`);
    process.exit(0);
  }
  if (command === "run") {
    const fresh = rest.includes("--fresh");
    const url = rest.find((arg) => !arg.startsWith("--"));
    const job = await cloneAndRun(url, { fresh });
    printJob(job);
    if (job.status === "failed") process.exit(1);
    return;
  }
  if (command === "list") {
    for (const job of listJobs()) printJob(job);
    return;
  }
  if (command === "stop") {
    printJob(stopJob(rest[0]));
    return;
  }
  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.job ? `${error.message}\n${error.job.logs}` : error.message);
  process.exit(1);
});
