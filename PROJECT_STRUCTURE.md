# Backend (Flask)
- app/
  - __init__.py
  - models/        # SQLAlchemy models
  - routes/        # API endpoints
  - config.py      # Configuration (DB URI, etc)
  - extensions.py  # DB, CORS, etc
- run.py           # Entry point
- seed_data.py     # Database seeding script
- wsgi.py          # WSGI entry point for production

# Frontend (React)
- src/
  - components/    # Reusable UI components
  - api/           # API call logic
  - App.js         # Main app
  - index.js       # Entry point

# Root
- backend/
- frontend/
- README.md
- DEPLOYMENT_GUIDE.md
- deploy.sh / deploy.bat   # Deployment scripts
