/*
  Script usado pelo workflow de CI para criar LoreAchadinhos-v3-pro-final.zip
  Ele coleta os diretórios frontend, backend e docs.
*/
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const outPath = path.join(__dirname,'..','LoreAchadinhos-v3-pro-final.zip');
const output = fs.createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 }});

output.on('close', ()=> console.log('Created', outPath, archive.pointer(), 'bytes'));
archive.pipe(output);

['frontend','backend','docs','README.md','package.json'].forEach(p=>{
  const full = path.join(__dirname,'..',p);
  if(fs.existsSync(full)){
    const stats = fs.statSync(full);
    if(stats.isDirectory()) archive.directory(full, p);
    else archive.file(full, {name: p});
  }
});
archive.finalize();
