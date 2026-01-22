/**
 * Environment bootstrap is intentionally skipped.
 *
 * Reason:
 * - GitHub environment creation requires admin permission
 * - GET /environment is unstable (500s)
 * - Variable APIs already enforce existence
 *
 * Environments must be created manually in GitHub UI.
 */
export async function ensureEnvironment(
  _owner: string,
  _repo: string,
  environmentName: string
): Promise<void> {
  console.log(`Using existing environment: ${environmentName}`);
}
