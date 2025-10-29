const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

async function atualizarAfiliados(){
  const tbody = document.getElementById('afiliadosTable');
  try{
    const res = await fetch('http://localhost:3000/api/afiliados', { headers:{ 'Authorization': `Bearer ${token}` } });
    const afiliados = await res.json();
    tbody.innerHTML = '';
    afiliados.forEach(a=>{
      tbody.innerHTML += `<tr>
        <td>${a.id}</td>
        <td>${a.nome}</td>
        <td>${a.email}</td>
        <td>${a.comissao}</td>
        <td>
          <button onclick="editarAfiliado(${a.id})">Editar</button>
          <button onclick="removerAfiliado(${a.id})">Remover</button>
        </td>
      </tr>`;
    });
  }catch(err){ console.error(err); }
}

async function adicionarAfiliado(){
  const nome = prompt('Nome:');
  const email = prompt('Email:');
  const comissao = prompt('Comissão:');
  if(!nome || !email || !comissao) return;
  await fetch('http://localhost:3000/api/afiliados', {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, email, comissao })
  });
  atualizarAfiliados();
}

async function editarAfiliado(id){
  const nome = prompt('Novo nome:');
  const email = prompt('Novo email:');
  const comissao = prompt('Nova comissão:');
  await fetch(`http://localhost:3000/api/afiliados/${id}`, {
    method:'PUT',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, email, comissao })
  });
  atualizarAfiliados();
}

async function removerAfiliado(id){
  if(!confirm('Deseja realmente remover?')) return;
  await fetch(`http://localhost:3000/api/afiliados/${id}`, {
    method:'DELETE',
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  atualizarAfiliados();
}
atualizarAfiliados();