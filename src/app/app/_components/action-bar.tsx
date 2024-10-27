"use client";

import { Upload, MessageSquare, FileAudio2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { type ChangeEvent, useRef } from "react";
import { Button } from "~/components/ui/button";

export function ActionBar() {
    const ref = useRef<HTMLInputElement | null>(null);
    const { file, chat } = useParams();
    const session = useSession();
    // session.data!.user.id
    return (
        <>
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
                        if (files && files.length > 0) {
                            console.log(files);
                        }
                    }}
                />
                <Upload /> Upload File
            </Button>
            <Button data-state={file ? "show" : "hide"} className="data-[state=hide]:hidden">
                <MessageSquare />
                New Chat
            </Button>
            <Button data-state={chat ? "show" : "hide"} className="data-[state=hide]:hidden">
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
        </>
    );
}
