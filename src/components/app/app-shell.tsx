"use client";

import { Upload } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { useDropZone } from "~/components/providers/drop-zone-provider";
import { Sidebar } from "~/components/app/sidebar";
import { useUploader } from "~/hooks/use-uploader";

export function AppShell(props: { children: ReactNode }) {
    const { isDragging, onDragEnter, onDragLeave, onDragOver, onDrop } =
        useDropZone();
    const { uploadFiles } = useUploader();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        onDrop(e, uploadFiles);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            uploadFiles(files);
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
            className="bg-bg-base grid h-screen w-screen grid-cols-[320px_1fr] gap-3 p-3"
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={handleDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
            />

            <Sidebar onUploadClick={openFilePicker} />

            <main className="bg-bg-surface border-border relative h-full overflow-hidden rounded-lg border shadow-sm">
                {props.children}
            </main>

            {isDragging && (
                <div className="bg-accent/5 border-accent pointer-events-none fixed inset-3 z-50 flex items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="bg-bg-surface flex flex-col items-center gap-3 rounded-lg p-8 shadow-lg">
                        <Upload className="text-accent size-12" />
                        <p className="text-text text-lg font-medium">
                            Drop files to upload
                        </p>
                        <p className="text-text-muted text-sm">
                            Audio and video files supported
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
