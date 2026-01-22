import { octokit } from "../github/client.js";
import { loadCache } from "../cache/loadCache.js";
import { calculateDiff } from "./diff.js";
import { previewSummary } from "./preview.js";
import { deleteEnvVar } from "../github/deleteVariable.js";
import { EnvironmentConfig } from "../types/env.js";
import { printJsonDiff } from "./jsonDiff.js";
import fs from "fs";
import path from "path";


const CACHE_FILE = path.resolve(".deploy-cache.json");
const outputFormat = process.env.OUTPUT_FORMAT ?? "text";

export async function deployEnv(
  owner: string,
  repo: string,
  envName: string,
  envKey: string,
  config: EnvironmentConfig,
  dryRun: boolean
) {
  console.log(`Deploying ${envKey}`);

  const cache = loadCache();
  const variables = config.variables ?? {};

  //  DEFINE diff ONCE (THIS WAS MISSING)
  const diff = calculateDiff(envKey, variables, cache);

  // DRY-RUN: preview & exit early
  if (dryRun) {
  if (outputFormat === "json") {
    printJsonDiff({
      envKey,
      envName,
      dryRun,
      diff,
      previousChecksum: cache[envKey]?.checksum
    });
  } else {
    previewSummary(envName, diff);
  }
  return;
}

  // CREATE / UPDATE VARIABLES
  for (const [key, value] of Object.entries(variables)) {
  try {
    // 1️ Try create
    await octokit.actions.createEnvironmentVariable({
      owner,
      repo,
      environment_name: envName,
      name: key,
      value
    });

    console.log(`${envName} :: ${key} (created)`);
  } catch (err: any) {
    if (err.status === 409) {
      // 2️Already exists → update
      await octokit.actions.updateEnvironmentVariable({
        owner,
        repo,
        environment_name: envName,
        name: key,
        value
      });

      console.log(`${envName} :: ${key} (updated)`);
    } else {
      throw err;
    }
  }
}


  //  DELETE GUARD
  const allowDelete = process.env.ALLOW_ENV_DELETE === "true";

  if (diff.delete.length && !allowDelete) {
    console.log(
      `${envName}: ${diff.delete.length} variables would be deleted ` +
      `(skipped — set ALLOW_ENV_DELETE=true)`
    );
  } else {
    for (const key of diff.delete) {
      await deleteEnvVar(owner, repo, envName, key, false);
    }
  }

  // UPDATE CACHE IN MEMORY
  cache[envKey] = {
   env: envName,
   checksum: diff.checksum,
   lastUpdated: new Date().toISOString(),
   variables: Object.keys(variables)
  };

 // PERSIST CACHE TO DISK
 fs.writeFileSync(
  CACHE_FILE,
  JSON.stringify(cache, null, 2),
  "utf-8"
);

console.log(`Cache updated → ${CACHE_FILE}`);

}
