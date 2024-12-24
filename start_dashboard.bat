@echo off
echo Starting Raynet SaaS Optimization Dashboard...
echo.

REM Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please install Python 3.8 or higher.
    pause
    exit /b
)

REM Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed! Please install Node.js 14 or higher.
    pause
    exit /b
)

REM Check if PostgreSQL is installed
pg_isready > nul 2>&1
if errorlevel 1 (
    echo PostgreSQL is not running! Please start PostgreSQL service.
    pause
    exit /b
)

echo Checking and installing required Python packages...
pip install -r requirements.txt

echo Checking and installing required Node.js packages...
cd raynet_saas_optimization/frontend
call npm install
cd ../..

echo Starting backend server...
start cmd /k "cd raynet_saas_optimization/backend && python -m uvicorn app.main:app --reload"

echo Starting frontend server...
start cmd /k "cd raynet_saas_optimization/frontend && npm start"

echo.
echo Dashboard is starting up...
echo The website will open automatically in your default browser.
echo If it doesn't open automatically, please visit: http://localhost:3000
echo.
echo Press any key to close all services when you're done...

timeout /t 10 > nul
start http://localhost:3000

pause

REM Cleanup - Kill all running services
taskkill /F /IM "node.exe" > nul 2>&1
taskkill /F /IM "python.exe" > nul 2>&1 