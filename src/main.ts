import Hls from "hls.js";
import { readAndDecryptFile } from "./decipher.js";

const m3u8FilePath = "/encrypt/index.m3u8"; // 原始加密 m3u8 文件路径

// 加密 m3u8 文件的播放方式
if (Hls.isSupported()) {
  const video = document.getElementById("video") as HTMLVideoElement; // 明确指定类型

  class CustomLoader extends Hls.DefaultConfig.loader {
    constructor(config) {
      super(config);
      const load = this.load.bind(this);

      this.load = async function (context, config, callbacks) {
        const onSuccess = callbacks.onSuccess;
        callbacks.onSuccess = async function (response, stats, context) {
          try {
            const decryptedData = await readAndDecryptFile(context.url);
            response.data = decryptedData;
            onSuccess(response, stats, context, null);
          } catch (err) {
            console.error(err);
          }
        };
        load(context, config, callbacks);
      };
    }
  }

  const hls = new Hls({ loader: CustomLoader });

  hls.loadSource(m3u8FilePath);
  hls.attachMedia(video);

  // 添加用户交互事件以允许播放
  document.addEventListener("click", function () {
    const onLoadedMetadata = function () {
      video.play();
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
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
