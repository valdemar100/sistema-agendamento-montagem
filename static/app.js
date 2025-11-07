// Configuração da API
// Configuração da API
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://web-production-6b5a8.up.railway.app';

// Estado global da aplicação
let currentUser = null;
let currentEndereco = null;

// ==================== VERIFICAÇÃO DE LOGIN ====================
// Verificar se usuário está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const userDataString = localStorage.getItem('user');
    
    if (!userDataString) {
        // Se não está logado, redirecionar para login
        window.location.href = '/';
        return;
    }
    
    try {
        currentUser = JSON.parse(userDataString);
        
        // Mostrar informações do usuário
        const userInfoHeader = document.getElementById('user-info-header');
        const userNameDisplay = document.getElementById('user-name-display');
        
        if (userInfoHeader && userNameDisplay) {
            userNameDisplay.textContent = `👤 ${currentUser.nome} (${currentUser.tipo})`;
            userInfoHeader.style.display = 'block';
        }
        
        console.log('Usuário logado:', currentUser);
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        window.location.href = '/';
    }
});

// Função de logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Utilitários
function showResult(elementId, message, isSuccess) {
    const resultBox = document.getElementById(elementId);
    resultBox.textContent = message;
    resultBox.className = `result-box ${isSuccess ? 'success' : 'error'} show`;
    setTimeout(() => {
        resultBox.classList.remove('show');
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getStatusBadge(status) {
    const statusMap = {
        'Pendente': 'status-pendente',
        'Confirmado pelo Montador': 'status-confirmado',
        'Atribuído': 'status-confirmado',
        'Concluído': 'status-concluido',
        'Cancelado': 'status-cancelado'
    };
    return `<span class="status-badge ${statusMap[status] || ''}">${status}</span>`;
}

// ==================== CLIENTE ====================

// FUNÇÕES DE CADASTRO E LOGIN REMOVIDAS (agora estão em auth.js)

// 3. Cadastrar Endereço
async function cadastrarEndereco(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showResult('endereco-result', '❌ Por favor, faça login primeiro!', false);
        return;
    }

    const formData = {
        cliente_id: currentUser.id,
        rua: document.getElementById('endereco-rua').value,
        numero: document.getElementById('endereco-numero').value,
        bairro: document.getElementById('endereco-bairro').value,
        cidade: document.getElementById('endereco-cidade').value,
        complemento: document.getElementById('endereco-complemento').value,
        cep: document.getElementById('endereco-cep').value
    };

    try {
        const response = await fetch(`${API_URL}/enderecos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok) {
            currentEndereco = data.id;
            showResult('endereco-result', `✅ Endereço cadastrado com sucesso! ID: ${data.id}`, true);
            document.getElementById('form-endereco').reset();
        } else {
            showResult('endereco-result', `❌ Erro: ${data.erro}`, false);
        }
    } catch (error) {
        showResult('endereco-result', `❌ Erro: ${error.message}`, false);
    }
}

// 4. Solicitar Montagem (Diagrama de Sequência!)
async function solicitarMontagem(event) {
    event.preventDefault();
    
    if (!currentUser) {
        showResult('montagem-result', '❌ Faça login primeiro!', false);
        return;
    }
    
    if (!currentEndereco) {
        showResult('montagem-result', '❌ Cadastre um endereço primeiro!', false);
        return;
    }

    // Pega serviços selecionados
    const selectServicos = document.getElementById('montagem-servicos');
    const servicosSelecionados = Array.from(selectServicos.selectedOptions)
        .map(opt => parseInt(opt.value))
        .filter(val => !isNaN(val));

    const formData = {
        cliente_id: currentUser.id,
        endereco_id: currentEndereco,
        data_servico: document.getElementById('montagem-data').value,
        horario_inicio: document.getElementById('montagem-horario').value,
        itens: [{
            movel_id: 1, // Simplificado para MVP
            quantidade: 1,
            movel_preco: parseFloat(document.getElementById('montagem-valor').value)
        }],
        servicos: servicosSelecionados
    };

    try {
        const response = await fetch(`${API_URL}/solicitar_montagem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok) {
            if (data.disponivel) {
                showResult('montagem-result', 
                    `✅ ${data.mensagem}\nAgendamento ID: ${data.agendamentoId}\nStatus: ${data.status}`, true);
            }
            document.getElementById('form-montagem').reset();
            carregarServicosAdicionais(); // Recarrega a lista
        } else {
            showResult('montagem-result', `❌ ${data.mensagem || 'Horário não disponível'}`, false);
        }
    } catch (error) {
        showResult('montagem-result', `❌ Erro: ${error.message}`, false);
    }
}

// 5. Visualizar Agendamentos
async function visualizarAgendamentos() {
    if (!currentUser) {
        showResult('visualizar-result', '❌ Faça login primeiro!', false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/agendamentos?cliente_id=${currentUser.id}`);
        const data = await response.json();
        
        const container = document.getElementById('agendamentos-lista');
        
        if (data.length === 0) {
            container.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            return;
        }
        
        container.innerHTML = data.map(ag => `
            <div class="agendamento-card">
                <h4>Agendamento #${ag.id}</h4>
                <p><strong>Data:</strong> ${formatDate(ag.data_servico)}</p>
                <p><strong>Horário:</strong> ${ag.horario_inicio}</p>
                <p><strong>Status:</strong> ${getStatusBadge(ag.status)}</p>
                <p><strong>Valor:</strong> R$ ${ag.valor_total.toFixed(2)}</p>
                ${ag.status !== 'Cancelado' && ag.status !== 'Concluído' ? 
                    `<button class="btn btn-danger" onclick="cancelarAgendamento(${ag.id})">Cancelar</button>` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        showResult('visualizar-result', `❌ Erro: ${error.message}`, false);
    }
}

// 6. Cancelar Agendamento
async function cancelarAgendamento(agendamentoId) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}/cancelar`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (response.ok) {
            showResult('visualizar-result', `✅ Agendamento #${data.id} cancelado!`, true);
            visualizarAgendamentos(); // Atualiza a lista
        } else {
            showResult('visualizar-result', `❌ Erro ao cancelar`, false);
        }
    } catch (error) {
        showResult('visualizar-result', `❌ Erro: ${error.message}`, false);
    }
}

