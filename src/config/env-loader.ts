import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface EnvVarsConfig {
  environments: Record<string, Record<string, string>>;
}

export async function loadEnvVars(): Promise<EnvVarsConfig> {
  const envPath = path.resolve(__dirname, '../../env-vars.json');

  try {
    const envStr = await fs.readFile(envPath, 'utf-8');
    return JSON.parse(envStr) as EnvVarsConfig;
  } catch {
    console.error('Failed to load env-vars.json. Please create it with environments object.');
    process.exit(1);
  }
}
