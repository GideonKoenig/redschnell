import { fal } from "@fal-ai/client";
import { env } from "~/env";
import { tryCatch, Success } from "~/lib/try-catch";
import { calculatePrice } from "~/lib/transcription/pricing";
import {
    type TranscribeFunction,
    type TranscriptionResult,
} from "~/lib/transcription/types";

fal.config({ credentials: env.FAL_KEY });

type FalWhisperChunk = {
    timestamp: [number, number | null];
    text: string;
    speaker?: string | null;
};

type FalWhisperResponse = {
    text: string;
    chunks: FalWhisperChunk[];
};

function normalizeResponse(response: FalWhisperResponse): TranscriptionResult {
    return {
        text: response.text,
        chunks: response.chunks.map((chunk) => ({
            start: chunk.timestamp[0],
            end: chunk.timestamp[1] ?? chunk.timestamp[0],
            text: chunk.text.trim(),
            speaker: chunk.speaker ?? null,
        })),
    };
}

export const transcribeFal: TranscribeFunction = async (
    audioUrl,
    model,
    supportsDiarization,
    durationSeconds,
) => {
    const result = await tryCatch(
        fal.subscribe(model, {
            input: {
                audio_url: audioUrl,
                task: "transcribe",
                chunk_level: "segment",
                diarize: supportsDiarization,
            },
        }),
    );

    if (!result.success) return result;

    const data = result.data.data as FalWhisperResponse;
    const priceUsd = calculatePrice(durationSeconds, model);

    return new Success({
        ...normalizeResponse(data),
        metadata: { priceUsd },
    });
};
