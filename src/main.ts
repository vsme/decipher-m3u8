import Hls from "hls.js";
import { readAndDecryptFile } from "./decipher.js";

// url 前缀
const urlPrefix = "/encrypt";

// 加密 m3u8 文件的播放方式
if (Hls.isSupported()) {
  const m3u8FilePath = "/index.m3u8"; // 原始加密 m3u8 文件路径
  // 使用示例
  const blobUrl = await readAndDecryptFile(urlPrefix, m3u8FilePath);

  const video = document.getElementById("video") as HTMLVideoElement; // 明确指定类型
  const hls = new Hls();

  hls.loadSource(blobUrl);
  hls.attachMedia(video);
  // 在 FRAG_LOADING 事件中处理 TS 文件请求
  hls.on(Hls.Events.FRAG_LOADING, async (event, data) => {
    const originalUrl = data.frag.url;

    // 处理 TS 文件的 URL，例如修改 URL
    const modifiedUrl = originalUrl.replace(`blob:${window.location.origin}`, "");

    // 直接解密新的 URL，而不请求原来的地址
    const decryptedBlobUrl = await readAndDecryptFile(urlPrefix, modifiedUrl);
    data.frag.url = decryptedBlobUrl; // 更新请求的 URL
  });

  // 添加用户交互事件以允许播放
  document.addEventListener("click", function() {
      // 直接使用解密后的 .ts 文件地址
      video.addEventListener("loadedmetadata", function () {
        video.play();
      });
  });
}

// 以下是未加密的 m3u8 文件的播放方式
// if (Hls.isSupported()) {
//   const video = document.getElementById("video") as HTMLVideoElement; // 明确指定类型
//   const hls = new Hls();
//   hls.loadSource("/m3u8/index.m3u8");
//   hls.attachMedia(video);
//   hls.on(Hls.Events.MANIFEST_PARSED, function () {
//     video.play();
//   });
// } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//   video.src = "/m3u8/index.m3u8";
//   video.addEventListener("loadedmetadata", function () {
//     video.play();
//   });
// }
