# 🧪 Guia de Testes do Sistema

## Método 1: Script Automático (Recomendado) ✅

### Passo 1: Iniciar o servidor
Abra um terminal e execute:
```powershell
python main.py
```

### Passo 2: Executar testes (em outro terminal)
```powershell
python test_sistema.py
```

O script irá testar **todos os 19 casos de uso** automaticamente e mostrar os resultados! 🎉

---

## Método 2: Testes Manuais com PowerShell

### 1. Iniciar servidor
```powershell
python main.py
```

### 2. Em outro terminal PowerShell, execute os comandos:

#### Cadastrar Cliente
```powershell
Invoke-RestMethod -Uri http://localhost:5000/cadastrar -Method Post -Body '{"nome":"Maria Santos","email":"maria@email.com","telefone":"11999999999","cpf":"12345678900","cep":"01310100"}' -ContentType "application/json"
```

#### Fazer Login
```powershell
Invoke-RestMethod -Uri http://localhost:5000/login -Method Post -Body '{"email":"maria@email.com"}' -ContentType "application/json"
```

#### Cadastrar Endereço
```powershell
Invoke-RestMethod -Uri http://localhost:5000/enderecos -Method Post -Body '{"cliente_id":1,"rua":"Av Paulista","numero":"100","bairro":"Bela Vista","cidade":"São Paulo","cep":"01310100"}' -ContentType "application/json"
```

#### Cadastrar Móvel
```powershell
Invoke-RestMethod -Uri http://localhost:5000/moveis -Method Post -Body '{"nome":"Guarda-roupa","categoria":"Dormitório","peso_aproximado":80.5,"numero_de_volumes":3}' -ContentType "application/json"
```

#### Cadastrar Serviço Adicional
```powershell
Invoke-RestMethod -Uri http://localhost:5000/servicos -Method Post -Body '{"nome":"Instalação suporte TV","valor_custo":150.00,"tempo_adicional":30}' -ContentType "application/json"
```

#### Cadastrar Montador
```powershell
Invoke-RestMethod -Uri http://localhost:5000/montadores -Method Post -Body '{"nome":"Carlos Silva","regiao":"São Paulo","especialidade":"Móveis planejados"}' -ContentType "application/json"
```

#### Solicitar Montagem (Diagrama de Sequência!)
```powershell
Invoke-RestMethod -Uri http://localhost:5000/solicitar_montagem -Method Post -Body '{"cliente_id":1,"endereco_id":1,"data_servico":"2025-11-10","horario_inicio":"14:00","itens":[{"movel_id":1,"quantidade":1,"movel_preco":1200.00}],"servicos":[1]}' -ContentType "application/json"
```

#### Visualizar Status do Agendamento
```powershell
Invoke-RestMethod -Uri http://localhost:5000/agendamentos/1/status -Method Get
```

#### Atribuir Montador
```powershell
Invoke-RestMethod -Uri http://localhost:5000/agendamentos/1/atribuir_montador -Method Post -Body '{"montador_id":1}' -ContentType "application/json"
```

#### Confirmar Disponibilidade (Montador)
```powershell
Invoke-RestMethod -Uri http://localhost:5000/montadores/1/confirmar_disponibilidade -Method Post -Body '{"agendamento_id":1}' -ContentType "application/json"
```

#### Registrar Montagem Concluída
```powershell
Invoke-RestMethod -Uri http://localhost:5000/agendamentos/1/registrar_conclusao -Method Post -Body '{"horario_fim":"18:00"}' -ContentType "application/json"
```

#### Gerar Relatórios
```powershell
Invoke-RestMethod -Uri http://localhost:5000/relatorios -Method Get
```

#### Cancelar Agendamento
```powershell
Invoke-RestMethod -Uri http://localhost:5000/agendamentos/1/cancelar -Method Post
```

---

## Método 3: Usando Postman ou Insomnia

1. Importe a URL base: `http://localhost:5000`
2. Use os endpoints listados no README.md
3. Siga a sequência dos testes acima

---

## ✅ Casos de Uso Testados

Todos os casos de uso dos diagramas:

### Cliente (4)
- ✅ Cadastrar-se
- ✅ Fazer login  
- ✅ Solicitar montagem
- ✅ Visualizar status do agendamento
- ✅ Cancelar agendamento

### Montador (4)
- ✅ Confirmar disponibilidade
- ✅ Registrar montagem concluída
- ✅ Enviar observações/fotos
- ✅ Visualizar agendamentos

### Administrador (4)
- ✅ Atribuir montador a agendamento
- ✅ Cadastrar tipos de serviço
- ✅ Gerenciar usuários
- ✅ Gerar relatórios

### Includes (3)
- ✅ Descrever móvel
- ✅ Informar endereço
- ✅ Selecionar data e horário

### Extends (2)
- ✅ Visualizar todos os agendamentos
- ✅ Escolher serviço adicional

---

## 🎯 Fluxo Completo (Diagrama de Sequência)

O teste automático simula o fluxo completo:

1. Cliente solicita montagem → ✅
2. Sistema verifica disponibilidade → ✅
3. BD retorna disponibilidade (true/false) → ✅
4. Se disponível: salva agendamento → ✅
5. Notifica montador → ✅
6. Confirma recebimento → ✅
7. Atualiza status → ✅
8. Confirma ao cliente → ✅
9. Se não disponível: informa indisponibilidade → ✅

---

## 📊 Verificação dos Dados

Após os testes, o banco de dados `agendamento.db` conterá:
- Clientes cadastrados
- Endereços
- Móveis
- Montadores
- Agendamentos (Pendente, Confirmado, Concluído, Cancelado)
- Itens de montagem
- Serviços contratados

Você pode visualizar o banco usando qualquer visualizador SQLite!
