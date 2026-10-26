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

    return (
        <button
            onClick={copySegment}
            className="group relative cursor-pointer rounded-md p-2 text-left hover:bg-bg-muted"
        >
            <div className="absolute top-1 right-1 rounded border border-border bg-bg-surface p-1 opacity-0 shadow-sm group-hover:opacity-100">
                <Copy className="size-3.5 text-text-muted" />
            </div>
            {/* Phones stack timestamp and speaker above the text; wider screens align them in columns. */}
            <div className="flex flex-wrap items-start gap-x-2 md:flex-nowrap">
                {props.showTimestamp && (
                    <span className="shrink-0 font-mono text-xs leading-6 text-text-muted">
                        [{formatTimestamp(props.segment.start)}]
                    </span>
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
        </button>
    );
}
