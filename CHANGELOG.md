# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-31

### Added
- Initial release of Git Merge Helper
- Interactive conflict resolution with cursor-based navigation
- Automatic detection of Git merge conflicts
- Support for multiple resolution strategies:
  - Keep HEAD (current branch)
  - Keep Incoming (merge branch)
  - Keep Both versions
  - Auto-resolve simple conflicts
  - Skip conflicts for later resolution
- Automatic backup creation before file modification
- Rollback functionality to restore original files
- Detailed resolution summary with statistics
- Beautiful, color-coded CLI interface
- Commands:
  - Default: Interactive conflict resolution
  - `rollback`: Restore files from backup
  - `backup-info`: Show backup information
  - `clean-backup`: Delete backup folder
- Flags:
  - `--auto` / `-a`: Auto-resolve simple conflicts
  - `--no-backup`: Skip backup creation
  - `--help` / `-h`: Show help message
  - `--version` / `-v`: Show version number
- Configuration file support (`.git-merge-helper.json`)
- Comprehensive documentation
- MIT License

### Features
- Conflict parsing with line number tracking
- Simple vs. complex conflict classification
- File-by-file interactive resolution
- Backup manifest for tracking modified files
- Error handling and user-friendly error messages
- Cross-platform support (Windows, macOS, Linux)
- ES Modules support
- Node.js >= 18.0.0 compatibility

### Dependencies
- `chalk` (^5.3.0) - Terminal styling
- `inquirer` (^9.2.12) - Interactive prompts
- `simple-git` (^3.21.0) - Git operations

## [Unreleased]

### Planned Features
- AI-powered conflict resolution suggestions
- Syntax highlighting in conflict display
- Diff view with side-by-side comparison
- Custom merge strategy plugins
- VS Code extension
- Web-based UI option
- Multi-repository batch processing
- Conflict resolution templates
- Integration with popular Git GUIs
- Performance optimizations for large files

