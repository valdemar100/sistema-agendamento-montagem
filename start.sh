#!/bin/bash
# start.sh - Script de inicialização
echo "Iniciando sistema de agendamento..."

# Definir porta padrão se não estiver definida
if [ -z "$PORT" ]; then
    export PORT=8080
fi

echo "Porta configurada: $PORT"

# Inicializar banco de dados
python -c "
import os
from main import app, db
with app.app_context():
    db.create_all()
    print('Banco de dados inicializado com sucesso')
"

echo "Iniciando servidor web na porta $PORT..."
exec gunicorn --bind 0.0.0.0:$PORT --timeout 300 --workers 1 --preload main:app
