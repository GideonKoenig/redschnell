"use client";

import { Clock, Copy, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    WhisperResponseSchema,
    whisperToTranscript,
    formatTimestamp,
    type Transcript,
    type TranscriptSegment,
} from "~/lib/schemas/transcript";

export function TranscriptView(props: { content: unknown }) {
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [showSpeakers, setShowSpeakers] = useState(true);

    const parsed = WhisperResponseSchema.safeParse(props.content);
    if (!parsed.success) {
        return (
            <div className="text-text-muted">
                <p>Unable to parse transcript data.</p>
            </div>
        );
    }

    const transcript = whisperToTranscript(parsed.data);

    const copyAll = () => {
        const text = formatTranscriptText(
            transcript,
            showTimestamps,
            showSpeakers,
        );
        navigator.clipboard.writeText(text);
        toast.success("Transcript copied to clipboard");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant={showTimestamps ? "secondary" : "ghost"}
                    onClick={() => setShowTimestamps(!showTimestamps)}
                >
                    <Clock className="size-4" />
                    Timestamps
                </Button>
                <Button
                    size="sm"
                    variant={showSpeakers ? "secondary" : "ghost"}
                    onClick={() => setShowSpeakers(!showSpeakers)}
                >
                    <User className="size-4" />
                    Speakers
                </Button>
                <div className="flex-1" />
                <Button size="sm" variant="outline" onClick={copyAll}>
                    <Copy className="size-4" />
                    Copy all
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                {transcript.segments.map((segment) => (
                    <SegmentBlock
                        key={segment.id}
                        segment={segment}
                        showTimestamp={showTimestamps}
                        showSpeaker={showSpeakers}
                    />
                ))}
            </div>
        </div>
    );
}

function SegmentBlock(props: {
    segment: TranscriptSegment;
    showTimestamp: boolean;
    showSpeaker: boolean;
}) {
    const copySegment = () => {
        let text = "";
        if (props.showTimestamp) {
            text += `[${formatTimestamp(props.segment.start)}] `;
        }
        if (props.showSpeaker && props.segment.speaker) {
            text += `${props.segment.speaker}: `;
        }
        text += props.segment.text;

        navigator.clipboard.writeText(text);
        toast.success("Segment copied");
    };

    return (
        <button
            onClick={copySegment}
            className="hover:bg-bg-muted group cursor-pointer rounded-md p-2 text-left"
        >
            <div className="flex items-start gap-2">
                {props.showTimestamp && (
                    <span className="text-text-muted shrink-0 font-mono text-xs">
                        [{formatTimestamp(props.segment.start)}]
                    </span>
                )}
                {props.showSpeaker && props.segment.speaker && (
                    <span className="text-accent shrink-0 text-sm font-medium">
                        {props.segment.speaker}:
                    </span>
                )}
                <span className="text-text text-sm leading-relaxed">
                    {props.segment.text}
                </span>
                <Copy className="text-text-muted ml-auto size-4 shrink-0 opacity-0 group-hover:opacity-100" />
            </div>
        </button>
    );
}

function formatTranscriptText(
    transcript: Transcript,
    includeTimestamps: boolean,
    includeSpeakers: boolean,
): string {
    return transcript.segments
        .map((segment) => {
            let line = "";
            if (includeTimestamps) {
                line += `[${formatTimestamp(segment.start)}] `;
            }
            if (includeSpeakers && segment.speaker) {
                line += `${segment.speaker}: `;
            }
            line += segment.text;
            return line;
        })
        .join("\n");
}
