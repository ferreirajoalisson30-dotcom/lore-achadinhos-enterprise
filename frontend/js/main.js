const API = window.__API_BASE__ || 'http://localhost:4000/api';
async function load(){
  try{
    const res = await fetch(API + '/products');
    const data = await res.json();
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = data.map(p => `
      <div class="product-card">
        <img src="${p.images?.[0] || 'assets/banners/placeholder.png'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="price">R$ ${p.price?.toFixed(2) || '0.00'}</div>
        <a class="button" href="/client/product.html?id=${p._id}">Ver</a>
      </div>
    `).join('');
  }catch(err){
    console.error(err);
  }
}
document.addEventListener('DOMContentLoaded', load);
