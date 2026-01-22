import crypto from "crypto";

export function checksum(vars: Record<string, string>): string {
  const sorted = Object.keys(vars)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = vars[key];
      return acc;
    }, {});

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(sorted))
    .digest("hex");
}
