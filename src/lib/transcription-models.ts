import { z } from "zod";
import { type TranscriptionProvider } from "~/lib/transcription/types";

type ModelConfig = {
    label: string;
    description: string;
    supportsDiarization: boolean;
    provider: TranscriptionProvider;
    modelId: string;
};

const MODELS = {
    "fal-ai/whisper": {
        label: "Whisper",
        description: "Best overall - supports speaker identification",
        supportsDiarization: true,
        provider: "fal",
        modelId: "fal-ai/whisper",
    },
    "fal-ai/wizper": {
        label: "Wizper",
        description: "2x faster - same accuracy, no speaker ID",
        supportsDiarization: false,
        provider: "fal",
        modelId: "fal-ai/wizper",
    },
    "deepgram/nova-3": {
        label: "Nova 3",
        description: "Deepgram's latest - highest accuracy",
        supportsDiarization: true,
        provider: "deepgram",
        modelId: "nova-3",
    },
    "deepgram/nova-2": {
        label: "Nova 2",
        description: "Deepgram - fast and accurate",
        supportsDiarization: true,
        provider: "deepgram",
        modelId: "nova-2",
    },
} as const satisfies Record<string, ModelConfig>;

export type TranscriptionModel = keyof typeof MODELS;

export const TRANSCRIPTION_MODELS: Record<TranscriptionModel, ModelConfig> =
    MODELS;

export const DEFAULT_MODEL: TranscriptionModel = "deepgram/nova-3";

export const transcriptionModelSchema = z.enum(
    Object.keys(TRANSCRIPTION_MODELS) as [
        TranscriptionModel,
        ...TranscriptionModel[],
    ],
);
