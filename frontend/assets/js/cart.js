// ===============================
// 🛒 LORE ACHADINHOS - CART MODULE
// ===============================

import { showToast, formatBRL } from './utils.js';

// Estado interno do carrinho
let cartItems = [];

// Função para obter o carrinho atual
export function getCart() {
  return cartItems;
}

// Função para limpar o carrinho
export function clearCart() {
  cartItems = [];
  updateCartPreview();
  showToast('Carrinho limpo com sucesso 🧹', 'success');
}

// Adiciona produto ao carrinho
export function addToCart(product, color, size, quantity, AppState) {
  const existingItem = cartItems.find(
    (item) =>
      item.id === product.id &&
      item.color === color &&
      item.size === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      id: product.id,
      title: product.title,
      price: product.price,
      color,
      size,
      quantity,
    });
  }

  AppState.cart = [...cartItems];
  updateCartPreview();
  showToast(`${product.title} adicionado ao carrinho 🛍️`, 'success');
  openCart();
}

// Remove item específico do carrinho
export function removeFromCart(id, color, size) {
  cartItems = cartItems.filter(
    (item) => !(item.id === id && item.color === color && item.size === size)
  );
  updateCartPreview();
  showToast('Item removido do carrinho 🗑️', 'success');
}

// Calcula o total do carrinho
export function getCartTotal() {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Atualiza a visualização do carrinho na tela (cartPreview)
export function updateCartPreview() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartTotalEl = document.getElementById('cartTotal');

  if (!cartContainer || !cartTotalEl) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `<p class="empty-cart-text">Seu carrinho está vazio 😢</p>`;
    cartTotalEl.textContent = 'R$ 0,00';
    return;
  }

  cartContainer.innerHTML = cartItems
    .map(
      (item) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.title}</h4>
          <small>Cor: ${item.color} | Tamanho: ${item.size}</small>
          <div class="cart-item-controls">
            <span>Qtd:</span>
            <input type="number" min="1" max="99" value="${item.quantity}" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}" class="cart-item-qty">
          </div>
        </div>
        <div class="cart-item-right">
          <div class="cart-item-price">${formatBRL(item.price * item.quantity)}</div>
          <button class="remove-item-btn" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}" aria-label="Remover ${item.title}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `
    )
    .join('');

  cartTotalEl.textContent = formatBRL(getCartTotal());

  // Eventos para alterar quantidade
  document.querySelectorAll('.cart-item-qty').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = Number(e.target.dataset.id);
      const color = e.target.dataset.color;
      const size = e.target.dataset.size;
      const newQty = Math.max(1, Math.min(99, parseInt(e.target.value, 10)));

      const item = cartItems.find(
        (p) => p.id === id && p.color === color && p.size === size
      );
      if (item) {
        item.quantity = newQty;
        updateCartPreview();
      }
    });
  });

  // Eventos para remover itens
  document.querySelectorAll('.remove-item-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const color = btn.dataset.color;
      const size = btn.dataset.size;
      removeFromCart(id, color, size);
    });
  });
}

// Abre o carrinho lateral
export function openCart() {
  const cartPreview = document.getElementById('cartPreview');
  if (cartPreview) {
    cartPreview.classList.add('open');
  }
}

// Fecha o carrinho lateral
export function closeCart() {
  const cartPreview = document.getElementById('cartPreview');
  if (cartPreview) {
    cartPreview.classList.remove('open');
  }
}

// Inicializa o carrinho ao carregar
export function initCart() {
  console.log('🛒 Inicializando carrinho...');
  updateCartPreview();
}

// Exportar globalmente para depuração (opcional)
window.updateCartPreview = updateCartPreview;
window.addToCart = addToCart;
window.getCart = getCart;
window.clearCart = clearCart;
window.openCart = openCart;
window.closeCart = closeCart;
