import {
    TRANSCRIPTION_MODELS,
    type TranscriptionModel,
} from "~/lib/transcription-models";
import { transcribeFal } from "~/lib/transcription/providers/fal";
import { transcribeDeepgram } from "~/lib/transcription/providers/deepgram";

export type {
    TranscriptionResult,
    TranscriptionChunk,
} from "~/lib/transcription/types";

export async function transcribe(
    audioUrl: string,
    model: TranscriptionModel,
    durationSeconds: number,
) {
    const config = TRANSCRIPTION_MODELS[model];

    switch (config.provider) {
        case "fal":
            return transcribeFal(
                audioUrl,
                model,
                config.supportsDiarization,
                durationSeconds,
            );
        case "deepgram":
            return transcribeDeepgram(
                audioUrl,
                model,
                config.supportsDiarization,
                durationSeconds,
            );
    }
}
