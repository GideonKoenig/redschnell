"use client";

import { useEffect, useState } from "react";

export function UploadModal() {
    const [dragOver, setDragOver] = useState<boolean>(false);

    useEffect(() => {
        const handleDragOver = (event: DragEvent) => {
            event.preventDefault();
            setDragOver(true);
        };

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            console.log(event.dataTransfer?.files);
            setDragOver(false);
        };

        const handleDragLeave = (event: DragEvent) => {
            event.preventDefault();
            if (event.clientX === 0 && event.clientY === 0) {
                setDragOver(false);
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
        };
    }, []);

    return (
        <>
            <DropField visible={dragOver} />
            <div
                data-state={false ? "open" : "closed"}
                className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center bg-menu-dark opacity-50 backdrop-blur-sm data-[state=closed]:hidden dark:bg-dark-menu-dark"
            >
                <div className="bg-red-500">test</div>
            </div>
        </>
    );
}

function DropField(props: { visible?: boolean }) {
    return (
        <div
            data-state={props.visible ? "show" : "hide"}
            className="absolute left-0 top-0 z-20 h-screen w-screen p-4 data-[state=hide]:hidden"
        >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-menu-light bg-menu-dark p-4 text-text-muted opacity-90 backdrop-blur-sm dark:border-dark-menu-light dark:bg-dark-menu-dark dark:text-dark-text-muted">
                Drop your files here...
            </div>
        </div>
    );
}
