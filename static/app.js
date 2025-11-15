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
        
        // Controlar visibilidade das abas baseada no tipo de usuário
        controlarVisibilidadeAbas();
        
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

// Controlar visibilidade das abas baseada no tipo de usuário
function controlarVisibilidadeAbas() {
    const enderecoBtn = document.querySelector('[data-tab="endereco"]');
    const enderecoTab = document.getElementById('tab-endereco');
    const solicitarBtn = document.querySelector('[data-tab="solicitar"]');
    const montadorBtn = document.querySelector('[data-tab="montador"]');
    const montadorTab = document.getElementById('tab-montador');
    
    if (currentUser && currentUser.tipo === 'montador') {
        // Para montadores: esconder cadastrar endereço e solicitar montagem
        if (enderecoBtn) enderecoBtn.style.display = 'none';
        if (enderecoTab) enderecoTab.style.display = 'none';
        if (solicitarBtn) solicitarBtn.style.display = 'none';
        
        // Ativar aba de visualizar agendamentos como padrão para montadores
        const visualizarBtn = document.querySelector('[data-tab="visualizar"]');
        const visualizarTab = document.getElementById('tab-visualizar');
        
        if (visualizarBtn && visualizarTab) {
            // Remover active de todas as abas
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Ativar aba visualizar agendamentos
            visualizarBtn.classList.add('active');
            visualizarTab.classList.add('active');
            
            // Carregar agendamentos automaticamente
            visualizarAgendamentos();
        }
        
        // Verificar status de disponibilidade automaticamente para montadores
        // Aumentar delay para garantir que os elementos HTML estejam renderizados
        setTimeout(() => {
            const statusAtual = document.getElementById('status-atual');
            if (statusAtual) {
                console.log('Elemento encontrado, carregando status...');
                verificarStatusDisponibilidade();
            } else {
                console.error('Elemento status-atual não encontrado');
            }
        }, 2000);
    } else if (currentUser && currentUser.tipo === 'cliente') {
        // Para clientes: esconder aba montador
        if (montadorBtn) montadorBtn.style.display = 'none';
        if (montadorTab) montadorTab.style.display = 'none';
        
        // Garantir que a aba endereço seja a ativa por padrão para clientes
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab || activeTab.id === 'tab-montador') {
            // Remover active de todas as abas
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Ativar aba endereço
            if (enderecoBtn && enderecoTab) {
                enderecoBtn.classList.add('active');
                enderecoTab.classList.add('active');
            }
        }
    }
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

    // Pega endereço selecionado
    const enderecoSelecionado = document.getElementById('montagem-endereco').value;
    if (!enderecoSelecionado) {
        showResult('montagem-result', '❌ Selecione um endereço para o serviço!', false);
        return;
    }

    // Pega descrição do móvel e serviços adicionais
    const descricaoMovel = document.getElementById('montagem-movel').value.trim();
    const servicosAdicionais = document.getElementById('montagem-servicos').value.trim();

    const formData = {
        cliente_id: currentUser.id,
        endereco_id: parseInt(enderecoSelecionado),
        data_servico: document.getElementById('montagem-data').value,
        horario_inicio: document.getElementById('montagem-horario').value,
        descricao_movel: descricaoMovel,
        servicos_adicionais: servicosAdicionais,
        itens: [{
            movel_id: 1, // Simplificado para MVP
            quantidade: 1,
            movel_preco: 0.00 // Valor será definido pelo sistema/administrador
        }]
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
            // Não precisa mais recarregar lista de serviços
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
                <p><strong>Horário:</strong> ${ag.horario_inicio}${ag.horario_fim ? ` - ${ag.horario_fim}` : ''}</p>
                <p><strong>Status:</strong> ${getStatusBadge(ag.status)}</p>
                <p><strong>Valor:</strong> R$ ${ag.valor_total.toFixed(2)}</p>
                
                ${ag.endereco ? `
                    <div style="margin-top: 10px; padding: 10px; background: #f0f8ff; border-radius: 5px; border-left: 4px solid #007bff;">
                        <strong>📍 Endereço:</strong>
                        <p style="margin: 5px 0 0 0;">${ag.endereco.endereco_completo}</p>
                    </div>
                ` : ''}
                
                ${ag.descricao_movel ? `
                    <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border-radius: 5px; border-left: 4px solid #ffc107;">
                        <strong>🪑 Móvel para Montagem:</strong>
                        <p style="margin: 5px 0 0 0; font-weight: 500;">${ag.descricao_movel}</p>
                    </div>
                ` : ''}
                
                ${ag.servicos_adicionais ? `
                    <div style="margin-top: 10px; padding: 10px; background: #e3f2fd; border-radius: 5px; border-left: 4px solid #2196f3;">
                        <strong>🔧 Serviços Adicionais Solicitados:</strong>
                        <p style="margin: 5px 0 0 0; font-style: italic;">${ag.servicos_adicionais}</p>
                    </div>
                ` : ''}
                
                ${ag.status === 'Concluído' && (ag.fotos && ag.fotos.length > 0 || ag.observacoes) ? `
                    <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                        <h5 style="color: #28a745; margin-bottom: 10px;">📋 Relatório de Conclusão</h5>
                        
                        ${ag.observacoes ? `
                            <div style="margin-bottom: 15px;">
                                <strong>Observações do Montador:</strong>
                                <p style="background: white; padding: 10px; border-radius: 5px; margin: 5px 0;">${ag.observacoes}</p>
                            </div>
                        ` : ''}
                        
                        ${ag.fotos && ag.fotos.length > 0 ? `
                            <div>
                                <strong>Fotos do Móvel Montado:</strong>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                                    ${ag.fotos.map(foto => `
                                        <img src="${foto}" alt="Foto da montagem" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; cursor: pointer; border: 2px solid #28a745;" onclick="window.open('${foto}', '_blank')">
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="agendamento-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    ${currentUser && currentUser.tipo === 'cliente' && (ag.status === 'Pendente' || ag.status === 'Agendado' || ag.status === 'Confirmado') ? 
                        `<button class="btn btn-warning" onclick="alterarAgendamento(${ag.id}, '${ag.data_servico}', '${ag.horario_inicio}')" style="background: #f39c12; border: none;">✏️ Alterar</button>` : ''}
                    ${currentUser && currentUser.tipo === 'cliente' && ag.status !== 'Cancelado' && ag.status !== 'Concluído' ? 
                        `<button class="btn btn-danger" onclick="cancelarAgendamento(${ag.id})" style="background: #e74c3c; border: none;">❌ Cancelar</button>` : ''}
                </div>
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

// 7. Alterar Agendamento
function alterarAgendamento(agendamentoId, dataAtual, horarioAtual) {
    // Criar um modal/formulário para alterar o agendamento
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
        align-items: center; z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
            <h3>✏️ Alterar Agendamento #${agendamentoId}</h3>
            
            <form id="form-alterar-agendamento">
                <div style="margin-bottom: 15px;">
                    <label for="nova-data" style="display: block; margin-bottom: 5px; font-weight: bold;">Nova Data:</label>
                    <input type="date" id="nova-data" value="${dataAtual}" required 
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="novo-horario" style="display: block; margin-bottom: 5px; font-weight: bold;">Novo Horário:</label>
                    <input type="time" id="novo-horario" value="${horarioAtual}" required 
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 5px; cursor: pointer;">
                        Cancelar
                    </button>
                    <button type="submit" 
                            style="padding: 10px 20px; border: none; background: #f39c12; color: white; border-radius: 5px; cursor: pointer;">
                        💾 Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar event listener para o formulário
    modal.querySelector('#form-alterar-agendamento').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const novaData = document.getElementById('nova-data').value;
        const novoHorario = document.getElementById('novo-horario').value;
        
        try {
            const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}/alterar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data_servico: novaData,
                    horario_inicio: novoHorario
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showResult('visualizar-result', `✅ Agendamento #${agendamentoId} alterado com sucesso!`, true);
                modal.remove();
                visualizarAgendamentos(); // Atualiza a lista
            } else {
                alert(`❌ Erro: ${data.erro || 'Não foi possível alterar o agendamento'}`);
            }
        } catch (error) {
            alert(`❌ Erro: ${error.message}`);
        }
    });
}

