/*
 Entrypoint para produção. Deve ter as dependências instaladas.
 Exemplo de execução com PM2:
   cd backend
   npm install
   pm2 start ecosystem.config.js --env production
*/
require('./dist/server.js');
