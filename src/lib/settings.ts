import { z } from "zod";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
} from "~/lib/transcription-models";

export const settingsSchema = z.object({
    autoTranscribe: z.boolean().optional(),
    transcriptionModel: transcriptionModelSchema.optional(),
    showTimestamps: z.boolean().optional(),
    showSpeakers: z.boolean().optional(),
});

export const DEFAULT_SETTINGS = {
    role: "free",
    autoTranscribe: false,
    transcriptionModel: DEFAULT_MODEL,
    showTimestamps: true,
    showSpeakers: true,
} as const;
