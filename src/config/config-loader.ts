import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Config {
  owner: string;
  repo: string;
  githubToken: string;
}

export async function loadConfig(): Promise<Config> {
  const configPath = path.resolve(__dirname, '../../config.json');

  try {
    const configStr = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configStr) as Config;
  } catch {
    console.error('Failed to load config.json. Please create it with owner, repo, githubToken.');
    process.exit(1);
  }
}
