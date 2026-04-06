@echo off
echo ========================================
echo    MS-CIT Manager - Local Server
echo ========================================
echo.
echo Building latest version...
npm run build >nul 2>&1
echo.
echo Starting server at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
cd dist
python -m http.server 3000