# Sistema de Agendamento de Montagem de Móveis

Sistema completo de agendamento de montagem de móveis desenvolvido com base em diagramas UML (Casos de Uso, Classes, Sequência e Fluxo).

## 🎯 Sobre o Projeto

Sistema web para gerenciar agendamentos de montagem de móveis, permitindo que clientes solicitem montagens, montadores registrem conclusões e administradores gerem relatórios.

## 🚀 Tecnologias

- **Backend:** Python 3.13, Flask, SQLAlchemy
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados:** SQLite
- **Arquitetura:** REST API + SPA

## 📋 Funcionalidades

### Cliente
- ✅ Cadastro de usuário
- ✅ Login
- ✅ Cadastro de endereço
- ✅ Solicitação de montagem
- ✅ Visualização de agendamentos
- ✅ Cancelamento de agendamentos
- ✅ Seleção de serviços adicionais

### Montador
- ✅ Confirmação de disponibilidade
- ✅ Registro de montagem concluída
- ✅ Visualização de agendamentos

### Administrador
- ✅ Atribuição de montadores
- ✅ Cadastro de serviços adicionais
- ✅ Geração de relatórios
- ✅ Gerenciamento de usuários

## 🔧 Instalação

### Pré-requisitos
- Python 3.13 ou superior
- pip

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/sistema-agendamento-montagem.git
cd sistema-agendamento-montagem
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o sistema:
```bash
python main.py
```

4. Acesse no navegador:
```
http://localhost:5000
```

## 🧪 Testes

Execute os testes automatizados:

```bash
# Terminal 1 - Servidor
python main.py

# Terminal 2 - Testes
python test_sistema.py
```

Ou execute o teste simples:
```bash
python teste_simples.py
```

## 📁 Estrutura do Projeto

```
.
├── main.py                 # Backend Flask + API REST
├── templates/
│   └── index.html         # Interface web
├── static/
│   ├── app.js            # Lógica do frontend
│   └── styles.css        # Estilos visuais
├── test_sistema.py        # Testes automatizados completos
├── teste_simples.py       # Testes básicos
├── requirements.txt       # Dependências Python
├── agendamento.db        # Banco de dados SQLite (gerado automaticamente)
└── README.md             # Este arquivo
```

## 📊 Diagramas UML

O sistema foi desenvolvido baseado em 4 diagramas UML:

1. **Diagrama de Casos de Uso** - 19 casos de uso implementados
2. **Diagrama de Classes** - 8 classes principais
3. **Diagrama de Sequência** - Fluxo de agendamento com verificação de disponibilidade
4. **Diagrama de Fluxo** - Processo completo do sistema

## 🎨 Interface

O sistema possui uma interface web moderna e responsiva com:
- Navegação por abas (casos de uso)
- Feedback visual de sucesso/erro
- Cards informativos para agendamentos
- Badges coloridos para status
- Design responsivo (mobile, tablet, desktop)

## 📖 Documentação Adicional

- `FRONTEND.md` - Guia completo do frontend
- `COMO_TESTAR.md` - Instruções de teste
- `APRESENTACAO.md` - Roteiro de apresentação
- `TESTES.md` - Documentação de testes

## 🔄 API Endpoints

### Cliente
- `POST /cadastrar` - Cadastrar cliente
- `POST /login` - Fazer login
- `POST /enderecos` - Cadastrar endereço
- `POST /solicitar_montagem` - Solicitar montagem
- `GET /agendamentos/<id>/status` - Visualizar agendamento
- `POST /agendamentos/<id>/cancelar` - Cancelar agendamento

### Montador
- `POST /montadores/<id>/confirmar_disponibilidade` - Confirmar disponibilidade
- `POST /agendamentos/<id>/registrar_conclusao` - Registrar conclusão

### Administrador
- `POST /agendamentos/<id>/atribuir_montador` - Atribuir montador
- `POST /servicos` - Cadastrar serviço adicional
- `GET /servicos` - Listar serviços
- `GET /relatorios` - Gerar relatórios
- `GET /clientes` - Listar clientes

## 👥 Autores

Desenvolvido como projeto acadêmico de Análise de Sistemas Orientado a Objetos.

## 📝 Licença

Este projeto é de código aberto para fins educacionais.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
