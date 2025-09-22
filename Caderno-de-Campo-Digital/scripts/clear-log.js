import fs from 'fs';
const logPath = './app.log';
fs.writeFileSync(logPath, '', 'utf8');
console.log('app.log limpo!');