// ==================== MONTADOR ====================

// Registrar Conclusão
async function registrarConclusao(event) {
    event.preventDefault();
    
    const agendamentoId = document.getElementById('conclusao-id').value;
    const horarioFim = document.getElementById('conclusao-horario').value;
    const fotos = document.getElementById('conclusao-fotos').files;
    const observacoes = document.getElementById('conclusao-observacoes').value;

    try {
        // Criar FormData para enviar arquivos
        const formData = new FormData();
        formData.append('horario_fim', horarioFim);
        formData.append('observacoes', observacoes);
        
        // Adicionar fotos ao FormData
        for (let i = 0; i < fotos.length; i++) {
            formData.append('fotos', fotos[i]);
        }

        const response = await fetch(`${API_URL}/agendamentos/${agendamentoId}/registrar_conclusao`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (response.ok) {
            showResult('montador-result', `✅ Montagem #${data.id} marcada como ${data.status}! Fotos e observações enviadas ao cliente.`, true);
            document.getElementById('form-conclusao').reset();
        } else {
            showResult('montador-result', `❌ Erro: ${data.erro}`, false);
        }
    } catch (error) {
        showResult('montador-result', `❌ Erro: ${error.message}`, false);
    }
}

// Confirmar Disponibilidade do Montador
async function confirmarDisponibilidade(disponivel) {
    if (!currentUser || currentUser.tipo !== 'montador') {
        showResult('montador-result', '❌ Função apenas para montadores!', false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/montadores/${currentUser.id}/confirmar_disponibilidade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disponivel: disponivel })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const statusText = disponivel ? 'Disponível' : 'Indisponível';
            const statusColor = disponivel ? '#28a745' : '#dc3545';
            
            showResult('montador-result', `✅ Status atualizado: ${statusText}`, true);
            
            // Atualizar display do status
            atualizarDisplayStatus(disponivel, new Date().toLocaleString());
            
        } else {
            showResult('montador-result', `❌ Erro: ${data.erro || 'Não foi possível atualizar status'}`, false);
        }
    } catch (error) {
        showResult('montador-result', `❌ Erro: ${error.message}`, false);
    }
}

