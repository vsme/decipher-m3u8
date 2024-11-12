import CryptoJS from "crypto-js";

// 密钥（16位加密 key 的十六进制表示）
const keyHex = "1234567890ABCDEF"
  .split("")
  .map((c) => c.charCodeAt(0).toString(16))
  .join("");

// 将十六进制密钥转换为 CryptoJS 可用的格式
const key = CryptoJS.enc.Hex.parse(keyHex);

// 通用 AES 解密函数
function decryptAES(encryptedData, outputType = "utf8") {
  // 将二进制数据转换为 WordArray
  const wordArray = CryptoJS.lib.WordArray.create(encryptedData);

  const decrypted = CryptoJS.AES.decrypt(
    wordArray.toString(CryptoJS.enc.Base64),
    key,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  // 根据输出类型返回相应格式的数据
  return outputType === "utf8"
    ? decrypted.toString(CryptoJS.enc.Utf8)
    : new Uint8Array(
        decrypted.words
          .map((word) => [
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff,
          ])
          .flat()
      );
}

// 读取并解密文件，根据文件类型选择解密方式
export async function readAndDecryptFile(file) {
  const response = await fetch(file);
  const encryptedData = await response.arrayBuffer(); // 以二进制格式读取

  // 解密为 UTF-8 字符串（m3u8）或 Uint8Array（二进制 ts 文件）
  return file.endsWith(".m3u8")
    ? decryptAES(encryptedData, "utf8")
    : decryptAES(encryptedData, "binary");
}
