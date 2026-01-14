import { Octokit } from '@octokit/rest';

export interface GithubClient {
  listEnvironmentVariables: (
    owner: string,
    repo: string,
    envName: string
  ) => Promise<Set<string>>;
}

/**
 * Creates GitHub client with authentication
 */
export function createGithubClient(token: string): GithubClient {
  const octokit = new Octokit({ auth: token });

  return {
    async listEnvironmentVariables(owner: string, repo: string, envName: string): Promise<Set<string>> {
      try {
        const response = await octokit.rest.actions.listEnvironmentVariables({
          owner,
          repo,
          environment_name: envName,
        });
        return new Set(response.data.variables.map((v: any) => v.name));
      } catch {
        return new Set();
      }
    }
  };
}
