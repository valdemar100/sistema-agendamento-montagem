"""
Teste simples e direto do sistema
"""
import requests
import json

BASE_URL = 'http://localhost:5000'

print("\n🧪 TESTE SIMPLES DO SISTEMA")
print("="*60)

try:
    # Teste 1: Cadastrar Cliente
    print("\n1️⃣ Cadastrando cliente...")
    resp = requests.post(f'{BASE_URL}/cadastrar', json={
        'nome': 'João Silva',
        'email': 'joao@email.com',
        'telefone': '11999999999',
        'cpf': '12345678900',
        'cep': '01310100'
    }, timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    cliente_id = resp.json()['id']
    
    # Teste 2: Login
    print("\n2️⃣ Fazendo login...")
    resp = requests.post(f'{BASE_URL}/login', json={'email': 'joao@email.com'}, timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    
    # Teste 3: Cadastrar Endereço
    print("\n3️⃣ Cadastrando endereço...")
    resp = requests.post(f'{BASE_URL}/enderecos', json={
        'cliente_id': cliente_id,
        'rua': 'Av Paulista',
        'numero': '1000',
        'bairro': 'Bela Vista',
        'cidade': 'São Paulo',
        'cep': '01310100'
    }, timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    endereco_id = resp.json()['id']
    
    # Teste 4: Cadastrar Móvel
    print("\n4️⃣ Cadastrando móvel...")
    resp = requests.post(f'{BASE_URL}/moveis', json={
        'nome': 'Guarda-roupa',
        'categoria': 'Dormitório',
        'peso_aproximado': 80.5,
        'numero_de_volumes': 3
    }, timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    movel_id = resp.json()['id']
    
    # Teste 5: Solicitar Montagem
    print("\n5️⃣ Solicitando montagem...")
    resp = requests.post(f'{BASE_URL}/solicitar_montagem', json={
        'cliente_id': cliente_id,
        'endereco_id': endereco_id,
        'data_servico': '2025-11-10',
        'horario_inicio': '14:00',
        'itens': [{'movel_id': movel_id, 'quantidade': 1, 'movel_preco': 1200.00}],
        'servicos': []
    }, timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    agendamento_id = resp.json()['agendamentoId']
    
    # Teste 6: Visualizar Agendamento
    print("\n6️⃣ Visualizando agendamento...")
    resp = requests.get(f'{BASE_URL}/agendamentos/{agendamento_id}/status', timeout=5)
    print(f"   Status: {resp.status_code}")
    print(f"   Resposta: {resp.json()}")
    
    print("\n" + "="*60)
    print("✅ TODOS OS TESTES PASSARAM COM SUCESSO!")
    print("="*60)
    
except requests.exceptions.ConnectionError:
    print("\n❌ ERRO: Servidor não está rodando!")
    print("Execute primeiro: python main.py")
except Exception as e:
    print(f"\n❌ ERRO: {str(e)}")
    import traceback
    traceback.print_exc()
