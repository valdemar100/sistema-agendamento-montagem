// Configuração da API
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000' 
    : 'https://web-production-6b5a8.up.railway.app';

// Função de login administrativo
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', adminLogin);
    }
});

async function adminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    // Fazer requisição para o backend
    try {
        const response = await fetch(`${API_URL}/admin/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login bem-sucedido
            localStorage.setItem('adminUser', JSON.stringify(data));
            
            showResult('admin-login-result', '✅ Login realizado com sucesso! Redirecionando...', true);
            
            // Redirecionar para o painel administrativo
            setTimeout(() => {
                window.location.href = '/admin/';
            }, 1500);
            
        } else {
            showResult('admin-login-result', `❌ ${data.erro || 'Credenciais inválidas'}`, false);
        }
        
    } catch (error) {
        console.error('Erro na autenticação:', error);
        showResult('admin-login-result', '❌ Erro de conexão. Tente novamente.', false);
    }
}

// Função para mostrar resultados
function showResult(elementId, message, isSuccess) {
    const resultDiv = document.getElementById(elementId);
    if (resultDiv) {
        resultDiv.innerHTML = message;
        resultDiv.className = `result-box ${isSuccess ? 'result-success' : 'result-error'}`;
        resultDiv.style.display = 'block';
    }
}

// Verificar se já está logado (para redirecionar automaticamente)
function checkAdminAuth() {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        try {
            const user = JSON.parse(adminUser);
            if (user.tipo === 'administrador') {
                // Usuário já logado, pode redirecionar para o painel
                if (window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/';
                }
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

// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    // Se está na página de login, verificar se já está logado
    if (window.location.pathname.includes('/admin/login') || window.location.pathname === '/admin/login.html') {
        const adminUser = checkAdminAuth();
        if (adminUser) {
            window.location.href = '/admin/';
        }
    }
    
    // Se está no painel administrativo, verificar se está logado
    if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('/admin/login')) {
        const adminUser = checkAdminAuth();
        if (!adminUser) {
            window.location.href = '/admin/login';
        }
    }
});