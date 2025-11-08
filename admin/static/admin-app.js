// Configuração da API
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://web-production-6b5a8.up.railway.app';

let currentAdmin = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    currentAdmin = checkAdminAuth();
    if (!currentAdmin) {
        window.location.href = '/admin/login';
        return;
    }
    
    // Configurar navegação entre abas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAdminTab(tab.dataset.tab));
    });
    
    // Carregar dados iniciais
    loadDashboard();
});

// Verificar autenticação administrativa
function checkAdminAuth() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        try {
            const user = JSON.parse(adminUser);
            if (user.tipo === 'administrador') {
                return user;
            }
        } catch (error) {
            localStorage.removeItem('adminUser');
        }
    }
    return null;
}

// Função de logout
function logout() {
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
}

// Navegação entre abas
function switchAdminTab(tabName) {
    // Remove active de todas as abas
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    // Adiciona active na aba selecionada
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`admin-tab-${tabName}`).classList.add('active');
    
    // Carregar dados específicos da aba
    switch(tabName) {
        case 'relatorios':
            carregarRelatorios();
            break;
        case 'usuarios':
            carregarClientes();
            carregarMontadores();
            break;
        case 'atribuicoes':
            carregarAgendamentosPendentes();
            break;
    }
}

// Carregar dashboard principal
async function loadDashboard() {
    await carregarEstatisticas();
    await carregarRelatorios();
}

