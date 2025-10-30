/* login.js
   Funções:
   - tenta autenticar via backend /api/auth (se existir)
   - se backend não disponível, faz fallback local: aceita admin@lore.com/Admin123! (dev)
   - redireciona por role: 'admin' -> /admin/dashboard.html, 'affiliate' -> /affiliate/dashboard.html, 'client' -> /cliente/dashboard.html
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Tentar login via backend
    try {
      const res = await fetch('/api/auth/login', { // rota backend (if exists)
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json(); // { token, user: { role } }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        redirectByRole(data.user.role);
        return;
      }
      // se não ok, cair no fallback
    } catch (err) {
      // backend não disponível — fallback local
      console.warn('Auth backend not available, using local fallback', err);
    }

    // --- Fallback local (development only) ---
    if (email === 'admin@lore.com' && password === 'Admin123!') {
      const user = { email, role: 'admin', name: 'Administrador' };
      localStorage.setItem('user', JSON.stringify(user));
      redirectByRole('admin');
      return;
    }
    if (email.endsWith('@afiliado.com') && password === 'Aff123!') {
      const user = { email, role: 'affiliate', name: 'Afiliado Teste' };
      localStorage.setItem('user', JSON.stringify(user));
      redirectByRole('affiliate');
      return;
    }
    if (email === 'cliente@teste.com' && password === 'Cliente123!') {
      const user = { email, role: 'client', name: 'Cliente Teste' };
      localStorage.setItem('user', JSON.stringify(user));
      redirectByRole('client');
      return;
    }

    alert('Credenciais inválidas (teste: admin@lore.com / Admin123!)');
  });

  function redirectByRole(role) {
    if (role === 'admin') location.href = '/admin/dashboard.html';
    else if (role === 'affiliate') location.href = '/affiliate/dashboard.html';
    else if (role === 'client') location.href = '/cliente/dashboard.html';
    else location.href = '/'; // fallback
  }
});
