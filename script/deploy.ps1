#!/usr/bin/env pwsh

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Deploying to EC2 Server..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$SSH_KEY = "../pk.pem"
$SERVER = "ubuntu@ec2-13-232-231-175.ap-south-1.compute.amazonaws.com"
$REMOTE_PATH = "/home/ubuntu/SolarPanel"

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_DIR = Split-Path -Parent $SCRIPT_DIR

# Read .gitignore patterns
$excludePatterns = @(
    "node_modules",
    ".git",
    "dist",
    ".next",
    ".turbo",
    "*.log",
    ".env.local",
    ".DS_Store",
    "*.swp",
    "*.swo",
    ".vscode",
    "coverage",
    ".nyc_output"
)

# Add patterns from .gitignore
$gitignorePath = Join-Path $PROJECT_DIR ".gitignore"
if (Test-Path $gitignorePath) {
    Get-Content $gitignorePath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and !$line.StartsWith("#")) {
            $excludePatterns += $line
        }
    }
}

Write-Host "Creating deployment archive..." -ForegroundColor Yellow

# Create temp archive
$tempFile = Join-Path $env:TEMP "solarpanel-deploy.tar.gz"
if (Test-Path $tempFile) {
    Remove-Item $tempFile -Force
}

# Build tar exclude arguments
$excludeArgs = @()
foreach ($pattern in $excludePatterns) {
    $excludeArgs += "--exclude=$pattern"
}

# Create tar archive (requires tar in PATH, available in Windows 10+)
$tarCmd = "tar"
$tarArgs = @("-czf", $tempFile) + $excludeArgs + @("-C", $PROJECT_DIR, ".")

try {
    & $tarCmd $tarArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create archive"
    }
} catch {
    Write-Host "Error: Failed to create deployment archive" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "Transferring to server..." -ForegroundColor Yellow

# Upload to server
$scpArgs = @("-i", (Join-Path $PROJECT_DIR $SSH_KEY), $tempFile, "${SERVER}:/home/ubuntu/deploy.tar.gz")
& scp $scpArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to transfer files to server" -ForegroundColor Red
    Remove-Item $tempFile -Force
    exit 1
}

Write-Host "Extracting on server..." -ForegroundColor Yellow

# Extract on server
$sshArgs = @(
    "-i", (Join-Path $PROJECT_DIR $SSH_KEY),
    $SERVER,
    "cd /home/ubuntu && rm -rf SolarPanel.backup && mv SolarPanel SolarPanel.backup 2>/dev/null || true && mkdir -p SolarPanel && tar -xzf deploy.tar.gz -C SolarPanel && rm deploy.tar.gz && echo 'Extraction complete'"
)

& ssh $sshArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to extract files on server" -ForegroundColor Red
    Remove-Item $tempFile -Force
    exit 1
}

# Clean up
Remove-Item $tempFile -Force

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps on server:" -ForegroundColor Yellow
Write-Host "  ssh -i `"$SSH_KEY`" $SERVER" -ForegroundColor White
Write-Host "  cd /home/ubuntu/SolarPanel" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run build" -ForegroundColor White
Write-Host "  pm2 restart all" -ForegroundColor White
Write-Host ""
