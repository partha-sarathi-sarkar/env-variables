export function printJsonDiff(params: {
  envKey: string;
  envName: string;
  dryRun: boolean;
  diff: {
    create: string[];
    update: string[];
    delete: string[];
    checksum: string;
  };
  previousChecksum?: string;
}) {
  const output = {
    environmentKey: params.envKey,
    environmentName: params.envName,
    dryRun: params.dryRun,
    summary: {
      create: params.diff.create.length,
      update: params.diff.update.length,
      delete: params.diff.delete.length
    },
    changes: {
      create: params.diff.create,
      update: params.diff.update,
      delete: params.diff.delete
    },
    checksum: {
      previous: params.previousChecksum ?? null,
      current: params.diff.checksum
    }
  };

  console.log(JSON.stringify(output, null, 2));
}
