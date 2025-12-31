# 🔧 Git Merge Helper

[![npm version](https://img.shields.io/npm/v/git-merge-helper.svg)](https://www.npmjs.com/package/git-merge-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Interactive CLI tool for resolving Git merge conflicts with ease**

Git Merge Helper is a production-ready Node.js CLI that makes resolving merge conflicts intuitive and efficient. It provides an interactive interface to view, resolve, and manage conflicts, with automatic backups and intelligent suggestions.

## ✨ Features

- 🎯 **Interactive Conflict Resolution** - Navigate conflicts with cursor-based CLI
- 🤖 **Auto-Resolution** - Automatically resolve simple conflicts
- 💾 **Automatic Backups** - All files are backed up before modification
- 🔄 **Easy Rollback** - Restore original files with a single command
- 📊 **Detailed Summary** - See statistics and resolution status
- 🎨 **Beautiful UI** - Color-coded, easy-to-read conflict display
- ⚡ **Fast & Lightweight** - Minimal dependencies, maximum efficiency

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g git-merge-helper
```

### Using npx (No Installation Required)

```bash
npx git-merge-helper
```

### Local Project Installation

```bash
npm install --save-dev git-merge-helper
```

## 🚀 Quick Start

1. **Navigate to your Git repository with conflicts:**

```bash
cd your-repo-with-conflicts
```

2. **Run Git Merge Helper:**

```bash
git-merge-helper
```

3. **Follow the interactive prompts to resolve conflicts**

4. **Review and commit:**

```bash
git add .
git commit -m "Resolved merge conflicts"
```

## 📖 Usage

### Basic Usage

```bash
# Start interactive conflict resolution
git-merge-helper

# Auto-resolve simple conflicts
git-merge-helper --auto

# Skip creating backups (not recommended)
git-merge-helper --no-backup
```

### Commands

#### Default (Resolve Conflicts)

```bash
git-merge-helper
```

Starts the interactive conflict resolution process. For each conflict, you'll see:
- Current branch code (HEAD)
- Incoming branch code
- Options to resolve

#### Rollback

```bash
git-merge-helper rollback
```

Restores all files from the backup created during the last resolution session.

#### Backup Info

```bash
git-merge-helper backup-info
```

Shows information about the current backup, including:
- Backup creation time
- Number of files
- List of backed up files

#### Clean Backup

```bash
git-merge-helper clean-backup
```

Deletes the backup folder after confirmation.

### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--auto` | `-a` | Auto-resolve simple conflicts |
| `--no-backup` | | Skip creating backups (not recommended) |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version number |

## 🎮 Interactive Resolution

When you run `git-merge-helper`, for each conflict you'll be presented with these options:

1. **Keep HEAD** - Keep the code from your current branch
2. **Keep Incoming** - Keep the code from the branch you're merging
3. **Keep Both** - Keep both versions (HEAD first, then incoming)
4. **Auto-resolve** - Let the tool intelligently resolve (for simple conflicts)
5. **Skip** - Skip this conflict and resolve it later

### Example

```
════════════════════════════════════════════════════════════
  Resolving: src/components/Button.js
════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────
Conflict #1 (lines 12-18)
────────────────────────────────────────────────────────────

<<<<<<< HEAD (main)
  backgroundColor: 'blue',
  padding: '10px',

=======

  backgroundColor: 'green',
  padding: '12px',
  borderRadius: '4px',
>>>>>>> feature-branch

────────────────────────────────────────────────────────────

? How would you like to resolve this conflict? (1/3)
  ◯ Keep HEAD (current branch)
  ◉ Keep Incoming (merge branch)
  ◯ Keep Both (HEAD + Incoming)
  ◯ Skip (resolve later)
```

## 💾 Backup & Rollback

### Automatic Backups

Git Merge Helper automatically creates backups before modifying any files. Backups are stored in `.git-merge-helper-backup/` at your repository root.

### Restoring from Backup

If you need to undo changes:

```bash
git-merge-helper rollback
```

This will restore all files to their state before running Git Merge Helper.

### Managing Backups

```bash
# View backup information
git-merge-helper backup-info

# Clean up old backups
git-merge-helper clean-backup
```

## 📊 Resolution Summary

After resolving conflicts, you'll see a detailed summary:

```
╔════════════════════════════════════════════════════════════╗
║              MERGE RESOLUTION SUMMARY                      ║
╚════════════════════════════════════════════════════════════╝

📂 Files:
   ├─ Total Processed: 3
   ├─ Successfully Resolved: 3
   └─ Failed: 0

⚔️  Conflicts:
   ├─ Total: 8
   ├─ Auto-resolved: 3
   ├─ Manually resolved: 5
   ├─ Total Resolved: 8
   └─ Remaining: 0 🎉

📊 Status:
   ✓ All conflicts resolved successfully!

   Next steps:
   1. Review the changes: git diff
   2. Stage the resolved files: git add .
   3. Complete the merge: git commit

💾 Backup:
   Original files backed up in: .git-merge-helper-backup/
   Restore with: git-merge-helper rollback
```

## 🛠️ Configuration (Optional)

Create a `.git-merge-helper.json` file in your repository root for custom settings:

```json
{
  "autoResolve": true,
  "createBackup": true,
  "autoResolveRules": {
    "preferIncoming": ["package-lock.json", "yarn.lock"],
    "preferHead": [],
    "alwaysKeepBoth": []
  }
}
```

### Configuration Options

- `autoResolve` (boolean): Automatically resolve simple conflicts
- `createBackup` (boolean): Create backups before modification
- `autoResolveRules` (object): Define file-specific resolution strategies
  - `preferIncoming`: Array of file patterns to prefer incoming changes
  - `preferHead`: Array of file patterns to prefer HEAD changes
  - `alwaysKeepBoth`: Array of file patterns to always keep both versions

## 🔍 How It Works

1. **Detection**: Scans your Git repository for merge conflicts
2. **Parsing**: Analyzes conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. **Classification**: Identifies simple vs. complex conflicts
4. **Backup**: Creates copies of all conflicted files
5. **Resolution**: Interactive or automatic resolution
6. **Application**: Applies your choices and removes conflict markers
7. **Summary**: Shows detailed statistics and next steps

## 🤖 Auto-Resolution

Git Merge Helper can automatically resolve "simple" conflicts where:
- One side has no changes (empty)
- Only additions on one side with no overlap
- No complex modifications on both sides

Use the `--auto` flag to enable automatic resolution:

```bash
git-merge-helper --auto
```

## 📋 Requirements

- Node.js >= 18.0.0
- Git repository with merge conflicts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### "No merge conflicts detected"

Make sure you're in a Git repository with active merge conflicts. Run `git status` to check.

### "Failed to detect conflicts"

Ensure you have Git installed and accessible in your PATH. Try running `git --version`.

### Permission Errors

If you encounter permission errors during global installation, try:

```bash
sudo npm install -g git-merge-helper
```

Or configure npm to install packages globally without sudo: [npm docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

## 🙏 Acknowledgments

- Built with [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) for interactive prompts
- Styled with [Chalk](https://github.com/chalk/chalk) for beautiful terminal output
- Git operations powered by [simple-git](https://github.com/steveukx/git-js)

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/Rashidqf/git-merge-helper/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Rashidqf/git-merge-helper/discussions)
- 👨‍💻 Author: [Rashid](https://github.com/Rashidqf)

## 🗺️ Roadmap

- [ ] AI-powered conflict suggestions
- [ ] Diff view with syntax highlighting
- [ ] Support for custom merge strategies
- [ ] VS Code extension
- [ ] Web-based UI option
- [ ] Multi-repository support

## 🛠️ Development Setup

### Installation from npm

Your package is now live on npm! Install it globally:

```bash
npm install -g git-merge-helper
```

Or use it without installation:

```bash
npx git-merge-helper
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/Rashidqf/git-merge-helper.git
cd git-merge-helper

# Install dependencies
npm install

# Link for local testing
npm link

# Test the CLI
git-merge-helper --help
```

### Publishing Updates

To publish new versions to npm:

```bash
# Update version
npm version patch  # or minor, or major

# Publish
npm run publish:npm
```

---

Made with ❤️ by [Rashid](https://github.com/Rashidqf)

