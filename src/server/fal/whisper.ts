import { fal } from "@fal-ai/client";
import { env } from "~/env";
import {
    TRANSCRIPTION_MODELS,
    type TranscriptionModel,
} from "~/lib/transcription-models";
import { tryCatch } from "~/lib/try-catch";

if (env.FAL_KEY) {
    fal.config({ credentials: env.FAL_KEY });
}

export async function transcribeAudio(
    audioUrl: string,
    model: TranscriptionModel,
) {
    const modelConfig = TRANSCRIPTION_MODELS[model];

    const result = await tryCatch(
        fal.subscribe(model, {
            input: {
                audio_url: audioUrl,
                task: "transcribe",
                chunk_level: "segment",
                diarize: modelConfig.supportsDiarization,
            },
        }),
    );

    if (!result.success) return result;
    return { ...result, data: result.data.data };
}
