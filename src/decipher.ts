import CryptoJS from 'crypto-js';

// 将十六进制密钥转换为字节数组
function hexToUtf8(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return CryptoJS.enc.Utf8.parse(String.fromCharCode.apply(null, bytes));
}

// 密钥（16位加密 key 的十六进制表示）
const keyHex = '1234567890ABCDEF'.split('').map(c => c.charCodeAt(0).toString(16)).join('');
const key = hexToUtf8(keyHex);

// 解密函数
function decryptAES(encryptedData) {
    // 将二进制数据转换为 WordArray
    const wordArray = CryptoJS.lib.WordArray.create(encryptedData);
    
    const decrypted = CryptoJS.AES.decrypt(wordArray.toString(CryptoJS.enc.Base64), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 解密 TS 文件
function decryptTSAES(encryptedData) {
    // 将二进制数据转换为 WordArray
    const wordArray = CryptoJS.lib.WordArray.create(encryptedData);
    
    const decrypted = CryptoJS.AES.decrypt(wordArray.toString(CryptoJS.enc.Base64), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });

    // 返回解密后的数据，确保返回的是 Uint8Array 格式
    return new Uint8Array(decrypted.words.map(word => [(word >> 24) & 0xff, (word >> 16) & 0xff, (word >> 8) & 0xff, word & 0xff]).flat());
}

// 示例：读取加密文件并解密
export async function readAndDecryptFile(urlPrefix, file) {
    const response = await fetch(urlPrefix + file);
    const encryptedData = await response.arrayBuffer(); // 以二进制格式读取
    
    const decryptedData = file.endsWith('.m3u8') ? decryptAES(encryptedData) : decryptTSAES(encryptedData);

    const blobUrl = URL.createObjectURL(new Blob([decryptedData], { type: file.endsWith('.m3u8') ? 'application/x-mpegURL' : 'video/mp2t' }));
    return blobUrl
}