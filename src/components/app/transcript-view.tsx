"use client";

import {
    Copy,
    Loader2,
    MoreHorizontal,
    RefreshCw,
    RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { SpeakerEditor } from "~/components/app/speaker-editor";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    TranscriptSchema,
    formatTimestamp,
    getUniqueSpeakers,
    type Transcript,
    type TranscriptSegment,
} from "~/lib/schemas/transcript";
import { DEFAULT_SETTINGS } from "~/lib/settings";
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
    const utils = api.useUtils();
    const { data: settings = DEFAULT_SETTINGS } = api.settings.get.useQuery();

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
    const speakers = getUniqueSpeakers(transcript.segments);
    const speakerNames = transcript.speakerNames ?? {};

    const { showTimestamps, showSpeakers } = settings;

    const maxSpeakerWidth = speakers.reduce((max, speaker) => {
        const displayName = speakerNames[speaker] ?? speaker;
        return Math.max(max, displayName.length);
    }, 0);

    const copyAll = () => {
        const text = formatTranscriptText(
            transcript,
            showTimestamps,
            showSpeakers,
            speakerNames,
        );
        navigator.clipboard.writeText(text);
        toast.success("Transcript copied to clipboard");
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center gap-2 p-3">
                {speakers.length > 0 && (
                    <SpeakerEditor
                        sourceId={props.sourceId}
                        speakers={speakers}
                        speakerNames={speakerNames}
                    />
                )}
                <div className="flex-1" />
                <Button size="sm" variant="outline" onClick={copyAll}>
                    <Copy className="size-4" />
                    Copy all
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant="ghost">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={props.onRetry}
                            disabled={props.isRetrying}
                        >
                            {props.isRetrying ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <RotateCcw className="size-4" />
                            )}
                            Retranscribe
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                reprocessMutation.mutate({
                                    sourceId: props.sourceId,
                                })
                            }
                            disabled={reprocessMutation.isPending}
                        >
                            {reprocessMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <RefreshCw className="size-4" />
                            )}
                            Reprocess
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                                speakerNames={speakerNames}
                                speakerWidth={maxSpeakerWidth}
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
    speakerNames: Record<string, string>;
    speakerWidth: number;
}) {
    const displaySpeaker = props.segment.speaker
        ? (props.speakerNames[props.segment.speaker] ?? props.segment.speaker)
        : null;

    const copySegment = () => {
        let text = "";
        if (props.showTimestamp) {
            text += `[${formatTimestamp(props.segment.start)}] `;
        }
        if (props.showSpeaker && displaySpeaker) {
            text += `${displaySpeaker}: `;
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
                {props.showSpeaker && displaySpeaker && (
                    <span
                        className="text-accent shrink-0 truncate text-right text-sm leading-6 font-medium"
                        style={{ width: `${props.speakerWidth * 0.5 + 1}rem` }}
                    >
                        {displaySpeaker}:
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
    speakerNames: Record<string, string>,
): string {
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
