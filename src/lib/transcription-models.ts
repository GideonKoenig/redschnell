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
    "deepgram/nova-3": {
        label: "Nova 3",
        description: "Best overall",
        supportsDiarization: true,
        provider: "deepgram",
        modelId: "nova-3",
    },
    "deepgram/nova-2": {
        label: "Nova 2",
        description: "Faster and cheaper, slightly less accurate",
        supportsDiarization: true,
        provider: "deepgram",
        modelId: "nova-2",
    },
    "fal-ai/whisper": {
        label: "Whisper",
        description: "The original, reliable standby",
        supportsDiarization: true,
        provider: "fal",
        modelId: "fal-ai/whisper",
    },
    "fal-ai/wizper": {
        label: "Wizper",
        description: "Cheap and fast, no speaker ID",
        supportsDiarization: false,
        provider: "fal",
        modelId: "fal-ai/wizper",
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
