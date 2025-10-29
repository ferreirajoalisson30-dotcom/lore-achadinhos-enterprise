const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

async function atualizarClientes(){
  const tbody = document.getElementById('clientesTable');
  try{
    const res = await fetch('http://localhost:3000/api/clientes', { headers:{ 'Authorization': `Bearer ${token}` } });
    const clientes = await res.json();
    tbody.innerHTML = '';
    clientes.forEach(c=>{
      tbody.innerHTML += `<tr>
        <td>${c.id}</td>
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td>${c.telefone}</td>
        <td>
          <button onclick="editarCliente(${c.id})">Editar</button>
          <button onclick="removerCliente(${c.id})">Remover</button>
        </td>
      </tr>`;
    });
  }catch(err){ console.error(err); }
}

async function adicionarCliente(){
  const nome = prompt('Nome:');
  const email = prompt('Email:');
  const telefone = prompt('Telefone:');
  if(!nome || !email || !telefone) return;
  await fetch('http://localhost:3000/api/clientes', {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, email, telefone })
  });
  atualizarClientes();
}

async function editarCliente(id){
  const nome = prompt('Novo nome:');
  const email = prompt('Novo email:');
  const telefone = prompt('Novo telefone:');
  await fetch(`http://localhost:3000/api/clientes/${id}`, {
    method:'PUT',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, email, telefone })
  });
  atualizarClientes();
}

async function removerCliente(id){
  if(!confirm('Deseja realmente remover?')) return;
  await fetch(`http://localhost:3000/api/clientes/${id}`, {
    method:'DELETE',
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  atualizarClientes();
}
atualizarClientes();