const crypto = require('crypto');
const fs = require('fs');

function generateSecret() {
    // 生成一個隨機的字符串
    const randomString = crypto.randomBytes(64).toString('hex');
    
    // 使用 SHA-256 算法對隨機字符串進行雜湊
    const hash = crypto.createHash('sha256');
    hash.update(randomString);
    const secret = hash.digest('hex');
    
    return secret;
}

function saveSecretToFile(secret, filename) {
    fs.writeFileSync(filename, secret, 'utf8');
}

function readSecretFromFile(filename) {
    try {
        return fs.readFileSync(filename, 'utf8');
    } catch (error) {
        return null;
    }
}

module.exports = {
    generateSecret,
    saveSecretToFile,
    readSecretFromFile
};