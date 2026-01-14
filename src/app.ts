#!/usr/bin/env node
import { argv } from 'process';
import { Octokit } from '@octokit/rest';
import { loadConfig } from './config/config-loader.js';
import { loadEnvVars } from './config/env-loader.js';
import { loadCache, saveCache } from './cache/cache-manager.js';
import { Logger } from './logger/logger.js';
import { syncEnvironmentVariables, SyncResult } from './sync/env-sync.js';


console.log('app.ts top-level log');
const envAliases: Record<string, string> = {
  dev: 'development',
  devel: 'development',
  staging: 'staging',
  stag: 'staging',
  stage: 'staging',
  qa: 'qa',
  test: 'qa',
  prod: 'production',
  production: 'production'
};

async function deployEnvVars() {
  console.log('deployEnvVars() called with args:', argv.slice(2));
  try {
    const config = await loadConfig();
    const envVars = await loadEnvVars();
    const logger = new Logger(config.githubToken);
    const dryRun = process.env.DRY_RUN === 'true';
    const octokit = new Octokit({ auth: config.githubToken });
    const cache = await loadCache(config);

    logger.logConfig(config);
    logger.log('Deployment started');
    if (dryRun) {
      logger.log('Dry run mode enabled (no changes will be made)');
    }

    const args = argv.slice(2);
    const targetEnvArg = args[0] || 'all';

    let envsToProcess: Record<string, Record<string, string>>;

    if (targetEnvArg.toLowerCase() !== 'all') {
      const resolvedEnv = envAliases[targetEnvArg.toLowerCase()] || targetEnvArg;
      if (!envVars.environments[resolvedEnv]) {
        logger.log(`Environment '${targetEnvArg}' (resolved: '${resolvedEnv}') not found`);
        logger.log(`Available environments: ${Object.keys(envVars.environments).join(', ')}`);
        await logger.saveToFile();
        process.exit(1);
      }
      logger.log(`Target environment: ${targetEnvArg} -> ${resolvedEnv}`);
      envsToProcess = { [resolvedEnv]: envVars.environments[resolvedEnv] };
    } else {
      envsToProcess = envVars.environments;
    }

    let totalUpdated = 0;
    let totalCreated = 0;
    let totalDeleted = 0;
    let totalSkipped = 0;

    for (const [envName, vars] of Object.entries(envsToProcess)) {
      const result: SyncResult = await syncEnvironmentVariables(
        octokit,
        config,
        envName,
        vars,
        dryRun,
        logger,
        cache
      );
      totalUpdated += result.updated;
      totalCreated += result.created;
      totalDeleted += result.deleted;
      totalSkipped += result.skipped;
    }

    cache.lastUpdated = new Date().toISOString();
    await saveCache(cache);

    logger.log(
      `Final summary: Updated ${totalUpdated}, Created ${totalCreated}, Deleted ${totalDeleted}, Skipped ${totalSkipped}`
    );
    logger.log('Deployment complete');
    await logger.saveToFile();
  } catch (error: any) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deployEnvVars().catch(err => {
  console.error('Deployment failed:', err);
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('import.meta.url check passed, calling deployEnvVars()');
  deployEnvVars().catch(err => {
    console.error('Deployment failed:', err);
    process.exit(1);
  });
}

export { deployEnvVars };
