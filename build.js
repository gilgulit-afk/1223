const fs = require('fs');
fs.mkdirSync('public', { recursive: true });
fs.copyFileSync('index.html', 'public/index.html');
console.log('ok');
