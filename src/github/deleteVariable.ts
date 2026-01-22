import { octokit } from "./client.js";

export async function deleteEnvVar(
  owner: string,
  repo: string,
  environment: string,
  name: string,
  dryRun: boolean
) {
  if (dryRun) {
    console.log(`[DRY-RUN] ${environment} :: ${name} (deleted)`);
    return;
  }

  await octokit.actions.deleteEnvironmentVariable({
    owner,
    repo,
    environment_name: environment,
    name
  });

  console.log(`${environment} :: ${name} (deleted)`);
}
