@echo off
echo ================================
echo Starting Spotify Final App
echo ================================
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend\server && npm run start"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Dev Server...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo ================================
echo Both servers are starting!
echo ================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit (servers will keep running)...
pause >nul
