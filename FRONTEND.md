# 🎨 Front-End do Sistema de Agendamento

## ✅ O que foi criado

Um **front-end web simples e intuitivo** baseado EXATAMENTE nos diagramas UML:

### 📋 Arquivos criados:
- `templates/index.html` - Interface principal
- `static/app.js` - Lógica de interação com API
- `static/styles.css` - Estilos visuais

### 🎯 Funcionalidades implementadas:

#### 👤 Cliente (Diagrama de Casos de Uso)
1. ✅ **Cadastrar-se** - Formulário de cadastro completo
2. ✅ **Fazer Login** - Login simplificado por email
3. ✅ **Cadastrar Endereço** - Formulário de endereço (include de Solicitar Montagem)
4. ✅ **Solicitar Montagem** - Implementa o DIAGRAMA DE SEQUÊNCIA completo
   - Verifica disponibilidade
   - Salva agendamento
   - Retorna confirmação ou indisponibilidade
5. ✅ **Visualizar Agendamentos** - Lista todos os agendamentos do cliente
6. ✅ **Cancelar Agendamento** - Botão direto em cada agendamento

#### 👷 Montador
7. ✅ **Registrar Montagem Concluída** - Marca como concluído com horário fim

#### ⚙️ Administrador
8. ✅ **Gerar Relatórios** - Estatísticas de agendamentos por status

---

## 🚀 Como usar

### 1️⃣ Iniciar o servidor
```powershell
python main.py
```

### 2️⃣ Abrir no navegador
```
http://localhost:5000
```

### 3️⃣ Fluxo de uso (baseado no Diagrama de Fluxo):

1. **Cadastre-se** (aba "📝 Cadastrar-se")
   - Preencha nome, email, telefone, CPF, CEP
   - Clique em "Cadastrar"

2. **Faça Login** (aba "🔐 Fazer Login")
   - Digite o email cadastrado
   - Clique em "Entrar"
   - Você será redirecionado automaticamente

3. **Cadastre um Endereço** (aba "🏠 Cadastrar Endereço")
   - Preencha rua, número, bairro, cidade, CEP
   - Clique em "Cadastrar Endereço"

4. **Solicite uma Montagem** (aba "📅 Solicitar Montagem")
   - Escolha data e horário
   - Informe valor estimado
   - Clique em "Solicitar Montagem"
   - **O sistema implementa o Diagrama de Sequência:**
     - Verifica disponibilidade
     - Se disponível → cria agendamento
     - Se ocupado → informa indisponibilidade

5. **Visualize seus Agendamentos** (aba "👀 Visualizar Agendamentos")
   - Veja lista de agendamentos
   - Status: Pendente, Confirmado, Concluído, Cancelado
   - Cancele se necessário

6. **Área do Montador** (aba "👷 Montador")
   - Registre conclusão de montagens

7. **Área do Administrador** (aba "⚙️ Administrador")
   - Gere relatórios estatísticos

---

## 🎨 Design

- **Interface moderna e responsiva**
- **Cores baseadas em gradiente roxo**
- **Cards para cada agendamento**
- **Badges de status coloridos:**
  - 🟡 Pendente
  - 🔵 Confirmado
  - 🟢 Concluído
  - 🔴 Cancelado

---

## 📊 Demonstração do Diagrama de Sequência

Ao solicitar uma montagem, você verá na tela:

✅ **Se disponível:**
```
✅ Agendamento confirmado
Agendamento ID: 1
Status: Pendente
```

❌ **Se não disponível:**
```
❌ Horário não disponível
```

Isso demonstra visualmente o fluxo do diagrama de sequência!

---

## 🔍 Validações implementadas

- ✅ Verifica se usuário está logado antes de criar agendamento
- ✅ Verifica se endereço foi cadastrado
- ✅ Verifica disponibilidade de horário (diagrama de sequência)
- ✅ Mostra mensagens de sucesso/erro claramente
- ✅ Atualiza lista de agendamentos em tempo real

---

## 📱 Responsivo

O front-end funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

---

## 🎯 Para apresentação

1. **Mostre os diagramas UML**
2. **Abra o sistema no navegador**
3. **Execute o fluxo completo:**
   - Cadastro → Login → Endereço → Solicitar Montagem → Visualizar
4. **Demonstre o Diagrama de Sequência:**
   - Solicite montagem em horário livre (sucesso)
   - Solicite montagem no mesmo horário (indisponível)
5. **Mostre os relatórios do administrador**

Isso demonstra que o sistema implementa **exatamente** o que foi modelado nos diagramas! 🎉
