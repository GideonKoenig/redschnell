import { fetchFile } from "@ffmpeg/util";
import { getFFmpeg } from "~/lib/converter/ffmpeg";
import {
    tryCatch,
    newError,
    TryCatchError,
    Failure,
    Success,
    type Result,
} from "~/lib/try-catch";

export async function convertAudio(
    file: File,
    onProgress?: (progress: number) => void,
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

    const inputName = "input" + getExtension(file.name);
    const outputName = "output.mp3";

    const progressHandler = ({ progress }: { progress: number }) => {
        onProgress?.(Math.round(progress * 100));
    };

    ffmpeg.on("progress", progressHandler);

    const writeResult = await tryCatch(
        ffmpeg.writeFile(inputName, await fetchFile(file)),
    );
    if (!writeResult.success) {
        ffmpeg.off("progress", progressHandler);
        const err = newError(writeResult.error);
        return new Failure(
            new TryCatchError(
                "File Read Error",
                `Failed to read input file: ${err.message}`,
            ),
        );
    }

    const execResult = await tryCatch(
        ffmpeg.exec([
            "-i",
            inputName,
            "-vn",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "64k",
            outputName,
        ]),
    );
    if (!execResult.success) {
        ffmpeg.off("progress", progressHandler);
        const err = newError(execResult.error);
        return new Failure(
            new TryCatchError(
                "Conversion Error",
                `Conversion failed: ${err.message}`,
            ),
        );
    }

    const readResult = await tryCatch(ffmpeg.readFile(outputName));
    ffmpeg.off("progress", progressHandler);

    if (!readResult.success) {
        const err = newError(readResult.error);
        return new Failure(
            new TryCatchError(
                "Output Read Error",
                `Failed to read converted file: ${err.message}`,
            ),
        );
    }

    await tryCatch(ffmpeg.deleteFile(inputName));
    await tryCatch(ffmpeg.deleteFile(outputName));

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
