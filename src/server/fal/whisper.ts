import { fal } from "@fal-ai/client";
import { env } from "~/env";
import { tryCatch } from "~/lib/try-catch";

if (env.FAL_KEY) {
    fal.config({ credentials: env.FAL_KEY });
}

export async function transcribeAudio(audioUrl: string) {
    const result = await tryCatch(
        fal.subscribe("fal-ai/whisper", {
            input: {
                audio_url: audioUrl,
                task: "transcribe",
                chunk_level: "segment",
            },
        }),
    );

    if (!result.success) return result;
    return { ...result, data: result.data.data };
}
