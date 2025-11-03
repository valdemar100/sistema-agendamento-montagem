# start.sh - Script de inicialização
#!/bin/bash
python -m flask db upgrade 2>/dev/null || echo "Banco inicializado"
exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 120 main:app
