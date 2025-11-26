import { z } from "zod";

export const WhisperChunkSchema = z.object({
    timestamp: z.tuple([z.number(), z.number()]),
    text: z.string(),
});

export const WhisperResponseSchema = z.object({
    text: z.string(),
    chunks: z.array(WhisperChunkSchema),
});

export type WhisperResponse = z.infer<typeof WhisperResponseSchema>;
export type WhisperChunk = z.infer<typeof WhisperChunkSchema>;

export const TranscriptSegmentSchema = z.object({
    id: z.string(),
    start: z.number(),
    end: z.number(),
    text: z.string(),
    speaker: z.string().nullable(),
});

export const TranscriptSchema = z.object({
    segments: z.array(TranscriptSegmentSchema),
    fullText: z.string(),
});

export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>;
export type Transcript = z.infer<typeof TranscriptSchema>;

export function whisperToTranscript(whisper: WhisperResponse): Transcript {
    const segments: TranscriptSegment[] = whisper.chunks.map(
        (chunk, index) => ({
            id: `segment-${index}`,
            start: chunk.timestamp[0],
            end: chunk.timestamp[1],
            text: chunk.text.trim(),
            speaker: null,
        }),
    );

    return {
        segments,
        fullText: whisper.text,
    };
}

export function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
