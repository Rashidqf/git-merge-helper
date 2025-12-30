# Contributing to Git Merge Helper

Thank you for your interest in contributing to Git Merge Helper! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Detailed steps to reproduce the issue
- Expected behavior vs. actual behavior
- Your environment (OS, Node.js version, Git version)
- Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing issues to avoid duplicates
- Clearly describe the feature and its benefits
- Provide use cases and examples

### Pull Requests

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/Rashidqf/git-merge-helper.git
   cd git-merge-helper
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

6. **Test your changes**
   ```bash
   # Test locally
   npm link
   git-merge-helper --help
   
   # Test in a repository with conflicts
   cd /path/to/test-repo
   git-merge-helper
   ```

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## 📝 Code Style

- Use ES Modules (`import`/`export`)
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await instead of callbacks
- Handle errors appropriately

### Example

```javascript
/**
 * Resolves a single conflict based on the chosen strategy
 * @param {Object} conflict - The conflict object
 * @param {string} resolution - The resolution strategy
 * @returns {string} The resolved content
 */
export function resolveConflict(conflict, resolution) {
  // Implementation
}
```

## 🏗️ Project Structure

```
git-merge-helper/
├── bin/
│   └── cli.js           # CLI entry point
├── src/
│   ├── index.js         # Main logic
│   ├── conflict.js      # Conflict detection & parsing
│   ├── resolver.js      # Interactive resolution
│   ├── backup.js        # Backup & rollback
│   └── summary.js       # Summary generation
├── package.json
├── README.md
└── .gitignore
```

## 🧪 Testing

Currently, the project uses manual testing. Automated tests are planned for future releases.

To test your changes:

1. Create a test Git repository with conflicts
2. Run the tool and verify functionality
3. Test edge cases (empty conflicts, large files, etc.)
4. Test rollback functionality
5. Verify backup creation and restoration

## 📚 Documentation

When adding features:
- Update the README.md
- Add examples if applicable
- Update CHANGELOG.md
- Add JSDoc comments to new functions

## 🐛 Debugging

To debug the tool:

```javascript
// Add debug logging
console.log('Debug:', variable);

// Or use Node.js debugger
node --inspect bin/cli.js
```

## ⚡ Performance

When contributing, consider:
- Minimize file I/O operations
- Use efficient algorithms
- Avoid blocking operations
- Handle large files gracefully

## 🔒 Security

- Never commit sensitive data (tokens, passwords)
- Validate user inputs
- Handle file paths safely
- Report security issues privately

## 📋 Checklist

Before submitting a PR:
- [ ] Code follows project style
- [ ] Changes are tested
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] Branch is up to date with main

## 💬 Questions?

Feel free to:
- Open an issue for questions
- Join discussions on GitHub
- Reach out to maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉

