import rawMapping from "../../env-mapping.json" assert { type: "json" };


const mapping: Record<string, string> =
  rawMapping as Record<string, string>;


export function resolveEnvName(envKey: string): string {
  return mapping[envKey] ?? envKey;
}
