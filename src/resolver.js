import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { formatConflict, isSimpleConflict } from './conflict.js';
import { backupFile } from './backup.js';

const RESOLUTION_TYPES = {
  KEEP_HEAD: 'head',
  KEEP_INCOMING: 'incoming',
  KEEP_BOTH: 'both',
  EDIT_MANUAL: 'manual',
  SKIP: 'skip',
  AUTO: 'auto'
};

/**
 * Resolves a single conflict based on the chosen strategy
 */
export function resolveConflict(conflict, resolution) {
  switch (resolution) {
    case RESOLUTION_TYPES.KEEP_HEAD:
      return conflict.head.join('\n');
    
    case RESOLUTION_TYPES.KEEP_INCOMING:
      return conflict.incoming.join('\n');
    
    case RESOLUTION_TYPES.KEEP_BOTH:
      return [...conflict.head, ...conflict.incoming].join('\n');
    
    case RESOLUTION_TYPES.AUTO:
      // Auto-resolve simple conflicts
      if (conflict.head.length === 0 || conflict.head.every(line => line.trim() === '')) {
        return conflict.incoming.join('\n');
      }
      if (conflict.incoming.length === 0 || conflict.incoming.every(line => line.trim() === '')) {
        return conflict.head.join('\n');
      }
      // Default to keeping both if not clear
      return [...conflict.head, ...conflict.incoming].join('\n');
    
    default:
      return null;
  }
}

/**
 * Applies conflict resolutions to a file
 */
export async function applyResolutions(fileData, resolutions) {
  let lines = [...fileData.lines];
  let offset = 0;

  for (let i = 0; i < fileData.conflicts.length; i++) {
    const conflict = fileData.conflicts[i];
    const resolution = resolutions[i];

    if (!resolution || resolution.type === RESOLUTION_TYPES.SKIP) {
      continue;
    }

    const resolvedContent = resolution.content;
    const startIdx = conflict.startLine - 1 - offset;
    const endIdx = conflict.endLine - offset;
    const conflictLength = endIdx - startIdx;

    // Replace conflict block with resolved content
    const resolvedLines = resolvedContent ? resolvedContent.split('\n') : [];
    lines.splice(startIdx, conflictLength, ...resolvedLines);

    // Update offset for next conflicts
    offset += conflictLength - resolvedLines.length;
  }

  return lines.join('\n');
}

/**
 * Prompts user for conflict resolution
 */
export async function promptConflictResolution(conflict, conflictIndex, totalConflicts, fileName) {
  console.log(chalk.bold.white(`\n📄 File: ${fileName}`));
  console.log(formatConflict(conflict, conflictIndex));

  const isSimple = isSimpleConflict(conflict);
  
  const choices = [
    {
      name: `${chalk.green('Keep HEAD')} (current branch)`,
      value: RESOLUTION_TYPES.KEEP_HEAD
    },
    {
      name: `${chalk.cyan('Keep Incoming')} (merge branch)`,
      value: RESOLUTION_TYPES.KEEP_INCOMING
    },
    {
      name: `${chalk.yellow('Keep Both')} (HEAD + Incoming)`,
      value: RESOLUTION_TYPES.KEEP_BOTH
    },
    {
      name: `${chalk.gray('Skip')} (resolve later)`,
      value: RESOLUTION_TYPES.SKIP
    }
  ];

  if (isSimple) {
    choices.unshift({
      name: `${chalk.blue('✨ Auto-resolve')} (recommended for simple conflicts)`,
      value: RESOLUTION_TYPES.AUTO
    });
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'resolution',
      message: `How would you like to resolve this conflict? (${conflictIndex + 1}/${totalConflicts})`,
      choices
    }
  ]);

  return answer.resolution;
}

/**
 * Resolves all conflicts in a file interactively
 */
export async function resolveFileConflicts(fileData, autoResolve = false) {
  const resolutions = [];
  let autoResolved = 0;
  let manualResolved = 0;
  let skipped = 0;

  console.log(chalk.bold.blue(`\n\n════════════════════════════════════════════════════════════`));
  console.log(chalk.bold.white(`  Resolving: ${fileData.filePath}`));
  console.log(chalk.bold.blue(`════════════════════════════════════════════════════════════`));

  for (let i = 0; i < fileData.conflicts.length; i++) {
    const conflict = fileData.conflicts[i];
    let resolutionType;

    if (autoResolve && isSimpleConflict(conflict)) {
      resolutionType = RESOLUTION_TYPES.AUTO;
      autoResolved++;
      console.log(chalk.green(`\n✓ Auto-resolved conflict #${i + 1} (simple conflict)`));
    } else {
      resolutionType = await promptConflictResolution(
        conflict,
        i,
        fileData.conflicts.length,
        fileData.filePath
      );

      if (resolutionType === RESOLUTION_TYPES.SKIP) {
        skipped++;
      } else if (resolutionType === RESOLUTION_TYPES.AUTO) {
        autoResolved++;
      } else {
        manualResolved++;
      }
    }

    const resolvedContent = resolveConflict(conflict, resolutionType);

    resolutions.push({
      type: resolutionType,
      content: resolvedContent
    });
  }

  return {
    resolutions,
    stats: {
      autoResolved,
      manualResolved,
      skipped,
      total: fileData.conflicts.length
    }
  };
}

/**
 * Writes resolved content back to file
 */
export async function writeResolvedFile(filePath, content, createBackup = true, repoPath = process.cwd()) {
  try {
    if (createBackup) {
      await backupFile(filePath, repoPath);
    }

    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    throw new Error(`Failed to write resolved file ${filePath}: ${error.message}`);
  }
}

/**
 * Main interactive resolution workflow for all files
 */
export async function resolveAllConflicts(parsedFiles, options = {}) {
  const {
    autoResolve = false,
    createBackup = true,
    repoPath = process.cwd()
  } = options;

  const results = {
    filesProcessed: 0,
    filesResolved: 0,
    filesFailed: 0,
    totalConflicts: 0,
    autoResolved: 0,
    manualResolved: 0,
    skipped: 0
  };

  console.log(chalk.bold.cyan(`\n🔧 Starting conflict resolution for ${parsedFiles.length} file(s)...\n`));

  for (const fileData of parsedFiles) {
    results.filesProcessed++;
    results.totalConflicts += fileData.conflicts.length;

    try {
      const { resolutions, stats } = await resolveFileConflicts(fileData, autoResolve);

      results.autoResolved += stats.autoResolved;
      results.manualResolved += stats.manualResolved;
      results.skipped += stats.skipped;

      // Apply resolutions if any were made
      if (stats.autoResolved > 0 || stats.manualResolved > 0) {
        const resolvedContent = await applyResolutions(fileData, resolutions);
        await writeResolvedFile(fileData.filePath, resolvedContent, createBackup, repoPath);
        results.filesResolved++;
        console.log(chalk.green.bold(`\n✓ File saved: ${fileData.filePath}`));
      } else {
        console.log(chalk.yellow(`\n⚠ All conflicts skipped in: ${fileData.filePath}`));
      }
    } catch (error) {
      results.filesFailed++;
      console.error(chalk.red(`\n✗ Error resolving ${fileData.filePath}: ${error.message}`));
    }
  }

  return results;
}

