import { type Result } from "~/lib/try-catch";

export type TranscriptionChunk = {
    start: number;
    end: number;
    text: string;
    speaker: string | null;
};

export type TranscriptionResult = {
    text: string;
    chunks: TranscriptionChunk[];
};

export type TranscriptionProvider = "fal" | "deepgram";

export type TranscribeFunction = (
    audioUrl: string,
    modelId: string,
    supportsDiarization: boolean,
) => Promise<Result<TranscriptionResult>>;
