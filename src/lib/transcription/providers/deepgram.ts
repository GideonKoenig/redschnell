import { DeepgramClient } from "@deepgram/sdk";
import { env } from "~/env";
import { TRANSCRIPTION_MODELS } from "~/lib/transcription-models";
import { Failure, Success, TryCatchError, tryCatch } from "~/lib/try-catch";
import { calculatePrice } from "~/lib/transcription/pricing";
import {
    type TranscribeFunction,
    type TranscriptionChunk,
} from "~/lib/transcription/types";

const client = new DeepgramClient({
    apiKey: env.DEEPGRAM_KEY,
    // Long recordings need more than the SDK's 60-second default.
    timeoutInSeconds: 600,
});

export const transcribeDeepgram: TranscribeFunction = async (
    audioUrl,
    settings,
    supportsDiarization,
    _durationSeconds,
) => {
    const modelId = TRANSCRIPTION_MODELS[settings.transcriptionModel].modelId;

    const result = await tryCatch(
        client.listen.v1.media.transcribeUrl({
            url: audioUrl,
            model: modelId,
            language: "multi",
            smart_format: true,
            diarize: supportsDiarization,
            punctuate: true,
            utterances: true,
            filler_words: !settings.removeFillwords,
        }),
    );

    if (!result.success) return result;

    const response = result.data;
    // Requests with a callback URL return an acknowledgement without results.
    if (!("results" in response)) {
        return new Failure(
            new TryCatchError(
                "Transcription Error",
                "No result returned from Deepgram",
            ),
        );
    }

    // The SDK types mark results and channels as required. Malformed responses still need to return a Failure.
    const alternative = response.results?.channels?.[0]?.alternatives?.[0];
    if (alternative?.transcript === undefined) {
        return new Failure(
            new TryCatchError(
                "Transcription Error",
                "No transcription alternatives found",
            ),
        );
    }

    const chunks: TranscriptionChunk[] = [];

    if (response.results.utterances) {
        for (const utterance of response.results.utterances) {
            const { start, end, transcript } = utterance;
            if (start === undefined || end === undefined || !transcript)
                continue;
            chunks.push({
                start,
                end,
                text: transcript.trim(),
                speaker:
                    utterance.speaker !== undefined
                        ? `Speaker ${utterance.speaker}`
                        : null,
            });
        }
    } else if (alternative.words) {
        let currentChunk: TranscriptionChunk | null = null;

        for (const word of alternative.words) {
            // The SDK types omit punctuated_word, but Deepgram returns it with punctuate enabled.
            const text =
                "punctuated_word" in word &&
                typeof word.punctuated_word === "string"
                    ? word.punctuated_word
                    : word.word;
            if (word.start === undefined || word.end === undefined || !text)
                continue;
            const speaker =
                word.speaker !== undefined ? `Speaker ${word.speaker}` : null;

            if (currentChunk) {
                if (currentChunk.speaker === speaker) {
                    currentChunk.end = word.end;
                    currentChunk.text += " " + text;
                    continue;
                }
                chunks.push(currentChunk);
            }
            currentChunk = { start: word.start, end: word.end, text, speaker };
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }
    }

    const durationSeconds = response.metadata.duration;
    const priceUsd = calculatePrice(
        durationSeconds,
        settings.transcriptionModel,
    );

    return new Success({
        text: alternative.transcript,
        chunks,
        metadata: { priceUsd },
    });
};
