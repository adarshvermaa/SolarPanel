#!/usr/bin/env pwsh

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Fixing SSH Key Permissions..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$keyPath = "../pk.pem"
$fullPath = Resolve-Path $keyPath

Write-Host "Removing all existing permissions..." -ForegroundColor Yellow

# Remove inheritance
icacls $fullPath /inheritance:r | Out-Null

# Remove all existing permissions
icacls $fullPath /remove "NT AUTHORITY\Authenticated Users" 2>$null | Out-Null
icacls $fullPath /remove "BUILTIN\Users" 2>$null | Out-Null
icacls $fullPath /remove "BUILTIN\Administrators" 2>$null | Out-Null

# Get current user
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

Write-Host "Granting permission to $currentUser..." -ForegroundColor Yellow

# Grant only read permission to current user only
icacls $fullPath /grant:r "${currentUser}:(R)" | Out-Null

# Verify permissions
Write-Host ""
Write-Host "Current permissions:" -ForegroundColor Cyan
icacls $fullPath

Write-Host ""
Write-Host "SSH key permissions fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Now deploying..." -ForegroundColor Yellow
Write-Host ""

# Call the deploy script
& "$PSScriptRoot\deploy.ps1"