// ==================== MONTADOR ====================

// Registrar Conclusão
async function registrarConclusao(event) {
    event.preventDefault();
    
    const agendamentoId = document.getElementById('conclusao-id').value;
    const horarioFim = document.getElementById('conclusao-horario').value;

    try {
        const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}/registrar_conclusao`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ horario_fim: horarioFim })
        });
        const data = await response.json();
        
        if (response.ok) {
            showResult('montador-result', `✅ Montagem #${data.id} marcada como ${data.status}!`, true);
            document.getElementById('form-conclusao').reset();
        } else {
            showResult('montador-result', `❌ Erro: ${data.erro}`, false);
        }
    } catch (error) {
        showResult('montador-result', `❌ Erro: ${error.message}`, false);
    }
}

// ==================== ADMINISTRADOR ====================

// Gerar Relatórios
async function gerarRelatorios() {
    try {
        const response = await fetch(`${API_URL}/relatorios`);
        const data = await response.json();
        
        const container = document.getElementById('relatorios-content');
        container.innerHTML = `
            <h3>📊 Relatório de Agendamentos</h3>
            ${Object.entries(data).map(([status, count]) => `
                <div class="agendamento-card">
                    <p><strong>${status}:</strong> ${count} agendamento(s)</p>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        showResult('admin-result', `❌ Erro: ${error.message}`, false);
    }
}

// Carregar Serviços Adicionais
async function carregarServicosAdicionais() {
    try {
        const response = await fetch(`${API_URL}/servicos`);
        if (!response.ok) {
            // Se não houver endpoint de listagem, pelo menos limpa o select
            document.getElementById('montagem-servicos').innerHTML = '<option value="">Nenhum serviço disponível</option>';
            return;
        }
        const servicos = await response.json();
        
        const select = document.getElementById('montagem-servicos');
        if (servicos.length === 0) {
            select.innerHTML = '<option value="">Nenhum serviço cadastrado</option>';
        } else {
            select.innerHTML = servicos.map(s => 
                `<option value="${s.id}">${s.nome} - R$ ${s.valor_custo.toFixed(2)}</option>`
            ).join('');
        }
    } catch (error) {
        document.getElementById('montagem-servicos').innerHTML = '<option value="">Nenhum serviço disponível</option>';
    }
}

// Cadastrar Serviço Adicional (Administrador)
async function cadastrarServico(event) {
    event.preventDefault();
    
    const formData = {
        nome: document.getElementById('servico-nome').value,
        valor_custo: parseFloat(document.getElementById('servico-valor').value),
        tempo_adicional: parseInt(document.getElementById('servico-tempo').value) || 0
    };

    try {
        const response = await fetch(`${API_URL}/servicos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        
        if (response.ok) {
            showResult('admin-result', `✅ Serviço "${formData.nome}" cadastrado com sucesso! ID: ${data.id}`, true);
            document.getElementById('form-servico').reset();
            carregarServicosAdicionais(); // Atualiza a lista
        } else {
            showResult('admin-result', `❌ Erro ao cadastrar serviço`, false);
        }
    } catch (error) {
        showResult('admin-result', `❌ Erro: ${error.message}`, false);
    }
}

// ==================== NAVEGAÇÃO ====================

function switchTab(tabName) {
    // Remove active de todos os botões e conteúdos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Adiciona active no botão e conteúdo selecionado
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Carrega dados se necessário
    if (tabName === 'visualizar') {
        visualizarAgendamentos();
    } else if (tabName === 'admin') {
        gerarRelatorios();
    } else if (tabName === 'solicitar') {
        carregarServicosAdicionais();
    }
}

function updateUserInfo() {
    const userInfoElements = document.querySelectorAll('.user-info');
    userInfoElements.forEach(el => {
        if (currentUser) {
            el.innerHTML = `
                <h3>👤 Usuário Logado</h3>
                <p><strong>Nome:</strong> ${currentUser.nome}</p>
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>ID:</strong> ${currentUser.id}</p>
                <p><strong>Tipo:</strong> ${currentUser.tipo}</p>
            `;
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners para os formulários (removidos cadastro e login)
    const formEndereco = document.getElementById('form-endereco');
    const formMontagem = document.getElementById('form-montagem');
    const formConclusao = document.getElementById('form-conclusao');
    
    if (formEndereco) formEndereco.addEventListener('submit', cadastrarEndereco);
    if (formMontagem) formMontagem.addEventListener('submit', solicitarMontagem);
    if (formConclusao) formConclusao.addEventListener('submit', registrarConclusao);
    
    // Navegação entre tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
    
    updateUserInfo();
    carregarServicosAdicionais(); // Carrega serviços ao iniciar
});
