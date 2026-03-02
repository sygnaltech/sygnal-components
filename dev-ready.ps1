#!/usr/bin/env pwsh
# Pre-flight check + startup prompt
# exit 1 aborts the sequence; exit 0 proceeds to start servers

# ── Configure for your project ──────────────────────────────────────────────
$projectName  = "Sygnal Components"
$shortcut     = "Ctrl+Shift+S"

# Required ports — if any are blocked, servers do not start
$requiredPorts = @(
    @{ Port = 3000; Name = "Docs" }
)

# No optional ports for this project
$optionalPorts = @()
# ────────────────────────────────────────────────────────────────────────────

function Test-Port($port) {
    return $null -ne (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor DarkGray
Write-Host "        $projectName DEV SERVERS" -ForegroundColor Cyan
Write-Host "  ==========================================" -ForegroundColor DarkGray
Write-Host ""

# Check all ports
$blockedRequired = $false
foreach ($p in $requiredPorts) {
    if (Test-Port $p.Port) {
        Write-Host "  [BLOCKED] Port $($p.Port) ($($p.Name))" -ForegroundColor Red
        $blockedRequired = $true
    } else {
        Write-Host "  [  OK   ] Port $($p.Port) ($($p.Name))" -ForegroundColor Green
    }
}

# Abort if required ports are blocked
if ($blockedRequired) {
    Write-Host ""
    Write-Host "  !! PORT CONFLICT - SERVERS NOT STARTED !!" -ForegroundColor Red
    Write-Host "  Free the blocked ports and press $shortcut to try again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Summary
Write-Host ""
$starting = ($requiredPorts | ForEach-Object { $_.Name })
Write-Host "  Starting: $($starting -join ', ')" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ==========================================" -ForegroundColor DarkGray
Write-Host ""

exit 0
