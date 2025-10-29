// assets/js/main.js
import { initAuth } from './auth.js';
import { initCart } from './cart.js';
import { initProducts } from './products.js';

// Estado global da aplicação
const AppState = {
    cart: JSON.parse(localStorage.getItem('lore_cart')) || [],
    isLoggedIn: !!localStorage.getItem('lore_logged_user'),
    currentUser: JSON.parse(localStorage.getItem('lore_logged_user')) || null
};

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Lore Achadinhos - Inicializando aplicação...');
    
    // Inicializar módulos
    initAuth(AppState);
    initCart(AppState);
    initProducts(AppState);
    
    // Configurar navegação global
    initNavigation();
    
    // Atualizar interface baseada no estado
    updateUI();
});

// Navegação global
function initNavigation() {
    // Botão explorar produtos
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredSection = document.getElementById('featured-products');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Links de navegação
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🔗 Navegação para: ${this.textContent}`);
        });
    });
}

// Atualizar interface baseada no estado
function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && AppState.isLoggedIn) {
        loginBtn.textContent = 'Minha Conta';
        loginBtn.href = 'areadocliente.html';
    }
}

// Utilitários globais
function formatBRL(value) {
    return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    }).format(value);
}

function showToast(message, type = 'success') {
    // Implementação do toast...
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

// Exportar para uso global
window.AppState = AppState;
window.formatBRL = formatBRL;
window.showToast = showToast;