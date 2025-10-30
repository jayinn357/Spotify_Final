# Spotify Final - Development Server Startup Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Starting Spotify Final App" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if servers are already running
$backendRunning = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
$frontendRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($backendRunning) {
    Write-Host "⚠️  Backend already running on port 8000" -ForegroundColor Yellow
} else {
    Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend\server'; npm run start" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

if ($frontendRunning) {
    Write-Host "⚠️  Frontend already running on port 5173" -ForegroundColor Yellow
} else {
    Write-Host "[2/2] Starting Frontend Dev Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Servers Started!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
