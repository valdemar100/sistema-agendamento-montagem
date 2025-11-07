# Sistema de Agendamento de Montagem de Móveis

Sistema completo de agendamento de montagem de móveis desenvolvido com base em diagramas UML (Casos de Uso, Classes, Sequência e Fluxo).

## 🎯 Sobre o Projeto

Sistema web para gerenciar agendamentos de montagem de móveis, permitindo que clientes solicitem montagens, montadores registrem conclusões com fotos e observações, e administradores gerem relatórios.

## ✨ Funcionalidades Principais

### Para Clientes:
- 📝 **Cadastro e Login** com email e senha
- 🏠 **Cadastro de Endereços** de serviço
- 📅 **Solicitação de Montagem** com data, horário e serviços
- 👁️ **Visualização de Agendamentos** com histórico completo
- ✏️ **Alteração de Agendamentos** (data/horário)
- ❌ **Cancelamento de Agendamentos**
- 📸 **Visualização de Fotos** e relatórios de montagem concluída

### Para Montadores:
- 🔐 **Cadastro e Login** especializado
- ✅ **Confirmação de Disponibilidade** para trabalho
- 📋 **Registro de Conclusão** de montagem
- 📸 **Upload de Fotos** do móvel montado
- 📝 **Observações** sobre a montagem (qualidade, dificuldades, etc.)
- 📤 **Envio Automático** de relatório para o cliente

## 🚀 Tecnologias

- **Backend:** Python 3.13, Flask, SQLAlchemy
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Banco de Dados:** SQLite
- **Arquitetura:** REST API + SPA

## 📋 Funcionalidades Implementadas

### Cliente
- ✅ Cadastro de usuário com senha
- ✅ Login seguro
- ✅ Cadastro de endereços de serviço
- ✅ Solicitação de montagem com data/horário
- ✅ Visualização completa de agendamentos
- ✅ Alteração de agendamentos pendentes
- ✅ Cancelamento de agendamentos
- ✅ Seleção de serviços adicionais
- ✅ **Visualização de fotos e relatórios** de montagem concluída

### Montador
- ✅ Cadastro e login especializado
- ✅ **Confirmação de disponibilidade** para trabalho
- ✅ Registro de montagem concluída
- ✅ **Upload de fotos** do móvel montado
- ✅ **Observações detalhadas** sobre a montagem
- ✅ **Envio automático** de relatório completo ao cliente
- ✅ Visualização de agendamentos atribuídos

### Administrador (preparado para implementação futura)
- 🔄 Atribuição de montadores disponíveis
- 🔄 Cadastro de serviços adicionais
- 🔄 Geração de relatórios
- 🔄 Gerenciamento de usuários

## 🔧 Instalação

### Pré-requisitos
- Python 3.13 ou superior
- pip

### Instalação Local

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

### 🚀 Deploy no Railway

Para hospedar na nuvem usando Railway:

1. **Rápido**: Clique no botão abaixo para deploy automático
   
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/python)

2. **Manual**: Siga o guia completo em [`RAILWAY_DEPLOY.md`](RAILWAY_DEPLOY.md)

O projeto já está configurado com:
- ✅ `Dockerfile` otimizado
- ✅ `railway.toml` configurado
- ✅ Variáveis de ambiente automáticas
- ✅ Suporte a PostgreSQL e SQLite

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
- `PUT /agendamentos/<id>` - Alterar agendamento
- `POST /agendamentos/<id>/cancelar` - Cancelar agendamento

### Montador
- `POST /montadores/<id>/confirmar_disponibilidade` - Confirmar disponibilidade
- `POST /agendamentos/<id>/registrar_conclusao` - **Registrar conclusão com fotos e observações**

### Administrador
- `POST /agendamentos/<id>/atribuir_montador` - Atribuir montador
- `POST /servicos` - Cadastrar serviço adicional
- `GET /servicos` - Listar serviços
- `GET /relatorios` - Gerar relatórios
- `GET /clientes` - Listar clientes

## 📸 Sistema de Fotos e Relatórios

### Upload de Fotos
- **Formatos aceitos:** JPG, PNG, WebP, GIF
- **Tamanho máximo:** 16MB por arquivo
- **Múltiplos arquivos:** Suporte a várias fotos por montagem
- **Armazenamento:** Pasta `static/uploads/` (não commitada no Git por privacidade)

### Relatório de Conclusão
- **Observações:** Campo de texto livre para detalhes da montagem
- **Fotos:** Galeria visual com zoom e visualização em tela cheia
- **Exibição:** Integrada na visualização de agendamentos do cliente
- **Design:** Interface elegante com destaque visual

### Fluxo Completo
1. **Montador:** Marca montagem como concluída
2. **Upload:** Adiciona fotos e observações
3. **Processamento:** Sistema salva arquivos e dados
4. **Cliente:** Visualiza automaticamente o relatório completo

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
