"use client";

import { ChevronRight, Loader2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

/** Renames all detected speakers in one form. An empty field resets the speaker to its detected label. */
export function SpeakerEditor(props: {
    sourceId: string;
    speakers: string[];
    speakerNames: Record<string, string>;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const utils = api.useUtils();
    const update = api.transcripts.updateSpeakerNames.useMutation({
        onSuccess: async () => {
            await utils.transcripts.get.invalidate({
                sourceId: props.sourceId,
            });
            setIsOpen(false);
        },
        onError: () => {
            toast.error("Failed to update speaker names");
        },
    });

    const save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const entries = props.speakers.map((speaker) => {
            const value = form.get(speaker);
            const name = typeof value === "string" ? value.trim() : "";
            return [speaker, name] as const;
        });
        const speakerNames = Object.fromEntries(
            entries.filter(([speaker, name]) => name && name !== speaker),
        );
        update.mutate({ sourceId: props.sourceId, speakerNames });
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size="sm" variant={isOpen ? "secondary" : "ghost"}>
                    <Users />
                    Speakers
                    {/* No rotation transition: animating the icon makes Chrome re-rasterize the label, so the text flickers. */}
                    <ChevronRight className={cn(isOpen && "rotate-90")} />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
                <form onSubmit={save} className="flex flex-col gap-3">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                        {props.speakers.map((speaker) => (
                            <label key={speaker} className="contents">
                                <span className="text-xs text-text-muted">
                                    {speaker}
                                </span>
                                <input
                                    name={speaker}
                                    defaultValue={props.speakerNames[speaker]}
                                    placeholder={speaker}
                                    disabled={update.isPending}
                                    className="h-8 min-w-0 rounded-md border border-border bg-transparent px-2 text-sm text-text outline-none placeholder:text-text-muted focus-visible:ring-[3px] focus-visible:ring-accent/50 disabled:opacity-50"
                                />
                            </label>
                        ))}
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        variant="accent"
                        disabled={update.isPending}
                        className="self-end"
                    >
                        {update.isPending && (
                            <Loader2 className="animate-spin" />
                        )}
                        Save
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
}
