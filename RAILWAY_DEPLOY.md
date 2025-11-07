# 🚀 Deploy no Railway - Sistema de Agendamento

Este guia explica como fazer deploy do Sistema de Agendamento de Montagem de Móveis no Railway.

## 📋 Pré-requisitos

1. **Conta no Railway**: Crie em [railway.app](https://railway.app)
2. **Código no GitHub**: O projeto deve estar em um repositório no GitHub
3. **Arquivos de configuração**: Já criados neste projeto

## 🛠️ Arquivos de Configuração Criados

- `Dockerfile` - Configuração do container
- `railway.toml` - Configuração específica do Railway  
- `.railwayignore` - Arquivos a ignorar no deploy
- `requirements.txt` - Dependências atualizadas com gunicorn

## 🚀 Passo a Passo do Deploy

### Método 1: Deploy Direto via URL (MAIS SIMPLES)

**Clique no link abaixo e siga as instruções:**

👆 **[DEPLOY AUTOMÁTICO NO RAILWAY](https://railway.app/new?template=https://github.com/valdemar100/sistema-agendamento-montagem)**

### Método 2: Manual Step-by-Step

1. **Acesse:** [railway.app](https://railway.app)
2. **Faça login** com GitHub
3. **New Project** → **Empty Service**
4. **Settings** → **Source** → **Connect Repo**
5. **Escolha:** `valdemar100/sistema-agendamento-montagem`
6. **Deploy automático** em 3-5 minutos

### Método 3: Fork + Deploy

1. **Fork** este repositório para sua conta GitHub
2. **Railway:** New Project → Deploy from GitHub
3. **Selecione** seu fork
4. **Deploy automático**

### 4. Configurar Banco de Dados (Opcional)

**Opção A: SQLite (Simples - Recomendado para testes)**
- O projeto já está configurado para usar SQLite
- Nenhuma configuração adicional necessária

**Opção B: PostgreSQL (Recomendado para produção)**
1. No dashboard do Railway, clique em "New Service"
2. Selecione "PostgreSQL"
3. O Railway criará as variáveis de ambiente automaticamente
4. A aplicação detectará e usará o PostgreSQL automaticamente

### 5. Testar a Aplicação

1. Clique na URL gerada pelo Railway (formato: `https://sistema-agendamento-xxxxx.railway.app`)
2. Você verá a interface web do sistema
3. Teste as funcionalidades principais

## 🔧 Variáveis de Ambiente

O Railway configura automaticamente:
- `PORT` - Porta da aplicação
- `DATABASE_URL` - URL do banco (se PostgreSQL for adicionado)

## 📊 Monitoramento

No dashboard do Railway você pode:
- Ver logs em tempo real
- Monitorar uso de recursos
- Configurar domínio customizado
- Ver métricas de performance

## 🔄 Atualizações Automáticas

- Cada push na branch `main` fará deploy automático
- O Railway rebuilda e redeploya automaticamente
- Tempo de deploy: 2-5 minutos

## 🐛 Solução de Problemas

### ❌ Erro: "Você precisa especificar um workspaceId"

**⚡ SOLUÇÃO RÁPIDA:**

1. **NÃO use** "Deploy from GitHub" diretamente
2. **Use este processo:**
   ```
   Railway → New Project → Empty Service → 
   Settings → Source → Connect Repo → 
   Selecione o repositório
   ```

**💡 ALTERNATIVA - URL Direta:**
```
https://railway.app/new?template=https://github.com/valdemar100/sistema-agendamento-montagem
```

**🔧 SE AINDA DER ERRO:**

1. **Fork** o repositório primeiro
2. **Edite** o README do seu fork (adicione uma linha qualquer)
3. **Commit** a mudança 
4. **Deploy** do seu fork no Railway

**📋 PASSO A PASSO DETALHADO:**
```
1. railway.app → Login
2. "New Project" 
3. "Empty Service" (NÃO escolha GitHub)
4. No painel do projeto criado:
   - Settings (lado esquerdo)
   - Source 
   - Connect Repo
   - Autorizar GitHub
   - Escolher: valdemar100/sistema-agendamento-montagem
5. Deploy automático inicia
```

### Build falha
- Verifique os logs no Railway dashboard
- Confirme que `requirements.txt` está correto
- Teste localmente com Docker

### Aplicação não inicia
- Verifique se a porta está configurada corretamente
- Confirme que o `Dockerfile` está válido
- Veja os logs de runtime

### Banco de dados não funciona
- Para SQLite: Verifique se o diretório `/app/data` existe
- Para PostgreSQL: Confirme que o serviço PostgreSQL está ativo

## 📞 URLs Importantes

- **Dashboard Railway**: https://railway.app/dashboard
- **Documentação**: https://docs.railway.app
- **Status**: https://status.railway.app

## 💡 Dicas

1. **Logs**: Use `railway logs` (CLI) ou dashboard para debug
2. **Domínio**: Configure um domínio customizado em Settings
3. **Environment**: Separe dev/prod usando diferentes projetos
4. **Backup**: PostgreSQL tem backups automáticos
5. **Scaling**: Railway escala automaticamente conforme uso

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Teste completo**: Execute todos os casos de uso
2. **Configure domínio**: Adicione domínio personalizado
3. **Monitore**: Acompanhe logs e métricas
4. **Backup**: Configure estratégia de backup se necessário
5. **CI/CD**: Considere adicionar testes automáticos

---

## 🔗 Links Úteis

- [Documentação Railway](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [GitHub Repository](https://github.com/valdemar100/sistema-agendamento-montagem)

**✅ Projeto pronto para deploy no Railway!**
