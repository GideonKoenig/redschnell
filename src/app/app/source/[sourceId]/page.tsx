"use client";

import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
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
            utils.sources.get.invalidate({ id: sourceId });
            utils.sources.list.invalidate();
            inlineEditRef.current?.close();
        },
    });

    const deleteMutation = api.sources.delete.useMutation({
        onSuccess: () => {
            utils.sources.list.invalidate();
            router.push("/app");
            toast.success("Source deleted");
        },
    });

    const retryMutation = api.transcripts.retry.useMutation({
        onSuccess: () => {
            utils.transcripts.get.invalidate({ sourceId });
            utils.sources.get.invalidate({ id: sourceId });
            utils.sources.list.invalidate();
        },
    });

    // 2. Early returns
    if (sourceLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="text-accent size-8 animate-spin" />
            </div>
        );
    }

    if (!source) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <AlertCircle className="text-error size-12" />
                <p className="text-text-muted text-lg">Source not found</p>
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
            <header className="border-border flex items-center gap-3 border-b p-4">
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
                    <Trash2 className="text-error size-4" />
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
