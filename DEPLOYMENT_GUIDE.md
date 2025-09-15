# Library Management System - Deployment Guide

## 🚀 Hosting Options

### Option 1: Free Hosting (Recommended for Testing)
- **Backend**: Railway.app or Render.com (Free tier)
- **Database**: Railway PostgreSQL or ElephantSQL (Free tier) 
- **Frontend**: Netlify or Vercel (Free tier)

### Option 2: Professional Hosting
- **Backend**: DigitalOcean App Platform or AWS
- **Database**: DigitalOcean Managed Database or AWS RDS
- **Frontend**: Netlify Pro or Vercel Pro

## 📦 Pre-Deployment Steps

### 1. Backend Preparation
```bash
cd backend
# Install production dependencies
pip install -r requirements.txt
```

### 2. Frontend Preparation
```bash
cd frontend
# Build for production
npm run build
```

### 3. Environment Variables Setup
Create production environment variables:
- DATABASE_URL
- SECRET_KEY
- FLASK_ENV=production

## 🔧 Deployment Instructions

### Railway.app Deployment (Recommended - Free)

#### Step 1: Deploy Database
1. Go to [Railway.app](https://railway.app)
2. Create account and new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from settings

#### Step 2: Deploy Backend
1. Connect your GitHub repository
2. Deploy the backend folder
3. Set environment variables:
   - DATABASE_URL (from step 1)
   - SECRET_KEY (generate random string)
   - FLASK_ENV=production
4. Add build command: `pip install -r requirements.txt`
5. Add start command: `gunicorn wsgi:app`

#### Step 3: Deploy Frontend
1. Go to [Netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Update API URLs in frontend to use your Railway backend URL

### Alternative: Heroku Deployment

#### Backend to Heroku:
```bash
# Install Heroku CLI
heroku create your-library-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=your-secret-key
git subtree push --prefix backend heroku main
```

#### Frontend to Netlify:
```bash
# Build the frontend
npm run build
# Deploy build folder to Netlify
```

## 🔗 Post-Deployment

1. Update CORS settings in backend to include frontend domain
2. Update API base URL in frontend to point to backend domain
3. Run database migrations if needed
4. Test all CRUD operations

## 💡 Tips

- Use environment variables for all sensitive data
- Enable HTTPS on both frontend and backend
- Monitor logs for any deployment issues
- Test thoroughly before going live

## 🆘 Troubleshooting

- Check environment variables are set correctly
- Verify database connection string
- Ensure CORS is configured for your frontend domain
- Check server logs for specific error messages