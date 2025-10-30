# Spotify Final - Stop All Servers Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Stopping Spotify Final Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Find and stop processes using ports 8000 and 5173
$portsToStop = @(8000, 5173)
$stoppedAny = $false

foreach ($port in $portsToStop) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "🛑 Stopping $($process.ProcessName) (PID: $($process.Id)) on port $port" -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                $stoppedAny = $true
            }
        }
    }
}

if (-not $stoppedAny) {
    Write-Host "ℹ️  No servers were running" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✅ All servers stopped!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
