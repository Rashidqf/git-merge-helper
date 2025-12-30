import chalk from 'chalk';

/**
 * Prints a summary of the merge resolution process
 */
export function printSummary(results) {
  const {
    filesProcessed,
    filesResolved,
    filesFailed,
    totalConflicts,
    autoResolved,
    manualResolved,
    skipped
  } = results;

  const resolved = autoResolved + manualResolved;
  const remaining = skipped;

  console.log(chalk.bold.blue(`\n\n╔════════════════════════════════════════════════════════════╗`));
  console.log(chalk.bold.blue(`║`) + chalk.bold.white(`              MERGE RESOLUTION SUMMARY                  `) + chalk.bold.blue(`║`));
  console.log(chalk.bold.blue(`╚════════════════════════════════════════════════════════════╝\n`));

  // Files section
  console.log(chalk.bold.white(`📂 Files:`));
  console.log(chalk.gray(`   ├─`) + ` Total Processed: ${chalk.cyan(filesProcessed)}`);
  console.log(chalk.gray(`   ├─`) + ` Successfully Resolved: ${chalk.green(filesResolved)}`);
  
  if (filesFailed > 0) {
    console.log(chalk.gray(`   └─`) + ` Failed: ${chalk.red(filesFailed)}`);
  } else {
    console.log(chalk.gray(`   └─`) + ` Failed: ${chalk.gray(filesFailed)}`);
  }

  // Conflicts section
  console.log(chalk.bold.white(`\n⚔️  Conflicts:`));
  console.log(chalk.gray(`   ├─`) + ` Total: ${chalk.cyan(totalConflicts)}`);
  console.log(chalk.gray(`   ├─`) + ` Auto-resolved: ${chalk.green(autoResolved)}`);
  console.log(chalk.gray(`   ├─`) + ` Manually resolved: ${chalk.blue(manualResolved)}`);
  console.log(chalk.gray(`   ├─`) + ` Total Resolved: ${chalk.green.bold(resolved)}`);
  
  if (remaining > 0) {
    console.log(chalk.gray(`   └─`) + ` Remaining (skipped): ${chalk.yellow(remaining)}`);
  } else {
    console.log(chalk.gray(`   └─`) + ` Remaining: ${chalk.green('0 🎉')}`);
  }

  // Status section
  console.log(chalk.bold.white(`\n📊 Status:`));
  
  if (remaining === 0 && filesResolved > 0) {
    console.log(chalk.green.bold(`   ✓ All conflicts resolved successfully!`));
    console.log(chalk.white(`\n   Next steps:`));
    console.log(chalk.gray(`   1. Review the changes: `) + chalk.cyan(`git diff`));
    console.log(chalk.gray(`   2. Stage the resolved files: `) + chalk.cyan(`git add .`));
    console.log(chalk.gray(`   3. Complete the merge: `) + chalk.cyan(`git commit`));
  } else if (remaining > 0) {
    console.log(chalk.yellow.bold(`   ⚠ Some conflicts remain unresolved`));
    console.log(chalk.white(`\n   Next steps:`));
    console.log(chalk.gray(`   1. Run `) + chalk.cyan(`git-merge-helper`) + chalk.gray(` again to resolve remaining conflicts`));
    console.log(chalk.gray(`   2. Or manually resolve conflicts in your editor`));
  } else {
    console.log(chalk.gray(`   ℹ No conflicts were resolved in this session`));
  }

  // Backup reminder
  console.log(chalk.white(`\n💾 Backup:`));
  console.log(chalk.gray(`   Original files backed up in: `) + chalk.cyan(`.git-merge-helper-backup/`));
  console.log(chalk.gray(`   Restore with: `) + chalk.cyan(`git-merge-helper rollback`));

  console.log(chalk.bold.blue(`\n════════════════════════════════════════════════════════════\n`));
}

/**
 * Prints conflict statistics before resolution
 */
export function printConflictStats(stats) {
  console.log(chalk.bold.cyan(`\n╔════════════════════════════════════════════════════════════╗`));
  console.log(chalk.bold.cyan(`║`) + chalk.bold.white(`           DETECTED MERGE CONFLICTS                     `) + chalk.bold.cyan(`║`));
  console.log(chalk.bold.cyan(`╚════════════════════════════════════════════════════════════╝\n`));

  console.log(chalk.white(`📊 Statistics:`));
  console.log(chalk.gray(`   ├─`) + ` Files with conflicts: ${chalk.cyan(stats.totalFiles)}`);
  console.log(chalk.gray(`   ├─`) + ` Total conflicts: ${chalk.yellow(stats.totalConflicts)}`);
  console.log(chalk.gray(`   ├─`) + ` Simple conflicts: ${chalk.green(stats.simpleConflicts)} ${chalk.gray('(can be auto-resolved)')}`);
  console.log(chalk.gray(`   └─`) + ` Complex conflicts: ${chalk.red(stats.complexConflicts)}`);

  console.log();
}

/**
 * Prints a simple list of conflicted files
 */
export function printConflictedFiles(files) {
  console.log(chalk.bold.white(`\n📄 Conflicted Files:`));
  
  files.forEach((file, index) => {
    const prefix = index === files.length - 1 ? '└─' : '├─';
    const conflictCount = file.conflicts.length;
    const plural = conflictCount === 1 ? 'conflict' : 'conflicts';
    
    console.log(
      chalk.gray(`   ${prefix} `) +
      chalk.white(file.filePath) +
      chalk.gray(` (${conflictCount} ${plural})`)
    );
  });

  console.log();
}

/**
 * Prints error message
 */
export function printError(message, details = null) {
  console.log(chalk.red.bold(`\n✗ Error: ${message}`));
  
  if (details) {
    console.log(chalk.red(`  ${details}`));
  }
  
  console.log();
}

/**
 * Prints success message
 */
export function printSuccess(message) {
  console.log(chalk.green.bold(`\n✓ ${message}\n`));
}

/**
 * Prints info message
 */
export function printInfo(message) {
  console.log(chalk.blue(`\nℹ ${message}\n`));
}

/**
 * Prints warning message
 */
export function printWarning(message) {
  console.log(chalk.yellow(`\n⚠ ${message}\n`));
}

