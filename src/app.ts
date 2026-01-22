import "dotenv/config";

import envVars from "../env-vars.json";
import config from "../config.json";

import { deployEnv } from "./deploy/deployEnv.js";
import { resolveEnvName } from "./utils/resolveEnv.js";
import { EnvironmentConfig } from "./types/env.js";

import { validateGitHubAppEnv } from "./github/validateAuth.js";

validateGitHubAppEnv();


const cliEnv: string = process.argv[2] ?? "all";
const dryRun =
  process.env.DRY_RUN === "false"
    ? false
    : true; // SAFE DEFAULT


async function main() {
  const environments = envVars.environments as Record<
    string,
    EnvironmentConfig
  >;

  for (const envKey of Object.keys(environments)) {
    if (cliEnv !== "all" && cliEnv !== envKey) continue;

    const envConfig = environments[envKey];
    const resolvedEnvName = resolveEnvName(envKey);

    await deployEnv(
      config.owner,
      config.repo,
      resolvedEnvName, // GitHub env
      envKey,          // logical env
      envConfig,       
      dryRun
    );
  }
}

main().catch((err) => {
  console.error("Deployment failed");
  console.error(err);
  process.exit(1);
});
