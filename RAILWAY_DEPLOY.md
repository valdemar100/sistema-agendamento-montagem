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

### 1. Fazer Push do Código

```bash
git add .
git commit -m "Configuração para deploy no Railway"
git push origin main
```

### 2. Conectar ao Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha este repositório: `valdemar100/sistema-agendamento-montagem`

### 3. Configurar o Projeto

1. O Railway detectará automaticamente o `Dockerfile`
2. O build começará automaticamente
3. Aguarde a conclusão (2-5 minutos)

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

**Solução 1 - Deploy Manual (Recomendado):**
1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Empty Project" (ao invés de "Deploy from GitHub")
4. No projeto criado, vá em "Settings" → "Connect Repo"
5. Conecte ao repositório `valdemar100/sistema-agendamento-montagem`
6. O deploy começará automaticamente

**Solução 2 - Usar Railway CLI:**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

**Solução 3 - Fork do repositório:**
1. Faça fork do repositório no GitHub
2. No Railway, conecte ao seu fork
3. Deploy normalmente

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
