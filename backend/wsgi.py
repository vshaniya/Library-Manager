import os
from app import create_app

# Create the Flask application
app = create_app()

if __name__ == "__main__":
    # For local development
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))