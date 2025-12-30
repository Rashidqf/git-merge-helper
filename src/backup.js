import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const BACKUP_DIR = '.git-merge-helper-backup';

/**
 * Creates a backup of a file before modification
 */
export async function backupFile(filePath, repoPath = process.cwd()) {
  try {
    const backupPath = path.join(repoPath, BACKUP_DIR);
    await fs.mkdir(backupPath, { recursive: true });

    const relativePath = path.relative(repoPath, filePath);
    const backupFilePath = path.join(backupPath, relativePath);
    const backupFileDir = path.dirname(backupFilePath);

    // Create subdirectories if needed
    await fs.mkdir(backupFileDir, { recursive: true });

    // Copy the file
    await fs.copyFile(filePath, backupFilePath);

    return backupFilePath;
  } catch (error) {
    throw new Error(`Failed to backup file ${filePath}: ${error.message}`);
  }
}

/**
 * Backs up multiple files
 */
export async function backupFiles(filePaths, repoPath = process.cwd()) {
  const backedUp = [];

  for (const filePath of filePaths) {
    try {
      const fullPath = path.isAbsolute(filePath) ? filePath : path.join(repoPath, filePath);
      const backupPath = await backupFile(fullPath, repoPath);
      backedUp.push({
        original: filePath,
        backup: backupPath
      });
    } catch (error) {
      console.error(chalk.red(`Error backing up ${filePath}: ${error.message}`));
    }
  }

  // Save backup manifest
  const manifestPath = path.join(repoPath, BACKUP_DIR, 'manifest.json');
  const manifest = {
    timestamp: new Date().toISOString(),
    files: backedUp
  };

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  return backedUp;
}

/**
 * Checks if a backup exists
 */
export async function hasBackup(repoPath = process.cwd()) {
  const backupPath = path.join(repoPath, BACKUP_DIR);
  
  try {
    const stats = await fs.stat(backupPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Restores files from backup
 */
export async function restoreBackup(repoPath = process.cwd()) {
  const backupPath = path.join(repoPath, BACKUP_DIR);
  const manifestPath = path.join(backupPath, 'manifest.json');

  try {
    // Check if backup exists
    if (!(await hasBackup(repoPath))) {
      throw new Error('No backup found');
    }

    // Read manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    console.log(chalk.blue(`Restoring backup from ${manifest.timestamp}...`));

    let restoredCount = 0;

    // Restore each file
    for (const { original, backup } of manifest.files) {
      try {
        const originalPath = path.join(repoPath, original);
        await fs.copyFile(backup, originalPath);
        restoredCount++;
        console.log(chalk.green(`✓ Restored: ${original}`));
      } catch (error) {
        console.error(chalk.red(`✗ Failed to restore ${original}: ${error.message}`));
      }
    }

    console.log(chalk.green.bold(`\n✓ Restored ${restoredCount}/${manifest.files.length} files`));

    return {
      success: true,
      restoredCount,
      totalFiles: manifest.files.length
    };
  } catch (error) {
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
}

/**
 * Cleans up backup directory
 */
export async function cleanupBackup(repoPath = process.cwd()) {
  const backupPath = path.join(repoPath, BACKUP_DIR);

  try {
    if (await hasBackup(repoPath)) {
      await fs.rm(backupPath, { recursive: true, force: true });
      console.log(chalk.green('✓ Backup cleaned up'));
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(`Failed to cleanup backup: ${error.message}`);
  }
}

/**
 * Gets backup information
 */
export async function getBackupInfo(repoPath = process.cwd()) {
  const backupPath = path.join(repoPath, BACKUP_DIR);
  const manifestPath = path.join(backupPath, 'manifest.json');

  try {
    if (!(await hasBackup(repoPath))) {
      return null;
    }

    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    return {
      timestamp: manifest.timestamp,
      fileCount: manifest.files.length,
      files: manifest.files.map(f => f.original)
    };
  } catch (error) {
    return null;
  }
}

