# Sistema de Agendamento de Montagem de Móveis

Sistema implementado **EXATAMENTE** de acordo com os diagramas fornecidos.

## 🎨 **NOVIDADE: Front-End Implementado!**

Agora o sistema possui uma **interface web visual** baseada nos diagramas!

### 🚀 Acesso Rápido:
1. Execute: `python main.py`
2. Abra: **http://localhost:5000**
3. Use a interface visual para interagir com todos os casos de uso!

📖 **Guia completo:** Veja `FRONTEND.md`

---

## Diagramas Implementados

### 1. Diagrama de Classes ✅
Todas as classes com seus atributos e métodos:
- **Cliente**: ID, Nome, Email, Telefone, CPF, CEP + `solicitarAgendamento()`, `cancelarAgendamento()`
- **EnderecoServico**: ID_Endereco, ID_Cliente, Rua, Numero, Bairro, Cidade, Complemento, Tipo_Local, CEP
- **Montador**: ID_Montador, Nome, Regiao_Atendimento, Especialidade + `aceitarAgendamento()`, `marcarConcluido()`, `estaDisponivel()`
- **Agendamento**: ID, Cliente, Endereco, Montador, Origem_Venda, Valor_Total, Data, Horarios, Status + `criarAgendamento()`, `cancelarAgendamento()`, `atribuirMontador()`, `calcularValorTotal()`
- **Movel**: ID, Nome, Categoria, Peso, Numero_de_Volumes
- **ServicoAdicional**: ID, Nome, Valor_Custo, Tempo_Adicional
- **ItemMontagem**: ID_Agendamento, ID_Movel, Quantidade
- **ServicoContratado**: ID_Agendamento, ID_Servico, Valor_Cobrado

### 2. Diagrama de Casos de Uso ✅
Todos os casos de uso implementados:

**Cliente:**
- Visualizar status do agendamento
- Cancelar agendamento
- Cadastrar-se
- Solicitar montagem (include: Descrever móvel, Informar endereço, Selecionar data e horário)

**Sistema de Loja:**
- Fazer login
- Solicitar montagem

**Montador:**
- Registrar montagem concluída (extend: Visualizar agendamentos)
- Enviar observações/fotos
- Confirmar disponibilidade
- Visualizar agendamentos

**Administrador:**
- Atribuir montador a agendamento
- Gerar relatórios (extend: Visualizar agendamentos, Visualizar todos os agendamentos)
- Cadastrar tipos de serviço
- Gerenciar usuários

### 3. Diagrama de Sequência ✅
Fluxo "Agendar Montagem" implementado conforme sequência:
1. Cliente → Sistema: `solicitarMontagem(descricaoMovel, endereco, dataHorario)`
2. Sistema → Controlador: `verificarDisponibilidade(dataHorario)`
3. Controlador → BD: `consultarDisponibilidade(dataHorario)`
4. BD → Controlador: `disponibilidade(true/false)`
5. **[alt disponível]:**
   - Controlador → BD: `salvarAgendamento(dadosSolicitacao, clienteId)`
   - BD → Controlador: `agendamentoCriado(agendamentoId, status="Pendente")`
   - Controlador → Montador: `notificarNovoAgendamento(agendamentoId, endereco, dataHorario)`
   - Montador → Controlador: `confirmarRecebimento()`
   - Controlador → BD: `atualizarStatus(agendamentoId, "Confirmado pelo Montador")`
   - Controlador → Sistema: `agendamentoRegistrado(agendamentoId, dataHorario, status)`
   - Sistema → Cliente: `confirmarAgendamento(agendamentoId, dataHorario, status)`
6. **[não disponível]:**
   - Controlador → Sistema: `indisponivel(mensagemSugestao)`
   - Sistema → Cliente: `informarIndisponibilidade(mensagemSugestao)`

### 4. Diagrama de Fluxo ✅
Fluxo implementado:
1. Cadastrar-se
2. Fazer login
3. Possui Endereço Cadastrado? (Sim/Não → Cadastrar endereço)
4. Confirmar agendamento → Escolher serviço adicional
5. Montagem Concluída? (Sim/Não → Montador realiza Montagem)
6. Registrar Montagem concluída

## Instalação

```bash
pip install -r requirements.txt
```

## Execução

### 🎨 Com Front-End (Recomendado para apresentação):
```bash
python main.py
```
Depois abra no navegador: **http://localhost:5000**

### 🧪 Testes Automáticos (Terminal):
Terminal 1:
```bash
python main.py
```

Terminal 2:
```bash
python test_sistema.py
```

## Estrutura do Projeto

```
aps_analisedesistemasorientado/
├── main.py                 # Backend + API REST
├── templates/
│   └── index.html         # Front-end web
├── static/
│   ├── app.js            # Lógica do front-end
│   └── styles.css        # Estilos visuais
├── test_sistema.py        # Testes automatizados (19 casos de uso)
├── teste_simples.py       # Testes básicos
├── agendamento.db        # Banco de dados SQLite
├── README.md             # Este arquivo
├── FRONTEND.md           # Guia do front-end
├── COMO_TESTAR.md        # Guia de testes
└── requirements.txt      # Dependências
```

## API Endpoints

### Cliente
- `POST /cadastrar` - Cadastrar-se
- `POST /login` - Fazer login
- `POST /enderecos` - Cadastrar endereço
- `POST /moveis` - Descrever móvel
- `GET /enderecos/<id>` - Informar endereço
- `POST /solicitar_montagem` - Solicitar montagem
- `GET /agendamentos/<id>/status` - Visualizar status do agendamento
- `POST /agendamentos/<id>/cancelar` - Cancelar agendamento

### Montador
- `POST /montadores` - Cadastrar montador
- `GET /montadores/<id>` - Obter montador
- `POST /montadores/<id>/confirmar_disponibilidade` - Confirmar disponibilidade
- `POST /agendamentos/<id>/registrar_conclusao` - Registrar montagem concluída
- `POST /agendamentos/<id>/observacoes` - Enviar observações/fotos
- `GET /agendamentos` - Visualizar agendamentos

### Administrador
- `POST /agendamentos/<id>/atribuir_montador` - Atribuir montador
- `POST /servicos` - Cadastrar tipos de serviço
- `GET /clientes` - Gerenciar usuários
- `GET /relatorios` - Gerar relatórios
- `GET /todos_agendamentos` - Visualizar todos os agendamentos

## Banco de Dados

SQLite (`agendamento.db`) - criado automaticamente na primeira execução.

## Observações

- Sistema implementado **sem adições** além do que consta nos diagramas
- Apenas funcionalidades essenciais para o funcionamento básico
- Sem autenticação complexa (fora do escopo dos diagramas)
- Sem interface gráfica (apenas API REST)
