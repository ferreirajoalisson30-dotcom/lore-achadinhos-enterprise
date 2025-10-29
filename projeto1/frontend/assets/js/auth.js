// assets/js/auth.js
import { showToast, openModal, closeModal, escapeHtml } from './utils.js';

// Validações
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 8;
}

function checkPasswordStrength(password) {
    if (password.length === 0) return { strength: 0, text: "Digite sua senha" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    let feedback = "";
    if (strength < 2) feedback = "Fraca";
    else if (strength < 4) feedback = "Média";
    else feedback = "Forte";

    return { strength, text: feedback };
}

export function updatePasswordStrength() {
    const password = document.getElementById('registerPassword');
    if (!password) return;
    
    const strengthInfo = checkPasswordStrength(password.value);
    const strengthBarContainer = document.getElementById('passwordStrength');
    const strengthBar = strengthBarContainer?.querySelector('.password-strength-bar');
    const strengthText = document.getElementById('passwordStrengthText');

    if (!strengthBarContainer || !strengthBar || !strengthText) return;

    // Reset classes
    strengthBarContainer.className = 'password-strength';
    strengthBar.style.width = '0%';

    if (password.value.length > 0) {
        if (strengthInfo.strength < 2) {
            strengthBarContainer.classList.add('weak');
        } else if (strengthInfo.strength < 4) {
            strengthBarContainer.classList.add('medium');
        } else {
            strengthBarContainer.classList.add('strong');
        }
    }
    strengthText.textContent = strengthInfo.text;
}

function showError(inputId, messageId, show = true) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(messageId);

    if (!input || !error) return;

    if (show) {
        input.classList.add('error');
        error.classList.add('show');
    } else {
        input.classList.remove('error');
        error.classList.remove('show');
    }
}

function validateForm(formType) {
    let isValid = true;

    if (formType === 'login') {
        const email = document.getElementById('loginEmail')?.value.trim() || '';
        const password = document.getElementById('loginPassword')?.value || '';

        if (!validateEmail(email)) { 
            showError('loginEmail','loginEmailError', true); 
            isValid = false; 
        } else { 
            showError('loginEmail','loginEmailError', false); 
        }
        
        if (password.length < 1) { 
            showError('loginPassword','loginPasswordError', true); 
            isValid = false; 
        } else { 
            showError('loginPassword','loginPasswordError', false); 
        }
    } else if (formType === 'register') {
        const name = document.getElementById('registerName')?.value.trim() || '';
        const email = document.getElementById('registerEmail')?.value.trim() || '';
        const password = document.getElementById('registerPassword')?.value || '';
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value || '';
        const acceptTerms = document.getElementById('acceptTerms')?.checked || false;

        if (name.length < 2) { 
            showError('registerName','registerNameError', true); 
            isValid = false; 
        } else { 
            showError('registerName','registerNameError', false); 
        }
        
        if (!validateEmail(email)) { 
            showError('registerEmail','registerEmailError', true); 
            isValid = false; 
        } else { 
            showError('registerEmail','registerEmailError', false); 
        }
        
        if (!validatePassword(password)) { 
            showError('registerPassword','registerPasswordError', true); 
            isValid = false; 
        } else { 
            showError('registerPassword','registerPasswordError', false); 
        }
        
        if (password !== confirmPassword) { 
            showError('registerConfirmPassword','registerConfirmPasswordError', true); 
            isValid = false; 
        } else { 
            showError('registerConfirmPassword','registerConfirmPasswordError', false); 
        }
        
        if (!acceptTerms) { 
            showError('acceptTerms','acceptTermsError', true); 
            isValid = false; 
        } else { 
            showError('acceptTerms','acceptTermsError', false); 
        }
    }
    return isValid;
}

// Funções de modal
export function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected','false');
    });
    
    const selected = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
    if (selected) { 
        selected.classList.add('active'); 
        selected.setAttribute('aria-selected','true'); 
    }

    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    const form = document.getElementById(`${tabName}Form`);
    if (form) form.classList.add('active');

    const modalTitle = document.querySelector('#loginModal .modal-title');
    if (modalTitle) {
        modalTitle.textContent = tabName === 'login' ? 'Entre na sua conta' : 'Crie sua conta';
    }
}

