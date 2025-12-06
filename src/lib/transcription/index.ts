import { type Settings } from "~/lib/settings";
import { TRANSCRIPTION_MODELS } from "~/lib/transcription-models";
import { transcribeFal } from "~/lib/transcription/providers/fal";
import { transcribeDeepgram } from "~/lib/transcription/providers/deepgram";

export type {
    TranscriptionResult,
    TranscriptionChunk,
} from "~/lib/transcription/types";

export async function transcribe(
    audioUrl: string,
    settings: Settings,
    durationSeconds: number,
) {
    const config = TRANSCRIPTION_MODELS[settings.transcriptionModel];

    switch (config.provider) {
        case "fal":
            return transcribeFal(
                audioUrl,
                settings,
                config.supportsDiarization,
                durationSeconds,
            );
        case "deepgram":
            return transcribeDeepgram(
                audioUrl,
                settings,
                config.supportsDiarization,
                durationSeconds,
            );
    }
}
