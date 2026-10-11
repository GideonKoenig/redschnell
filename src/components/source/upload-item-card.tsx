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
        <div className="group rounded-md bg-bg-muted p-2">
            <div className="relative flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-text-muted" />
                <span className="flex-1 truncate text-sm text-text">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5">
                <span className="text-xs text-text-muted">Queued</span>
            </div>
        </div>
    );
}

function ConvertingCard(props: { upload: UploadItem; onDismiss: () => void }) {
    const progress = Math.min(props.upload.progress, 100);

    return (
        <div className="group rounded-md bg-bg-muted p-2">
            <div className="relative flex items-center gap-2">
                <Loader2 className="size-4 shrink-0 animate-spin text-warning" />
                <span className="flex-1 truncate text-sm text-text">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="shrink-0 text-xs text-warning">
                    Converting
                </span>
                <Progress
                    value={progress}
                    className="h-1 flex-1 [&>div]:bg-warning"
                />
                <span className="w-8 shrink-0 text-right text-xs text-warning">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

function UploadingCard(props: { upload: UploadItem; onDismiss: () => void }) {
    const progress = Math.min(props.upload.progress, 100);

    return (
        <div className="group rounded-md bg-bg-muted p-2">
            <div className="relative flex items-center gap-2">
                <Loader2 className="size-4 shrink-0 animate-spin text-accent" />
                <span className="flex-1 truncate text-sm text-text">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="shrink-0 text-xs text-accent">Uploading</span>
                <Progress
                    value={progress}
                    className="h-1 flex-1 [&>div]:bg-accent"
                />
                <span className="w-8 shrink-0 text-right text-xs text-accent">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}

function ErrorCard(props: { upload: UploadItem; onDismiss: () => void }) {
    return (
        <div className="group rounded-md bg-bg-muted p-2">
            <div className="relative flex items-center gap-2">
                <XCircle className="size-4 shrink-0 text-error" />
                <span className="flex-1 truncate text-sm text-text">
                    {props.upload.fileName}
                </span>
                <DismissButton onDismiss={props.onDismiss} />
            </div>
            {props.upload.error && (
                <p className="mt-1 truncate text-xs text-error">
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
            className="absolute right-0 flex items-center gap-1 rounded bg-bg-muted pl-2 text-text-muted opacity-0 group-hover:opacity-100 hover:text-text"
        >
            <X className="size-4" />
        </button>
    );
}
