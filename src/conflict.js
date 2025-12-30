import fs from 'fs/promises';
import path from 'path';
import { simpleGit } from 'simple-git';
import chalk from 'chalk';

const CONFLICT_MARKERS = {
  START: '<<<<<<<',
  MIDDLE: '=======',
  END: '>>>>>>>'
};

/**
 * Detects if the current directory is a Git repository with conflicts
 */
export async function detectConflicts(repoPath = process.cwd()) {
  try {
    const git = simpleGit(repoPath);
    const status = await git.status();
    
    if (status.conflicted.length === 0) {
      return { hasConflicts: false, files: [] };
    }

    return {
      hasConflicts: true,
      files: status.conflicted
    };
  } catch (error) {
    throw new Error(`Failed to detect conflicts: ${error.message}`);
  }
}

/**
 * Parses conflict markers in a file and extracts conflict blocks
 */
export async function parseConflictFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const conflicts = [];
    let currentConflict = null;
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      lineNumber = i + 1;

      if (line.startsWith(CONFLICT_MARKERS.START)) {
        currentConflict = {
          startLine: lineNumber,
          head: [],
          incoming: [],
          branchName: line.substring(CONFLICT_MARKERS.START.length).trim()
        };
      } else if (line.startsWith(CONFLICT_MARKERS.MIDDLE) && currentConflict) {
        currentConflict.middleLine = lineNumber;
      } else if (line.startsWith(CONFLICT_MARKERS.END) && currentConflict) {
        currentConflict.endLine = lineNumber;
        currentConflict.incomingBranch = line.substring(CONFLICT_MARKERS.END.length).trim();
        conflicts.push(currentConflict);
        currentConflict = null;
      } else if (currentConflict) {
        if (!currentConflict.middleLine) {
          currentConflict.head.push(line);
        } else {
          currentConflict.incoming.push(line);
        }
      }
    }

    return {
      filePath,
      content,
      lines,
      conflicts,
      hasConflicts: conflicts.length > 0
    };
  } catch (error) {
    throw new Error(`Failed to parse conflict file ${filePath}: ${error.message}`);
  }
}

/**
 * Parses all conflicted files in the repository
 */
export async function parseAllConflicts(repoPath = process.cwd()) {
  const { hasConflicts, files } = await detectConflicts(repoPath);

  if (!hasConflicts) {
    return [];
  }

  const parsedFiles = [];

  for (const file of files) {
    const fullPath = path.join(repoPath, file);
    try {
      const parsed = await parseConflictFile(fullPath);
      if (parsed.hasConflicts) {
        parsedFiles.push(parsed);
      }
    } catch (error) {
      console.error(chalk.red(`Error parsing ${file}: ${error.message}`));
    }
  }

  return parsedFiles;
}

/**
 * Checks if a conflict is simple (can be auto-merged)
 * Simple conflicts are those where one side is empty or only adds lines
 */
export function isSimpleConflict(conflict) {
  const headEmpty = conflict.head.length === 0 || conflict.head.every(line => line.trim() === '');
  const incomingEmpty = conflict.incoming.length === 0 || conflict.incoming.every(line => line.trim() === '');

  return headEmpty || incomingEmpty;
}

/**
 * Formats a conflict for display in the CLI
 */
export function formatConflict(conflict, index) {
  const separator = chalk.gray('─'.repeat(60));
  
  return `
${separator}
${chalk.bold.blue(`Conflict #${index + 1}`)} ${chalk.gray(`(lines ${conflict.startLine}-${conflict.endLine})`)}
${separator}

${chalk.green('<<<<<<< HEAD')} ${chalk.gray(`(${conflict.branchName || 'current branch'})`)}
${chalk.green(conflict.head.join('\n') || '(empty)')}

${chalk.yellow('=======')}

${chalk.cyan(conflict.incoming.join('\n') || '(empty)')}
${chalk.cyan(`>>>>>>> ${conflict.incomingBranch || 'incoming branch'}`)}

${separator}
`;
}

/**
 * Gets conflict statistics
 */
export function getConflictStats(parsedFiles) {
  let totalConflicts = 0;
  let simpleConflicts = 0;

  for (const file of parsedFiles) {
    for (const conflict of file.conflicts) {
      totalConflicts++;
      if (isSimpleConflict(conflict)) {
        simpleConflicts++;
      }
    }
  }

  return {
    totalFiles: parsedFiles.length,
    totalConflicts,
    simpleConflicts,
    complexConflicts: totalConflicts - simpleConflicts
  };
}

