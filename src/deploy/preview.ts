export function previewSummary(
  envName: string,
  diff: {
    create?: string[];
    update?: string[];
    delete?: string[];
  }
) {
  const toCreate = diff.create ?? [];
  const toUpdate = diff.update ?? [];
  const toDelete = diff.delete ?? [];

  console.log(`\nDRY-RUN SUMMARY (${envName})\n`);

  if (toCreate.length) {
    console.log("Create:");
    toCreate.forEach(v => console.log(`  - ${v}`));
  }

  if (toUpdate.length) {
    console.log("\nUpdate:");
    toUpdate.forEach(v => console.log(`  - ${v}`));
  }

  if (toDelete.length) {
    console.log("\nDelete:");
    toDelete.forEach(v => console.log(`  - ${v}`));
  }

  if (!toCreate.length && !toUpdate.length && !toDelete.length) {
  console.log("No changes detected (values & keys)");
}


  console.log("");
}
