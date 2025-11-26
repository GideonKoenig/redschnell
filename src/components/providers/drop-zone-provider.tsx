"use client";

import {
    createContext,
    useContext,
    useState,
    type DragEvent,
    type ReactNode,
} from "react";

type DropZoneContextValue = {
    isDragging: boolean;
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent, handler: (files: File[]) => void) => void;
};

const DropZoneContext = createContext<DropZoneContextValue | null>(null);

export function useDropZone() {
    const context = useContext(DropZoneContext);
    if (!context) {
        throw new Error("useDropZone must be used within DropZoneProvider");
    }
    return context;
}

export function DropZoneProvider(props: { children: ReactNode }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const onDragEnter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => {
            const next = prev + 1;
            if (next === 1) setIsDragging(true);
            return next;
        });
    };

    const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter((prev) => {
            const next = prev - 1;
            if (next === 0) setIsDragging(false);
            return next;
        });
    };

    const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDrop = (e: DragEvent, handler: (files: File[]) => void) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(0);
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(
            (file) =>
                file.type.startsWith("audio/") ||
                file.type.startsWith("video/"),
        );

        if (files.length > 0) {
            handler(files);
        }
    };

    return (
        <DropZoneContext.Provider
            value={{ isDragging, onDragEnter, onDragLeave, onDragOver, onDrop }}
        >
            {props.children}
        </DropZoneContext.Provider>
    );
}
