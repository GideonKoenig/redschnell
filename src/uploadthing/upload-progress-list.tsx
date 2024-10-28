"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useContext, useState } from "react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { UploadProgressContext } from "~/uploadthing/upload-progress-provider";

export function UploadProgressList() {
    const context = useContext(UploadProgressContext);
    const progressList = Object.entries(context.progressList);
    const [display, setDisplay] = useState<boolean>(true);

    return (
        <div className="w-full text-xs text-text-muted dark:text-dark-text-muted">
            <Button
                variant="ghost"
                className="w-full justify-start rounded-b-none"
                onMouseDown={() => {
                    setDisplay((prev) => !prev);
                }}
            >
                <ChevronRight
                    data-state={display ? "hide" : "display"}
                    className="data-[state=hide]:hidden"
                />
                <ChevronDown
                    data-state={display ? "display" : "hide"}
                    className="data-[state=hide]:hidden"
                />
                {`Uploadthing Files (${progressList.length})`}
            </Button>

            <div
                data-state={
                    display && progressList.length > 0 ? "display" : "hide"
                }
                className="flex select-none flex-col gap-1 border-b border-menu-light py-2 data-[state=hide]:hidden dark:border-dark-menu-light"
            >
                {progressList.map(([name, file], index) => (
                    <div className="px-4" key={index}>
                        <div className="flex w-full flex-row">
                            <p className="truncate">{name}</p>
                            <div className="min-w-1 flex-grow" />
                            <p className="w-8 flex-shrink-0">
                                {file.progress}%
                            </p>
                        </div>
                        <Progress className="h-1" value={file.progress} />
                    </div>
                ))}
            </div>
        </div>
    );
}
