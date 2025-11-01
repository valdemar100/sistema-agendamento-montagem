# 🎯 Roteiro de Apresentação do Sistema

## 📋 Estrutura da Apresentação (15-20 minutos)

### 1️⃣ **Introdução** (2 minutos)

**Apresente:**
- Nome do projeto: "Sistema de Agendamento de Montagem de Móveis"
- Objetivo: Implementar fielmente os diagramas UML
- Tecnologias: Python, Flask, SQLite, HTML/CSS/JavaScript

**Diga:**
> "Este sistema foi desenvolvido com base em 4 diagramas UML: Casos de Uso, Classes, Sequência e Fluxo. Implementamos EXATAMENTE o que foi modelado, nada mais, nada menos."

---

### 2️⃣ **Mostrar os Diagramas** (3 minutos)

**Apresente cada diagrama:**

1. **Diagrama de Casos de Uso**
   - 3 atores: Cliente, Montador, Administrador
   - 19 casos de uso implementados
   - Relacionamentos: include e extend

2. **Diagrama de Classes**
   - 8 classes principais
   - Atributos e métodos
   - Relacionamentos (composição, agregação)

3. **Diagrama de Sequência**
   - Fluxo: Agendar Montagem
   - Verificação de disponibilidade
   - Alternativas: disponível/indisponível

4. **Diagrama de Fluxo**
   - Processo completo: Cadastro → Agendamento → Conclusão

---

### 3️⃣ **Demonstração do Front-End** (8 minutos)

**Abra o navegador:** http://localhost:5000

#### 🎬 **Cenário 1: Fluxo Completo do Cliente**

1. **Cadastrar-se** (aba 📝)
   ```
   Nome: Maria Silva
   Email: maria@email.com
   Telefone: 11999999999
   CPF: 12345678900
   CEP: 01310100
   ```
   ✅ Mostre a mensagem de sucesso

2. **Fazer Login** (aba 🔐)
   ```
   Email: maria@email.com
   ```
   ✅ Mostre que o sistema reconhece o usuário

3. **Cadastrar Endereço** (aba 🏠)
   ```
   Rua: Av Paulista
   Número: 1000
   Bairro: Bela Vista
   Cidade: São Paulo
   CEP: 01310100
   ```
   ✅ Endereço cadastrado

4. **Solicitar Montagem** (aba 📅)
   ```
   Data: [escolha uma data futura]
   Horário: 14:00
   Valor: 1500.00
   ```
   ✅ **Destaque:** "Aqui o sistema executa o Diagrama de Sequência!"
   - Verifica disponibilidade
   - Cria agendamento
   - Status: Pendente

5. **Visualizar Agendamentos** (aba 👀)
   ✅ Mostre o agendamento criado com todas as informações

#### 🎬 **Cenário 2: Teste de Indisponibilidade**

1. Vá para **Solicitar Montagem** novamente
2. Use a **MESMA data e horário**
   ```
   Data: [mesma data anterior]
   Horário: 14:00
   ```
3. ❌ **Mostre:** "Horário não disponível"
   
**Diga:**
> "Veja! O sistema implementou corretamente o diagrama de sequência. Quando o horário está ocupado, ele retorna indisponibilidade, exatamente como modelado!"

#### 🎬 **Cenário 3: Área do Montador**

1. Vá para aba **👷 Montador**
2. Registre conclusão:
   ```
   ID Agendamento: 1
   Horário Fim: 18:00
   ```
3. ✅ Status muda para "Concluído"

#### 🎬 **Cenário 4: Relatórios do Administrador**

1. Vá para aba **⚙️ Administrador**
2. Clique em "Gerar Relatórios"
3. ✅ Mostre estatísticas:
   - Concluído: 1
   - Pendente: X
   - etc.

---

### 4️⃣ **Demonstração dos Testes Automatizados** (3 minutos)

**Em outro terminal, execute:**
```bash
python test_sistema.py
```

**Mostre:**
- ✅ 19 casos de uso testados
- ✅ Diagrama de sequência validado
- ✅ Todos os testes passando
- ✅ Relatório completo

**Diga:**
> "Criamos testes automatizados para validar TODOS os 19 casos de uso dos diagramas. Cada funcionalidade foi testada e está funcionando conforme especificado."

---

### 5️⃣ **Mostrar o Código** (2 minutos)

**Abra o VS Code e mostre:**

1. **main.py** - Backend
   - "Aqui estão as 8 classes do diagrama de classes"
   - "Cada método implementado conforme o diagrama"

2. **templates/index.html** - Front-end
   - "Interface organizada por casos de uso"
   - "Cada aba representa um ou mais casos de uso"

3. **test_sistema.py** - Testes
   - "19 fases de teste, uma para cada caso de uso"

---

### 6️⃣ **Conclusão** (2 minutos)

**Recapitule:**

✅ **O que foi implementado:**
- 4 diagramas UML completamente implementados
- 8 classes com todos os atributos e métodos
- 19 casos de uso funcionais
- Diagrama de sequência com verificação de disponibilidade
- Front-end visual para demonstração
- Testes automatizados completos

✅ **Diferenciais:**
- Implementação fiel aos diagramas
- Código limpo e documentado
- Interface visual para apresentação
- Testes automatizados comprovando funcionamento

**Diga:**
> "O sistema está completo e funcional, implementando fielmente todos os diagramas UML. Qualquer funcionalidade que você vê nos diagramas está implementada e pode ser testada, tanto pela interface visual quanto pelos testes automatizados."

---

## 📊 Checklist Antes da Apresentação

- [ ] Servidor rodando: `python main.py`
- [ ] Navegador aberto em: http://localhost:5000
- [ ] Diagramas UML impressos ou em slides
- [ ] Terminal preparado para testes
- [ ] VS Code aberto com o código
- [ ] Banco de dados limpo (delete `agendamento.db` se quiser começar do zero)

---

## 🎤 Possíveis Perguntas e Respostas

**P: Por que não tem autenticação com senha?**
> R: Os diagramas especificam apenas login por email. Implementamos exatamente o que foi modelado. Em produção, adicionaríamos senha e criptografia.

**P: O sistema está completo?**
> R: Sim, 100% dos casos de uso dos diagramas estão implementados. Temos 19 casos de uso, todos funcionais e testados.

**P: Como você garante que está de acordo com os diagramas?**
> R: Criamos testes automatizados que validam cada caso de uso. Além disso, cada classe tem exatamente os atributos e métodos especificados no diagrama de classes.

**P: Front-end é necessário?**
> R: Não para o MVP, mas criamos para facilitar a demonstração e validação visual de que o sistema funciona conforme modelado.

---

## 💡 Dicas Finais

1. **Seja confiante** - O sistema está completo e funcional
2. **Mostre os diagramas ANTES** do código - para que vejam que você seguiu fielmente
3. **Destaque o diagrama de sequência** - é o mais complexo e está perfeitamente implementado
4. **Use a interface visual** - é muito mais impactante que mostrar apenas API
5. **Execute os testes** - prova que tudo funciona

---

**Boa sorte na apresentação! 🚀**
