import { z } from "zod";

export const TRANSCRIPTION_MODELS = {
    "fal-ai/whisper": {
        label: "Whisper",
        description: "Best overall - supports speaker identification",
        supportsDiarization: true,
    },
    "fal-ai/wizper": {
        label: "Wizper",
        description: "2x faster - same accuracy, no speaker ID",
        supportsDiarization: false,
    },
} as const;

export type TranscriptionModel = keyof typeof TRANSCRIPTION_MODELS;
export const DEFAULT_MODEL: TranscriptionModel = "fal-ai/whisper";

export const transcriptionModelSchema = z.enum(
    Object.keys(TRANSCRIPTION_MODELS) as [
        TranscriptionModel,
        ...TranscriptionModel[],
    ],
);
