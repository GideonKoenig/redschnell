"use client";

import { Check, X, XCircle } from "lucide-react";
import { type UploadItem } from "~/components/providers/upload-progress-provider";

export function CompletedUploadCard(props: {
    upload: UploadItem;
    onDismiss: () => void;
}) {
    const isError = props.upload.phase === "error";

    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                {isError ? (
                    <XCircle className="text-error size-4 shrink-0" />
                ) : (
                    <Check className="text-success size-4 shrink-0" />
                )}
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
            {isError && props.upload.error && (
                <p className="text-error mt-1 truncate text-xs">
                    {props.upload.error}
                </p>
            )}
        </div>
    );
}
