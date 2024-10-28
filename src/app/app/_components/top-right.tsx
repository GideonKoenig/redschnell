"use client";

import {
    Upload,
    MessageSquare,
    FileAudio2,
    Trash2,
    PanelRightClose,
} from "lucide-react";
import { useParams } from "next/navigation";
import { type ChangeEvent, useRef } from "react";
import { Button } from "~/components/ui/button";
import { CollapsibleTrigger } from "~/components/ui/collapsible";
import { useUploader } from "~/uploadthing/hook";

export function ActionBar() {
    const ref = useRef<HTMLInputElement | null>(null);
    const { file, chat } = useParams();
    const { uploadFiles } = useUploader("uploader");

    return (
        <div className="flex h-14 w-full flex-row items-center gap-2 rounded-lg border border-menu-hover bg-menu-main p-2 shadow dark:border-dark-menu-light dark:bg-dark-menu-main">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:hidden">
                    <PanelRightClose />
                </Button>
            </CollapsibleTrigger>
            <Button
                onMouseDown={() => {
                    ref.current?.click();
                }}
            >
                <input
                    className="hidden"
                    multiple
                    ref={ref}
                    type="file"
                    accept="audio/*, video/*"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const files = event.target.files;
                        if (files && files.length > 0)
                            void uploadFiles(Array.from(files));
                    }}
                />
                <Upload /> Upload File
            </Button>
            <Button
                data-state={file ? "show" : "hide"}
                className="data-[state=hide]:hidden"
            >
                <MessageSquare />
                New Chat
            </Button>
            <Button
                data-state={chat ? "show" : "hide"}
                className="data-[state=hide]:hidden"
            >
                <FileAudio2 />
                Go To File
            </Button>
            <div className="flex-grow" />
            <Button
                data-state={chat ? "show" : "hide"}
                className="data-[state=hide]:hidden"
                variant="destructive"
            >
                <Trash2 />
                Delete Chat
            </Button>
            <Button
                data-state={file ? "show" : "hide"}
                className="data-[state=hide]:hidden"
                variant="destructive"
            >
                <Trash2 />
                Delete File
            </Button>
        </div>
    );
}
