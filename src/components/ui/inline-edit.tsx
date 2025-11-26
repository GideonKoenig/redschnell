"use client";

import { Check, Loader2, Pencil, X } from "lucide-react";
import { useImperativeHandle, useRef, useState, forwardRef } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type InlineEditRef = {
    close: () => void;
};

type InlineEditProps = {
    value: string;
    onSave: (value: string) => void;
    isPending?: boolean;
    className?: string;
    inputClassName?: string;
};

export const InlineEdit = forwardRef<InlineEditRef, InlineEditProps>(
    function InlineEdit(
        { value, onSave, isPending = false, className, inputClassName },
        ref,
    ) {
        const [isEditing, setIsEditing] = useState(false);
        const [editValue, setEditValue] = useState(value);

        useImperativeHandle(ref, () => ({
            close: () => {
                setIsEditing(false);
                setEditValue(value);
            },
        }));

        const startEditing = () => {
            setEditValue(value);
            setIsEditing(true);
        };

        const save = () => {
            if (editValue.trim() && editValue !== value) {
                onSave(editValue.trim());
            } else {
                setIsEditing(false);
            }
        };

        const cancel = () => {
            setIsEditing(false);
            setEditValue(value);
        };

        if (isEditing) {
            return (
                <div
                    className={cn(
                        "-ml-2.5 flex flex-1 items-center gap-2",
                        className,
                    )}
                >
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (isPending) return;
                            if (e.key === "Enter") save();
                            if (e.key === "Escape") cancel();
                        }}
                        disabled={isPending}
                        autoFocus
                        className={cn(
                            "text-text flex-1 bg-transparent px-2.5 outline-none disabled:opacity-50",
                            inputClassName,
                        )}
                    />
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={save}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Check className="size-4" />
                        )}
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={cancel}
                        disabled={isPending}
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div className={cn("flex flex-1 items-center gap-2", className)}>
                <span className={cn("text-text flex-1", inputClassName)}>
                    {value}
                </span>
                <Button size="icon-sm" variant="ghost" onClick={startEditing}>
                    <Pencil className="size-4" />
                </Button>
            </div>
        );
    },
);

export function useInlineEdit() {
    const ref = useRef<InlineEditRef>(null);
    return ref;
}
