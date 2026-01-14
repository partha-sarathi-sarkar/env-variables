import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DeployCache {
  owner: string;
  repo: string;
  environments: Record<string, Record<string, string>>;
  lastUpdated: string;
}

const CACHE_FILE = path.resolve(__dirname, '../../.deploy-cache.json');

export async function loadCache(config: { owner: string; repo: string }): Promise<DeployCache> {
  if (!existsSync(CACHE_FILE)) {
    return {
      owner: config.owner,
      repo: config.repo,
      environments: {},
      lastUpdated: new Date().toISOString()
    };
  }
  const data = await fs.readFile(CACHE_FILE, 'utf-8');
  return JSON.parse(data) as DeployCache;
}

export async function saveCache(cache: DeployCache): Promise<void> {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}
