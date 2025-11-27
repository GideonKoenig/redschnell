"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import {
    TRANSCRIPTION_MODELS,
    type TranscriptionModel,
} from "~/lib/transcription-models";
import { PRICE_PER_AUDIO_MINUTE } from "~/lib/transcription/pricing";

export function ModelPicker(props: {
    value: TranscriptionModel;
    onChange: (value: TranscriptionModel) => void;
}) {
    return (
        <Select
            value={props.value}
            onValueChange={(v) => props.onChange(v as TranscriptionModel)}
        >
            <SelectTrigger size="sm" className="w-36">
                <SelectValue>
                    {TRANSCRIPTION_MODELS[props.value].label}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {(
                    Object.entries(TRANSCRIPTION_MODELS) as [
                        TranscriptionModel,
                        (typeof TRANSCRIPTION_MODELS)[TranscriptionModel],
                    ][]
                ).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <span>{config.label}</span>
                                <span className="text-text-muted text-xs">
                                    $
                                    {(PRICE_PER_AUDIO_MINUTE[key] * 60).toFixed(
                                        2,
                                    )}
                                    /hr
                                </span>
                            </div>
                            <span className="text-text-muted text-xs">
                                {config.description}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
