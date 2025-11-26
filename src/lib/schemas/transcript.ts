import { z } from "zod";

export const WhisperChunkSchema = z.object({
    timestamp: z.tuple([z.number(), z.number().nullable()]),
    text: z.string(),
    speaker: z.string().nullish(),
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
    speakerNames: z.record(z.string(), z.string()).optional(),
});

export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>;
export type Transcript = z.infer<typeof TranscriptSchema>;

export function whisperToTranscript(whisper: WhisperResponse): Transcript {
    const segments: TranscriptSegment[] = whisper.chunks.map(
        (chunk, index) => ({
            id: `segment-${index}`,
            start: chunk.timestamp[0],
            end: chunk.timestamp[1] ?? chunk.timestamp[0],
            text: chunk.text.trim(),
            speaker: chunk.speaker ?? null,
        }),
    );

    return {
        segments,
        fullText: whisper.text,
    };
}

export function collapseConsecutiveSpeakers(
    transcript: Transcript,
): Transcript {
    if (transcript.segments.length === 0) {
        return transcript;
    }

    const collapsed: TranscriptSegment[] = [];
    let current = { ...transcript.segments[0]! };

    for (let i = 1; i < transcript.segments.length; i++) {
        const segment = transcript.segments[i]!;
        const sameSpeaker =
            segment.speaker === null || current.speaker === segment.speaker;

        if (sameSpeaker) {
            current = {
                ...current,
                end: segment.end,
                text: `${current.text} ${segment.text}`,
            };
        } else {
            collapsed.push(current);
            current = { ...segment };
        }
    }

    collapsed.push(current);

    return {
        segments: collapsed,
        fullText: transcript.fullText,
    };
}

export function formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getUniqueSpeakers(segments: TranscriptSegment[]): string[] {
    const speakers = new Set<string>();
    for (const segment of segments) {
        if (segment.speaker) {
            speakers.add(segment.speaker);
        }
    }
    return Array.from(speakers).sort();
}
