# 🚀 Guia para Subir o Projeto no GitHub

## Passo 1: Inicializar Git Local

Abra o PowerShell na pasta do projeto e execute:

```powershell
# Inicializa o repositório git
git init

# Adiciona todos os arquivos
git add .

# Faz o primeiro commit
git commit -m "Initial commit: Sistema de Agendamento de Montagem de Móveis"
```

## Passo 2: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `sistema-agendamento-montagem`
3. Descrição: `Sistema de agendamento de montagem de móveis - Projeto acadêmico`
4. Escolha: **Public** (para compartilhar) ou **Private** (privado)
5. **NÃO** marque "Initialize with README" (já temos)
6. Clique em "Create repository"

## Passo 3: Conectar Local ao GitHub

Copie os comandos que o GitHub mostra, ou use estes (substitua SEU_USUARIO):

```powershell
# Adiciona o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/sistema-agendamento-montagem.git

# Renomeia branch para main (padrão do GitHub)
git branch -M main

# Envia para o GitHub
git push -u origin main
```

## Passo 4: Adicionar Descrição e Tags (Opcional)

No GitHub, na página do repositório:

1. Clique em "⚙️ Settings"
2. Adicione:
   - **Description:** Sistema de agendamento de montagem de móveis com Flask
   - **Website:** (deixe vazio ou coloque um link de demo)
   - **Topics:** `python` `flask` `sqlite` `uml` `rest-api` `academic-project`

## 🎯 Comandos Completos (Copie e Cole)

Se quiser fazer tudo de uma vez (substitua SEU_USUARIO):

```powershell
# Inicializar repositório
git init
git add .
git commit -m "Initial commit: Sistema de Agendamento de Montagem de Móveis"

# Conectar ao GitHub
git remote add origin https://github.com/SEU_USUARIO/sistema-agendamento-montagem.git
git branch -M main
git push -u origin main
```

## 📝 Atualizações Futuras

Quando fizer alterações:

```powershell
# Adiciona arquivos modificados
git add .

# Faz commit com mensagem
git commit -m "Descrição da alteração"

# Envia para o GitHub
git push
```

## 🔧 Resolver Problema de Autenticação

Se pedir usuário/senha:

1. No GitHub, vá em: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clique em "Generate new token (classic)"
3. Dê um nome: "Sistema Agendamento"
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (não poderá ver novamente!)
7. Use o token como senha quando o git pedir

Ou use GitHub Desktop (mais fácil):
- Baixe: https://desktop.github.com/
- Faça login
- Adicione o repositório local

## ✅ Verificar se Funcionou

Após executar os comandos, acesse:
```
https://github.com/SEU_USUARIO/sistema-agendamento-montagem
```

Você deverá ver todos os arquivos do projeto!

## 📦 O que será enviado:

✅ Código-fonte completo
✅ Interface web
✅ Testes automatizados
✅ Documentação
✅ README.md
❌ Banco de dados (*.db está no .gitignore)
❌ __pycache__ e arquivos temporários

## 🎉 Pronto!

Seu projeto estará no GitHub e você poderá:
- Compartilhar o link
- Mostrar no portfólio
- Colaborar com outros
- Fazer backup na nuvem

---

**Dica:** Adicione um arquivo LICENSE se quiser definir como outros podem usar seu código!
