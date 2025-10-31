// script-gerar-loreachadinhos.js
// Script Node.js para criar automaticamente a estrutura do pacote Lore Achadinhos e gerar um .zip final

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const projectName = 'LoreAchadinhos-v3-pro';
const basePath = path.join(process.cwd(), projectName);

// Estrutura de pastas
const folders = [
'backend/routes',
'backend/controllers',
'backend/models',
'backend/middlewares',
'backend/utils',
'backend/config',
'frontend/assets/css',
'frontend/assets/js',
'frontend/assets/images',
'frontend/admin'
];

// Arquivos de exemplo (vazios ou com conteúdo inicial)
const files = [
{ path: 'backend/package.json', content: '{\n  "name": "backend",\n  "version": "1.0.0"\n}' },
{ path: 'backend/.env.example', content: 'PORT=5000\nJWT_SECRET=suachavesecreta\nDB_URI=mongodb://localhost:27017/loreachadinhos\nSTRIPE_KEY=test_sk_123456' },
{ path: 'backend/server.js', content: '// Arquivo principal do backend' },
{ path: 'backend/routes/auth.js', content: '' },
{ path: 'backend/routes/products.js', content: '' },
{ path: 'backend/routes/orders.js', content: '' },
{ path: 'backend/routes/admin.js', content: '' },
{ path: 'backend/config/db.js', content: '' },
{ path: 'frontend/package.json', content: '{\n  "name": "frontend",\n  "version": "1.0.0"\n}' },
{ path: 'frontend/index.html', content: '<!-- Página principal -->' },
{ path: 'frontend/produtos.html', content: '<!-- Página de produtos -->' },
{ path: 'frontend/carrinho.html', content: '<!-- Página de carrinho -->' },
{ path: 'frontend/admin/dashboard.html', content: '<!-- Painel Admin -->' },
{ path: 'frontend/assets/css/style.css', content: '/* CSS original */' },
{ path: 'frontend/assets/css/style.min.css', content: '/* CSS minificado */' },
{ path: 'frontend/assets/js/main.js', content: '' },
{ path: 'frontend/assets/js/config.js', content: '' },
{ path: 'frontend/admin/admin.js', content: '' },
{ path: 'README.md', content: '# Lore Achadinhos v3 Pro' },
{ path: 'backend/settings.json', content: JSON.stringify({ primaryColor: '#c9a0dc', secondaryColor: '#f8d0e3', fontFamily: 'Poppins', fontSize: '16' }, null, 2) }
];

// Criar pastas
folders.forEach(folder => {
const folderPath = path.join(basePath, folder);
fs.mkdirSync(folderPath, { recursive: true });
});

// Criar arquivos
files.forEach(file => {
const filePath = path.join(basePath, file.path);
fs.writeFileSync(filePath, file.content);
});

// Gerar arquivo .zip
const output = fs.createWriteStream(`${projectName}.zip`);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
console.log(`${archive.pointer()} total bytes`);
console.log(`Arquivo ${projectName}.zip criado com sucesso!`);
});

archive.on('error', err => { throw err; });

archive.pipe(output);
archive.directory(basePath, projectName);
archive.finalize();

console.log('Gerando estrutura do pacote e zipando...');
