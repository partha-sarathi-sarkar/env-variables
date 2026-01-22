export interface CacheEntry {
  env: string;
  checksum: string;
  lastUpdated: string;
  variables: string[];   
}


export type DeployCache = Record<string, CacheEntry>;
