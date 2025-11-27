import { type TranscriptionModel } from "~/lib/transcription-models";

// Fal.ai: charged per compute second ($0.00125)
// Processing speed varies by model (compute seconds per audio second)
const FAL_PRICE_PER_COMPUTE_SECOND = 0.00125;
const FAL_COMPUTE_RATIO = {
    "fal-ai/whisper": 0.5, // ~2x real-time
    "fal-ai/wizper": 0.25, // ~4x real-time
} as const;

export const PRICE_PER_AUDIO_MINUTE: Record<TranscriptionModel, number> = {
    "deepgram/nova-3": 0.0043,
    "deepgram/nova-2": 0.0036,
    "fal-ai/whisper":
        FAL_PRICE_PER_COMPUTE_SECOND * FAL_COMPUTE_RATIO["fal-ai/whisper"] * 60,
    "fal-ai/wizper":
        FAL_PRICE_PER_COMPUTE_SECOND * FAL_COMPUTE_RATIO["fal-ai/wizper"] * 60,
};

export function calculatePrice(
    durationSeconds: number,
    modelId: TranscriptionModel,
) {
    return (durationSeconds / 60) * PRICE_PER_AUDIO_MINUTE[modelId];
}
