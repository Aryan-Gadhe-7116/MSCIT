@echo off
echo Starting Python server for MS-CIT Manager...
echo.
echo If Python is not installed, download from: https://python.org
echo.
cd dist
python -m http.server 3000
pause