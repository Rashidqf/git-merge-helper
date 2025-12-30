# PowerShell script to publish to both npm and GitHub Packages
Write-Host "Publishing git-merge-helper to npm and GitHub Packages..." -ForegroundColor Cyan

# Check npm login
Write-Host "`nChecking npm authentication..." -ForegroundColor Yellow
$whoami = npm whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not logged in to npm. Please run 'npm login' first." -ForegroundColor Red
    exit 1
}
Write-Host "Logged in to npm as: $whoami" -ForegroundColor Green

# Check GitHub Packages auth
Write-Host "`nChecking GitHub Packages authentication..." -ForegroundColor Yellow
$npmrcPath = Join-Path $env:USERPROFILE ".npmrc"
if (-not (Test-Path $npmrcPath)) {
    Write-Host "Warning: .npmrc not found. GitHub Packages publish may fail." -ForegroundColor Yellow
}

# Publish to npm
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Publishing to npm..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npm publish --registry=https://registry.npmjs.org/

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully published to npm!" -ForegroundColor Green
    Write-Host "View at: https://www.npmjs.com/package/git-merge-helper`n" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Failed to publish to npm." -ForegroundColor Red
    exit 1
}

# Publish to GitHub Packages
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Publishing to GitHub Packages..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npm publish --registry=https://npm.pkg.github.com/

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully published to GitHub Packages!" -ForegroundColor Green
    Write-Host "View at: https://github.com/Rashidqf/git-merge-helper/packages`n" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Failed to publish to GitHub Packages." -ForegroundColor Yellow
    Write-Host "`nTo publish to GitHub Packages, add to ~/.npmrc:" -ForegroundColor Yellow
    Write-Host "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN`n" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Publishing Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nnpm: https://www.npmjs.com/package/git-merge-helper" -ForegroundColor Cyan
Write-Host "GitHub: https://github.com/Rashidqf/git-merge-helper`n" -ForegroundColor Cyan

