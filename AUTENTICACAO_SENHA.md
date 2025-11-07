# 🔒 Sistema de Autenticação com Senha

## 📋 Atualização Implementada

### ✅ **Senha Adicionada ao Sistema**

Agora o sistema possui autenticação completa com **email e senha** para ambos os tipos de usuário.

---

## 🔑 Mudanças no Banco de Dados

### **Tabela Cliente:**
```sql
- ID_Cliente (Integer, PK)
- Nome (String)
- Email (String, Unique) 
- Senha (String) ← NOVO
- Telefone (String)
- CPF (String)
- CEP (String)
```

### **Tabela Montador:**
```sql
- ID_Montador (Integer, PK)
- Nome (String)
- Email (String, Unique) ← NOVO
- Senha (String) ← NOVO
- Regiao_Atendimento (String)
- Especialidade (String)
```

---

## 🆕 Novos Campos Obrigatórios

### **Cadastro de Cliente:**
- ✅ Nome Completo
- ✅ Email (único no sistema)
- ✅ **Senha** (mínimo 6 caracteres)
- ✅ Telefone
- ✅ CPF
- ✅ CEP

### **Cadastro de Montador:**
- ✅ Nome Completo
- ✅ Email (único no sistema)
- ✅ **Senha** (mínimo 6 caracteres)
- ✅ Telefone
- Região de Atendimento (opcional)
- Especialidade (opcional)

### **Login (Cliente e Montador):**
- ✅ Email
- ✅ **Senha**

---

## 🔄 Fluxo de Autenticação

### **1. Cadastro:**
```
Usuário preenche:
- Tipo (Cliente ou Montador)
- Nome, Email, Senha (mín. 6 chars), Telefone
- Campos específicos do tipo
  ↓
Sistema valida:
- Email único (não pode estar cadastrado)
- Senha com mínimo 6 caracteres
- Campos obrigatórios preenchidos
  ↓
Cadastro no banco de dados
  ↓
Redirecionamento automático para /sistema
```

### **2. Login:**
```
Usuário digita:
- Email
- Senha
  ↓
Sistema busca:
1. Primeiro tenta encontrar como Cliente
2. Se não encontrar, tenta como Montador
  ↓
Valida senha:
- Se senha correta → Login OK
- Se senha incorreta → Erro 401
- Se usuário não existe → Erro 404
  ↓
Salva sessão no localStorage
  ↓
Redireciona para /sistema
```

---

## 🛡️ Segurança Implementada

### **Validações:**

1. **Email único**
   - Não pode existir email duplicado
   - Verifica em Cliente E Montador

2. **Senha obrigatória**
   - Mínimo 6 caracteres
   - Campo tipo `password` (oculta caracteres)
   - Validação no front-end e back-end

3. **Mensagens de erro específicas:**
   - ❌ "Senha incorreta" (HTTP 401)
   - ❌ "Usuário não encontrado" (HTTP 404)
   - ❌ "Email já cadastrado" (HTTP 400)
   - ❌ "Email e senha são obrigatórios" (HTTP 400)

4. **Proteção de rotas**
   - `/sistema` requer login
   - Verifica localStorage antes de acessar

---

## 📝 API Atualizada

### **Cliente:**

**POST /cadastrar**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "cpf": "12345678900",
  "cep": "01310100"
}
```

**POST /login**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### **Montador:**

**POST /montadores**
```json
{
  "nome": "Carlos Montador",
  "email": "carlos@email.com",
  "senha": "123456",
  "telefone": "11988888888",
  "regiao": "Zona Sul",
  "especialidade": "Móveis planejados"
}
```

**POST /montadores/login**
```json
{
  "email": "carlos@email.com",
  "senha": "123456"
}
```

---

## ⚠️ **IMPORTANTE: Banco de Dados Limpo**

**Todos os dados anteriores foram deletados!**

O banco de dados foi completamente apagado e recriado com as novas colunas de senha e email (para montadores).

✅ **Nenhum dado antigo existe mais**
✅ **Todos os usuários devem se cadastrar novamente**
✅ **Novo banco com estrutura atualizada**

---

## 🧪 Como Testar

### **1. Cadastrar Cliente:**
```
1. Acesse: http://localhost:5000
2. Clique em "📝 Cadastrar-se"
3. Selecione "👤 Cliente"
4. Preencha:
   - Nome: Teste Cliente
   - Email: cliente@teste.com
   - Senha: 123456
   - Telefone: 11999999999
   - CPF: 12345678900
   - CEP: 01310100
