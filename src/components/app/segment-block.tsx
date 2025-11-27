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
                        style={{ width: `${props.speakerWidth + 1}ch` }}
                    >
                        {`${displaySpeaker}:`}
                    </span>
                )}
                <span className="text-text text-sm leading-6">
                    {props.segment.text}
                </span>
            </div>
        </button>
    );
}
