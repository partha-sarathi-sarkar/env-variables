import fs from "fs";
import path from "path";
import { DeployCache } from "./types.js";

const CACHE_FILE = path.resolve(".deploy-cache.json");

export function writeCache(cache: DeployCache): void {
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify(cache, null, 2),
    "utf-8"
  );
}
