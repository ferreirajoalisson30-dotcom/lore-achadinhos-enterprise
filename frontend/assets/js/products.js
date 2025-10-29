// ======================================================
// 📦 Lore Achadinhos — Módulo de Produtos
// ======================================================
// Este módulo gerencia os produtos, renderização de cards,
// modais de visualização e integração com o carrinho.
// ======================================================

import { showToast, escapeHtml, openModal, closeModal, formatBRL } from './utils.js';
import { addToCart } from './cart.js';

// ======================================================
// 🧸 Dados de Produtos — Exemplo inicial
// ======================================================
const products = [
  { 
    id: 1,
    title: 'Caixa de Som Aurora - LED Multicolorido',
    price: 182.50,
    category: 'eletronicos',
    desc: 'Caixa Bluetooth com luzes coloridas que dançam no ritmo da música. Perfeita para festas!',
    featured: true,
    colors: ['Azul', 'Rosa', 'Preto'],
    sizes: ['Pequeno', 'Médio', 'Grande']
  },
  { 
    id: 2,
    title: 'Projetor Estelar - Noite Mágica',
    price: 389.20,
    category: 'eletronicos',
    desc: 'Projeta constelações e estrelas no seu teto. Crie um céu noturno no seu quarto!',
    featured: true,
    colors: ['Branco', 'Preto'],
    sizes: ['Único']
  },
  { 
    id: 3,
    title: 'Ralador Mágico - 6 Funções',
    price: 119.90,
    category: 'cozinha',
    desc: 'Ralador versátil com lâminas intercambiáveis. Facilita sua vida na cozinha!',
    featured: false,
    colors: ['Inox', 'Colorido'],
    sizes: ['Padrão']
  },
  { 
    id: 4,
    title: 'Luminária Nuvem - Toque Suave',
    price: 89.90,
    category: 'casa',
    desc: 'Luminária em formato de nuvem com luz suave e regulável. Perfeita para quartos!',
    featured: true,
    colors: ['Branco', 'Azul Claro'],
    sizes: ['Pequena', 'Média']
  }
];

// ======================================================
// 🔍 Funções utilitárias de acesso aos produtos
// ======================================================
export function getProducts() {
  return products;
}

export function getProductById(id) {
  return products.find(product => product.id === id);
}

export function getFeaturedProducts() {
  return products.filter(product => product.featured);
}

export function getProductsByCategory(category) {
  return products.filter(product => product.category === category);
}

// ======================================================
// 🧩 Renderização de produtos na grade principal
// ======================================================
export function renderProducts(productsToRender, AppState, containerId = 'productsGrid') {
  const productsGrid = document.getElementById(containerId);
  if (!productsGrid) return;

  productsGrid.innerHTML = productsToRender.map(product => `
    <div class="product-card" data-product-id="${product.id}" tabindex="0">
      ${product.featured ? '<div class="featured-badge" title="Produto em destaque">⭐ DESTAQUE</div>' : ''}
      <div class="quick-view-badge">👀 Ver detalhes</div>
      <div class="product-image" aria-hidden="true">
        <i class="fas fa-image fa-3x"></i>
      </div>
      <h3>${escapeHtml(product.title)}</h3>
      <p class="product-desc">${escapeHtml(product.desc)}</p>
      <div class="price">${formatBRL(product.price)}</div>
      <div class="product-meta">
        <button class="btn view-product-btn" type="button" aria-label="Ver produto ${escapeHtml(product.title)}">
          <i class="fas fa-eye" aria-hidden="true"></i> Ver
        </button>
        <button class="btn primary buy-product-btn" type="button" aria-label="Comprar ${escapeHtml(product.title)}">
          <i class="fas fa-cart-plus" aria-hidden="true"></i> Comprar
        </button>
      </div>
    </div>
  `).join('');

  setupProductEvents(AppState, containerId);
}

// ======================================================
// 🪞 Modal de Detalhes do Produto
// ======================================================
export function showProductModal(product, AppState) {
  const modalContent = document.getElementById('productModalContent');
  if (!modalContent) return;

  modalContent.innerHTML = `
    <div style="padding: 0 25px 15px;">
      <div class="product-modal-grid">
        <div>
          <div class="product-modal-image" aria-hidden="true">
            <i class="fas fa-image fa-3x"></i>
          </div>
        </div>
        <div class="product-modal-info">
          <h3>${escapeHtml(product.title)}</h3>
          <div class="product-modal-price">${formatBRL(product.price)}</div>
          <p class="product-modal-desc">${escapeHtml(product.desc)}</p>
        </div>
      </div>

      <div class="product-options-grid" style="margin-top:12px;">
        <div class="form-group">
          <label for="productColor">Cor</label>
          <select id="productColor" class="form-control" required>
            <option value="">Selecione</option>
            ${product.colors.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="productSize">Tamanho</label>
          <select id="productSize" class="form-control" required>
            <option value="">Selecione</option>
            ${product.sizes.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>Quantidade</label>
        <div class="quantity-control">
          <button type="button" class="quantity-btn" id="decreaseQuantity" aria-label="Diminuir quantidade">
            <i class="fas fa-minus" aria-hidden="true"></i>
          </button>
          <span class="quantity-display" id="quantityDisplay">1</span>
          <button type="button" class="quantity-btn" id="increaseQuantity" aria-label="Aumentar quantidade">
            <i class="fas fa-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn primary" id="addToCartBtn">
          <i class="fas fa-cart-plus" aria-hidden="true"></i> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  `;

  // === Controle de Quantidade ===
  let quantity = 1;
  const quantityDisplay = document.getElementById('quantityDisplay');
  const decBtn = document.getElementById('decreaseQuantity');
  const incBtn = document.getElementById('increaseQuantity');

  if (decBtn && incBtn && quantityDisplay) {
    decBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
      }
    });
    incBtn.addEventListener('click', () => {
      if (quantity < 99) {
        quantity++;
        quantityDisplay.textContent = quantity;
      }
    });
  }

  // === Botão Adicionar ao Carrinho ===
  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const colorSelect = document.getElementById('productColor');
      const sizeSelect = document.getElementById('productSize');
      const color = colorSelect?.value || '';
      const size = sizeSelect?.value || '';

      if (!color || !size) {
        showToast('Por favor, selecione a cor e o tamanho do produto.', 'error');
        return;
      }

      addToCart(product, color, size, quantity, AppState);
      showToast('Produto adicionado ao carrinho! 💖', 'success');
      closeModal('productModal');
    });
  }

  openModal('productModal');
}

// ======================================================
// 🧭 Configuração de eventos dos produtos
// ======================================================
function setupProductEvents(AppState, containerId = 'productsGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-product-btn');
    const buyBtn = e.target.closest('.buy-product-btn');
    if (viewBtn || buyBtn) {
      const productCard = (viewBtn || buyBtn).closest('.product-card');
      const productId = Number(productCard.getAttribute('data-product-id'));
      const product = getProductById(productId);
      if (product) showProductModal(product, AppState);
    }
  });
}

// ======================================================
// 🚀 Inicialização do módulo de produtos
// ======================================================
export function initProducts(AppState) {
  console.log('📦 Módulo de produtos inicializado com sucesso.');
  const featuredProducts = getFeaturedProducts();
  renderProducts(featuredProducts, AppState);
}

// ======================================================
// 🌍 Exportações globais (para depuração no navegador)
// ======================================================
window.showProductModal = showProductModal;
window.getProducts = getProducts;
