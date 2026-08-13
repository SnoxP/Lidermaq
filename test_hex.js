const fs = require('fs');
const buffer = fs.readFileSync('public/assets/hero-desktop.png');
console.log(buffer.slice(0, 32).toString('hex'));
