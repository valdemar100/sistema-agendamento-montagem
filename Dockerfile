# Dockerfile simples para Railway
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (cache layer)
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretório para banco
RUN mkdir -p /app/data

# Dar permissão ao script
RUN chmod +x start.sh

# Expor porta (Railway define automaticamente)
EXPOSE 8080

# Usar script de inicialização
CMD ["./start.sh"]
