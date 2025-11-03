# Dockerfile para Railway
FROM python:3.11-slim

# Instalar bash
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (cache layer)
COPY requirements.txt .

# Instalar dependências
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretório para banco
RUN mkdir -p /app/data

# Dar permissão ao script
RUN chmod +x start.sh

# Expor porta
EXPOSE 8080

# Variável de ambiente padrão
ENV PORT=8080

# Usar script de inicialização
CMD ["bash", "start.sh"]
