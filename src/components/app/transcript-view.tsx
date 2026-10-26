"use client";

import {
    Copy,
    Loader2,
    MoreHorizontal,
    Play,
    RefreshCw,
    RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AudioPlayerBar } from "~/components/app/audio-player";
import { SegmentBlock } from "~/components/app/segment-block";
import { SpeakerEditor } from "~/components/app/speaker-editor";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAudioPlayer } from "~/hooks/use-audio-player";
import {
    formatDuration,
    formatFileSize,
    formatProcessingTime,
    formatTranscriptText,
} from "~/lib/format";
import { TranscriptSchema, getUniqueSpeakers } from "~/lib/schemas/transcript";
import { DEFAULT_SETTINGS } from "~/lib/settings";
import { TRANSCRIPTION_MODELS } from "~/lib/transcription-models";
import { type CompletedTranscript } from "~/lib/types";
import { api } from "~/trpc/react";

export function TranscriptView(props: {
    transcript: CompletedTranscript;
    onRetry: () => void;
    isRetrying: boolean;
}) {
    const utils = api.useUtils();
    const { data: settings = DEFAULT_SETTINGS } = api.settings.get.useQuery();
    const player = useAudioPlayer(props.transcript.source.url);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [playingIndex, setPlayingIndex] = useState(-1);

    const reprocessMutation = api.transcripts.reprocess.useMutation({
        onSuccess: () => {
            void utils.transcripts.get.invalidate({
                sourceId: props.transcript.sourceId,
            });
            toast.success("Transcript reprocessed");
        },
        onError: () => {
            toast.error("Failed to reprocess transcript");
        },
    });

    const parsed = TranscriptSchema.safeParse(
        props.transcript.processedContent,
    );
    if (!parsed.success) {
        return (
            <div className="space-y-4 text-text-muted">
                <p>Unable to parse transcript data.</p>
                <details className="text-xs">
                    <summary className="cursor-pointer">Parse error</summary>
                    <pre className="mt-2 overflow-auto rounded bg-bg-muted p-2">
                        {JSON.stringify(parsed.error.format(), null, 2)}
                    </pre>
                </details>
                <details className="text-xs">
                    <summary className="cursor-pointer">Received data</summary>
                    <pre className="mt-2 overflow-auto rounded bg-bg-muted p-2">
                        {JSON.stringify(
                            props.transcript.processedContent,
                            null,
                            2,
                        )}
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

    const activeIndex = isPlayerOpen ? playingIndex : -1;

    // Tracks the segment being heard: the last one that started at or before the playback position. Segments are in order.
    // Setting the same index again doesn't re-render, so the transcript only re-renders when the segment changes.
    const trackSegment = (event: React.SyntheticEvent<HTMLAudioElement>) => {
        const time = event.currentTarget.currentTime;
        setPlayingIndex(
            transcript.segments.filter((segment) => segment.start <= time)
                .length - 1,
        );
    };

    const playFrom = (time: number) => {
        setIsPlayerOpen(true);
        player.seek(time);
        player.play();
    };

    const closePlayer = () => {
        player.pause();
        setIsPlayerOpen(false);
    };

    const copyAll = async () => {
        const text = formatTranscriptText(
            transcript,
            showTimestamps,
            showSpeakers,
            speakerNames,
        );
        await navigator.clipboard.writeText(text);
        toast.success("Transcript copied to clipboard");
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex shrink-0 items-center gap-2 p-3">
                {speakers.length > 0 && (
                    <SpeakerEditor
                        sourceId={props.transcript.sourceId}
                        speakers={speakers}
                        speakerNames={speakerNames}
                    />
                )}
                <div className="flex-1" />
                {!isPlayerOpen && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setIsPlayerOpen(true);
                            player.play();
                        }}
                    >
                        <Play />
                        <span className="max-md:sr-only">Play</span>
                    </Button>
                )}
                <Button size="sm" variant="outline" onClick={copyAll}>
                    <Copy className="size-4" />
                    <span className="max-md:sr-only">Copy all</span>
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
                                    sourceId: props.transcript.sourceId,
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
                        {transcript.segments.map((segment, index) => (
                            <SegmentBlock
                                key={segment.id}
                                segment={segment}
                                showTimestamp={showTimestamps}
                                showSpeaker={showSpeakers}
                                speakerNames={speakerNames}
                                speakerWidth={maxSpeakerWidth}
                                isActive={index === activeIndex}
                                onSeek={() => playFrom(segment.start)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Hidden element; the bar renders the controls. */}
            <audio {...player.audioProps} onTimeUpdate={trackSegment} />
            {isPlayerOpen && (
                <AudioPlayerBar
                    player={player}
                    fallbackDuration={props.transcript.source.duration}
                    onClose={closePlayer}
                />
            )}

            <TranscriptFooter transcript={props.transcript} />
        </div>
    );
}

function TranscriptFooter(props: { transcript: CompletedTranscript }) {
    const { transcript } = props;

    return (
        <div className="mt-1 flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border px-3 py-2 text-xs text-text-muted">
            <span>
                <span className="font-medium text-text">
                    {TRANSCRIPTION_MODELS[transcript.model].label}
                </span>
            </span>
            <span className="text-border">·</span>
            <span>{formatDuration(transcript.source.duration)}</span>
            <span className="text-border">·</span>
            <span>{formatFileSize(transcript.source.fileSize)}</span>
            {transcript.startedAt && transcript.completedAt && (
                <>
                    <span className="text-border">·</span>
                    <span>
                        Transcribed in{" "}
                        {formatProcessingTime(
                            new Date(transcript.completedAt).getTime() -
                                new Date(transcript.startedAt).getTime(),
                        )}
                    </span>
                </>
            )}
            {transcript.price && (
                <>
                    <span className="text-border">·</span>
                    <span>${parseFloat(transcript.price).toFixed(4)}</span>
                </>
            )}
        </div>
    );
}
