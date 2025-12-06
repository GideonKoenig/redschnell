import { z } from "zod";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
    type TranscriptionModel,
} from "~/lib/transcription-models";

export const settingsSchema = z.object({
    autoTranscribe: z.boolean().optional(),
    transcriptionModel: transcriptionModelSchema.optional(),
    showTimestamps: z.boolean().optional(),
    showSpeakers: z.boolean().optional(),
    removeFillwords: z.boolean().optional(),
});

export type Settings = {
    role: string;
    autoTranscribe: boolean;
    transcriptionModel: TranscriptionModel;
    showTimestamps: boolean;
    showSpeakers: boolean;
    removeFillwords: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
    role: "free",
    autoTranscribe: false,
    transcriptionModel: DEFAULT_MODEL,
    showTimestamps: true,
    showSpeakers: true,
    removeFillwords: false,
};