export function togglePasswordVisibility(buttonEl) {
    if (!buttonEl) return;
    const inputId = buttonEl.getAttribute('data-target');
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = buttonEl.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        if (icon) icon.className = 'fas fa-eye';
    }
}

// Handlers de formulário
async function handleLogin(e, AppState) {
    e.preventDefault();
    
    if (!validateForm('login')) return;

    const loginSubmit = document.getElementById('loginSubmit');
    const loginLoading = document.getElementById('loginLoading');
    const submitText = loginSubmit?.querySelector('span');

    if (!loginSubmit || !loginLoading || !submitText) return;

    submitText.style.display = 'none';
    loginLoading.style.display = 'inline-block';
    loginSubmit.disabled = true;

    try {
        // Simular requisição de API
        await new Promise(resolve => setTimeout(resolve, 900));
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('lore_users')) || [];
        const userExists = users.find(user => user.email === email && user.password === password);

        if (userExists) {
            AppState.isLoggedIn = true;
            AppState.currentUser = userExists;
            localStorage.setItem('lore_logged_user', JSON.stringify(userExists));
            
            showToast('Login realizado com sucesso! 🎉', 'success');
            closeModal('loginModal');
            
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) loginBtn.textContent = 'Minha Conta';
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = 'areadocliente.html';
            }, 800);
        } else {
            throw new Error('E-mail ou senha incorretos!');
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        submitText.style.display = 'inline';
        loginLoading.style.display = 'none';
        loginSubmit.disabled = false;
    }
}

async function handleRegister(e, AppState) {
    e.preventDefault();
    
    if (!validateForm('register')) return;

    const registerSubmit = document.getElementById('registerSubmit');
    const registerLoading = document.getElementById('registerLoading');
    const submitText = registerSubmit?.querySelector('span');

    if (!registerSubmit || !registerLoading || !submitText) return;

    submitText.style.display = 'none';
    registerLoading.style.display = 'inline-block';
    registerSubmit.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        const users = JSON.parse(localStorage.getItem('lore_users')) || [];
        const userExists = users.find(user => user.email === email);
        
        if (userExists) {
            throw new Error('Este e-mail já está cadastrado!');
        }

        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            createdAt: new Date().toISOString() 
        };
        
        users.push(newUser);
        localStorage.setItem('lore_users', JSON.stringify(users));
        localStorage.setItem('lore_logged_user', JSON.stringify(newUser));

        AppState.isLoggedIn = true;
        AppState.currentUser = newUser;
        
        showToast('Cadastro realizado com sucesso! 🎉 Bem-vindo(a) à Lore Achadinhos!', 'success');
        closeModal('loginModal');
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.textContent = 'Minha Conta';
        
        setTimeout(() => {
            window.location.href = 'areadocliente.html';
        }, 800);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        submitText.style.display = 'inline';
        registerLoading.style.display = 'none';
        registerSubmit.disabled = false;
    }
}

// Inicialização do módulo
export function initAuth(AppState) {
    console.log('🔐 Inicializando módulo de autenticação...');

    // Botão de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            switchAuthTab('login');
            openModal('loginModal');
        });
    }

    // Tabs de autenticação
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() { 
            switchAuthTab(this.getAttribute('data-tab')); 
        });
    });

    // Links de alternância
    document.querySelectorAll('.switch-to-register, .switch-to-login').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.classList.contains('switch-to-register') ? 'register' : 'login';
            switchAuthTab(targetTab);
        });
    });

    // Toggle de senha
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            togglePasswordVisibility(this);
        });
    });

    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleLogin(e, AppState));
    }

    // Formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleRegister(e, AppState));
    }

    // Força da senha em tempo real
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }

    // Login social (mock)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Login com redes sociais em desenvolvimento!', 'success');
        });
    });

    // Verificar usuário logado
    const loggedUser = localStorage.getItem('lore_logged_user');
    if (loggedUser && loginBtn) {
        AppState.isLoggedIn = true;
        AppState.currentUser = JSON.parse(loggedUser);
        loginBtn.textContent = 'Minha Conta';
    }
}