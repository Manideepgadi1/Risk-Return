@echo off
echo Starting Risk-Return Analysis Dashboard...
echo.

start "Backend Server" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak > nul

start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
