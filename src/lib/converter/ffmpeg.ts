import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg() {
    if (ffmpeg?.loaded) return ffmpeg;

    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        const instance = new FFmpeg();

        await instance.load({
            coreURL: "/ffmpeg/ffmpeg-core.js",
            wasmURL: "/ffmpeg/ffmpeg-core.wasm",
        });

        ffmpeg = instance;
        return instance;
    })();

    return loadPromise;
}

export function isFFmpegLoaded() {
    return ffmpeg?.loaded ?? false;
}
