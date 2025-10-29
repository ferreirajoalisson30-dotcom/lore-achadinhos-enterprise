# API - Endpoints principais (resumo)

GET /api/health
POST /api/login  {email, password}

### Autenticação
- Implementação recomendada: JWT (ver backend/.env.example JWT_SECRET)
- Rotas protegidas devem validar token via middleware.

### Próximos passos sugeridos
- Conectar a um DB real (Postgres / MySQL / MongoDB)
- Implementar cadastro, recuperação de senha, roles e permissões
- Validar entrada com express-validator
