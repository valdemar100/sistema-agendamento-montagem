web: python -c "from main import app, db; db.create_all()" && gunicorn --bind 0.0.0.0:$PORT --timeout 300 main:app
