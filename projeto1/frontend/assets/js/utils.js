// =========================================
// 💎 LORE ACHADINHOS - UTILITÁRIOS GERAIS
// =========================================

// 🔐 Evita injeção de HTML malicioso
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 💰 Formata valores para Real Brasileiro (R$)
export function formatBRL(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// ============================
// 🎉 SISTEMA DE TOASTS (AVISOS)
// ============================

export function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-message">${escapeHtml(message)}</div>
  `;

  container.appendChild(toast);

  // Animação para remover o toast depois do tempo definido
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================
// 🧊 SISTEMA DE MODAIS
// ============================

// Abre um modal pelo ID
export function openModal(modalId) {
  const modalOverlay = document.getElementById(modalId);
  if (!modalOverlay) {
    console.warn(`⚠️ Modal com ID "${modalId}" não encontrado.`);
    return;
  }

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Fecha um modal pelo ID
export function closeModal(modalId) {
  const modalOverlay = document.getElementById(modalId);
  if (!modalOverlay) return;

  modalOverlay.setAttribute('aria-hidden', 'true');
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Fecha o modal clicando fora dele
document.addEventListener('click', (e) => {
  const openModals = document.querySelectorAll('.modal-overlay.open');
  openModals.forEach((modal) => {
    const content = modal.querySelector('.modal');
    if (content && !content.contains(e.target) && !e.target.closest('.view-product-btn')) {
      closeModal(modal.id);
    }
  });
});

// ============================
// 📱 INTERAÇÃO GLOBAL
// ============================

// Fecha o modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal-overlay.open');
    openModals.forEach((modal) => closeModal(modal.id));
  }
});

// Abre o carrinho clicando em um ícone global (se existir)
document.addEventListener('click', (e) => {
  const cartButton = e.target.closest('#cartIcon, .open-cart-btn');
  if (cartButton) {
    const cartPreview = document.getElementById('cartPreview');
    if (cartPreview) cartPreview.classList.add('open');
  }
});
