const fs = require('fs');
fs.mkdirSync('public', { recursive: true });
fs.copyFileSync('index.html', 'public/index.html');
fs.copyFileSync('anima-flyer.webp', 'public/anima-flyer.webp');
console.log('ok');
