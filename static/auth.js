// Configuração da API
// Detecta automaticamente se está em produção ou desenvolvimento
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : window.location.origin;

// Mostrar/Esconder abas de autenticação
function showAuthTab(tab) {
    // Atualizar botões
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Atualizar conteúdo
    document.querySelectorAll('.auth-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`auth-${tab}`).classList.add('active');
}

// Mostrar campos específicos por tipo de usuário
document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="tipo_usuario"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const camposCliente = document.getElementById('campos-cliente');
            const camposMontador = document.getElementById('campos-montador');
            
            if (e.target.value === 'cliente') {
                camposCliente.style.display = 'block';
                camposMontador.style.display = 'none';
                // Tornar campos de cliente obrigatórios
                document.getElementById('cadastro-cpf').required = true;
                document.getElementById('cadastro-cep').required = true;
                document.getElementById('cadastro-regiao').required = false;
                document.getElementById('cadastro-especialidade').required = false;
            } else {
                camposCliente.style.display = 'none';
                camposMontador.style.display = 'block';
                // Tornar campos de montador opcionais
                document.getElementById('cadastro-cpf').required = false;
                document.getElementById('cadastro-cep').required = false;
                document.getElementById('cadastro-regiao').required = false;
                document.getElementById('cadastro-especialidade').required = false;
            }
        });
    });
});

// Função auxiliar para mostrar mensagens
function showResult(elementId, message, isSuccess) {
    const resultBox = document.getElementById(elementId);
    resultBox.textContent = message;
    resultBox.className = `result-box ${isSuccess ? 'success' : 'error'} show`;
    setTimeout(() => {
        resultBox.classList.remove('show');
    }, 5000);
}

// CADASTRAR USUÁRIO
async function cadastrarUsuario(event) {
    event.preventDefault();
    
    const tipoUsuario = document.querySelector('input[name="tipo_usuario"]:checked').value;
    const nome = document.getElementById('cadastro-nome').value.trim();
    const email = document.getElementById('cadastro-email').value.trim();
    const senha = document.getElementById('cadastro-senha').value;
    const telefone = document.getElementById('cadastro-telefone').value.trim();
    
    // Debug: mostrar o que está sendo enviado
    console.log('Tentando cadastrar:', { nome, email, telefone, tipoUsuario });
    
    // Validar campos obrigatórios
    if (!tipoUsuario || !nome || !email || !senha || !telefone) {
        showResult('cadastro-result', '❌ Preencha todos os campos obrigatórios!', false);
        return;
    }
    
    // Validar tamanho da senha
    if (senha.length < 6) {
        showResult('cadastro-result', '❌ A senha deve ter no mínimo 6 caracteres!', false);
        return;
    }
    
    try {
        if (tipoUsuario === 'cliente') {
            // Cadastrar como CLIENTE
            const cpf = document.getElementById('cadastro-cpf').value;
            const cep = document.getElementById('cadastro-cep').value;
            
            if (!cpf || !cep) {
                showResult('cadastro-result', '❌ CPF e CEP são obrigatórios para clientes!', false);
                return;
            }
            
            const response = await fetch(`${API_URL}/cadastrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone,
                    cpf,
                    cep
                })
            });
            
            const data = await response.json();
            
            console.log('Resposta do servidor:', response.status, data);
            
            if (response.ok) {
                showResult('cadastro-result', '✅ Cliente cadastrado com sucesso! Faça login para continuar.', true);
                // Limpar formulário
                document.getElementById('cadastro-form').reset();
                // Redirecionar para aba de login
                setTimeout(() => {
                    document.querySelector('.auth-tab-btn').click();
                }, 1500);
            } else {
                showResult('cadastro-result', `❌ ${data.erro || 'Não foi possível cadastrar'}`, false);
            }
            
        } else {
            // Cadastrar como MONTADOR
            const regiao = document.getElementById('cadastro-regiao').value;
            const especialidade = document.getElementById('cadastro-especialidade').value;
            
            const response = await fetch(`${API_URL}/montadores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome,
                    email,
                    senha,
                    telefone,
                    regiao: regiao || 'Não especificado',
                    especialidade: especialidade || 'Geral'
                })
            });
            
            const data = await response.json();
            
            console.log('Resposta do servidor (Montador):', response.status, data);
            
            if (response.ok) {
                showResult('cadastro-result', '✅ Montador cadastrado com sucesso! Faça login para continuar.', true);
                // Limpar formulário
                document.getElementById('cadastro-form').reset();
                // Redirecionar para aba de login
                setTimeout(() => {
                    document.querySelector('.auth-tab-btn').click();
                }, 1500);
            } else {
                showResult('cadastro-result', `❌ ${data.erro || 'Não foi possível cadastrar'}`, false);
            }
        }
        
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        showResult('cadastro-result', '❌ Erro ao conectar com o servidor', false);
    }
}

// FAZER LOGIN
async function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    if (!email || !senha) {
        showResult('login-result', '❌ Digite email e senha!', false);
        return;
    }
    
    try {
        // Tentar login como CLIENTE
        const responseCliente = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        if (responseCliente.ok) {
            const data = await responseCliente.json();
            showResult('login-result', '✅ Login realizado com sucesso!', true);
            
            // Salvar dados do usuário
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                nome: data.nome,
                email: data.email,
                tipo: 'cliente'
            }));
            
            setTimeout(() => {
                window.location.href = '/sistema';
            }, 1000);
            return;
        }
        
        // Se não encontrou como cliente, tentar como MONTADOR
        const responseMontador = await fetch(`${API_URL}/montadores/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        if (responseMontador.ok) {
            const data = await responseMontador.json();
            showResult('login-result', '✅ Login realizado com sucesso!', true);
            
            // Salvar dados do usuário
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                nome: data.nome,
                email: email,
                tipo: 'montador'
            }));
            
            setTimeout(() => {
                window.location.href = '/sistema';
            }, 1000);
            return;
        }
        
        // Se não encontrou em nenhum ou senha incorreta
        const errorCliente = await responseCliente.json();
        const errorMontador = await responseMontador.json();
        
        if (responseCliente.status === 401 || responseMontador.status === 401) {
            showResult('login-result', '❌ Senha incorreta!', false);
        } else {
            showResult('login-result', '❌ Usuário não encontrado. Cadastre-se primeiro!', false);
        }
        
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        showResult('login-result', '❌ Erro ao conectar com o servidor', false);
    }
}
