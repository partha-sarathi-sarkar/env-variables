import crypto from "crypto";

function calculateChecksum(vars: Record<string, string>) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify(
        Object.keys(vars)
          .sort()
          .reduce((acc, key) => {
            acc[key] = vars[key];
            return acc;
          }, {} as Record<string, string>)
      )
    )
    .digest("hex");
}

export function calculateDiff(
  envKey: string,
  vars: Record<string, string>,
  cache: any
) {
  const previous = cache[envKey] as
    | { variables: string[]; checksum: string }
    | undefined;

  const currentKeys: string[] = Object.keys(vars);
  const previousKeys: string[] = previous?.variables ?? [];

  const checksum = calculateChecksum(vars);
  const checksumChanged = previous?.checksum !== checksum;

  return {
    checksum,
    checksumChanged,
    create: currentKeys.filter((k: string) => !previousKeys.includes(k)),
    update: checksumChanged
      ? currentKeys.filter((k: string) => previousKeys.includes(k))
      : [],
    delete: previousKeys.filter((k: string) => !currentKeys.includes(k))
  };
}