// Carregar estatísticas
async function carregarEstatisticas() {
    try {
        // Total de agendamentos
        const agendamentosResponse = await fetch(`${API_URL}/todos_agendamentos`);
        const agendamentos = await agendamentosResponse.json();
        document.getElementById('total-agendamentos').textContent = agendamentos.length;
        
        // Agendamentos concluídos
        const concluidas = agendamentos.filter(ag => ag.status === 'Concluído').length;
        document.getElementById('total-concluidas').textContent = concluidas;
        
        // Total de clientes
        const clientesResponse = await fetch(`${API_URL}/clientes`);
        const clientes = await clientesResponse.json();
        document.getElementById('total-clientes').textContent = clientes.length;
        
        // Total de montadores (vamos criar um endpoint para isso)
        try {
            const montadoresResponse = await fetch(`${API_URL}/montadores`);
            const montadores = await montadoresResponse.json();
            document.getElementById('total-montadores').textContent = montadores.length;
        } catch (error) {
            document.getElementById('total-montadores').textContent = '0';
        }
        
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar relatórios
async function carregarRelatorios() {
    try {
        const response = await fetch(`${API_URL}/todos_agendamentos`);
        const agendamentos = await response.json();
        
        const container = document.getElementById('relatorios-lista');
        
        if (agendamentos.length === 0) {
            container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            return;
        }
        
        container.innerHTML = agendamentos.map(ag => `
            <div class="admin-card">
                <h4>📅 Agendamento #${ag.id}</h4>
                <p><strong>Cliente ID:</strong> ${ag.cliente_id}</p>
                <p><strong>Montador ID:</strong> ${ag.montador_id || 'Não atribuído'}</p>
                <p><strong>Data:</strong> ${formatDate(ag.data_servico)}</p>
                <p><strong>Status:</strong> ${getStatusBadge(ag.status)}</p>
                
                <div class="admin-actions">
                    ${!ag.montador_id && ag.status === 'Pendente' ? 
                        `<button class="btn btn-admin" onclick="mostrarModalAtribuir(${ag.id})">🔧 Atribuir Montador</button>` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        document.getElementById('relatorios-lista').innerHTML = '<p>Erro ao carregar relatórios.</p>';
    }
}

// Carregar clientes
async function carregarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        const clientes = await response.json();
        
        const container = document.getElementById('clientes-lista');
        
        if (clientes.length === 0) {
            container.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
            return;
        }
        
        container.innerHTML = clientes.map(cliente => `
            <div class="admin-card">
                <h4>👤 ${cliente.nome}</h4>
                <p><strong>ID:</strong> ${cliente.id}</p>
                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telefone:</strong> ${cliente.telefone || 'Não informado'}</p>
                <p><strong>CPF:</strong> ${cliente.cpf || 'Não informado'}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('clientes-lista').innerHTML = '<p>Erro ao carregar clientes.</p>';
    }
}

// Carregar montadores
async function carregarMontadores() {
    try {
        const response = await fetch(`${API_URL}/montadores`);
        const montadores = await response.json();
        
        const container = document.getElementById('montadores-lista');
        
        if (montadores.length === 0) {
            container.innerHTML = '<p>Nenhum montador cadastrado.</p>';
            return;
        }
        
        container.innerHTML = montadores.map(montador => `
            <div class="admin-card">
                <h4>🔨 ${montador.nome}</h4>
                <p><strong>ID:</strong> ${montador.id}</p>
                <p><strong>Email:</strong> ${montador.email}</p>
                <p><strong>Disponível:</strong> ${montador.disponivel ? '✅ Sim' : '❌ Não'}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar montadores:', error);
        document.getElementById('montadores-lista').innerHTML = '<p>Erro ao carregar montadores.</p>';
    }
}

// Carregar agendamentos pendentes
async function carregarAgendamentosPendentes() {
    try {
        const response = await fetch(`${API_URL}/todos_agendamentos`);
        const agendamentos = await response.json();
        
        const pendentes = agendamentos.filter(ag => ag.status === 'Pendente' && !ag.montador_id);
        const container = document.getElementById('agendamentos-pendentes');
        
        if (pendentes.length === 0) {
            container.innerHTML = '<p>Todos os agendamentos já possuem montadores atribuídos.</p>';
            return;
        }
        
        container.innerHTML = pendentes.map(ag => `
            <div class="admin-card">
                <h4>📅 Agendamento #${ag.id}</h4>
                <p><strong>Cliente ID:</strong> ${ag.cliente_id}</p>
                <p><strong>Data:</strong> ${formatDate(ag.data_servico)}</p>
                <p><strong>Status:</strong> ${getStatusBadge(ag.status)}</p>
                
                <div class="admin-actions">
                    <button class="btn btn-admin" onclick="mostrarModalAtribuir(${ag.id})">🔧 Atribuir Montador</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar agendamentos pendentes:', error);
        document.getElementById('agendamentos-pendentes').innerHTML = '<p>Erro ao carregar agendamentos.</p>';
    }
}

// Modal para atribuir montador (simplificado)
async function mostrarModalAtribuir(agendamentoId) {
    try {
        const response = await fetch(`${API_URL}/montadores`);
        const montadores = await response.json();
        
        const disponveis = montadores.filter(m => m.disponivel);
        
        if (disponveis.length === 0) {
            alert('❌ Nenhum montador disponível no momento.');
            return;
        }
        
        let options = disponveis.map(m => `${m.id} - ${m.nome}`).join('\n');
        const montadorId = prompt(`Selecione um montador para o agendamento #${agendamentoId}:\n\n${options}\n\nDigite o ID do montador:`);
        
        if (montadorId) {
            await atribuirMontador(agendamentoId, parseInt(montadorId));
        }
        
    } catch (error) {
        console.error('Erro ao carregar montadores:', error);
        alert('❌ Erro ao carregar lista de montadores.');
    }
}

// Atribuir montador a agendamento
async function atribuirMontador(agendamentoId, montadorId) {
    try {
        const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}/atribuir_montador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ montador_id: montadorId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`✅ Montador atribuído com sucesso ao agendamento #${agendamentoId}!`);
            // Recarregar dados
            carregarRelatorios();
            carregarAgendamentosPendentes();
        } else {
            alert(`❌ Erro: ${data.erro || 'Falha ao atribuir montador'}`);
        }
        
    } catch (error) {
        console.error('Erro ao atribuir montador:', error);
        alert('❌ Erro ao atribuir montador.');
    }
}

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusBadge(status) {
    const badges = {
        'Pendente': '<span style="background: #f39c12; color: white; padding: 4px 8px; border-radius: 4px;">Pendente</span>',
        'Agendado': '<span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 4px;">Agendado</span>',
        'Confirmado': '<span style="background: #9b59b6; color: white; padding: 4px 8px; border-radius: 4px;">Confirmado</span>',
        'Concluído': '<span style="background: #27ae60; color: white; padding: 4px 8px; border-radius: 4px;">Concluído</span>',
        'Cancelado': '<span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 4px;">Cancelado</span>'
    };
    return badges[status] || status;
}