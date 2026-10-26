"use client";

import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BackLink } from "~/components/app/back-link";
import { TranscriptSection } from "~/components/app/transcript-section";
import { Button } from "~/components/ui/button";
import { InlineEdit, useInlineEdit } from "~/components/ui/inline-edit";
import { api } from "~/trpc/react";

export default function SourcePage() {
    // 1. Hooks
    const params = useParams();
    const router = useRouter();
    const sourceId = params.sourceId as string;
    const utils = api.useUtils();
    const inlineEditRef = useInlineEdit();

    const { data: source, isLoading: sourceLoading } = api.sources.get.useQuery(
        { id: sourceId },
    );

    const { data: transcript, isLoading: transcriptLoading } =
        api.transcripts.get.useQuery(
            { sourceId },
            {
                enabled: !!source,
                refetchInterval: (query) =>
                    query.state.data?.status === "processing" ? 5000 : false,
            },
        );

    const renameMutation = api.sources.rename.useMutation({
        onSuccess: () => {
            void utils.sources.get.invalidate({ id: sourceId });
            void utils.sources.list.invalidate();
            inlineEditRef.current?.close();
        },
    });

    const deleteMutation = api.sources.delete.useMutation({
        onSuccess: () => {
            void utils.sources.list.invalidate();
            router.push("/app");
            toast.success("Source deleted");
        },
    });

    const retryMutation = api.transcripts.retry.useMutation({
        onSuccess: () => {
            void utils.transcripts.get.invalidate({ sourceId });
            void utils.sources.get.invalidate({ id: sourceId });
            void utils.sources.list.invalidate();
        },
    });

    // 2. Early returns
    if (sourceLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-accent" />
            </div>
        );
    }

    if (!source) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <AlertCircle className="size-12 text-error" />
                <p className="text-lg text-text-muted">Source not found</p>
                <Button variant="outline" onClick={() => router.push("/app")}>
                    Go back
                </Button>
            </div>
        );
    }

    // 3. Derived state (none needed)

    // 4. Handlers
    const handleRename = (name: string) => {
        renameMutation.mutate({ id: sourceId, name });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this source?")) {
            deleteMutation.mutate({ id: sourceId });
        }
    };

    const handleRetry = () => {
        retryMutation.mutate({ sourceId });
    };

    // 5. Return
    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center gap-3 border-b border-border p-4">
                <BackLink />
                <InlineEdit
                    ref={inlineEditRef}
                    value={source.name}
                    onSave={handleRename}
                    isPending={renameMutation.isPending}
                    inputClassName="text-lg font-semibold"
                />
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                >
                    <Trash2 className="size-4 text-error" />
                </Button>
            </header>

            <div className="min-h-0 grow">
                <TranscriptSection
                    transcript={transcript}
                    sourceId={sourceId}
                    isLoading={transcriptLoading}
                    onRetry={handleRetry}
                    isRetrying={retryMutation.isPending}
                />
            </div>
        </div>
    );
}
