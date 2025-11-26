"use client";

import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info,
    Loader2,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
    const defaultClassNames = {
        toast: "relative bg-bg-surface text-text border border-border rounded-md shadow-sm px-4 py-3 pr-8 flex items-center gap-3 border-l-4",
        title: "text-text font-medium text-sm leading-snug",
        description: "text-text-muted text-xs leading-relaxed",
        actionButton: "bg-accent text-white hover:bg-accent-hover",
        cancelButton:
            "bg-bg-muted text-text hover:bg-bg-muted/80 border border-border",
        closeButton:
            "absolute right-1 top-1 text-text-muted hover:text-text rounded-md p-2 -m-1 hover:bg-bg-muted focus-visible:ring-2 focus-visible:ring-accent",
        icon: "size-5 shrink-0 self-center",
        success: "border-l-success",
        warning: "border-l-warning",
        error: "border-l-error",
        info: "border-l-accent",
    } as NonNullable<ToasterProps["toastOptions"]>["classNames"];

    const mergedToastOptions: ToasterProps["toastOptions"] = {
        duration: 4000,
        unstyled: true,
        ...toastOptions,
        classNames: {
            ...defaultClassNames,
            ...(toastOptions?.classNames ?? {}),
        },
    };

    return (
        <Sonner
            theme="light"
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--color-bg-surface)",
                    "--normal-text": "var(--color-text)",
                    "--normal-border": "var(--color-border)",
                } as React.CSSProperties
            }
            icons={{
                success: <CheckCircle2 className="text-success" />,
                warning: <AlertTriangle className="text-warning" />,
                error: <XCircle className="text-error" />,
                info: <Info className="text-accent" />,
                loading: <Loader2 className="text-accent animate-spin" />,
            }}
            toastOptions={mergedToastOptions}
            {...props}
        />
    );
};

export { Toaster };
