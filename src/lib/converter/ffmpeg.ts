import { FFmpeg } from "@ffmpeg/ffmpeg";
import { tryCatch } from "~/lib/try-catch";

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

export function terminateFFmpeg() {
    if (ffmpeg) {
        ffmpeg.terminate();
        ffmpeg = null;
        loadPromise = null;
    }
}

export function isFFmpegLoaded() {
    return ffmpeg?.loaded ?? false;
}

type QueueItem<T> = {
    id: string;
    task: (signal: AbortSignal) => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
    onStart?: () => void;
};

const queue: QueueItem<unknown>[] = [];
let isProcessing = false;
const abortControllers = new Map<string, AbortController>();

async function processQueue() {
    if (isProcessing || queue.length === 0) return;

    isProcessing = true;
    const item = queue.shift()!;

    const controller = new AbortController();
    abortControllers.set(item.id, controller);

    item.onStart?.();

    const result = await tryCatch(item.task(controller.signal));
    abortControllers.delete(item.id);

    if (result.success) {
        item.resolve(result.data);
    } else {
        item.reject(result.error);
    }

    isProcessing = false;
    processQueue();
}

export function queueConversion<T>(
    id: string,
    task: (signal: AbortSignal) => Promise<T>,
    onStart?: () => void,
): Promise<T> {
    return new Promise((resolve, reject) => {
        queue.push({
            id,
            task,
            resolve,
            reject,
            onStart,
        } as QueueItem<unknown>);
        processQueue();
    });
}

export function cancelConversion(id: string) {
    const index = queue.findIndex((item) => item.id === id);
    if (index !== -1) {
        const item = queue.splice(index, 1)[0]!;
        item.reject(new Error("Cancelled"));
    } else {
        const controller = abortControllers.get(id);
        if (controller) {
            controller.abort();
            terminateFFmpeg();
        }
    }
}
