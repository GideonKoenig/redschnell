"use client";

import { Loader2, Plus } from "lucide-react";
import { useUploadProgress } from "~/components/providers/upload-progress-provider";
import {
    CompletedUploadCard,
    SourceCard,
    UploadItemCard,
} from "~/components/source";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/react";

export function Sidebar(props: { onUploadClick: () => void }) {
    const { getActiveUploads, getCompletedUploads, dismissUpload } =
        useUploadProgress();
    const { data: sources, isLoading } = api.sources.list.useQuery();

    const activeUploads = getActiveUploads();
    const completedUploads = getCompletedUploads();
    const isEmpty =
        !isLoading &&
        !sources?.length &&
        activeUploads.length === 0 &&
        completedUploads.length === 0;

    return (
        <aside className="bg-bg-surface border-border flex h-full flex-col rounded-lg border shadow-sm">
            <div className="border-border flex items-center justify-between border-b p-3">
                <h1 className="text-text text-lg font-semibold">Sources</h1>
                <Button
                    size="sm"
                    variant="accent"
                    onClick={props.onUploadClick}
                >
                    <Plus className="size-4" />
                    Upload
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {activeUploads.map((upload) => (
                        <UploadItemCard
                            key={upload.id}
                            upload={upload}
                            onDismiss={() => dismissUpload(upload.id)}
                        />
                    ))}

                    {completedUploads.map((upload) => (
                        <CompletedUploadCard
                            key={upload.id}
                            upload={upload}
                            onDismiss={() => dismissUpload(upload.id)}
                        />
                    ))}

                    {sources?.map((source) => (
                        <SourceCard key={source.id} source={source} />
                    ))}

                    {isLoading && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="text-text-muted size-5 animate-spin" />
                        </div>
                    )}

                    {isEmpty && (
                        <p className="text-text-muted px-2 py-4 text-center text-sm">
                            No sources yet. Upload a file to get started.
                        </p>
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
}
