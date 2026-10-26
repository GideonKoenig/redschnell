"use client";

import { Upload } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";
import { useDropZone } from "~/components/providers/drop-zone-provider";
import { Sidebar } from "~/components/app/sidebar";
import { useUploader } from "~/hooks/use-uploader";
import { useReloadOnAccountSwitch } from "~/lib/auth-client";
import { type User } from "~/lib/auth-server";
import { cn } from "~/lib/utils";

export function AppShell(props: {
    user: User;
    surrogate: boolean;
    children: ReactNode;
}) {
    const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } =
        useDropZone();
    const { uploadFiles, cancelUpload } = useUploader(props.user.id);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useReloadOnAccountSwitch();
    // Phones show one panel: the sidebar on /app, the page everywhere else.
    const isHome = usePathname() === "/app";

    const handleDrop = (e: React.DragEvent) => {
        onDrop(e, (files) => {
            void uploadFiles(files);
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            void uploadFiles(files);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className="h-dvh w-dvw bg-bg-base p-3"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*,.mkv"
                multiple
                className="hidden"
                onChange={handleFileSelect}
            />

            <div className="mx-auto h-full max-w-5xl">
                <div className="grid h-full grid-cols-1 gap-3 md:grid-cols-[20rem_1fr]">
                    <Sidebar
                        user={props.user}
                        surrogate={props.surrogate}
                        onUploadClick={openFilePicker}
                        onCancelUpload={cancelUpload}
                        className={cn(!isHome && "hidden md:flex")}
                    />

                    <main
                        className={cn(
                            "relative h-full overflow-hidden rounded-lg border border-border bg-bg-surface shadow-sm",
                            isHome && "hidden md:block",
                        )}
                    >
                        {props.children}
                    </main>
                </div>
            </div>

            {isDragging && (
                <div className="pointer-events-none fixed inset-3 z-50 flex items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/5">
                    <div className="flex flex-col items-center gap-3 rounded-lg bg-bg-surface p-8 shadow-lg">
                        <Upload className="size-12 text-accent" />
                        <p className="text-lg font-medium text-text">
                            Drop files to upload
                        </p>
                        <p className="text-sm text-text-muted">
                            Audio and video files supported
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
