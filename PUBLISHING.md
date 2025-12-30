# Publishing Guide

This package is configured to publish to both **npm** and **GitHub Packages**.

## Prerequisites

### For npm
1. Create an account at [npmjs.com](https://www.npmjs.com/)
2. Login via CLI:
   ```bash
   npm login
   ```

### For GitHub Packages
1. Create a GitHub Personal Access Token:
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `write:packages`, `read:packages`, `delete:packages`
   - Copy the token

2. Add to your `~/.npmrc` file:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

## Publishing Methods

### Method 1: Using PowerShell Scripts (Windows)

#### Publish to npm only:
```powershell
.\publish-npm.ps1
```

#### Publish to GitHub Packages only:
```powershell
.\publish-github.ps1
```

#### Publish to both:
```powershell
.\publish-both.ps1
```

### Method 2: Using npm Scripts

#### Publish to npm:
```bash
npm run publish:npm
```

#### Publish to GitHub Packages:
```bash
npm run publish:github
```

### Method 3: Manual Publishing

#### Publish to npm:
```bash
npm publish --registry=https://registry.npmjs.org/
```

#### Publish to GitHub Packages:
```bash
npm publish --registry=https://npm.pkg.github.com/
```

## Before Publishing

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Update CHANGELOG.md** with changes

3. **Test locally**:
   ```bash
   npm install
   npm link
   git-merge-helper --help
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "chore: bump version to x.x.x"
   git push
   ```

5. **Create a Git tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## After Publishing

### Verify npm publication:
- Visit: https://www.npmjs.com/package/git-merge-helper
- Install: `npm install -g git-merge-helper`

### Verify GitHub Packages publication:
- Visit: https://github.com/Rashidqf/git-merge-helper/packages

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- For GitHub Packages, check your token has `write:packages` scope

### "Package name already exists"
- The package name is already taken
- For GitHub Packages, use scoped name: `@Rashidqf/git-merge-helper`

### "Version already published"
- Update the version number in `package.json`
- Use `npm version patch/minor/major`

## Package URLs

- **npm**: https://www.npmjs.com/package/git-merge-helper
- **GitHub**: https://github.com/Rashidqf/git-merge-helper
- **GitHub Packages**: https://github.com/Rashidqf/git-merge-helper/packages

## Notes

- The `publishConfig` in `package.json` defaults to npm registry
- Both registries require authentication
- You can publish to both registries with the same version number
- GitHub Packages requires the package name to match the repository name or use a scope

