"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type UploadPhase = "queued" | "converting" | "uploading" | "error";

export type UploadItem = {
    id: string;
    fileName: string;
    phase: UploadPhase;
    progress: number;
    error?: string;
};

type UploadProgressContextValue = {
    uploads: Record<string, UploadItem>;
    addUpload: (id: string, fileName: string) => void;
    updateUpload: (
        id: string,
        update: Partial<Omit<UploadItem, "id" | "fileName">>,
    ) => void;
    dismissUpload: (id: string) => void;
};

const UploadProgressContext = createContext<UploadProgressContextValue | null>(
    null,
);

export function useUploadProgress() {
    const context = useContext(UploadProgressContext);
    if (!context) {
        throw new Error(
            "useUploadProgress must be used within UploadProgressProvider",
        );
    }
    return context;
}

export function UploadProgressProvider(props: { children: ReactNode }) {
    const [uploads, setUploads] = useState<Record<string, UploadItem>>({});

    const addUpload = (id: string, fileName: string) => {
        setUploads((prev) => ({
            ...prev,
            [id]: {
                id,
                fileName,
                phase: "queued",
                progress: 0,
            },
        }));
    };

    const updateUpload = (
        id: string,
        update: Partial<Omit<UploadItem, "id" | "fileName">>,
    ) => {
        setUploads((prev) => {
            const existing = prev[id];
            if (!existing) return prev;
            return {
                ...prev,
                [id]: { ...existing, ...update },
            };
        });
    };

    const dismissUpload = (id: string) => {
        setUploads((prev) => {
            const newUploads = { ...prev };
            delete newUploads[id];
            return newUploads;
        });
    };

    return (
        <UploadProgressContext.Provider
            value={{
                uploads,
                addUpload,
                updateUpload,
                dismissUpload,
            }}
        >
            {props.children}
        </UploadProgressContext.Provider>
    );
}
