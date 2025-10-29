const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

async function atualizarPedidos(){
  const tbody = document.getElementById('pedidosTable');
  try{
    const res = await fetch('http://localhost:3000/api/pedidos', { headers:{ 'Authorization': `Bearer ${token}` } });
    const pedidos = await res.json();
    tbody.innerHTML = '';
    pedidos.forEach(p=>{
      tbody.innerHTML += `<tr>
        <td>${p.id}</td>
        <td>${p.cliente}</td>
        <td>${p.produto}</td>
        <td>${p.quantidade}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="editarPedido(${p.id})">Editar</button>
          <button onclick="removerPedido(${p.id})">Remover</button>
        </td>
      </tr>`;
    });
  }catch(err){ console.error(err); }
}

async function adicionarPedido(){
  const cliente = prompt('Cliente:');
  const produto = prompt('Produto:');
  const quantidade = prompt('Quantidade:');
  const status = prompt('Status:');
  if(!cliente || !produto || !quantidade || !status) return;
  await fetch('http://localhost:3000/api/pedidos', {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ cliente, produto, quantidade, status })
  });
  atualizarPedidos();
}

async function editarPedido(id){
  const cliente = prompt('Novo cliente:');
  const produto = prompt('Novo produto:');
  const quantidade = prompt('Nova quantidade:');
  const status = prompt('Novo status:');
  await fetch(`http://localhost:3000/api/pedidos/${id}`, {
    method:'PUT',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ cliente, produto, quantidade, status })
  });
  atualizarPedidos();
}

async function removerPedido(id){
  if(!confirm('Deseja realmente remover?')) return;
  await fetch(`http://localhost:3000/api/pedidos/${id}`, {
    method:'DELETE',
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  atualizarPedidos();
}
atualizarPedidos();