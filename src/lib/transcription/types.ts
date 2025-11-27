import { type TranscriptionModel } from "~/lib/transcription-models";
import { type Result } from "~/lib/try-catch";

export type TranscriptionChunk = {
    start: number;
    end: number;
    text: string;
    speaker: string | null;
};

export type TranscriptionMetadata = {
    priceUsd?: number;
};

export type TranscriptionResult = {
    text: string;
    chunks: TranscriptionChunk[];
    metadata?: TranscriptionMetadata;
};

export type TranscriptionProvider = "fal" | "deepgram";

export type TranscribeFunction = (
    audioUrl: string,
    model: TranscriptionModel,
    supportsDiarization: boolean,
    durationSeconds: number,
) => Promise<Result<TranscriptionResult>>;
