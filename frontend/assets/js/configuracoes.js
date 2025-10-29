const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

async function carregarConfiguracoes(){
  const res = await fetch('http://localhost:3000/api/configuracoes', { headers:{ 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  document.getElementById('nomeLoja').value = data.nomeLoja;
  document.getElementById('emailLoja').value = data.email;
  document.getElementById('telefoneLoja').value = data.telefone;
}

async function salvarConfiguracoes(){
  const nome = document.getElementById('nomeLoja').value;
  const email = document.getElementById('emailLoja').value;
  const telefone = document.getElementById('telefoneLoja').value;
  await fetch('http://localhost:3000/api/configuracoes', {
    method:'PUT',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nomeLoja:nome, email, telefone })
  });
  alert('Configurações salvas com sucesso!');
}
carregarConfiguracoes();