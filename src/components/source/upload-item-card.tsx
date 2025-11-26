"use client";

import { Loader2, X } from "lucide-react";
import { type UploadItem } from "~/components/providers/upload-progress-provider";
import { Progress } from "~/components/ui/progress";

export function UploadItemCard(props: {
    upload: UploadItem;
    onDismiss: () => void;
}) {
    const phaseLabel =
        props.upload.phase === "converting" ? "Converting" : "Uploading";
    const phaseColor =
        props.upload.phase === "converting" ? "text-warning" : "text-accent";
    const barColor =
        props.upload.phase === "converting"
            ? "[&>div]:bg-warning"
            : "[&>div]:bg-accent";

    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                <Loader2
                    className={`size-4 shrink-0 animate-spin ${phaseColor}`}
                />
                <span className="text-text flex-1 truncate text-sm">
                    {props.upload.fileName}
                </span>
                <button
                    onClick={props.onDismiss}
                    className="text-text-muted hover:text-text bg-bg-muted absolute right-0 flex items-center gap-1 rounded pl-2 opacity-0 group-hover:opacity-100"
                >
                    <X className="size-4" />
                </button>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className={`shrink-0 text-xs ${phaseColor}`}>
                    {phaseLabel}
                </span>
                <Progress
                    value={props.upload.progress}
                    className={`h-1 flex-1 ${barColor}`}
                />
                <span
                    className={`w-8 shrink-0 text-right text-xs ${phaseColor}`}
                >
                    {Math.round(props.upload.progress)}%
                </span>
            </div>
        </div>
    );
}
