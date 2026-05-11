@echo off
title Vijay Guest House - Hotel Management System
echo Starting Hotel Management System...

:: 1. Navigate to the vgh folder
cd /d "C:\Users\Divyansh\OneDrive\Desktop\.vscode\PYTHON\Django\HMS"

echo Moved to VGH Folder...

:: 2. Activate the virtual environment
call vghvenv\Scripts\activate

echo Started virtual environment...

:: 3. Navigate to the backend folder
cd /d "C:\Users\Divyansh\OneDrive\Desktop\.vscode\PYTHON\Django\HMS\vgh\backend"

echo Navigated to backend folder...

:: 4. Automatically open the browser to the local address
start http://127.0.0.1:8000

echo Transferred to browsers webpage...

:: 5. Run the FastAPI server
python -m uvicorn app.main:app --reload

echo Application Started Successfully...


pause