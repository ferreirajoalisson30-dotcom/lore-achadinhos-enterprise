document.getElementById('loginForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try{
    const res = await fetch('http://localhost:3000/api/login', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if(res.ok){
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    }else{
      alert(data.message || 'Erro no login');
    }
  }catch(err){
    console.error(err);
    alert('Erro ao conectar ao servidor');
  }
});