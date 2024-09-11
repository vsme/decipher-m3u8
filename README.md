# 解密 m3u8 文件

这个项目是一个使用 HLS.js 播放加密视频流的示例。项目的主要功能是读取和解密加密的 m3u8 文件和 TS 文件，并通过 HLS.js 播放解密后的内容。

## 此项目价值 100 刀

详见链接：[100u 有偿请前端老哥实现解密播放 m3u8 文件](https://www.v2ex.com/t/1071836)

## 项目结构

- `src/main.ts`: 项目的主入口，负责初始化 HLS.js 并处理加密文件的解密和播放。
- `src/decipher.ts`: 包含解密函数，用于解密加密的 m3u8 和 TS 文件。
- `public/encrypt/index.m3u8`: 加密的 m3u8 文件示例。
- `public/m3u8/index.m3u8`: 未加密的 m3u8 文件示例。
- `index.html`: 包含一个 video 元素，用于播放视频。

## 使用方法

1. **安装依赖**:
    ```bash
    pnpm i
    ```

2. **启动开发服务器**:
    ```bash
    pnpm dev
    ```

3. **访问项目**:
    打开浏览器并访问 `http://localhost:3000`，你会看到一个 video 元素。

4. **播放加密视频**:
    - 项目会自动读取并解密 `public/encrypt/index.m3u8` 文件，然后通过 HLS.js 播放解密后的内容。
