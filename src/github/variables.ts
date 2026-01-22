import { octokit } from "./client.js";

/**
 * Create or update an environment variable (UPSERT)
 */
export async function upsertEnvVar(
  owner: string,
  repo: string,
  environment: string,
  name: string,
  value: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(`[DRY-RUN] ${environment} :: ${name}=${value}`);
    return;
  }

  try {
    // Try CREATE
    await octokit.actions.createEnvironmentVariable({
      owner,
      repo,
      environment_name: environment,
      name,
      value,
    });

    console.log(`${environment} :: ${name} (created)`);
  } catch (error: any) {
    // already exists → UPDATE instead
    if (error?.status === 409) {
      await octokit.actions.updateEnvironmentVariable({
        owner,
        repo,
        environment_name: environment,
        name,
        value,
      });

      console.log(`🔄 ${environment} :: ${name} (updated)`);
    } else {
      // Any other error should fail fast
      console.error(
        `Failed to upsert ${environment} :: ${name}`
      );
      throw error;
    }
  }
}
