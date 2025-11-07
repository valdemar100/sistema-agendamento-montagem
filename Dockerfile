# Dockerfile simples para Railway
FROM python:3.11-slim

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (cache layer)
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretório para banco com permissões
RUN mkdir -p /app/data && chmod 777 /app/data

# Expor porta
EXPOSE 8080

# Variável de ambiente padrão
ENV PORT=8080

# Comando simples para inicialização
CMD ["python", "main.py"]
