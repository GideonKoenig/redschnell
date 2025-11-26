"use client";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { TranscriptView } from "~/components/app/transcript-view";
import { Button } from "~/components/ui/button";
import { type Transcript } from "~/lib/types";

export function TranscriptSection(props: {
    transcript: Transcript | undefined;
    sourceId: string;
    isLoading: boolean;
    onRetry: () => void;
    isRetrying: boolean;
}) {
    if (props.isLoading) {
        return (
            <div className="flex w-full items-center justify-center gap-2 p-4">
                <Loader2 className="text-accent size-5 animate-spin" />
                <span className="text-text-muted">Loading transcript...</span>
            </div>
        );
    }

    if (!props.transcript) {
        return (
            <div className="text-text-muted flex w-full items-center justify-center p-4">
                <p>No transcript available.</p>
            </div>
        );
    }

    if (props.transcript.status === "processing") {
        return (
            <div className="flex w-full items-center justify-center gap-3 p-4">
                <Loader2 className="text-accent size-5 animate-spin" />
                <span className="text-text-muted">Transcribing audio...</span>
            </div>
        );
    }

    if (props.transcript.status === "failed") {
        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                    <AlertCircle className="text-error mt-0.5 size-5 shrink-0" />
                    <span className="text-error">{props.transcript.error}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={props.onRetry}
                    disabled={props.isRetrying}
                >
                    {props.isRetrying ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <RotateCcw className="size-4" />
                    )}
                    Retry transcription
                </Button>
            </div>
        );
    }

    if (props.transcript.status === "completed") {
        return (
            <TranscriptView
                content={props.transcript.processedContent}
                sourceId={props.sourceId}
                onRetry={props.onRetry}
                isRetrying={props.isRetrying}
            />
        );
    }

    return null;
}
