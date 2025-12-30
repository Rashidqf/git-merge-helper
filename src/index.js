import { parseAllConflicts, getConflictStats } from './conflict.js';
import { resolveAllConflicts } from './resolver.js';
import { backupFiles, restoreBackup, hasBackup, getBackupInfo, cleanupBackup } from './backup.js';
import {
  printSummary,
  printConflictStats,
  printConflictedFiles,
  printError,
  printSuccess,
  printInfo,
  printWarning
} from './summary.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Main function to run the merge helper
 */
export async function runMergeHelper(options = {}) {
  const {
    autoResolve = false,
    skipBackup = false,
    repoPath = process.cwd()
  } = options;

  try {
    console.log(chalk.bold.cyan(`\n🚀 Git Merge Helper v1.0.0\n`));

    // Parse all conflicts
    console.log(chalk.gray('Scanning for conflicts...\n'));
    const parsedFiles = await parseAllConflicts(repoPath);

    if (parsedFiles.length === 0) {
      printSuccess('No merge conflicts detected! 🎉');
      return { success: true, noConflicts: true };
    }

    // Show conflict statistics
    const stats = getConflictStats(parsedFiles);
    printConflictStats(stats);
    printConflictedFiles(parsedFiles);

    // Ask for confirmation to proceed
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Would you like to start resolving conflicts?',
        default: true
      }
    ]);

    if (!proceed) {
      printInfo('Operation cancelled by user');
      return { success: false, cancelled: true };
    }

    // Create backups
    if (!skipBackup) {
      console.log(chalk.gray('\n💾 Creating backups...\n'));
      const filePaths = parsedFiles.map(f => f.filePath);
      await backupFiles(filePaths, repoPath);
      printSuccess('Backups created successfully');
    }

    // Resolve conflicts
    const results = await resolveAllConflicts(parsedFiles, {
      autoResolve,
      createBackup: false, // Already backed up above
      repoPath
    });

    // Print summary
    printSummary(results);

    return { success: true, results };
  } catch (error) {
    printError('An error occurred', error.message);
    console.error(error.stack);
    return { success: false, error: error.message };
  }
}

/**
 * Rollback to backup
 */
export async function runRollback(options = {}) {
  const { repoPath = process.cwd() } = options;

  try {
    console.log(chalk.bold.cyan(`\n🔄 Git Merge Helper - Rollback\n`));

    // Check if backup exists
    if (!(await hasBackup(repoPath))) {
      printWarning('No backup found. Nothing to rollback.');
      return { success: false, noBackup: true };
    }

    // Show backup info
    const backupInfo = await getBackupInfo(repoPath);
    
    if (backupInfo) {
      console.log(chalk.white(`Backup created: ${chalk.cyan(new Date(backupInfo.timestamp).toLocaleString())}`));
      console.log(chalk.white(`Files in backup: ${chalk.cyan(backupInfo.fileCount)}\n`));
    }

    // Ask for confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow('Are you sure you want to restore the backup? This will overwrite current files.'),
        default: false
      }
    ]);

    if (!confirm) {
      printInfo('Rollback cancelled by user');
      return { success: false, cancelled: true };
    }

    // Restore backup
    const result = await restoreBackup(repoPath);

    if (result.success) {
      printSuccess(`Successfully restored ${result.restoredCount} file(s)!`);
      
      // Ask if user wants to clean up backup
      const { cleanup } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'cleanup',
          message: 'Would you like to delete the backup folder?',
          default: false
        }
      ]);

      if (cleanup) {
        await cleanupBackup(repoPath);
      }

      return { success: true, result };
    }

    return { success: false };
  } catch (error) {
    printError('Rollback failed', error.message);
    console.error(error.stack);
    return { success: false, error: error.message };
  }
}

/**
 * Show backup information
 */
export async function showBackupInfo(options = {}) {
  const { repoPath = process.cwd() } = options;

  try {
    console.log(chalk.bold.cyan(`\n💾 Git Merge Helper - Backup Info\n`));

    if (!(await hasBackup(repoPath))) {
      printInfo('No backup found.');
      return { success: true, noBackup: true };
    }

    const backupInfo = await getBackupInfo(repoPath);

    if (!backupInfo) {
      printWarning('Backup exists but could not read backup information.');
      return { success: false };
    }

    console.log(chalk.white(`Backup created: ${chalk.cyan(new Date(backupInfo.timestamp).toLocaleString())}`));
    console.log(chalk.white(`Files in backup: ${chalk.cyan(backupInfo.fileCount)}`));
    
    console.log(chalk.bold.white(`\n📄 Backed up files:`));
    backupInfo.files.forEach((file, index) => {
      const prefix = index === backupInfo.files.length - 1 ? '└─' : '├─';
      console.log(chalk.gray(`   ${prefix} `) + chalk.white(file));
    });

    console.log(chalk.gray(`\nRestore with: `) + chalk.cyan(`git-merge-helper rollback`));
    console.log();

    return { success: true, backupInfo };
  } catch (error) {
    printError('Failed to read backup info', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Clean up backup
 */
export async function cleanBackup(options = {}) {
  const { repoPath = process.cwd() } = options;

  try {
    console.log(chalk.bold.cyan(`\n🗑️  Git Merge Helper - Clean Backup\n`));

    if (!(await hasBackup(repoPath))) {
      printInfo('No backup found. Nothing to clean.');
      return { success: true, noBackup: true };
    }

    // Ask for confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow('Are you sure you want to delete the backup? This cannot be undone.'),
        default: false
      }
    ]);

    if (!confirm) {
      printInfo('Cleanup cancelled by user');
      return { success: false, cancelled: true };
    }

    await cleanupBackup(repoPath);
    printSuccess('Backup cleaned successfully!');

    return { success: true };
  } catch (error) {
    printError('Failed to clean backup', error.message);
    return { success: false, error: error.message };
  }
}

export default {
  runMergeHelper,
  runRollback,
  showBackupInfo,
  cleanBackup
};

