"use client";

import { Clock, Copy, Loader2, RefreshCw, RotateCcw, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    TranscriptSchema,
    formatTimestamp,
    type Transcript,
    type TranscriptSegment,
} from "~/lib/schemas/transcript";
import {
    TRANSCRIPTION_MODELS,
    TranscriptionModel,
} from "~/lib/transcription-models";
import { api } from "~/trpc/react";

export function TranscriptView(props: {
    content: unknown;
    sourceId: string;
    model: TranscriptionModel;
    onRetry: () => void;
    isRetrying: boolean;
}) {
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [showSpeakers, setShowSpeakers] = useState(true);

    const utils = api.useUtils();
    const reprocessMutation = api.transcripts.reprocess.useMutation({
        onSuccess: () => {
            utils.transcripts.get.invalidate({ sourceId: props.sourceId });
            toast.success("Transcript reprocessed");
        },
        onError: () => {
            toast.error("Failed to reprocess transcript");
        },
    });

    const parsed = TranscriptSchema.safeParse(props.content);
    if (!parsed.success) {
        return (
            <div className="text-text-muted space-y-4">
                <p>Unable to parse transcript data.</p>
                <details className="text-xs">
                    <summary className="cursor-pointer">Parse error</summary>
                    <pre className="bg-bg-muted mt-2 overflow-auto rounded p-2">
                        {JSON.stringify(parsed.error.format(), null, 2)}
                    </pre>
                </details>
                <details className="text-xs">
                    <summary className="cursor-pointer">Received data</summary>
                    <pre className="bg-bg-muted mt-2 overflow-auto rounded p-2">
                        {JSON.stringify(props.content, null, 2)}
                    </pre>
                </details>
            </div>
        );
    }

    const transcript = parsed.data;

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
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center gap-2 p-3">
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
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={props.onRetry}
                    disabled={props.isRetrying}
                >
                    {props.isRetrying ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <RotateCcw className="size-4" />
                    )}
                    Retranscribe
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                        reprocessMutation.mutate({ sourceId: props.sourceId })
                    }
                    disabled={reprocessMutation.isPending}
                >
                    {reprocessMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <RefreshCw className="size-4" />
                    )}
                    Reprocess
                </Button>
                <Button size="sm" variant="outline" onClick={copyAll}>
                    <Copy className="size-4" />
                    Copy all
                </Button>
            </div>

            <div className="min-h-0 grow pl-3">
                <ScrollArea className="h-full">
                    <div className="flex flex-col gap-1 pr-3">
                        {transcript.segments.map((segment) => (
                            <SegmentBlock
                                key={segment.id}
                                segment={segment}
                                showTimestamp={showTimestamps}
                                showSpeaker={showSpeakers}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="text-text-muted border-border mt-1 shrink-0 border-t px-3 py-2 text-xs">
                Transcription provided by{" "}
                <span className="text-text font-medium">
                    {TRANSCRIPTION_MODELS[props.model].label}
                </span>
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
            className="hover:bg-bg-muted group relative cursor-pointer rounded-md p-2 text-left"
        >
            <div className="bg-bg-surface border-border absolute top-1 right-1 rounded border p-1 opacity-0 shadow-sm group-hover:opacity-100">
                <Copy className="text-text-muted size-3.5" />
            </div>
            <div className="flex items-start gap-2">
                {props.showTimestamp && (
                    <span className="text-text-muted shrink-0 font-mono text-xs leading-6">
                        [{formatTimestamp(props.segment.start)}]
                    </span>
                )}
                {props.showSpeaker && props.segment.speaker && (
                    <span className="text-accent shrink-0 text-sm leading-6 font-medium">
                        {props.segment.speaker}:
                    </span>
                )}
                <span className="text-text text-sm leading-6">
                    {props.segment.text}
                </span>
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
