# Manual de uso (rápido)

1. Baixe o zip e extraia.
2. Frontend:
   - `cd frontend`
   - `npm install` (dev tools para build)
   - `npm run build`
   - Hospede a pasta `frontend` num host estático.
3. Backend:
   - `cd backend`
   - `npm install`
   - configurar `.env` baseado em `.env.example`
   - `pm2 start ecosystem.config.js --env production`
4. CI:
   - O workflow GitHub Actions `ci.yml` gera o zip automaticamente na pipeline.
