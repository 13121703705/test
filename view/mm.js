const crypto = require('crypto');

const privateKey = crypto.randomBytes(32);
const pass = privateKey.toString('hex');
console.log(pass);