5. Clique em "Cadastrar"
6. Será redirecionado para o sistema
```

### **2. Cadastrar Montador:**
```
1. Acesse: http://localhost:5000
2. Clique em "📝 Cadastrar-se"
3. Selecione "👷 Montador"
4. Preencha:
   - Nome: Teste Montador
   - Email: montador@teste.com
   - Senha: 123456
   - Telefone: 11988888888
   - Região: Zona Sul (opcional)
   - Especialidade: Geral (opcional)
5. Clique em "Cadastrar"
6. Será redirecionado para o sistema
```

### **3. Fazer Login:**
```
1. Acesse: http://localhost:5000
2. Clique em "🔐 Login"
3. Digite:
   - Email: cliente@teste.com (ou montador@teste.com)
   - Senha: 123456
4. Clique em "Entrar"
5. Sistema identifica automaticamente se é Cliente ou Montador
6. Redireciona para o sistema
```

### **4. Testar Erros:**

**Email duplicado:**
```
- Cadastre um usuário
- Tente cadastrar novamente com mesmo email
- Resultado: ❌ "Email já cadastrado"
```

**Senha incorreta:**
```
- Cadastre um usuário
- Tente fazer login com senha errada
- Resultado: ❌ "Senha incorreta"
```

**Usuário não existe:**
```
- Tente fazer login com email não cadastrado
- Resultado: ❌ "Usuário não encontrado"
```

**Senha muito curta:**
```
- Tente cadastrar com senha de 5 caracteres
- Resultado: ❌ "A senha deve ter no mínimo 6 caracteres"
```

---

## 📂 Arquivos Modificados

### **Backend (main.py):**
- ✅ Adicionado campo `senha` em `Cliente`
- ✅ Adicionado campos `email` e `senha` em `Montador`
- ✅ Atualizado `/cadastrar` - valida senha
- ✅ Atualizado `/login` - valida email + senha
- ✅ Atualizado `/montadores` - requer email + senha
- ✅ Atualizado `/montadores/login` - valida email + senha

### **Frontend (login.html):**
- ✅ Adicionado campo de senha no formulário de login
- ✅ Adicionado campo de senha no formulário de cadastro
- ✅ Campo tipo `password` (oculta caracteres)
- ✅ Atributo `minlength="6"` para validação

### **JavaScript (auth.js):**
- ✅ Envia senha no cadastro
- ✅ Envia senha no login
- ✅ Valida tamanho mínimo da senha (6 caracteres)
- ✅ Trata erros 401 (senha incorreta) e 404 (não encontrado)

---

## ✅ Checklist Final

- [x] Campo senha adicionado ao modelo Cliente
- [x] Campos email e senha adicionados ao modelo Montador
- [x] Email único para Cliente
- [x] Email único para Montador
- [x] Validação de senha no cadastro (min 6 chars)
- [x] Validação de senha no login
- [x] Mensagens de erro específicas
- [x] Banco de dados limpo e recriado
- [x] Interface atualizada com campo senha
- [x] Tipo `password` nos inputs
- [x] Testes de cadastro funcionando
- [x] Testes de login funcionando
- [x] Detecção automática de tipo (Cliente/Montador)

---

## 🎉 Sistema Pronto!

**O sistema agora possui autenticação completa e segura!**

🔐 Email + Senha obrigatórios
🆔 Emails únicos no sistema
👤 Identificação automática de tipo
🛡️ Validações robustas
🗄️ Banco de dados limpo

**Teste agora em:** http://localhost:5000
