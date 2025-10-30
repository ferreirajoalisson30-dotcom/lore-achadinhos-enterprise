/* cart.js - client-side cart using localStorage
   API:
   - addToCart(item)
   - removeFromCart(id)
   - updateQty(id, qty)
   - getCart()
*/

const CART_KEY = 'lore_cart_v1';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    cart[idx].qty += item.qty || 1;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, parseInt(qty, 10) || 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

function cartTotal() {
  const cart = getCart();
  return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}

function updateCartCount() {
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('nav-cart-count');
  if (el) el.textContent = count;
}

// Render cart on cart page
function renderCart() {
  const container = document.getElementById('cart-container');
  const summary = document.getElementById('cart-summary');
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = '<p>Seu carrinho está vazio.</p>';
    summary.innerHTML = '';
    updateCartCount();
    return;
  }

  container.innerHTML = cart.map(item => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:#fff;margin-bottom:12px;box-shadow:0 6px 12px rgba(0,0,0,0.04);">
      <img src="${item.img}" style="width:80px;height:80px;object-fit:cover;border-radius:8px;">
      <div style="flex:1">
        <strong>${item.title}</strong>
        <div style="margin-top:6px;">${item.price.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
      </div>
      <div>
        <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty" style="width:64px;padding:6px;border-radius:6px;border:1px solid #eee;">
        <div style="margin-top:8px;">
          <button data-remove="${item.id}" class="btn small">Remover</button>
        </div>
      </div>
    </div>
  `).join('');

  summary.innerHTML = `
    <div style="text-align:right;">
      <div style="font-weight:700">Total: ${cartTotal().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
      <div style="margin-top:10px;">
        <button id="checkoutBtn" class="btn">Finalizar Compra (simulado)</button>
        <button id="clearCart" class="btn" style="margin-left:8px;background:#eee;color:#333">Limpar Carrinho</button>
      </div>
    </div>
  `;

  // bind qty change
  document.querySelectorAll('.cart-qty').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      updateQty(id, e.target.value);
    });
  });
  // bind remove
  document.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', (e)=> {
      const id = e.target.dataset.remove;
      removeFromCart(id);
      updateCartCount();
    });
  });

  // checkout (simulado)
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', ()=> {
    alert('Pagamento simulado: pedido criado com sucesso! (dev)');
    clearCart();
    updateCartCount();
    window.location.href = '/cliente/dashboard.html';
  });

  const clearBtn = document.getElementById('clearCart');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (confirm('Deseja limpar o carrinho?')) { clearCart(); updateCartCount(); }
  });

  updateCartCount();
}

// init on cart page
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
  // attach cart count update on custom event (if other scripts fire)
  window.updateCartCount = updateCartCount;
  // expose for products.js
  window.addToCart = addToCart;
});
