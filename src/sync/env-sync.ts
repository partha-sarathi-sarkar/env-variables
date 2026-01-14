import { Octokit } from '@octokit/rest';
import { Logger } from '../logger/logger.js';
import { DeployCache } from '../cache/cache-manager.js';
import { Config } from '../config/config-loader.js';

export interface SyncResult {
  updated: number;
  created: number;
  deleted: number;
  skipped: number;
}

export async function syncEnvironmentVariables(
  octokit: Octokit,
  config: Config,
  envName: string,
  desiredVars: Record<string, string>,
  dryRun: boolean,
  logger: Logger,
  cache: DeployCache
): Promise<SyncResult> {
  logger.log(`Processing environment: ${envName}`);

  const existingVars = await getExistingVariables(octokit, config.owner, config.repo, envName);
  const desiredVarNames = new Set(Object.keys(desiredVars));
  const varsToDelete = new Set([...existingVars].filter(name => !desiredVarNames.has(name)));

  logger.log(`  Existing variables: ${existingVars.size}, Desired variables: ${desiredVarNames.size}`);

  cache.environments[envName] = cache.environments[envName] || {};

  let updated = 0;
  let created = 0;
  let deleted = 0;
  let skipped = 0;

  for (const [name, desiredValue] of Object.entries(desiredVars)) {
    const cachedValue = cache.environments[envName][name];

    if (cachedValue === desiredValue) {
      logger.log(`  Skipped ${name} (no value change)`);
      skipped++;
      continue;
    }

    if (dryRun) {
      logger.log(`  Would update ${name} (value changed)`);
      cache.environments[envName][name] = desiredValue;
      updated++;
      continue;
    }

    try {
      await octokit.rest.actions.updateEnvironmentVariable({
        owner: config.owner,
        repo: config.repo,
        environment_name: envName,
        name,
        value: desiredValue
      });
      logger.log(`  Updated ${name}`);
      cache.environments[envName][name] = desiredValue;
      updated++;
    } catch (error: any) {
      if (error.status === 404) {
        await octokit.rest.actions.createEnvironmentVariable({
          owner: config.owner,
          repo: config.repo,
          environment_name: envName,
          name,
          value: desiredValue
        });
        logger.log(`  Created ${name}`);
        cache.environments[envName][name] = desiredValue;
        created++;
      } else {
        logger.log(`  Failed ${name}: ${error.message}`);
      }
    }
  }

  if (varsToDelete.size > 0) {
    logger.log(`  Variables to delete: ${Array.from(varsToDelete).join(', ')}`);
    for (const name of varsToDelete) {
      delete cache.environments[envName][name];

      if (dryRun) {
        logger.log(`  Would delete ${name}`);
        deleted++;
        continue;
      }

      try {
        await octokit.rest.actions.deleteEnvironmentVariable({
          owner: config.owner,
          repo: config.repo,
          environment_name: envName,
          name
        });
        logger.log(`  Deleted ${name}`);
        deleted++;
      } catch (error: any) {
        logger.log(`  Failed to delete ${name}: ${error.message}`);
      }
    }
  }

  logger.log(
    `  Summary for ${envName}: Updated ${updated}, Created ${created}, Deleted ${deleted}, Skipped ${skipped}`
  );
  return { updated, created, deleted, skipped };
}

async function getExistingVariables(
  octokit: Octokit,
  owner: string,
  repo: string,
  envName: string
): Promise<Set<string>> {
  try {
    const response = await octokit.rest.actions.listEnvironmentVariables({
      owner,
      repo,
      environment_name: envName
    });
    return new Set(response.data.variables.map((v: any) => v.name));
  } catch {
    return new Set();
  }
}
