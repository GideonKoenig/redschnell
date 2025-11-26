"use client";

import { Clock, Loader2, X, XCircle } from "lucide-react";
import { type UploadItem } from "~/components/providers/upload-progress-provider";
import { Progress } from "~/components/ui/progress";

export function UploadItemCard(props: {
    upload: UploadItem;
    onDismiss: () => void;
}) {
    switch (props.upload.phase) {
        case "queued":
            return (
                <QueuedCard upload={props.upload} onDismiss={props.onDismiss} />
            );
        case "converting":
            return (
                <ConvertingCard
                    upload={props.upload}
                    onDismiss={props.onDismiss}
                />
            );
        case "uploading":
            return (
                <UploadingCard
                    upload={props.upload}
                    onDismiss={props.onDismiss}
                />
            );
        case "error":
            return (
                <ErrorCard upload={props.upload} onDismiss={props.onDismiss} />
            );
    }
}

function QueuedCard(props: { upload: UploadItem; onDismiss: () => void }) {
    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                <Clock className="text-text-muted size-4 shrink-0" />
                <span className="text-text flex-1 truncate text-sm">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5">
                <span className="text-text-muted text-xs">Queued</span>
            </div>
        </div>
    );
}

function ConvertingCard(props: { upload: UploadItem; onDismiss: () => void }) {
    const progress = Math.min(props.upload.progress, 100);

    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                <Loader2 className="text-warning size-4 shrink-0 animate-spin" />
                <span className="text-text flex-1 truncate text-sm">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="text-warning shrink-0 text-xs">
                    Converting
                </span>
                <Progress
                    value={progress}
                    className="[&>div]:bg-warning h-1 flex-1"
                />
                <span className="text-warning w-8 shrink-0 text-right text-xs">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

function UploadingCard(props: { upload: UploadItem; onDismiss: () => void }) {
    const progress = Math.min(props.upload.progress, 100);

    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                <Loader2 className="text-accent size-4 shrink-0 animate-spin" />
                <span className="text-text flex-1 truncate text-sm">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="text-accent shrink-0 text-xs">Uploading</span>
                <Progress
                    value={progress}
                    className="[&>div]:bg-accent h-1 flex-1"
                />
                <span className="text-accent w-8 shrink-0 text-right text-xs">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

function ErrorCard(props: { upload: UploadItem; onDismiss: () => void }) {
    return (
        <div className="bg-bg-muted group rounded-md p-2">
            <div className="relative flex items-center gap-2">
                <XCircle className="text-error size-4 shrink-0" />
                <span className="text-text flex-1 truncate text-sm">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            {props.upload.error && (
                <p className="text-error mt-1 truncate text-xs">
                    {props.upload.error}
                </p>
            )}
        </div>
    );
}

function DismissButton(props: { onDismiss: () => void }) {
    return (
        <button
            onClick={props.onDismiss}
            className="text-text-muted hover:text-text bg-bg-muted absolute right-0 flex items-center gap-1 rounded pl-2 opacity-0 group-hover:opacity-100"
        >
            <X className="size-4" />
        </button>
    );
}
