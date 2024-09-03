const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test.local') });

console.log('Testumgebung Umgebungsvariablen:');
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_HOST:', process.env.DB_HOST);
