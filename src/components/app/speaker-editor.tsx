"use client";

import { Check, ChevronDown, Loader2, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type SpeakerEditorProps = {
    sourceId: string;
    speakers: string[];
    speakerNames: Record<string, string>;
};

export function SpeakerEditor(props: SpeakerEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const utils = api.useUtils();
    const updateMutation = api.transcripts.updateSpeakerNames.useMutation({
        onSuccess: () => {
            utils.transcripts.get.invalidate({ sourceId: props.sourceId });
            setEditingSpeaker(null);
            toast.success("Speaker name updated");
        },
        onError: () => {
            toast.error("Failed to update speaker name");
        },
    });

    const startEditing = (speaker: string) => {
        setEditValue(props.speakerNames[speaker] ?? speaker);
        setEditingSpeaker(speaker);
    };

    const save = () => {
        if (!editingSpeaker) return;

        const trimmed = editValue.trim();
        if (!trimmed) {
            setEditingSpeaker(null);
            return;
        }

        const newNames = { ...props.speakerNames };
        if (trimmed === editingSpeaker) {
            delete newNames[editingSpeaker];
        } else {
            newNames[editingSpeaker] = trimmed;
        }

        updateMutation.mutate({
            sourceId: props.sourceId,
            speakerNames: newNames,
        });
    };

    const cancel = () => {
        setEditingSpeaker(null);
    };

    if (props.speakers.length === 0) {
        return null;
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant={isOpen ? "secondary" : "ghost"}>
                    <User className="size-4" />
                    Rename Speakers
                    <ChevronDown
                        className={cn(
                            "size-4 transition-transform",
                            isOpen && "rotate-180",
                        )}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="w-72 p-2"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex flex-col gap-1">
                    {props.speakers.map((speaker) => (
                        <SpeakerRow
                            key={speaker}
                            speaker={speaker}
                            displayName={props.speakerNames[speaker] ?? speaker}
                            isEditing={editingSpeaker === speaker}
                            editValue={editValue}
                            isPending={updateMutation.isPending}
                            onStartEdit={() => startEditing(speaker)}
                            onEditChange={setEditValue}
                            onSave={save}
                            onCancel={cancel}
                        />
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SpeakerRow(props: {
    speaker: string;
    displayName: string;
    isEditing: boolean;
    editValue: string;
    isPending: boolean;
    onStartEdit: () => void;
    onEditChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    if (props.isEditing) {
        return (
            <div className="flex items-center gap-1 rounded p-1">
                <input
                    type="text"
                    value={props.editValue}
                    onChange={(e) => props.onEditChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (props.isPending) return;
                        if (e.key === "Enter") props.onSave();
                        if (e.key === "Escape") props.onCancel();
                    }}
                    disabled={props.isPending}
                    autoFocus
                    className="text-text border-border flex-1 rounded border bg-transparent px-2 py-1 text-sm outline-none"
                />
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={props.onSave}
                    disabled={props.isPending}
                >
                    {props.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                        <Check className="size-3.5" />
                    )}
                </Button>
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={props.onCancel}
                    disabled={props.isPending}
                >
                    <X className="size-3.5" />
                </Button>
            </div>
        );
    }

    return (
        <button
            onClick={props.onStartEdit}
            className="hover:bg-bg-muted flex w-full items-center gap-2 rounded p-1.5 text-left"
        >
            <span className="text-text-muted text-xs">{props.speaker}:</span>
            <span className="text-text flex-1 text-sm">
                {props.displayName}
            </span>
        </button>
    );
}
