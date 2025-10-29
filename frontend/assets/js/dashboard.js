<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - Lore Achadinhos</title>
  <link rel="stylesheet" href="../assets/css/admin.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    main {
      padding: 20px;
      background: #fafafa;
      min-height: 100vh;
      overflow-y: auto;
    }

    h1 {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      padding: 20px;
      text-align: center;
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: translateY(-3px);
    }

    .card h3 {
      font-size: 1rem;
      color: #666;
    }

    .card p {
      font-size: 1.6rem;
      color: #e91e63;
      font-weight: bold;
    }

    .charts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .chart-box {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }

    .data-lists {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 20px;
    }

    .data-box {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      padding: 20px;
    }

    .data-box h3 {
      font-size: 1.1rem;
      margin-bottom: 10px;
      color: #444;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      font-size: 0.95rem;
      color: #555;
    }

    li:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2>- Painel Administrativo</h2>
    <nav>
      <a href="dashboard.html" class="active">Dashboard</a>
      <a href="products.html">Produtos</a>
      <a href="orders.html">Pedidos</a>
      <a href="customers.html">Clientes</a>
      <a href="affiliates.html">Afiliados</a>
      <a href="analytics.html">Analytics</a>
      <a href="settings.html">Configurações</a>
    </nav>
  </div>

  <main>
    <h1>Dashboard</h1>

    <section class="cards">
      <div class="card">
        <h3>Total de Vendas</h3>
        <p id="vendas">0</p>
      </div>
      <div class="card">
        <h3>Total de Clientes</h3>
        <p id="clientes">0</p>
      </div>
      <div class="card">
        <h3>Total de Produtos</h3>
        <p id="produtos">0</p>
      </div>
      <div class="card">
        <h3>Total de Afiliados</h3>
        <p id="afiliados">0</p>
      </div>
    </section>

    <section class="charts">
      <div class="chart-box">
        <h3>Vendas Mensais</h3>
        <canvas id="chartVendas"></canvas>
      </div>

      <div class="chart-box">
        <h3>Clientes x Afiliados</h3>
        <canvas id="chartUsuarios"></canvas>
      </div>
    </section>

    <section class="data-lists">
      <div class="data-box">
        <h3>Últimos Pedidos</h3>
        <ul id="ultimosPedidos">
          <li>Carregando...</li>
        </ul>
      </div>

      <div class="data-box">
        <h3>Top Afiliados</h3>
        <ul id="topAfiliados">
          <li>Carregando...</li>
        </ul>
      </div>
    </section>
  </main>

  <script>
    async function carregarDashboard(){
      const token = localStorage.getItem('token');
      if(!token) return window.location.href='index.html';

      try {
        const res = await fetch('http://localhost:3000/api/analytics', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        // Atualiza cards
        document.getElementById('vendas').textContent = data.vendas || 0;
        document.getElementById('clientes').textContent = data.clientes || 0;
        document.getElementById('produtos').textContent = data.produtos || 0;
        document.getElementById('afiliados').textContent = data.afiliados || 0;

        // Gráfico de Vendas
        const ctxVendas = document.getElementById('chartVendas').getContext('2d');
        new Chart(ctxVendas, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [{
              label: 'Vendas',
              data: data.vendasMensais || [10, 20, 15, 25, 30, 45, 35, 50, 40, 60, 70, 90],
              backgroundColor: '#f48fb1'
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } }
          }
        });

        // Gráfico de Clientes x Afiliados
        const ctxUsuarios = document.getElementById('chartUsuarios').getContext('2d');
        new Chart(ctxUsuarios, {
          type: 'pie',
          data: {
            labels: ['Clientes', 'Afiliados'],
            datasets: [{
              data: [data.clientes || 0, data.afiliados || 0],
              backgroundColor: ['#ba68c8', '#f48fb1']
            }]
          },
          options: {
            responsive: true
          }
        });

        // Simula listas
        const pedidos = data.pedidosRecentes || ['Pedido #1023 - R$199,90', 'Pedido #1022 - R$89,90', 'Pedido #1021 - R$259,00'];
        const afiliados = data.topAfiliados || ['Maria Silva', 'Ana Costa', 'Luiza Santos'];

        document.getElementById('ultimosPedidos').innerHTML = pedidos.map(p => `<li>${p}</li>`).join('');
        document.getElementById('topAfiliados').innerHTML = afiliados.map(a => `<li>${a}</li>`).join('');

      } catch (err) {
        console.error(err);
        alert('Erro ao carregar dashboard');
      }
    }

    carregarDashboard();
  </script>
</body>
</html>
