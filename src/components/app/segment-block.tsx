"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import {
    formatTimestamp,
    type TranscriptSegment,
} from "~/lib/schemas/transcript";

export function SegmentBlock(props: {
    segment: TranscriptSegment;
    showTimestamp: boolean;
    showSpeaker: boolean;
    speakerNames: Record<string, string>;
    speakerWidth: number;
    isActive: boolean;
    onSeek: () => void;
}) {
    const displaySpeaker = props.segment.speaker
        ? (props.speakerNames[props.segment.speaker] ?? props.segment.speaker)
        : null;

    const copySegment = async () => {
        let text = "";
        if (props.showTimestamp) {
            text += `[${formatTimestamp(props.segment.start)}] `;
        }
        if (props.showSpeaker && displaySpeaker) {
            text += `${displaySpeaker}: `;
        }
        text += props.segment.text;

        await navigator.clipboard.writeText(text);
        toast.success("Segment copied");
    };

    // The copy button covers the whole row. The content above it ignores the pointer, except the timestamp, which seeks.
    return (
        <div
            data-active={props.isActive}
            className="group relative rounded-md p-2 hover:bg-bg-muted data-[active=true]:bg-accent/10"
        >
            <button
                onClick={copySegment}
                aria-label="Copy segment"
                className="absolute inset-0 cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-accent/50"
            />
            <div className="pointer-events-none absolute top-1 right-1 rounded border border-border bg-bg-surface p-1 opacity-0 shadow-sm group-hover:opacity-100">
                <Copy className="size-3.5 text-text-muted" />
            </div>
            {/* Phones stack timestamp and speaker above the text; wider screens align them in columns. */}
            <div className="pointer-events-none relative flex flex-wrap items-start gap-x-2 md:flex-nowrap">
                {props.showTimestamp && (
                    <button
                        onClick={props.onSeek}
                        title="Play from here"
                        className="pointer-events-auto shrink-0 cursor-pointer rounded font-mono text-xs leading-6 text-text-muted outline-none hover:text-accent focus-visible:ring-[3px] focus-visible:ring-accent/50"
                    >
                        [{formatTimestamp(props.segment.start)}]
                    </button>
                )}
                {props.showSpeaker && displaySpeaker && (
                    <span
                        className="shrink-0 truncate text-sm leading-6 font-medium text-accent max-md:w-auto! md:text-right"
                        style={{ width: `${props.speakerWidth + 1}ch` }}
                    >
                        {`${displaySpeaker}:`}
                    </span>
                )}
                <span className="basis-full text-sm leading-6 text-text md:basis-auto">
                    {props.segment.text}
                </span>
            </div>
        </div>
    );
}
