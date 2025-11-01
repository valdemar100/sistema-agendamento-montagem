# 🧪 Como Testar o Sistema - Guia Simples

## 📋 Opção 1: Teste Automatizado (Mais Fácil!)

### Passo 1: Abrir 2 terminais no VS Code

**Terminal 1 - Servidor:**
```powershell
python main.py
```
Aguarde aparecer: `Running on http://127.0.0.1:5000`

**Terminal 2 - Testes:**
```powershell
python test_sistema.py
```

✅ **Pronto!** O script vai testar tudo automaticamente e mostrar os resultados!

---

## 📋 Opção 2: Teste Manual Rápido

### 1. Iniciar o servidor
```powershell
python main.py
```

### 2. Abrir outro terminal e testar cada endpoint:

#### ✅ Teste 1: Cadastrar Cliente
```powershell
curl -X POST http://localhost:5000/cadastrar -H "Content-Type: application/json" -d "{\"nome\":\"João\",\"email\":\"joao@email.com\",\"telefone\":\"11999999999\",\"cpf\":\"12345678900\",\"cep\":\"01310100\"}"
```

#### ✅ Teste 2: Login
```powershell
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d "{\"email\":\"joao@email.com\"}"
```

#### ✅ Teste 3: Cadastrar Endereço
```powershell
curl -X POST http://localhost:5000/enderecos -H "Content-Type: application/json" -d "{\"cliente_id\":1,\"rua\":\"Av Paulista\",\"numero\":\"100\",\"bairro\":\"Bela Vista\",\"cidade\":\"São Paulo\",\"cep\":\"01310100\"}"
```

#### ✅ Teste 4: Cadastrar Móvel
```powershell
curl -X POST http://localhost:5000/moveis -H "Content-Type: application/json" -d "{\"nome\":\"Guarda-roupa\",\"categoria\":\"Dormitório\",\"peso_aproximado\":80.5,\"numero_de_volumes\":3}"
```

#### ✅ Teste 5: Cadastrar Montador
```powershell
curl -X POST http://localhost:5000/montadores -H "Content-Type: application/json" -d "{\"nome\":\"Carlos\",\"regiao\":\"São Paulo\",\"especialidade\":\"Móveis\"}"
```

#### ✅ Teste 6: Solicitar Montagem (Principal!)
```powershell
curl -X POST http://localhost:5000/solicitar_montagem -H "Content-Type: application/json" -d "{\"cliente_id\":1,\"endereco_id\":1,\"data_servico\":\"2025-11-10\",\"horario_inicio\":\"14:00\",\"itens\":[{\"movel_id\":1,\"quantidade\":1,\"movel_preco\":1200.00}],\"servicos\":[]}"
```

#### ✅ Teste 7: Visualizar Agendamento
```powershell
curl http://localhost:5000/agendamentos/1/status
```

#### ✅ Teste 8: Atribuir Montador
```powershell
curl -X POST http://localhost:5000/agendamentos/1/atribuir_montador -H "Content-Type: application/json" -d "{\"montador_id\":1}"
```

#### ✅ Teste 9: Confirmar Disponibilidade
```powershell
curl -X POST http://localhost:5000/montadores/1/confirmar_disponibilidade -H "Content-Type: application/json" -d "{\"agendamento_id\":1}"
```

#### ✅ Teste 10: Registrar Conclusão
```powershell
curl -X POST http://localhost:5000/agendamentos/1/registrar_conclusao -H "Content-Type: application/json" -d "{\"horario_fim\":\"18:00\"}"
```

#### ✅ Teste 11: Gerar Relatórios
```powershell
curl http://localhost:5000/relatorios
```

#### ✅ Teste 12: Cancelar Agendamento
```powershell
curl -X POST http://localhost:5000/agendamentos/1/cancelar
```

---

## 📋 Opção 3: Usar Postman/Insomnia/Thunder Client

1. Baixe **Thunder Client** (extensão do VS Code) ou **Postman**
2. Importe os endpoints do README.md
3. Teste manualmente cada endpoint

---

## ✅ O que deve funcionar:

- ✅ Cadastro de clientes
- ✅ Login
- ✅ Cadastro de endereços
- ✅ Cadastro de móveis
- ✅ Solicitação de montagem (com verificação de disponibilidade)
- ✅ Visualização de agendamentos
- ✅ Atribuição de montadores
- ✅ Confirmação de disponibilidade
- ✅ Registro de conclusão
- ✅ Cancelamento
- ✅ Relatórios

---

## 🎯 Fluxo Completo Testado:

1. Cliente se cadastra ✅
2. Cliente faz login ✅
3. Cliente cadastra endereço ✅
4. Cliente descreve móvel ✅
5. Cliente solicita montagem ✅
6. Sistema verifica disponibilidade ✅
7. Admin atribui montador ✅
8. Montador confirma ✅
9. Montador marca como concluído ✅
10. Sistema gera relatórios ✅

---

## 📊 Ver o Banco de Dados

Depois dos testes, você pode ver os dados salvos:
- Arquivo: `agendamento.db`
- Use qualquer visualizador SQLite (ex: DB Browser for SQLite)

---

## 🔥 Dica Rápida

Para testar tudo de uma vez, apenas execute:
```powershell
# Terminal 1
python main.py

# Terminal 2 (aguarde servidor iniciar)
python test_sistema.py
```

Isso testa **todos os 19 casos de uso** automaticamente! 🚀
