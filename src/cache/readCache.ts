import fs from "fs";
import { DeployCache } from "./types";

const CACHE_FILE = ".deploy-cache.json";

export function readCache(): DeployCache {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}
