"use client";

import { Loader2, Plus, Settings } from "lucide-react";
import { AccountBar } from "~/components/app/account-bar";
import { ModelPicker } from "~/components/app/model-picker";
import { useUploadProgress } from "~/components/providers/upload-progress-provider";
import { SourceCard } from "~/components/source/source-card";
import { UploadItemCard } from "~/components/source/upload-item-card";
import { Button } from "~/components/ui/button";
import { InfoTooltip } from "~/components/ui/info-tooltip";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { type User } from "~/lib/auth-server";
import { api } from "~/trpc/react";

export function Sidebar(props: {
    user: User;
    surrogate: boolean;
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
            void utils.settings.get.invalidate();
        },
    });

    const uploadList = Object.values(uploads);
    const isEmpty = !isLoading && !sources?.length && uploadList.length === 0;

    const update = updateSettings.mutate;

    return (
        <aside className="flex h-full w-full min-w-0 flex-col rounded-lg border border-border bg-bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-3">
                <h1 className="text-lg font-semibold text-text">Sources</h1>
                <Button
                    size="sm"
                    variant="accent"
                    onClick={props.onUploadClick}
                >
                    <Plus className="size-4" />
                    Upload
                </Button>
            </div>

            <ScrollArea className="min-w-0 grow">
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
                            <Loader2 className="size-5 animate-spin text-text-muted" />
                        </div>
                    )}

                    {isEmpty && (
                        <p className="px-2 py-4 text-center text-sm text-text-muted">
                            No sources yet. Upload a file to get started.
                        </p>
                    )}
                </div>
            </ScrollArea>

            {settings && (
                <div className="flex flex-col gap-2 border-t border-border px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Settings className="size-4 text-text-muted" />
                        <span className="text-sm font-medium text-text-muted">
                            Settings
                        </span>
                        {updateSettings.isPending && (
                            <Loader2 className="ml-auto size-3.5 animate-spin text-text-muted" />
                        )}
                    </div>
                    <SettingRow
                        label="Auto transcribe"
                        description="Automatically start transcription when a file is uploaded"
                    >
                        <Switch
                            checked={settings.autoTranscribe}
                            onCheckedChange={(v) =>
                                update({ autoTranscribe: v })
                            }
                        />
                    </SettingRow>
                    <SettingRow
                        label="Show timestamps"
                        description="Display timestamps for each segment in the transcript"
                    >
                        <Switch
                            checked={settings.showTimestamps}
                            onCheckedChange={(v) =>
                                update({ showTimestamps: v })
                            }
                        />
                    </SettingRow>
                    <SettingRow
                        label="Show speakers"
                        description="Display speaker labels when speaker detection is available"
                    >
                        <Switch
                            checked={settings.showSpeakers}
                            onCheckedChange={(v) => update({ showSpeakers: v })}
                        />
                    </SettingRow>
                    <SettingRow
                        label="Remove fillwords"
                        description="Remove filler words like 'um', 'uh' from transcripts (Deepgram only)"
                    >
                        <Switch
                            checked={settings.removeFillwords}
                            onCheckedChange={(v) =>
                                update({ removeFillwords: v })
                            }
                        />
                    </SettingRow>
                    <SettingRow
                        label="Model"
                        description="The AI model used for speech-to-text transcription"
                    >
                        <ModelPicker
                            value={settings.transcriptionModel}
                            onChange={(v) => update({ transcriptionModel: v })}
                        />
                    </SettingRow>
                </div>
            )}

            <AccountBar user={props.user} surrogate={props.surrogate} />
        </aside>
    );
}

function SettingRow(props: {
    label: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between pl-6">
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
                {props.label}
                <InfoTooltip content={props.description} />
            </span>
            {props.children}
        </div>
    );
}
