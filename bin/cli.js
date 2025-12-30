#!/usr/bin/env node

import { runMergeHelper, runRollback, showBackupInfo, cleanBackup } from '../src/index.js';
import chalk from 'chalk';

const args = process.argv.slice(2);
const command = args[0];

// Parse flags
const flags = {
  autoResolve: args.includes('--auto') || args.includes('-a'),
  skipBackup: args.includes('--no-backup'),
  help: args.includes('--help') || args.includes('-h'),
  version: args.includes('--version') || args.includes('-v')
};

// Show version
if (flags.version) {
  console.log(chalk.cyan('git-merge-helper v1.0.0'));
  process.exit(0);
}

// Show help
if (flags.help || (command && !['rollback', 'backup-info', 'clean-backup'].includes(command))) {
  console.log(chalk.bold.cyan('\n🔧 Git Merge Helper - Interactive Git Conflict Resolution\n'));
  console.log(chalk.white('Usage:'));
  console.log(chalk.gray('  $ ') + chalk.cyan('git-merge-helper') + chalk.gray(' [command] [options]\n'));
  
  console.log(chalk.white('Commands:'));
  console.log(chalk.gray('  (default)        ') + 'Start interactive conflict resolution');
  console.log(chalk.gray('  rollback         ') + 'Restore files from backup');
  console.log(chalk.gray('  backup-info      ') + 'Show backup information');
  console.log(chalk.gray('  clean-backup     ') + 'Delete backup folder\n');
  
  console.log(chalk.white('Options:'));
  console.log(chalk.gray('  -a, --auto       ') + 'Auto-resolve simple conflicts');
  console.log(chalk.gray('  --no-backup      ') + 'Skip creating backups (not recommended)');
  console.log(chalk.gray('  -h, --help       ') + 'Show this help message');
  console.log(chalk.gray('  -v, --version    ') + 'Show version number\n');
  
  console.log(chalk.white('Examples:'));
  console.log(chalk.gray('  $ ') + chalk.cyan('git-merge-helper'));
  console.log(chalk.gray('  $ ') + chalk.cyan('git-merge-helper --auto'));
  console.log(chalk.gray('  $ ') + chalk.cyan('git-merge-helper rollback'));
  console.log(chalk.gray('  $ ') + chalk.cyan('npx git-merge-helper\n'));
  
  console.log(chalk.gray('Learn more: https://github.com/Rashidqf/git-merge-helper\n'));
  process.exit(0);
}

// Execute command
async function main() {
  try {
    switch (command) {
      case 'rollback':
        await runRollback();
        break;
      
      case 'backup-info':
        await showBackupInfo();
        break;
      
      case 'clean-backup':
        await cleanBackup();
        break;
      
      default:
        // Default: run merge helper
        await runMergeHelper({
          autoResolve: flags.autoResolve,
          skipBackup: flags.skipBackup
        });
        break;
    }
  } catch (error) {
    console.error(chalk.red.bold('\n✗ Fatal error:'), error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

