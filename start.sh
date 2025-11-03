# start.sh - Script de inicialização
#!/bin/bash
echo "Iniciando sistema de agendamento..."
python -c "
import os
os.environ.setdefault('PORT', '8080')
from main import app, db
with app.app_context():
    db.create_all()
    print('Banco de dados inicializado')
"
echo "Iniciando servidor web..."
exec gunicorn --bind 0.0.0.0:$PORT --timeout 300 --workers 1 --preload main:app
