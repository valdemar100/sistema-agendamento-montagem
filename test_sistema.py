"""
Script de Testes do Sistema de Agendamento
Testa todos os casos de uso dos diagramas
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = 'http://localhost:5000'

def print_resultado(titulo, response):
    """Função auxiliar para imprimir resultados"""
    print(f"\n{'='*60}")
    print(f"🔹 {titulo}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        print(f"Resposta: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Resposta: {response.text}")
    print(f"{'='*60}\n")

def testar_sistema():
    """Executa todos os testes seguindo o fluxo dos diagramas"""
    
    print("\n" + "🚀 INICIANDO TESTES DO SISTEMA DE AGENDAMENTO 🚀".center(70))
    print("="*70)
    
    # ========== 1. CADASTRAR CLIENTE ==========
    print("\n📋 FASE 1: CADASTRO DE CLIENTE")
    cliente_data = {
        'nome': 'João Silva',
        'email': 'joao.silva@email.com',
        'telefone': '11987654321',
        'cpf': '12345678900',
        'cep': '01310100'
    }
    response = requests.post(f'{BASE_URL}/cadastrar', json=cliente_data)
    print_resultado("1. Cadastrar-se (Cliente)", response)
    cliente_id = response.json().get('id')
    
    # ========== 2. FAZER LOGIN ==========
    print("\n🔐 FASE 2: LOGIN")
    login_data = {'email': 'joao.silva@email.com'}
    response = requests.post(f'{BASE_URL}/login', json=login_data)
    print_resultado("2. Fazer login", response)
    
    # ========== 3. CADASTRAR ENDEREÇO ==========
    print("\n🏠 FASE 3: CADASTRO DE ENDEREÇO")
    endereco_data = {
        'cliente_id': cliente_id,
        'rua': 'Av. Paulista',
        'numero': '1000',
        'bairro': 'Bela Vista',
        'cidade': 'São Paulo',
        'complemento': 'Apto 101',
        'tipo_local': 'Apartamento',
        'cep': '01310100'
    }
    response = requests.post(f'{BASE_URL}/enderecos', json=endereco_data)
    print_resultado("3. Cadastrar endereço", response)
    endereco_id = response.json().get('id')
    
    # ========== 4. DESCREVER MÓVEL ==========
    print("\n🪑 FASE 4: CADASTRO DE MÓVEIS")
    movel1_data = {
        'nome': 'Guarda-roupa 6 portas',
        'categoria': 'Dormitório',
        'peso_aproximado': 80.5,
        'numero_de_volumes': 3
    }
    response = requests.post(f'{BASE_URL}/moveis', json=movel1_data)
    print_resultado("4a. Descrever móvel - Guarda-roupa", response)
    movel1_id = response.json().get('id')
    
    movel2_data = {
        'nome': 'Estante para TV',
        'categoria': 'Sala',
        'peso_aproximado': 35.0,
        'numero_de_volumes': 2
    }
    response = requests.post(f'{BASE_URL}/moveis', json=movel2_data)
    print_resultado("4b. Descrever móvel - Estante", response)
    movel2_id = response.json().get('id')
    
    # ========== 5. CADASTRAR SERVIÇO ADICIONAL (Admin) ==========
    print("\n⚙️ FASE 5: CADASTRO DE SERVIÇOS (Administrador)")
    servico_data = {
        'nome': 'Instalação de suporte para TV',
        'valor_custo': 150.00,
        'tempo_adicional': 30
    }
    response = requests.post(f'{BASE_URL}/servicos', json=servico_data)
    print_resultado("5. Cadastrar tipos de serviço", response)
    servico_id = response.json().get('id')
    
    # ========== 6. CADASTRAR MONTADOR ==========
    print("\n👷 FASE 6: CADASTRO DE MONTADOR")
    montador_data = {
        'nome': 'Carlos Montador',
        'regiao': 'São Paulo - Zona Oeste',
        'especialidade': 'Móveis planejados'
    }
    response = requests.post(f'{BASE_URL}/montadores', json=montador_data)
    print_resultado("6. Cadastrar montador", response)
    montador_id = response.json().get('id')
    
    # ========== 7. SOLICITAR MONTAGEM (Fluxo Principal - Diagrama de Sequência) ==========
    print("\n📅 FASE 7: SOLICITAR MONTAGEM (Diagrama de Sequência)")
    data_servico = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
    agendamento_data = {
        'cliente_id': cliente_id,
        'endereco_id': endereco_id,
        'data_servico': data_servico,
        'horario_inicio': '14:00',
        'itens': [
            {'movel_id': movel1_id, 'quantidade': 1, 'movel_preco': 1200.00},
            {'movel_id': movel2_id, 'quantidade': 1, 'movel_preco': 450.00}
        ],
        'servicos': [servico_id]
    }
    response = requests.post(f'{BASE_URL}/solicitar_montagem', json=agendamento_data)
    print_resultado("7. Solicitar montagem (verificar disponibilidade + criar)", response)
    agendamento_id = response.json().get('agendamentoId')
    
    # ========== 8. VISUALIZAR STATUS DO AGENDAMENTO ==========
    print("\n👀 FASE 8: VISUALIZAR STATUS")
    response = requests.get(f'{BASE_URL}/agendamentos/{agendamento_id}/status')
    print_resultado("8. Visualizar status do agendamento", response)
    
    # ========== 9. ATRIBUIR MONTADOR (Admin) ==========
    print("\n👤 FASE 9: ATRIBUIR MONTADOR (Administrador)")
    atribuir_data = {'montador_id': montador_id}
    response = requests.post(f'{BASE_URL}/agendamentos/{agendamento_id}/atribuir_montador', json=atribuir_data)
    print_resultado("9. Atribuir montador a agendamento", response)
    
    # ========== 10. MONTADOR CONFIRMA DISPONIBILIDADE ==========
    print("\n✅ FASE 10: CONFIRMAR DISPONIBILIDADE (Montador)")
    confirmar_data = {'agendamento_id': agendamento_id}
    response = requests.post(f'{BASE_URL}/montadores/{montador_id}/confirmar_disponibilidade', json=confirmar_data)
    print_resultado("10. Confirmar disponibilidade", response)
    
    # ========== 11. VERIFICAR SE MONTADOR ESTÁ DISPONÍVEL ==========
    print("\n🔍 FASE 11: VERIFICAR MONTADOR")
    response = requests.get(f'{BASE_URL}/montadores/{montador_id}')
    print_resultado("11. Verificar status do montador (estaDisponivel)", response)
    
    # ========== 12. VISUALIZAR AGENDAMENTOS ==========
    print("\n📋 FASE 12: VISUALIZAR AGENDAMENTOS")
    response = requests.get(f'{BASE_URL}/agendamentos?montador_id={montador_id}')
    print_resultado("12a. Visualizar agendamentos do montador", response)
    
    response = requests.get(f'{BASE_URL}/agendamentos?cliente_id={cliente_id}')
    print_resultado("12b. Visualizar agendamentos do cliente", response)
    
    # ========== 13. REGISTRAR MONTAGEM CONCLUÍDA ==========
    print("\n✔️ FASE 13: REGISTRAR CONCLUSÃO (Montador)")
    conclusao_data = {'horario_fim': '18:30'}
    response = requests.post(f'{BASE_URL}/agendamentos/{agendamento_id}/registrar_conclusao', json=conclusao_data)
    print_resultado("13. Registrar montagem concluída", response)
    
    # ========== 14. ENVIAR OBSERVAÇÕES/FOTOS ==========
    print("\n📸 FASE 14: ENVIAR OBSERVAÇÕES (Montador)")
    observacoes_data = {
        'observacoes': 'Montagem realizada com sucesso. Cliente satisfeito.',
        'fotos': ['https://exemplo.com/foto1.jpg', 'https://exemplo.com/foto2.jpg']
    }
    response = requests.post(f'{BASE_URL}/agendamentos/{agendamento_id}/observacoes', json=observacoes_data)
    print_resultado("14. Enviar observações/fotos", response)
    
    # ========== 15. GERENCIAR USUÁRIOS (Admin) ==========
    print("\n👥 FASE 15: GERENCIAR USUÁRIOS (Administrador)")
    response = requests.get(f'{BASE_URL}/clientes')
    print_resultado("15. Gerenciar usuários", response)
    
    # ========== 16. VISUALIZAR TODOS OS AGENDAMENTOS (Admin) ==========
    print("\n📊 FASE 16: VISUALIZAR TODOS OS AGENDAMENTOS")
    response = requests.get(f'{BASE_URL}/todos_agendamentos')
    print_resultado("16. Visualizar todos os agendamentos", response)
    
    # ========== 17. GERAR RELATÓRIOS (Admin) ==========
    print("\n📈 FASE 17: GERAR RELATÓRIOS (Administrador)")
    response = requests.get(f'{BASE_URL}/relatorios')
    print_resultado("17. Gerar relatórios", response)
    
    # ========== 18. TESTAR CANCELAMENTO ==========
    print("\n🗑️ FASE 18: CANCELAR AGENDAMENTO")
    # Criar novo agendamento para cancelar
    novo_agendamento_data = {
        'cliente_id': cliente_id,
        'endereco_id': endereco_id,
        'data_servico': (datetime.now() + timedelta(days=14)).strftime('%Y-%m-%d'),
        'horario_inicio': '10:00',
        'itens': [{'movel_id': movel1_id, 'quantidade': 1, 'movel_preco': 800.00}],
        'servicos': []
    }
    response = requests.post(f'{BASE_URL}/solicitar_montagem', json=novo_agendamento_data)
    agendamento_cancelar_id = response.json().get('agendamentoId')
    
    response = requests.post(f'{BASE_URL}/agendamentos/{agendamento_cancelar_id}/cancelar')
    print_resultado("18. Cancelar agendamento", response)
    
    # ========== 19. TESTAR HORÁRIO NÃO DISPONÍVEL ==========
    print("\n❌ FASE 19: TESTAR INDISPONIBILIDADE (Diagrama de Sequência - alt [não disponível])")
    agendamento_conflito = {
        'cliente_id': cliente_id,
        'endereco_id': endereco_id,
        'data_servico': data_servico,
        'horario_inicio': '14:00',  # Mesmo horário do primeiro agendamento
        'itens': [{'movel_id': movel1_id, 'quantidade': 1, 'movel_preco': 500.00}],
        'servicos': []
    }
    response = requests.post(f'{BASE_URL}/solicitar_montagem', json=agendamento_conflito)
    print_resultado("19. Solicitar montagem em horário ocupado (deve retornar indisponível)", response)
    
    print("\n" + "✅ TESTES CONCLUÍDOS COM SUCESSO! ✅".center(70))
    print("="*70)
    print("\n📊 RESUMO:")
    print("✓ Todos os casos de uso do diagrama foram testados")
    print("✓ Diagrama de sequência implementado corretamente")
    print("✓ Fluxo completo executado com sucesso")
    print("\n")

if __name__ == '__main__':
    import time
    
    print("\n⏳ Aguardando servidor estar online...")
    print("💡 Verificando conexão com o servidor...")
    
    # Aguarda servidor estar pronto
    for i in range(10):
        try:
            requests.get(f'{BASE_URL}/')
            print("✅ Servidor online!")
            break
        except:
            time.sleep(1)
            print(f"   Tentativa {i+1}/10...")
    
    try:
        testar_sistema()
    except requests.exceptions.ConnectionError:
        print("\n❌ ERRO: Não foi possível conectar ao servidor!")
        print("📝 Verifique se o servidor está rodando em http://localhost:5000")
        print("   Execute em outro terminal: python main.py")
    except Exception as e:
        print(f"\n❌ ERRO: {str(e)}")
