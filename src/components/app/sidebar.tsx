"use client";

import { Loader2, Plus, Settings } from "lucide-react";
import { ModelPicker } from "~/components/app/model-picker";
import { useUploadProgress } from "~/components/providers/upload-progress-provider";
import { SourceCard } from "~/components/source/source-card";
import { UploadItemCard } from "~/components/source/upload-item-card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { type TranscriptionModel } from "~/lib/transcription-models";
import { api } from "~/trpc/react";

export function Sidebar(props: {
    onUploadClick: () => void;
    onCancelUpload: (id: string) => void;
}) {
    const { uploads } = useUploadProgress();
    const { data: sources, isLoading } = api.sources.list.useQuery(undefined, {
        refetchInterval: (query) => {
            const hasIncomplete = query.state.data?.some(
                (s) =>
                    !s.transcript ||
                    s.transcript.status === "pending" ||
                    s.transcript.status === "processing",
            );
            return hasIncomplete ? 3000 : false;
        },
    });

    const utils = api.useUtils();

    const { data: settings } = api.settings.get.useQuery();
    const updateSettings = api.settings.update.useMutation({
        onMutate: async (newSettings) => {
            await utils.settings.get.cancel();
            const previous = utils.settings.get.getData();
            utils.settings.get.setData(undefined, (old) => ({
                ...old!,
                ...newSettings,
            }));
            return { previous };
        },
        onError: (_err, _newSettings, context) => {
            if (context?.previous) {
                utils.settings.get.setData(undefined, context.previous);
            }
        },
        onSettled: () => {
            utils.settings.get.invalidate();
        },
    });

    const uploadList = Object.values(uploads);
    const isEmpty = !isLoading && !sources?.length && uploadList.length === 0;

    const update = updateSettings.mutate;

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
                    {uploadList.map((upload) => (
                        <UploadItemCard
                            key={upload.id}
                            upload={upload}
                            onDismiss={() => props.onCancelUpload(upload.id)}
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

            {settings && (
                <div className="border-border flex flex-col gap-2 border-t px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Settings className="text-text-muted size-4" />
                        <span className="text-text-muted text-sm font-medium">
                            Settings
                        </span>
                        {updateSettings.isPending && (
                            <Loader2 className="text-text-muted ml-auto size-3.5 animate-spin" />
                        )}
                    </div>
                    <SettingRow label="Auto transcribe">
                        <Switch
                            checked={settings.autoTranscribe}
                            onCheckedChange={(v) =>
                                update({ autoTranscribe: v })
                            }
                        />
                    </SettingRow>
                    <SettingRow label="Show timestamps">
                        <Switch
                            checked={settings.showTimestamps}
                            onCheckedChange={(v) =>
                                update({ showTimestamps: v })
                            }
                        />
                    </SettingRow>
                    <SettingRow label="Show speakers">
                        <Switch
                            checked={settings.showSpeakers}
                            onCheckedChange={(v) => update({ showSpeakers: v })}
                        />
                    </SettingRow>
                    <SettingRow label="Model">
                        <ModelPicker
                            value={settings.transcriptionModel}
                            onChange={(v) => update({ transcriptionModel: v })}
                        />
                    </SettingRow>
                </div>
            )}
        </aside>
    );
}

function SettingRow(props: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between pl-6">
            <span className="text-text-muted text-sm">{props.label}</span>
            {props.children}
        </div>
    );
}
