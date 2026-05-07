@echo off
title PDF Extract & Screenshot
cd /d "%~dp0"

echo.
echo   ^>^>^> 🐶 PDF Extract & Screenshot — Starting up!
echo.
echo   Checking Python...

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   ❌ Python not found! Please install Python 3.10+ from:
    echo      https://www.python.org/downloads/
    echo.
    echo   ✅ Make sure to check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)

echo   ✅ Python found

:: Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo   📦 Creating virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo   ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
)

:: Activate and install deps
echo   📥 Installing dependencies (one-time)...
call .venv\Scripts\activate.bat
python -m pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
if %errorlevel% neq 0 (
    echo   ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo   ✅ All set! Launching app...
echo.
echo   🌐 Open your browser to: http://127.0.0.1:8080
echo.
echo   Press Ctrl+C in this window to stop the server.
echo.

:: Run the app (UTF-8 encoding for emoji support)
set PYTHONIOENCODING=utf-8
python app.py

pause