// Verificar Status Atual de Disponibilidade
async function verificarStatusDisponibilidade() {
    if (!currentUser || currentUser.tipo !== 'montador') {
        return;
    }
    
    // Mostrar status de carregamento imediatamente
    atualizarDisplayStatus(null, 'Carregando...');

    try {
        console.log('Buscando status do montador:', currentUser.id);
        const response = await fetch(`${API_URL}/montadores/${currentUser.id}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        const disponivel = data.disponivel;
        atualizarDisplayStatus(disponivel, data.ultima_atualizacao || new Date().toLocaleString('pt-BR'));
        
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        atualizarDisplayStatus(false, 'Erro ao carregar - Clique em Atualizar Status');
        showResult('montador-result', '⚠️ Não foi possível carregar o status. Tente clicar em "Atualizar Status".', false);
    }
}

// Atualizar Display do Status na Interface
function atualizarDisplayStatus(disponivel, ultimaAtualizacao) {
    const statusAtual = document.getElementById('status-atual');
    const ultimaAtualizacaoEl = document.getElementById('ultima-atualizacao');
    const statusContainer = document.getElementById('status-disponibilidade');
    
    if (statusAtual && ultimaAtualizacaoEl && statusContainer) {
        if (disponivel === true) {
            statusAtual.textContent = '✅ Disponível';
            statusAtual.style.color = '#28a745';
            statusContainer.style.borderLeftColor = '#28a745';
            statusContainer.style.backgroundColor = '#d4edda';
        } else if (disponivel === false) {
            statusAtual.textContent = '❌ Indisponível';
            statusAtual.style.color = '#dc3545';
            statusContainer.style.borderLeftColor = '#dc3545';
            statusContainer.style.backgroundColor = '#f8d7da';
        } else {
            statusAtual.textContent = '⏳ Carregando...';
            statusAtual.style.color = '#6c757d';
            statusContainer.style.borderLeftColor = '#6c757d';
            statusContainer.style.backgroundColor = '#f8f9fa';
        }
        
        ultimaAtualizacaoEl.textContent = ultimaAtualizacao || 'Atualizando...';
    }
}

// Carregar endereços do cliente no select
async function carregarEnderecosCliente() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_URL}/enderecos?cliente_id=${currentUser.id}`);
        const enderecos = await response.json();
        
        const select = document.getElementById('montagem-endereco');
        select.innerHTML = '<option value="">Selecione um endereço cadastrado</option>';
        
        if (enderecos.length === 0) {
            select.innerHTML += '<option value="" disabled>Nenhum endereço cadastrado - Cadastre um primeiro</option>';
        } else {
            enderecos.forEach(endereco => {
                const option = document.createElement('option');
                option.value = endereco.id;
                option.textContent = `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        const select = document.getElementById('montagem-endereco');
        select.innerHTML = '<option value="">Erro ao carregar endereços</option>';
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
    } else if (tabName === 'solicitar') {
        carregarEnderecosCliente();
    } else if (tabName === 'montador' && currentUser && currentUser.tipo === 'montador') {
        verificarStatusDisponibilidade();
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
    // Não precisa mais carregar serviços ao iniciar
});
