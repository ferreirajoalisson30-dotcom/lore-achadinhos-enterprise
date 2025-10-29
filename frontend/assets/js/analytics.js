// Dados simulados
const analyticsData = {
  vendas: 125,
  clientes: 48,
  produtos: 230
};

document.getElementById('totalVendas').innerText = `Total de vendas: ${analyticsData.vendas}`;
document.getElementById('totalClientes').innerText = `Total de clientes: ${analyticsData.clientes}`;
document.getElementById('totalProdutos').innerText = `Total de produtos: ${analyticsData.produtos}`;

console.log('Analytics carregado:', analyticsData);
