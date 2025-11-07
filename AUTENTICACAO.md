# 🔐 Sistema de Autenticação

## 📋 Mudanças Implementadas

### 1. **Página de Login/Cadastro Separada**

O sistema agora possui **duas páginas distintas**:

- **`/` (raiz)** → Página de Login/Cadastro (`login.html`)
- **`/sistema`** → Sistema principal (requer login) (`index.html`)

### 2. **Tipos de Usuário**

Ao se cadastrar, o usuário deve escolher entre:

- **👤 Cliente** - Para agendar montagens
- **👷 Montador** - Para realizar montagens

### 3. **Campos Obrigatórios por Tipo**

#### **Cliente:**
- ✅ Nome Completo *
- ✅ Email *
- ✅ Telefone *
- ✅ CPF *
- ✅ CEP *

#### **Montador:**
- ✅ Nome Completo *
- ✅ Email *
- ✅ Telefone *
- Região de Atendimento (opcional)
- Especialidade (opcional)

### 4. **Fluxo de Autenticação**

```
1. Usuário acessa http://localhost:5000
   ↓
2. Página de Login/Cadastro (login.html)
   ↓
3. Usuário escolhe entre:
   - Fazer Login (se já cadastrado)
   - Cadastrar-se (novo usuário)
   ↓
4. Após login/cadastro bem-sucedido:
   - Dados salvos no localStorage
   - Redirecionamento automático para /sistema
   ↓
5. Sistema principal (index.html)
   - Verifica se usuário está logado
   - Se NÃO → redireciona para /
   - Se SIM → mostra sistema completo
```

### 5. **Armazenamento de Sessão**

Os dados do usuário são salvos no **localStorage** do navegador:

```javascript
{
  id: 123,
  nome: "João Silva",
  email: "joao@email.com",
  tipo: "cliente" // ou "montador"
}
```

### 6. **Proteção de Rotas**

O arquivo `index.html` (sistema principal) verifica automaticamente se há um usuário logado:

- ✅ **Logado** → Acesso permitido
- ❌ **Não logado** → Redireciona para `/`

### 7. **Botão de Logout**

No cabeçalho do sistema, há um botão **🚪 Sair** que:
- Remove dados do localStorage
- Redireciona para página de login

## 🗂️ Arquivos Criados/Modificados

### **Novos Arquivos:**

1. **`templates/login.html`**
   - Página de autenticação
   - Interface com abas (Login/Cadastro)
   - Seleção de tipo de usuário
   - Validação de campos obrigatórios

2. **`static/auth.js`**
   - Lógica de login e cadastro
   - Validação de formulários
   - Integração com API
   - Redirecionamento após sucesso

### **Arquivos Modificados:**

1. **`main.py`**
   - Rota `/` → página de login
   - Rota `/sistema` → sistema principal
   - Rota `/montadores/login` → login de montadores

2. **`templates/index.html`**
   - Removidas abas de Cadastro e Login
   - Adicionado header com info do usuário
   - Botão de logout

3. **`static/app.js`**
   - Verificação automática de login
   - Função de logout
   - Atualização de informações do usuário

## 🚀 Como Usar

### **1. Para Clientes:**

```
1. Acesse http://localhost:5000
2. Clique em "📝 Cadastrar-se"
3. Selecione "👤 Cliente"
4. Preencha TODOS os campos obrigatórios
5. Clique em "Cadastrar"
6. Será redirecionado automaticamente para o sistema
```

### **2. Para Montadores:**

```
1. Acesse http://localhost:5000
2. Clique em "📝 Cadastrar-se"
3. Selecione "👷 Montador"
4. Preencha Nome, Email e Telefone (obrigatórios)
5. Preencha Região e Especialidade (opcional)
6. Clique em "Cadastrar"
7. Será redirecionado automaticamente para o sistema
```

### **3. Login:**

```
1. Acesse http://localhost:5000
2. Clique em "🔐 Login"
3. Digite seu email
4. Clique em "Entrar"
5. Sistema busca automaticamente se você é Cliente ou Montador
6. Redirecionamento para o sistema
```

## 🔧 Recursos Técnicos

### **Validação de Formulários:**
- HTML5 `required` attribute
- Validação de tipo de email
- Validação de campos específicos por tipo

### **Responsividade:**
- Design adaptável para mobile
- Botões de seleção visuais
- Feedback de sucesso/erro

### **Segurança Básica:**
- Validação no front-end e back-end
- Proteção de rotas no cliente
- Mensagens de erro claras

## 📊 Endpoints da API

### **Cadastro:**
```
POST /cadastrar          → Cadastrar cliente
POST /montadores         → Cadastrar montador
```

### **Login:**
```
POST /login              → Login de cliente
POST /montadores/login   → Login de montador
```

## ✅ Checklist de Validação

- [x] Página de login separada do sistema
- [x] Seleção de tipo de usuário (Cliente/Montador)
- [x] Todos os campos obrigatórios validados
- [x] Redirecionamento automático após login
- [x] Proteção da página do sistema
- [x] Exibição de informações do usuário logado
- [x] Botão de logout funcional
- [x] Design responsivo e moderno

## 🎨 Interface

### **Página de Login:**
- Gradient roxo (tema do sistema)
- Abas para Login/Cadastro
- Botões visuais para tipo de usuário
- Campos agrupados logicamente

### **Sistema Principal:**
- Header com nome do usuário
- Tipo de usuário visível
- Botão de logout destacado
- Abas do sistema (sem Login/Cadastro)

---

**Sistema pronto para uso! 🎉**

Para testar, acesse: **http://localhost:5000**
