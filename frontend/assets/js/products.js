/* products.js
   - tenta carregar /api/products
   - se falhar, carrega assets/img/products/products.json (local)
   - renderiza .product-card com botão "Adicionar ao carrinho"
*/

async function fetchProducts() {
  // primeiro tenta backend
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const body = await res.json();
      if (Array.isArray(body) && body.length) return body;
    }
  } catch (err) {
    console.warn('Backend products not available, loading local JSON', err);
  }

  // fallback local
  try {
    const r = await fetch('/assets/img/products/products.json');
    if (r.ok) return await r.json();
  } catch (err) {
    console.error('Local products.json not found', err);
  }
  return [];
}

function priceFormat(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts(list = []) {
  const container = document.getElementById('products');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
    return;
  }
  container.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>${priceFormat(p.price)}</p>
      <button class="btn add-to-cart" data-id="${p.id}" data-title="${encodeURIComponent(p.title)}" data-price="${p.price}" data-img="${p.img}">Adicionar ao carrinho</button>
    </div>
  `).join('');
  // bind buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const title = decodeURIComponent(btn.dataset.title);
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      addToCart({ id, title, price, img, qty: 1 });
      updateCartCount();
      btn.textContent = 'Adicionado ✓';
      setTimeout(()=> btn.textContent = 'Adicionar ao carrinho', 800);
    });
  });
}

// inicialização
(async function initProducts() {
  const products = await fetchProducts();
  renderProducts(products);
  updateCartCount();
})();
