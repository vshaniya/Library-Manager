@echo off
REM Library Management System Deployment Script for Windows

echo 🚀 Starting deployment preparation...

REM Backend preparation
echo 📦 Preparing backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

echo ✅ Backend prepared!

REM Frontend preparation
echo 📦 Preparing frontend...
cd ..\frontend

REM Install dependencies
echo Installing Node.js dependencies...
call npm install

REM Build for production
echo Building frontend...
call npm run build

echo ✅ Frontend built!

echo 🎉 Deployment preparation complete!
echo.
echo Next steps:
echo 1. Deploy backend to Railway/Heroku
echo 2. Deploy frontend build folder to Netlify/Vercel
echo 3. Update environment variables
echo 4. Test your deployed application

pause