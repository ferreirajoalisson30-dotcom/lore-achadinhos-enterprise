const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

async function atualizarTabela(){
  const tbody = document.getElementById('produtosTable');
  try{
    const res = await fetch('http://localhost:3000/api/produtos', {
      headers:{ 'Authorization': `Bearer ${token}` }
    });
    const produtos = await res.json();
    tbody.innerHTML = '';
    produtos.forEach(p=>{
      tbody.innerHTML += `<tr>
        <td>${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.preco}</td>
        <td>${p.estoque}</td>
        <td>
          <button onclick="editarProduto(${p.id})">Editar</button>
          <button onclick="removerProduto(${p.id})">Remover</button>
        </td>
      </tr>`;
    });
  }catch(err){ console.error(err); alert('Erro ao carregar produtos'); }
}

async function adicionarProduto(){
  const nome = prompt('Nome do produto:');
  const preco = prompt('Preço:');
  const estoque = prompt('Estoque:');
  if(!nome || !preco || !estoque) return;
  await fetch('http://localhost:3000/api/produtos', {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, preco, estoque })
  });
  atualizarTabela();
}

async function editarProduto(id){
  const nome = prompt('Novo nome:');
  const preco = prompt('Novo preço:');
  const estoque = prompt('Novo estoque:');
  await fetch(`http://localhost:3000/api/produtos/${id}`, {
    method:'PUT',
    headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ nome, preco, estoque })
  });
  atualizarTabela();
}

async function removerProduto(id){
  if(!confirm('Deseja realmente remover?')) return;
  await fetch(`http://localhost:3000/api/produtos/${id}`, {
    method:'DELETE',
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  atualizarTabela();
}
atualizarTabela();