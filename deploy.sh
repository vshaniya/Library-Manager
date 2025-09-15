#!/bin/bash

# Library Management System Deployment Script

echo "🚀 Starting deployment preparation..."

# Backend preparation
echo "📦 Preparing backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment (Linux/Mac)
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend prepared!"

# Frontend preparation
echo "📦 Preparing frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Build for production
echo "Building frontend..."
npm run build

echo "✅ Frontend built!"

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway/Heroku"
echo "2. Deploy frontend build folder to Netlify/Vercel"
echo "3. Update environment variables"
echo "4. Test your deployed application"