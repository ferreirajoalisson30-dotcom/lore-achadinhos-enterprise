# Deploy completo (exemplo)

## Frontend (Vercel / Netlify / S3)
1. Gerar build: `cd frontend && npm install && npm run build`
2. Subir a pasta `frontend/` (conteúdo) para plataforma de hosting estático.
3. Configure domínio e HTTPS.

## Backend (VPS com PM2)
1. No servidor:
   - `git clone <repo>`
   - `cd backend`
   - `npm install`
   - Copie `.env.example` para `.env` e atualize valores (JWT_SECRET, DATABASE_URL, etc).
   - `pm2 start ecosystem.config.js --env production`
2. Configure Nginx como proxy reverso e habilite HTTPS (Let's Encrypt).
3. Monitore logs: `pm2 logs lore-backend`

## Observações
- Substitua os tokens simulados por implementação JWT real ao conectar banco de dados.
- Configure backups do banco e monitore uso de memória/CPU.
