const utils = require('./utils');
const keys = require('./keys');

const plainText = '你好,我是程序猿小卡';
// 用公钥加密
const crypted = utils.encrypt(plainText, keys.pubKey);
// 用私钥解密
const decrypted = utils.decrypt(crypted, keys.privKey);

console.log(decrypted.toString());
