import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg, queueConversion } from "~/lib/converter/ffmpeg";
import {
    tryCatch,
    newError,
    TryCatchError,
    Failure,
    Success,
    type Result,
} from "~/lib/try-catch";

export { cancelConversion } from "~/lib/converter/ffmpeg";

export async function convertAudio(
    id: string,
    file: File,
    onProgress?: (progress: number) => void,
    onStart?: () => void,
): Promise<Result<File>> {
    const queueResult = await tryCatch(
        queueConversion(
            id,
            (signal) => doConvert(file, onProgress, signal),
            onStart,
        ),
    );

    if (!queueResult.success) {
        return new Failure(newError(queueResult.error));
    }

    return queueResult.data;
}

async function doConvert(
    file: File,
    onProgress: ((progress: number) => void) | undefined,
    signal: AbortSignal,
): Promise<Result<File>> {
    const ffmpegResult = await tryCatch(getFFmpeg());
    if (!ffmpegResult.success) {
        const err = newError(ffmpegResult.error);
        return new Failure(
            new TryCatchError(
                "FFmpeg Load Error",
                `Failed to load FFmpeg: ${err.message}`,
            ),
        );
    }
    const ffmpeg = ffmpegResult.data;

    const inputName = `input${getExtension(file.name)}`;
    const outputName = `output.mp3`;

    const progressHandler = ({ progress }: { progress: number }) => {
        onProgress?.(Math.round(progress * 100));
    };

    const cleanup = async () => {
        ffmpeg.off("progress", progressHandler);
        await tryCatch(ffmpeg.deleteFile(inputName));
        await tryCatch(ffmpeg.deleteFile(outputName));
    };

    ffmpeg.on("progress", progressHandler);

    const writeResult = await tryCatch(
        ffmpeg.writeFile(inputName, await fetchFile(file)),
    );
    if (!writeResult.success) {
        await cleanup();
        const err = newError(writeResult.error);
        return new Failure(
            new TryCatchError(
                "File Read Error",
                `Failed to read input file: ${err.message}`,
            ),
        );
    }

    const execResult = await tryCatch(
        ffmpeg.exec(
            [
                "-i",
                inputName,
                "-vn",
                "-c:a",
                "libmp3lame",
                "-b:a",
                "64k",
                outputName,
            ],
            undefined,
            { signal },
        ),
    );
    if (!execResult.success) {
        await cleanup();
        const err = newError(execResult.error);
        return new Failure(
            new TryCatchError(
                "Conversion Error",
                `Conversion failed: ${err.message}`,
            ),
        );
    }

    const readResult = await tryCatch(ffmpeg.readFile(outputName));

    if (!readResult.success) {
        await cleanup();
        const err = newError(readResult.error);
        return new Failure(
            new TryCatchError(
                "Output Read Error",
                `Failed to read converted file: ${err.message}`,
            ),
        );
    }

    await cleanup();

    const uint8 = new Uint8Array(readResult.data as Uint8Array);
    const blob = new Blob([uint8], { type: "audio/mpeg" });
    const baseName = file.name.replace(/\.[^/.]+$/, "");

    return new Success(
        new File([blob], `${baseName}.mp3`, { type: "audio/mpeg" }),
    );
}

function getExtension(filename: string) {
    const match = /\.[^/.]+$/.exec(filename);
    return match?.[0] ?? "";
}
