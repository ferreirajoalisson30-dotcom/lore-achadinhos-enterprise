// ==========================
// Lore Achadinhos - Admin JS
// ==========================

const API_URL = "http://localhost:3000/configuracoes";
const form = document.getElementById("configForm");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const themeToggle = document.getElementById("toggle-theme");

// ==========================
// 1. CARREGAR CONFIGURAÇÕES
// ==========================
async function carregarConfiguracoes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (data.length > 0) {
      const cfg = data[0];
      document.getElementById("nomeLoja").value = cfg.nomeLoja || "";
      document.getElementById("temaCor").value = cfg.temaCor || "#ff66a3";
      document.getElementById("idioma").value = cfg.idioma || "pt-BR";
      form.dataset.configId = cfg.id;
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    mostrarToast("❌ Erro ao conectar ao servidor!");
  }
}

// ==========================
// 2. SALVAR CONFIGURAÇÕES
// ==========================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = form.dataset.configId;
  const nomeLoja = document.getElementById("nomeLoja").value.trim();
  const temaCor = document.getElementById("temaCor").value;
  const idioma = document.getElementById("idioma").value;

  if (!nomeLoja) {
    mostrarToast("⚠️ O nome da loja é obrigatório!");
    return;
  }

  const payload = { nomeLoja, temaCor, idioma };

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao salvar configurações");

    abrirModal();
    mostrarToast("✅ Configurações salvas com sucesso!");
  } catch (error) {
    console.error(error);
    mostrarToast("❌ Erro ao salvar configurações!");
  }
});

// ==========================
// 3. MODAL DE SUCESSO
// ==========================
function abrirModal() {
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
});

// ==========================
// 4. TOAST (AVISOS)
// ==========================
function mostrarToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ==========================
// 5. DARK MODE COMPLETO
// ==========================
function aplicarTema(tema) {
  document.body.setAttribute("data-theme", tema);
  localStorage.setItem("theme", tema);
  themeToggle.textContent =
    tema === "dark" ? "☀️ Modo Claro" : "🌙 Modo Escuro";
}

themeToggle.addEventListener("click", () => {
  const temaAtual = document.body.getAttribute("data-theme");
  const novoTema = temaAtual === "dark" ? "light" : "dark";
  aplicarTema(novoTema);
});

// Aplicar tema salvo
document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("theme") || "light";
  aplicarTema(temaSalvo);
  carregarConfiguracoes();
});

// ==========================
// 6. UX MELHORADA
// ==========================
document.addEventListener("input", (e) => {
  if (e.target.matches("input, select")) {
    e.target.classList.add("edited");
  }
});
