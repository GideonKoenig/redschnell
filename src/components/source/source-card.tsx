"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { type SourceWithTranscript } from "~/lib/types";
import { api } from "~/trpc/react";

export function SourceCard(props: { source: SourceWithTranscript }) {
    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();

    const deleteMutation = api.sources.delete.useMutation({
        onSuccess: () => {
            utils.sources.list.invalidate();
            if (pathname === `/app/source/${props.source.id}`) {
                router.push("/app");
            }
            toast.success("Source deleted");
        },
    });

    const isActive = pathname === `/app/source/${props.source.id}`;
    const isDeleting = deleteMutation.isPending;
    const status = props.source.transcript?.status;

    const statusIndicator = (() => {
        if (isDeleting) {
            return <Loader2 className="text-error size-3 animate-spin" />;
        }
        switch (status) {
            case "completed":
                return (
                    <div className="border-border size-2 rounded-full border" />
                );
            case "processing":
                return (
                    <span className="relative flex size-2">
                        <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-75" />
                        <span className="bg-accent relative inline-flex size-2 rounded-full" />
                    </span>
                );
            case "failed":
                return <div className="bg-error size-2 rounded-full" />;
            default:
                return <div className="bg-text-muted/40 size-2 rounded-full" />;
        }
    })();

    const handleClick = () => {
        if (!status) {
            setTimeout(() => {
                utils.sources.list.invalidate();
                utils.sources.get.invalidate({ id: props.source.id });
            }, 2000);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate({ id: props.source.id });
    };

    return (
        <div className="group relative">
            <Link
                href={`/app/source/${props.source.id}`}
                onClick={handleClick}
                data-active={isActive}
                data-deleting={isDeleting}
                className="hover:bg-bg-muted data-[active=true]:bg-bg-muted flex items-center gap-2 rounded-md p-2 pr-8 data-[deleting=true]:opacity-50"
            >
                {statusIndicator}
                <span className="text-text flex-1 truncate text-sm">
                    {props.source.name}
                </span>
            </Link>

            {!isDeleting && (
                <button
                    onClick={handleDelete}
                    className="text-text-muted hover:text-error absolute top-1/2 right-1 hidden -translate-y-1/2 rounded p-1 group-hover:block"
                >
                    <Trash2 className="size-4" />
                </button>
            )}
        </div>
    );
}
