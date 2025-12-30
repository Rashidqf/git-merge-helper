# PowerShell script to publish to GitHub Packages
Write-Host "Publishing git-merge-helper to GitHub Packages..." -ForegroundColor Cyan

# Check if .npmrc has GitHub registry auth
$npmrcPath = Join-Path $env:USERPROFILE ".npmrc"
if (-not (Test-Path $npmrcPath)) {
    Write-Host "Error: .npmrc not found. Please configure GitHub Packages authentication." -ForegroundColor Red
    Write-Host "Add to ~/.npmrc:" -ForegroundColor Yellow
    Write-Host "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" -ForegroundColor Yellow
    exit 1
}

# Publish to GitHub Packages
Write-Host "`nPublishing to GitHub Packages..." -ForegroundColor Yellow
npm publish --registry=https://npm.pkg.github.com/

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully published to GitHub Packages! 🎉" -ForegroundColor Green
    Write-Host "View at: https://github.com/Rashidqf/git-merge-helper/packages" -ForegroundColor Cyan
} else {
    Write-Host "`nFailed to publish to GitHub Packages." -ForegroundColor Red
    Write-Host "`nMake sure:" -ForegroundColor Yellow
    Write-Host "1. You have a GitHub Personal Access Token with 'write:packages' scope" -ForegroundColor Yellow
    Write-Host "2. Add to ~/.npmrc: //npm.pkg.github.com/:_authToken=YOUR_TOKEN" -ForegroundColor Yellow
    exit 1
}

