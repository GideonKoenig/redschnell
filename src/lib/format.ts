import { formatTimestamp, type Transcript } from "~/lib/schemas/transcript";

export function formatTranscriptText(
    transcript: Transcript,
    includeTimestamps: boolean,
    includeSpeakers: boolean,
    speakerNames: Record<string, string>,
) {
    return transcript.segments
        .map((segment) => {
            let line = "";
            if (includeTimestamps) {
                line += `[${formatTimestamp(segment.start)}] `;
            }
            if (includeSpeakers && segment.speaker) {
                const displaySpeaker =
                    speakerNames[segment.speaker] ?? segment.speaker;
                line += `${displaySpeaker}: `;
            }
            line += segment.text;
            return line;
        })
        .join("\n");
}

export function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatProcessingTime(ms: number) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}
