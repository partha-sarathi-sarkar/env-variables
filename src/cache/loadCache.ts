import fs from "fs";
import path from "path";
import { DeployCache } from "./types.js";

const CACHE_FILE = path.resolve(".deploy-cache.json");

export function loadCache(): DeployCache {
  if (!fs.existsSync(CACHE_FILE)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as DeployCache;
  } catch (error) {
    console.warn("⚠️  Failed to read .deploy-cache.json, starting fresh");
    return {};
  }
}
