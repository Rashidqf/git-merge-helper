# PowerShell script to publish to npm
Write-Host "Publishing git-merge-helper to npm..." -ForegroundColor Cyan

# Check if logged in
$whoami = npm whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Not logged in to npm. Please run 'npm login' first." -ForegroundColor Red
    exit 1
}

Write-Host "Logged in as: $whoami" -ForegroundColor Green

# Publish to npm
Write-Host "`nPublishing to npm registry..." -ForegroundColor Yellow
npm publish --registry=https://registry.npmjs.org/

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully published to npm! 🎉" -ForegroundColor Green
    Write-Host "View at: https://www.npmjs.com/package/git-merge-helper" -ForegroundColor Cyan
} else {
    Write-Host "`nFailed to publish to npm." -ForegroundColor Red
    exit 1
}

